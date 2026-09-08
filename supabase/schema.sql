-- ORIGINAL Account: Al Safa Traders.pk
-- Enable UUID
create extension if not exists "uuid-ossp";

-- 1. Products Table (Your Daraz Products)
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  price numeric,
  daraz_url text not null,
  image_url text,
  category text,
  created_at timestamp with time zone default now()
);

-- 2. Clicks Table (Pakistan Tracking)
create table if not exists clicks (
  id uuid primary key default uuid_generate_v4(),
  product_id text,
  product_title text,
  country text default 'PK',
  created_at timestamp with time zone default now()
);

-- Allow public read for website, secure write via service key
alter table products enable row level security;
alter table clicks enable row level security;

create policy "Public can view products"
on products for select
using (true);

create policy "Public can insert clicks"
on clicks for insert
with check (true);
