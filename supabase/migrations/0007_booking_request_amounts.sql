-- Store the requested dates as real dates and the money on each request.
-- chef_total: what the chef pays (listed rate + cleaning, plus 10% GST).
-- landlord_payout: what the landlord receives (their own rate + cleaning).
-- The database sets both amounts itself, so the client cannot change them and
-- the landlord's own rate is never sent to the chef's browser.
alter table booking_requests
  add column if not exists booking_start date,
  add column if not exists booking_end date,
  add column if not exists chef_total numeric,
  add column if not exists landlord_payout numeric;

create or replace function set_booking_request_amounts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  s record;
  days integer;
begin
  if new.booking_start is null or new.booking_end is null then
    return new;
  end if;

  select daily_rate_listed, daily_rate_landlord, cleaning_fee
    into s
    from spaces
   where id = new.space_id;

  days := (new.booking_end - new.booking_start) + 1;

  -- Chef: listed rate x days, plus cleaning, plus 10% GST on both.
  new.chef_total := round(
    (coalesce(s.daily_rate_listed, 0) * days + coalesce(s.cleaning_fee, 0)) * 1.1,
    2
  );

  -- Landlord: their own rate x days, plus cleaning. No deposit, no GST.
  new.landlord_payout :=
    coalesce(s.daily_rate_landlord, 0) * days + coalesce(s.cleaning_fee, 0);

  return new;
end;
$$;

drop trigger if exists booking_request_amounts on booking_requests;
create trigger booking_request_amounts
  before insert on booking_requests
  for each row execute function set_booking_request_amounts();
