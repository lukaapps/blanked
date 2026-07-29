-- Add a Customer account type (people finding events, not listing/booking
-- spaces) and let them save/favourite events.

alter type account_type add value 'customer';

-- ============================================================
-- Saved / favourited events
-- ============================================================
create table public.saved_events (
  user_id uuid not null references public.profiles (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

alter table public.saved_events enable row level security;

create policy "own saved events" on public.saved_events
  for all using (user_id = auth.uid());
