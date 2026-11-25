import React from "react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0B162C]">سياسة الخصوصية وشروط الاستخدام</h1>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#1E2430]/85">
          <section>
            <h2 className="text-lg font-bold text-[#0B162C]">1. طبيعة المحتوى القانوني</h2>
            <p className="mt-1">
              تعمل الموسوعة القانونية والقضائية اليمنية على جمع وتنظيم النصوص التشريعية والمبادئ القضائية من مصادرها الرسمية
              لأغراض البحث والاطلاع المهني والأكاديمي. ومع الحرص التام على الدقة، يظل النص المنشور في الجريدة الرسمية للجمهورية اليمنية
              هو المرجع الملزم عند وجود أي تعارض.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#0B162C]">2. حماية بيانات المستخدمين</h2>
            <p className="mt-1">
              تُحفظ كلمات المرور مشفرة بخوارزمية Bcrypt، وتُدار الجلسات عبر ملفات تعريف ارتباط مشفرة (HttpOnly JWT).
              الملاحظات القانونية الخاصة وقوائم المراجع والمفضلة خاصة بحساب المستخدم ولا يطلع عليها غيره.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#0B162C]">3. سجل النشاطات والحوكمة</h2>
            <p className="mt-1">
              يخضع كل تعديل إداري أو تحريري على القوانين أو المواد أو الأحكام أو صلاحيات المستخدمين للتسجيل التلقائي في سجل النشاطات (Audit Log)
              ضماناً للشفافية وسلامة البيانات التشريعية.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
