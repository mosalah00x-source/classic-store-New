# السجل التقني والدَين التقني

## CI-01 — تشغيل الفحوص المطلوبة مع PRs التوثيق

### المشكلة الأصلية
كان `.github/workflows/backend-ci.yml` يستخدم مرشّحات `paths` على مستوى `push` و`pull_request` لا تشمل `docs/project-reference/**` أو `docs/README.md`. لذلك PR توثيق يستهدف `BackendApp` ولا يغيّر مسارًا مشمولًا قد لا ينشئ Workflow run، فتظل الفحوص المطلوبة في Branch Protection بحالة `Expected — Waiting for status to be reported`.

### الإصلاح المؤقت المدمج
- PR: [#32 — ci: run backend checks for project documentation](https://github.com/mosalah00x-source/classic-store-New/pull/32)
- Branch: `ci/backend-docs-paths`
- Head SHA: `fb813d866522c1f5a1cbef78643b2abca948063e`
- Merge SHA: `4303bfe8941301cb1314a0805e7e0ae8c8a0c1bc`
- الملف الوحيد: `.github/workflows/backend-ci.yml`.
- أضيف `docs/project-reference/**` و`docs/README.md` إلى `paths` في `push` و`pull_request`، مع الحفاظ على `!docs/api/*.md` وأسماء jobs وخطواتها.
- PR Head CI: Run #109 / `45152356436` — success على Head SHA أعلاه؛ jobs: `verify migrations`, `api-lint`, `backend`.
- Push workflow على Merge SHA: [UNV]؛ لا تتوفر من موصل GitHub الحالي نتيجة موثقة لهذا الحدث. لا يُستنتج نجاح Push CI من نجاح PR Head CI.

### مزامنة PR #31
بعد دمج PR #32، تمت مزامنة النسخة المطابقة من `.github/workflows/backend-ci.yml` من `BackendApp` إلى فرع `docs/project-reference` في commit `19476ad4582e898f9f561bb25c78baf98d9d391e`. هذه مزامنة للملف المطلوب فقط، وليست ادعاءً بأن فرع التوثيق دُمج بالكامل مع `BackendApp`.

- PR #31: [DOC-01](https://github.com/mosalah00x-source/classic-store-New/pull/31)
- Head SHA بعد المزامنة: `19476ad4582e898f9f561bb25c78baf98d9d391e`
- CI على Head الجديد: [UNV] حتى التحقق من اكتمال Workflow runs المطلوبة.
- PR #31 ما زال Draft وغير مدمج؛ لا يُحوّل إلى Ready ولا يُدمج دون مراجعة PO وإذنه الصريح.

### تحسين معماري لاحق — غير منفذ
1. إزالة فلتر المسارات من مستوى الـ workflow، والإبقاء على trigger للـ PR، ثم وضع شروط داخلية على مستوى كل job بحيث تُنفذ الوظائف المطلوبة بحسب الملفات المتغيرة. يجب الحفاظ على أسماء check contexts المطلوبة والتحقق عمليًا من أن job المتخطية تُسجل نجاحًا مقبولًا في Branch Protection.
2. Workflow مكمّل لمسارات التوثيق يبلّغ بنفس أسماء الـ jobs المطلوبة، مع ضمان عدم وجود تعارض أو check contexts مكررة أو غموض في مصدر الحالة.

هذا الإصلاح مؤقت ويزيد تكلفة CI لطلبات التوثيق. لا يُعتبر CI-01 مغلقًا بالكامل من ناحية التصميم المعماري حتى اعتماد حل مستدام منفصل.
