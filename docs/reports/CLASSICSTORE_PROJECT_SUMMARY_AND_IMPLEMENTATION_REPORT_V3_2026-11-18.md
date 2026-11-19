# ClassicStore: ملخص المشروع وتقرير التنفيذ (المرجع الموحّد)

**Repository:** `mosalah00x-source/classic-store-New`
**تاريخ اللقطة الفنية الأصلية:** 18 نوفمبر 2026
**الإصدار:** V3
**تاريخ مراجعة GitHub:** 19 نوفمبر 2026
**تاريخ إيداع مرجع المشروع:** 19 نوفمبر 2026
**فرع التوثيق:** `docs/project-reference` (مشتق من `BackendApp`)
**الفروع الفنية:** `FrontendApp` (الواجهة) و`BackendApp` (الـ API وقاعدة البيانات)
**الفرع `main`:** لا يُستخدم كأساس لأي عمل (لا يحتوي على مجلد `/frontend`).
**طبيعة المستند:** لقطة مبنية على مراجعة المصادر، وليست شهادة جاهزية للإنتاج.

---

## التغييرات عن V2

| البند | التصحيح في V3 | السبب / الدليل |
|---|---|---|
| V1 | الحالة مكتمل جزئياً: فُحصت الفروع الـ30 وشجراتها، وHEAD/CI، وحالة PRs؛ لم يُفحص Reviews/Comments لكل PR، ولم يُجرَ تحقق بصري | نتائج GitHub الحية في 19 نوفمبر 2026؛ التفصيل في تقرير التحقق |
| موافقة PR #22 و#23 | تسجيلها كقرار PO خارج GitHub بناءً على تصريح المستخدم المكتوب بتاريخ 18 نوفمبر 2026، 15:15:00 UTC؛ لا يوجد Review أو Conversation comment يوثق القرار | تصريح المستخدم الأصلي؛ GitHub يعرض Reviews: 0 وConversation comments: 0 لكل PR |
| فحص الفروع | استبدال العبارة العامة بجدول أسماء الفروع الـ30 وآخر SHA والمسارات التي تحتوي وثائق | GitHub branches API وrecursive tree لكل فرع؛ جميع الأشجار أعادت truncated=false |
| V7 والثيم | القرار مغلق، لكن التنفيذ مفتوح؛ layout.tsx يثبت data-theme=light، وF10 مفتوحة | دليل اللغة والثيم ومراجعة محتواه |
| V3/V4/V5/V7 | فصل حالة القرار عن التنفيذ: قرار مغلق، والتنفيذ مفتوح، مع ربط المهام التابعة | منع مساواة موافقة PO بإتمام المهام |
| مصدر الوثائق | تحديد docs/project-reference كمصدر معتمد، وإضافة provenance headers للنسخ المركزية المنقولة، وتوثيق أصحاب صلاحية التحديث | توحيد المصدر وتقليل انجراف النسخ |
| فهرس الوثائق | تصحيح مصدر PROJECT_REFERENCE_README.md إلى docs/ui-reference / docs/reference/README.md، وإضافة V3 وتقرير التحقق وقواعد المصدر | مسار المصدر السابق غير موجود كما كُتب في الفهرس |
| نسخة V2 المرفوعة | اعتماد V2 الموجود على GitHub كأساس؛ النسخة المرفوعة للمقارنة ليست مطابقة له | مقارنة المحتوى: 42,555 bytes للملف المرفوع مقابل 44,742 bytes لملف GitHub |
| OpenAPI | لم يُضف provenance header إلى openapi.yaml في هذه المهمة | تعارض بين طلب إضافة header إلى OpenAPI والمنع الصريح من تحديث OpenAPI؛ لم يُعدّل الملف |

**حالة V1 بعد التصحيح:** مكتمل جزئياً. المكتمل: فروع GitHub الـ30، آخر SHA لكل فرع، شجرة كل فرع، HEADs، أحدث push CI على HEAD نفسه، وحالة PRs #1–#25. المتبقي: Reviews وConversation comments لكل PR، والتحقق البصري بالمتصفح. لا يُستنتج قبول PO من Ready أو Merge أو CI.

## 0. حالة التحقق من هذا المستند — الإصدار V3

 > **نطاق هذه النسخة:** مراجعة V2 مقابل GitHub الحي بتاريخ 19 نوفمبر 2026، وتصحيح حالات التحقق وقرارات PO وتوحيد مصدر الوثائق. هذه نسخة توثيقية فقط؛ لم تُعدّل فروع التطبيق أو Migrations أو OpenAPI أو PRs.

### مفتاح الحالات

- **مؤكد من GitHub الحي:** تم التحقق منه مباشرةً عبر بيانات المستودع أو Actions أو PRs أو شجرة الملفات.
- **مؤكد بقرار PO:** قرار صريح من مالك المنتج في المحادثة؛ وقد لا يظهر كتعليق داخل GitHub.
- **مؤكد من الكود/المستندات:** نتيجة مراجعة الملفات أو العقود أو الـ schema.
- **غير محسوم:** يحتاج قراراً أو فحصاً إضافياً قبل التنفيذ.
- **غير منفذ:** لم يظهر تنفيذ فعلي في نطاق الملفات التي جرى فحصها؛ ولا يُستنتج التنفيذ من وجود OpenAPI أو جداول قاعدة البيانات وحدها.

**قاعدة توثيق الموافقات:** سجل GitHub يثبت أحداث Ready/Merge ووجود أو غياب Reviews/Comments داخله. أما موافقة PO خارج GitHub فتُسجل هنا باعتبارها تصريحاً مباشراً من PO، دون الادعاء بأنها موجودة في سجل GitHub.

---

## 0.1 موقع هذا المرجع وخريطة الوثائق داخل GitHub

هذا الملف هو نقطة الدخول الرئيسية لتوثيق المشروع على الفرع `docs/project-reference`، والمسار المعتمد له:

- `docs/reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V3_2026-11-18.md` — التقرير الرئيسي بعد مراجعة V2.
- `docs/reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V2_PO_DECISIONS_2026-11-18.md` — نسخة تاريخية لا تُعدّل.
- `docs/README.md` — فهرس الوثائق وروابطها والفروع التي تحتوي عليها.
- `docs/reference/FRONTEND_LANGUAGE_THEME_GUIDE.md` — مرجع اللغة والاتجاه والثيم ومواقع التنفيذ الفعلية في `FrontendApp`.
- `docs/reference/Classic_Store_SRS_v1.1.1.md` — مواصفات المنتج المعتمدة (متاحة على `BackendApp`).
- `docs/api/openapi.yaml` — عقد API (متاح على `BackendApp`).
- `docs/decisions/T-07-identity-derived-contracts.md` و`docs/reports/T-07-identity-implementation-report.md` — قرار وتنفيذ الهوية (متاحان على `BackendApp`).
- `docs/ui-reference/README.md` وملفات `docs/ui-reference/` — مرجع UI ثابت قديم/Prototype على `FrontendApp`، وليس تطبيق Next.js الحالي؛ لا تخلط مساراته أو مفاتيح تخزينه مع التنفيذ الحالي.

**الفرع الأساسي لهذا الإيداع:** `BackendApp` عند SHA `15bb4080cd1e48bbc52141e45a83c0e18987e098` وقت إنشاء الفرع.

---

## 1. الخلاصة التنفيذية

| المحور | الحالة |
|---|---|
| البنية الأساسية للواجهة (Next.js وi18n) | منفذة |
| الكتالوج (القائمة والفلاتر والترتيب والـ pagination) | منفذ وظيفياً، والمطابقة البصرية جزئية |
| تفاصيل المنتج (المعرض، المواصفات، السعر، الخصم، الثيم) | منفذة وظيفياً، وأزرار الشراء غير موجودة |
| شعار CSS Mask | منفذ (PR #23)، والتحقق البصري معلّق |
| الثيم | يوجد تبديل سابق في صفحة المنتج؛ قرار PO الآن يحدد السلوك المستهدف العام، والتنفيذ الموحد ما زال مطلوباً |
| الـ Header والـ Footer المشتركان | **غير منفذين** |
| الصفحة الرئيسية كواجهة متجر | **غير منفذة** (ما زالت Foundation) |
| السلة والـ Checkout وصفحة التأكيد في الواجهة | **غير منفذة** |
| Backend: Identity والكتالوج العام | منفذ |
| Backend: السلة والطلبات والدفع والشحن والإرجاع والمخزون والأدمن | **غير منفذ على مستوى الخدمات** (الجداول موجودة، والـ OpenAPI موجود كعقد فقط) |
| التحقق البصري في المتصفح | **غير منفذ** |

**الاستنتاج:** الأساس التقني والكتالوج وتفاصيل المنتج وCI موجودون. أما المتجر كما في تصميم المرجع (Home وHeader/Footer وCart وCheckout وDone) فلم يكتمل، ورحلة الشراء كاملة غير موجودة بعد.

---

## 2. الفروع وحالة الدمج

### 2.1 الواجهة (`FrontendApp`)

- **HEAD الحي المؤكد:** `dd00ddd5fb6c21800f9928662893a27b4a290d63` (تم التحقق مباشرةً من GitHub بتاريخ 18 نوفمبر 2026)
- **آخر commit:** `feat(frontend): show conditional old price, discount and savings (#25)`، بتاريخ 18 نوفمبر 2026 الساعة 13:47:25 UTC.

### 2.2 الـ Backend (`BackendApp`)

- **HEAD الحي المؤكد:** `15bb4080cd1e48bbc52141e45a83c0e18987e098`، وآخر تغيير بتاريخ 12 نوفمبر 2026. تم التحقق مباشرةً من GitHub بتاريخ 18 نوفمبر 2026.

### 2.3 سجل PRs الواجهة

| PR | النطاق | الحالة | تاريخ الدمج |
|---|---|---|---|
| #3 | Next.js RTL/i18n skeleton | Merged | 9 نوفمبر |
| #8 | Frontend API وAuth | Merged | 12 نوفمبر |
| #9 | نسخة مكررة من T-08 | Closed، غير مدمجة | — |
| #15 | F1a قائمة المنتجات | Merged | 15 نوفمبر |
| #16 | F1a تحسينات بصرية | Merged | 15 نوفمبر |
| #17 | F1b تفاصيل المنتج | Merged | 15 نوفمبر |
| #18 | Null guard لتفاصيل المنتج | Merged | 15 نوفمبر |
| #19 | اختبارات تفاصيل المنتج | Merged | 15 نوفمبر |
| #20 | وثائق مرجع UI | Merged | 15 نوفمبر |
| #21 | CI على كل PR | Merged | 15 نوفمبر |
| #22 | محاذاة الكتالوج والمنتج | Merged | 17 نوفمبر 15:46:48 UTC **[تحقق]** |
| #23 | شعار CSS Mask | Merged | 17 نوفمبر 14:07:15 UTC **[تحقق]** |
| #24 | تبديل الثيم في صفحة المنتج | Merged | 18 نوفمبر **[تحقق]** |
| #25 | السعر القديم والخصم والتوفير الشرطي | Merged | 18 نوفمبر 13:47:25 UTC |

**ترتيب الدمج:** #23 ثم #22 ثم #24 ثم #25. وقاعدة PR #25 (`e27f597`) تحتوي على الثلاثة السابقة.

### 2.4 سجل PRs الـ Backend

| PR | النطاق | الحالة |
|---|---|---|
| #1–4 | قاعدة البيانات، الهيكل، Migrations | Merged |
| #5 | T-06 عقد OpenAPI (69 operation) | Merged، 11 نوفمبر |
| #6 | T-07 Identity | Merged، 12 نوفمبر |
| #7 | Backend Actions v5 | Merged |
| #11 | T-10 عقد الكتالوج | Merged |
| #12 | B-02 واجهات الكتالوج | Merged |
| #13 | ترتيب الكتالوج المستقر | Merged |
| #14 | Brands endpoint | Merged |

لا توجد PRs مفتوحة في قائمة PRs وقت اللقطة. **[تحقق]** قبل بدء أي عمل.

---

## 3. ما تم تنفيذه (Done)

### 3.1 الواجهة

| # | البند | الدليل | الحالة |
|---|---|---|---|
| D1 | Next.js 16.4.5 وReact 19.3 وTypeScript 5.9 وnext-intl | package.json | مؤكد |
| D2 | توجيه `ar` و`en` مع `lang` و`dir` | layout | مؤكد |
| D3 | شعار BrandLogo بـ CSS Mask وألوان Light وDark | PR #23 | مؤكد، التحقق البصري معلّق |
| D4 | قائمة المنتجات: بحث، تصنيف، سعر أدنى وأعلى، ترتيب، Load more، درج فلاتر للجوال | PR #15، #16 | مؤكد |
| D5 | تفاصيل المنتج: معرض، Variants، SKU، ماركة، تصنيفات، وصف | PR #17 إلى #19 | مؤكد |
| D6 | السعر القديم ونسبة الخصم والتوفير (شرطياً) | PR #25 | مؤكد |
| D7 | تبديل الثيم في صفحة المنتج مع حفظ التفضيل | PR #24 | موجود في الصفحة؛ تعميمه على كامل التطبيق مطلوب وفق قرار PO |
| D8 | صفحات Login وRegister وForgot وReset مع Proxy وHttpOnly cookies | PR #8 | مؤكد، يحتاج E2E |
| D9 | حالات Loading وEmpty وError وSuccess | مكونات الواجهة | مؤكد |
| D10 | Proxy للكتالوج على نفس الأصل | `api/catalog/products/route.ts` | مؤكد |
| D11 | اختبارات: الكتالوج، التفاصيل، الأسعار، الرسائل، الحالات، الثيم | tests | مؤكد |

### 3.2 الـ Backend

| # | البند | الدليل | الحالة |
|---|---|---|---|
| B-D1 | Java 21 وSpring Boot 3.4.2 وPostgreSQL 16 | pom.xml | مؤكد |
| B-D2 | Migrations V1 إلى V7 | مجلد الـ migrations | مؤكد كـ schema |
| B-D3 | Identity: تسجيل، دخول، تحديث، خروج، تغيير كلمة المرور، نسيان وإعادة تعيين، `/me`، عناوين CRUD | IdentityController | مؤكد، مع مخاطر مقبولة في SRS |
| B-D4 | الكتالوج العام: منتجات، تفاصيل، تصنيفات، ماركات | CatalogController | مؤكد |
| B-D5 | Rate limiting على الدخول ونسيان كلمة المرور | AuthRateLimiter | مؤكد |
| B-D6 | BCrypt قوة 12، وJWT بعمر 15 دقيقة للوصول و7 أيام للتحديث | TokenService | مؤكد |
| B-D7 | Flyway والتحقق من Migrations في CI | backend-ci.yml | مؤكد |
| B-D8 | عقد OpenAPI بـ 69 operation | docs/api/openapi.yaml | عقد فقط، ليس دليل تنفيذ |

### 3.3 CI

| الجزء | SHA | Run | النتيجة | ملاحظة |
|---|---|---|---|---|
| Frontend | `dd00ddd` | #83 | خطوات الخمس ناجحة | مؤكد من المصدرين |
| Backend | `15bb408` | #108 | ثلاث مهام ناجحة | مؤكد: push على HEAD الحالي |

**تنبيه:** CI ناجح لا يعني مطابقة بصرية، ولا تدفقاً ناجحاً للشراء، ولا قبولاً من PO.

---

## 4. مقارنة UI المرجعي بالتنفيذ الحالي

**مصدر المرجع:** `ui-reference.zip`، وهو نموذج HTML/CSS/JS ثابت يحتوي على ست واجهات: Home وProducts وProduct وCart وCheckout وDone.

**منهجية المقارنة:** مقارنة بنيوية من الكود، وليست عرضاً بصرياً في المتصفح.

| العنصر | المرجع | التطبيق | الفجوة |
|---|---|---|---|
| Header مشترك مع الشعار | موجود في كل الصفحات | غير موجود كـ Shell مشترك | كبيرة |
| Footer مشترك | موجود | غير موجود كـ Shell مشترك | كبيرة |
| Mega menu للتصنيفات | موجود | غير موجود | كبيرة |
| البحث والمفضلة والسلة في الهيدر | موجودة | غير موجودة | كبيرة |
| زر اللغة والثيم في الهيدر | موجودان | الثيم في صفحة المنتج فقط، واللغة في Home وAuth | متوسطة |
| Home: Hero، تصنيفات، الأكثر مبيعاً، عرض ترويجي، وصل حديثاً، خدمات | موجودة | Foundation فقط | كبيرة |
| Catalog: شارات، مفضلة، Add to cart | موجودة | غير موجودة | متوسطة |
| Product: كمية، ملاحظات، مفضلة، CTA شراء | موجودة | غير موجودة | متوسطة |
| السلة (Cart) | موجودة | لا route ولا component ولا store | كبيرة |
| Checkout | موجود | غير موجود في الواجهة، والـ Backend لا يملك Controller له | كبيرة |
| Done (تأكيد الطلب) | موجود | غير موجود | كبيرة |
| English/LTR للمتجر | مدعوم في الست صفحات المرجعية | Catalog وProduct لا تقدمان حالياً دعماً كاملاً وفق الفحص السابق؛ PO اعتمد English/LTR لهما | كبيرة |
| الصور `assets/img/*.jpg` | مراجع في الكود | غير متوفرة في الشجرة المفحوصة؛ `assets/logo.png` موجود فقط، وPO اعتمد placeholders مؤقتة | مشتركة |

### 4.1 أصول مفقودة

- `assets/img/` (hero وpromo وcategory وproduct) غير موجود في الـ ZIP، ولا في شجرة `docs/ui-reference/` **[تحقق]**.
- `assets/logo-original.jpeg` مذكور في الـ README ولم يُرفق.
- النتيجة: المرجع نفسه بصور placeholder، ولا يمكن إثبات مطابقة الصور.

---

## 5. ما تبقى (Remaining) مع التسلسل

كل مهمة لها معرّف ثابت، ومالك، وتبعيات، وشرط إغلاق. **المنفذ** يبني، و**المراجع** يتحقق، و**PO** يعتمد. المراحل تُنفَّذ بالتسلسل، إلا ما ذُكر أنه متوازٍ.

### المرحلة 0: التحقق والقرارات (قبل أي تعديل برمجي)

| ID | المهمة | المالك | يعتمد على | شرط الإغلاق |
|---|---|---|---|---|
| V1 | فحص حي على GitHub: HEAD الحالي لـ FrontendApp وBackendApp، وآخر push runs لكل منهما، وحالة PRs | المراجع | — | SHA وRun IDs ونتائج كل خطوة مكتوبة |
| V2 | حل التعارضات في القسم 7 بدليل | المراجع | V1 | كل تعارض مُغلق |
| V3 | توثيق قرار PO بشأن PR #22 وPR #23 | PO | — | **قرار مغلق، والتنفيذ/التوثيق التشغيلي مفتوح:** التصريح خارج GitHub مؤرخ ومصدره موضح في 12.12؛ لا Review أو Conversation comment في GitHub |
| V4 | الصور المرجعية المفقودة | PO | — | **قرار مغلق، والتنفيذ مفتوح:** استخدام placeholders مؤقتة؛ المهام التابعة F3 وF4 وF5 |
| V5 | دعم اللغة الإنجليزية في Catalog وProduct | PO | — | **قرار مغلق، والتنفيذ مفتوح:** English/LTR كامل؛ المهام التابعة F1 وF4 وF5 وF6 |
| V6 | مستوى `oldPrice` و`discountPercent`: منتج أم Variant | PO + API | — | **مفتوح:** يلزم قرار وتحديث العقد إذا لزم |
| V7 | الثيم الافتراضي وسلوك التخزين الموحّد | PO | — | **قرار مغلق، والتنفيذ مفتوح:** Light افتراضي وDark toggle ومفتاح موحد؛ F1 وF10، وF10 مفتوحة |
| V8 | حسم بنود SRS OPEN: الدفع، الشحن، الضرائب، الإرجاع، صيغة الهاتف، مصدر المحافظات والمدن، صلاحيات الأدمن | PO + Tech | — | قرار لكل بند، أو تأجيل الميزة المعتمدة عليه |
| V9 | تحديد HEAD الحقيقي للـ Backend وإعادة CI إن لزم | المراجع | V1 | Run ناجح على نفس الـ SHA |

### المرحلة 1: أساس الواجهة (لا يحتاج Backend)

| ID | المهمة | المالك | يعتمد على | شرط الإغلاق |
|---|---|---|---|---|
| F1 | Shared Storefront Shell: الشعار، التنقل، Mega menu، البحث، اللغة، الثيم العام، تسجيل الدخول، أيقونة السلة بعداد، Footer | المنفذ | V4، V5، V7 | يظهر على كل مسارات المتجر، ولقطات 1440 و390 في Light وDark وRTL وLTR |
| F2 | قرار حذف شريط التنقل التجريبي `.dn` | PO | — | قرار |
| F3 | Home storefront: Hero، تصنيفات، الأكثر مبيعاً، عرض ترويجي، وصل حديثاً، خدمات | المنفذ | F1، V4 | لقطات وقبول بصري |
| F4 | Catalog: شارات، مفضلة، مطابقة الكروت والمسافات، توحيد لغة الأسماء | المنفذ | F1، V5 | لقطات، واختبار الفلاتر والـ pagination |
| F5 | Product: مفضلة، كمية، ملاحظات، CTA، السعر القديم حسب Variant | المنفذ | F1، V6 | لقطات، وقبول معيار السعر |
| F6 | إزالة redirect الإجباري للعربية، وترجمة النصوص الثابتة | المنفذ | F1، V5 | اختبار LTR لكل الصفحات الثلاث |
| F7 | إزالة تكرار `--color-logo` و`--color-logo-inverted` من `globals.css` | المنفذ | موافقة صريحة | لقطات قبل وبعد متطابقة |
| F8 | تحصين `catalog-api.ts` ضد JSON فارغ، بعد إعادة الخطأ وتحديد سببه | المنفذ | إعادة الخطأ | سبب موثق واختبار |
| F9 | صفحات الحساب: الملف، العناوين، تغيير كلمة المرور | المنفذ | V1 (لتأكيد وجودها) | CRUD يعمل مع الـ API الحالي |
| F10 | تحديد مفتاح ثيم واحد للمشروع كله | المنفذ | V7 | تطبيق عام على كل الصفحات |

### المرحلة 2: Backend التجارة (مسار موازٍ للمرحلة 1)

كل مهمة هنا تشمل: تحديث OpenAPI، وController وService وRepository، واختبارات Testcontainers، وCI ناجح على نفس الـ SHA. جداول V4 وV5 وV6 موجودة، فالمطلوب بناء الكود فوقها.

| ID | المهمة | يعتمد على | ملاحظة |
|---|---|---|---|
| B1 | Cart API للضيف والعميل: إضافة، تعديل كمية، حذف، إجماليات | V9 | جداول V4 |
| B2 | الشحن: مناطق وأسعار | V8 (الشحن) | لا تبدأ قبل القرار |
| B3 | Checkout quote وإنشاء الطلب مع `Idempotency-Key`، وتخصيص المستودع بدالة V6، والحجز | B1، B2، V8 | يرفض `grandTotal` و`status` و`warehouseId` من العميل |
| B4 | الدفع: عند الاستلام أولاً، ثم الإلكتروني مع تحقق خادمي | V8 (الدفع) | الإلكتروني متوقف على اختيار المزود |
| B5 | تتبع الطلب للضيف والعميل | B3 | |
| B6 | الكوبونات والتحقق منها | V8 (العروض) | جداول V2 |
| B7 | الإرجاع والاسترداد والتنفيذ والمخزون والأدمن | B3، V8 | مرحلة لاحقة |

### المرحلة 3: واجهة التجارة (بعد الـ API المقابل)

| ID | المهمة | يعتمد على | شرط الإغلاق |
|---|---|---|---|
| C1 | ربط Add to cart من Catalog وProduct، وتحديث العداد | B1 | سلوك موحد |
| C2 | صفحة السلة: كمية، حذف، إجماليات، كوبون، حالة فارغة | B1، B6 | لقطات وقبول |
| C3 | Checkout: الاتصال، العنوان، المحافظة والمدينة من API، طريقة الدفع، ملخص | B2، B3، B4 | لقطات واختبار الإدخال |
| C4 | صفحة التأكيد وتتبع الطلب | B3، B5 | رقم الطلب والعودة للرئيسية |

### المرحلة 4: القبول والإصدار

| ID | المهمة | ملاحظة |
|---|---|---|
| Q1 | مصفوفة اللقطات: Home، Catalog، Product، Cart، Checkout، Done، بعرض 1440 و390، وLight وDark، وRTL وLTR | لا قبول بدون صور فعلية |
| Q2 | اختبارات E2E للرحلات: تسجيل، بحث، إضافة، شراء عند الاستلام، تتبع | |
| Q3 | Accessibility وoverflow وصور مكسورة | |
| Q4 | مراجعة أمنية مستقلة | **بوابة إصدار إلزامية (AR-03)** |
| Q5 | استبدال الـ mock بالبيانات الحقيقية، وإيقاف `API_MOCKING` في الإنتاج | |

### 5.1 الترتيب الزمني المقترح

1. سجل GitHub الحي ونطاق التحقق موضحان في جدول التغييرات أعلى التقرير وتقرير التحقق المصاحب؛ لا تُفهم نتائج GitHub على أنها قبول PO.
2. قرارات V3 وV4 وV5 وV7 مغلقة كقرارات PO فقط؛ التنفيذ والقبول المرتبطان بها ما زالا مفتوحين وفق المهام التابعة.
3. **قبل بدء التنفيذ:** تحديد أول Task من قائمة العمل المعتمدة وتثبيت الفرع وSHA والملفات ونطاق القبول؛ لا يبدأ التنفيذ بافتراض أن كل القرارات الأخرى محسومة.
4. **بعد تحديد الأولوية:** يمكن بدء F1 على فرع الواجهة، بالتوازي مع B1 على فرع Backend فقط إذا تم اعتماد هذا التوازي وتحديد مالك كل مسار.
5. **بعد F1:** F3 وF4 وF5 وF6 حسب التبعيات، مع استخدام placeholders المعتمدة مؤقتاً.
6. **بعد B1:** C1 وC2. وبعد حسم V8: B2 ثم B3 ثم C3 ثم C4.
7. **بعد الاكتمال:** Q1 إلى Q4، وQ4 شرط إصدار الإنتاج.

---

## 6. قرارات PO وحالة ما تبقى

| # | القرار | القرار المعتمد / الحالة | مرتبط بـ |
|---|---|---|---|
| 1 | قرار PO بشأن PR #22 وPR #23 | **قرار PO خارج GitHub، مسجل بناءً على تصريح مكتوب بتاريخ 18 نوفمبر 2026، 15:15:00 UTC؛ لا يوجد Review أو Conversation comment يوثق القرار** | V3؛ لا توجد مهمة تنفيذية مباشرة لهذا القرار |
| 2 | صور Hero/Promo/Category/Product غير المتوفرة | **قرار مغلق، والتنفيذ مفتوح:** استخدام placeholders مؤقتة | V4، F3، F4، F5 |
| 3 | دعم English/LTR في Catalog وProduct | **قرار مغلق، والتنفيذ مفتوح:** دعم كامل للإنجليزية والاتجاه LTR في الصفحتين | V5، F1، F4، F5، F6 |
| 4 | الثيم الافتراضي | **قرار مغلق، والتنفيذ مفتوح:** Light هو الافتراضي | V7، F1، F10 |
| 5 | التبديل إلى Dark | **قرار مغلق، والتنفيذ مفتوح:** توفير Dark toggle على مستوى التطبيق | V7، F1، F10 |
| 6 | حفظ الثيم | **قرار مغلق، والتنفيذ مفتوح:** مفتاح تخزين واحد موحد عبر جميع الصفحات | V7، F1، F10 |
| 7 | اعتماد `ui-reference.zip` مرجعاً نهائياً، وحدود Header/Footer | **يحتاج تثبيتاً** ضمن نطاق المهمة قبل التنفيذ | F1 |
| 8 | سلوك Add to cart وFavorite وQuantity وNotes | **غير محسوم** | F4، F5، C1 |
| 9 | مستوى `oldPrice` و`discountPercent` (Product أم Variant) | **غير محسوم** | V6، F5 |
| 10 | الدفع والشحن والضرائب والإرجاع والهاتف ومصدر المدن/المحافظات وصلاحيات الأدمن | **غير محسوم حسب SRS OPEN** | V8 |
| 11 | حذف شريط التنقل التجريبي `.dn` | **يحتاج قراراً** | F2 |
| 12 | مصدر صور المنتجات الحقيقية بعد المرحلة المؤقتة | **لاحقاً؛ placeholders معتمدة حالياً** | V4 |

لا تُفسر القرارات المعتمدة على أنها تفويض مفتوح لتعديل أي ملفات أو دمج PRs؛ يظل نطاق كل Task وموافقة التنفيذ والدمج خاضعاً لقواعد الحوكمة في القسم 9.

---

## 7. التعارضات والتصحيحات

| البند | ما قاله المصدر أ | ما قاله المصدر ب | الحكم المؤقت | الإجراء |
|---|---|---|---|---|
| CI الـ Backend الحالي | تقرير الواجهة: Run #108 على `15bb408` هو آخر CI ناجح | ملخص المشروع: الـ SHA والـ Run غير مُعاد تحقيقهما كحاليين | **غير مؤكد** | V1 وV9 |
| إدارة حساب العميل | تقرير الواجهة: "جزئي" | ملخص المشروع: "غير منفذ، لم تُعثر واجهة" | **غير مؤكد** | V1 وفحص `src/app` |
| مكان الشعار | تقرير سابق: في Header وFooter | تقرير الواجهة: في صفحة Home فقط، ولا يوجد Shell مشترك | الأرجح: Header/Footer محليان داخل Home | قراءة `page.tsx` |
| مفتاح تخزين الثيم | الواجهة: `classic-store-theme` | المرجع: `cs-theme` | لا خطأ، لكنه مختلف | V7 وF10 |
| PR #24 | تقرير سابق: "تحقق" | تقرير الواجهة: مدمج 18 نوفمبر | مدمج، والتاريخ **[تحقق]** | V1 |
| تفاصيل Backend | "package marker" | "package-info.java" | نفس المعنى | لا إجراء |

### 7.1 تصحيحات على التقارير السابقة

- التقارير الأسبق أغفلت الـ Backend تماماً، وهذا المستند يغطيه.
- Cart وCheckout وDone صارت **مؤكدة كغير منفذة** في الواجهة.
- تقرير T-06 يقول إن PR #5 غير مدمج، وGitHub يثبت العكس. التصحيح مطلوب كمهمة وثائق مستقلة.
- تقرير T-07 يقول إن PR #6 غير مدمج، وGitHub يثبت العكس. الموافقة تُثبت منفصلة عن الدمج.
- README الـ Backend يصف مشروعاً بلا persistence، وهذا غير صحيح.

---

## 8. سجل أحداث GitHub وحدود الاستنتاج

| PR | الواقعة | التقييم | الحالة |
|---|---|---|---|
| #22 | Ready 15:46:42Z ثم Merged 15:46:48Z يوم 17 نوفمبر 2026؛ Reviews 0 وConversation comments 0 | قرار PO خارج GitHub بتاريخ 18 نوفمبر 2026، 15:15:00 UTC؛ لا يوثقه GitHub | المصدر في 12.12؛ لا استنتاج من الحدث |
| #23 | Ready 14:07:07Z ثم Merged 14:07:15Z يوم 17 نوفمبر 2026؛ Reviews 0 وConversation comments 0 | قرار PO خارج GitHub بتاريخ 18 نوفمبر 2026، 15:15:00 UTC؛ لا يوثقه GitHub | المصدر في 12.12؛ لا استنتاج من الحدث |
| #25 | دُمج في 2026-11-18T13:47:25Z | لا يوجد في هذا الفحص تصريح PO موثق يثبت الموافقة | لا يُستنتج قبول PO من الدمج |

**تنبيه:** هذا تسجيل لواقعة إجرائية، وليس حكماً بأن الكود معيب. نجاح CI لا يعني موافقة، والـ Merge event لا يعني موافقة.

---

## 9. قيود دائمة

- لا دمج لأي PR دون موافقة PO صريحة.
- لا تحويل Draft إلى Ready دون موافقة PO.
- لا Revert لـ PR #22 أو #23 أو #24 أو #25 دون قرار PO منفصل.
- لا Rebase ولا Force Push ولا تعديل تاريخ الفرع.
- لا تعديل بيانات المنتجات أو seed أو mock أو عقد API دون موافقة PO.
- لا إضافة Dependencies دون موافقة صريحة.
- لا استخدام `main` بديلاً عن `FrontendApp` أو `BackendApp`.
- لا ادعاء "مطابق" دون لقطات متصفح فعلية.
- لا ادعاء "ناجح" دون اكتمال كل خطوات CI على نفس الـ SHA.
- لا اعتبار OpenAPI أو وجود Migration أو mock أو CI أخضر دليلاً على تنفيذ الميزة.
- كل SRS OPEN غير محسوم يُسجَّل ولا يُملأ بافتراض.
- لا Stack trace، لا تخمين سبب الخطأ.

---

## 10. قواعد لأي مطور أو وكيل ذكاء اصطناعي ينضم للمشروع

1. اقرأ هذا المستند كاملاً قبل أي تنفيذ.
2. تحقق من GitHub أولاً: الفرع، آخر SHA، حالة PRs، وRuns. هذا المستند لقطة.
3. نفّذ مهمة واحدة في كل مرة، على الفرع المحدد لها فقط، وفي PR واحد.
4. كل تقرير تنفيذ يتضمن: الفرع، Head SHA، Run ID، الملفات المتغيرة، الاختبارات المُشغَّلة، المخاطر، والمتبقي.
5. فصّل دائماً بين: كود منفذ، عقد OpenAPI، schema قاعدة البيانات، mock أو demo، اختبار، وقبول بصري.
6. لا تعتبر PO موافقاً إلا بقرار مكتوب أو تعليق مراجعة موثق.
7. إذا تعارض هذا المستند مع GitHub، فGitHub هو المرجع، ثم حدّث المستند بتاريخ وتفاصيل التعديل.
8. لا تعدّل التقارير التاريخية بصمت. أضف تصحيحاً مؤرخاً.

---

## 11. المراجع

- Repository: https://github.com/mosalah00x-source/classic-store-New
- FrontendApp: https://github.com/mosalah00x-source/classic-store-New/tree/FrontendApp
- BackendApp: https://github.com/mosalah00x-source/classic-store-New/tree/BackendApp
- Frontend CI Run #83: https://github.com/mosalah00x-source/classic-store-New/actions/runs/44317304438
- Backend CI Run #108: https://github.com/mosalah00x-source/classic-store-New/actions/runs/43248197750
- SRS v1.1.1: `docs/reference/Classic_Store_SRS_v1.1.1.md` على `BackendApp`
- OpenAPI: `docs/api/openapi.yaml` على `BackendApp`
- UI reference: `docs/ui-reference/` على `FrontendApp`، و`ui-reference.zip` المرفوع

---

**تاريخ اللقطة:** 18 نوفمبر 2026
**الحالة:** إصدار V2؛ يتضمن فحص GitHub الحي وقرارات PO المؤكدة. يظل التحقق من الحالة الحالية مطلوباً قبل أي تنفيذ لاحق.


---

## 12. ملحق التحقق الحي من GitHub — 18 نوفمبر 2026

**حالة الفحص:** تم إجراء GET مباشر على GitHub Repository API للفرعين، وسجلات Actions، وقائمة Pull Requests، وشجرة الملفات عند HEAD الحالي. لم يتم إجراء أي تعديل على GitHub أو على الفروع.

### 12.1 HEAD الفعلي للفروع

| الفرع | HEAD SHA الكامل | رسالة آخر Commit | تاريخ UTC | النتيجة |
|---|---|---|---|---|
| `FrontendApp` | `dd00ddd5fb6c21800f9928662893a27b4a290d63` | `feat(frontend): show conditional old price, discount and savings (#25)` | `2026-11-18T13:47:25Z` | مطابق للتقرير |
| `BackendApp` | `15bb4080cd1e48bbc52141e45a83c0e18987e098` | `B-02c: Public brands catalog endpoint (#14)` | `2026-11-12T15:28:36Z` | مطابق للتقرير |

روابط التحقق:
- [FrontendApp branch](https://github.com/mosalah00x-source/classic-store-New/tree/FrontendApp)
- [BackendApp branch](https://github.com/mosalah00x-source/classic-store-New/tree/BackendApp)

### 12.2 التحقق من CI على نفس HEAD

| الفرع | Run | الحدث | SHA | النتيجة |
|---|---:|---|---|---|
| FrontendApp | [#83](https://github.com/mosalah00x-source/classic-store-New/actions/runs/44317304438) | `push` | `dd00ddd5fb6c21800f9928662893a27b4a290d63` | Success |
| BackendApp | [#108](https://github.com/mosalah00x-source/classic-store-New/actions/runs/43248197750) | `push` | `15bb4080cd1e48bbc52141e45a83c0e18987e098` | Success |

**Frontend Run #83 — الوظائف والخطوات:**
- Job `frontend`: Success.
- Install dependencies: Success.
- Lint: Success.
- Typecheck: Success.
- Unit tests: Success.
- Production build: Success.
- خطوات الإعداد والتنظيف وإغلاق Job: Success.

**Backend Run #108 — الوظائف والخطوات:**
- `verify migrations`: Success، بما في ذلك PostgreSQL 16، التحقق من ملفات Migrations والـ lock، tamper detection، تطبيق migrations على قاعدة نظيفة، idempotence، وقيود قاعدة البيانات.
- `api-lint`: Success، بما في ذلك Redocly lint.
- `backend`: Success، بما في ذلك `./mvnw -B verify`.

**الحكم:** التعارض السابق حول Run #108 أُغلق: هو بالفعل حدث `push` على `BackendApp`، وعلى نفس SHA الموجود حالياً على الفرع. وكذلك Run #83 هو push على HEAD الحالي للواجهة. هذا إثبات CI فقط، وليس قبولاً بصرياً أو موافقة PO.

### 12.3 حالة Pull Requests حسب قائمة GitHub الحالية

استناداً إلى قائمة PRs التي أعادها GitHub:

| PR | الحالة | Merge commit / ملاحظة |
|---|---|---|
| #1–#8 | Merged | لكل PR سجل دمج |
| #9 | Closed, not merged | `merged=false` و`merged_at=null` |
| #10–#25 | Merged | لكل PR سجل دمج |

ملاحظة مهمة: قيمة `merge_commit_sha` التي قد تظهر في PR مغلق غير مدمج لا تجعل PR مدمجاً. المرجع الحاسم هنا هو `merged` و`merged_at`. لذلك #9 مغلق وغير مدمج.

روابط PRs: [قائمة Pull Requests](https://github.com/mosalah00x-source/classic-store-New/pulls?q=is%3Apr).

### 12.4 PR #22 وPR #23 — أحداث Timeline وعدادات GitHub

| PR | Ready for review (UTC) | Merged (UTC) | Reviews | Conversation comments | Merge commit |
|---|---|---|---:|---:|---|
| #22 | `2026-11-17T15:46:42Z` | `2026-11-17T15:46:48Z` | 0 | 0 | `c21a089e69477bf033c0e149835ce1d6b474754a` |
| #23 | `2026-11-17T14:07:07Z` | `2026-11-17T14:07:15Z` | 0 | 0 | `c3734268fa3a76ff63bc20f504665198063560c7` |

مصدر التوقيت: Timeline لكل PR. مصدر الأعداد: Review submissions وConversation comments في GitHub. هذه الأحداث والأعداد لا تثبت موافقة PO ولا تنفي تصريحاً خارج GitHub.

روابط: [PR #22](https://github.com/mosalah00x-source/classic-store-New/pull/22) · [PR #23](https://github.com/mosalah00x-source/classic-store-New/pull/23)

### 12.5 التحقق من قاعدة PR #25 وسلسلة الدمج

تم فحص علاقات الآباء للـ commits:
- PR #25 الحالي على `FrontendApp` هو `dd00ddd...`، ووالده `e27f5977a12127bc52195c64700f62d82c87d815`.
- `e27f597...` هو merge commit الخاص بـ PR #24، ووالده `c21a089...` الخاص بـ PR #22.
- `c21a089...` والده `c373426...` الخاص بـ PR #23.

إذن قاعدة PR #25 تحتوي في تاريخها على PRs #23 و#22 و#24، بالترتيب التاريخي: #23 ثم #22 ثم #24، ثم #25.

### 12.6 فحص شجرة Frontend عند HEAD

المسار `frontend/src/app` يحتوي على:
- `[locale]/page.tsx`
- `[locale]/products/page.tsx`
- `[locale]/products/[slug]/page.tsx`
- صفحات `login` و`register` و`forgot-password` و`reset-password`
- API routes الخاصة بـ auth وcatalog.

نتائج التحقق:
- `frontend/src/app/page.tsx` غير موجود في الشجرة.
- الصفحة الرئيسية الحالية هي `frontend/src/app/[locale]/page.tsx`.
- لم تظهر مسارات أو مكونات باسم أو دلالة `profile` أو `addresses`.
- لم تظهر مسارات أو مكونات `cart` أو `checkout` أو `done` أو `order` في `frontend/src`.
- مجلد `docs/ui-reference/assets/` يحتوي على `logo.png` فقط. لم يظهر `assets/img/` ولا صور hero/category/product التي يتطلبها المرجع.
- وجود `logo.png` يصحح أي تعميم بأن مجلد assets كله غير موجود؛ الموجود هو صورة الشعار فقط.

### 12.7 فحص شجرة Backend عند HEAD

ملفات Controllers وServices ذات الصلة التي ظهرت في الشجرة:
- `catalog/CatalogController.java`
- `catalog/CatalogService.java`
- `identity/IdentityController.java`
- `identity/IdentityService.java`
- `identity/PasswordResetTokenService.java`
- `identity/TokenService.java`

لم تظهر Controllers أو Services للسلة أو الطلبات أو Checkout أو Payments أو Shipping أو Returns أو Fulfillment. وجود جداول Migrations أو عمليات OpenAPI لا يثبت وجود تنفيذ خدمة فعلي.

### 12.8 جدول التحقق من المصادر

| البند | المتوقع من التقرير | الموجود فعلياً | الحالة |
|---|---|---|---|
| Frontend HEAD | `dd00ddd...` | نفس SHA | مؤكد |
| Backend HEAD | `15bb408...` | نفس SHA | مؤكد |
| Frontend CI #83 | push ناجح على HEAD | push ناجح، كل خطوات الوظيفة ناجحة | مؤكد |
| Backend CI #108 | push ناجح على HEAD | push ناجح، الوظائف الثلاث ناجحة | مؤكد |
| PR #9 | نسخة مكررة مغلقة | Closed و`merged=false` | مؤكد |
| #22 و#23 موافقة PO | غير مثبتة | لا Reviews ولا Conversation comments؛ Ready ثم Merge خلال ثوانٍ | لا يوجد دليل موافقة على GitHub |
| `frontend/src/app/page.tsx` | يحتاج التحقق | غير موجود | مؤكد |
| `frontend/src/app/[locale]/page.tsx` | الصفحة الرئيسية | موجود | مؤكد |
| صفحات حساب العميل | جزئي/غير منفذ | لا profile أو addresses routes/components ظاهرة في الشجرة | مؤكد ضمن مسارات الشجرة المفحوصة |
| Cart/Checkout/Done في الواجهة | غير منفذة | لا routes/components ظاهرة | مؤكد ضمن الشجرة المفحوصة |
| Cart/Orders services في Backend | غير منفذة | لا Controllers/Services ظاهرة | مؤكد ضمن الشجرة المفحوصة |
| صور UI المرجعية | assets/img مفقود | `assets/logo.png` فقط | تصحيح جزئي للتقرير |

### 12.9 إحالة حالة V1

الحالة التفصيلية الوحيدة لـ V1 موضحة في جدول التغييرات أعلى التقرير. وترد قائمة الفروع والمسارات ونتائج فحص كل شجرة في القسم 12.13 وتقرير التحقق المصاحب. لا تُعاد صياغة حالة V1 هنا حتى لا تظهر حالات متعارضة.

### 12.10 حدود الاستنتاج من أحداث GitHub

Ready وMerged أحداث حالة وتوقيت فقط. لا تُعدّ أي منهما موافقة PO. كما لا تُنسب موافقة PR #25 إلى PO في هذا التقرير لعدم وجود تصريح PO موثق ضمن نطاق هذه المراجعة.

### 12.11 نطاق التحقق

تفاصيل الأدلة والقيود وقائمة التحقق اليدوي موجودة في تقرير التحقق المصاحب. هذا التقرير لا يغيّر كود التطبيق أو الفروع الفنية.



---

## 12.12 سجل قرارات PO — مراجعة V3 بتاريخ 19 نوفمبر 2026

| الرمز | القرار كما صدر من PO | الأثر | حالة القرار | حالة التنفيذ والمهام التابعة |
|---|---|---|---|---|
| V3 | «نعم، كانت هناك موافقة مني» بشأن دمج PR #22 وPR #23 | قرار PO خارج GitHub، مُسجَّل بناءً على تصريح مكتوب من المستخدم بتاريخ 18 نوفمبر 2026، 15:15:00 UTC. لا يوجد Review أو Conversation comment في GitHub يوثق هذا القرار. | مغلق | لا توجد مهمة تنفيذية مباشرة تابعة لهذا القرار؛ لا يعني ذلك قبولاً بصرياً أو اعتماداً عاماً للكود |
| V4 | اعتماد placeholders مؤقتة للصور المرجعية غير المتوفرة | يسمح باستخدام بدائل مؤقتة ولا يجعلها الصور النهائية | مغلق | مفتوح: F3 وF4 وF5 |
| V5 | اعتماد دعم English/LTR كامل في Catalog وProduct | يلزم دعم النصوص والاتجاه والتخطيط الإنجليزي | مغلق | مفتوح: F1 وF4 وF5 وF6 |
| V7 | Light افتراضي، Dark toggle، ومفتاح تخزين موحد عبر جميع الصفحات | سياسة الثيم المعتمدة على مستوى التطبيق | مغلق | مفتوح: F1 وF10؛ F10 مفتوحة صراحةً |

### توضيح مصدر قرار PR #22 وPR #23

مصدر القرار هو تصريح المستخدم المكتوب في المحادثة بتاريخ 18 نوفمبر 2026 عند 15:15:00 UTC، ونصه: «نعم، كانت هناك موافقة مني». يثبت GitHub أن PR #22 وPR #23 انتقلا إلى Ready ثم Merged في التوقيتات المبينة في 12.4، وأن Reviews = 0 وConversation comments = 0. لا يُنسب تصريح PO إلى GitHub ولا يُستنتج من أحداثه.

### حالة تنفيذ قرار V7

قرار V7 مغلق، لكن ذلك لا يعني اكتمال التنفيذ. دليل docs/reference/FRONTEND_LANGUAGE_THEME_GUIDE.md يذكر أن frontend/src/app/[locale]/layout.tsx يعرض data-theme="light" بصورة ثابتة، وأن ربطه بآلية التفضيل المشتركة واستعادة الثيم عبر الصفحات ما زال مطلوباً. لذلك تظل F10 مفتوحة، ويظل تطبيق الثيم العام ضمن F1/F10 غير منفذ حتى إثباته بالكود والاختبارات واللقطات المطلوبة.

### ما لا تحسمه قرارات V3/V4/V5/V7

لا تحسم هذه القرارات مستوى oldPrice وdiscountPercent، أو سلوك Add to cart/Favorite/Quantity/Notes، أو بنود SRS OPEN، أو حذف .dn، أو أولوية المهام. تظل تلك البنود مفتوحة حتى يصدر قرار مستقل أو يُحدد نطاق Task لا يعتمد عليها.

---
## 12.13 فحص الفروع الـ30 — أسماء وHEAD ومسارات الوثائق

تم استرجاع قائمة الفروع من GitHub وفحص recursive tree لكل فرع عند SHA الموضح. جميع استجابات الشجرة أعادت truncated=false. مسارات frontend/src/app/api هي كود وليست وثائق، ولذلك لم تُدرج كوثائق.

| الفرع | SHA وقت الفحص (قبل نشر V3) | الوثائق/المراجع الموجودة في الشجرة |
|---|---|---|
| BackendApp | 15bb4080cd1e48bbc52141e45a83c0e18987e098 | docs/api/T06-acceptance-report.md; docs/api/openapi.yaml; docs/decisions/T-07-identity-derived-contracts.md; docs/reference/Classic_Store_SRS_v1.1.1.md; docs/reports/T-07-identity-implementation-report.md |
| FrontendApp | dd00ddd5fb6c21800f9928662893a27b4a290d63 | docs/ui-reference/README.md; docs/ui-reference/assets/logo.png; docs/ui-reference/css/base.css; docs/ui-reference/css/pages.css; docs/ui-reference/index.html; docs/ui-reference/js/i18n.js; docs/ui-reference/js/main.js; docs/ui-reference/js/store.js |
| ci/t12-frontend-ci-all-prs | b23c9e846d29103532b440df5d2ae14562bd7e53 | لا توجد وثائق مطابقة للنطاق |
| docs/project-reference | 6a1cd7b56528677dce0231ec36c20aacbaf5f74e | docs/README.md; docs/api/T06-acceptance-report.md; docs/api/openapi.yaml; docs/decisions/T-07-identity-derived-contracts.md; docs/reference/BACKEND_README.md; docs/reference/Classic_Store_Project_Master_Reference_AR.md; docs/reference/Classic_Store_SRS_v1.1.1.md; docs/reference/FRONTEND_LANGUAGE_THEME_GUIDE.md; docs/reference/PROJECT_REFERENCE_README.md; docs/reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V2_PO_DECISIONS_2026-11-18.md; docs/reports/T-07-identity-implementation-report.md; docs/ui-reference/README.md |
| docs/ui-reference | f995cb19eb87d4e16e07b67e1df0f4ea226f173d | db/reference/Classic_Store_Consolidated_V1-V7.sql; docs/reference/Classic_Store_Project_Master_Reference_AR.md; docs/reference/README.md; docs/ui-reference/README.md; docs/ui-reference/assets/logo.png; docs/ui-reference/css/base.css; docs/ui-reference/css/pages.css; docs/ui-reference/index.html; docs/ui-reference/js/i18n.js; docs/ui-reference/js/main.js; docs/ui-reference/js/store.js |
| docs/ui-reference-pr | 3a805ab39f252f5424199af84e1d1a0bd96744a3 | docs/ui-reference/README.md; docs/ui-reference/assets/logo.png; docs/ui-reference/css/base.css; docs/ui-reference/css/pages.css; docs/ui-reference/index.html; docs/ui-reference/js/i18n.js; docs/ui-reference/js/main.js; docs/ui-reference/js/store.js |
| feat/frontend-logo-mask | 238906994b24d3e26c65f67d1155e6cb0bf911eb | docs/ui-reference/README.md; docs/ui-reference/assets/logo.png; docs/ui-reference/css/base.css; docs/ui-reference/css/pages.css; docs/ui-reference/index.html; docs/ui-reference/js/i18n.js; docs/ui-reference/js/main.js; docs/ui-reference/js/store.js |
| feat/frontend-product-price-detail | 62daf03803bad719eb4a6346ac109623e5406371 | docs/ui-reference/README.md; docs/ui-reference/assets/logo.png; docs/ui-reference/css/base.css; docs/ui-reference/css/pages.css; docs/ui-reference/index.html; docs/ui-reference/js/i18n.js; docs/ui-reference/js/main.js; docs/ui-reference/js/store.js |
| feat/frontend-theme-toggle | 3f4fccc4309000a268126578f8c3edd51c354d10 | docs/ui-reference/README.md; docs/ui-reference/assets/logo.png; docs/ui-reference/css/base.css; docs/ui-reference/css/pages.css; docs/ui-reference/index.html; docs/ui-reference/js/i18n.js; docs/ui-reference/js/main.js; docs/ui-reference/js/store.js |
| feature/b02-catalog-read | 1a9f582a844936237707dc855cc4be4479dd6bfa | docs/api/T06-acceptance-report.md; docs/api/openapi.yaml; docs/decisions/T-07-identity-derived-contracts.md; docs/reference/Classic_Store_SRS_v1.1.1.md; docs/reports/T-07-identity-implementation-report.md |
| feature/b02c-brands | 4bbfdb98b990a55df820d59ce1f1dae08d7768fc | docs/api/T06-acceptance-report.md; docs/api/openapi.yaml; docs/decisions/T-07-identity-derived-contracts.md; docs/reference/Classic_Store_SRS_v1.1.1.md; docs/reports/T-07-identity-implementation-report.md |
| feature/b02d-stable-ordering | a676c35f93aeac961d44bd3efaab8b3b50bbfc5a | docs/api/T06-acceptance-report.md; docs/api/openapi.yaml; docs/decisions/T-07-identity-derived-contracts.md; docs/reference/Classic_Store_SRS_v1.1.1.md; docs/reports/T-07-identity-implementation-report.md |
| feature/f1-ui-align | 576d41378a2b222eeca6db5e7316aa1f8cc9a453 | docs/ui-reference/README.md; docs/ui-reference/assets/logo.png; docs/ui-reference/css/base.css; docs/ui-reference/css/pages.css; docs/ui-reference/index.html; docs/ui-reference/js/i18n.js; docs/ui-reference/js/main.js; docs/ui-reference/js/store.js |
| feature/f1a-fix-visual | c553593e9a486720d56521962de4de04ddce3d44 | لا توجد وثائق مطابقة للنطاق |
| feature/f1a-products-list | 157645ff0ca68bf6afb50a1f770e921ae0a938e4 | لا توجد وثائق مطابقة للنطاق |
| feature/f1b-page-tests | 92fa91454db8c5e44f571ff262b05859b67d3595 | لا توجد وثائق مطابقة للنطاق |
| feature/f1b-product-detail | eb68939d0b04426d03e587a0aebb166b754b6c32 | لا توجد وثائق مطابقة للنطاق |
| feature/t01-citext-schema | 7d76159958351d2682ca2c6ce10816cd42583717 | db/reference/Classic_Store_Consolidated_V1-V7.sql; docs/reference/Classic_Store_Project_Master_Reference_AR.md |
| feature/t03-backend-skeleton | f7ca43007ecce38b15e15da452792c2f5dcc660c | لا توجد وثائق مطابقة للنطاق |
| feature/t04-frontend-skeleton | 524c632157abc67f97a0127c393d06bb24570c3f | لا توجد وثائق مطابقة للنطاق |
| feature/t05-flyway-migrations | cc360e6cbc0fea7e815199c0c5b0d0e491475810 | لا توجد وثائق مطابقة للنطاق |
| feature/t06-openapi-v1-draft | 93a3931660750c270057b0fb7159f500458f1a87 | docs/api/T06-acceptance-report.md; docs/api/openapi.yaml; docs/reference/Classic_Store_SRS_v1.1.1.md |
| feature/t07-identity | 1707062cf8118c6bf4ac8e8b166c4ff65adc1661 | docs/api/T06-acceptance-report.md; docs/api/openapi.yaml; docs/decisions/T-07-identity-derived-contracts.md; docs/reference/Classic_Store_SRS_v1.1.1.md; docs/reports/T-07-identity-implementation-report.md |
| feature/t08-frontend-api-auth | 3e4cc0f5a9535de9e6b94ed2753861f29d9e4c6e | لا توجد وثائق مطابقة للنطاق |
| feature/t08-frontend-auth | 51b6ea1e054966dc4d97c3d18a665af60db4e7db | لا توجد وثائق مطابقة للنطاق |
| feature/t09-actions-v5 | 3314685020e93b1cdbf583094bee75abc731e9f5 | docs/api/T06-acceptance-report.md; docs/api/openapi.yaml; docs/decisions/T-07-identity-derived-contracts.md; docs/reference/Classic_Store_SRS_v1.1.1.md; docs/reports/T-07-identity-implementation-report.md |
| feature/t09b-frontend-actions-v5 | 2e01754e1252482162f9222c4af7676015b98e2c | لا توجد وثائق مطابقة للنطاق |
| feature/t10-catalog-contract | 84285db84c479827bafdb6c4c4a816126eca1dd4 | docs/api/T06-acceptance-report.md; docs/api/openapi.yaml; docs/decisions/T-07-identity-derived-contracts.md; docs/reference/Classic_Store_SRS_v1.1.1.md; docs/reports/T-07-identity-implementation-report.md |
| fix/f1b-product-detail-null-guard | 33e6f0fd3e4bac8bd3b350abb2be55352d01db1b | لا توجد وثائق مطابقة للنطاق |
| main | 0c6e9f1ad9614aba87e2a91b5e7f5f3c72b4ee85 | db/reference/Classic_Store_Consolidated_V1-V7.sql; docs/reference/Classic_Store_Project_Master_Reference_AR.md |

**توضيح لقطة SHA:** الجدول يسجل SHA لكل فرع وقت الفحص وقبل نشر V3. كان فرع docs/project-reference عند 6a1cd7b56528677dce0231ec36c20aacbaf5f74e وقت الفحص، ثم تقدم إلى commit نشر V3 الموضح في سجل GitHub. بقية الفروع لم تُعدّل ضمن هذه المهمة.

**ملاحظة عن مرجع SQL:** ظهر db/reference/Classic_Store_Consolidated_V1-V7.sql على main وdocs/ui-reference وfeature/t01-citext-schema. لم يُنقل أو يُعدّل لأنه ملف SQL مرجعي تقني خارج قائمة الوثائق المركزية، ولتجنب أي تغيير على ملفات قاعدة البيانات ضمن هذه المهمة. يحتاج قرار PO منفصل إذا كان مطلوباً إدراجه كمرجع مركزي.

---

## 13. سجل إصدار التقرير

| الإصدار | التاريخ | التغييرات |
|---|---|---|
| V1 | 18 نوفمبر 2026 | تقرير ملخص المشروع مع نتائج GitHub الحية والتصحيحات الفنية. |
| V2 | 18 نوفمبر 2026 | إضافة قرارات PO لـ V3/V4/V5/V7 وتحديث حالة الفجوات. |
| V2.1 (Repository publication) | 19 نوفمبر 2026 | إضافة موقع الملف وخريطة الوثائق ودليل اللغة والثيم. |
| V3 | 19 نوفمبر 2026 | تصحيح حالة V1، توثيق مصدر تصريح PO وتوقيت PRs، فحص الفروع الـ30، فصل القرارات عن التنفيذ، وتصحيح فهرس المصدر المعتمد. |

**سجل الإيداع:** V3 منشور على docs/project-reference. لم تُعدّل فروع التطبيق أو Migrations أو OpenAPI أو PRs. تقرير التحقق المصاحب يوضح الأدلة وقيود النطاق.