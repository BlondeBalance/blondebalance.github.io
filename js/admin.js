// ============================================================
// Blonde Balance - admin logic
// Supabase Auth login + editors for settings, videos,
// testimonials, packages. Uploads go to the "media" bucket.
// ============================================================

const SETTING_FIELDS = [
  { key: "bookingBadge", label: "Booking badge (top of your photo)" },
  { key: "contactEmail", label: "Contact email" },
  { key: "calendlyUrl", label: "Calendly link (Book a Call buttons)" },
  { key: "heroEyebrow", label: "Hero small line above headline" },
  { key: "heroHeadlineInk", label: "Hero headline, first part" },
  { key: "heroHeadlineRose", label: "Hero headline, accent part" },
  { key: "heroSubhead", label: "Hero sentence under headline", area: true },
  { key: "heroImageUrl", label: "Hero photo link (leave blank for the built-in photo)" },
  { key: "aboutEyebrow", label: "About small line" },
  { key: "aboutHeadline", label: "About headline" },
  { key: "aboutBio", label: "About paragraph", area: true },
  { key: "aboutImageUrl", label: "About photo link (leave blank for the built-in photo)" },
  { key: "ctaHeadlineInk", label: "Bottom headline, first part" },
  { key: "ctaHeadlineRose", label: "Bottom headline, accent part" },
  { key: "ctaSubhead", label: "Bottom sentence", area: true }
];
// JSON settings (edited as text, stored as JSON strings):
const JSON_SETTING_FIELDS = [
  { key: "stats", label: "Stats row (JSON list of value + label)" },
  { key: "adResults", label: "Ad Results cards (JSON)" },
  { key: "caseStudies", label: "Case studies (JSON)" },
  { key: "processSteps", label: "Process steps (JSON)" },
  { key: "marqueeBrands", label: "Brand names for the wall + marquee (JSON list)" },
  { key: "aboutBullets", label: "Why Work With Me bullet list (JSON list)" }
];
const CATEGORIES = [
  { value: "beauty", label: "Beauty" },
  { value: "fashion", label: "Fashion" },
  { value: "home", label: "Home & Lifestyle" },
  { value: "tech", label: "Tech" },
  { value: "pet", label: "Pet" }
];

let sb = null;
let state = { settings: {}, videos: [], testimonials: [], packages: [] };

function $(id) { return document.getElementById(id); }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function status(msg, ok) {
  const el = $("save-status");
  el.textContent = msg; el.className = "status " + (ok ? "ok" : "err");
}
function catLabel(v) { const c = CATEGORIES.find(function (x) { return x.value === v; }); return c ? c.label : v; }

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", async function () {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !window.supabase) {
    $("not-configured").hidden = false;
    $("login-card").hidden = true;
    return;
  }
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  $("login-btn").addEventListener("click", login);
  $("logout-btn").addEventListener("click", async function () { await sb.auth.signOut(); location.reload(); });
  $("pw-save").addEventListener("click", setPassword);
  const { data } = await sb.auth.getSession();
  if (data.session) { showEditor(); loadAll(); } 
});

// ---------- Auth ----------
async function setPassword() {
  const pw = $("pw-new").value;
  const st = $("pw-status");
  if (!pw || pw.length < 8) { st.textContent = "Please type a password of at least 8 characters."; st.className = "status err"; return; }
  st.textContent = "Saving password...";
  const { error } = await sb.auth.updateUser({ password: pw });
  if (error) { st.textContent = "Could not save: " + error.message; st.className = "status err"; return; }
  $("pw-new").value = "";
  st.textContent = "Password saved. Use it next time you log in here.";
  st.className = "status ok";
}

async function login() {
  const btn = $("login-btn"); btn.disabled = true;
  $("login-status").textContent = "Logging in...";
  const { error } = await sb.auth.signInWithPassword({
    email: $("login-email").value.trim(),
    password: $("login-password").value
  });
  btn.disabled = false;
  if (error) { $("login-status").textContent = "Login failed: " + error.message; $("login-status").className = "status err"; return; }
  showEditor(); loadAll();
}
function showEditor() { $("login-card").hidden = true; $("editor").hidden = false; wireTabs(); }

// ---------- Tabs ----------
function wireTabs() {
  document.querySelectorAll(".tabs button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".tabs button").forEach(function (x) { x.classList.toggle("on", x === b); });
      ["settings", "videos", "testimonials", "packages"].forEach(function (t) {
        $("tab-" + t).hidden = (t !== b.dataset.tab);
      });
    });
  });
}

// ---------- Load ----------
async function loadAll() {
  status("Loading your current content...", true);
  const [s, v, t, p] = await Promise.all([
    sb.from("site_settings").select("key,value"),
    sb.from("videos").select("*").order("sort_order"),
    sb.from("testimonials").select("*").order("sort_order"),
    sb.from("packages").select("*").order("sort_order")
  ]);
  if (s.error || v.error || t.error || p.error) {
    status("Could not load content. Check that you ran supabase/schema.sql in your Supabase project. " + ((s.error || v.error || t.error || p.error) || {}).message, false);
    return;
  }
  state.settings = {}; s.data.forEach(function (r) { state.settings[r.key] = r.value; });
  state.videos = v.data; state.testimonials = t.data; state.packages = p.data;
  renderSettings(); renderVideos(); renderTestimonials(); renderPackages();
  status("Loaded. Everything below is what is live on your site.", true);
}

// ---------- Settings ----------
function renderSettings() {
  let html = "";
  SETTING_FIELDS.forEach(function (f) {
    const val = state.settings[f.key] || "";
    html += "<label for='set-" + f.key + "'>" + esc(f.label) + "</label>";
    html += f.area
      ? "<textarea id='set-" + f.key + "'>" + esc(val) + "</textarea>"
      : "<input type='text' id='set-" + f.key + "' value='" + esc(val) + "'>";
  });
  html += "<details><summary>Advanced: lists and numbers (JSON)</summary><p class='help'>These power your stats, Ad Results, case studies, process steps, brand wall, and bullet list. Edit carefully, keep the same shape, then save.</p>";
  JSON_SETTING_FIELDS.forEach(function (f) {
    html += "<label for='set-" + f.key + "'>" + esc(f.label) + "</label><textarea id='set-" + f.key + "'>" + esc(state.settings[f.key] || "") + "</textarea>";
  });
  html += "</details>";
  $("settings-form").innerHTML = html;
  $("settings-save").onclick = saveSettings;
}
async function saveSettings() {
  const rows = [];
  SETTING_FIELDS.concat(JSON_SETTING_FIELDS).forEach(function (f) {
    const el = $("set-" + f.key); if (!el) return;
    if (JSON_SETTING_FIELDS.indexOf(f) >= 0 && el.value.trim()) {
      try { JSON.parse(el.value); } catch (e) { status("The field '" + f.label + "' is not valid JSON. Fix it and save again.", false); throw e; }
    }
    rows.push({ key: f.key, value: el.value });
  });
  const { error } = await sb.from("site_settings").upsert(rows, { onConflict: "key" });
  status(error ? "Save failed: " + error.message : "Settings saved. Refresh the public site to see them.", !error);
}

// ---------- Uploads ----------
async function uploadFile(file, folder) {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = folder + "/" + Date.now() + "-" + safe;
  const { error } = await sb.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = sb.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Videos ----------
function videoForm(prefix, v) {
  v = v || { brand: "", category: "beauty", format_tag: "", video_url: "", thumb_url: "", visible: true };
  const catOpts = CATEGORIES.map(function (c) {
    return "<option value='" + c.value + "'" + (v.category === c.value ? " selected" : "") + ">" + c.label + "</option>";
  }).join("");
  return "" +
    "<label>Brand name</label><input type='text' id='" + prefix + "-brand' value='" + esc(v.brand) + "' placeholder='Example: Kitsch'>" +
    "<div class='grid2'><div><label>Category</label><select id='" + prefix + "-category'>" + catOpts + "</select></div>" +
    "<div><label>Format tag (shows on the video, optional)</label><input type='text' id='" + prefix + "-format' value='" + esc(v.format_tag || "") + "' placeholder='Example: TALKING HEAD'></div></div>" +
    "<label>Upload video from your computer (main way)</label><input type='file' id='" + prefix + "-videofile' accept='video/mp4,video/webm,video/quicktime,.mov'>" +
    "<label>Or paste a video link instead</label><input type='url' id='" + prefix + "-videourl' value='" + esc(v.video_url || "") + "' placeholder='https://...'>" +
    "<label>Upload picture / thumbnail from your computer</label><input type='file' id='" + prefix + "-thumbfile' accept='image/jpeg,image/png,image/webp'>" +
    "<label>Or paste a picture link instead</label><input type='url' id='" + prefix + "-thumburl' value='" + esc(v.thumb_url || "") + "' placeholder='https://...'>" +
    "<label><input type='checkbox' id='" + prefix + "-visible'" + (v.visible ? " checked" : "") + " style='width:auto'> Show this video on the site</label>";
}
async function readVideoForm(prefix) {
  const out = {
    brand: $(prefix + "-brand").value.trim(),
    category: $(prefix + "-category").value,
    format_tag: $(prefix + "-format").value.trim(),
    video_url: $(prefix + "-videourl").value.trim(),
    thumb_url: $(prefix + "-thumburl").value.trim(),
    visible: $(prefix + "-visible").checked
  };
  const vf = $(prefix + "-videofile").files[0];
  if (vf) { status("Uploading your video file...", true); out.video_url = await uploadFile(vf, "videos"); }
  const tf = $(prefix + "-thumbfile").files[0];
  if (tf) { status("Uploading your picture...", true); out.thumb_url = await uploadFile(tf, "thumbs"); }
  return out;
}
function renderVideos() {
  const list = $("videos-list");
  list.innerHTML = state.videos.map(function (v, i) {
    return "<div class='row'><div class='row-head'>" +
      "<span>" + (v.thumb_url ? "<img class='thumb' src='" + esc(v.thumb_url) + "' alt=''>" : "") + "<b>" + esc(v.brand) + "</b> &bull; " + esc(catLabel(v.category)) + (v.visible ? "" : " &bull; <i>hidden</i>") + "</span>" +
      "<span class='row-actions'>" +
      "<button class='btn small' data-move='-1' data-id='" + v.id + "'>&uarr;</button>" +
      "<button class='btn small' data-move='1' data-id='" + v.id + "'>&darr;</button>" +
      "<button class='btn small blue' data-edit='" + v.id + "'>EDIT</button>" +
      "<button class='btn small danger' data-del='" + v.id + "'>DELETE</button></span></div>" +
      "<div id='edit-video-" + v.id + "' hidden>" + videoForm("v" + v.id, v) +
      "<button class='btn' data-save='" + v.id + "'>SAVE THIS VIDEO</button></div></div>";
  }).join("") || "<p class='help'>No videos yet. Add your first one below.</p>";

  list.querySelectorAll("[data-edit]").forEach(function (b) {
    b.onclick = function () { const f = $("edit-video-" + b.dataset.edit); f.hidden = !f.hidden; };
  });
  list.querySelectorAll("[data-save]").forEach(function (b) {
    b.onclick = async function () {
      try {
        const vals = await readVideoForm("v" + b.dataset.save);
        const { error } = await sb.from("videos").update(vals).eq("id", b.dataset.save);
        status(error ? "Save failed: " + error.message : "Video saved.", !error);
        if (!error) loadAll();
      } catch (e) { status("Upload/save failed: " + e.message, false); }
    };
  });
  list.querySelectorAll("[data-del]").forEach(function (b) {
    b.onclick = async function () {
      if (!confirm("Delete this video from the site? The file stays in storage, only the listing is removed.")) return;
      const { error } = await sb.from("videos").delete().eq("id", b.dataset.del);
      status(error ? "Delete failed: " + error.message : "Video deleted.", !error);
      if (!error) loadAll();
    };
  });
  list.querySelectorAll("[data-move]").forEach(function (b) {
    b.onclick = async function () {
      const idx = state.videos.findIndex(function (x) { return String(x.id) === b.dataset.id; });
      const swap = idx + parseInt(b.dataset.move, 10);
      if (swap < 0 || swap >= state.videos.length) return;
      const a = state.videos[idx], c = state.videos[swap];
      await sb.from("videos").update({ sort_order: c.sort_order }).eq("id", a.id);
      await sb.from("videos").update({ sort_order: a.sort_order }).eq("id", c.id);
      loadAll();
    };
  });

  $("add-video-form").innerHTML = videoForm("new", null) + "<button class='btn' id='add-video-save'>ADD THIS VIDEO</button>";
  $("add-video-save").onclick = async function () {
    try {
      const vals = await readVideoForm("new");
      if (!vals.brand) { status("Give the video a brand name first.", false); return; }
      vals.sort_order = state.videos.length ? Math.max.apply(null, state.videos.map(function (x) { return x.sort_order || 0; })) + 1 : 0;
      const { error } = await sb.from("videos").insert(vals);
      status(error ? "Add failed: " + error.message : "Video added. It is live on the public site now.", !error);
      if (!error) loadAll();
    } catch (e) { status("Upload/add failed: " + e.message, false); }
  };
}

// ---------- Testimonials ----------
function renderTestimonials() {
  $("testimonials-list").innerHTML = state.testimonials.map(function (t) {
    return "<div class='row'><label>Brand</label><input type='text' id='t" + t.id + "-brand' value='" + esc(t.brand) + "'>" +
      "<label>Category / note under the quote</label><input type='text' id='t" + t.id + "-attribution' value='" + esc(t.attribution || "") + "'>" +
      "<label>Quote (their exact words)</label><textarea id='t" + t.id + "-quote'>" + esc(t.quote) + "</textarea>" +
      "<button class='btn small' data-tsave='" + t.id + "'>SAVE</button> " +
      "<button class='btn small danger' data-tdel='" + t.id + "'>DELETE</button></div>";
  }).join("") || "<p class='help'>No testimonials yet.</p>";
  document.querySelectorAll("[data-tsave]").forEach(function (b) {
    b.onclick = async function () {
      const id = b.dataset.tsave;
      const { error } = await sb.from("testimonials").update({
        brand: $("t" + id + "-brand").value.trim(),
        attribution: $("t" + id + "-attribution").value.trim(),
        quote: $("t" + id + "-quote").value.trim()
      }).eq("id", id);
      status(error ? "Save failed: " + error.message : "Testimonial saved.", !error);
    };
  });
  document.querySelectorAll("[data-tdel]").forEach(function (b) {
    b.onclick = async function () {
      if (!confirm("Delete this testimonial?")) return;
      const { error } = await sb.from("testimonials").delete().eq("id", b.dataset.tdel);
      status(error ? "Delete failed: " + error.message : "Testimonial deleted.", !error);
      if (!error) loadAll();
    };
  });
  $("add-testimonial-form").innerHTML =
    "<label>Brand</label><input type='text' id='nt-brand'>" +
    "<label>Category / note</label><input type='text' id='nt-attribution'>" +
    "<label>Quote (their exact words)</label><textarea id='nt-quote'></textarea>" +
    "<button class='btn' id='nt-save'>ADD TESTIMONIAL</button>";
  $("nt-save").onclick = async function () {
    const { error } = await sb.from("testimonials").insert({
      brand: $("nt-brand").value.trim(), attribution: $("nt-attribution").value.trim(),
      quote: $("nt-quote").value.trim(),
      sort_order: state.testimonials.length ? Math.max.apply(null, state.testimonials.map(function (x) { return x.sort_order || 0; })) + 1 : 0
    });
    status(error ? "Add failed: " + error.message : "Testimonial added.", !error);
    if (!error) loadAll();
  };
}

// ---------- Packages ----------
function renderPackages() {
  $("packages-list").innerHTML = state.packages.map(function (p) {
    return "<div class='row'><div class='grid2'><div><label>Number (01, 02, 03)</label><input type='text' id='p" + p.id + "-num' value='" + esc(p.number_label || "") + "'></div>" +
      "<div><label>Package name</label><input type='text' id='p" + p.id + "-title' value='" + esc(p.title) + "'></div></div>" +
      "<label>Description</label><textarea id='p" + p.id + "-desc'>" + esc(p.description) + "</textarea>" +
      "<label><input type='checkbox' id='p" + p.id + "-feat'" + (p.featured ? " checked" : "") + " style='width:auto'> Highlight as Most Booked</label><br>" +
      "<button class='btn small' data-psave='" + p.id + "'>SAVE</button></div>";
  }).join("") || "<p class='help'>No packages found.</p>";
  document.querySelectorAll("[data-psave]").forEach(function (b) {
    b.onclick = async function () {
      const id = b.dataset.psave;
      const { error } = await sb.from("packages").update({
        number_label: $("p" + id + "-num").value.trim(),
        title: $("p" + id + "-title").value.trim(),
        description: $("p" + id + "-desc").value.trim(),
        featured: $("p" + id + "-feat").checked
      }).eq("id", id);
      status(error ? "Save failed: " + error.message : "Package saved.", !error);
    };
  });
}
