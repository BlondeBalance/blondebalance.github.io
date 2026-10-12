// ============================================================
// Blonde Balance - public site logic
// Loads content from Supabase when js/config.js is filled in.
// Otherwise uses the built-in starter content below (SEED),
// which is Tanya's real content from her approved prototype,
// so the site always renders fully.
// ============================================================

// ---------- Starter content (fallback / seed) ----------
const SEED = {
  settings: {
    bookingBadge: "NOW BOOKING Q4 2026",
    calendlyUrl: "https://calendly.com/blondebalance/30min",
    contactEmail: "Tanya@blondebalance.com",
    heroEyebrow: "UGC CREATOR + PAID ADS SPECIALIST \u2022 SCOTTSDALE, AZ",
    heroHeadlineInk: "Ads made to make your brand",
    heroHeadlineRose: "impossible to scroll past.",
    heroSubhead: "UGC that feels like a friend's recommendation and performs like paid media.",
    heroImageUrl: "",
    aboutEyebrow: "HI, I'M TANYA",
    aboutHeadline: "UGC Creator + Paid Ads Strategist",
    aboutBio: "I'm Tanya \u2014 the creator behind Blonde Balance. I make UGC that feels like a friend's recommendation and performs like paid media, from my home in Scottsdale, Arizona. Brands come to me for content that looks native in the feed and holds up in the ad account: hook-led, honest, and filmed like real life because it is.",
    aboutBullets: ["50+ brand partners across beauty, home, wellness and tech", "500+ ad creatives produced for paid and organic", "Talking-to-camera, voiceover, lifestyle and b-roll formats", "48-hour average turnaround", "Dog mom to Beowulf, my Pomsky \u2014 pet content available"],
    aboutImageUrl: "",
    ctaHeadlineInk: "Ready to create content that",
    ctaHeadlineRose: "converts?",
    ctaSubhead: "Limited spots each month. Brands that move fast get the best content.",
    marqueeBrands: ["KITSCH", "KWIKSET", "FANATICS", "AZAZIE", "UQORA", "HOTWORX", "FURLIFE", "RYZE", "AAA", "GOODAL"],
    stats: [
      { value: "$500K+", label: "AD SPEND MANAGED" },
      { value: "2.85x", label: "TOP ROAS" },
      { value: "51%", label: "TOP HOOK RATE" },
      { value: "9.78%", label: "TOP CTR" }
    ],
    adResults: [
      { value: "$500K+", title: "Campaign scale", sub: "50+ brands, 500+ creatives produced" },
      { value: "2.85x", title: "Top performer", sub: "Top ROAS across paid campaigns" },
      { value: "$52K+", title: "E-commerce profit", sub: "Revenue driven from UGC creative" },
      { value: "$20K+", title: "Organic week", sub: "Best single organic revenue week" },
      { value: "51%", title: "Hook rate", sub: "vs 25\u201330% industry average" },
      { value: "48hr", title: "Turnaround", sub: "Average delivery, brief to final" }
    ],
    caseStudies: [
      { label: "CASE STUDY 01 \u2022 HOME", title: "Kwikset smart lock",
        who: "Homeowners and lifestyle shoppers 28\u201345 \u2014 they buy based on trust from real people in real homes.",
        what: "Home-setting unboxing, problem-solution format.",
        why: "My warm home aesthetic makes viewers think \u201CI could see that in my space.\u201D",
        payoff: "2.4x CTR lift vs brand baseline.", pills: ["2.4x CTR lift", "48hr turnaround"] },
      { label: "CASE STUDY 02 \u2022 BEAUTY", title: "Clean beauty routine",
        who: "Women 25\u201345 into clean beauty \u2014 a trust-driven audience.",
        what: "Hook-led talking-to-camera, before/after, comment reply. Multiple hook variations per deliverable.",
        why: "Beauty audiences want real women using real products \u2014 not packaging shots that get scrolled past.",
        payoff: "High hook and completion rates on emotional openers.", pills: ["51% top hook rate", "9.78% top CTR"] }
    ],
    processSteps: [
      { title: "Get familiar", text: "We align on your content goals and strategy." },
      { title: "Brainstorm", text: "Concepts drafted from your brief or my expertise." },
      { title: "Filming", text: "Content filmed and sent for approval, 3\u201310 biz days." },
      { title: "Launch", text: "One revision round included. Let's plan the next one." }
    ]
  },
  videos: [
    { brand: "kitsch",         category: "beauty",   format_tag: "TALKING HEAD", video_url: "", thumb_url: "assets/frames/beauty-1.jpg",   sort_order: 0,  visible: true },
    { brand: "Era Tua",        category: "beauty",   format_tag: "LIFESTYLE",    video_url: "", thumb_url: "assets/frames/beauty-2.jpg",   sort_order: 1,  visible: true },
    { brand: "Kayura",         category: "beauty",   format_tag: "DEMO",         video_url: "", thumb_url: "assets/frames/beauty-3.jpg",   sort_order: 2,  visible: true },
    { brand: "Azazie",         category: "beauty",   format_tag: "TRY-ON",       video_url: "", thumb_url: "assets/frames/beauty-4.jpg",   sort_order: 3,  visible: true },
    { brand: "Mott & Bow",     category: "beauty",   format_tag: "FASHION",      video_url: "", thumb_url: "assets/frames/beauty-5.jpg",   sort_order: 4,  visible: true },
    { brand: "Uqora",          category: "wellness", format_tag: "TALKING HEAD", video_url: "", thumb_url: "assets/frames/wellness-1.jpg", sort_order: 5,  visible: true },
    { brand: "FS8",            category: "wellness", format_tag: "LIFESTYLE",    video_url: "", thumb_url: "assets/frames/wellness-2.jpg", sort_order: 6,  visible: true },
    { brand: "HotWorx",        category: "wellness", format_tag: "LIFESTYLE",    video_url: "", thumb_url: "assets/frames/wellness-3.jpg", sort_order: 7,  visible: true },
    { brand: "Kwikset",        category: "wellness", format_tag: "DEMO",         video_url: "", thumb_url: "assets/frames/wellness-4.jpg", sort_order: 8,  visible: true },
    { brand: "FurLife",        category: "wellness", format_tag: "PET LIFESTYLE", video_url: "", thumb_url: "assets/frames/wellness-5.jpg", sort_order: 9,  visible: true },
    { brand: "Fetch Rewards",  category: "paid",     format_tag: "APP DEMO",     video_url: "", thumb_url: "assets/frames/paid-1.jpg",     sort_order: 10, visible: true },
    { brand: "Kwikset",        category: "paid",     format_tag: "APP DEMO",     video_url: "", thumb_url: "assets/frames/paid-2.jpg",     sort_order: 11, visible: true },
    { brand: "Quickie",        category: "paid",     format_tag: "POV",          video_url: "", thumb_url: "assets/frames/paid-3.jpg",     sort_order: 12, visible: true },
    { brand: "Fanatics",       category: "paid",     format_tag: "AD CREATIVE",  video_url: "", thumb_url: "assets/frames/paid-4.jpg",     sort_order: 13, visible: true },
    { brand: "Strava",         category: "paid",     format_tag: "AD CREATIVE",  video_url: "", thumb_url: "assets/frames/paid-5.jpg",     sort_order: 14, visible: true }
  ],
  testimonials: [
    { brand: "Kwikset",            attribution: "Home Security",    quote: "Always love your content, thank you so much!", sort_order: 0 },
    { brand: "FurLife",            attribution: "Pet Lifestyle",    quote: "Fast turnaround! This is great!", sort_order: 1 },
    { brand: "Vitamin Wholesalers", attribution: "Supplements",     quote: "Submitted awesome work and we will be working with them again in the future!", sort_order: 2 },
    { brand: "Forge Skin",         attribution: "Skincare",       quote: "Great, will return again.", sort_order: 3 },
    { brand: "Viita Supply",       attribution: "Lifestyle & Home", quote: "Tanya had tight turnaround, clear communication, and performed immediately in ads!", sort_order: 4 }
  ],
  packages: [
    { number_label: "01", title: "UGC VIDEO PACKAGE", description: "Organic-style UGC videos for your own channels and product pages. Talking-to-camera, voiceover, lifestyle or b-roll, delivered ready to post.", featured: false, sort_order: 0 },
    { number_label: "02", title: "PAID ADS PACKAGE", description: "Ad-first creative built to run paid: hook variations, direct-response structure, and formats proven in the ad account, not just the feed.", featured: true, sort_order: 1 },
    { number_label: "03", title: "MONTHLY RETAINER", description: "A steady monthly flow of fresh creative so your ads never go stale. Priority filming slots and the fastest turnaround I offer.", featured: false, sort_order: 2 }
  ]
};

// Captions for the proof row: Tanya's real headline results, in order.
const PROOF_METRICS = ["$500K+ campaign scale", "2.85x top ROAS", "51% top hook rate", "9.78% top CTR", "$52K+ e-commerce profit"];

// ---------- Helpers ----------
function parseMaybeJSON(v, fallback) {
  if (v == null) return fallback;
  if (typeof v !== "string") return v;
  try { const p = JSON.parse(v); return p == null ? fallback : p; } catch (e) { return v || fallback; }
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// ---------- Load data (Supabase if configured, else SEED) ----------
async function loadData() {
  if (typeof SUPABASE_URL !== "undefined" && SUPABASE_URL && typeof SUPABASE_ANON_KEY !== "undefined" && SUPABASE_ANON_KEY && window.supabase) {
    try {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const [s, v, t, p] = await Promise.all([
        client.from("site_settings").select("key,value"),
        client.from("videos").select("*").eq("visible", true).order("sort_order"),
        client.from("testimonials").select("*").order("sort_order"),
        client.from("packages").select("*").order("sort_order")
      ]);
      if (!s.error && s.data && s.data.length) {
        const settings = Object.assign({}, SEED.settings);
        s.data.forEach(function (row) { settings[row.key] = parseMaybeJSON(row.value, row.value); });
        settings.stats = parseMaybeJSON(settings.stats, SEED.settings.stats);
        settings.adResults = parseMaybeJSON(settings.adResults, SEED.settings.adResults);
        settings.caseStudies = parseMaybeJSON(settings.caseStudies, SEED.settings.caseStudies);
        settings.processSteps = parseMaybeJSON(settings.processSteps, SEED.settings.processSteps);
        settings.marqueeBrands = parseMaybeJSON(settings.marqueeBrands, SEED.settings.marqueeBrands);
        settings.aboutBullets = parseMaybeJSON(settings.aboutBullets, SEED.settings.aboutBullets);
        return {
          settings: settings,
          videos: (!v.error && v.data && v.data.length) ? v.data : SEED.videos,
          testimonials: (!t.error && t.data && t.data.length) ? t.data : SEED.testimonials,
          packages: (!p.error && p.data && p.data.length) ? p.data : SEED.packages
        };
      }
    } catch (e) { /* fall through to seed */ }
  }
  return SEED;
}

// ---------- Render ----------
function videoCard(v, captionOverride) {
  const caption = captionOverride || v.brand;
  return '<article class="vcard reveal">' +
    '<button class="phone" data-video="' + esc(v.video_url || "") + '" data-brand="' + esc(v.brand) + '" aria-label="Play video: ' + esc(v.brand) + '">' +
      (v.thumb_url ? '<img src="' + esc(v.thumb_url) + '" alt="' + esc(v.brand) + ' video thumbnail" loading="lazy">' : '<span class="phone-fallback">' + esc(v.brand) + '</span>') +
      '<span class="play" aria-hidden="true"></span>' +
      (v.format_tag ? '<span class="fmt">' + esc(v.format_tag) + '</span>' : '') +
    '</button>' +
    '<div class="vbrand">' + esc(v.brand) + '</div>' +
    (captionOverride ? '<div class="vmetric">' + esc(captionOverride) + '</div>' : '') +
  '</article>';
}

function render(data) {
  const st = data.settings;

  // Calendly everywhere
  document.querySelectorAll(".calendly-link").forEach(function (a) {
    a.href = st.calendlyUrl || "https://calendly.com/blondebalance/30min";
  });
  // Email everywhere
  document.querySelectorAll(".contact-email").forEach(function (el) { el.textContent = st.contactEmail; });
  document.querySelectorAll(".contact-mailto").forEach(function (a) { a.href = "mailto:" + st.contactEmail; });
  const badge = document.getElementById("booking-badge"); if (badge) badge.textContent = st.bookingBadge || "";
  const heroImg = document.getElementById("hero-img"); if (heroImg && st.heroImageUrl) heroImg.src = st.heroImageUrl;
  const aboutImg = document.getElementById("about-img"); if (aboutImg && st.aboutImageUrl) aboutImg.src = st.aboutImageUrl;
  const aboutBio = document.getElementById("about-bio"); if (aboutBio) aboutBio.textContent = st.aboutBio || "";
  const bullets = document.getElementById("about-bullets");
  if (bullets && Array.isArray(st.aboutBullets)) {
    bullets.innerHTML = st.aboutBullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("");
  }

  // Stats (final values rendered by this code, then count-up animates)
  const statsEl = document.getElementById("stats-row");
  if (statsEl && Array.isArray(st.stats)) {
    statsEl.innerHTML = st.stats.map(function (s) {
      return '<div class="stat"><div class="num countup">' + esc(s.value) + '</div><div class="lbl">' + esc(s.label) + "</div></div>";
    }).join("");
  }

  // Brand marquee
  const mq = document.getElementById("brand-marquee-track");
  if (mq && Array.isArray(st.marqueeBrands)) {
    const items = st.marqueeBrands.map(function (b) { return "<span>" + esc(b) + '</span><span class="dot">\u2022</span>'; }).join("");
    mq.innerHTML = items + items; // duplicated for a seamless loop
  }
  const wall = document.getElementById("brand-wall");
  if (wall && Array.isArray(st.marqueeBrands)) {
    wall.innerHTML = st.marqueeBrands.map(function (b) {
      return '<div class="logo-tile reveal">' + esc(b) + "</div>";
    }).join("");
  }

  // Proof row: first 5 visible videos, metric is the caption
  const proof = document.getElementById("proof-row");
  if (proof) {
    proof.innerHTML = data.videos.slice(0, 5).map(function (v, i) {
      return videoCard(v, PROOF_METRICS[i] || v.format_tag || "");
    }).join("");
  }

  // Case studies (alternating)
  const cases = document.getElementById("case-studies");
  if (cases && Array.isArray(st.caseStudies)) {
    cases.innerHTML = st.caseStudies.map(function (c, i) {
      const pills = (c.pills || []).map(function (p) { return '<span class="metric' + (p === (c.pills || [])[0] ? " hot" : "") + '">' + esc(p) + "</span>"; }).join("");
      return '<article class="case reveal ' + (i % 2 ? "flip" : "") + '">' +
        '<div class="case-badge">' + esc((c.title || "B").trim().charAt(0).toUpperCase()) + "</div>" +
        '<div class="case-script">' + esc(c.title || "") + "</div>" +
        '<div class="cbrand">' + esc(c.label || "") + "</div>" +
        "<h3>" + esc(c.title || "") + "</h3>" +
        "<dl>" +
          "<dt>Who</dt><dd>" + esc(c.who || "") + "</dd>" +
          "<dt>What</dt><dd>" + esc(c.what || "") + "</dd>" +
          "<dt>Why</dt><dd>" + esc(c.why || "") + "</dd>" +
          "<dt>Payoff</dt><dd>" + esc(c.payoff || "") + "</dd>" +
        "</dl>" + pills + "</article>";
    }).join("");
  }

  // Ad results
  const res = document.getElementById("results-grid");
  if (res && Array.isArray(st.adResults)) {
    res.innerHTML = st.adResults.map(function (r) {
      return '<div class="rcard reveal"><div class="rlbl">' + esc(r.title) + '</div><div class="rnum countup">' + esc(r.value) + '</div><p>' + esc(r.sub) + "</p></div>";
    }).join("");
  }

  // Testimonials
  const quotes = document.getElementById("testimonials-grid");
  if (quotes) {
    quotes.innerHTML = data.testimonials.map(function (t) {
      return '<figure class="q reveal"><div class="q-badge">' + esc((t.brand || "B").trim().charAt(0).toUpperCase()) + '</div>' +
        '<div class="stars" aria-label="5 stars">\u2605\u2605\u2605\u2605\u2605</div>' +
        "<blockquote>\u201C" + esc(t.quote) + "\u201D</blockquote>" +
        '<figcaption class="who">' + esc(t.brand) + (t.attribution ? " \u2022 " + esc(t.attribution) : "") + "</figcaption></figure>";
    }).join("");
  }

  // Portfolio categories
  ["beauty", "wellness", "paid"].forEach(function (cat) {
    const el = document.getElementById("grid-" + cat);
    if (el) {
      el.innerHTML = data.videos.filter(function (v) { return v.category === cat; }).map(function (v) { return videoCard(v); }).join("");
    }
  });

  // Packages (no prices, ever)
  const pkgs = document.getElementById("packages-grid");
  if (pkgs) {
    pkgs.innerHTML = data.packages.map(function (p) {
      return '<article class="pkg reveal' + (p.featured ? " featured" : "") + '">' +
        (p.featured ? '<span class="tag">MOST BOOKED</span>' : "") +
        '<div class="pn">' + esc(p.number_label || "") + "</div>" +
        "<h4>" + esc(p.title) + "</h4><p>" + esc(p.description) + "</p></article>";
    }).join("");
  }

  // Process steps
  const steps = document.getElementById("process-steps");
  if (steps && Array.isArray(st.processSteps)) {
    steps.innerHTML = st.processSteps.map(function (s, i) {
      return '<div class="step reveal"><div class="step-dot">' + (i + 1) + '</div><div class="step-script">' + esc(s.title) + "</div><p>" + esc(s.text) + "</p></div>";
    }).join("");
  }

  wireVideoModal();
  wireReveal();
  wireCountUps();
}

// ---------- Video modal ----------
function wireVideoModal() {
  const modal = document.getElementById("video-modal");
  const body = document.getElementById("video-modal-body");
  if (!modal || !body) return;
  document.querySelectorAll(".phone").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const url = btn.getAttribute("data-video");
      if (!url) {
        body.innerHTML = '<p class="modal-note">This video file has not been added yet. Tanya can add it in the Admin page, and it will play here.</p>';
      } else if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) {
        body.innerHTML = '<video src="' + esc(url) + '" controls autoplay playsinline style="width:100%;max-height:75vh;border-radius:12px"></video>';
      } else if (/youtube|youtu\.be|vimeo|tiktok/i.test(url)) {
        body.innerHTML = '<p class="modal-note"><a href="' + esc(url) + '" target="_blank" rel="noopener">Watch this video \u2192</a></p>';
      } else {
        body.innerHTML = '<p class="modal-note"><a href="' + esc(url) + '" target="_blank" rel="noopener">Watch this video \u2192</a></p>';
      }
      modal.hidden = false;
    });
  });
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.closest(".modal-close")) { modal.hidden = true; body.innerHTML = ""; }
  });
}

// ---------- Reveal on scroll (content defaults to visible) ----------
function wireReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) return; // stays visible
  document.body.classList.add("js-reveal");
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
  // Safety: reveal anything still hidden after 1.4s
  setTimeout(function () { els.forEach(function (el) { el.classList.add("in"); }); }, 1400);
}

// ---------- Count-up (final value is what is rendered first) ----------
function wireCountUps() {
  const els = document.querySelectorAll(".countup");
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      const el = en.target; io.unobserve(el);
      const finalText = el.textContent.trim();
      const m = finalText.match(/([\d.]+)/);
      if (!m) return;
      const target = parseFloat(m[1]);
      const decimals = (m[1].split(".")[1] || "").length;
      const prefix = finalText.slice(0, m.index);
      const suffix = finalText.slice(m.index + m[1].length);
      const start = target * 0.18;
      const t0 = performance.now(), dur = 1200;
      (function tick(t) {
        const p = Math.min(1, (t - t0) / dur);
        const val = start + (target - start) * (1 - Math.pow(1 - p, 3));
        el.textContent = prefix + val.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick); else el.textContent = finalText; // snap to exact final
      })(t0);
    });
  }, { threshold: 0.4 });
  els.forEach(function (el) { io.observe(el); });
}

// ---------- Copy email ----------
function wireCopyEmail(email) {
  const btn = document.getElementById("copy-email");
  if (!btn) return;
  btn.addEventListener("click", function () {
    function done() { btn.textContent = "COPIED \u2713"; setTimeout(function () { btn.textContent = "COPY EMAIL"; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done).catch(function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = email; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  });
}

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", function () {
  loadData().then(function (data) {
    render(data);
    wireCopyEmail(data.settings.contactEmail);
  });
});
