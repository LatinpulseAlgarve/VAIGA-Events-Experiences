/* ===================================================================
   VAIGA event concepts / categories.
   Add a new concept = add one object. "id" is used in links (events.html?cat=<id>) and in events (category: "<id>").
   =================================================================== */
window.VAIGA_CATEGORIES = [
  {
    id: "latin",
    name: "Latin Parties",
    styles: ["Salsa", "Bachata", "Merengue", "Reggaeton"],
    short: "Meet people, dance together and enjoy the warm Latin vibe – with salsa, bachata, merengue and reggaeton.",
    long: "Latin events and experiences for everyone who loves meeting people, good company and the warmth of Latin culture – with music, dance, food and more. A collaboration between Latinpulse Algarve and Tropicaliente.",
    concept: "latinpulse",
    // concept photo (collaboration artwork Tropicaliente × Latinpulse Algarve)
    image: "assets/img/latin-parties.jpg",
    imageAlt: "Tropicaliente in collaboration with Latinpulse Algarve – music, dance, events, community",
    // collaboration partners: name with its link underneath (links in config.js)
    collab: [
      { name: "Latinpulse Algarve", urlKey: "latinpulseUrl" },
      { name: "Tropicaliente", urlKey: "tropicalienteUrl" }
    ],
    bg: "linear-gradient(140deg,#FF5A36 0%,#E5338C 70%)",
    icon: "M12 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-1 5h2l3 4-1.6 1.2L13 11v3l3 6-1.8.9L11.5 15 9 20.9 7.2 20 10 14v-3l-1.4 2.2L7 12l4-4Z"
  },
  {
    id: "retro",
    name: "Disco & Retro",
    styles: ["70s", "80s", "90s", "00s"],
    short: "Meet up, catch up and celebrate together – with glitter, nostalgia and the greatest hits of the 70s, 80s, 90s and 00s.",
    long: "A night out with friends and new faces, full of nostalgia and good vibes. Everyone sings along to the disco classics and pop anthems of the 70s, 80s, 90s and 00s, with the look and feel of each decade.",
    // concept photo (disco ball, 70s/80s/90s/00s outfits)
    image: "assets/img/disco-retro.jpg",
    imageAlt: "Dancing in 70s, 80s, 90s and 00s outfits under a disco ball",
    bg: "linear-gradient(140deg,#7B4DFF 0%,#E5338C 100%)",
    icon: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 0 0-7.7 6h15.4A8 8 0 0 0 12 4Zm-8 8a8 8 0 0 0 .3 2h15.4a8 8 0 0 0 0-4H4.3A8 8 0 0 0 4 12Zm.9 4a8 8 0 0 0 14.2 0Z"
  },
  {
    id: "forty-plus",
    name: "40+ Parties",
    styles: ["40+", "Classics", "Dance"],
    short: "Relaxed, sociable party nights for the 40+ crowd – good company, a great atmosphere and music to dance to.",
    long: "Party nights made for the 40+ crowd: an easy place to meet new people, a relaxed and friendly atmosphere and music to dance to – without the late-night student crowd.",
    // concept photo (40+ Party – Dance · Meet · Enjoy)
    image: "assets/img/forty-plus.jpg",
    imageAlt: "40+ Party – dance, meet, enjoy: people in their forties and fifties dancing and celebrating",
    bg: "linear-gradient(140deg,#E5338C 0%,#FFB21E 100%)",
    icon: "M5 4h3v7h3V8h3v3h2v3h-2v6h-3v-6H5V4Zm13 3h3v3h3v3h-3v3h-3v-3h-3v-3h3V7Z"
  },
  {
    id: "themed",
    name: "Themed Parties",
    styles: ["Dress code", "Concepts", "Decor"],
    short: "Parties with a theme, a dress code and a story – a sociable night out to share together.",
    long: "Themed parties where people, decor, dress code and atmosphere tell one story. A different experience every time – and an easy way to meet new people.",
    // concept photo (festive Christmas dinner party outdoors)
    image: "assets/img/themed-parties.jpg",
    imageAlt: "Friends toasting at a festive candlelit Christmas table under fairy lights",
    bg: "linear-gradient(140deg,#FFB21E 0%,#FF5A36 100%)",
    icon: "M4 8c3-4 13-4 16 0l-2 3c-1-1-3-1.5-6-1.5S7 10 6 11L4 8Zm3 5h10l-1 7H8l-1-7Z"
  },
  {
    id: "special",
    name: "Special Events",
    styles: ["New Year", "Seasonal", "One-off"],
    short: "One-off celebrations and special dates to share with friends and new people.",
    long: "Special events for special moments: seasonal celebrations, unique locations and one-off nights to celebrate together.",
    // concept photo (grape-stomping harvest party at a vineyard at sunset)
    image: "assets/img/special-events.jpg",
    imageAlt: "Grape-stomping harvest party at a vineyard at sunset: couples dancing in wooden barrels with wine, cheese and fairy lights",
    bg: "linear-gradient(140deg,#FF5A36 0%,#7B4DFF 100%)",
    icon: "M12 2l2.9 6.6L22 9.3l-5.4 4.8L18.2 21 12 17.3 5.8 21l1.6-6.9L2 9.3l7.1-.7L12 2Z"
  },
  {
    id: "live",
    name: "Live Music & Entertainment",
    styles: ["Bands", "Artists", "Shows"],
    short: "Live bands and artists in a sociable setting – meet up, enjoy the atmosphere and celebrate together.",
    long: "Live music and entertainment as the backdrop for a great night out together: bands, singers, DJs and performers, with plenty of room to meet people and enjoy the atmosphere.",
    // concept photo (Latin Wave – Live Music & Animation: singer with a red fan on stage)
    image: "assets/img/live-music.jpg",
    imageAlt: "Latin Wave live music: a singer with a microphone and a red fan on a stage with purple lights",
    bg: "linear-gradient(140deg,#E5338C 0%,#12C2B4 100%)",
    icon: "M12 2a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Zm-7 9h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.9V21h3v2H8v-2h3v-3.1A7 7 0 0 1 5 11Z"
  }
];
