-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asin TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  original_price NUMERIC(10,2),
  image_url TEXT,
  images TEXT[],
  amazon_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand TEXT,
  model TEXT,
  features TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_on_sale BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2,1),
  review_count INT,
  cached_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_is_new ON products(is_new) WHERE is_new = TRUE;
CREATE INDEX idx_products_is_on_sale ON products(is_on_sale) WHERE is_on_sale = TRUE;
CREATE INDEX idx_categories_slug ON categories(slug);

-- Full text search
ALTER TABLE products ADD COLUMN search_vector TSVECTOR
  GENERATED ALWAYS AS (
    to_tsvector('danish', coalesce(title, '') || ' ' || coalesce(brand, '') || ' ' || coalesce(model, '') || ' ' || coalesce(description, ''))
  ) STORED;
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- RLS (public read-only)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
