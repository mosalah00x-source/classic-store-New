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
- **CI-01:** [GH] PR #32 is merged. Merge SHA `4303bfe8941301cb1314a0805e7e0ae8c8a0c1bc`; PR Head Run #109 / `45152356436` passed on exact Head SHA `fb813d866522c1f5a1cbef78643b2abca948063e`; Merge-SHA push Run #110 / `45154657899` passed with all three jobs (`api-lint`, `verify migrations`, `backend`) on the exact Merge SHA. PR #31 pre-DOC-02 Head `96c8648...` passed 3/3 in Run #115 / `45155049507`. The updated DOC-02 Head `5da1c20...` started Run #116 / `45156874912`; two jobs passed while `backend` was running. A later checkpoint Head `fb727a2281b3c68c01bfd59c739ed0cb2af98de7` started Run #135 / `45158132139`; `api-lint` passed and `verify migrations` was running when checked. Two task-record updates followed, so a fresh run on the final Head is required. Architectural CI improvement remains follow-up debt; see [tech-debt.md](./tech-debt.md).

## الإدارة

- ADM-0 هو سجل الجرد والقرارات في ADMIN-0.md.
- ADM-1 إلى ADM-8 موثقة كخارطة مراحل في ADMIN-0.md.
- ADM-1-plan تقرير وخطة فقط؛ لا تنفيذ قبل موافقة PO المكتوبة على الخطة بعد دمج DOC-01.
