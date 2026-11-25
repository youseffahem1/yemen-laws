import type Database from "better-sqlite3";
import bcrypt from "bcryptjs";

export function seedDatabase(db: Database.Database) {
  const userCount = (db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number }).c;
  if (userCount > 0) return;

  const insertUser = db.prepare(
    `INSERT INTO users (name, email, password_hash, role, status, title, syndicate_id, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const adminHash = bcrypt.hashSync("Admin@YemenLaw2026", 10);
  const userHash = bcrypt.hashSync("YemenLaw@2026", 10);

  insertUser.run(
    "يوسف الحيافي",
    "admin@yemenlegal.ye",
    adminHash,
    "admin",
    "active",
    "مدير النظام ومهندس المنصة",
    "SYS-001",
    "مطور ومؤسس الموسوعة القانونية والقضائية اليمنية."
  );
  insertUser.run(
    "د. عبد الله المقطري",
    "editor@yemenlegal.ye",
    userHash,
    "editor",
    "active",
    "محرر تشريعي أول",
    "ED-104",
    "مختص بتوثيق التشريعات اليمنية ومطابقتها مع الجريدة الرسمية."
  );
  insertUser.run(
    "القاضي محمد الشامي",
    "judge@yemenlegal.ye",
    userHash,
    "judge",
    "active",
    "قاضي استئناف",
    "JUD-208",
    "قاضٍ مهتم بتوثيق المبادئ القضائية الصادرة عن المحكمة العليا."
  );
  insertUser.run(
    "المحامية أروى الحداد",
    "lawyer@yemenlegal.ye",
    userHash,
    "lawyer",
    "active",
    "محامية ترافع أمام المحكمة العليا",
    "YBA-4412",
    "محامية متخصصة في القضايا المدنية والتجارية والأحوال الشخصية."
  );
  insertUser.run(
    "أ. طارق الإرياني",
    "researcher@yemenlegal.ye",
    userHash,
    "researcher",
    "active",
    "باحث في القانون الدستوري",
    "RES-310",
    "باحث قانوني في التشريعات الدستورية والإدارية اليمنية."
  );
  insertUser.run(
    "سارة العنسي",
    "student@yemenlegal.ye",
    userHash,
    "student",
    "active",
    "طالبة كلية الشريعة والقانون - جامعة صنعاء",
    "STU-902",
    "طالبة دراسات قانونية في المستوى الرابع."
  );

  // 20 Official Yemeni Legal Categories
  const categories = [
    { slug: "constitution", name_ar: "الدستور اليمني", name_en: "Yemeni Constitution", description: "الوثيقة الدستورية العليا للجمهورية اليمنية وتعديلاتها الدستورية المستفتى عليها.", image_url: "/images/hero-yemen-court.jpg", sort_order: 1 },
    { slug: "civil", name_ar: "القوانين المدنية", name_en: "Civil Laws", description: "القانون المدني رقم (14) لسنة 2002م وتنظيم المعاملات المالية والعقود والملكية.", image_url: "/images/yemen-legal-library.jpg", sort_order: 2 },
    { slug: "commercial", name_ar: "القوانين التجارية", name_en: "Commercial Laws", description: "القانون التجاري والتشريعات المنظمة للأعمال التجارية والأوراق التجارية.", image_url: "/images/scales-of-justice-gold.jpg", sort_order: 3 },
    { slug: "penal", name_ar: "القوانين الجنائية", name_en: "Penal & Criminal Laws", description: "قانون الجرائم والعقوبات رقم (12) لسنة 1994م والتشريعات الجزائية المكملة.", image_url: "/images/supreme-court-hall.jpg", sort_order: 4 },
    { slug: "criminal-procedure", name_ar: "قانون الإجراءات الجزائية", name_en: "Criminal Procedure", description: "التشريعات المنظمة للتحقيق والمحاكمة الجزائية وضمانات المتهم والنيابة العامة.", image_url: "/images/supreme-court-hall.jpg", sort_order: 5 },
    { slug: "civil-procedure", name_ar: "قانون المرافعات والتنفيذ المدني", name_en: "Civil Procedure & Execution", description: "قواعد التقاضي والاختصاص القضائي والطعون والتنفيذ الجبري للأحكام.", image_url: "/images/scales-of-justice-gold.jpg", sort_order: 6 },
    { slug: "personal-status", name_ar: "قوانين الأحوال الشخصية", name_en: "Personal Status Laws", description: "قانون الأحوال الشخصية رقم (20) لسنة 1992م وتعديلاته في الزواج والفرقة والولاية.", image_url: "/images/yemen-legal-library.jpg", sort_order: 7 },
    { slug: "labor", name_ar: "قوانين العمل", name_en: "Labor Laws", description: "قانون العمل اليمني رقم (5) لسنة 1995م وعلاقات العمل والأجور والتأمينات.", image_url: "/images/yemen-legal-library.jpg", sort_order: 8 },
    { slug: "administrative", name_ar: "القوانين الإدارية", name_en: "Administrative Laws", description: "قانون الخدمة المدنية والسلطة المحلية والقرارات الإدارية والمنازعات الإدارية.", image_url: "/images/hero-yemen-court.jpg", sort_order: 9 },
    { slug: "financial-tax", name_ar: "القوانين المالية والضريبية", name_en: "Financial & Tax Laws", description: "القوانين المنظمة للموازنة العامة والضرائب والجمارك والرقابة المالية.", image_url: "/images/scales-of-justice-gold.jpg", sort_order: 10 },
    { slug: "real-estate", name_ar: "قوانين العقارات والأراضي", name_en: "Real Estate & Land Laws", description: "قوانين السجل العقاري وأراضي وعقارات الدولة والأوقاف.", image_url: "/images/hero-yemen-court.jpg", sort_order: 11 },
    { slug: "investment", name_ar: "قوانين الاستثمار", name_en: "Investment Laws", description: "قانون الاستثمار اليمني وضمانات المستثمرين والمناطق الحرة.", image_url: "/images/scales-of-justice-gold.jpg", sort_order: 12 },
    { slug: "companies", name_ar: "قوانين الشركات", name_en: "Companies Laws", description: "قانون الشركات التجارية وتأسيسها وإدارتها وحلها وتصفيتها.", image_url: "/images/yemen-legal-library.jpg", sort_order: 13 },
    { slug: "intellectual-property", name_ar: "قوانين الملكية الفكرية", name_en: "Intellectual Property Laws", description: "قوانين حماية حق المؤلف وبراءات الاختراع والعلامات التجارية.", image_url: "/images/yemen-legal-library.jpg", sort_order: 14 },
    { slug: "nationality-immigration", name_ar: "قوانين الجنسية والهجرة", name_en: "Nationality & Immigration", description: "قانون الجنسية اليمنية وتنظيم دخول وإقامة الأجانب والجوازات.", image_url: "/images/hero-yemen-court.jpg", sort_order: 15 },
    { slug: "elections", name_ar: "قوانين الانتخابات", name_en: "Election Laws", description: "قانون الانتخابات العامة والاستفتاء واللجنة العليا للانتخابات.", image_url: "/images/hero-yemen-court.jpg", sort_order: 16 },
    { slug: "judicial-authority", name_ar: "قوانين السلطة القضائية", name_en: "Judicial Authority Laws", description: "قانون السلطة القضائية رقم (1) لسنة 1991م واستقلال القضاء ومجلس القضاء الأعلى.", image_url: "/images/supreme-court-hall.jpg", sort_order: 17 },
    { slug: "public-prosecution", name_ar: "قوانين النيابة العامة", name_en: "Public Prosecution Laws", description: "الأحكام المنظمة لهيئة النيابة العامة واختصاصاتها في الدعوى الجزائية.", image_url: "/images/supreme-court-hall.jpg", sort_order: 18 },
    { slug: "evidence", name_ar: "قوانين الإثبات", name_en: "Evidence Laws", description: "قانون الإثبات الشرعي والقانوني في الشهادة والإقرار والمحررات والخبرة.", image_url: "/images/scales-of-justice-gold.jpg", sort_order: 19 },
    { slug: "treaties", name_ar: "الاتفاقيات والمعاهدات الدولية", name_en: "Treaties & Conventions", description: "الاتفاقيات والمعاهدات الدولية والإقليمية التي تكون الجمهورية اليمنية طرفاً فيها.", image_url: "/images/yemen-legal-library.jpg", sort_order: 20 },
  ];

  const insertCat = db.prepare(
    `INSERT INTO categories (slug, name_ar, name_en, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)`
  );
  const catIdMap: Record<string, number> = {};
  for (const c of categories) {
    const res = insertCat.run(c.slug, c.name_ar, c.name_en, c.description, c.image_url, c.sort_order);
    catIdMap[c.slug] = Number(res.lastInsertRowid);
  }

  // Insert Verified Laws
  const insertLaw = db.prepare(
    `INSERT INTO laws (slug, title, law_number, issue_year, issue_date, issuing_authority, category_id, status, official_source, official_source_url, official_gazette_no, verification_status, last_reviewed_at, summary, supersedes, superseded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertChapter = db.prepare(
    `INSERT INTO law_chapters (law_id, number_label, title, sort_order) VALUES (?, ?, ?, ?)`
  );
  const insertSection = db.prepare(
    `INSERT INTO law_sections (law_id, chapter_id, number_label, title, sort_order) VALUES (?, ?, ?, ?, ?)`
  );
  const insertArticle = db.prepare(
    `INSERT INTO articles (law_id, chapter_id, section_id, article_number, article_num_int, title, content, official_source, amendment_note, related_article_ids, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertFts = db.prepare(
    `INSERT INTO articles_fts (article_id, law_id, law_title, article_number, title, content) VALUES (?, ?, ?, ?, ?, ?)`
  );
  const insertAmendment = db.prepare(
    `INSERT INTO amendments (original_law_id, amending_law_title, amendment_year, summary, official_source) VALUES (?, ?, ?, ?, ?)`
  );

  // 1. Constitution of Yemen
  const constId = Number(
    insertLaw.run(
      "yemen-constitution-1991",
      "دستور الجمهورية اليمنية (وتعديلاته لسنة 1994م و2001م)",
      "الدستور",
      1991,
      "1991-05-16",
      "الاستفتاء الشعبي العام ومجلس النواب",
      catIdMap["constitution"],
      "ساري (معدل في 1994 و2001)",
      "مجلس النواب اليمني / مشروع الدساتير المقارنة",
      "https://www.parliament.gov.ye",
      "الجريدة الرسمية - دستور الجمهورية اليمنية",
      "موثق من المصدر الرسمي (مواد مختارة محققة النص)",
      "2026-11-25",
      "الوثيقة الدستورية العليا للجمهورية اليمنية التي تنظم شكل الدولة، والأسس السياسية والاقتصادية، وحقوق وواجبات المواطنين الأساسية، والسلطات التشريعية والتنفيذية والقضائية.",
      null,
      null
    ).lastInsertRowid
  );

  const constCh1 = Number(insertChapter.run(constId, "الباب الأول", "أسس الدولة", 1).lastInsertRowid);
  const constCh1Sec1 = Number(insertSection.run(constId, constCh1, "الفصل الأول", "الأسس السياسية", 1).lastInsertRowid);
  const constCh2 = Number(insertChapter.run(constId, "الباب الثاني", "حقوق وواجبات المواطنين الأساسية", 2).lastInsertRowid);
  const constCh3 = Number(insertChapter.run(constId, "الباب الثالث", "تنظيم سلطات الدولة - السلطة القضائية", 3).lastInsertRowid);

  const constArticles = [
    { ch: constCh1, sec: constCh1Sec1, num: "المادة (1)", int: 1, title: "هوية الدولة وسيادتها", content: "الجمهورية اليمنية دولة عربية إسلامية مستقلة ذات سيادة، وهي وحدة لا تتجزأ ولا يجوز التنازل عن أي جزءٍ منها، والشعب اليمني جزء من الأمة العربية والإسلامية.", amend: null },
    { ch: constCh1, sec: constCh1Sec1, num: "المادة (2)", int: 2, title: "دين الدولة ولغتها الرسمية", content: "الإسلام دين الدولة، واللغة العربية لغتها الرسمية.", amend: null },
    { ch: constCh1, sec: constCh1Sec1, num: "المادة (3)", int: 3, title: "مصدر التشريعات", content: "الشريعة الإسلامية مصدر جميع التشريعات.", amend: null },
    { ch: constCh1, sec: constCh1Sec1, num: "المادة (4)", int: 4, title: "سيادة الشعب وممارسة السلطة", content: "الشعب مالك السلطة ومصدرها، ويمارسها بشكل مباشر عن طريق الاستفتاء والانتخابات العامة، كما يزاولها بطريقة غير مباشرة عن طريق الهيئات التشريعية والتنفيذية والقضائية وعن طريق المجالس المحلية المنتخبة.", amend: null },
    { ch: constCh2, sec: null, num: "المادة (40)", int: 40, title: "حياد القوات المسلحة والأمن", content: "يحظر تسخير القوات المسلحة والأمن والشرطة وأية قوات أخرى لصالح حزب أو فرد أو جماعة ويجب صيانتها عن كل صور التفرقة الحزبية والعنصرية والطائفية والمناطقية والقبلية وذلك ضماناً لحيادها وقيامها بمهامها الوطنية على الوجه الأمثل ويحظر الانتماء والنشاط الحزبي فيها وفقاً للقانون.", amend: null },
    { ch: constCh2, sec: null, num: "المادة (41)", int: 41, title: "المساواة أمام القانون", content: "المواطنون جميعهم متساوون في الحقوق والواجبات العامة.", amend: null },
    { ch: constCh3, sec: null, num: "المادة (149)", int: 149, title: "استقلال السلطة القضائية", content: "القضاء سلطة مستقلة قضائياً ومالياً وإدارياً والنيابة العامة هيئة من هيئاته، وتتولى المحاكم الفصل في جميع المنازعات والجرائم، والقضاة مستقلون لا سلطان عليهم في قضائهم لغير القانون ولا يجوز لأية جهة وبأية صورة التدخل في القضايا أو في شأن من شئون العدالة ويعتبر مثل هذا التدخل جريمة يعاقب عليها القانون ولا تسقط الدعوى فيها بالتقادم.", amend: null },
    { ch: constCh3, sec: null, num: "المادة (150)", int: 150, title: "وحدة القضاء وحظر المحاكم الاستثنائية", content: "القضاء وحدة متكاملة ويرتب القانون الجهات القضائية ودرجاتها ويحدد اختصاصاتها كما يحدد الشروط الواجب توفرها فيمن يتولى القضاء وشروط وإجراءات تعيين القضاة ونقلهم وترقيتهم والضمانات الأخرى الخاصة بهم ولا يجوز إنشاء محاكم استثنائية بأي حال من الأحوال.", amend: null },
    { ch: constCh3, sec: null, num: "المادة (151)", int: 151, title: "عدم قابلية القضاة للعزل", content: "القضاة وأعضاء النيابة العامة غير قابلين للعزل إلا في الحالات وبالشروط التي يحددها القانون ولا يجوز نقلهم من السلك القضائي إلى أي وظائف غير قضائية إلا برضاهم وبموافقة المجلس المختص بشئونهم مالم يكن ذلك على سبيل التأديب وينظم القانون محاكمتهم التأديبية كما ينظم القانون مهنة المحاماة.", amend: null },
    { ch: constCh3, sec: null, num: "المادة (152)", int: 152, title: "مجلس القضاء الأعلى", content: "يكون للقضاء مجلس أعلى ينظمه القانون ويبين اختصاصاته وطريقة ترشيح وتعيين أعضائه ويعمل على تطبيق الضمانات الممنوحة للقضاة من حيث التعيين والترقية والفصل والعزل وفقاً للقانون ويتولى المجلس دراسة وإقرار مشروع موازنة القضاء تمهيداً لإدراجها رقماً واحداً في الموازنة العامة للدولة.", amend: null },
    { ch: constCh3, sec: null, num: "المادة (153)", int: 153, title: "اختصاصات المحكمة العليا", content: "المحكمة العليا للجمهورية هي أعلى هيئة قضائية ويحدد القانون كيفية تشكيلها ويبين اختصاصاتها والإجراءات التي تتبع أمامها وتمارس على وجه الخصوص في مجال القضاء ما يلي:\nأ- الفصل في الدعاوى والدفوع المتعلقة بعدم دستورية القوانين واللوائح والأنظمة والقرارات.\nب- الفصل في تنازع الاختصاص بين جهات القضاء.\nج- التحقيق وإبداء الرأي في صحة الطعون المحالة إليها من مجلس النواب المتعلقة بصحة عضوية أي من أعضائه.\nد- الفصل في الطعون في الأحكام النهائية وذلك في القضايا المدنية والتجارية والجنائية والأحوال الشخصية والمنازعات الإدارية والدعاوى التأديبية وفقاً للقانون.", amend: null },
  ];

  constArticles.forEach((a, idx) => {
    const res = insertArticle.run(
      constId, a.ch, a.sec, a.num, a.int, a.title, a.content,
      "دستور الجمهورية اليمنية - مجلس النواب اليمني", a.amend, null, idx + 1
    );
    insertFts.run(Number(res.lastInsertRowid), constId, "دستور الجمهورية اليمنية", a.num, a.title, a.content);
  });

  insertAmendment.run(
    constId,
    "التعديلات الدستورية لسنة 2001م (الاستفتاء العام فبراير 2001م)",
    2001,
    "تعديل مدد الرئاسة (المادة 112 لتصبح 7 سنوات) ومدة مجلس النواب (المادة 65 لتصبح 6 سنوات) وصلاحيات مجلسي النواب والشورى.",
    "مجلس النواب اليمني / Constitute Project"
  );

  // 2. Civil Code No. 14 of 2002
  const civilId = Number(
    insertLaw.run(
      "civil-code-14-2002",
      "القانون المدني اليمني",
      "14",
      2002,
      "2002-03-31",
      "رئيس الجمهورية / مجلس النواب",
      catIdMap["civil"],
      "ساري",
      "وزارة العدل اليمنية / بوابة النيابة العامة",
      "https://www.agoye.gov.ye",
      "الجريدة الرسمية - قرار جمهوري بالقانون رقم 14 لسنة 2002م",
      "موثق من المصدر الرسمي (مواد تمهيدية وأحكام عامة محققة)",
      "2026-11-25",
      "التشريع الأساسي الذي يحكم المعاملات المالية والمدنية والعقود والالتزامات والحقوق العينية في الجمهورية اليمنية، مستمداً أحكامه من الشريعة الإسلامية.",
      null,
      null
    ).lastInsertRowid
  );
  const civilCh1 = Number(insertChapter.run(civilId, "الكتاب الأول", "الأحكام التمهيدية وتطبيق القانون", 1).lastInsertRowid);
  const civilArticles = [
    {
      num: "المادة (1)", int: 1, title: "سريان القانون المدني ومصادر التفسير",
      content: "يسري هذا القانون المأخوذ من أحكام الشريعة الإسلامية على جميع المعاملات والمسائل التي تتناولها نصوصه لفظاً ومعنى، فإذا لم يوجد نص في هذا القانون يمكن تطبيقه يرجع إلى مبادئ الشريعة الإسلامية المأخوذ منها هذا القانون، فإذا لم يوجد حكم بمقتضى العرف الجائز شرعاً، فإذا لم يوجد عرف فبمقتضى مبادئ العدالة الموافقة لأصول الشريعة الإسلامية جملةً."
    },
    {
      num: "المادة (18)", int: 18, title: "المرجع في تفسير النصوص القانونية",
      content: "المرجع في تفسير نصوص القوانين وتطبيقها هو الفقه الإسلامي والمذكرات الإيضاحية والكتب الشارحة الصادرة من الهيئة التشريعية."
    },
    {
      num: "المادة (50)", int: 50, title: "سن الرشد وأهلية الأداء",
      content: "يعتبر الشخص كامل الأهلية لمباشرة حقوقه المدنية متى بلغ خمس عشرة سنة كاملة متمتعاً بقواه العقلية رشيداً في تصرفاته، ما لم ينص قانون خاص على سن أعلى لمباشرة حقوق معينة."
    },
  ];
  civilArticles.forEach((a, idx) => {
    const res = insertArticle.run(
      civilId, civilCh1, null, a.num, a.int, a.title, a.content,
      "القانون المدني رقم (14) لسنة 2002م - وزارة العدل", null, null, idx + 1
    );
    insertFts.run(Number(res.lastInsertRowid), civilId, "القانون المدني اليمني رقم 14 لسنة 2002", a.num, a.title, a.content);
  });

  // 3. Penal Code No. 12 of 1994
  const penalId = Number(
    insertLaw.run(
      "penal-code-12-1994",
      "قانون الجرائم والعقوبات اليمني",
      "12",
      1994,
      "1994-10-12",
      "رئيس الجمهورية (قرار جمهوري بالقانون)",
      catIdMap["penal"],
      "ساري (معدل)",
      "وزارة العدل والنيابة العامة اليمنية",
      "https://www.agoye.gov.ye",
      "الجريدة الرسمية - قرار جمهوري بالقانون رقم 12 لسنة 1994م",
      "موثق من المصدر الرسمي (الأحكام العامة محققة)",
      "2026-11-25",
      "التشريع الجزائي الأساسي في الجمهورية اليمنية الذي يحدد الأفعال المجرمة والعقوبات المقررة لها ومبادئ المسؤولية الجزائية والحدود والقصاص والتعزير.",
      null,
      null
    ).lastInsertRowid
  );
  const penalCh1 = Number(insertChapter.run(penalId, "الباب الأول", "حدود تطبيق قانون الجرائم والعقوبات", 1).lastInsertRowid);
  const penalCh2 = Number(insertChapter.run(penalId, "الباب الثاني", "الجريمة وأنواعها", 2).lastInsertRowid);
  const penalArticles = [
    { ch: penalCh1, num: "المادة (2)", int: 2, title: "مبدأ شرعية الجرائم والعقوبات", content: "المسؤولية الجزائية شخصية ولا جريمة ولا عقوبة إلا بقانون." },
    { ch: penalCh1, num: "المادة (3)", int: 3, title: "مبدأ إقليمية القانون الجزائي", content: "يسري هذا القانون على كل الجرائم التي تقع في إقليم الجمهورية اليمنية أياً كانت جنسية مرتكبها، وتعتبر الجريمة قد وقعت في إقليم الجمهورية إذا وقع فيها فعل من الأفعال المكونة لها أو تحققت فيها نتيجتها." },
    { ch: penalCh1, num: "المادة (4)", int: 4, title: "سريان القانون الأصلح للمتهم", content: "يعاقب على الجريمة بمقتضى القانون النافذ وقت ارتكابها، غير أنه إذا صدر بعد وقوع الجريمة وقبل الفصل فيها بحكم بات قانون أصلح للمتهم فهو الذي يطبق دون غيره." },
    { ch: penalCh2, num: "المادة (11)", int: 11, title: "تقسيم الجرائم إلى حدود وقصاص وتعزير", content: "الجرائم من حيث العقوبة المقررة لها قسمان: جرائم معاقب عليها بالحدود والقصاص، وجرائم يعزر عليها." },
  ];
  penalArticles.forEach((a, idx) => {
    const res = insertArticle.run(
      penalId, a.ch, null, a.num, a.int, a.title, a.content,
      "قانون الجرائم والعقوبات رقم (12) لسنة 1994م", null, null, idx + 1
    );
    insertFts.run(Number(res.lastInsertRowid), penalId, "قانون الجرائم والعقوبات رقم 12 لسنة 1994", a.num, a.title, a.content);
  });
  insertAmendment.run(
    penalId,
    "القانون رقم (32) لسنة 2006م بتعديل بعض مواد قانون الجرائم والعقوبات",
    2006,
    "تعديلات تشريعية متعلقة ببعض العقوبات والأحكام الجزائية المكملة.",
    "الجريدة الرسمية / مجلس النواب"
  );

  // 4. Personal Status Law No. 20 of 1992
  const pslId = Number(
    insertLaw.run(
      "personal-status-20-1992",
      "قانون الأحوال الشخصية اليمني",
      "20",
      1992,
      "1992-03-29",
      "مجلس الرئاسة (قرار جمهوري بالقانون)",
      catIdMap["personal-status"],
      "ساري (معدل)",
      "النيابة العامة ووزارة العدل اليمنية",
      "https://www.agoye.gov.ye",
      "الجريدة الرسمية - قرار جمهوري بالقانون رقم 20 لسنة 1992م",
      "موثق من المصدر الرسمي (مواد الكتاب الأول محققة النص)",
      "2026-11-25",
      "التشريع المنظم لأحكام الأسرة في الجمهورية اليمنية: الخطبة وعقد الزواج والولاية وحقوق الزوجين والفرقة والحضانة والنفقة والوصية والميراث.",
      null,
      null
    ).lastInsertRowid
  );
  const pslCh1 = Number(insertChapter.run(pslId, "الباب الأول", "الخطبة", 1).lastInsertRowid);
  const pslCh2 = Number(insertChapter.run(pslId, "الباب الثاني", "عقد الزواج", 2).lastInsertRowid);
  const pslSec1 = Number(insertSection.run(pslId, pslCh2, "الفصل الأول", "انعقاد الزواج وأركانه وشروطه", 1).lastInsertRowid);
  const pslSec2 = Number(insertSection.run(pslId, pslCh2, "الفصل الثاني", "الولاية في الزواج", 2).lastInsertRowid);

  const pslArticles = [
    { ch: pslCh1, sec: null, num: "المادة (2)", int: 2, title: "تعريف الخطبة", content: "الخطبة طلب التزوج والوعد به، ويدخل في حكمها قراءة الفاتحة وتبادل الهدايا." },
    { ch: pslCh1, sec: null, num: "المادة (3)", int: 3, title: "المحرمات في الخطبة", content: "تمنع خطبة المرأة المحرمة حرمة مؤبدة أو مؤقتة." },
    { ch: pslCh1, sec: null, num: "المادة (4)", int: 4, title: "العدول عن الخطبة واسترداد الهدايا", content: "1- لكل من الخاطبين العدول عن الخطبة.\n2- يرد كل من عدل عن الخطبة الهدايا بعينها إذا كانت قائمة وإلا فمثلها أو قيمتها يوم القبض.\n3- إذا انتهت الخطبة بالوفاة أو بسبب لا يد لأحد الطرفين فيه أو بعارض حال دون الزواج فلا يسترد شيء من الهدايا." },
    { ch: pslCh1, sec: null, num: "المادة (5)", int: 5, title: "التعويض عن الضرر في العدول", content: "إذا ترتب على العدول عن الخطبة ضرر يتحمل المتسبب التعويض." },
    { ch: pslCh2, sec: pslSec1, num: "المادة (6)", int: 6, title: "ماهية الزواج وغايته", content: "الزواج هو ارتباط بين زوجين بميثاق شرعي تحل به المرأة للرجل شرعاً وغايته إنشاء أسرة قوامها حسن العشرة." },
    { ch: pslCh2, sec: pslSec1, num: "المادة (9)", int: 9, title: "الإشهاد على عقد الزواج", content: "يشترط لتمام عقد الزواج حضور شاهدين مسلمين عدلين أو رجل وامرأتين وأن يسمعا كلام المتعاقدين أو الكتابة أو الرسالة أو الإشارة من الأخرس والمصمت." },
    { ch: pslCh2, sec: pslSec1, num: "المادة (10)", int: 10, title: "بطلان عقد الزواج المبني على الإكراه", content: "كل عقد بني على إكراه الزوج أو الزوجة لا اعتبار له." },
    { ch: pslCh2, sec: pslSec2, num: "المادة (14)", int: 14, title: "توثيق ورقة عقد الزواج", content: "يجب على من يتولى صيغة العقد وعلى الزوج وعلى ولي الزوجة تقييد ورقة عقد الزواج لدى الجهة المختصة في الدفتر المعد لذلك خلال أسبوع من تاريخ العقد وإلا عوقب كل منهم، وتتضمن الورقة سن الزوجين وأرقام البطاقات ومقدار المهر المعجل والمؤجل." },
    { ch: pslCh2, sec: pslSec2, num: "المادة (15)", int: 15, title: "أهلية الزواج", content: "لا يصح تزويج الصغير ذكراً كان أو أنثى دون بلوغه خمس عشرة سنة." },
    { ch: pslCh2, sec: pslSec2, num: "المادة (16)", int: 16, title: "ترتيب الأولياء في عقد الزواج", content: "ولي عقد الزواج هو الأقرب فالأقرب على الترتيب: الأب وإن علا، ثم الابن وإن سفل، ثم الإخوة، ثم أبناؤهم، ثم الأعمام، ثم أبناؤهم، ثم أعمام الأب، ثم أبناؤهم، ويقدم من كانت قرابته لأب وأم." },
    { ch: pslCh2, sec: pslSec2, num: "المادة (19)", int: 19, title: "تعريف عضل الولي", content: "يعتبر الولي عاضلاً إذا امتنع عن تزويج المرأة وهي بالغة عاقلة راضية من كفء إلا أن يكون ذلك منه تريثاً للتعرف على حال الخاطب على ألا تزيد مدة التريث على شهر." },
  ];
  pslArticles.forEach((a, idx) => {
    const res = insertArticle.run(
      pslId, a.ch, a.sec, a.num, a.int, a.title, a.content,
      "قانون الأحوال الشخصية رقم (20) لسنة 1992م - النيابة العامة", null, null, idx + 1
    );
    insertFts.run(Number(res.lastInsertRowid), pslId, "قانون الأحوال الشخصية رقم 20 لسنة 1992", a.num, a.title, a.content);
  });

  insertAmendment.run(pslId, "القانون رقم (27) لسنة 1998م", 1998, "تعديلات على بعض مواد قانون الأحوال الشخصية.", "الجريدة الرسمية");
  insertAmendment.run(pslId, "القانون رقم (24) لسنة 1999م", 1999, "تعديل المادة المتعلقة بأهلية الزواج وضوابطه.", "الجريدة الرسمية");
  insertAmendment.run(pslId, "القانون رقم (34) لسنة 2003م", 2003, "تعديلات إجرائية وموضوعية في بعض أحكام الأسرة.", "الجريدة الرسمية");

  // 5. Judicial Authority Law No. 1 of 1991
  const judId = Number(
    insertLaw.run(
      "judicial-authority-1-1991",
      "قانون السلطة القضائية اليمني",
      "1",
      1991,
      "1991-01-12",
      "مجلس الرئاسة (القانون رقم 1 لسنة 1991م)",
      catIdMap["judicial-authority"],
      "ساري (معدل)",
      "مجلس القضاء الأعلى / النيابة العامة اليمنية",
      "https://www.pp.gov.ye",
      "الجريدة الرسمية - قانون السلطة القضائية رقم 1 لسنة 1991م",
      "بطاقة تشريعية موثقة (النص الكامل قيد الإدراج والتحقق التفصيلي)",
      "2026-11-25",
      "القانون المنظم لاستقلال القضاء ودرجات المحاكم (المحكمة العليا، محاكم الاستئناف، المحاكم الابتدائية)، والنيابة العامة، ومجلس القضاء الأعلى، والتفتيش القضائي، وشؤون القضاة الوظيفية.",
      null,
      null
    ).lastInsertRowid
  );
  insertAmendment.run(judId, "تعديلات أعوام 1994، 2006، 2012، 2013م", 2013, "تعديلات متعاقبة على تشكيل مجلس القضاء الأعلى واستقلاليته الإدارية والمالية.", "منشورات مجلس النواب والجريدة الرسمية");

  // Verified Judicial Principles (Supreme Court of Yemen - Technical Office)
  const insertRuling = db.prepare(
    `INSERT INTO judicial_rulings (ruling_number, court, chamber, ruling_date, case_type, dispute_subject, summary, principle, source, source_url, verification_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  insertRuling.run(
    "مبدأ قضائي مستقر (مجموعة القواعد القضائية)",
    "المحكمة العليا للجمهورية اليمنية",
    "الدائرة الجزائية",
    "منشور في مجموعات المكتب الفني",
    "جزائي",
    "تساند الأدلة في الإثبات الجنائي",
    "قررت الدائرة الجزائية بالمحكمة العليا أن قضاء الإدانة في المواد الجزائية لا يُبنى على دليل منفرد بمعزل عن بقية أوراق الدعوى، بل على تضافر الأدلة وتساندها.",
    "لا تبني محكمة الموضوع قضاء الإدانة على دليل منفرد، بل على مجموعة أدلة متساندة (كالإقرار المقرون بالشهادات والأمارات المادية) متى كان استخلاصها سائغاً وله أصل ثابت في الأوراق.",
    "المكتب الفني للمحكمة العليا - مجموعة القواعد القضائية (الدائرة الجزائية)",
    "https://www.ysc.org.ye",
    "مبدأ قضائي موثق من إصدارات المحكمة العليا"
  );

  insertRuling.run(
    "مبدأ قضائي مستقر (مجموعة القواعد القضائية)",
    "المحكمة العليا للجمهورية اليمنية",
    "الدائرة الجزائية",
    "منشور في مجموعات المكتب الفني",
    "جزائي",
    "سلطة محكمة الموضوع في وزن أقوال الشهود",
    "رسخت المحكمة العليا اختصاص محكمة الموضوع بتقدير أدلة الدعوى وأقوال الشهود دون معقب عليها من المحكمة العليا متى كان استخلاصها معقولاً.",
    "وزن أقوال الشهود وتقدير الظروف التي أديت فيها هو من مسائل الموضوع المحضة التي تستقل بها محكمة الموضوع دون معقب عليها من المحكمة العليا، طالما كان الاستخلاص معقولاً وله أصل ثابت في الأوراق.",
    "المكتب الفني للمحكمة العليا - مجموعة القواعد القضائية (الدائرة الجزائية)",
    "https://www.ysc.org.ye",
    "مبدأ قضائي موثق من إصدارات المحكمة العليا"
  );

  insertRuling.run(
    "مبدأ قضائي مستقر (مجموعة القواعد القضائية)",
    "المحكمة العليا للجمهورية اليمنية",
    "الدائرة المدنية",
    "منشور في مجموعات المكتب الفني",
    "مدني",
    "تسبيب الأحكام المدنية وشروط الطعن بالنقض",
    "أكدت الدائرة المدنية وجوب استناد الأحكام المدنية إلى أسباب واضحة ومستمدة من الثابت بأوراق الدعوى، وعدم قبول الطعون التي تقتصر على الجدل الموضوعي.",
    "يشترط لصحة الحكم المدني أن يكون مبنياً على أسباب واضحة ومستمدة أصولاً من الثبوتيات في الدعوى، ويُرفض الطعن بالنقض إذا اقتصر على مجرد جدل في تقدير محكمة الموضوع للأدلة دون مخالفة لأسباب النقض المحددة حصراً في قانون المرافعات.",
    "المكتب الفني للمحكمة العليا - مجموعة القواعد القضائية (الدائرة المدنية)",
    "https://www.ysc.org.ye",
    "مبدأ قضائي موثق من إصدارات المحكمة العليا"
  );

  insertRuling.run(
    "مبدأ قضائي مستقر (مجلة البحوث القضائية)",
    "المحكمة العليا للجمهورية اليمنية",
    "الدائرة الجزائية",
    "منشور في مجلة البحوث القضائية",
    "إجراءات جزائية",
    "بطلان الأحكام للخلو من التسبيب أو الإجمال المخل",
    "بيّنت المحكمة العليا أن إغفال الرد على الدفوع الجوهرية أو خلو الحكم من التسبيب الكافي يترتب عليه بطلان الحكم.",
    "يبطل الحكم الجزائي إذا خالف القواعد الإجرائية الجوهرية، أو خلا من التسبيب الكافي، أو شابه إجمال مخل يحول دون وقوف المحكمة العليا على صحة تطبيق القانون.",
    "مجلة البحوث القضائية - المكتب الفني للمحكمة العليا",
    "https://www.ysc.org.ye",
    "مبدأ قضائي موثق من إصدارات المحكمة العليا"
  );

  // Legal News & Research
  const insertNews = db.prepare(
    `INSERT INTO legal_news (slug, title, kind, summary, content, source_name, source_url, published_at, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  insertNews.run(
    "constitute-yemen-archive",
    "توثيق نصوص دستور الجمهورية اليمنية وتعديلاته الدستورية في الموسوعة",
    "legislation_update",
    "إدراج المواد الأساسية ومواد السلطة القضائية من دستور الجمهورية اليمنية مع ربطها بالمصدر الرسمي لمجلس النواب.",
    "تم توثيق النصوص الدستورية الأساسية للجمهورية اليمنية (الباب الأول والثاني وباب السلطة القضائية المواد 149-153) ومطابقتها مع النصوص الرسمية المنشورة عبر بوابة مجلس النواب اليمني ومشروع الدساتير المقارنة، مع الإشارة إلى التعديلات الدستورية المعتمدة في فبراير 2001م.",
    "مجلس النواب اليمني",
    "https://www.parliament.gov.ye",
    "2026-11-20",
    "/images/hero-yemen-court.jpg"
  );

  insertNews.run(
    "supreme-court-principles-index",
    "إتاحة فهرس المبادئ القضائية المستقرة للدائرتين المدنية والجزائية",
    "news",
    "تحديث قسم المبادئ القضائية بمختارات موثقة من إصدارات المكتب الفني للمحكمة العليا بالجمهورية اليمنية.",
    "أضاف فريق التحرير القانوني حزمة من المبادئ القضائية المستقرة الصادرة عن الدائرة المدنية والدائرة الجزائية بالمحكمة العليا، لا سيما في موضوعات تساند الأدلة، وسلطة محكمة الموضوع في وزن الشهادات، وضوابط تسبيب الأحكام المدنية والجزائية.",
    "المكتب الفني للمحكمة العليا",
    "https://www.ysc.org.ye",
    "2026-11-18",
    "/images/supreme-court-hall.jpg"
  );

  insertNews.run(
    "islamic-jurisprudence-civil-code",
    "دراسة تحليلية: المرجعية الشرعية في المادة (1) و(18) من القانون المدني اليمني",
    "research",
    "قراءة أصولية وقانونية في آلية استنباط الأحكام عند خلو النص التشريعي وفق القانون المدني رقم (14) لسنة 2002م.",
    "تتناول هذه الدراسة المنهجية التي اختطها المشرع اليمني في المادة الأولى والمادة الثامنة عشرة من القانون المدني رقم (14) لسنة 2002م، حيث جعل مبادئ الشريعة الإسلامية المرجع الأول في سد الفراغ التشريعي، ثم العرف الجائز شرعاً، ثم مبادئ العدالة الموافقة لأصول الشريعة، مع اعتماد الفقه الإسلامي والمذكرات الإيضاحية مرجعاً للتفسير.",
    "الموسوعة القانونية والقضائية اليمنية",
    "https://www.agoye.gov.ye",
    "2026-11-15",
    "/images/yemen-legal-library.jpg"
  );

  // Initial Audit Log
  db.prepare(
    `INSERT INTO audit_logs (user_id, user_name, user_role, action, entity_type, entity_id, entity_title, details)
     VALUES (1, 'يوسف الحيافي', 'admin', 'SEED', 'system', 1, 'تهيئة قاعدة البيانات القانونية', 'إدراج 20 تصنيفاً تشريعياً و5 تشريعات رئيسية ومواد محققة ومبادئ المحكمة العليا.')`
  ).run();
}

export function seedMoreVerifiedLaws(db: Database.Database) {
  const exists = db.prepare("SELECT id FROM laws WHERE slug = ?").get("commercial-code-32-1991");
  if (exists) return;

  // Upgrade category images to authentic Yemeni-identity photography
  const catImgUpdates: [string, string][] = [
    ["constitution", "/images/hero-old-sanaa-flag.jpg"],
    ["civil", "/images/yemen-manuscripts-qamariya.jpg"],
    ["commercial", "/images/yemen-heritage-architecture.jpg"],
    ["penal", "/images/supreme-court-hall.jpg"],
    ["criminal-procedure", "/images/hero-yemen-court.jpg"],
    ["civil-procedure", "/images/yemen-manuscripts-qamariya.jpg"],
    ["personal-status", "/images/yemen-legal-library.jpg"],
    ["labor", "/images/yemen-heritage-architecture.jpg"],
    ["administrative", "/images/hero-old-sanaa-flag.jpg"],
    ["judicial-authority", "/images/hero-yemen-court.jpg"],
    ["evidence", "/images/yemen-manuscripts-qamariya.jpg"],
  ];
  const updCat = db.prepare("UPDATE categories SET image_url = ? WHERE slug = ?");
  for (const [slug, img] of catImgUpdates) {
    updCat.run(img, slug);
  }

  const getCatId = (slug: string) =>
    (db.prepare("SELECT id FROM categories WHERE slug = ?").get(slug) as { id: number } | undefined)?.id ?? 1;

  const insertLaw = db.prepare(
    `INSERT INTO laws (slug, title, law_number, issue_year, issue_date, issuing_authority, category_id, status, official_source, official_source_url, official_gazette_no, verification_status, last_reviewed_at, summary)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertChapter = db.prepare(
    `INSERT INTO law_chapters (law_id, number_label, title, sort_order) VALUES (?, ?, ?, ?)`
  );
  const insertArticle = db.prepare(
    `INSERT INTO articles (law_id, chapter_id, section_id, article_number, article_num_int, title, content, official_source, sort_order)
     VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?)`
  );
  const insertFts = db.prepare(
    `INSERT INTO articles_fts (article_id, law_id, law_title, article_number, title, content) VALUES (?, ?, ?, ?, ?, ?)`
  );

  const addLawWithArticles = (
    lawData: {
      slug: string;
      title: string;
      num: string;
      year: number;
      date: string;
      auth: string;
      catSlug: string;
      status: string;
      source: string;
      url: string;
      gazette: string;
      verif: string;
      summary: string;
    },
    chapterLabel: string,
    chapterTitle: string,
    arts: { num: string; int: number; title: string; content: string }[]
  ) => {
    const lawId = Number(
      insertLaw.run(
        lawData.slug,
        lawData.title,
        lawData.num,
        lawData.year,
        lawData.date,
        lawData.auth,
        getCatId(lawData.catSlug),
        lawData.status,
        lawData.source,
        lawData.url,
        lawData.gazette,
        lawData.verif,
        "2026-11-25",
        lawData.summary
      ).lastInsertRowid
    );
    const chId = Number(insertChapter.run(lawId, chapterLabel, chapterTitle, 1).lastInsertRowid);
    arts.forEach((a, idx) => {
      const aId = Number(
        insertArticle.run(lawId, chId, a.num, a.int, a.title, a.content, lawData.source, idx + 1).lastInsertRowid
      );
      insertFts.run(aId, lawId, lawData.title, a.num, a.title, a.content);
    });
  };

  // 6. Commercial Code No. 32 of 1991
  addLawWithArticles(
    {
      slug: "commercial-code-32-1991",
      title: "القانون التجاري اليمني",
      num: "32",
      year: 1991,
      date: "1991-04-13",
      auth: "مجلس الرئاسة (قرار جمهوري بالقانون)",
      catSlug: "commercial",
      status: "ساري",
      source: "المركز الوطني للمعلومات / الجريدة الرسمية",
      url: "https://yemen-nic.info",
      gazette: "قرار جمهوري بالقانون رقم (32) لسنة 1991م",
      verif: "موثق من المصدر الرسمي (الباب التمهيدي محقق النص)",
      summary: "التشريع الأساسي المنظم للتجار والأعمال التجارية والمتجر والعقود التجارية والأوراق التجارية (الكمبيالة، السند لأمر، الشيك).",
    },
    "الباب التمهيدي",
    "التسمية والتعاريف ونطاق السريان",
    [
      { num: "المادة (1)", int: 1, title: "تسمية القانون", content: "يُسمى هذا القانون (القانون التجاري)." },
      {
        num: "المادة (2)", int: 2, title: "التعاريف التجارية الأساسية",
        content: "يُقصد بالمعاني الآتية المعاني الموضحة قرين كل منها:\n- المنقولات المادية وغير المادية: المادية تعني المنقول المحسوس، وغير المادية تعني المنقول المعنوي مثل الحقوق الأدبية والصناعية والفنية والحق في الاسم التجاري والعلامات التجارية.\n- المتجر: المحل التجاري بجميع عناصره الأساسية من بضائع ومهمات مادية وحقوق ومزايا غير مادية.\n- الرهن: هو شرعاً جعل المال وثيقة في الدين يستوفى منه عند التعذر.\n- التظهير: تداول الأوراق التجارية (الكمبيالة - السند لأمر - الشيك) بتحويلها لمستفيد آخر وفقاً للقواعد الموضحة تفصيلاً في هذا القانون."
      },
      { num: "المادة (3)", int: 3, title: "نطاق سريان القانون التجاري", content: "تسري أحكام هذا القانون على التجار وعلى جميع الأعمال التجارية التي يقوم بها أي شخص ولو كان غير تاجر." },
      { num: "المادة (4)", int: 4, title: "حجية العقود التجارية", content: "في تحديد القواعد التي تسري على التجار وعلى الأعمال التجارية يعتد بالعقود المعتبرة قانوناً فهي شريعة المتعاقدين." },
      { num: "المادة (5)", int: 5, title: "سريان النصوص التشريعية عند خلو العقد", content: "إذا لم يوجد عقد أو وجد وسكت عن الحكم أو كان الحكم الوارد في العقد باطلاً سرت النصوص التشريعية التي يتضمنها هذا القانون والقوانين الأخرى على جميع المسائل التي تتناولها هذه النصوص في لفظها أو في فحواها." },
    ]
  );

  // 7. Criminal Procedure Law No. 13 of 1994
  addLawWithArticles(
    {
      slug: "criminal-procedure-13-1994",
      title: "قانون الإجراءات الجزائية اليمني",
      num: "13",
      year: 1994,
      date: "1994-10-12",
      auth: "رئيس الجمهورية (قرار جمهوري بالقانون)",
      catSlug: "criminal-procedure",
      status: "ساري (معدل)",
      source: "بوابة النيابة العامة للجمهورية اليمنية",
      url: "https://www.agoye.gov.ye",
      gazette: "قرار جمهوري بالقانون رقم (13) لسنة 1994م",
      verif: "موثق من المصدر الرسمي (الباب الأول محقق النص)",
      summary: "القانون المنظم لإجراءات الدعوى الجزائية والتحقيق الابتدائي والمحاكمة الجزائية واختصاصات النيابة العامة وضمانات المتهم والدفاع.",
    },
    "الكتاب الأول - الباب الأول",
    "التسمية والتعاريف والمبادئ الأساسية",
    [
      { num: "المادة (1)", int: 1, title: "تسمية القانون", content: "يسمى هذا القانون (قانون الإجراءات الجزائية)." },
      {
        num: "المادة (2)", int: 2, title: "التعاريف الإجرائية",
        content: "يكون للكلمات والعبارات التالية، في تطبيق أحكام هذا القانون، المعاني المذكورة قرين كل منها ما لم يقتض سياق النص معنى آخر:\n1- مسوغ قانوني: يقصد به سند من أي قانون ساري المفعول.\n2- المدعى بالحق الشخصي: المجني عليه أو أولياء الدم أو ورثة المجني عليه الشرعيون أو من يقوم مقامه قانوناً.\n3- المدعي بالحق المدني: كل من لحقه ضرر من الجريمة مادياً كان أو معنوياً.\n4- قاضٍ: يشمل قاضي المحكمة الجزائية وقضاة هيئة الحكم في المحاكم الجزائية المعينين وفقاً لقانون السلطة القضائية.\n5- أعضاء النيابة العامة: تشمل النائب العام والمحامين العامين ورؤساء النيابة وأعضائها المعينين وفقاً لقانون السلطة القضائية.\n6- ممثل الدفاع: هو المحامي المصرح له بالترافع أمام المحاكم وفقاً للقانون أو الممثل القانوني للشخص الاعتباري أو من يقوم مقامه قانوناً أو أحد أقارب المتهم."
      },
    ]
  );

  // 8. Civil Procedure & Execution Law No. 40 of 2002
  addLawWithArticles(
    {
      slug: "civil-procedure-40-2002",
      title: "قانون المرافعات والتنفيذ المدني اليمني",
      num: "40",
      year: 2002,
      date: "2002-11-02",
      auth: "رئيس الجمهورية / مجلس النواب",
      catSlug: "civil-procedure",
      status: "ساري",
      source: "بوابة النيابة العامة ووزارة العدل اليمنية",
      url: "https://www.agoye.gov.ye",
      gazette: "القانون رقم (40) لسنة 2002م",
      verif: "موثق من المصدر الرسمي (الباب التمهيدي محقق النص)",
      summary: "التشريع المنظم للخصومة القضائية والمواجهة والاختصاص وإجراءات التقاضي والطعون والتنفيذ المدني.",
    },
    "الباب التمهيدي",
    "التسمية والتعاريف وسريان القانون",
    [
      { num: "المادة (1)", int: 1, title: "تسمية القانون", content: "يسمى هذا القانون (قانون المرافعات والتنفيذ المدني)." },
      {
        num: "المادة (2)", int: 2, title: "تعاريف التقاضي والأحكام",
        content: "يقصد بالكلمات والعبارات الواردة في هذه المادة المعاني المبينة قرين كل منها أينما وردت في هذا القانون:\n- الشرع: أحكام الشريعة الإسلامية.\n- الخصومة القضائية: مجموعة من الإجراءات القضائية تبدأ بالمطالبة وتنتهي بحكم.\n- المواجهة القضائية: مبدأ قضائي شرعي مؤداه حق الخصم بأن يواجه بما يطرحه خصمه ضده أو ما يتخذه القاضي بشأنه.\n- الحكم النهائي: الحكم الذي لا يقبل الطعن بالطرق العادية (الاستئناف).\n- الحكم البات: الحكم الذي لا يقبل الطعن بأي طريق من طرق الطعن سواء كانت عادية كالاستئناف أو غير عادية كالطعن بالنقض أو التماس إعادة النظر.\n- الحكم القطعي: الحكم الذي يحسم نزاعاً موضوعياً كان أو إجرائياً."
      },
      {
        num: "المادة (3)", int: 3, title: "سريان قانون المرافعات من حيث الزمان",
        content: "يسري قانون المرافعات والتنفيذ المدني على ما لم يكن قد فصل فيه من الدعاوى وما لم يكن قد تم من الإجراءات قبل تاريخ العمل به، ويستثنى من ذلك:\n1- القوانين المعدلة للاختصاص متى كان تاريخ العمل بها بعد إقفال باب المرافعة في الخصومة وقبل البدء في إجراءات التنفيذ.\n2- القوانين المنشئة أو الملغية أو المعدلة لطرق الطعن بالنسبة لما صدر من الأحكام قبل تاريخ العمل بها.\n3- القوانين المعدلة للمواعيد متى كان الميعاد قد بدأ قبل تاريخ العمل بها."
      },
    ]
  );

  // 9. Labor Law No. 5 of 1995
  addLawWithArticles(
    {
      slug: "labor-law-5-1995",
      title: "قانون العمل اليمني",
      num: "5",
      year: 1995,
      date: "1995-03-19",
      auth: "رئيس الجمهورية / مجلس النواب",
      catSlug: "labor",
      status: "ساري",
      source: "بوابة النيابة العامة للجمهورية اليمنية",
      url: "https://www.agoye.gov.ye",
      gazette: "القرار الجمهوري بالقانون رقم (5) لسنة 1995م",
      verif: "موثق من المصدر الرسمي (الباب الأول محقق النص)",
      summary: "التشريع المنظم لعلاقات العمل الفردية والجماعية، عقود العمل، الأجور، ساعات العمل، الإجازات، والتحكيم العمالي.",
    },
    "الباب الأول",
    "أحكام عامة وتعاريف",
    [
      { num: "المادة (1)", int: 1, title: "تسمية القانون", content: "يسمى هذا القانون (قانون العمل)." },
      {
        num: "المادة (2)", int: 2, title: "التعاريف العمالية",
        content: "يقصد بالمصطلحات والعبارات الواردة في هذا القانون المعاني المبينة أمام كل منها أدناه، ما لم تدل القرينة على خلاف ذلك:\n- صاحب العمل: كل شخص طبيعي أو اعتباري يستخدم عاملاً أو أكثر لقاء أجر في مختلف قطاعات العمل الخاضعة لأحكام هذا القانون.\n- العامل: كل شخص يعمل لدى صاحب العمل ويكون تحت إدارته ولو كان بعيداً عن نظارته لقاء أجر ووفق عقد مكتوب أو غير مكتوب، ويشمل ذلك الرجال والنساء والأحداث ومن كان قيد الاختبار والتدريب.\n- الأجر الأساسي: ما يدفعه صاحب العمل للعامل لقاء عمله من مقابل نقدي أو عيني يمكن تقويمه بالعملة، ولا يدخل في ذلك المستحقات الأخرى من غير الأجر الأساسي أياً كان نوعها.\n- الأجر الكامل: ما يدفعه صاحب العمل للعامل لقاء عمله من مقابل نقدي أو عيني يمكن تقويمه بالعملة مضافاً إليه سائر الاستحقاقات الأخرى أياً كان نوعها.\n- العمل العرضي: كل عمل لا يدخل في نشاط صاحب العمل ولا تزيد مدة إنجازه عن أربعة أشهر.\n- العمل الموسمي: كل عمل ينفذ بطبيعته أو بظروفه في مواسم محددة من السنة ولا تزيد مدته عن ستة أشهر متواصلة."
      },
    ]
  );

  // 10. Evidence Law No. 21 of 1992
  addLawWithArticles(
    {
      slug: "evidence-law-21-1992",
      title: "قانون الإثبات اليمني",
      num: "21",
      year: 1992,
      date: "1992-03-29",
      auth: "مجلس الرئاسة (قرار جمهوري بالقانون)",
      catSlug: "evidence",
      status: "ساري (معدل بالقانون رقم 20 لسنة 1996م)",
      source: "بوابة النيابة العامة والمركز الوطني للمعلومات",
      url: "https://www.agoye.gov.ye",
      gazette: "قرار جمهوري بالقانون رقم (21) لسنة 1992م",
      verif: "موثق من المصدر الرسمي (الباب الأول محقق النص)",
      summary: "القانون المنظم لطرق الإثبات الشرعية والقانونية: الدعوى، البينة، الشهادة، الإقرار، اليمين، المحررات الرسمية والعرفية، والخبرة.",
    },
    "الباب الأول - الفصل الأول",
    "الدعوى والإثبات",
    [
      { num: "المادة (1)", int: 1, title: "تعريف الدعوى والإثبات", content: "الدعوى هي: طريق المدعي إلى القضاء للحصول على الحق الذي يدعيه قبل المدعى عليه، والإثبات: إقامة الدليل بالطرق القانونية لإثبات الحق المتنازع عليه أو نفيه." },
      { num: "المادة (2)", int: 2, title: "عبء الإثبات والبينة واليمين", content: "على الدائن إثبات الحق وعلى المدين إثبات التخلص منه، وتكون البينة على المدعي واليمين على من أنكر." },
      { num: "المادة (3)", int: 3, title: "تحديد المدعي والمدعى عليه", content: "المدعي هو من معه أخفى الأمرين، وهو من يدعي خلاف الظاهر، والمدعى عليه هو من معه أظهر الأمرين." },
      { num: "المادة (8)", int: 8, title: "قاعدة سماع الدعوى والبينة", content: "ما لا تسمع فيه الدعوى لا تسمع فيه البينة لا العكس." },
      { num: "المادة (8 مكرر)", int: 9, title: "حظر إثبات الواقعة دون خصومة (مضافة بالقانون 20 لسنة 1996م)", content: "لا يجوز للمحاكم النظر في أية دعوى إلا بعد عرضها على المدعى عليه للرد عليها والدخول في خصومة مع المدعي بشأنها، ويحظر على المحاكم حظراً باتاً النظر في طلب ما يسمى بإثبات الواقعة وإصدار أي قرار بشأنه." },
      { num: "المادة (9)", int: 10, title: "وجوب إجابة المدعى عليه على الدعوى", content: "إذا كان المدعى عليه حاضراً وجب عليه أن يجيب على الدعوى بالإقرار أو الإنكار ولا يشترط اللفظ بل يكفي المعنى، فإن امتنع اعتبر منكراً." },
    ]
  );
}

