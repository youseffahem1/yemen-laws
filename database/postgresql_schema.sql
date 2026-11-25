-- PostgreSQL Production Schema for Yemen Legal & Judicial Encyclopedia
-- الموسوعة القانونية والقضائية اليمنية

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'visitor' CHECK (role IN ('admin','editor','lawyer','judge','researcher','student','visitor')),
  status VARCHAR(24) NOT NULL DEFAULT 'active' CHECK (status IN ('active','disabled','pending')),
  title VARCHAR(200),
  syndicate_id VARCHAR(100),
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(120) UNIQUE NOT NULL,
  name_ar VARCHAR(200) NOT NULL,
  name_en VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS laws (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(180) UNIQUE NOT NULL,
  title VARCHAR(350) NOT NULL,
  law_number VARCHAR(80) NOT NULL,
  issue_year INT NOT NULL,
  issue_date VARCHAR(60),
  issuing_authority VARCHAR(250) NOT NULL,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  status VARCHAR(60) NOT NULL DEFAULT 'ساري',
  official_source VARCHAR(300) NOT NULL,
  official_source_url TEXT,
  official_gazette_no VARCHAR(120),
  verification_status VARCHAR(80) NOT NULL DEFAULT 'موثق من المصدر الرسمي',
  last_reviewed_at VARCHAR(60),
  summary TEXT,
  pdf_url TEXT,
  supersedes TEXT,
  superseded_by TEXT,
  views_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS law_chapters (
  id SERIAL PRIMARY KEY,
  law_id INT NOT NULL REFERENCES laws(id) ON DELETE CASCADE,
  number_label VARCHAR(120) NOT NULL,
  title VARCHAR(300) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS law_sections (
  id SERIAL PRIMARY KEY,
  law_id INT NOT NULL REFERENCES laws(id) ON DELETE CASCADE,
  chapter_id INT REFERENCES law_chapters(id) ON DELETE CASCADE,
  number_label VARCHAR(120) NOT NULL,
  title VARCHAR(300) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  law_id INT NOT NULL REFERENCES laws(id) ON DELETE CASCADE,
  chapter_id INT REFERENCES law_chapters(id) ON DELETE SET NULL,
  section_id INT REFERENCES law_sections(id) ON DELETE SET NULL,
  article_number VARCHAR(60) NOT NULL,
  article_num_int INT NOT NULL DEFAULT 0,
  title VARCHAR(300),
  content TEXT NOT NULL,
  official_source VARCHAR(300),
  amendment_note TEXT,
  related_article_ids TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_articles_law ON articles(law_id);
CREATE INDEX IF NOT EXISTS idx_articles_fts ON articles USING GIN (to_tsvector('arabic', coalesce(title,'') || ' ' || content));

CREATE TABLE IF NOT EXISTS amendments (
  id SERIAL PRIMARY KEY,
  original_law_id INT NOT NULL REFERENCES laws(id) ON DELETE CASCADE,
  amending_law_title VARCHAR(300) NOT NULL,
  amendment_year INT NOT NULL,
  summary TEXT NOT NULL,
  official_source VARCHAR(300)
);

CREATE TABLE IF NOT EXISTS judicial_rulings (
  id SERIAL PRIMARY KEY,
  ruling_number VARCHAR(100),
  court VARCHAR(250) NOT NULL,
  chamber VARCHAR(200) NOT NULL,
  ruling_date VARCHAR(80),
  case_type VARCHAR(120) NOT NULL,
  dispute_subject VARCHAR(300) NOT NULL,
  summary TEXT NOT NULL,
  principle TEXT NOT NULL,
  source VARCHAR(300) NOT NULL,
  source_url TEXT,
  document_url TEXT,
  verification_status VARCHAR(80) NOT NULL DEFAULT 'موثق من المصدر',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legal_news (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(180) UNIQUE NOT NULL,
  title VARCHAR(350) NOT NULL,
  kind VARCHAR(40) NOT NULL DEFAULT 'news',
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  source_name VARCHAR(250) NOT NULL,
  source_url TEXT,
  published_at VARCHAR(60) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR(40) NOT NULL,
  item_id INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id INT REFERENCES articles(id) ON DELETE CASCADE,
  law_id INT REFERENCES laws(id) ON DELETE CASCADE,
  title VARCHAR(250) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reading_history (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id INT REFERENCES articles(id) ON DELETE CASCADE,
  law_id INT NOT NULL REFERENCES laws(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reading_lists (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(250) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reading_list_items (
  id SERIAL PRIMARY KEY,
  list_id INT NOT NULL REFERENCES reading_lists(id) ON DELETE CASCADE,
  item_type VARCHAR(40) NOT NULL,
  item_id INT NOT NULL,
  note TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(200) NOT NULL,
  user_role VARCHAR(40) NOT NULL,
  action VARCHAR(60) NOT NULL,
  entity_type VARCHAR(60) NOT NULL,
  entity_id INT,
  entity_title VARCHAR(350),
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_logs (
  id SERIAL PRIMARY KEY,
  query VARCHAR(300) NOT NULL,
  results_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
