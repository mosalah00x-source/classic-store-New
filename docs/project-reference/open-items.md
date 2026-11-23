# البنود المفتوحة والدَين التقني

الحالة أدناه مبنية على وثائق المشروع وسجل GitHub المتاح. أي بند لم يُعد التحقق منه على Head حديث موسوم [UNV].

## بنود واجهة المتجر

- **F3 screenshots:** لقطات Home EN Dark وEN 390 وAR 390 Dark لم يشملها تنازل PO المحدود؛ روابط الأدلة [UNV].
- **F4 screenshots:** المراجعة البصرية لبطاقة المنتج بعد PR #29 غير مثبتة؛ [UNV].
- **PR #30 screenshots:** Mega Menu وFavorite heart على 1440px و390px، AR/EN، Light/Dark؛ ما زالت بانتظار مراجعة PO.
- **F7:** إزالة تكرار متغيرات logo في globals.css — مذكور كعنصر مفتوح في V4؛ الحالة الحالية [UNV].
- **F8:** تحصين catalog API لحالة JSON الفارغ — مذكور كعنصر مفتوح في V4؛ الحالة الحالية [UNV].
- **F10:** إغلاق توحيد الثيم عبر التطبيق — مذكور كعنصر مفتوح في V4؛ الحالة الحالية [UNV].

## البيئة والتوثيق

- **ENV-01:** إنشاء frontend/.env.example بعد التحقق من المتغيرات الفعلية، مع API_MOCKING=true وAPI_MOCK_SCENARIO=showcase وAPI_BASE_URL بقيمة غير حقيقية/فارغة في example وتعليقات النسخ إلى .env.local وإعادة تشغيل الخادم. تحقق من استثناء .env.example في .gitignore. التنفيذ مؤجل إلى PR مستقل بعد إغلاق DOC-01.
- **CI-01:** [GH] تم دمج PR #32 لإضافة `docs/project-reference/**` و`docs/README.md` إلى مرشّحي `push` و`pull_request`. Merge SHA: `4303bfe8941301cb1314a0805e7e0ae8c8a0c1bc`. PR #32 Head run #109 / `45152356436` نجح على Head SHA `fb813d866522c1f5a1cbef78643b2abca948063e`؛ هذا ليس إثباتًا لتشغيل `push` على Merge SHA. PR #31 Head الحالي `33bc2216103ebb69114502deb062a6cfbf614262`: backend-ci Run #113 / `45154884360` قيد التشغيل؛ `api-lint` نجح، و`verify migrations` قيد التنفيذ، و`backend` ينتظر. لا يُعد ذلك نجاحًا كاملًا حتى تكتمل الوظائف الثلاث. سجل التفاصيل: [`tech-debt.md`](./tech-debt.md).
- **backend/README.md:** نسخة README القديمة لا تطابق dependencies وFlyway الفعلية؛ تحديثها بند توثيقي منفصل.
- **Theme flash:** قياس أول إطار للثيم في F1 غير مثبت [UNV].

## الإدارة

- ADM-0 هو سجل الجرد والقرارات في ADMIN-0.md.
- ADM-1 إلى ADM-8 موثقة كخارطة مراحل في ADMIN-0.md.
- ADM-1-plan تقرير وخطة فقط؛ لا تنفيذ قبل موافقة PO المكتوبة على الخطة بعد دمج DOC-01.
