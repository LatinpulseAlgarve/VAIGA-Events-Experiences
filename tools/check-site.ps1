# VAIGA site check (local, nothing is published).
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools\check-site.ps1
# Checks: internal links and files exist, every page has lang/title/description/canonical/one h1, images have alt,
# and every page runs without JavaScript errors in headless Chrome (also in ?preview=1 mode).
# Exit code 0 = ALL OK. Keep this file ASCII-only.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$fail = @()
$pages = Get-ChildItem $root -Filter *.html | Sort-Object Name

# 1. static checks
foreach ($p in $pages) {
    $h = [IO.File]::ReadAllText($p.FullName)
    if ($h -notmatch '<html lang="[a-z]{2}">') { $fail += "$($p.Name): no lang" }
    if ($h -notmatch '<title>[^<]{5,}</title>') { $fail += "$($p.Name): no title" }
    if ($h -notmatch '<meta name="description" content="[^"]{20,}">') { $fail += "$($p.Name): no description" }
    if ($h -notmatch '<link rel="canonical" href="https://vaiga\.eu/') { $fail += "$($p.Name): no canonical" }
    $h1 = ([regex]::Matches($h, '<h1[\s>]')).Count
    if ($h1 -ne 1) { $fail += "$($p.Name): $h1 h1 headings (expected 1)" }
    foreach ($m in [regex]::Matches($h, '<img\b[^>]*>')) { if ($m.Value -notmatch '\balt="') { $fail += "$($p.Name): image without alt: $($m.Value)" } }
    foreach ($m in [regex]::Matches($h, '(?:href|src)="([^"]+)"')) {
        $u = $m.Groups[1].Value
        if ($u -match '^(https?:|mailto:|tel:|#|javascript:|data:)') { continue }
        $f = ($u -split '[?#]')[0]
        if (-not $f) { continue }
        $f = $f.TrimStart('/')
        if (-not (Test-Path (Join-Path $root $f))) { $fail += "$($p.Name): broken link/file '$u'" }
    }
}
foreach ($f in 'CNAME', 'robots.txt', 'sitemap.xml', 'site.webmanifest', '.nojekyll', 'assets/img/og-image.jpg') { if (-not (Test-Path (Join-Path $root $f))) { $fail += "missing $f" } }
if ((Get-Content (Join-Path $root 'CNAME') -Raw).Trim() -ne 'vaiga.eu') { $fail += 'CNAME is not vaiga.eu' }
Write-Host "Static checks done for $($pages.Count) pages."

# 2. runtime checks in headless Chrome (JavaScript errors, rendered content)
$chrome = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe") | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if (-not $chrome) { Write-Host 'Chrome not found: runtime checks skipped.' }
else {
    $tmp = Join-Path ([IO.Path]::GetTempPath()) ('vaiga-check-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory $tmp | Out-Null
    $trap = '<script>window.__err=[];window.addEventListener("error",function(e){__err.push((e.message||"error")+" @ "+(e.filename||"").split("/").pop()+":"+e.lineno)});</script>'
    $report = '<script>setTimeout(function(){var q=function(s){return document.querySelectorAll(s).length};document.title="RES|err="+__err.join(" ; ")+"|cats="+q("[data-categories] > *")+"|events="+q("[data-events] .event")+"|empty="+q("[data-events] .empty")+"|social="+q("footer [data-social] > *")+"|detail="+q("[data-event-detail] .facts")},2500)</script>'
    try {
        foreach ($p in $pages) {
            foreach ($mode in '', '?preview=1') {
                if ($p.Name -eq '404.html' -and $mode) { continue }
                $h = [IO.File]::ReadAllText($p.FullName)
                $h = $h.Replace('<head>', '<head>' + $trap).Replace('</body>', $report + '</body>')
                if ($p.Name -eq '404.html') { $h = $h -replace '(href|src)="/', ('$1="' + ([Uri]($root + '\')).AbsoluteUri) }
                $copy = Join-Path $root ('__check_' + $p.Name)
                [IO.File]::WriteAllText($copy, $h, (New-Object Text.UTF8Encoding($false)))
                $url = ([Uri]$copy).AbsoluteUri + $mode
                if ($p.Name -eq 'event.html') { $url = ([Uri]$copy).AbsoluteUri + $(if ($mode) { '?e=preview-1&preview=1' } else { '?e=does-not-exist' }) }
                $dom = & $chrome --headless=new --disable-gpu --allow-file-access-from-files "--user-data-dir=$tmp\p" --window-size=1280,900 --virtual-time-budget=6000 --dump-dom $url 2>$null | Out-String
                Remove-Item $copy -Force
                $res = [regex]::Match($dom, '<title>RES\|([^<]*)</title>').Groups[1].Value
                if (-not $res) { $fail += "$($p.Name)$mode`: page did not finish rendering"; continue }
                $kv = @{}; foreach ($x in $res.Split('|')) { $k, $v = $x.Split('=', 2); $kv[$k] = $v }
                if ($kv.err) { $fail += "$($p.Name)$mode`: JavaScript error: $($kv.err)" }
                if ([int]$kv.social -lt 1) { $fail += "$($p.Name)$mode`: footer social not rendered" }
                if ($p.Name -in 'index.html', 'categories.html' -and [int]$kv.cats -lt 7) { $fail += "$($p.Name)$mode`: concepts not rendered ($($kv.cats))" }
                if ($p.Name -in 'index.html', 'events.html' -and [int]$kv.events + [int]$kv.empty -lt 1) { $fail += "$($p.Name)$mode`: events list not rendered" }
                if ($p.Name -eq 'event.html' -and $mode -and [int]$kv.detail -lt 1) { $fail += 'event.html?preview: detail not rendered' }
                Write-Host ("  {0,-16} {1,-11} {2}" -f $p.Name, $(if ($mode) { 'preview' } else { 'normal' }), $res)
            }
        }
    } finally { Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue; Get-ChildItem $root -Filter '__check_*' | Remove-Item -Force }
}

if ($fail.Count) { $fail | ForEach-Object { Write-Host "PROBLEM: $_" }; exit 1 }
Write-Host 'ALL OK: links, files, SEO basics, images and JavaScript.'
exit 0
