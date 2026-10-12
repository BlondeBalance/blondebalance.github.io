# Blonde Balance - Live Website

Tanya Black's portfolio site (blondebalance.com), built to replace the Canva site.
Public page: `index.html`. Private editor: `admin.html`. Backend: Supabase (free tier).
Hosting: GitHub Pages (free). No build step, just plain files.

Until Step 4 below is done, the site runs on built-in starter content, so you can
preview it fully at any point. After Step 4, the admin page controls the real content.

---

## Step 1: Create your Supabase project (5 minutes)

1. Go to https://supabase.com and log in.
2. Click **New project**. Name it `blonde-balance`. Pick a strong database password and save it in your password manager (you will not need it day to day). Region: pick the US one closest to Arizona (for example US West). Click **Create new project** and wait for it to finish setting up.
3. In the left sidebar, go to **SQL Editor** → **New query**. Open the file `supabase/schema.sql` from this folder, copy the whole thing in, and click **Run**. You should see "Success. No rows returned". This creates the tables, the security rules, the `media` storage bucket, and loads your starter content.
   - If the SQL Editor ever complains about the storage bucket part, create it by hand instead: **Storage** → **New bucket** → name it `media` → turn on **Public bucket** → Create. Then re-run only the four `media ...` policies from the schema file, or ask Muse to walk you through it.
4. Create your admin login: **Authentication** → **Users** → **Add user** → **Create new user**. Enter your email and a strong password, and tick **Auto Confirm User**. This is the account you will use on the `admin.html` page. Do not share it.

## Step 2: Connect the website to Supabase

1. In Supabase: **Project Settings** (gear icon, bottom left) → **API**.
2. Copy the **Project URL** and the **anon public** key. Never use the `service_role` key in website files.
3. Open `js/config.js` in this folder and paste them in:
   - `SUPABASE_URL = "https://your-project.supabase.co"`
   - `SUPABASE_ANON_KEY = "eyJ..."` (the long anon key)
4. Save the file. That is the whole connection.

## Step 3: Put the files on GitHub and turn on GitHub Pages

Option A, on the GitHub website (no tools to install):

1. Go to https://github.com, log in, click **+** → **New repository**. Name it `blonde-balance` (or `blondebalance.com`). Set it to **Public** (GitHub Pages on a free account needs a public repo). Click **Create repository**.
2. Click **uploading an existing file** and upload everything from this folder, keeping the folder structure: `index.html`, `admin.html`, `CNAME`, `.nojekyll`, and the `css`, `js`, `assets`, and `supabase` folders. (Or unzip `blonde-balance-live.zip` and upload its contents.) Commit the files.
3. In the repo: **Settings** → **Pages**. Under "Build and deployment", Source: **Deploy from a branch**, Branch: **main**, folder **/ (root)**. Save.
4. Wait a few minutes. Your site is live at `https://YOUR-USERNAME.github.io/blonde-balance/`. Open it and click around. Open `https://YOUR-USERNAME.github.io/blonde-balance/admin.html`, log in with your Step 1 admin account, and try adding a test video by uploading a file from your computer. Check it appears on the public page. Delete the test when you are done.

Option B, with Git installed: `git init`, add, commit, create the repo, push to `main`, then do step 3 above.

## Step 4: Point blondebalance.com at the new site

Do this only after Step 3 looks right on the github.io address. Your Canva site stays live until you change the DNS, so there is no gap to rush.

1. In the GitHub repo: **Settings** → **Pages** → **Custom domain**: type `blondebalance.com` and Save. (The `CNAME` file in this repo already contains `blondebalance.com`; GitHub may update it, that is fine.)
2. Log in to Canva: profile icon → **Settings** → **Web domains** → your domain → **Advanced settings** → **Manage**. From there you can either edit the DNS records in Canva, or change nameservers. Editing DNS records in Canva is the smaller move:
   - Delete any existing **A** records and **CNAME** records that point the root domain or `www` at Canva, because the domain can only point at one website.
   - Add four **A** records for the root (name/host: `@` or blank):
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add one **CNAME** record: name/host `www`, value `YOUR-USERNAME.github.io` (your real GitHub username).
   - If Canva will not let you edit DNS records directly, use **Change nameservers** instead and move DNS to a free provider such as Cloudflare, then add the same records there. Changing nameservers disconnects the Canva website, which is the point, but your domain registration and renewal stay in Canva.
3. Wait for it to spread. DNS changes usually show within an hour, and can take up to 24 to 48 hours in the worst case. GitHub will add the free HTTPS certificate automatically once it sees the domain; in Settings → Pages, tick **Enforce HTTPS** once it becomes available.
4. Verify: open `https://blondebalance.com` and `https://www.blondebalance.com`. Check the hero, the videos, the contact email, and a Book a Call button (it should open your Calendly: `https://calendly.com/blondebalance/30min`). Then open `https://blondebalance.com/admin.html`, log in, and make one small change to confirm the live site updates.

## Day to day: editing your site

- Go to `blondebalance.com/admin.html` and log in.
- **Page Text & Settings:** badge, email, hero wording, about text, Calendly link.
- **Videos:** Add Video → upload the video file and its picture straight from your computer, pick the category, save. Edit, reorder with the arrows, hide, or delete from the same tab.
- **Testimonials / Packages:** edit the wording in place and save.
- Every save updates the public site right away. There is nothing to republish.

## Costs

- GitHub Pages: free. Supabase: free tier (plenty for a portfolio site and admin uploads).
- Your only ongoing cost is the yearly domain renewal for blondebalance.com, wherever the domain is registered. You do not need Canva Pro to keep this website running.

## Files in this folder

| File | What it is |
|---|---|
| `index.html` | The public portfolio page brands see |
| `admin.html` | Your private editor (needs the Supabase login) |
| `css/style.css` | All public site styling (Taylor-style powder blue / taupe / cream) |
| `js/config.js` | Your Supabase URL + anon key go here (Step 2) |
| `js/site.js` | Public site logic + built-in starter content |
| `js/admin.js` | Admin page logic, including uploads to Supabase Storage |
| `assets/` | Your photos and video thumbnail frames |
| `supabase/schema.sql` | One-time database setup (Step 1) |
| `CNAME` | Tells GitHub Pages this site answers to blondebalance.com |
