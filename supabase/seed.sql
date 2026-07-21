-- Blanked seed data — mirrors src/lib/mock-data.ts so the site has content on day one.
-- Run AFTER 0001_initial_schema.sql, in the Supabase SQL editor.
-- Idempotent-ish: slugs are unique, so re-running will fail on conflicts rather than duplicate.

-- ============================================================
-- Chef directory profiles
-- ============================================================
insert into public.chef_profiles
  (slug, name, role, bio, quote, portrait_url, instagram, space_type_preferences, location_preferences, featured)
values
  ('mia-thornton', 'Mia Thornton', 'Chef / Supper Club Host',
   'Mia has spent the past six years cooking across Melbourne''s best kitchens before striking out on her own with a rotating supper club focused on modern Australian produce. She''s run pop-ups from Fitzroy to the Yarra Valley and is known for menus that change with the season and never repeat.',
   'Blanked let me stop chasing landlords and start cooking.',
   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80',
   'https://instagram.com',
   array['Restaurant','Kitchen only'], array['Fitzroy','Collingwood','CBD'], true),

  ('leo-nakamura', 'Leo Nakamura', 'Chef / Brand Founder',
   'Leo runs a Japanese-Australian fusion brand that started as a market stall and has grown into one of the city''s most talked-about pop-ups. He''s cooked residencies in three states and is currently focused on bringing his concept to a permanent home in Melbourne.',
   'Every space we''ve booked through Blanked has come with zero drama.',
   'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1400&q=80',
   'https://instagram.com',
   array['Market','Restaurant'], array['Brunswick','CBD'], true),

  ('amara-osei', 'Amara Osei', 'Chef / Caterer',
   'Amara''s West African-inspired dinners have built a cult following through word of mouth alone. She''s now scaling up with residencies and larger event bookings, bringing her food to rooms that seat sixty instead of six.',
   'Landlords take me seriously the moment I mention Blanked.',
   'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80',
   'https://instagram.com',
   array['Event','Restaurant'], array['Richmond','St Kilda'], true),

  ('tom-whitfield', 'Tom Whitfield', 'Chef',
   'Tom trained in fine dining before pivoting to casual, produce-led pop-ups. He runs short residencies of one to two weeks at a time, testing new menus in front of a live audience before deciding what sticks.',
   'I book, I cook, I move on to the next room.',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1400&q=80',
   'https://instagram.com',
   array['Restaurant'], array['Carlton','CBD'], true),

  ('priya-chandra', 'Priya Chandra', 'Chef / Brand Founder',
   'Priya''s modern Indian dining concept has run pop-ups across six Melbourne suburbs in the last year. She''s known for pairing regional Indian dishes with natural wine.',
   'The booking flow is faster than texting a landlord back and forth.',
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80',
   'https://instagram.com',
   array['Kitchen only','Restaurant'], array['Fitzroy','Brunswick'], false),

  ('jordan-reyes', 'Jordan Reyes', 'Chef',
   'Jordan''s late-night noodle bar concept started as a one-off collab and has since become a recurring residency, moving between speakeasies and laneway bars across the city.',
   'Blanked found me spaces I never would have known existed.',
   'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=1400&q=80',
   'https://instagram.com',
   array['Bar','Kitchen only'], array['CBD','Richmond'], false);

-- ============================================================
-- Spaces (all live; landlord_id null until real landlords sign up)
-- daily_rate_listed = the public rate from the site.
-- ============================================================
insert into public.spaces
  (slug, name, suburb, type, capacity, sqft, daily_rate_listed, weekly_rate, monthly_rate,
   min_booking_duration, description, what_can_you_do, amenities, kitchen_facilities,
   equipment_included, images, cover_image, featured, space_rules, status)
values
  ('the-loft-at-flinders-lane', 'The Loft at Flinders Lane', 'CBD', 'Event',
   80, 2200, 1800, 9500, null, '1 day',
   'A raw, industrial loft space in the heart of Flinders Lane with exposed brick, skylights, and a flexible open floor plan — perfect for intimate dining experiences.',
   'You will have full access to the event space and kitchen during your booked hours, and are welcome to bring your own equipment and staff. The space is yours to configure as you see fit — seating, stations, and layout can all be adjusted. AV equipment is available for your use. You keep all food and beverage revenue generated during your event. The space must be returned to its original condition at the end of your booking, and any breakages will be charged to the operator.',
   array['kitchen','bar','seating','wifi','AV equipment'],
   array['Full commercial kitchen'],
   array['Tables and chairs','AV equipment'],
   array['/images/space-brick-loft.jpg?v=3',
         'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
         'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80'],
   '/images/space-brick-loft.jpg?v=3', true,
   array['No smoking indoors','Music must end by 11pm','Space returned to original condition'],
   'live'),

  ('gertrude-street-bistro', 'Gertrude Street Bistro', 'Fitzroy', 'Restaurant',
   60, 1500, 1500, 8000, 28000, '1 week',
   'A warm, brick-walled bistro on Gertrude Street with a full working kitchen and an established regular crowd looking for something new.',
   'Take over the full dining room and kitchen for your residency. Existing bookings system, POS, and front-of-house staff can be made available on request. Keep 100% of food and beverage revenue.',
   array['kitchen','bar','seating','wifi'],
   array['Full commercial kitchen','Coffee equipment'],
   array['Tables and chairs','Bar setup','POS'],
   array['/images/space-dark-dining.jpg?v=3',
         'https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=1400&q=80',
         'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1400&q=80'],
   '/images/space-dark-dining.jpg?v=3', true,
   array['No smoking indoors','Kitchen closed by 11:30pm'],
   'live'),

  ('smith-street-kitchen', 'Smith Street Kitchen', 'Collingwood', 'Kitchen only',
   20, 800, 800, 4200, null, '1 day',
   'A compact prep kitchen and dining nook ideal for supper clubs, tasting menus, and collaborative pop-ups with another chef.',
   'Share the space with one other operator per booking window. Prep kitchen access included, plus a small dining area for up to 20 guests.',
   array['kitchen','seating','wifi'],
   array['Prep kitchen only'],
   array['Tables and chairs'],
   array['https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80',
         'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1400&q=80'],
   'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80', false,
   array['Shared space — coordinate with co-operator','Clean as you go'],
   'live'),

  ('little-collins-speakeasy', 'Little Collins Speakeasy', 'CBD', 'Bar',
   45, 1100, 950, 5000, null, '1 day',
   'Moody laneway bar with arched windows and a full bar setup, ready for a late-night residency or one-off event.',
   'Full bar and small kitchen access. Ideal for cocktail-led pop-ups, tasting nights and small-format dinners.',
   array['bar','seating','wifi','AV equipment'],
   array['No kitchen','Coffee equipment'],
   array['Bar setup','AV equipment'],
   array['/images/space-timber-lounge.jpg?v=3',
         '/images/space-bar-shelves.jpg?v=3',
         'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1400&q=80'],
   '/images/space-timber-lounge.jpg?v=3', false,
   array['Licensed venue — RSA required','Music must end by midnight'],
   'live'),

  ('brunswick-yard-market', 'Brunswick Yard Market', 'Brunswick', 'Market',
   30, 400, 450, null, null, '1 day',
   'An open-air courtyard spot with market stall infrastructure, great foot traffic on weekends.',
   'Set up a stall for a single trading day. Power and water access included. Bring your own marquee and equipment.',
   array['seating','parking'],
   array['No kitchen'],
   array['None'],
   array['https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1400&q=80',
         'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80'],
   'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1400&q=80', false,
   array['Pack down same day','No open flames without approval'],
   'live'),

  ('richmond-rooftop', 'Richmond Rooftop', 'Richmond', 'Event',
   120, 3000, 2500, 13000, null, '1 day',
   'A sprawling rooftop with skyline views, built for large-format events, brand activations and long lunch residencies.',
   'Full rooftop access including bar, DJ booth, and covered dining area. Ideal for launch events and large pop-up dinners.',
   array['bar','seating','wifi','AV equipment'],
   array['Prep kitchen only'],
   array['Tables and chairs','Bar setup','AV equipment'],
   array['/images/space-night-terrace.jpg?v=3',
         'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1400&q=80'],
   '/images/space-night-terrace.jpg?v=3', true,
   array['Weather contingency required','Music must end by 11pm'],
   'live'),

  ('carlton-corner-cafe', 'Carlton Corner Cafe', 'Carlton', 'Cafe',
   35, 900, 700, 3800, 13500, '3 days',
   'A daylight-filled corner cafe with a loyal breakfast crowd, available for weekday residencies.',
   'Run breakfast and lunch service using the existing kitchen and coffee setup. Great for chefs testing a daytime concept.',
   array['kitchen','seating','wifi'],
   array['Full commercial kitchen','Coffee equipment'],
   array['Tables and chairs','POS'],
   array['https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1400&q=80',
         'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80'],
   'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1400&q=80', false,
   array['Available weekdays only','Kitchen closed by 3pm'],
   'live'),

  ('st-kilda-beach-house', 'St Kilda Beach House', 'St Kilda', 'Event',
   90, 2000, 1200, 6500, null, '1 day',
   'Beachside function space with a wraparound deck, ten minutes from the city — a favourite for weekend supper clubs.',
   'Full access to the dining room, deck, and kitchen. Ocean views make this a strong pick for seasonal or celebratory pop-ups.',
   array['kitchen','bar','seating','parking'],
   array['Full commercial kitchen'],
   array['Tables and chairs','Bar setup'],
   array['https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1400&q=80',
         'https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&w=1400&q=80'],
   'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1400&q=80', false,
   array['No smoking indoors','Sound curfew 10pm'],
   'live');

-- ============================================================
-- Events
-- ============================================================
insert into public.events
  (slug, name, chef_profile_id, space_id, date, time, suburb, price, hero_image, ticket_url, description, status)
values
  ('mia-thornton-winter-supper-club', 'Winter Supper Club',
   (select id from public.chef_profiles where slug = 'mia-thornton'),
   (select id from public.spaces where slug = 'the-loft-at-flinders-lane'),
   '2026-08-04', '7:00pm', 'CBD', 145, '/images/food-plated-duo.jpg?v=3', 'https://instagram.com',
   'A five-course seasonal menu built around Victorian winter produce, hosted in the raw industrial space at The Loft at Flinders Lane.',
   'live'),

  ('leo-nakamura-market-day', 'Nakamura Market Day',
   (select id from public.chef_profiles where slug = 'leo-nakamura'),
   (select id from public.spaces where slug = 'brunswick-yard-market'),
   '2026-07-19', '10:00am', 'Brunswick', null,
   'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80',
   'https://instagram.com',
   'A casual weekend market stall serving Leo''s Japanese-Australian fusion snacks. Free entry, food available for purchase.',
   'live'),

  ('amara-osei-residency-launch', 'Amara Osei Residency Launch',
   (select id from public.chef_profiles where slug = 'amara-osei'),
   (select id from public.spaces where slug = 'richmond-rooftop'),
   '2026-07-26', '6:30pm', 'Richmond', 120, '/images/food-prawn.jpg?v=3', 'https://instagram.com',
   'Amara opens a two-week rooftop residency with a launch night set menu inspired by West African home cooking.',
   'live'),

  ('tom-whitfield-test-kitchen', 'Test Kitchen: Vol. 3',
   (select id from public.chef_profiles where slug = 'tom-whitfield'),
   (select id from public.spaces where slug = 'carlton-corner-cafe'),
   '2026-08-12', '12:00pm', 'Carlton', 65,
   'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1400&q=80',
   'https://instagram.com',
   'Tom trials three new dishes for lunch service ahead of his next residency. Limited covers.',
   'live'),

  ('priya-chandra-natural-wine-night', 'Natural Wine & Regional Plates',
   (select id from public.chef_profiles where slug = 'priya-chandra'),
   (select id from public.spaces where slug = 'gertrude-street-bistro'),
   '2026-07-22', '7:30pm', 'Fitzroy', 95,
   'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
   'https://instagram.com',
   'A six-dish regional Indian tasting menu paired with a natural wine list curated for the evening.',
   'sold_out'),

  ('jordan-reyes-late-night-noodles', 'Late Night Noodles',
   (select id from public.chef_profiles where slug = 'jordan-reyes'),
   (select id from public.spaces where slug = 'little-collins-speakeasy'),
   '2026-08-01', '9:00pm', 'CBD', 40, '/images/drink-cocktail.jpg?v=3', 'https://instagram.com',
   'Jordan''s late-night noodle bar pops up in the laneway speakeasy for one night only.',
   'live');

-- ============================================================
-- Reviews
-- ============================================================
insert into public.reviews (space_id, author_name, author_role, rating, body, created_at)
values
  ((select id from public.spaces where slug = 'the-loft-at-flinders-lane'),
   'Mia Thornton', 'Chef / Supper Club Host', 5,
   'Ran a two-night supper club here and the room did half the work for me. Kitchen is genuinely commercial-grade and the landlord was easy about bump-in.', '2026-05-15'),
  ((select id from public.spaces where slug = 'the-loft-at-flinders-lane'),
   'Jordan Reyes', 'Chef', 5,
   'Beautiful raw space, great light for content, zero drama on the day. Would book again without thinking.', '2026-04-10'),
  ((select id from public.spaces where slug = 'the-loft-at-flinders-lane'),
   'Priya Chandra', 'Chef / Brand Founder', 4,
   'Loved the room. Only note is load-in via the laneway takes a while — plan an extra half hour.', '2026-02-20'),
  ((select id from public.spaces where slug = 'gertrude-street-bistro'),
   'Tom Whitfield', 'Chef', 5,
   'A week-long residency that ran like clockwork. The regulars showed up, the kitchen never missed, and the handover was painless.', '2026-06-05'),
  ((select id from public.spaces where slug = 'gertrude-street-bistro'),
   'Priya Chandra', 'Chef / Brand Founder', 5,
   'The existing crowd is the real asset here — we sold out two nights on their foot traffic alone.', '2026-03-12'),
  ((select id from public.spaces where slug = 'smith-street-kitchen'),
   'Amara Osei', 'Chef / Caterer', 4,
   'Tight but well thought out. Perfect for a 16-cover tasting menu — wouldn''t push it past 20.', '2026-05-08'),
  ((select id from public.spaces where slug = 'little-collins-speakeasy'),
   'Jordan Reyes', 'Chef', 5,
   'My noodle bar has popped up here three times now. Late crowd is built in, bar staff know the drill.', '2026-06-18'),
  ((select id from public.spaces where slug = 'little-collins-speakeasy'),
   'Leo Nakamura', 'Chef / Brand Founder', 4,
   'Great vibe, no kitchen though — you''re prepping off-site. Know that going in and it''s a brilliant room.', '2026-01-25'),
  ((select id from public.spaces where slug = 'brunswick-yard-market'),
   'Leo Nakamura', 'Chef / Brand Founder', 5,
   'Where the brand started. Saturday foot traffic is unreal — bring more stock than you think you need.', '2026-04-22'),
  ((select id from public.spaces where slug = 'richmond-rooftop'),
   'Mia Thornton', 'Chef / Supper Club Host', 5,
   'Golden hour up here is worth the rate on its own. We shot an entire campaign during service.', '2026-03-18'),
  ((select id from public.spaces where slug = 'richmond-rooftop'),
   'Amara Osei', 'Chef / Caterer', 4,
   'Stunning venue for events. Have a wet-weather plan locked before you commit to a date.', '2026-02-14'),
  ((select id from public.spaces where slug = 'carlton-corner-cafe'),
   'Tom Whitfield', 'Chef', 4,
   'Ideal weekday test bed. Uni crowd is honest feedback — if it sells here, it sells anywhere.', '2026-05-30');
