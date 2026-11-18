/* ===================================================================
   VAIGA events. Add real events here – they appear automatically on
   Home, Upcoming Events and get their own page (event.html?e=<id>).
   Past events disappear from the lists by themselves.

   Format (copy, fill in, remove the // ):
   // {
   //   id: "summer-latin-night-2027",        // unique, lowercase, letters/numbers/hyphens (used in the link)
   //   title: "Event name",
   //   category: "latin",                     // id from categories.js
   //   date: "2027-07-10",                    // YYYY-MM-DD
   //   start: "21:00", end: "03:00",          // optional
   //   venue: "Venue name", address: "Street 1", city: "City", country: "Portugal",
   //   price: "",                             // text as published by the organiser, e.g. "€15 / €20 at the door"
   //   ticketUrl: "https://...",              // ticket shop link (leave "" if not on sale yet)
   //   image: "assets/img/events/summer-latin-night.jpg",  // poster/photo, ideally 1200x900 or larger
   //   gallery: [],                           // optional extra photos
   //   description: "Text about the event.\nNew line = new paragraph.",
   //   lineup: ["DJ ...", "Live band ..."],   // optional
   //   status: "on-sale"                      // "on-sale" | "coming-soon" | "sold-out" | "cancelled"
   // }

   No invented events: this list stays empty until real events are confirmed.
   =================================================================== */
window.VAIGA_EVENTS = [
];

/* Preview only (open any page with ?preview=1): clearly marked placeholder events that show the layout.
   They are NEVER shown in the normal site. */
window.VAIGA_PREVIEW_EVENTS = [
  { id: "preview-1", title: "[Event name]", category: "latin", date: "", start: "[start]", end: "[end]", venue: "[Venue]", city: "[City]", country: "[Country]", price: "[Price]", ticketUrl: "", image: "", description: "[Event description – placeholder text. Real information follows.]", status: "coming-soon", placeholder: true },
  { id: "preview-2", title: "[Event name]", category: "retro", date: "", venue: "[Venue]", city: "[City]", country: "[Country]", price: "[Price]", ticketUrl: "", image: "", description: "[Event description – placeholder text.]", status: "coming-soon", placeholder: true },
  { id: "preview-3", title: "[Event name]", category: "forty-plus", date: "", venue: "[Venue]", city: "[City]", country: "[Country]", price: "[Price]", ticketUrl: "", image: "", description: "[Event description – placeholder text.]", status: "coming-soon", placeholder: true }
];
