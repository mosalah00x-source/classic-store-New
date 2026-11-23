# تقرير التحقق — V3

**المستودع:** mosalah00x-source/classic-store-New  
**الفرع:** docs/project-reference  
**HEAD قبل التوثيق:** 6a1cd7b56528677dce0231ec36c20aacbaf5f74e  
**تاريخ الفحص:** 19 نوفمبر 2026  
**النطاق:** توثيق فقط؛ لم تُعدّل فروع التطبيق أو Migrations أو OpenAPI أو PRs.

## 1.1 التحقق من الملفات والـ blobs

| الملف | المسار | المصدر وBlob SHA (المصدر؛ Blob الفرع المركزي قبل V3) | نتيجة المقارنة |
|---|---|---|---|
| docs/README.md | docs/README.md | —؛ 4f08f1bbd3f3307414f611c7f9ad0ebd428916fa | فهرس مركزي منشأ؛ لا مصدر أصلي |
| docs/api/T06-acceptance-report.md | docs/api/T06-acceptance-report.md | BackendApp/docs/api/T06-acceptance-report.md · cc9f30eda4619628dae0ff64375fb06a6e982e30؛ cc9f30eda4619628dae0ff64375fb06a6e982e30 | مطابق قبل إضافة provenance header؛ المحتوى الأصلي محفوظ |
| docs/api/openapi.yaml | docs/api/openapi.yaml | BackendApp/docs/api/openapi.yaml · cb59eeda98669f2ecf1460a9ee98d3d99e83debe؛ cb59eeda98669f2ecf1460a9ee98d3d99e83debe | مطابق؛ لم يُعدّل بسبب المنع الصريح من تحديث OpenAPI |
| docs/decisions/T-07-identity-derived-contracts.md | docs/decisions/T-07-identity-derived-contracts.md | BackendApp/docs/decisions/T-07-identity-derived-contracts.md · 88d47229392406c95a535eacbd65a3ab4acbd86e؛ 88d47229392406c95a535eacbd65a3ab4acbd86e | مطابق قبل إضافة provenance header؛ المحتوى الأصلي محفوظ |
| docs/reference/BACKEND_README.md | docs/reference/BACKEND_README.md | BackendApp/backend/README.md · 6d200ee15b406b78d51ba8710e2e786c405697a4؛ 99be3841a2484001978b77a034272e1f60ffbd72 | مختلف بسبب provenance header فقط؛ المحتوى الأصلي محفوظ |
| docs/reference/Classic_Store_Project_Master_Reference_AR.md | docs/reference/Classic_Store_Project_Master_Reference_AR.md | main/docs/reference/Classic_Store_Project_Master_Reference_AR.md · 72c8e48757bb9b17bd0d533549220c0c9abaf6a9؛ d027ab0e24168ff9ba5fab7d4a5d2ac950839927 | مختلف بسبب provenance header؛ المحتوى الأصلي محفوظ كما هو |
| docs/reference/Classic_Store_SRS_v1.1.1.md | docs/reference/Classic_Store_SRS_v1.1.1.md | BackendApp/docs/reference/Classic_Store_SRS_v1.1.1.md · 0c654d87cbb529ef10654e9e543734bc7d45e6ef؛ 0c654d87cbb529ef10654e9e543734bc7d45e6ef | مطابق قبل إضافة provenance header؛ المحتوى الأصلي محفوظ |
| docs/reference/FRONTEND_LANGUAGE_THEME_GUIDE.md | docs/reference/FRONTEND_LANGUAGE_THEME_GUIDE.md | مستخلص من FrontendApp source وقرارات PO؛ لا يوجد ملف أصلي واحد؛ 98473e15157d3c02059289d5aeab162c12fe5965 | وثيقة مركزية أصلية؛ لا مقارنة blob بمصدر ملف واحد |
| docs/reference/PROJECT_REFERENCE_README.md | docs/reference/PROJECT_REFERENCE_README.md | docs/ui-reference:docs/reference/README.md · 6b3af94924722e1e77d7c59e10b671ad8e0f00b5؛ d97c4205ada106cc0a4c863d7de3f8de11b62929 | مختلف بسبب provenance header؛ تم تصحيح مسار المصدر الخاطئ |
| docs/reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V2_PO_DECISIONS_2026-11-18.md | docs/reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V2_PO_DECISIONS_2026-11-18.md | النسخة المرفوعة 42,555 bytes بلا Git blob؛ GitHub V2 44,742 bytes هو المرجع؛ 40a8cedb588316809fc3d7d66b6a9aaa1e78425a | مختلف عن الملف المرفوع؛ اعتمدت نسخة GitHub دون تعديل V2 |
| docs/reports/T-07-identity-implementation-report.md | docs/reports/T-07-identity-implementation-report.md | BackendApp/docs/reports/T-07-identity-implementation-report.md · 8b64aafc20be5614849705150eee57067e3804e2؛ 8b64aafc20be5614849705150eee57067e3804e2 | مطابق قبل إضافة provenance header؛ المحتوى الأصلي محفوظ |
| docs/ui-reference/README.md | docs/ui-reference/README.md | FrontendApp/docs/ui-reference/README.md · 6b3af94924722e1e77d7c59e10b671ad8e0f00b5؛ 38d64653b017e014fa1efcb2cdff1985990207b0 | مختلف بسبب provenance header؛ المحتوى الأصلي محفوظ |

**ملاحظة المقارنة:** اختلاف Blob SHA بعد إضافة provenance header متوقع. في النسخ التي أضيف لها header، لم يُعدّل نص المصدر الأصلي. V3 وتقرير التحقق ملفان جديدان في هذا الالتزام، وتظهر Blob SHAs النهائية لهما في شجرة commit المنشور.

## 1.2 التحقق من فهرس الوثائق

- روابط Markdown النسبية الثلاثة في فهرس ما قبل V3 كانت موجودة على الفرع المركزي.
- روابط مواقع التنفيذ الثلاثة تشير إلى مجلدات موجودة على الفروع المحددة.
- جميع المسارات المركزية المسجلة في جدول الوثائق موجودة في شجرة docs/project-reference.
- تصحيح مصدر PROJECT_REFERENCE_README.md: المصدر الصحيح هو الفرع docs/ui-reference والمسار docs/reference/README.md، وليس docs/ui-reference/docs/reference/README.md.
- أُضيفت روابط V3 وتقرير التحقق وV2 التاريخي وقسم قواعد المصدر المعتمد.
- openapi.yaml بقي دون تعديل بسبب المنع الصريح من تحديث OpenAPI في المهمة.

## 1.3 فحص الفروع الـ30

تم فحص قائمة الفروع الحية وشجرة كل فرع عند SHA الظاهر أدناه. جميع استجابات recursive tree أعادت truncated=false. مسارات frontend/src/app/api هي كود وليست وثائق.

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

## 1.4 حالة V1

| محور V1 | النتيجة | الدليل / المتبقي |
|---|---|---|
| فروع GitHub وشجرة الملفات | مكتمل | 30 فرعاً؛ recursive tree لكل SHA؛ جميع الردود truncated=false |
| HEADs وCI على HEAD نفسه | مكتمل | FrontendApp dd00ddd... / Run #83 success؛ BackendApp 15bb408... / Run #108 success؛ كل الخطوات والوظائف نجحت |
| حالة PRs | مكتمل | GitHub أعاد PRs #1–#25؛ #9 مغلق وغير مدمج والبقية مدمجة |
| Reviews وConversation comments لكل PR | غير مكتمل | فُحص #22 و#23 فقط: Reviews 0 وConversation comments 0 لكل منهما؛ يلزم فحص بقية PRs |
| التحقق البصري | غير مكتمل | لا توجد screenshots متصفح ضمن هذا الفحص |

## 1.5 أحداث PR #22 وPR #23

| PR | Ready for review (UTC) | Merged (UTC) | Reviews | Conversation comments | Merge commit |
|---|---|---|---:|---:|---|
| #22 | 2026-11-17T15:46:42Z | 2026-11-17T15:46:48Z | 0 | 0 | c21a089e69477bf033c0e149835ce1d6b474754a |
| #23 | 2026-11-17T14:07:07Z | 2026-11-17T14:07:15Z | 0 | 0 | c3734268fa3a76ff63bc20f504665198063560c7 |

مصدر التوقيت: GitHub Timeline. مصدر الأعداد: Review submissions وConversation comments. لا تُستنتج موافقة PO من Ready أو Merge أو CI.

**مصدر قرار PO خارج GitHub:** أكد المستخدم كتابةً «نعم، كانت هناك موافقة مني» بتاريخ 18 نوفمبر 2026، الساعة 15:15:00 UTC. هذا تاريخ التأكيد المكتوب في المحادثة، وليس بالضرورة تاريخ الموافقة الأصلية. تاريخ الموافقة الأصلية ووسيلتها (كتابية أو شفهية) غير مثبتين بصورة مستقلة. لا يوجد Review أو Conversation comment في GitHub يوثق القرار.

## تحقق يدوي مطلوب

1. فحص Reviews وConversation comments لبقية PRs #1–#21 و#24–#25؛ لم يُنفذ هذا الفحص الشامل في هذه المهمة.
2. تنفيذ تحقق بصري فعلي بالمتصفح للصفحات المطلوبة، مع screenshots على 1440 و390، وLight/Dark، وRTL/LTR.
3. إذا لزم وضع تحذير stale داخل النسخ الموجودة في main وBackendApp وFrontendApp وفروع الميزات، فهذا يتطلب نطاقاً منفصلاً؛ لم تُعدّل أي فروع أصلية هنا.
5. حسم تعارض طلب provenance header في OpenAPI مع المنع الصريح من تحديث OpenAPI؛ الملف تُرك دون تعديل.

## تعارضات تحتاج قراراً من PO

1. **OpenAPI provenance:** البند 2.4 يطلب إضافة header إلى openapi.yaml، بينما قائمة الممنوعات تنص صراحةً على عدم تحديث OpenAPI. تم احترام المنع وترك الملف دون تغيير.
2. **علامة stale داخل الفروع الأصلية:** توحيد المصدر يتطلب تعليم النسخ القديمة داخل main/BackendApp/FrontendApp، لكن المهمة تمنع تعديل هذه الفروع. أُعلن في docs/README.md أن نسخها تاريخية وغير معتمدة، دون تعديلها.

## قرار PO اللاحق — ملف SQL المرجعي

وافق PO على إدراج `db/reference/Classic_Store_Consolidated_V1-V7.sql` ضمن الوثائق المركزية. نُسخت النسخة إلى `docs/reference/Classic_Store_Consolidated_V1-V7.sql` من `main`، مع إضافة ترويسة provenance فقط. Blob SHA الأصلي `878d18095f39e0d96b83b9adde02c154c296aaa4`، وهو مطابق أيضاً على `docs/ui-reference` و`feature/t01-citext-schema`. لم يُنفذ الملف على PostgreSQL حي وفق ترويسة المصدر، وهو ملف مرجعي تجميعي وليس Migration.

## اختلاف نسخة V2 المرفوعة عن GitHub

الملف المرفوع للمقارنة حجمه 42,555 bytes، بينما ملف V2 على docs/project-reference حجمه 44,742 bytes. المقارنة النصية أكدت أن المحتويين غير متطابقين. وفق قاعدة المهمة، اعتُمدت نسخة GitHub كأساس لـ V3، وبقي V2 دون تعديل.

## حدود المهمة

- لم يُعدّل أي ملف في main أو BackendApp أو FrontendApp أو فروع الميزات.
- لم يُعدّل openapi.yaml أو أي Migration.
- لم يُنشأ PR ولم يحدث Merge أو Revert أو Force Push.
- لا يتضمن هذا التقرير ادعاء قبول بصري أو موافقة مستنتجة من أحداث GitHub.
