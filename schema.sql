-- Jalankan sekali di Supabase → SQL Editor.
create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  url text not null check (char_length(url) <= 2048),
  category text not null default 'Lainnya' check (category in ('Fashion','Elektronik','Kecantikan','Rumah','Makanan','Lainnya')),
  note text not null default '' check (char_length(note) <= 180),
  created_at timestamptz not null default now()
);

alter table public.affiliate_links enable row level security;

-- Pengunjung dapat membaca rekomendasi dan mengirim rekomendasi baru.
drop policy if exists "Anyone can read affiliate links" on public.affiliate_links;
create policy "Anyone can read affiliate links" on public.affiliate_links
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can submit affiliate links" on public.affiliate_links;
create policy "Anyone can submit affiliate links" on public.affiliate_links
  for insert to anon, authenticated with check (true);
