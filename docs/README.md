# ClassicStore — Documentation Index

**Repository:** mosalah00x-source/classic-store-New  
**Canonical documentation branch:** docs/project-reference  
**Purpose:** single authoritative location for project documents. V3 is the current project report; V2 is retained as a historical snapshot.

## المراجع الرئيسية
- [قرار PO — شريط التنقل السفلي .dn (بديل قرار F2 السابق)](decisions/F2-dn-nav-bar-decision.md)
- [قرار PO — تأجيل شارات الخصم و«جديد» من F4](decisions/F4-badges-deferred.md)

- [تقرير المشروع V3](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V3_2026-11-18.md)
- [تقرير التحقق V3](reports/V3-verification-report-2026-11-18.md)
- [تقرير المشروع V4 — تحقق حي وقرارات PO (22 نوفمبر 2026)](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V4_2026-11-22.md)
- [تقرير إغلاق F1 — Shared Storefront Shell](reports/F1-storefront-shell-completion-report.md)
- [تقرير إغلاق F3 — Home Storefront](reports/F3-home-storefront-completion-report.md)
- [تقرير V2 التاريخي — لا يُعدّل](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V2_PO_DECISIONS_2026-11-18.md)
- [Project Master Reference (Arabic)](reference/Classic_Store_Project_Master_Reference_AR.md)
- [Consolidated SQL reference V1–V7](reference/Classic_Store_Consolidated_V1-V7.sql)
- [Frontend Language, Direction and Theme Guide](reference/FRONTEND_LANGUAGE_THEME_GUIDE.md)

## الوثائق المركزية ومصادرها

| الوثيقة | المصدر الأصلي (الفرع والمسار وBlob SHA) | النسخة المعتمدة | من يحق له تحديث المحتوى |
|---|---|---|---|
| Project Master Reference | main / docs/reference/Classic_Store_Project_Master_Reference_AR.md / 72c8e48757bb9b17bd0d533549220c0c9abaf6a9 | docs/reference/Classic_Store_Project_Master_Reference_AR.md | أمين التوثيق يحدّث الوقائع بدليل GitHub؛ PO يعتمد تغييرات المتطلبات والقرارات |
| Consolidated SQL reference V1–V7 | main / db/reference/Classic_Store_Consolidated_V1-V7.sql / 878d18095f39e0d96b83b9adde02c154c296aaa4 (نفس Blob SHA على docs/ui-reference وfeature/t01-citext-schema) | docs/reference/Classic_Store_Consolidated_V1-V7.sql | Backend owner يحدّث المصدر الفني مع مراجعة؛ أمين التوثيق ينسخ النسخة المعتمدة؛ PO يعتمد أي تغيير في نطاق المنتج |
| Product SRS v1.1.1 | BackendApp / docs/reference/Classic_Store_SRS_v1.1.1.md / 0c654d87cbb529ef10654e9e543734bc7d45e6ef | docs/reference/Classic_Store_SRS_v1.1.1.md | PO يملك المتطلبات؛ BA/Tech يقترح، وPO يعتمد |
| OpenAPI contract | BackendApp / docs/api/openapi.yaml / cb59eeda98669f2ecf1460a9ee98d3d99e83debe | docs/api/openapi.yaml | API owner يقترح التغيير؛ PO يعتمد نطاق العقد. الملف لم يُعدّل في هذه المهمة |
| T-06 acceptance report | BackendApp / docs/api/T06-acceptance-report.md / cc9f30eda4619628dae0ff64375fb06a6e982e30 | docs/api/T06-acceptance-report.md | QA/Backend owner يحدّث الأدلة فقط مع Run/SHA قابلين للتحقق؛ PO يعتمد القبول |
| T-07 identity decision | BackendApp / docs/decisions/T-07-identity-derived-contracts.md / 88d47229392406c95a535eacbd65a3ab4acbd86e | docs/decisions/T-07-identity-derived-contracts.md | PO فقط يغيّر القرار؛ التنفيذ لا يغيّر نص القرار |
| T-07 implementation report | BackendApp / docs/reports/T-07-identity-implementation-report.md / 8b64aafc20be5614849705150eee57067e3804e2 | docs/reports/T-07-identity-implementation-report.md | Backend owner يحدّث الوقائع مع commits/tests؛ PO يعتمد القبول |
| Static UI reference guide | FrontendApp / docs/ui-reference/README.md / 6b3af94924722e1e77d7c59e10b671ad8e0f00b5 | docs/ui-reference/README.md | Frontend owner يحدّث وصف النموذج؛ PO يعتمد تغييرات المرجع/النطاق |
| Backend README copy | BackendApp / backend/README.md / 6d200ee15b406b78d51ba8710e2e786c405697a4 | docs/reference/BACKEND_README.md | Backend owner؛ وأمين التوثيق للتنسيق |
| Project Reference README copy | docs/ui-reference / docs/reference/README.md / 6b3af94924722e1e77d7c59e10b671ad8e0f00b5 | docs/reference/PROJECT_REFERENCE_README.md | أمين التوثيق؛ PO يعتمد قواعد الحوكمة |
| دليل اللغة والثيم | مستخلص من FrontendApp source وقرارات PO؛ ليس نسخة من ملف واحد | docs/reference/FRONTEND_LANGUAGE_THEME_GUIDE.md | Frontend owner يحدّث التنفيذ المرصود؛ PO وحده يغيّر سياسة اللغة/الثيم |
| Project reports V2/V3 | V2 على هذا الفرع؛ V3 مشتق من مراجعة V2 وGitHub | docs/reports/ | أمين التوثيق؛ قرارات PO لا تُضاف إلا من تصريح PO مكتوب |
| V3 verification report | فحص GitHub مباشر في 19 نوفمبر 2026 | docs/reports/V3-verification-report-2026-11-18.md | المراجع/أمين التوثيق مع أدلة مباشرة فقط |

## قواعد المصدر المعتمد

1. docs/project-reference هو المصدر الوحيد المعتمد لتحديث وثائق المشروع؛ النسخ الموجودة في main وBackendApp وFrontendApp وفروع الميزات نسخ تاريخية غير معتمدة للتحديث.
2. أي تعديل لاحق على وثيقة يتم في مسارها المركزي هنا فقط. لا تُعدّل النسخ القديمة في الفروع الأصلية ضمن مهام التوثيق العادية.
3. متطلبات المنتج وقرارات PO لا يغيّرها إلا PO. يمكن للـ BA/Tech تقديم اقتراح، لكن لا يصبح نافذاً قبل اعتماد PO.
4. عقود API يحدّثها API owner بعد مراجعة التوافق مع Backend والـ Frontend، ويعتمد PO نطاق التغيير. لا تُعدّل OpenAPI في هذه المهمة.
5. تقارير التنفيذ والاختبار يحدّثها المالك الفني/QA مع SHA وRun IDs واختبارات قابلة للفتح؛ لا تُسجل نتائج CI أو القبول البصري دون دليل.
6. أدلة اللغة والثيم يحدّثها Frontend owner وفق الشيفرة الفعلية؛ سياسة المنتج نفسها يملكها PO.
7. لا تُنقل وثيقة جديدة إلى هذا الفرع دون تسجيل الفرع والمسار الأصليين وBlob SHA في هذا الفهرس.
8. عند اختلاف نسخ الوثائق، النسخة المركزية هي المرجع الجاري؛ النسخ القديمة لا تُدمج تلقائياً ولا تُستبدل بصمت.
9. ملف SQL التجميعي مرجع توثيقي للقراءة والمراجعة فقط؛ لا يُعامل كبديل عن Flyway migrations، ولا يُنفذ على قاعدة قائمة.

## مواقع التنفيذ (ليست مصادر الوثائق)

- [Backend implementation on BackendApp](https://github.com/mosalah00x-source/classic-store-New/tree/BackendApp/backend)
- [Frontend Next.js implementation on FrontendApp](https://github.com/mosalah00x-source/classic-store-New/tree/FrontendApp/frontend/src)
- [Static UI prototype on FrontendApp](https://github.com/mosalah00x-source/classic-store-New/tree/FrontendApp/docs/ui-reference)

## تغطية فحص الفروع

تم فحص الفروع الـ30 وشجرة كل فرع عند آخر SHA الظاهر في GitHub بتاريخ 19 نوفمبر 2026. القائمة التفصيلية ومسارات الوثائق في V3 وفي تقرير التحقق. لم تظهر وثائق مشروع إضافية مستقلة خارج المسارات المدرجة، بمع توثيق ملف SQL التجميعي الآن في `docs/reference/Classic_Store_Consolidated_V1-V7.sql`؛ هذا النقل توثيقي ولا يحوله إلى Migration أو دليلاً على التنفيذ.

## قيود النسخ القديمة

لم تُعدّل الفروع الأصلية main أو BackendApp أو FrontendApp أو أي فرع آخر. لذلك لم يُضف تنبيه stale فعلي داخل الملفات الموجودة بتلك الفروع؛ ويُعلن هذا الفهرس أن تلك النسخ تاريخية وغير معتمدة للتحديث. إضافة التنبيه داخل كل فرع أصلي تتطلب نطاقاً منفصلاً، لأنها تتعارض مع منع تعديل الفروع الأصلية في هذه المهمة.

## الحوكمة

- GitHub هو المرجع للـ branch HEADs وcommits وPRs وCI.
- قرار PO لا يُستنتج من Ready أو Merge أو CI.
- لا يُدّعى التطابق البصري دون screenshots فعلية.
- لا يُدّعى نجاح CI دون نجاح كل الخطوات على SHA واحد.
- لا يُستنتج تنفيذ ميزة من وجود SRS أو OpenAPI أو schema وحدها.
