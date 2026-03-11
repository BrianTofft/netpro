-- Seed kategorier
INSERT INTO categories (slug, name, sort_order) VALUES
  ('batterier-opladere',    'Batterier & opladere',              1),
  ('bore-skruemaskiner',    'Bore- & skruemaskiner',             2),
  ('haveredskaber',         'Haveredskaber',                     3),
  ('maalevaerktoj',         'Måleværktøj',                       4),
  ('multivaerktoj',         'Multiværktøj',                      5),
  ('savevaerktoj',          'Saveteknik',                        6),
  ('slagboremaskiner',      'Slagboremaskiner & borehamre',      7),
  ('slibevaerktoj',         'Slibeværktøj',                      8),
  ('stovsugere',            'Støvsugere',                        9),
  ('tilbehor',              'Tilbehør',                         10),
  ('varmluft-limpistoler',  'Varmluft- & limpistoler',          11);

-- Seed subkategorier
WITH parent AS (SELECT id FROM categories WHERE slug = 'batterier-opladere')
INSERT INTO categories (slug, name, parent_id, sort_order)
SELECT slug, name, parent.id, sort_order FROM parent, (VALUES
  ('12v',       '12V batterier & ladere', 1),
  ('18v',       '18V batterier & ladere', 2),
  ('procore',   'ProCORE-serien',          3)
) AS subs(slug, name, sort_order);

WITH parent AS (SELECT id FROM categories WHERE slug = 'haveredskaber')
INSERT INTO categories (slug, name, parent_id, sort_order)
SELECT slug, name, parent.id, sort_order FROM parent, (VALUES
  ('beskaeringssakse', 'Beskæringssakse', 1),
  ('buskryddere',      'Buskryddere',     2),
  ('haekkeklippere',   'Hækkeklippere',   3)
) AS subs(slug, name, sort_order);

-- Seed produkter (eksempel med rigtige ASINs fra Amazon.de)
WITH cat AS (SELECT id FROM categories WHERE slug = 'bore-skruemaskiner')
INSERT INTO products (asin, title, description, price, original_price, image_url, amazon_url, category_id, brand, model, features, is_featured, is_new, rating, review_count)
SELECT
  asin, title, description, price, original_price, image_url,
  'https://www.amazon.de/dp/' || asin || '?tag=YOUR_ASSOCIATE_TAG',
  cat.id, brand, model, features, is_featured, is_new, rating, review_count
FROM cat, (VALUES
  (
    'B09TJWQMWB',
    'Bosch Professional GSR 18V-55 Skruemaskine (uden batteri)',
    'Kompakt og kraftfuld 18V skruemaskine fra Bosch Professional. Perfekt til daglig brug i håndværksfaget.',
    1099.00, 1399.00,
    'https://m.media-amazon.com/images/I/71+placeholder.jpg',
    'Bosch Professional', 'GSR 18V-55',
    ARRAY['18V FlexiClick system', 'Kompakt design', 'Elektronisk motorbeskyttelse', 'LED-arbejdslys'],
    TRUE, FALSE, 4.7, 342
  ),
  (
    'B07T6RLKWZ',
    'Bosch Professional GDR 18V-210 Slagskruetrækker',
    'Kraftfuld slagskruetrækker med 210 Nm maksimalt slagtætningsmoment.',
    1299.00, NULL,
    'https://m.media-amazon.com/images/I/72+placeholder.jpg',
    'Bosch Professional', 'GDR 18V-210',
    ARRAY['210 Nm slagmoment', '18V batteri kompatibel', '3 gear', 'LED-lys'],
    TRUE, TRUE, 4.8, 215
  )
) AS p(asin, title, description, price, original_price, image_url, brand, model, features, is_featured, is_new, rating, review_count);

WITH cat AS (SELECT id FROM categories WHERE slug = 'batterier-opladere')
INSERT INTO products (asin, title, description, price, original_price, image_url, amazon_url, category_id, brand, model, features, is_featured, is_on_sale, rating, review_count)
SELECT
  asin, title, description, price, original_price, image_url,
  'https://www.amazon.de/dp/' || asin || '?tag=YOUR_ASSOCIATE_TAG',
  cat.id, brand, model, features, is_featured, is_on_sale, rating, review_count
FROM cat, (VALUES
  (
    'B01NAABVJL',
    'Bosch Professional GBA 18V 5.0Ah ProCORE batteri',
    'Kraftigt 18V 5.0Ah ProCORE batteri til alle Bosch Professional 18V maskiner.',
    699.00, 899.00,
    'https://m.media-amazon.com/images/I/73+placeholder.jpg',
    'Bosch Professional', 'GBA 18V 5.0Ah',
    ARRAY['5.0 Ah kapacitet', 'ProCORE18V teknologi', 'Kompatibel med alle 18V maskiner', 'Overvågning via Bluetooth'],
    TRUE, TRUE, 4.9, 1203
  )
) AS p(asin, title, description, price, original_price, image_url, brand, model, features, is_featured, is_on_sale, rating, review_count);
