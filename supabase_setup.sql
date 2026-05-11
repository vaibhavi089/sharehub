-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qvjnbazctbrlonjefnnf/sql

-- CARPOOL RIDES
create table if not exists rides (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now(),
  "from"      text not null,
  "to"        text not null,
  date        date not null,
  time        text,
  seats       int not null,
  price       text,
  name        text,
  phone       text
);

-- ROOM / PG LISTINGS
create table if not exists rooms (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now(),
  type        text not null,
  area        text not null,
  address     text,
  price       int not null,
  deposit     int,
  gender      text,
  amenities   text[],
  description text not null,
  name        text,
  phone       text
);

-- MESSAGES
create table if not exists messages (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now(),
  chat_id     text not null,
  sender      text not null,
  text        text not null
);

-- Enable Row Level Security but allow all for now (public app)
alter table rides    enable row level security;
alter table rooms    enable row level security;
alter table messages enable row level security;

create policy "public read rides"    on rides    for select using (true);
create policy "public insert rides"  on rides    for insert with check (true);
create policy "public read rooms"    on rooms    for select using (true);
create policy "public insert rooms"  on rooms    for insert with check (true);
create policy "public read messages" on messages for select using (true);
create policy "public insert messages" on messages for insert with check (true);
