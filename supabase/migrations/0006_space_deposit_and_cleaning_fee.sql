-- Per-space damage deposit and cleaning fee, set by the landlord.
-- Deposit defaults to $500 and cleaning fee to $0 for existing spaces.
alter table spaces
  add column if not exists damage_deposit numeric default 500,
  add column if not exists cleaning_fee numeric default 0;
