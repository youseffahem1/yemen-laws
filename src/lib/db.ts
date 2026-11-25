import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { seedDatabase, seedMoreVerifiedLaws } from "./seed";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "yemen-legal-data")
  : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "yemen_legal.db");

declare global {
  var __yleDb: Database.Database | undefined;
}

function initSchema(db: Database.Database) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'visitor' CHECK (role IN ('admin','editor','lawyer','judge','researcher','student','visitor')),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','disabled','pending')),
      title TEXT,
      syndicate_id TEXT,
      bio TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS laws (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      law_number TEXT NOT NULL,
      issue_year INTEGER NOT NULL,
      issue_date TEXT,
      issuing_authority TEXT NOT NULL,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
      status TEXT NOT NULL DEFAULT 'ساري',
      official_source TEXT NOT NULL,
      official_source_url TEXT,
      official_gazette_no TEXT,
      verification_status TEXT NOT NULL DEFAULT 'موثق من المصدر الرسمي',
      last_reviewed_at TEXT,
      summary TEXT,
      pdf_url TEXT,
      supersedes TEXT,
      superseded_by TEXT,
      views_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS law_chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      law_id INTEGER NOT NULL REFERENCES laws(id) ON DELETE CASCADE,
      number_label TEXT NOT NULL,
      title TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS law_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      law_id INTEGER NOT NULL REFERENCES laws(id) ON DELETE CASCADE,
      chapter_id INTEGER REFERENCES law_chapters(id) ON DELETE CASCADE,
      number_label TEXT NOT NULL,
      title TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      law_id INTEGER NOT NULL REFERENCES laws(id) ON DELETE CASCADE,
      chapter_id INTEGER REFERENCES law_chapters(id) ON DELETE SET NULL,
      section_id INTEGER REFERENCES law_sections(id) ON DELETE SET NULL,
      article_number TEXT NOT NULL,
      article_num_int INTEGER NOT NULL DEFAULT 0,
      title TEXT,
      content TEXT NOT NULL,
      official_source TEXT,
      amendment_note TEXT,
      related_article_ids TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS articles_fts USING fts5(
      article_id UNINDEXED,
      law_id UNINDEXED,
      law_title,
      article_number,
      title,
      content,
      tokenize = 'unicode61'
    );

    CREATE TABLE IF NOT EXISTS amendments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_law_id INTEGER NOT NULL REFERENCES laws(id) ON DELETE CASCADE,
      amending_law_title TEXT NOT NULL,
      amendment_year INTEGER NOT NULL,
      summary TEXT NOT NULL,
      official_source TEXT
    );

    CREATE TABLE IF NOT EXISTS judicial_rulings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ruling_number TEXT,
      court TEXT NOT NULL,
      chamber TEXT NOT NULL,
      ruling_date TEXT,
      case_type TEXT NOT NULL,
      dispute_subject TEXT NOT NULL,
      summary TEXT NOT NULL,
      principle TEXT NOT NULL,
      source TEXT NOT NULL,
      source_url TEXT,
      document_url TEXT,
      verification_status TEXT NOT NULL DEFAULT 'موثق من المصدر',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS legal_news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'news',
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_url TEXT,
      published_at TEXT NOT NULL,
      image_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      item_type TEXT NOT NULL,
      item_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, item_type, item_id)
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
      law_id INTEGER REFERENCES laws(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reading_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
      law_id INTEGER NOT NULL REFERENCES laws(id) ON DELETE CASCADE,
      visited_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reading_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reading_list_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL REFERENCES reading_lists(id) ON DELETE CASCADE,
      item_type TEXT NOT NULL,
      item_id INTEGER NOT NULL,
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      user_name TEXT NOT NULL,
      user_role TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      entity_title TEXT,
      details TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS search_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      results_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export function getDb(): Database.Database {
  if (!global.__yleDb) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const db = new Database(DB_PATH);
    initSchema(db);
    seedDatabase(db);
    seedMoreVerifiedLaws(db);
    global.__yleDb = db;
  }
  return global.__yleDb;
}

export function logAudit(params: {
  userId?: number | null;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId?: number | null;
  entityTitle?: string | null;
  details?: string | null;
}) {
  const db = getDb();
  db.prepare(
    `INSERT INTO audit_logs (user_id, user_name, user_role, action, entity_type, entity_id, entity_title, details)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    params.userId ?? null,
    params.userName,
    params.userRole,
    params.action,
    params.entityType,
    params.entityId ?? null,
    params.entityTitle ?? null,
    params.details ?? null
  );
}
