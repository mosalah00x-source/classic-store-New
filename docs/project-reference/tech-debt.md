# السجل التقني والدَين التقني

## CI-01 — تشغيل الفحوص المطلوبة مع PRs التوثيق

### المشكلة الأصلية
كان `.github/workflows/backend-ci.yml` يستخدم مرشّحات `paths` على مستوى `push` و`pull_request` لا تشمل `docs/project-reference/**` أو `docs/README.md`. لذلك PR توثيق يستهدف `BackendApp` ولا يغيّر مسارًا مشمولًا قد لا ينشئ Workflow run، فتظل الفحوص المطلوبة في Branch Protection بحالة `Expected — Waiting for status to be reported`.

### الإصلاح المؤقت المدمج [GH]
- PR: [#32 — ci: run backend checks for project documentation](https://github.com/mosalah00x-source/classic-store-New/pull/32)
- Branch: `ci/backend-docs-paths`; base: `BackendApp`.
- Head SHA: `fb813d866522c1f5a1cbef78643b2abca948063e`.
- Merge SHA: `4303bfe8941301cb1314a0805e7e0ae8c8a0c1bc`.
- Merged at: 2026-11-23 10:16:55 UTC.
- الملف الوحيد: `.github/workflows/backend-ci.yml`.
- أضيف `docs/project-reference/**` و`docs/README.md` إلى `paths` في `push` و`pull_request`، مع الحفاظ على `!docs/api/*.md` وأسماء jobs وخطواتها.
- PR Head: Run #109 / `45152356436` — success على Head SHA أعلاه.
- Merge-SHA push: [Run #110](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45154657899) — success على Merge SHA الدقيق؛ الوظائف الثلاث `api-lint` و`verify migrations` و`backend` completed/success.

### تحقق PR #31 — DOC-01 / DOC-02

- PR #31 ما زال Open وDraft وغير مدمج، ويستهدف `BackendApp`.
- Head سابق قبل DOC-02: `96c8648ab5b7f3143149297e0b6f0ffae70b99af`; Run #115 / `45155049507` — success، 3/3 على SHA نفسه.
- Head وقت بدء DOC-02 audit: `5da1c20a265c527375c932a9aa29241b9d4eac0b`; Run #116 / `45156874912` — `verify migrations` و`api-lint` نجحا، بينما `backend` كان لا يزال قيد التنفيذ عند آخر قراءة.
- **لا يُنقل نجاح Run #115 إلى Head جديد.** يلزم إعادة فحص Run على أحدث Head بعد اكتمال كل commits الخاصة بـ DOC-02، وتسجيل 3/3 فقط عند اكتمال الوظائف على SHA مطابق.
- مزامنة workflow من BackendApp إلى فرع التوثيق في commit `19476ad4582e898f9f561bb25c78baf98d9d391e` كانت مزامنة ملف واحد، وليست merge كاملًا لفرع BackendApp.
- PR #31 يبقى Draft ولا يتحول إلى Ready ولا يدمج دون مراجعة PO وإذنه الصريح.

### تحسين معماري لاحق — غير منفذ
1. دراسة إزالة فلتر المسارات من مستوى workflow والإبقاء على trigger للـ PR، ثم وضع شروط داخلية على مستوى كل job بحيث تُنفذ الوظائف المطلوبة بحسب الملفات المتغيرة. يجب الحفاظ على أسماء check contexts المطلوبة والتحقق عمليًا من أن job المتخطية تُسجل نجاحًا مقبولًا في Branch Protection.
2. بديلًا: Workflow مكمّل لمسارات التوثيق يبلّغ بنفس أسماء jobs المطلوبة، مع ضمان عدم وجود تعارض أو check contexts مكررة أو غموض في مصدر الحالة.

هذا الإصلاح مؤقت وقد يزيد تكلفة CI لطلبات التوثيق. لا يُعتبر CI-01 مغلقًا معماريًا حتى اعتماد حل مستدام منفصل.

## مراجع التحقق

- [PR #32](https://github.com/mosalah00x-source/classic-store-New/pull/32)
- [PR #32 Merge push Run #110](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45154657899)
- [PR #31](https://github.com/mosalah00x-source/classic-store-New/pull/31)
- [PR #31 prior Head Run #115](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45155049507)
- [PR #31 audit-start Head Run #116](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45156874912)
