# ADM-1 — خطة المصادقة والأدوار وسجل التدقيق (تقرير فقط)

**Repository:** `mosalah00x-source/classic-store-New`  
**Branch:** `docs/project-reference`  
**تاريخ الخطة:** 22 نوفمبر 2026  
**الحالة:** PROPOSAL — لا كود، لا migrations، لا تغيير OpenAPI حتى موافقة PO.

---

## 1. المطلوب من PO قبل التنفيذ

لا يوجد إجراء مطلوب الآن سوى مراجعة هذه الخطة بعد دمج DOC-01. يلزم اعتماد مكتوب على GitHub قبل بدء أي تنفيذ. لا تعتبر هذه الوثيقة موافقة ضمنية.

## 2. نطاق ADM-1

### داخل النطاق

1. إضافة `EDITOR` إلى نموذج الأدوار مع الإبقاء على `ADMIN`, `OPERATIONS`, `WAREHOUSE`, `SUPPORT`.
2. إضافة نموذج Permission mapping وربطه بالأدوار.
3. حماية كل مسارات `/admin/**` وعمليات الإدارة حسب الصلاحية.
4. تصميم Next.js BFF session باستخدام Cookie HttpOnly.
5. CSRF وCORS وCookie policy لكل بيئة.
6. Audit Log append-only.
7. Bootstrap آمن لأول ADMIN، وإجبار تغيير كلمة المرور.
8. اختبارات إيجابية وسلبية للصلاحيات والمصادقة والتدقيق.

### خارج النطاق

- لا تعديل على أدوار `OPERATIONS`, `WAREHOUSE`, `SUPPORT`.
- لا Admin UI أو CRUD كامل؛ هذه مراحل ADM-2 وما بعدها.
- لا رفع صور أو Storage Adapter implementation؛ التصميم موثق في ADMIN-0، والتنفيذ ضمن ADM-6.
- لا موافقة مدير على تغييرات السعر؛ مؤجل.
- لا تغيير في قاعدة بيانات الإنتاج أو بيانات حقيقية دون خطة migration وbackup معتمدة.
- لا تغيير مزود التخزين السحابي.
- لا JWT في المتصفح أو localStorage.

## 3. Migration plan — النسخة التالية V8

### 3.1 الحالة الحالية [GH]

- migrations الحالية من `V1` إلى `V7`.
- آخر migration: `V7__integrity_and_reservation_hardening.sql`.
- `store.user_role` enum الحالي يحتوي `CUSTOMER`, `ADMIN`, `OPERATIONS`, `WAREHOUSE`, `SUPPORT`.
- المشروع يحتوي `backend/scripts/generate-migrations.py` و`backend/db-source.lock` للتحقق من مصدر قاعدة البيانات وتوليد/تثبيت migrations.
- CI يتحقق من generated migrations والـ lock، ثم يطبق migrations على PostgreSQL 16 باستخدام Flyway 10.20.1، ويتحقق من idempotency وبعض invariants.

### 3.2 قيد مهم في آلية توليد migrations الحالية

الـ generator الحالي مثبت على source commit غير متغير (`0c6e9f1...`) وملف SQL إصدار V1–V7، كما أن قائمة الملفات وعدد transaction blocks وعدد migrations كلها ثابتة عند 7. لذلك لا يمكن إضافة V8 إلى مجلد migrations فقط: سيُرفض ذلك بواسطة `generate-migrations.py --check` لأنه يتوقع بالضبط سبعة ملفات. كذلك لا يجوز تعديل V1–V7 أو تغيير hashes القائمة.

قبل V8 يجب اعتماد تحديث versioned لمصدر schema/generator: إضافة مصدر SQL immutable جديد يتضمن V1–V8 (أو إضافة V8 source fragment immutable منفصل)، ثم تحديث generator ليقرأ المصدر الجديد، ويحافظ على byte-for-byte hashes للـ V1–V7، ويولد V8 وحدها. يتم تحديث `backend/db-source.lock` بناءً على ذلك. هذه خطوة tooling داخل ADM-1 وتحتاج مراجعة مستقلة للـ diff.

### 3.3 Migration V8 المقترحة

`V8__add_editor_role.sql` لإضافة قيمة enum فقط:

```sql
ALTER TYPE store.user_role ADD VALUE IF NOT EXISTS 'EDITOR';
```

قواعد الأمان:
- لا تعيد كتابة V1 أو V7؛ لا تعدل migration مطبقة.
- لا تستخدم القيمة الجديدة في statement آخر داخل نفس migration؛ افصل إضافة enum عن أي seed/UPDATE يستخدم EDITOR.
- تحقق من إصدار PostgreSQL الذي يستهدفه المشروع قبل التنفيذ. في الإصدارات الحديثة يمكن إضافة enum value ضمن transaction، لكن لا تعتمد على استخدام القيمة قبل commit.
- يجب تحديث مصدر schema الأصلي وفق سياسة المشروع، ثم تشغيل generator لتحديث migrations وlock. لا تضف migration يدويًا وتتجاوز آلية `generate-migrations.py`.
- راجع diff الناتج وhash lock، وشغّل `--check` قبل commit.
- أضف اختبارًا يثبت وجود EDITOR بعد migrate.
- لا تغير default التسجيل العام من CUSTOMER.

### 3.4 جداول الصلاحيات المقترحة

التصميم المفضل (يُراجع مع مصدر schema قبل التنفيذ):
- `store.permissions`: permission_code unique، description.
- `store.role_permissions`: role + permission FK أو mapping مضبوط، مع unique constraint.
- لا تجعل أسماء الصلاحيات strings حرة بلا constraint.
- يمكن أن يكون role enum حاليًا؛ لا تستبدله الآن بنظام roles ديناميكي دون سبب.
- سجل أي تعديل على role-permission mapping في audit log.

### 3.5 Audit table المقترح

مثال مفاهيمي فقط — ليس migration جاهزًا:

- `id` UUID أو bigint identity.
- `actor_user_id` FK مناسب مع حفظ أثر actor عند تعطيل المستخدم.
- `action` ثابت/مقيد.
- `entity_type`, `entity_id`.
- `occurred_at` timestamptz.
- `correlation_id` أو request id.
- `before_data` و`after_data` JSONB بعد تنقية الحقول الحساسة.
- `metadata` JSONB محدود ومتحقق منه.
- فهارس حسب actor/entity/time.
- لا تخزن passwords أو tokens أو بيانات دفع حساسة.

منع UPDATE/DELETE:
- لا توجد endpoints للتعديل أو الحذف.
- صلاحية DB الخاصة بالتطبيق لا تمنح UPDATE/DELETE على الجدول.
- أضف trigger يمنع UPDATE/DELETE حتى لا يستطيع مسار application عارض تغيير السجل.
- الاختبارات تثبت أن INSERT ينجح وأن UPDATE/DELETE مرفوضان.
- احتفظ بآلية retention/legal hold فقط بقرار منفصل؛ لا تضف حذفًا صامتًا.

### 3.6 Migration V9 المقترحة للصلاحيات والتدقيق

بعد نجاح V8 في بيئة نظيفة وبيئة ترقية، يمكن أن تتضمن V9 جداول permission mapping وجدول audit log append-only. لا تستخدم `EDITOR` في seed أو FK أو بيانات صلاحيات قبل أن تكون V8 قد اكتملت في إصدار سابق.

V9 لا تُكتب قبل حسم شكل الجداول ومصدر schema immutable، ويجب أن تحافظ على hashes V1–V8 وتضيف migration جديدة فقط. أعداد الجداول والأعمدة المتوقعة في CI يعاد احتسابها من PostgreSQL بعد التصميم النهائي، ولا نخمنها هنا.

## 4. Permission model وmethod security

### 4.1 ربط الصلاحيات بالأدوار

| Permission | ADMIN | EDITOR |
|---|---:|---:|
| PRODUCT_READ | نعم | نعم |
| PRODUCT_WRITE | نعم | نعم |
| PRODUCT_PUBLISH | نعم | نعم |
| PRODUCT_ARCHIVE | نعم | لا |
| CATEGORY_WRITE | نعم | نعم |
| PRICE_WRITE | نعم | نعم |
| INVENTORY_WRITE | نعم | نعم |
| USER_MANAGE | نعم | لا |
| AUDIT_READ | كامل | لا |
| SETTINGS_WRITE | نعم | لا |

الـ UI ليس حدًا أمنيًا. كل endpoint/service method يفرض الصلاحية من Backend.

### 4.2 Method security

- تفعيل method security في Spring Security.
- تعريف Permission evaluator أو authorities ثابتة مثل `PERM_PRODUCT_WRITE`.
- تحويل role-permission mapping إلى GrantedAuthority عند بناء Authentication.
- استخدام `@PreAuthorize` على service methods الحساسة (أو طبقة application service)، وليس الاعتماد على Controller فقط.
- فصل صلاحية القراءة عن الكتابة والنشر والأرشفة.
- تحقق إضافي من ownership/scope على الموارد.
- أي endpoint غير مصنف يظل محميًا deny-by-default.

### 4.3 سياسة مسارات الإدارة

| المسار/العملية | المطلوب |
|---|---|
| `GET /admin/**` | ADMIN أو EDITOR + صلاحية القراءة المقابلة |
| إنشاء/تعديل منتج | PRODUCT_WRITE |
| نشر/إلغاء نشر منتج | PRODUCT_PUBLISH |
| أرشفة/استعادة منتج | PRODUCT_ARCHIVE (ADMIN فقط) |
| إنشاء/تعديل تصنيف | CATEGORY_WRITE |
| تغيير السعر | PRICE_WRITE |
| تغيير المخزون | INVENTORY_WRITE |
| إدارة المستخدمين/الأدوار | USER_MANAGE (ADMIN فقط) |
| قراءة Audit Log | ADMIN فقط؛ EDITOR لا يملك صلاحية القراءة |
| إعدادات الموقع | SETTINGS_WRITE (ADMIN فقط) |

مهم: المسارات المذكورة في OpenAPI لا تثبت وجود Controllers. في التنفيذ يجب عمل inventory فعلي لكل `/admin/**`، ومطابقة OpenAPI مع Controller + service + security test. أي route غير مدرج يجب أن يُمنع افتراضيًا حتى تصنيفه.

## 5. BFF sessions وrefresh وrevocation

### 5.1 التدفق المقترح

1. المتصفح يرسل بيانات الدخول إلى Next.js route handler على نفس origin.
2. Next.js server يتصل بـ Backend عبر server-to-server channel.
3. Backend يتحقق من بيانات الدخول ويصدر access/refresh tokens إلى BFF فقط.
4. BFF ينشئ session id عشوائي opaque، ويحفظ session وtokens في مخزن server-side.
5. المتصفح يستلم Cookie للجلسة فقط: HttpOnly، Secure حسب البيئة، SameSite=Lax، Path=/، host-only.
6. كل طلب للمتصفح إلى Next.js يرسل Cookie تلقائيًا؛ BFF يتحقق من session ثم يستدعي Backend.
7. لا يعاد أي token للمتصفح أو client-side JavaScript.

### 5.2 Refresh rotation

- Access token قصير العمر؛ الإعداد الحالي في Backend access TTL = 15 دقيقة وrefresh TTL = 7 أيام، ويعاد تقييمهما أثناء التنفيذ.
- BFF يراقب expiry ويستخدم refresh token server-side فقط.
- تدوير refresh token عند الاستخدام، وتحديثه ذريًا في مخزن الجلسات.
- اكتشاف reuse للـ refresh token القديم يؤدي إلى إبطال عائلة الجلسة/الجلسات المرتبطة حسب سياسة Backend.
- لا refresh من المتصفح مباشرة إلى Backend.

### 5.3 الإلغاء الفوري

- Logout يبطل session id في BFF ويستدعي Backend revoke/logout لإبطال refresh token.
- تعطيل مستخدم أو تغيير كلمة المرور/الدور يبطل الجلسات ذات الصلة.
- دعم session version أو token family/revocation record؛ لا تعتمد على انتهاء access token وحده.
- تحقق من revocation في كل طلب حساس، أو بمدة cache قصيرة مع invalidation واضحة.
- اختبر أن جلسة مستخدم تم تعطيله أو سحب دوره لا تستمر في الوصول.

## 6. CSRF وCORS وCookies

### 6.1 CSRF

لأن Cookie ترسل تلقائيًا:
- استخدم CSRF token مرتبطًا بالجلسة (Synchronizer token أو signed double-submit) للطلبات mutating.
- افحص `Origin` و`Referer` عند وجودهما مقابل allowlist.
- لا تعتمد على SameSite وحده.
- GET/HEAD/OPTIONS لا تغير حالة.
- اختبر POST/PUT/PATCH/DELETE من origin غير موثوق وبدون CSRF token؛ يجب أن ترفض.
- لا تضع CSRF token في HttpOnly cookie وحدها إذا كان العميل يحتاج قراءته؛ يمكن توفيره عبر endpoint أو meta/response آمن.

### 6.2 CORS

- المتصفح يتحدث مع Next.js على نفس origin؛ لذلك لا يحتاج إلى CORS بين المتصفح والـ Backend.
- اتصال BFF بالـ Backend server-to-server لا يخضع لـ browser CORS.
- لا تفعّل `allowCredentials=true` على Backend لمجرد استخدام cookies في BFF.
- إذا ظهر احتياج cross-origin حقيقي، استخدم allowlist دقيقة، لا wildcard، وراجع preflight/credentials.
- CORS لا يغني عن CSRF ولا المصادقة.

### 6.3 Cookies حسب البيئة

| الخاصية | Local HTTP | Cloud HTTPS |
|---|---|---|
| HttpOnly | true | true |
| Secure | false | true |
| SameSite | Lax | Lax افتراضيًا |
| Domain | host-only | host-only مفضّل |
| Path | / | / |
| Max-Age | يساوي سياسة session | يساوي سياسة session |

لا تستخدم `SameSite=None` إلا إذا كان هناك تدفق cross-site موثق، ومع Secure=true. لا تشارك cookie على subdomains دون حاجة.

## 7. أول ADMIN والتسجيل العام

- التسجيل العام يحدد role على الخادم `CUSTOMER` بغض النظر عن أي role يرسله العميل.
- DTO العام لا يقبل role؛ أو يرفض unknown field حسب إعداد Jackson الحالي.
- Bootstrap لأول ADMIN يتم بأمر one-time محمي أو أداة تشغيل محلية تقرأ secret من stdin/secret env.
- لا seed لكلمة مرور ثابتة.
- تخزين hash فقط، وتسجيل event إداري دون كلمة المرور.
- `must_change_password=true` أو آلية مكافئة تفرض تغيير كلمة المرور عند أول login.
- اجعل أمر bootstrap يرفض التنفيذ إذا كان ADMIN موجودًا، ويسجل audit event.
- لا تطبع الأسرار في console/CI logs.

## 8. Audit events المطلوبة مبدئيًا

- Product created/updated/published/unpublished/archived/restored.
- Category created/updated/archived.
- Price changed (before/after مع العملة، بعد تنقية البيانات).
- Inventory adjustment.
- Role/permission changes.
- Admin login/logout/session revoke.
- Settings changes.
- Upload metadata events عند وصول ADM-6.

لا تسجل payloads كاملة إذا احتوت بيانات شخصية أو أسرار. استخدم allowlist للحقول القابلة للتدقيق.

## 9. الاختبارات المطلوبة

### 9.1 Authentication / Session

- unauthenticated request إلى كل admin route يرجع 401.
- invalid/expired token يرجع 401.
- disabled user يرجع 401/403 وفق contract ثابت.
- refresh rotation ينجح مرة واحدة، وإعادة استخدام refresh القديم تُرفض وتبطل العائلة.
- logout يبطل الجلسة.
- تغيير كلمة المرور/تعطيل المستخدم يبطل الجلسات.
- Cookie لا تحتوي JWT ولا يمكن قراءتها عبر JavaScript؛ HttpOnly صحيح.
- Secure=false محلي HTTP وtrue في HTTPS config.

### 9.2 Authorization — اختبارات سلبية إلزامية

- CUSTOMER لا يستطيع فتح أي `/admin/**`.
- EDITOR لا يستطيع أرشفة/استعادة منتج.
- EDITOR لا يستطيع إدارة مستخدم أو تغيير دور.
- EDITOR لا يستطيع تعديل إعدادات الموقع.
- EDITOR لا يستطيع قراءة Audit Log إطلاقًا؛ `AUDIT_READ` للـ ADMIN فقط.
- OPERATIONS/WAREHOUSE/SUPPORT لا يحصلون تلقائيًا على صلاحيات ADMIN/EDITOR.
- مستخدم authenticated بلا permission لا ينجح في endpoint محمي.
- محاولة إرسال role=ADMIN في public registration لا تنشئ ADMIN.
- route إداري جديد غير مصنف يُمنع افتراضيًا.
- لا يمكن تجاوز الحماية باستدعاء service method مباشرةً من مسار آخر.

### 9.3 Audit

- العملية الإدارية الناجحة تنتج audit event واحدًا.
- فشل العملية لا يسجل حدث نجاح زائف.
- event يحتوي actor/action/entity/time/correlation id.
- UPDATE/DELETE على audit table يفشلان.
- لا توجد أسرار أو password/token داخل audit record.

### 9.4 Database / Migration

- clean database: V1..V8 تنفذ بنجاح.
- upgrade database: V1..V7 ثم V8.
- rerun Flyway لا يكرر أو يفسد.
- EDITOR موجود بعد V8.
- التسجيل العام ما زال CUSTOMER.
- permissions mapping unique وreferential integrity.
- DB permissions/trigger تمنع تعديل audit rows.

## 10. ما الذي يعمل في Backend CI فعلًا؟ [GH]

الملف الحالي: `.github/workflows/backend-ci.yml`.

### Triggers

- push إلى `BackendApp` عند تغييرات `backend/**` أو `docs/api/**` (باستثناء Markdown تحت docs/api) أو `redocly.yaml` أو ملف workflow نفسه.
- pull_request إلى `BackendApp` بنفس path filters.
- لا يوجد trigger عام على كل فروع التوثيق.

### Jobs

1. `verify-migrations`
   - PostgreSQL 16 service.
   - يتحقق من مصدر migrations والـ lock عبر `python backend/scripts/generate-migrations.py --check`.
   - self-test لكشف العبث بالـ hash.
   - يطبق كل migrations على PostgreSQL نظيف باستخدام Flyway 10.20.1.
   - يتحقق من idempotency.
   - يتحقق من عدد migrations والجداول والأعمدة وcitext invariants (القيم الحالية المتوقعة في workflow هي 7 migrations و32 جدولًا و251 عمودًا).
2. `api-lint`
   - Node 22.
   - Redocly CLI 2.77.0 lint على `docs/api/openapi.yaml`.
3. `backend`
   - Java 21 Temurin + Maven cache.
   - ينتظر نجاح verify-migrations.
   - يشغل `./mvnw -B verify` داخل backend.
   - يستخدم Docker/Testcontainers حسب الاختبارات.

**مهم:** هذه هي خطوات CI المعرفة في workflow، وليست إثباتًا أن ADM-1 قد نُفذ أو أن اختبارات ADM-1 موجودة. يجب تحديث أعداد migrations/tables/columns في CI عند إضافة V8 وجداول جديدة.

**فجوة تشغيلية:** workflow الحالي يستهدف `BackendApp` فقط. PR التوثيق الذي يستهدف BackendApp لا يشغّل backend-ci من أجل Markdown فقط؛ لأن path filters تستثني `docs/api/*.md` ولا تشمل `docs/project-reference/**`. إذا غيّر PR ملف OpenAPI أو `redocly.yaml` قد يعمل api-lint. لا تتوقع تشغيل backend job لمجرد إضافة docs Markdown. لا تتوقع تشغيل backend job لمجرد إضافة docs markdown.

## CI-01 — تشغيل الفحوص المطلوبة مع PRs التوثيق [TECHNICAL DEBT]

### المشكلة
يستخدم `.github/workflows/backend-ci.yml` مرشحات `paths` على مستوى `push` و`pull_request`. قبل إصلاح CI-01، كانت هذه المرشحات لا تشمل `docs/project-reference/**` أو `docs/README.md`. لذلك PR توثيق يستهدف `BackendApp` ولا يغيّر مسارًا مشمولًا لا ينشئ Workflow run أصلًا؛ وتظل الفحوص المطلوبة في Branch Protection بحالة `Expected — Waiting for status to be reported` بدل أن تفشل أو تنجح.

### الحل المؤقت المعتمد في PR الإصلاح
إضافة المسارين التاليين فقط إلى قائمتي `paths` في كل من `push` و`pull_request`:
- `docs/project-reference/**`
- `docs/README.md`

يظل الاستثناء `!docs/api/*.md` كما هو، ولا تتغير أسماء jobs المطلوبة (`verify migrations` و`api-lint` و`backend`)، ولا إعدادات Branch Protection أو خطوات jobs أو Dependencies أو Actions الخارجية. نتيجة ذلك أن PRs التوثيق التي تستهدف `BackendApp` ستشغّل اختبارات Backend والتحقق من migrations وAPI lint أيضًا؛ وهذه تكلفة CI إضافية مقبولة مؤقتًا.

### البدائل الأنظف لاحقًا — غير منفذة
1. إزالة فلتر المسارات من مستوى الـ workflow، والإبقاء على trigger للـ PR، ثم وضع شروط داخلية على مستوى كل job بحيث تُنفذ الوظائف المطلوبة بحسب الملفات المتغيرة. يجب الحفاظ على أسماء check contexts المطلوبة والتحقق عمليًا من أن job المتخطية بشرط تُسجل نجاحًا مقبولًا في Branch Protection.
2. Workflow مكمّل لمسارات التوثيق يبلّغ بنفس أسماء الـ jobs المطلوبة، مع ضمان عدم وجود تعارض أو check contexts مكررة أو غموض في مصدر الحالة. يجب اختبار سلوك Branch Protection قبل اعتماده.

### الحالة
CI-01 **دَين تقني مسجل وغير منفذ كتحسين معماري**. التعديل المؤقت في workflow منفصل عن هذا المستند ويحتاج PR وموافقة دمج مستقلة. لا تعتبر هذه الوثيقة دليلًا على نجاح الفحوص؛ حالة التشغيل والـ Run IDs والـ Head SHAs تُثبت من GitHub Actions لكل PR على حدة.

---
 
## 11. تشغيل Backend وقاعدة البيانات محليًا

### 11.1 المتطلبات

- Java 21.
- Docker Desktop يعمل.
- Maven Wrapper موجود في `backend/mvnw`.
- PostgreSQL 16 (باستخدام Docker محليًا).
- PowerShell على Windows أو Bash على Linux/macOS.

لا يوجد في جرد الملفات الحالي `docker-compose.yml` أو `compose.yaml` موثق؛ لذلك الأوامر التالية تستخدم `docker run` مباشرة.

### 11.2 تشغيل PostgreSQL 16

PowerShell:

```powershell
docker run --name classic-store-postgres -e POSTGRES_DB=classic_store -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

إذا كان الحاوي موجودًا ومتوقفًا:

```powershell
docker start classic-store-postgres
```

التحقق:

```powershell
docker exec classic-store-postgres pg_isready -U postgres -d classic_store
```

> كلمة المرور أعلاه للاستخدام المحلي فقط كما في إعداد التطوير الحالي؛ لا تستخدمها في بيئة مشتركة أو سحابية.

### 11.3 إعداد أسرار التطوير

في PowerShell (نافذة الجلسة الحالية فقط)، ولتوليد مفاتيح عشوائية تشفيرياً:

```powershell
$env:JDBC_URL = "jdbc:postgresql://localhost:5432/classic_store"
$env:JDBC_USER = "postgres"
$env:JDBC_PASSWORD = "postgres"

$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = New-Object byte[] 48
$rng.GetBytes($bytes)
$env:JWT_SECRET_BASE64 = [Convert]::ToBase64String($bytes)
$rng.GetBytes($bytes)
$env:PASSWORD_RESET_FINGERPRINT_SECRET_BASE64 = [Convert]::ToBase64String($bytes)
$rng.Dispose()

$env:CORS_ALLOWED_ORIGINS = "http://localhost:3000"
```

هذه مفاتيح تطوير محلية مؤقتة؛ لا تحفظها في Git ولا تشاركها. استخدم Secret Manager أو آلية secrets الخاصة ببيئة التشغيل للإنتاج.

### 11.4 تشغيل migrations واختبارات Backend

من جذر المستودع في Windows PowerShell، استخدم Git Bash إذا كان متاحًا:

```powershell
cd backend
bash ./mvnw -B verify
```

أو من داخل Git Bash/WSL:

```bash
cd backend
./mvnw -B verify
```

اللقطة الحالية تحتوي `backend/mvnw` ولا يظهر فيها `mvnw.cmd`؛ لذلك لا تستخدم `./mvnw.cmd` ما لم تتم إضافته لاحقًا. backend CI يستخدم `./mvnw -B verify`.

### 11.5 تشغيل التطبيق

بعد ضبط متغيرات البيئة، من PowerShell مع Git Bash:

```powershell
bash ./mvnw spring-boot:run
```

أو من Git Bash/WSL:

```bash
./mvnw spring-boot:run
```

Flyway مفعّل في `application.yml`، لذلك يطبق migrations عند بدء التشغيل. افحص health endpoint:

```powershell
Invoke-RestMethod http://localhost:8080/actuator/health
```

### 11.6 ملاحظات تشغيل مهمة

- `backend/README.md` يذكر عدم وجود persistence/Flyway/DB driver، لكن `backend/pom.xml` يحتوي فعليًا `spring-boot-starter-jdbc` و`flyway-core` و`flyway-database-postgresql` وPostgreSQL runtime driver، مع عدم وجود JPA dependency. لذلك وصف README الحالي غير متوافق مع pom والمigrations ويحتاج تحديثًا توثيقيًا منفصلًا.
- لا تنفذ هذه الأوامر على قاعدة بيانات حقيقية دون backup.
- إذا فشل Docker/Testcontainers، تحقق من Docker Desktop وموارد daemon.
- لا توجد أوامر مؤكدة حاليًا لتشغيل Next BFF مع Backend؛ توثق لاحقًا بعد بناء BFF في ADM-3.

## 12. التسلسل وبوابات الموافقة

1. إنهاء DOC-01 وفتح PR توثيق Draft.
2. مراجعة PO للتوثيق والتأكد من القرارات.
3. موافقة PO الصريحة على GitHub ثم دمج DOC-01 بواسطة PO/بعد الإذن.
4. تقديم خطة ADM-1 النهائية بعد الدمج، مع أي تعديلات لازمة.
5. لا يبدأ ADM-1 implementation إلا بموافقة مكتوبة صريحة على الخطة.
6. لا merge لأي مرحلة لاحقة دون مراجعة PO الموثقة.

