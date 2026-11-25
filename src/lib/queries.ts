import { getDb } from "./db";

export interface PlatformStats {
  lawsCount: number;
  articlesCount: number;
  rulingsCount: number;
  categoriesCount: number;
  newsCount: number;
  usersCount: number;
}

export function getPlatformStats(): PlatformStats {
  const db = getDb();
  const lawsCount = (db.prepare("SELECT COUNT(*) as c FROM laws").get() as { c: number }).c;
  const articlesCount = (db.prepare("SELECT COUNT(*) as c FROM articles").get() as { c: number }).c;
  const rulingsCount = (db.prepare("SELECT COUNT(*) as c FROM judicial_rulings").get() as { c: number }).c;
  const categoriesCount = (db.prepare("SELECT COUNT(*) as c FROM categories").get() as { c: number }).c;
  const newsCount = (db.prepare("SELECT COUNT(*) as c FROM legal_news").get() as { c: number }).c;
  const usersCount = (db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number }).c;
  return { lawsCount, articlesCount, rulingsCount, categoriesCount, newsCount, usersCount };
}

export interface CategoryWithCount {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  laws_count: number;
  articles_count: number;
}

export function getCategoriesWithCounts(): CategoryWithCount[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT c.*,
        (SELECT COUNT(*) FROM laws l WHERE l.category_id = c.id) as laws_count,
        (SELECT COUNT(*) FROM articles a JOIN laws l ON a.law_id = l.id WHERE l.category_id = c.id) as articles_count
       FROM categories c
       ORDER BY c.sort_order ASC`
    )
    .all() as CategoryWithCount[];
}

export interface LawRecord {
  id: number;
  slug: string;
  title: string;
  law_number: string;
  issue_year: number;
  issue_date: string | null;
  issuing_authority: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  status: string;
  official_source: string;
  official_source_url: string | null;
  official_gazette_no: string | null;
  verification_status: string;
  last_reviewed_at: string | null;
  summary: string | null;
  pdf_url: string | null;
  supersedes: string | null;
  superseded_by: string | null;
  views_count: number;
  created_at: string;
  articles_count?: number;
  chapters_count?: number;
}

export function getLaws(filters?: { categorySlug?: string; status?: string; year?: number }): LawRecord[] {
  const db = getDb();
  let sql = `
    SELECT l.*, c.name_ar as category_name, c.slug as category_slug,
      (SELECT COUNT(*) FROM articles a WHERE a.law_id = l.id) as articles_count,
      (SELECT COUNT(*) FROM law_chapters ch WHERE ch.law_id = l.id) as chapters_count
    FROM laws l
    JOIN categories c ON l.category_id = c.id
    WHERE 1=1
  `;
  const params: unknown[] = [];
  if (filters?.categorySlug) {
    sql += ` AND c.slug = ?`;
    params.push(filters.categorySlug);
  }
  if (filters?.status) {
    sql += ` AND l.status LIKE ?`;
    params.push(`%${filters.status}%`);
  }
  if (filters?.year) {
    sql += ` AND l.issue_year = ?`;
    params.push(filters.year);
  }
  sql += ` ORDER BY l.issue_year DESC, l.id ASC`;
  return db.prepare(sql).all(...params) as LawRecord[];
}

export function getLawBySlug(slug: string) {
  const db = getDb();
  const law = db
    .prepare(
      `SELECT l.*, c.name_ar as category_name, c.slug as category_slug
       FROM laws l
       JOIN categories c ON l.category_id = c.id
       WHERE l.slug = ?`
    )
    .get(slug) as LawRecord | undefined;
  if (!law) return null;

  const chapters = db
    .prepare(`SELECT * FROM law_chapters WHERE law_id = ? ORDER BY sort_order ASC, id ASC`)
    .all(law.id) as { id: number; law_id: number; number_label: string; title: string; sort_order: number }[];

  const sections = db
    .prepare(`SELECT * FROM law_sections WHERE law_id = ? ORDER BY sort_order ASC, id ASC`)
    .all(law.id) as { id: number; law_id: number; chapter_id: number | null; number_label: string; title: string; sort_order: number }[];

  const articles = db
    .prepare(`SELECT * FROM articles WHERE law_id = ? ORDER BY sort_order ASC, article_num_int ASC, id ASC`)
    .all(law.id) as {
    id: number;
    law_id: number;
    chapter_id: number | null;
    section_id: number | null;
    article_number: string;
    article_num_int: number;
    title: string | null;
    content: string;
    official_source: string | null;
    amendment_note: string | null;
    related_article_ids: string | null;
    sort_order: number;
  }[];

  const amendments = db
    .prepare(`SELECT * FROM amendments WHERE original_law_id = ? ORDER BY amendment_year ASC`)
    .all(law.id) as {
    id: number;
    original_law_id: number;
    amending_law_title: string;
    amendment_year: number;
    summary: string;
    official_source: string | null;
  }[];

  return { law, chapters, sections, articles, amendments };
}

export function getArticleDetail(articleId: number) {
  const db = getDb();
  const article = db
    .prepare(
      `SELECT a.*, l.title as law_title, l.slug as law_slug, l.law_number, l.issue_year, l.status as law_status,
        l.official_source as law_source, l.official_source_url as law_source_url,
        c.name_ar as category_name,
        ch.number_label as chapter_label, ch.title as chapter_title,
        sec.number_label as section_label, sec.title as section_title
       FROM articles a
       JOIN laws l ON a.law_id = l.id
       JOIN categories c ON l.category_id = c.id
       LEFT JOIN law_chapters ch ON a.chapter_id = ch.id
       LEFT JOIN law_sections sec ON a.section_id = sec.id
       WHERE a.id = ?`
    )
    .get(articleId) as Record<string, unknown> | undefined;

  if (!article) return null;

  const siblings = db
    .prepare(`SELECT id, article_number, title FROM articles WHERE law_id = ? ORDER BY sort_order ASC, article_num_int ASC, id ASC`)
    .all(article.law_id as number) as { id: number; article_number: string; title: string | null }[];

  const idx = siblings.findIndex((s) => s.id === articleId);
  const prevArticle = idx > 0 ? siblings[idx - 1] : null;
  const nextArticle = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const related = siblings.filter((s) => s.id !== articleId).slice(0, 4);

  return { article, prevArticle, nextArticle, related };
}

export function searchLegalDatabase(params: {
  q?: string;
  category?: string;
  year?: string;
  lawNumber?: string;
  status?: string;
  authority?: string;
  exact?: boolean;
}) {
  const db = getDb();
  const q = (params.q || "").trim();

  let sql = `
    SELECT a.id as article_id, a.article_number, a.title as article_title, a.content,
      l.id as law_id, l.slug as law_slug, l.title as law_title, l.law_number, l.issue_year,
      l.status as law_status, l.issuing_authority, l.official_source, l.official_source_url,
      c.name_ar as category_name, c.slug as category_slug
    FROM articles a
    JOIN laws l ON a.law_id = l.id
    JOIN categories c ON l.category_id = c.id
    WHERE 1=1
  `;
  const args: unknown[] = [];

  if (q) {
    if (params.exact) {
      sql += ` AND (a.content LIKE ? OR a.title LIKE ? OR l.title LIKE ? OR a.article_number LIKE ?)`;
      const like = `%${q}%`;
      args.push(like, like, like, like);
    } else {
      const terms = q.split(/\s+/).filter(Boolean);
      for (const t of terms) {
        sql += ` AND (a.content LIKE ? OR a.title LIKE ? OR l.title LIKE ? OR l.law_number LIKE ? OR a.article_number LIKE ?)`;
        const like = `%${t}%`;
        args.push(like, like, like, like, like);
      }
    }
  }

  if (params.category) {
    sql += ` AND c.slug = ?`;
    args.push(params.category);
  }
  if (params.year) {
    sql += ` AND l.issue_year = ?`;
    args.push(Number(params.year));
  }
  if (params.lawNumber) {
    sql += ` AND l.law_number LIKE ?`;
    args.push(`%${params.lawNumber}%`);
  }
  if (params.status) {
    sql += ` AND l.status LIKE ?`;
    args.push(`%${params.status}%`);
  }
  if (params.authority) {
    sql += ` AND l.issuing_authority LIKE ?`;
    args.push(`%${params.authority}%`);
  }

  sql += ` ORDER BY l.issue_year DESC, a.article_num_int ASC LIMIT 60`;
  const articles = db.prepare(sql).all(...args) as Record<string, unknown>[];

  // Also search rulings if query is present
  let rulings: Record<string, unknown>[] = [];
  if (q) {
    const like = `%${q}%`;
    rulings = db
      .prepare(
        `SELECT * FROM judicial_rulings
         WHERE dispute_subject LIKE ? OR summary LIKE ? OR principle LIKE ? OR court LIKE ? OR chamber LIKE ?
         ORDER BY id DESC LIMIT 15`
      )
      .all(like, like, like, like, like) as Record<string, unknown>[];
  }

  if (q) {
    try {
      db.prepare(`INSERT INTO search_logs (query, results_count) VALUES (?, ?)`).run(
        q,
        articles.length + rulings.length
      );
    } catch {
      // ignore logging error
    }
  }

  return { articles, rulings };
}

export function getJudicialRulings(caseType?: string) {
  const db = getDb();
  if (caseType) {
    return db
      .prepare(`SELECT * FROM judicial_rulings WHERE case_type = ? ORDER BY id DESC`)
      .all(caseType) as Record<string, unknown>[];
  }
  return db.prepare(`SELECT * FROM judicial_rulings ORDER BY id DESC`).all() as Record<string, unknown>[];
}

export function getLegalNews(kind?: string) {
  const db = getDb();
  if (kind) {
    return db
      .prepare(`SELECT * FROM legal_news WHERE kind = ? ORDER BY published_at DESC, id DESC`)
      .all(kind) as Record<string, unknown>[];
  }
  return db.prepare(`SELECT * FROM legal_news ORDER BY published_at DESC, id DESC`).all() as Record<string, unknown>[];
}
