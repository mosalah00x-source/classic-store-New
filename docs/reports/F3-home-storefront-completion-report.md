# F3 — Home Storefront Completion Report

**تاريخ التوثيق:** 2026-11-22  
**المستودع:** `mosalah00x-source/classic-store-New`  
**فرع التوثيق:** `docs/project-reference`  
**PR:** [#27 — feat(frontend): build bilingual storefront home page](https://github.com/mosalah00x-source/classic-store-New/pull/27)  
**الحالة الفعلية:** مدمج (Squash merge)  
**FrontendApp بعد الدمج:** `896fe55515a4640c0cd36f6ba4f204afc329ebba`

## 1. ملخص النطاق المنفذ

نفّذ PR #27 صفحة Home باللغتين العربية والإنجليزية، مع دعم RTL/LTR، واستعمال هيكل F1 المشترك (Header/Footer/Locale switcher/Theme)، ويشمل:
- Hero ورسالة وزر انتقال إلى المنتجات.
- تصنيفات الجذر من Catalog API.
- قسمي Best Sellers وNew Arrivals من بيانات Catalog API.
- Promo banner ثابت وثلاث بطاقات خدمات.
- حالات Loading وEmpty وError المشتركة.
- نصوص واجهة Home في `messages/ar.json` و`messages/en.json`.
- تنسيق Responsive ودعم الثيم الفاتح والداكن، مع صور Placeholder بدلاً من صور إنتاجية.

**قيود وظيفية موثقة في PR:** لا يوفر Catalog API ترتيب مبيعات؛ لذلك يعرض Best Sellers أول أربعة منتجات من ترتيب newest مع ملاحظة توضيحية، ويعرض New Arrivals المنتجات الأربعة التالية من نفس الصفحة لتجنب تكرار البطاقات. كما أن صور الأقسام/المنتجات ما زالت placeholders.

## 2. حالة PR ومصادر الموافقة

| البند | النتيجة الفعلية | الدليل |
|---|---|---|
| PR state | closed + merged | [PR #27](https://github.com/mosalah00x-source/classic-store-New/pull/27) |
| Base | `FrontendApp`، SHA `eea323cde726ef17666525bb047f4c2e093af1ac` | بيانات PR |
| Head | `779b7a505e2f0e59f315eddb99c6641d129cbb20` | بيانات PR |
| Merge commit | `896fe55515a4640c0cd36f6ba4f204afc329ebba` | [Merge commit](https://github.com/mosalah00x-source/classic-store-New/commit/896fe55515a4640c0cd36f6ba4f204afc329ebba) |
| Ready event | 2026-11-22 13:18:32 UTC، بواسطة `mosalah00x-source` | GitHub issue events |
| Merge event | 2026-11-22 13:18:38 UTC، بواسطة `mosalah00x-source` | GitHub issue events |
| Reviews | 0 | GitHub PR reviews |
| Conversation comments بعد تسجيل الموافقة | 1 | [تعليق موافقة PO](https://github.com/mosalah00x-source/classic-store-New/pull/27#issuecomment-7079714545) |
| موافقة PO على الدمج | موجودة بمصدرها: تعليق GitHub بتاريخ 2026-11-22 13:18:26 UTC | رابط التعليق أعلاه |

### نص تعليق موافقة PO المسجل حرفياً

> موافقة PO على دمج PR #27 (F3 Home Storefront).
>
> القرارات:
> 1. التحقق البصري: مقبول بالنطاق المحدد في تعليق التنازل (Home العربية 1440 Light/Dark، Home العربية 390 Light، Home الإنجليزية 1440 Light).
> 2. فجوة الإنجليزية: مقبولة كخيار (أ). نصوص fallback تبقى حتى تتوفر nameEn في بيانات API. هذا شرط على البيانات، ولا يُعتبر عيباً في الكود.
>
> غير المغطى بالتحقق البصري (لا يشمله القرار): Home الإنجليزية Dark، Home الإنجليزية 390، Home العربية 390 Dark.
>
> الدمج معتمد.

**ملاحظة سجل التنازل:** لم يظهر تعليق مستقل منفصل بعنوان/نص «تنازل PO عن مصفوفة اللقطات الـ8». النص المنشور أعلاه هو تعليق الموافقة الذي يحدد نطاق اللقطات المقبول وغير المغطى. لا ننسب إلى GitHub تعليق تنازل منفصلاً غير موجود.

## 3. Commits داخل PR #27

| SHA مختصر | الرسالة |
|---|---|
| `445ed832c5c0` | feat(frontend): build bilingual storefront home page |
| `914c431d688e` | fix(frontend): tighten Home section semantics and tests |
| `6a88cfc255ae` | test(frontend): fix Home locale literal assertion |
| `cf7c4db8c5bb` | test(frontend): make Home locale assertion robust |
| `b567e308a930` | fix(frontend): localize Home language label |
| `a309d264374a` | fix(frontend): align Home promo and service copy with reference |
| `108f8f90b8d1` | fix(frontend): clarify Home shipping service copy |
| `9c295a4a3631` | fix(frontend): keep Home image rendering server compatible |
| `c290fc604ab4` | fix(frontend): keep Home English content locale-safe |
| `9d5ce5b5bea7` | test(frontend): assert English Home fallbacks contain no Arabic |
| `1d732982e6eb` | test(frontend): scope Home fallback locale assertion |
| `779b7a505e2f` | fix(frontend): show Best Sellers fallback note only with data |

### الملفات السبعة المتغيرة

| الملف | الحالة |
|---|---|
| `frontend/src/app/[locale]/page.tsx` | modified |
| `frontend/src/app/globals.css` | modified |
| `frontend/src/components/HomeStorefront.tsx` | added |
| `frontend/src/lib/home-content.ts` | added |
| `frontend/src/messages/ar.json` | modified |
| `frontend/src/messages/en.json` | modified |
| `frontend/tests/home-storefront.test.tsx` | added |

كل الملفات المتغيرة ضمن `frontend/`، ولا يوجد تغيير خارج نطاق Frontend.

## 4. CI والتحقق

### Run #107 على Head SHA

- Run ID: `45024248858`
- [GitHub Actions Run #107](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45024248858)
- Head SHA: `779b7a505e2f0e59f315eddb99c6641d129cbb20`
- النتيجة العامة: success
- Job: `frontend`، Job ID: `137213655151`

| الخطوة | النتيجة |
|---|---|
| Install dependencies | PASS |
| Lint | PASS |
| Typecheck | PASS |
| Unit tests | PASS |
| Production build | PASS |

### CI على Merge SHA

لم يُرجع GitHub أي workflow run أو commit status على Merge SHA `896fe55515a4640c0cd36f6ba4f204afc329ebba` وقت التحقق.

**الحالة: UNVERIFIED.** نجاح Run #107 على Head لا يثبت نجاح CI على Merge SHA.

## 5. مقارنة نطاق Home بالمرجع

| العنصر | التنفيذ/الحالة الفعلية |
|---|---|
| Hero | منفذ؛ copy وزر CTA إلى المنتجات |
| التصنيفات | منفذة؛ بيانات الجذر من Catalog API |
| الأكثر مبيعاً | منفذ كقسم؛ يستخدم أحدث المنتجات كبديل لعدم وجود sort للمبيعات، مع ملاحظة توضيحية |
| الترويجي | منفذ كـ static promo banner |
| الأحدث | منفذ؛ العناصر الأربعة التالية من newest ordering |
| الخدمات | ثلاث بطاقات نصية ثابتة |
| Loading / Empty / Error | منفذة باستخدام المكونات المشتركة |
| AR / RTL | منفذ؛ ضمن التحقق البصري في 1440 Light و1440 Dark و390 Light |
| EN / LTR | منفذ؛ ضمن التحقق البصري في 1440 Light فقط |
| Light / Dark | دعم الثيمين موجود؛ التحقق البصري المرفق لا يغطي كل التركيبات |
| Responsive | قواعد responsive منفذة؛ التحقق البصري الفعلي محدود باللقطات المحددة أدناه |
| الصور | placeholders؛ ليست صور إنتاجية |

## 6. مصفوفة اللقطات الثمانية

المرفق البصري الذي راجعه PO يتضمن أربع حالات من أصل ثمانٍ:

| اللغة | العرض | الثيم | التغطية |
|---|---:|---|---|
| EN | 1440 | Light | مغطى |
| EN | 1440 | Dark | غير مغطى |
| EN | 390 | Light | غير مغطى |
| EN | 390 | Dark | غير مغطى |
| AR | 1440 | Light | مغطى |
| AR | 1440 | Dark | مغطى |
| AR | 390 | Light | مغطى |
| AR | 390 | Dark | غير مغطى |

قبول PO ينطبق على الحالات الأربع المغطاة فقط. الحالات الأربع الأخرى لا يشملها التنازل أو القبول البصري.

## 7. فجوة الأسماء الإنجليزية وقرار PO

في حالة غياب `nameEn` أو كونه فارغاً، لا يعرض Home الاسم العربي في الواجهة الإنجليزية؛ بل يعرض fallback:
- `Category name unavailable in English`
- `Product name unavailable in English`

هذا السلوك مثبت في [home-content.ts](https://github.com/mosalah00x-source/classic-store-New/blob/FrontendApp/frontend/src/lib/home-content.ts) ومختبر في `home-storefront.test.tsx`.

**قرار PO الحرفي من تعليق GitHub:** «فجوة الإنجليزية: مقبولة كخيار (أ). نصوص fallback تبقى حتى تتوفر nameEn في بيانات API. هذا شرط على البيانات، ولا يُعتبر عيباً في الكود.»

بالتالي تظل بيانات `nameEn` للتصنيفات والمنتجات فجوة مفتوحة على جانب API/البيانات، ولا تُسجل كعيب كود في F3.

## 8. تحقق يدوي مطلوب / بنود مفتوحة

1. توفير ومراجعة بيانات `nameEn` للتصنيفات والمنتجات من API/المحتوى.
2. التقاط ومراجعة الحالات البصرية غير المغطاة: EN Dark 1440، EN Light 390، EN Dark 390، AR Dark 390.
3. تشغيل/التحقق من CI على Merge SHA؛ الحالة الحالية UNVERIFIED.

## 9. نتيجة الإغلاق

- **F3:** منفذ ومندمج على `FrontendApp` بالـ Merge SHA المسجل أعلاه.
- **موافقة PO:** موثقة بتعليق GitHub قبل Ready وMerge.
- **القبول البصري:** محدود بأربع حالات فقط وفق تعليق PO.
- **الفجوات المفتوحة:** بيانات `nameEn`، اللقطات الأربع غير المغطاة، وCI على Merge SHA.
- **F2 وبقية البنود:** لم تُغيّر حالتها بهذا التقرير.
