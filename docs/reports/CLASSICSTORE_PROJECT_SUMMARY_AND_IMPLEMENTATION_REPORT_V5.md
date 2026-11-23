# ClassicStore — ملخص المشروع وتقرير التنفيذ V5

**تاريخ تحديث السجل:** 23 نوفمبر 2026  
**المصدر المركزي:** الفرع docs/project-reference  
**الغرض:** هذا الإصدار يحل محل V4 بوصفه ملخص الحالة الجاري. احتُفظ بـ V4 كسجل تاريخي ولا تُحذف ملاحظاته؛ تُصحح الحالة الحالية هنا بأدلة GitHub الأحدث.

## 1. قواعد الإثبات

- **[GH]** تحقق مباشر من بيانات GitHub أو ملفات الفرع المحدد.
- **[PO]** قرار صريح من مالك المنتج.
- **[PROPOSED]** تصميم أو خطوة لم تُنفذ.
- **[UNV]** لا يتوفر دليل كافٍ أو لا يمكن إعادة التحقق منه حاليًا.

نجاح CI على Head لا يثبت نجاح CI على Merge SHA، وحدث الدمج لا يثبت موافقة PO، ولا تثبت الاختبارات الآلية المطابقة البصرية.

## 2. الحالة الحالية لـ PR #22–#30

| PR | المهمة | Branch | Head SHA المختصر | Merge SHA المختصر | Head CI Run | Merge CI | موافقة PO |
|---|---|---|---|---|---:|---|---|
| #22 | Catalog/showcase alignment | feature/f1-ui-align | 576d413 | c21a089 | 44103996882 PASS | [UNV] | لا توجد موافقة دمج مثبتة |
| #23 | Theme-aware logo | feat/frontend-logo-mask | 2389069 | c373426 | 44098093163 PASS | [UNV] | [UNV]؛ تأكيد الدمج لاحقًا ليس موافقة |
| #24 | Product theme toggle | feat/frontend-theme-toggle | 3f4fccc | e27f597 | 44120698612 PASS | [UNV] | لا؛ الموافقة كانت لإصلاح الاختبارات مع إبقاء Draft |
| #25 | Conditional price promotion | feat/frontend-product-price-detail | 62daf03 | dd00ddd | 44290488525 PASS | [UNV] | لا؛ PO طلب إبقاءه Draft وعدم الدمج |
| #26 | Shared storefront shell / F1 | feat/frontend-storefront-shell | b1a4d29 | eea323c | 45018782645 PASS | [UNV] | لا توجد موافقة دمج مثبتة؛ تعليقات PO اشترطت بقاء Draft حتى مراجعة Theme flash |
| #27 | Home / F3 | feat/frontend-home-storefront | 779b7a5 | 896fe55 | 45024248858 PASS | [UNV] | نعم؛ [تعليق الموافقة](https://github.com/mosalah00x-source/classic-store-New/pull/27#issuecomment-7079714545) |
| #28 | Bottom navigation | feat/frontend-dn-nav-bar | 6bde906 | 8cb4928 | 45032252636 PASS | [UNV] | [UNV] |
| #29 | Catalog Product Card / F4 | feat/frontend-catalog-card | 68496de | a5d722e | 45036694118 PASS | [UNV] | [UNV] |
| #30 | Mega Menu + Favorite SVG | fix/frontend-mega-menu | 0f6da6c | 666dd21 | 45040249741 PASS | [UNV] | [UNV] |

السجل التفصيلي لكل PR موجود في docs/tasks/PR-22.md إلى PR-30.md. كل Run ID أعلاه مرتبط بطلب قراءة بيانات ذلك الـ Head SHA؛ لا يُعامل كدليل على Merge CI.

## 3. تصحيح مهم لحالة PR #28

تقرير V4 وصف PR #28 بأنه Open/Draft/Not merged. بيانات PR الحالية في GitHub تعرضه Merged بتاريخ 22 نوفمبر 2026 14:53:06 UTC، مع Merge SHA يبدأ بـ 8cb4928. لذلك V4 لقطة تاريخية قديمة، وV5 هو المرجع للحالة المصححة.

## 4. PR #30 — الحالة بعد الدمج

- Head: 0f6da6c0e3a9beee757b57a634bc62b8bcc31fe0.
- Merge: 666dd2151172b56f57e10b4446c63a58f5d9d7a2.
- Head CI Run 45040249741 ناجح.
- سجل ADMIN-0 ينقل من Timeline أن الحساب mosalah00x-source نفذ ready_for_review عند 15:59:38 UTC ثم merged عند 15:59:42 UTC، ولا يظهر Auto-merge event. بيانات PR التي أمكن استرجاعها في تدقيق V5 تؤكد Merge SHA والوقت، لكنها لا تعرض merged_by أو Timeline event مباشرة؛ لذلك actor وغياب Auto-merge [UNV] لإعادة التحقق الحي المستقل.
- لا توجد لقطات مرئية بعد الدمج تثبت Mega Menu أو Favorite heart في Light/Dark و390px. لا يوجد قبول بصري بعد.

## 5. ملخص V5

### ما تم دمجه

- PR #22: showcase catalog/detail fixture محليًا، 18 منتجًا و9 تصنيفات.
- PR #23: شعار CSS mask قابل لإعادة الاستخدام.
- PR #24: theme toggle لصفحة Product.
- PR #25: عرض اختياري للسعر السابق والخصم في fixtures.
- PR #26: shared storefront shell.
- PR #27: Home AR/EN.
- PR #28: bottom navigation.
- PR #29: Catalog Product Card.
- PR #30: Mega Menu accessibility/responsive وتحويل المفضلة إلى SVG heart.

### قرارات ونطاق مستبعد

- API/Backend لم يتغير ضمن PRs #22–#30 بحسب نطاقات PR.
- شارات السعر القديم/الخصم وNew على كتالوج F4 مؤجلة بقرار PO مستقل.
- Best Sellers في Home يستخدم أحدث المنتجات كبديل معلن لعدم وجود sales ranking في API.
- صور showcase placeholders محلية، وSKU اصطناعي للعرض؛ لا تُعامل كبيانات متجر حقيقية.
- مراجعة PR #30 البصرية ما زالت مفتوحة رغم نجاح CI.

## 6. التشغيل المحلي والمراجعة البصرية

الإجراء التفصيلي والمتغيرات الفعلية ومصفوفة اللقطات في [دليل التشغيل المحلي والمراجعة البصرية](../project-reference/local-development-and-visual-review.md). لا يوجد frontend/.env.example حاليًا؛ ENV-01 مؤجل إلى PR مستقل بعد DOC-01.

الـ baseline البصري المرجعي: 1440×900 CSS px، DPR 1، Light، static prototype على localhost:8000، وأيقونة الهلال في زر الثيم كرمز الانتقال إلى Dark.

## 7. البنود المفتوحة

- F3: لقطات EN Dark وEN 390 وAR 390 Dark غير مشمولة في تنازل PO المحدود.
- F4: لقطات Catalog Product Card بعد PR #29 غير مثبتة.
- PR #30: لقطات Mega Menu وFavorite heart في Light/Dark و390px مطلوبة.
- F7/F8/F10: مذكورة في V4 كعناصر مفتوحة؛ حالتها الحالية [UNV] حتى إعادة فحص التنفيذ.
- CI-01: PR #32 مدمج؛ Merge SHA `4303bfe8941301cb1314a0805e7e0ae8c8a0c1bc`، وPush Run #110 / `45154657899` ناجح 3/3 على SHA الدمج. الإصلاح مؤقت والدَين المعماري OPS-002 ما زال مفتوحًا.
- ENV-01: ملف frontend/.env.example غير موجود بعد؛ PR مستقل بعد DOC-01.
- Theme flash في F1: قياسه غير مثبت [UNV].
- backend/README.md يحتاج تحديثًا منفصلًا ليتطابق مع pom/Flyway الفعليين.

## 8. الإدارة — AdminPanel Backlog

- ADM-0: الجرد والقرارات — ADMIN-0.md.
- ADM-1: Auth/roles/permissions/audit — ADM-1-plan.md، خطة تقريرية فقط.
- ADM-2: Admin API foundation.
- ADM-3: Admin frontend shell & BFF session.
- ADM-4: Category management.
- ADM-5: Product/price management.
- ADM-6: Images/content and storage adapter.
- ADM-7: Orders/users/settings.
- ADM-8: Hardening and acceptance.

لا يبدأ ADM-1 implementation قبل دمج DOC-01 وموافقة PO المكتوبة على خطة ADM-1. لا merge تلقائي ولا force push.


## تحديث تدقيق حي — 23 نوفمبر 2026 (DOC-02)

- GitHub يؤكد أن PR #22–#30 جميعها Merged؛ Head CI لكل PR ناجح على Head SHA المحدد في جدول القسم 2. لا يوجد دليل Merge-SHA CI لهذه الواجهات ضمن نتائج البحث الحي الحالية؛ تظل Merge CI [UNV].
- PR #32 مدمج على Merge SHA `4303bfe8941301cb1314a0805e7e0ae8c8a0c1bc`. Push Run #110 / `45154657899` نجح على SHA الدمج، والوظائف الثلاث api-lint وverify migrations وbackend نجحت.
- PR #31 قبل DOC-02 كان على Head `96c8648ab5b7f3143149297e0b6f0ffae70b99af`؛ Run #115 / `45155049507` نجح 3/3 على ذلك الـ Head. هذا لا يثبت CI على Head DOC-02 الجديد.
- سجل REGISTER وRECONCILIATION-LOG هو المرجع الأحدث لتفاصيل PRs #22–#32، ومصفوفة الأدلة والموافقات. لا تُرفع حالة أي مهمة إلى Done دون بواباتها.


## تحديث DOC-02 — 23 نوفمبر 2026

- سجل المهام الموحد أصبح في [tasks/README.md](../project-reference/tasks/README.md)، والسجل حسب المجالات في [REGISTER.md](../project-reference/tasks/REGISTER.md)، والمقارنة الحية في [RECONCILIATION-LOG.md](../project-reference/tasks/RECONCILIATION-LOG.md).
- ملفات تفصيلية جديدة توثق PR #22–#30 وPR #31/DOC-01 وPR #32/CI-01، إضافة إلى سجل migrations V1–V7 وADM Epic. السجلات القديمة تحت `docs/tasks/` باقية كمراجع تاريخية.
- PR #31 تقدم بعد Head `96c8648...` الذي نجح Run #115 عليه 3/3. عند بداية DOC-02 كان Head `5da1c20...` وRun #116 قد أكمل `api-lint` و`verify migrations` بنجاح بينما `backend` ما زال قيد التشغيل. يلزم تحقق جديد على آخر Head بعد جميع commits؛ لا تُنقل نتيجة Run #115 إلى SHA أحدث.
- PR #32 Merge-SHA push Run #110 ناجح 3/3 على Merge SHA الدقيق. CI-01 لا يزال يحمل دينًا معماريًا منفصلًا.
- لا تزال مراجعات Visual QA لـ F3 وBN وF4 وPR #30 مفتوحة؛ لا يُستنتج القبول من نجاح CI.
