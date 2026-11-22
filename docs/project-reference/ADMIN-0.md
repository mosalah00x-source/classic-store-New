# ADMIN-0 — جرد النظام الإداري وتصميمه وقرارات المنتج

**Repository:** `mosalah00x-source/classic-store-New`  
**Branch:** `docs/project-reference`  
**تاريخ القرار:** 22 نوفمبر 2026  
**نطاق الوثيقة:** جرد الحالة الحالية، التصميم المستهدف، قرارات PO، المقارنة التقنية، وخارطة المراحل.  
**حالة التنفيذ:** التصميم موثق؛ لا يعني أن وظائف الإدارة قد بُنيت.

---

## 1. الملخص التنفيذي

المشروع يحتوي أساسًا صالحًا للبناء عليه: مستخدمون وأدوار أساسية، كتالوج وتصنيفات ومخزون، مصادقة JWT للـ API، Flyway migrations حتى V7، وعقد OpenAPI. لكنه لا يحتوي حتى لقطة الجرد على لوحة إدارة متكاملة أو طبقة صلاحيات إدارية دقيقة أو سجل تدقيق أو رفع صور إداري متكامل.

القرار المعتمد هو بناء الإدارة تدريجيًا مع الحفاظ على فصل واضح بين:
1. الموجود فعليًا في Backend والـ schema والـ OpenAPI.
2. المطلوب في تصميم الإدارة.
3. ما لم يبدأ تنفيذه بعد.

**لا تبدأ أي كتابة Backend ضمن هذه الوثيقة.** ADM-1 أدناه خطة فقط وتحتاج موافقة PO مكتوبة بعد دمج DOC-01.

## 2. قواعد التصنيف والإثبات

| الوسم | معناه |
|---|---|
| [GH] | تحقق من ملفات GitHub على فرع `docs/project-reference` أو من سجل GitHub الحي |
| [PO] | قرار منتج صريح بتاريخ 22 نوفمبر 2026 |
| [PROPOSED] | تصميم مستقبلي لم ينفذ بعد |
| [UNVERIFIED] | لم يتوفر دليل كافٍ؛ لا يُعامل كحقيقة |

الفرع `docs/project-reference` مبني على `BackendApp` ويحتوي ملفات Backend ومواصفاته التي تمت مراجعتها. لا يجوز تعميم لقطة هذا الفرع على أي فرع آخر دون مقارنة SHA.

## 3. جرد الحالة الحالية — ADMIN-0 inventory

### 3.1 الهوية والأدوار [GH]

- نوع PostgreSQL الحالي هو `store.user_role`.
- الأدوار الموجودة في V1 هي: `CUSTOMER`, `ADMIN`, `OPERATIONS`, `WAREHOUSE`, `SUPPORT`.
- لا يوجد `EDITOR` في enum الحالي.
- جدول `store.users` يحتوي `role` مع default `CUSTOMER`، و`is_active`، وحقول الهوية وكلمة المرور المجزأة.
- يوجد مسار مصادقة JWT في Backend: `JwtAuthenticationFilter` و`TokenService`.
- كلمة المرور تُخزن hash وليس نصًا صريحًا؛ إعداد BCrypt الحالي cost 12.
- التسجيل العام يجب أن يظل ينتج `CUSTOMER` فقط؛ لا تمنح الواجهة العامة اختيار دور إداري.

### 3.2 SecurityConfig الحالي [GH]

المراجعة على `backend/src/main/java/com/classicstore/config/SecurityConfig.java` أظهرت:

- API stateless حاليًا، مع JWT filter.
- CSRF معطل حاليًا في Backend.
- مسارات التسجيل والدخول والتجديد واستعادة كلمة المرور عامة.
- كتالوج المنتجات والتصنيفات العامة مسموحة.
- `/api/v1/me/**` وعمليات كلمة المرور الخاصة بالعميل تتطلب `CUSTOMER`.
- بقية المسارات تنتهي حاليًا إلى `authenticated()`، ولا توجد سياسة method-level دقيقة مبنية على صلاحيات الإدارة.
- CORS يُقرأ من `CORS_ALLOWED_ORIGINS`، و`allowCredentials=false` حاليًا.
- هذا التكوين الحالي لا يحقق بعد نموذج BFF/HttpOnly الذي اعتمده PO؛ يجب تغييره في مرحلة تنفيذ لاحقة فقط بعد اعتماد خطة ADM-1.

### 3.3 الإدارة وواجهات API [GH]

- توجد مساحة package باسم `com.classicstore.admin` لكنها تحتوي حاليًا `package-info.java` فقط.
- لا يوجد دليل في الجرد على Admin Controller فعلي أو Admin service مكتمل أو عمليات CRUD إدارية.
- مسارات الإدارة الموجودة في OpenAPI تُعامل كعقد/تصميم عند ظهورها، ولا يُفترض أن لها تنفيذ Controller لمجرد وجودها في المواصفة.
- لا يوجد تنفيذ مكتمل لرفع صور الإدارة ضمن الجرد.
- لا يوجد جدول audit log أو آلية append-only موثقة في migrations الحالية.

### 3.4 التصنيفات والمنتجات والأسعار [GH + PO]

- جدول التصنيفات يدعم `parent_id` / `parentId`، لكن وجود علاقة الأب/الابن وحده لا يفرض عمقًا أقصى من مستويين ولا يمنع جميع الحلقات.
- يجب ألا نستنتج قيد عمق شجري غير موجود في قاعدة البيانات.
- حقل `compare_at_price` موجود في قاعدة البيانات بحسب الجرد السابق، لكنه ليس جزءًا من عقد المنتج العام الحالي الذي تمت مراجعته.
- عقد المنتج الحالي في OpenAPI يصف `ProductSummary` بحقول مثل `nameAr`, `nameEn`, `priceFrom`, `primaryImage`, `brand`, `categories`. لا يصف `compareAtPrice` أو `discountPercent` أو `createdAt` ضمن هذا الملخص.
- مسارات الإدارة أو حقول قاعدة البيانات لا تعني أن الواجهة أو API العام يعرضها بالفعل.

### 3.5 سجل التدقيق ورفع الصور [GH]

- لا توجد migration حالية تنشئ سجل تدقيق إداري append-only.
- لا يوجد في الجرد Upload Controller/Service إداري مكتمل.
- لا يجوز الادعاء بأن صلاحيات الأرشفة أو نشر المنتجات أو رفع الصور مطبقة حاليًا.

## 4. قرارات PO المعتمدة — لا تعاد مناقشتها دون طلب صريح

### 4.1 الاستضافة والتطوير المحلي أولًا [PO]

- الاستضافة ستكون سحابية **بعد اكتمال التجربة والاختبار المحلي على جهاز PO**.
- لا نختار مزود سحابة أو نربط حسابًا مدفوعًا الآن.
- نطور محليًا، لكن بتصميم جاهز للانتقال للسحابة من غير إعادة كتابة.
- يجب ألا يعتمد التطبيق على أن القرص المحلي في بيئة الإنتاج دائم أو مستمر.

### 4.2 تخزين الصور [PO]

- في التطوير المحلي: الصور تُخزن على جهاز التطوير.
- في التصميم: طبقة تخزين مجردة قابلة للتبديل (Storage Adapter).
- التنفيذ الأول: Local filesystem.
- التنفيذ السحابي لاحقًا: Adapter آخر يختار بعد قرار الاستضافة؛ الاختيار يكون إعدادًا/تنفيذ Adapter، وليس تغييرًا في منطق المنتجات.
- لا اختيار الآن بين S3 أو Cloudinary أو Azure Blob أو غيرها.

**متطلبات إلزامية للتصميم:**
1. قاعدة البيانات تحفظ object key أو relative path فقط؛ لا absolute path ولا URL فيه `localhost`.
2. بناء URL الكامل يتم من إعداد Base URL/URL resolver.
3. التحقق من نوع الملف الفعلي (MIME/content sniffing) والامتداد والحجم، وعدم الثقة في Content-Type القادم من المتصفح وحده.
4. اسم التخزين عشوائي وآمن (UUID/ULID أو ما يعادله)، ولا يستخدم اسم الملف الأصلي كمسار.
5. منع Path Traversal، وتقييد الامتدادات والأنواع، وتحديد حد رفع لكل ملف ومعدل الرفع.
6. لا تخزن أسرار مزود التخزين في الكود أو قاعدة البيانات؛ متغيرات بيئة/Secret Manager.
7. توفير سكربت لترحيل الملفات والبيانات من Local إلى Cloud، مع dry-run، والتحقق من hashes وعدد الملفات، وإمكانية إعادة التشغيل بأمان.
8. لا تحذف الملفات المحلية قبل التحقق من نجاح النسخ والتحقق من الروابط.
9. سياسة backup/restore منفصلة للملفات وقاعدة البيانات.

### 4.3 الأدوار والصلاحيات [PO]

الأدوار:
- `ADMIN`: المدير الحالي؛ يبقى.
- `EDITOR`: دور جديد سيضاف.
- لا تعديل على `OPERATIONS`, `WAREHOUSE`, `SUPPORT` ضمن ADM-1.

الصلاحيات المعتمدة:
- `PRODUCT_READ`
- `PRODUCT_WRITE`
- `PRODUCT_PUBLISH`
- `PRODUCT_ARCHIVE`
- `CATEGORY_WRITE`
- `PRICE_WRITE`
- `INVENTORY_WRITE`
- `USER_MANAGE`
- `AUDIT_READ`
- `SETTINGS_WRITE`

**مصفوفة ADMIN/EDITOR المعتمدة:**

| الوظيفة | ADMIN | EDITOR |
|---|---:|---:|
| عرض شاشات الإدارة | نعم | نعم |
| إنشاء وتعديل المنتجات | نعم | نعم |
| إنشاء وتعديل التصنيفات | نعم | نعم |
| نشر وإلغاء نشر المنتج | نعم | نعم |
| تعديل السعر | نعم | نعم |
| تعديل المخزون | نعم | نعم |
| الاطلاع على سجل التدقيق | نعم | لا |
| أرشفة واستعادة المنتجات | نعم | لا |
| إدارة المستخدمين والأدوار | نعم | لا |
| إعدادات الموقع | نعم | لا |
| الاطلاع الكامل على سجل التدقيق | نعم | لا |

ملاحظة تفسيرية: `AUDIT_READ` للمدير فقط. لا يملك EDITOR صلاحية قراءة سجل التدقيق؛ لكن كل عمليات EDITOR تُسجل في Audit Log ليتمكن ADMIN من مراجعتها. لا تمنح المحرر صلاحية قراءة السجل لمجرد أن عملياته تُسجل.

الأدوار التشغيلية الثلاثة الأخرى خارج نطاق التعديل الحالي. لا تمنحها أو تسحب منها صلاحيات ضمن ADM-1.

**مؤجل:** حدّ تغيير السعر الذي يستلزم موافقة المدير. في ADM-1 نكتفي بتسجيل التغييرات في Audit Log.

### 4.4 المصادقة: Next.js BFF [PO]

- تطبيق Next.js يعمل كـ Backend-for-Frontend (BFF).
- المتصفح يتعامل مع Next.js على نفس النطاق، ولا يتعامل مباشرة مع Backend token endpoints.
- الجلسة تُحفظ في Cookie بخصائص `HttpOnly` و`SameSite` مناسبة للبيئة.
- Next.js يتصل بالـ Backend من جهة السيرفر.
- لا JWT في `localStorage` أو `sessionStorage` أو JavaScript-readable cookie.
- لا تضع Access/Refresh token في HTML أو JSON يعاد للمتصفح.
- يجب أن توضح خطة التنفيذ: تدوير refresh، الإلغاء الفوري، CSRF، CORS، وسلوك cookies محليًا HTTP ولاحقًا HTTPS.

**التصميم المقترح للجلسة:** Cookie تحتوي معرف جلسة opaque عشوائي فقط؛ تحفظ رموز Backend وبيانات الجلسة في مخزن server-side. لا تجعل قيمة Cookie هي JWT طويل العمر.

### 4.5 الأسعار وشارة «جديد» [PO]

- `price`: السعر الحالي.
- `compareAtPrice`: السعر السابق قبل الخصم، ويجب أن يكون أكبر من `price`.
- Backend يحسب `discountPercent` في الاستجابة؛ لا يخزنه كحقل مشتق ولا تحسبه الواجهة.
- Backend يحسب `isNew`/شارة «جديد» من `created_at` خلال آخر 30 يومًا.
- أي تغيير في API contract أو schema يتطلب تحديث OpenAPI والاختبارات معًا.

### 4.6 التصنيفات [PO]

- أقصى عمق: مستويان (رئيسي وفرعي).
- يفرض العمق في service layer وفي قاعدة البيانات (CHECK أو trigger/آلية مكافئة) مع منع الحلقات.
- أرشفة التصنيف ممنوعة إذا كان لديه أبناء نشطون.
- إذا كان التصنيف مرتبطًا بمنتجات: يلزم تأكيد صريح قبل الأرشفة، ولا تُحذف علاقات المنتجات.
- بذرة التصنيفات: 15 تصنيفًا رئيسيًا و9 تصنيفات فرعية تحت «كرافت» كما في HTML المرجعي.
- أسماء التصنيفات الفرعية تؤخذ من HTML، لا من قراءة تقريبية لصورة صغيرة.
- التصنيفات التي يظهر بجانبها سهم في HTML ولكن لا توجد لها عناصر أبناء فعلية تظل بلا أبناء؛ لا نخترع بيانات.

### 4.7 إنشاء أول مدير والتسجيل العام [PO]

- إنشاء أول مدير مرة واحدة فقط من خلال أمر إداري آمن أو متغيرات بيئة محمية.
- لا كلمة مرور افتراضية أو ثابتة في الكود أو migration أو seed.
- يجب إجبار المدير على تغيير كلمة المرور عند أول تسجيل دخول.
- التسجيل العام ينشئ `CUSTOMER` فقط.
- يجب أن يثبت اختبار سلبي أن طلب التسجيل العام لا يستطيع اختيار `ADMIN` أو `EDITOR` أو أي دور موظف.
- لا تضع كلمة مرور مدير في سجل CI أو logs أو docs أو shell history.

### 4.8 Audit Log [PO]

- جدول Append-only.
- التطبيق لا يوفر UPDATE أو DELETE.
- صلاحيات قاعدة البيانات/trigger تمنع تعديل أو حذف السجلات بعد إضافتها.
- يسجل actor، action، entity type/id، timestamp، correlation/request id، والتغييرات الحساسة بشكل آمن.
- لا تسجل كلمات مرور أو tokens أو أسرار أو بيانات دفع حساسة.
- تغيير السعر الذي يتطلب موافقة مدير مؤجل؛ audit logging مطلوب من البداية.

## 5. المتطلبات المشتركة «محلي أولًا وجاهز للسحابة»

### 5.1 الصور والروابط

- DB تحفظ `storage_key` أو relative path.
- URL resolver يبني رابط الصورة اعتمادًا على `IMAGE_PUBLIC_BASE_URL` أو إعداد مشابه.
- لا تكتب `localhost` داخل DB أو بيانات seed أو API responses الدائمة.
- Local adapter يحفظ في مجلد بيانات خارج مجلد source control، مثل `var/uploads` أو مسار يحدده env.
- المجلد يضاف إلى `.gitignore` ولا تضاف ملفات المستخدمين إلى Git.
- عند الانتقال للسحابة، تُنقل الملفات ثم يتم تحويل adapter/base URL دون تغيير Product service أو API contract.

### 5.2 البيئة والأسرار

- كل الإعدادات والأسرار في متغيرات بيئة.
- توفير `.env.example` كامل يشرح أسماء المتغيرات والقيم المحلية غير السرية.
- لا تضع قيم production أو كلمات مرور حقيقية في example.
- لا تستخدم متغيرات `NEXT_PUBLIC_` للأسرار أو مفاتيح Backend.
- افصل إعدادات التطوير المحلي عن CI وعن الإنتاج.

**اقتراح DOC-01 لملف `frontend/.env.example` (مقترح توثيقي، لم يُنشأ/يُختبر بعد):**

```dotenv
# Frontend server-side API origin; never expose secrets with NEXT_PUBLIC_
API_BASE_URL=http://localhost:8080

# Local storefront mock mode
API_MOCKING=true
API_MOCK_SCENARIO=showcase

# Public image URL base; store relative keys in the database
IMAGE_PUBLIC_BASE_URL=http://localhost:8080/media
```

الأسماء أعلاه اقتراح توثيقي؛ يجب مطابقتها مع أسماء المتغيرات التي يقرأها frontend فعليًا قبل إضافة الملف. لا تنشئ ملفًا يحتوي متغيرات غير مستخدمة.

**متغيرات Backend المتوقعة للتوثيق في ملف منفصل عند التنفيذ:** `JDBC_URL`, `JDBC_USER`, `JDBC_PASSWORD`, `JWT_SECRET_BASE64`, `PASSWORD_RESET_FINGERPRINT_SECRET_BASE64`, `CORS_ALLOWED_ORIGINS`, `IMAGE_STORAGE_DRIVER`, `LOCAL_IMAGE_STORAGE_DIR`, `IMAGE_PUBLIC_BASE_URL`, `MAX_IMAGE_UPLOAD_BYTES`, وإعدادات البريد. القيم الفعلية تُحسم عند تنفيذ كل خدمة.

### 5.3 Cookies وHTTP/HTTPS

| الإعداد | محلي HTTP | إنتاج HTTPS |
|---|---|---|
| `HttpOnly` | true | true |
| `Secure` | false فقط لأن التطوير HTTP محلي | true |
| `SameSite` | Lax افتراضيًا | Lax افتراضيًا؛ Strict عند ملاءمة تدفق الدخول؛ None فقط عند ضرورة cross-site ومع Secure |
| Domain | host-only؛ لا تضبطه بلا حاجة | host-only أو نطاق مدروس؛ لا توسع النطاق بلا ضرورة |
| Path | `/` أو مسار BFF المحدد | `/` أو مسار BFF المحدد |
| CORS | المتصفح يتصل بنفس Next origin؛ BFF server-to-server | نفس النمط؛ لا تفتح CORS للعامة |

- لا تستخدم `SameSite=None` لمجرد أن التطبيق انتقل إلى السحابة.
- CORS لا يحل محل CSRF.
- لا تسمح بـ wildcard origins مع credentials.
- استخدم allowlist دقيقة للأصول عند وجود اتصال cross-origin حقيقي.

### 5.4 نقل البيانات إلى السحابة

يجب أن يتضمن مشروع النقل:
1. Backup متسق لقاعدة البيانات، ثم اختبار restore.
2. تشغيل migrations على بيئة الهدف قبل البيانات.
3. تصدير metadata ومفاتيح الصور النسبية.
4. نسخ الملفات إلى object storage مع mapping واضح للمفاتيح.
5. التحقق من العدد وchecksum/hash ووجود كل object.
6. تحديث/تأكيد base URL أو إعداد CDN دون تخزين روابط مطلقة في DB.
7. Dry-run ثم تنفيذ فعلي ثم smoke tests.
8. خطة rollback/إعادة توجيه للـ adapter، وعدم حذف المصدر المحلي قبل تأكيد القبول.
9. توثيق cutover والوقت والنتيجة.

### 5.5 قائمة فحص الجاهزية السحابية

- [ ] لا توجد أسرار في Git أو ملفات build أو logs.
- [ ] `.env.example` كامل ومراجع، ومتغيرات الإنتاج في Secret Manager.
- [ ] HTTPS وشهادات TLS وHSTS وسياسة cookies Secure.
- [ ] CORS allowlist وCSRF protections وCSP حسب التطبيق.
- [ ] قواعد Firewall وDB private networking وأقل صلاحيات.
- [ ] نسخ احتياطي مشفر لقاعدة البيانات والصور، مع تجربة restore.
- [ ] اختبار نقل الصور والبيانات وchecksum.
- [ ] حدود حجم/نوع الصور ومعدل الرفع ومكافحة الملفات الخبيثة.
- [ ] مراقبة الأخطاء والـ latency والموارد وdisk/storage quotas.
- [ ] Logs منظمة مع correlation IDs دون أسرار.
- [ ] Health checks وتنبيهات ومؤشرات تشغيل.
- [ ] خطة rollback واحتفاظ بالنسخة المحلية حتى إتمام التحقق.
- [ ] اختبار smoke وE2E وaccessibility على بيئة HTTPS.
- [ ] مراجعة تكلفة التخزين والطلبات والنقل/CDN قبل اعتماد المزود.

## 6. مقارنة مزودي التخزين — قرار لاحق

هذه مقارنة تصميمية عامة وليست عرض أسعار حيًا؛ التكلفة تعتمد على المنطقة والحجم وعدد العمليات والنقل والـ egress وسياسة الاحتفاظ.

| الخيار | التكلفة | الأمان والتحكم | التحسين والتوصيل | النسخ الاحتياطي/المرونة | ملاءمته |
|---|---|---|---|---|---|
| Amazon S3 + CDN | عادةً دفع حسب GB والطلبات والنقل؛ قد ترتفع كلفة egress والـ CDN | IAM وسياسات bucket وتشفير ونسخ versioning؛ يحتاج إعدادًا صحيحًا | يحتاج CDN أو image pipeline للتحويلات | قوي مع versioning/replication/lifecycle؛ يجب إعدادها | تخزين عام مرن، تحكم عالٍ، اختيار مرشح قوي |
| Cloudinary | خطط/استهلاك قائم على التخزين والتحويلات وال bandwidth؛ يجب مراجعة حدود الخطة | صلاحيات ومفاتيح API؛ يجب حفظ الأسرار server-side وتقييد unsigned uploads | قوي في التحويلات التلقائية، responsive images، CDN | يوفر إدارة أصول؛ يجب التحقق من backup/export وحدود الخطة | الأسرع في ميزات الصور والتحسين |
| Azure Blob Storage + CDN/Front Door | حسب السعة والعمليات والمنطقة والـ egress | Azure RBAC، private endpoints، encryption، SAS محدود العمر | CDN/Front Door؛ التحويلات تحتاج خدمة إضافية | redundancy وlifecycle وsoft delete حسب الإعداد | ملائم لبيئات Azure والمؤسسات |

**القرار الحالي:** لا مزود سحابي مختار. وقت قرار الاستضافة يقدم ADMIN-0 تحديث مقارنة بأسعار المنطقة الفعلية، التخزين المتوقع، عدد الصور والتحويلات، CDN/egress، النسخ الاحتياطي، وسياسة الاحتفاظ.

## 7. نموذج الإدارة والصلاحيات

### 7.1 الصلاحيات

الصلاحيات المعتمدة هي:
`PRODUCT_READ`, `PRODUCT_WRITE`, `PRODUCT_PUBLISH`, `PRODUCT_ARCHIVE`, `CATEGORY_WRITE`, `PRICE_WRITE`, `INVENTORY_WRITE`, `USER_MANAGE`, `AUDIT_READ`, `SETTINGS_WRITE`.

التوصية التنفيذية: Permission constants منفصلة عن Role names، وربط الأدوار بالصلاحيات عبر Role-Permission mapping. لا تضع منطق الصلاحيات في الواجهة وحدها.

### 7.2 حماية المسارات

- كل `/admin/**` محمي افتراضيًا، ويحتاج هوية موثقة ودورًا إداريًا وصلاحية محددة حسب العملية.
- لا يكفي `authenticated()` لأي مستخدم مسجل.
- تحقق من الصلاحية على مستوى Controller/service method، مع فحص ملكية/نطاق السجل عند الحاجة.
- الواجهة تخفي الأزرار غير المسموحة لتحسين UX، لكن Backend هو enforcement authority.
- مسارات القراءة لا تعطي صلاحيات الكتابة، وعمليات الأرشفة/إدارة المستخدمين/الإعدادات تظل ADMIN-only.

## 8. ADM-1..ADM-8 — خارطة المراحل

| المرحلة | النطاق | المخرجات |
|---|---|---|
| ADM-1 | المصادقة، الأدوار، الصلاحيات، سجل التدقيق | BFF session model، EDITOR، method security، audit append-only، اختبارات وصول |
| ADM-2 | Admin API foundation | Controllers/services/DTOs، pagination، validation، error contract |
| ADM-3 | Admin frontend shell & session | Next.js admin shell، BFF routes، session refresh/logout/CSRF |
| ADM-4 | إدارة التصنيفات | CRUD، عمق مستويين، منع cycles، archive safeguards، seed مطابق للـ HTML |
| ADM-5 | إدارة المنتجات والأسعار | Draft/publish/archive، price/compareAtPrice، discountPercent server-calculated، isNew 30 days |
| ADM-6 | الصور والمحتوى | Upload validation، Storage Adapter، local filesystem، migration tooling |
| ADM-7 | الطلبات والمستخدمون والإعدادات | قوائم وصلاحيات حسب الدور، إعدادات آمنة، عمليات دعم/تشغيل ضمن أدوارها دون كسرها |
| ADM-8 | Hardening & acceptance | Security tests، E2E، backup/restore، cloud readiness checklist |

## 9. سجل PR #30 — Mega Menu وFavorite SVG

### 9.1 الحالة والدمج [GH]

- PR: [#30](https://github.com/mosalah00x-source/classic-store-New/pull/30)
- العنوان: `fix(frontend): improve category mega menu and catalog favorite icon`
- Head SHA: `0f6da6c0e3a9beee757b57a634bc62b8bcc31fe0`
- Merge SHA: `666dd2151172b56f57e10b4446c63a58f5d9d7a2`
- Base: `FrontendApp`
- Timeline: حدث `ready_for_review` بواسطة `mosalah00x-source` عند 15:59:38 UTC؛ حدث `merged` بواسطة `mosalah00x-source` عند 15:59:42 UTC.
- لا يظهر حدث Auto-merge في Timeline؛ لا ننسب الدمج إلى Auto-merge.
- Reviews API أعاد قائمة فارغة؛ لا توجد موافقة PO على GitHub مثبتة في Review records.
- لذلك يسجل الدمج كحدث GitHub، وليس كدليل على موافقة PO.
- المراجعة البصرية بعد الدمج **لم تتم/لم تُثبت بلقطات قابلة لإعادة الفحص**، وهي ما زالت مطلوبة.

### 9.2 الملفات المتغيرة [GH]

1. `frontend/src/components/StorefrontHeader.tsx`: سلوك Mega Menu، فتح/إغلاق، خارج القائمة، Escape، إدارة التركيز والتنقل بالأسهم وHome/End.
2. `frontend/src/app/globals.css`: تحسين responsive للـ Mega Menu، التفاف النص، منع overflow، hover bridge، وأيقونة SVG للمفضلة.
3. `frontend/src/components/CatalogClient.tsx`: استبدال Unicode heart بأيقونة SVG.
4. `frontend/tests/storefront-shell.test.tsx`: regression assertions.

النطاق المعلن في PR هو frontend فقط، بلا Backend/API/dependency/lockfile changes.

### 9.3 CI [GH]

- Head Run: [45040249741](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45040249741) — completed / success.
- Head SHA في الـ Run يطابق `0f6da6c...`.
- الخطوات: Lint، Typecheck، Unit tests، Production build — كلها success.
- Merge SHA check-runs: GitHub يعرض Check باسم `frontend` completed/success.
- Commit combined status endpoint على Merge SHA أعاد `pending` مع statuses فارغة؛ لذلك هذا المستند يثبت نجاح frontend check فقط، ولا يعلن أن جميع status contexts المجمعة green.
- لا توجد مراجعة بصرية بديلة عن CI.

### 9.4 مصفوفة المراجعة البصرية المتبقية [UNVERIFIED]

Mega Menu:
- [ ] 1440px عربي/إنجليزي Light/Dark.
- [ ] 1100px و1000px للتأكد من عدم clipping أو horizontal scrollbar.
- [ ] 390px عربي/إنجليزي Light/Dark.
- [ ] النصوص الطويلة لا تُقص.
- [ ] إغلاق عند pointer exit/outside click/Escape.
- [ ] keyboard focus وArrow/Home/End وaria-expanded.
- [ ] hover bridge يمنع إغلاق القائمة أثناء الانتقال من الزر للوحة.

Product favorite:
- [ ] 390px عربي/إنجليزي Light/Dark.
- [ ] 1440px عربي/إنجليزي Light/Dark.
- [ ] القلب غير المحدد Outline واضح، والمحدد Filled.
- [ ] aria-label مترجم وaria-pressed صحيح.
- [ ] تجربة toggle والاستمرار عبر إعادة التحميل حسب السلوك المحلي الحالي.

## 10. بوابة DOC-01 ثم ADM-1

- DOC-01 يوثق المشروع والقرارات والتصميم دون Backend code.
- PR التوثيق يبقى Draft.
- لا دمج قبل موافقة PO المكتوبة على GitHub.
- بعد الدمج فقط تُعرض خطة ADM-1 للموافقة النهائية/التأكيد.
- لا يبدأ ADM-1 implementation قبل موافقة PO المكتوبة على الخطة.
- لا force push، ولا merge تلقائي، ولا افتراض موافقة.

## 11. مراجع المصدر

- `backend/src/main/java/com/classicstore/config/SecurityConfig.java`
- `backend/src/main/java/com/classicstore/identity/security/JwtAuthenticationFilter.java`
- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/db/migration/V1__baseline_types_identity.sql`
- `backend/src/main/resources/db/migration/V2__catalog.sql` إلى `V7__integrity_and_reservation_hardening.sql`
- `backend/scripts/generate-migrations.py`
- `.github/workflows/backend-ci.yml`
- `docs/api/openapi.yaml`
- `docs/reference/Classic_Store_Project_Master_Reference_AR.md`
- `docs/reference/Classic_Store_SRS_v1.1.1.md`
- GitHub PR #30 وTimeline وChecks.

