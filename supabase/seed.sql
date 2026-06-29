-- Sample published listings so the public site has content immediately.
-- Run AFTER schema.sql. Safe to run more than once (clears sample rows first).

delete from public.properties where title like '[SAMPLE]%';

insert into public.properties
  (title, slug, description, property_type, listing_type, status, price, currency,
   bedrooms, bathrooms, area_sqm, address, city, province, featured, images)
values
  ('[SAMPLE] Modern 3-Bed Family Home',
   'sample-modern-3-bed-family-home',
   'A bright, open-plan family home with a large garden, double garage and solar backup. Walking distance to schools and shopping.',
   'house', 'sale', 'published', 1850000, 'ZMW',
   3, 2, 240, 'Plot 1442, Roma', 'Lusaka', 'Lusaka', true,
   array['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200',
         'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200']),

  ('[SAMPLE] Executive 2-Bed Apartment',
   'sample-executive-2-bed-apartment',
   'Secure, furnished apartment in a gated complex with a pool, gym and 24-hour security. Ideal for professionals.',
   'apartment', 'rent', 'published', 12000, 'ZMW',
   2, 2, 95, 'Kabulonga Road', 'Lusaka', 'Lusaka', true,
   array['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
         'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200']),

  ('[SAMPLE] Commercial Office Space',
   'sample-commercial-office-space',
   'Open-plan office on a prime arterial road with ample parking, backup power and fibre-ready connectivity.',
   'office', 'rent', 'published', 28000, 'ZMW',
   null, 2, 320, 'Great East Road', 'Lusaka', 'Lusaka', false,
   array['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200']),

  ('[SAMPLE] Residential Stand 800sqm',
   'sample-residential-stand-800sqm',
   'Titled residential plot in a fast-developing area with water and electricity at the boundary.',
   'land', 'sale', 'published', 450000, 'ZMW',
   null, null, 800, 'Silverest', 'Lusaka', 'Lusaka', false,
   array['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200']),

  ('[SAMPLE] Townhouse with Garden',
   'sample-townhouse-with-garden',
   'Three-bedroom townhouse in a small, quiet complex with private garden and visitor parking.',
   'townhouse', 'sale', 'published', 1250000, 'ZMW',
   3, 3, 180, 'Ibex Hill', 'Lusaka', 'Lusaka', true,
   array['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200']),

  ('[SAMPLE] Spacious 4-Bed Villa',
   'sample-spacious-4-bed-villa',
   'Luxury villa with staff quarters, borehole, landscaped grounds and a covered entertainment area.',
   'house', 'sale', 'published', 3200000, 'ZMW',
   4, 4, 410, 'Leopards Hill', 'Lusaka', 'Lusaka', false,
   array['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200']);
