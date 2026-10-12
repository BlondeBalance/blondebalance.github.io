-- ============================================================
-- Blonde Balance - Supabase setup
-- Run this whole file once in your Supabase project:
--   Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- It creates the tables, the security rules, the media storage
-- bucket, and loads Tanya's real starter content.
-- Safe to re-run: content inserts are skipped if already there.
-- ============================================================

-- ---------- Tables ----------
create table if not exists public.site_settings (
  key   text primary key,
  value text not null default ''
);

create table if not exists public.videos (
  id          bigint generated always as identity primary key,
  brand       text not null,
  category    text not null default 'beauty',   -- beauty | wellness | paid
  format_tag  text not null default '',
  video_url   text not null default '',
  thumb_url   text not null default '',
  sort_order  int  not null default 0,
  visible     boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.testimonials (
  id          bigint generated always as identity primary key,
  brand       text not null,
  attribution text not null default '',
  quote       text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.packages (
  id           bigint generated always as identity primary key,
  number_label text not null default '',
  title        text not null,
  description  text not null default '',
  featured     boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------- Security (Row Level Security) ----------
-- Anyone can READ the site content. Only a logged-in user
-- (your admin account) can add, change, or delete anything.
alter table public.site_settings enable row level security;
alter table public.videos        enable row level security;
alter table public.testimonials  enable row level security;
alter table public.packages      enable row level security;

do $$
declare t text;
begin
  foreach t in array array['site_settings','videos','testimonials','packages']
  loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (true)', t);
    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (true) with check (true)', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (true)', t);
  end loop;
end $$;

-- ---------- Storage bucket for uploads ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin upload" on storage.objects;
create policy "media admin upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ---------- Seed: site settings (Tanya's real content) ----------
insert into public.site_settings (key, value) values
  ('bookingBadge',    $$NOW BOOKING Q4 2026$$),
  ('contactEmail',    $$Tanya@blondebalance.com$$),
  ('calendlyUrl',     $$https://calendly.com/blondebalance/30min$$),
  ('heroEyebrow',     $$UGC CREATOR + PAID ADS SPECIALIST • SCOTTSDALE, AZ$$),
  ('heroHeadlineInk', $$Ads made to make your brand$$),
  ('heroHeadlineRose',$$impossible to scroll past.$$),
  ('heroSubhead',     $$UGC that feels like a friend's recommendation and performs like paid media.$$),
  ('heroImageUrl',    $$$$),
  ('aboutEyebrow',    $$HI, I'M TANYA$$),
  ('aboutHeadline',   $$UGC Creator + Paid Ads Strategist$$),
  ('aboutBio',        $$I'm Tanya — the creator behind Blonde Balance. I make UGC that feels like a friend's recommendation and performs like paid media, from my home in Scottsdale, Arizona. Brands come to me for content that looks native in the feed and holds up in the ad account: hook-led, honest, and filmed like real life because it is.$$),
  ('aboutImageUrl',   $$$$),
  ('aboutBullets',    $$["50+ brand partners across beauty, home, wellness and tech","500+ ad creatives produced for paid and organic","Talking-to-camera, voiceover, lifestyle and b-roll formats","48-hour average turnaround","Dog mom to Beowulf, my Pomsky — pet content available"]$$),
  ('marqueeBrands',   $$["KITSCH","KWIKSET","FANATICS","AZAZIE","UQORA","HOTWORX","FURLIFE","RYZE","AAA","GOODAL"]$$),
  ('stats',           $$[{"value":"$500K+","label":"AD SPEND MANAGED"},{"value":"2.85x","label":"TOP ROAS"},{"value":"51%","label":"TOP HOOK RATE"},{"value":"9.78%","label":"TOP CTR"}]$$),
  ('adResults',       $$[{"value":"$500K+","title":"Campaign scale","sub":"50+ brands, 500+ creatives produced"},{"value":"2.85x","title":"Top performer","sub":"Top ROAS across paid campaigns"},{"value":"$52K+","title":"E-commerce profit","sub":"Revenue driven from UGC creative"},{"value":"$20K+","title":"Organic week","sub":"Best single organic revenue week"},{"value":"51%","title":"Hook rate","sub":"vs 25–30% industry average"},{"value":"48hr","title":"Turnaround","sub":"Average delivery, brief to final"}]$$),
  ('caseStudies',     $$[{"label":"CASE STUDY 01 • HOME","title":"Kwikset smart lock","who":"Homeowners and lifestyle shoppers 28–45 — they buy based on trust from real people in real homes.","what":"Home-setting unboxing, problem-solution format.","why":"My warm home aesthetic makes viewers think “I could see that in my space.”","payoff":"2.4x CTR lift vs brand baseline.","pills":["2.4x CTR lift","48hr turnaround"]},{"label":"CASE STUDY 02 • BEAUTY","title":"Clean beauty routine","who":"Women 25–45 into clean beauty — a trust-driven audience.","what":"Hook-led talking-to-camera, before/after, comment reply. Multiple hook variations per deliverable.","why":"Beauty audiences want real women using real products — not packaging shots that get scrolled past.","payoff":"High hook and completion rates on emotional openers.","pills":["51% top hook rate","9.78% top CTR"]}]$$),
  ('processSteps',    $$[{"title":"Get familiar","text":"We align on your content goals and strategy."},{"title":"Brainstorm","text":"Concepts drafted from your brief or my expertise."},{"title":"Filming","text":"Content filmed and sent for approval, 3–10 biz days."},{"title":"Launch","text":"One revision round included. Let's plan the next one."}]$$),
  ('ctaHeadlineInk',  $$Ready to create content that$$),
  ('ctaHeadlineRose', $$converts?$$),
  ('ctaSubhead',      $$Limited spots each month. Brands that move fast get the best content.$$)
on conflict (key) do nothing;

-- ---------- Seed: videos (thumbnails are files in this repo) ----------
insert into public.videos (brand, category, format_tag, video_url, thumb_url, sort_order, visible)
select * from (values
  ($$kitsch$$,        $$beauty$$,   $$TALKING HEAD$$,  $$$$, $$assets/frames/beauty-1.jpg$$,   0,  true),
  ($$Era Tua$$,       $$beauty$$,   $$LIFESTYLE$$,     $$$$, $$assets/frames/beauty-2.jpg$$,   1,  true),
  ($$Kayura$$,        $$beauty$$,   $$DEMO$$,          $$$$, $$assets/frames/beauty-3.jpg$$,   2,  true),
  ($$Azazie$$,        $$beauty$$,   $$TRY-ON$$,        $$$$, $$assets/frames/beauty-4.jpg$$,   3,  true),
  ($$Mott & Bow$$,    $$beauty$$,   $$FASHION$$,       $$$$, $$assets/frames/beauty-5.jpg$$,   4,  true),
  ($$Uqora$$,         $$wellness$$, $$TALKING HEAD$$,  $$$$, $$assets/frames/wellness-1.jpg$$, 5,  true),
  ($$FS8$$,           $$wellness$$, $$LIFESTYLE$$,     $$$$, $$assets/frames/wellness-2.jpg$$, 6,  true),
  ($$HotWorx$$,       $$wellness$$, $$LIFESTYLE$$,     $$$$, $$assets/frames/wellness-3.jpg$$, 7,  true),
  ($$Kwikset$$,       $$wellness$$, $$DEMO$$,          $$$$, $$assets/frames/wellness-4.jpg$$, 8,  true),
  ($$FurLife$$,       $$wellness$$, $$PET LIFESTYLE$$, $$$$, $$assets/frames/wellness-5.jpg$$, 9,  true),
  ($$Fetch Rewards$$, $$paid$$,     $$APP DEMO$$,      $$$$, $$assets/frames/paid-1.jpg$$,     10, true),
  ($$Kwikset$$,       $$paid$$,     $$APP DEMO$$,      $$$$, $$assets/frames/paid-2.jpg$$,     11, true),
  ($$Quickie$$,       $$paid$$,     $$POV$$,           $$$$, $$assets/frames/paid-3.jpg$$,     12, true),
  ($$Fanatics$$,      $$paid$$,     $$AD CREATIVE$$,   $$$$, $$assets/frames/paid-4.jpg$$,     13, true),
  ($$Strava$$,        $$paid$$,     $$AD CREATIVE$$,   $$$$, $$assets/frames/paid-5.jpg$$,     14, true)
) as v(brand, category, format_tag, video_url, thumb_url, sort_order, visible)
where not exists (select 1 from public.videos limit 1);

-- ---------- Seed: testimonials (her real quotes) ----------
insert into public.testimonials (brand, attribution, quote, sort_order)
select * from (values
  ($$Kwikset$$,             $$Home Security$$,    $$Always love your content, thank you so much!$$, 0),
  ($$FurLife$$,             $$Pet Lifestyle$$,    $$Fast turnaround! This is great!$$, 1),
  ($$Vitamin Wholesalers$$, $$Supplements$$,      $$Submitted awesome work and we will be working with them again in the future!$$, 2),
  ($$Forge Skin$$,          $$Skincare$$,         $$Great, will return again.$$, 3),
  ($$Viita Supply$$,        $$Lifestyle & Home$$, $$Tanya had tight turnaround, clear communication, and performed immediately in ads!$$, 4)
) as t(brand, attribution, quote, sort_order)
where not exists (select 1 from public.testimonials limit 1);

-- ---------- Seed: packages (no prices, on purpose) ----------
insert into public.packages (number_label, title, description, featured, sort_order)
select * from (values
  ($$01$$, $$UGC VIDEO PACKAGE$$, $$Organic-style UGC videos for your own channels and product pages. Talking-to-camera, voiceover, lifestyle or b-roll, delivered ready to post.$$, false, 0),
  ($$02$$, $$PAID ADS PACKAGE$$,  $$Ad-first creative built to run paid: hook variations, direct-response structure, and formats proven in the ad account, not just the feed.$$, true, 1),
  ($$03$$, $$MONTHLY RETAINER$$,  $$A steady monthly flow of fresh creative so your ads never go stale. Priority filming slots and the fastest turnaround I offer.$$, false, 2)
) as p(number_label, title, description, featured, sort_order)
where not exists (select 1 from public.packages limit 1);
