# Classic Store: SRS v1.1.1

**الحالة:** معتمد من Product Owner (تاريخ الاعتماد: 11 نوفمبر 2026). بانتظار اعتماد Tech Lead وQA وOperations وSecurity قبل التحويل إلى Baseline.
**الإصدار السابق:** SRS v1.0 (21 أكتوبر 2026)
**النطاق:** مصر، منتجات مادية، EGP، Guest Checkout، مخازن متعددة.
**هذا المستند مواصفات وعقود تصميمية، ولا يعني أن أي API منفذ.**

---

## 0. سجل التغييرات من v1.0

| المجال | التغيير |
|---|---|
| REST API | توسيع القائمة من 21 إلى قائمة كاملة تغطي كل FR (انظر القسم 9). **معيار الـ32 السابق ملغى.** |
| Roles | حذف دور Finance من هذا الإصدار. الأدوار الخمسة فقط. |
| Error Contract | إضافة `messageEn`، وتثبيت كتالوج الأخطاء الكامل (القسم 11). |
| Checkout | منع إرسال `grandTotal` و`status` و`warehouseId` في الـ Request. |
| Payments | `POST /orders/{id}/payments` بعقد دنيا معلقة على OPEN-01. |
| Auth | Refresh وLogout Stateless؛ تغيير كلمة المرور لا يبطل الجلسات القديمة؛ استعادة الكلمة برابط بريد 15 دقيقة قابل لإعادة الاستخدام (Accepted Risk). |
| Database | لا توجد Migration V8 ولا جدول `password_reset_tokens`. |
| OPEN | إضافة OPEN-11 (الموبايل والعنوان) وOPEN-12 (مصدر المحافظات والمدن). |
| تصحيحات | FR-AUTH-02 لم يعد يذكر "إلغاء" Refresh Token. مراجع القسم 20 مصححة للمسارات الفعلية في الريبو. |

---

## 1. الملخص التنفيذي

Classic Store متجر B2C لبيع المنتجات المادية في مصر، بواجهة عربية RTL أساسية وإنجليزية، ولوحة إدارة، ودفع عند الاستلام أو إلكتروني، وإدارة مخازن ومخزون ومرتجعات.

- Backend: Spring Boot 3.4 / Java 21، Modular Monolith.
- Frontend: Next.js / React / TypeScript.
- Database: PostgreSQL 16، المخطط `store`، Migrations V1–V7 (V1–V6 مطبقة من المصدر، V7 مطبقة وتحت اختبار التزامن).

طلب V1 يُخصص لمخزن واحد نشط يغطي كامل الكميات، وفق أقرب مسافة جغرافية. لا تقسيم بين المخازن في V1.

---

## 2. نطاق الإصدار الأول

**داخل النطاق:** الكتالوج العام والإداري، الحساب والعناوين، السلة، Guest وCustomer Checkout، الكوبونات والشحن، المخزون والحجوزات، الطلبات والدفع (COD وإلكتروني)، التجهيز والشحن والتتبع، المرتجعات والاستردادات، لوحة الإدارة والتقارير وسجل التدقيق، التسجيل والدخول وتجديد الجلسة والخروج وتغيير/استعادة كلمة المرور.

**خارج النطاق أو مؤجل:** Marketplace متعدد البائعين، تطبيق iOS/Android أصلي، الولاء والتوصيات، تعدد الدول والعملات، ERP ومحاسبة متكاملة، تقسيم الطلب بين المخازن، دور Finance (مؤجل لحين Migration مستقلة معتمدة).

---

## 3. الأدوار

| الدور | الهدف |
|---|---|
| Guest | تصفح، سلة، شراء بدون حساب، تتبع الطلب برمز |
| Customer | الحساب والعناوين والطلبات والمرتجعات |
| ADMIN | إدارة المستخدمين والإعدادات والكتالوج والصلاحيات |
| OPERATIONS | الطلبات والحجوزات والشحن والمرتجعات والاسترداد |
| WAREHOUSE | تجهيز الطلبات والمخزون الخاص بالمخزن |
| SUPPORT | استعلام محدود عن الطلبات ومساعدة العملاء وطلبات المرتجع |

تُحدد صلاحيات كل Endpoint تفصيليًا في OpenAPI، ولا تُستنتج من اسم الدور. صلاحيات الإدارة الإضافية (مثل تعديل الأدوار) محكومة بـ OPEN-09.

---

## 4. القرارات المقفلة

| ID | القرار |
|---|---|
| DEC-01 | العملة EGP، والنطاق مصر فقط. الضرائب والفواتير وفق OPEN-03 |
| DEC-02 | منتجات مادية فقط، وSKU فريد، لا منتجات رقمية |
| DEC-03 | مخازن متعددة؛ طلب V1 يُخصص لمخزن واحد يغطي جميع البنود |
| DEC-04 | أقرب مخزن بـ Haversine بين إحداثيات العنوان والمخزن، وليس زمن القيادة |
| DEC-05 | Guest Checkout بدون حساب؛ بيانات الاتصال والعنوان تُحفظ Snapshot داخل الطلب |
| DEC-06 | TTL الحجز 15 دقيقة مبدئيًا؛ التحرير والاستهلاك idempotent |
| DEC-07 | لا يُؤكد الدفع الإلكتروني إلا بتحقق خادمي موثوق من المزود |
| DEC-08 | Refresh وLogout Stateless؛ لا إبطال فوري للتوكنات |
| DEC-09 | Refresh Token صالح حتى انتهاء مدته، بحد أقصى 7 أيام. Access Token 15 دقيقة |
| DEC-10 | تغيير كلمة المرور لا يبطل Refresh Tokens القديمة |
| DEC-11 | رابط استعادة كلمة المرور يُرسل بالبريد، صلاحيته 15 دقيقة، وقابل لإعادة الاستخدام خلالها |
| DEC-12 | لا جدول `password_reset_tokens` ولا Migration V8 لهذا الغرض |
| DEC-13 | المبالغ في API Strings بمنزلتين عشريتين، والعملة `EGP` |
| DEC-14 | `Idempotency-Key` مطلوب في إنشاء الطلب وإنشاء محاولة الدفع |
| DEC-15 | الاستجابة العامة لطلب استعادة كلمة المرور **واحدة** سواء الحساب موجود أو لا (202)، منعًا لتسريب وجود الحساب |

### 4.1 مخاطر مقبولة صراحة (Accepted Risks)

**AR-01 – رابط الاستعادة:** لا يُسجل استخدام الرابط، فقد يُستخدم أكثر من مرة خلال 15 دقيقة. يُخفف بمدة قصيرة وHTTPS ولا يُعرض الرابط في Logs.

**AR-02 – الجلسات القديمة:** بعد تغيير كلمة المرور تظل Refresh Tokens صالحة حتى انتهاء مدتها (≤7 أيام). لا يجوز للواجهة أو التوثيق الادعاء بأن تغيير كلمة المرور يسجل الخروج من كل الأجهزة.

---

## 5. متطلبات وظيفية

### 5.1 الهوية والصلاحيات

| ID | المتطلب | الأولوية | معيار القبول |
|---|---|---|---|
| FR-AUTH-01 | تسجيل بريد أو هاتف فريد مع التحقق من الصيغة والتكرار | P0 | حساب صالح أو 409؛ Hash لكلمة المرور فقط |
| FR-AUTH-02 | تسجيل الدخول، تجديد الجلسة (Refresh)، الخروج على الـ client، تغيير وإستعادة كلمة المرور | P0 | رفض البيانات الخاطئة؛ `INVALID_TOKEN` عند فشل التوكن |
| FR-AUTH-03 | صلاحيات Server-side لكل API ولوحة الإدارة | P0 | 403 لغير المخول؛ منع الوصول الأفقي |
| FR-AUTH-04 | CRUD كامل لعناوين العميل مع التحقق من البلد والمحافظة والمدينة | P1 | لا يصل عميل لعنوان عميل آخر (404) |
| FR-AUTH-05 | تغيير كلمة المرور للمستخدم المسجل | P1 | التحقق من كلمة المرور الحالية؛ تحديث Hash |
| FR-AUTH-06 | طلب استعادة كلمة المرور بالبريد | P1 | استجابة عامة موحدة (202)؛ رابط صالح 15 دقيقة |
| FR-AUTH-07 | تعيين كلمة مرور جديدة برابط الاستعادة | P1 | قبول الرابط ضمن صلاحيته؛ إعادة الاستخدام موثقة (AR-01) |
| FR-AUTH-08 | إدارة المستخدمين الإداريين وتعيين الأدوار وتفعيل/تعطيل الحساب | P1 | ADMIN فقط؛ كل تغيير يُسجل في سجل التدقيق |

### 5.2 الكتالوج

| ID | المتطلب | الأولوية | معيار القبول |
|---|---|---|---|
| FR-CAT-01 | إنشاء وتعديل وأرشفة منتج مادي بالاسم العربي/الإنجليزي والوصف والصور | P0 | DRAFT/ARCHIVED لا يظهر للعامة |
| FR-CAT-02 | إدارة التصنيفات والعلامات التجارية، وربط المنتج بتصنيفات متعددة | P0 | منع التكرار والمراجع المكسورة |
| FR-CAT-03 | المتغيرات وSKU والسعر والوزن وحالة التفعيل | P0 | SKU فريد؛ سعر غير سالب |
| FR-CAT-04 | قائمة وتفاصيل مع فلترة وترتيب وترقيم | P0 | نتائج مستقرة |
| FR-CAT-05 | بحث نصي عربي/إنجليزي بالاسم وSKU | P1 | لا تظهر منتجات غير منشورة |

### 5.3 السلة والتسعير

| ID | المتطلب | الأولوية | معيار القبول |
|---|---|---|---|
| FR-CART-01 | سلة ضيف برمز عشوائي مخزن كـ Hash، وسلة مستخدم | P0 | لا كشف لسلة أخرى |
| FR-CART-02 | إضافة/تعديل/حذف SKU بكمية موجبة | P0 | رفض الكميات غير الصحيحة |
| FR-CART-03 | إعادة حساب الأسعار من الخادم عند Checkout | P0 | رفض السعر المرسل من العميل |
| FR-CART-04 | التحقق من الكوبون: الصلاحية والفترة وحد الاستخدام والحد الأدنى | P1 | الخصم لا يتجاوز السقف أو قيمة البنود |

### 5.4 المخازن والمخزون

| ID | المتطلب | الأولوية | معيار القبول |
|---|---|---|---|
| FR-INV-01 | مخازن نشطة بإحداثيات صحيحة داخل مصر | P0 | رفض الإحداثيات غير الصالحة |
| FR-INV-02 | on_hand وreserved والمتاح = on_hand − reserved | P0 | المتاح لا يصبح سالبًا |
| FR-INV-03 | أقرب مخزن يغطي كامل الطلب، مع priority للتعادل | P0 | مخزن واحد في V1 |
| FR-INV-04 | حجز بمعاملة وRow Locks قصيرة وإعادة التحقق بعد القفل | P0 | لا يحجز طلبان نفس الوحدة |
| FR-INV-05 | تحرير الحجز عند الإلغاء/الانتهاء واستهلاكه عند الصرف | P0 | لا خصم مزدوج |
| FR-INV-06 | حركات مخزون مرجعية لكل استلام/تعديل/بيع/مرتجع | P0 | actor وreference وزمن |
| FR-INV-07 | نتيجة واضحة عند عدم وجود مخزن مناسب أو إحداثيات | P0 | لا حجز جزئي صامت |
| FR-INV-08 | إدارة المخازن (إنشاء، تعديل، تفعيل/تعطيل) | P1 | ADMIN فقط؛ تعطيل المخزن لا يحذف حركاته |

### 5.5 الشراء والطلبات

| ID | المتطلب | الأولوية | معيار القبول |
|---|---|---|---|
| FR-CHK-01 | Guest Checkout بالاسم والهاتف والعنوان دون حساب | P0 | `user_id = NULL` |
| FR-CHK-02 | Checkout لمستخدم مسجل بعنوان محفوظ أو جديد | P0 | Snapshot للعنوان وقت الشراء |
| FR-CHK-03 | التحقق من SKU والكميات والسعر والشحن والخصم قبل الطلب | P0 | subtotal = مجموع line_total |
| FR-CHK-04 | رقم مرجعي فريد وعناصر بسعر واسم ثابتين | P0 | لا يتغير الطلب التاريخي بتعديل الكتالوج |
| FR-CHK-05 | حالات الطلب والانتقالات المصرح بها فقط | P0 | منع الانتقالات غير المصرح بها |
| FR-CHK-06 | سجل تغييرات الحالة مع actor ووقت وسبب | P0 | قابل للتدقيق |
| FR-CHK-07 | إلغاء الطلب وفق حالة الشحن والدفع وحجز المخزون | P0 | لا تحرير لحجز مستهلك ولا رد مزدوج |
| FR-CHK-08 | تتبع طلب الزائر بالرمز، لا برقم الطلب وحده | P0 | لا كشف بيانات بالرقم فقط |
| FR-CHK-09 | عرض تقدير الشحن والإجمالي قبل الالتزام (Quote) | P0 | الـ Quote يطابق الحساب النهائي |

**قيود Request الخاصة بالـ Checkout:** يُمنع على العميل إرسال أو اعتماد `grandTotal` و`status` و`warehouseId`. الخادم يحسبها. يجب أن يذكر OpenAPI ذلك صراحة، ولا تظهر هذه الحقول في خصائص Request.

### 5.6 المدفوعات

| ID | المتطلب | الأولوية | معيار القبول |
|---|---|---|---|
| FR-PAY-01 | COD مع تقييد المناطق والحد الأقصى للطلب (OPEN-05) | P0 | COD لا يُعامل كدفع إلكتروني ناجح |
| FR-PAY-02 | إنشاء محاولة دفع إلكتروني مرتبطة بطلب ومبلغ وعملة | P0 | المبلغ من الخادم فقط |
| FR-PAY-03 | Webhook بتوقيع ومعرف حدث وإزالة التكرار | P0 | تحديث الحالة مرة واحدة |
| FR-PAY-04 | مزامنة الحالات: PENDING / AUTHORIZED / PAID / FAILED / REFUNDED / PARTIALLY_REFUNDED / CANCELLED | P0 | لا PAID بدون تحقق المزود |
| FR-PAY-05 | استرداد كلي أو جزئي بحد لا يتجاوز صافي المدفوع | P1 | رفض التجاوز `REFUND_EXCEEDS_PAID` |
| FR-PAY-06 | إعادة الطلب بـ `Idempotency-Key` نفسه لا تنشئ محاولة مكررة | P0 | نفس الاستجابة |

### 5.7 الشحن والتجهيز

| ID | المتطلب | الأولوية | معيار القبول |
|---|---|---|---|
| FR-SHIP-01 | منطقة شحن وتسعيرة حسب المحافظة والوزن | P0 | التكلفة معروضة ومثبتة بالطلب |
| FR-SHIP-02 | Fulfillment مرتبط بالمخزن المختار وببنود الطلب فقط | P0 | لا بنود من طلب آخر |
| FR-SHIP-03 | تجهيز/تعبئة/تسليم مع رقم تتبع الشركة | P0 | انتقالات مضبوطة |
| FR-SHIP-04 | تحديث حالة الشحن وإثبات التسليم | P1 | تواريخ واضحة |

### 5.8 المرتجعات

| ID | المتطلب | الأولوية | معيار القبول |
|---|---|---|---|
| FR-RET-01 | طلب مرتجع لكميات مسلّمة وضمن مدة السياسة (OPEN-04) | P1 | لا يتجاوز الكمية القابلة للإرجاع |
| FR-RET-02 | موافقة أو رفض أو استلام المرتجع مع السبب | P1 | سجل قرار لكل خطوة |
| FR-RET-03 | إعادة المخزون الصالح فقط عبر حركة RETURN، وربط Refund عند اللزوم | P1 | لا تكرار للإرجاع |

### 5.9 الإدارة والتكامل

| ID | المتطلب | الأولوية | معيار القبول |
|---|---|---|---|
| FR-ADM-01 | لوحة للمنتجات والطلبات والمخازن والشحن والمرتجعات والمستخدمين | P0 | كل عرض يحترم الدور |
| FR-ADM-02 | تقارير طلبات ومبيعات وحالة مخزون بفلاتر زمنية | P1 | تعريف ثابت للمؤشرات |
| FR-ADM-03 | Outbox للتكاملات وإعادة المحاولة | P1 | لا فقد لحدث بعد commit |
| FR-ADM-04 | سجل تدقيق لكل عملية إدارية حساسة | P0 | من عدّل ماذا ومتى |

---

## 6. قواعد العمل

| ID | القاعدة |
|---|---|
| BR-01 | لا يُباع SKU غير نشط أو منتج غير ACTIVE |
| BR-02 | available = on_hand − reserved، ولا قيمة سالبة |
| BR-03 | المخزن المقبول: نشط، داخل بلد الطلب، ولديه كامل الكميات |
| BR-04 | الترتيب بـ Haversine تصاعديًا، ثم priority، ثم id |
| BR-05 | لا تقسيم في V1؛ عدم وجود مخزن مناسب ⇒ `NO_ELIGIBLE_WAREHOUSE` (422) |
| BR-06 | غياب إحداثيات العميل يوقف التخصيص (`ADDRESS_LOCATION_REQUIRED`، 422) |
| BR-07 | TTL الحجز 15 دقيقة؛ Scheduler يحرر المنتهية بمعاملة آمنة |
| BR-08 | انتقالات الحجز من ACTIVE فقط إلى CONSUMED / RELEASED / EXPIRED |
| BR-09 | بعد إنشاء الطلب لا تُعدّل البنود إلا بسير عمل موثق يلغي الحجز ويعيده |
| BR-10 | subtotal = مجموع البنود؛ grand_total = subtotal − discount + shipping + tax؛ EGP بمنزلتين |
| BR-11 | COD لا يحتاج Webhook؛ التحصيل يُسجل عند الاستلام أو التسوية |
| BR-12 | Webhook مكرر أو خارج الترتيب لا يعيد تنفيذ الدفع أو المخزون |
| BR-13 | مجموع المرتجعات ≤ المدفوع المؤكد − المسترد سابقًا |
| BR-14 | الكمية المرتجعة المتراكمة ≤ المسلّم − المرتجع سابقًا |
| BR-15 | تحديثات الطلب والحجز والدفع داخل Transactions مع Idempotency |
| BR-16 | تغيير كلمة المرور لا يبطل Refresh Tokens (AR-02) |
| BR-17 | رابط الاستعادة صالح 15 دقيقة وقابل لإعادة الاستخدام (AR-01) |
| BR-18 | لا يُقبل من العميل السعر النهائي أو status أو warehouseId في Checkout |
| BR-19 | Idempotency-Key مطلوب لإنشاء الطلب وإنشاء محاولة الدفع |
| BR-20 | إلغاء الطلب بعد إتمام الشحن غير مسموح (`ORDER_NOT_CANCELLABLE`) |

---

## 7. سيناريوهات التشغيل

- **UC-01 شراء كزائر:** تصفح → سلة → بيانات وعنوان → Quote → حجز مخزن → إنشاء الطلب بـ Snapshots → COD أو دفع → تجهيز وشحن. استثناءات: مخزون غير كافٍ، كوبون منتهٍ، إحداثيات ناقصة، فشل دفع، تكرار Checkout.
- **UC-02 شراء بحساب:** تسجيل دخول → عنوان مملوك → UC-01.
- **UC-03 Webhook الدفع:** تحقق توقيع → `provider_event_id` → معالجة idempotent → تحديث Payment/Order → Outbox. استثناءات: حدث مكرر، مبلغ مختلف، توقيع خاطئ، ترتيب خاطئ.
- **UC-04 انتهاء حجز:** Job → قفل → إعادة تحقق → RELEASE/EXPIRED → تحرير reserved → حركة مخزون.
- **UC-05 تجهيز وشحن:** المخزن المخصص → Picking → Packing → Dispatch → Tracking → Delivered.
- **UC-06 مرتجع:** طلب → تحقق الأهلية والكمية → موافقة → استلام وفحص → مخزون/Refund → إغلاق.
- **UC-07 استعادة كلمة المرور:** بريد → استجابة 202 موحدة → رابط 15 دقيقة → كلمة جديدة. (AR-01)
- **UC-08 تغيير كلمة المرور:** التحقق من الحالية → تحديث Hash → الجلسات القديمة تبقى حتى انتهائها (AR-02).

---

## 8. نموذج الأخطاء والاستجابات

### 8.1 Error Contract

```json
{
  "code": "NO_ELIGIBLE_WAREHOUSE",
  "messageAr": "لا يوجد مخزن متاح يغطي الطلب",
  "messageEn": "No eligible warehouse can fulfill the order",
  "traceId": "uuid",
  "details": {}
}
```

- `code` قيمة ثابتة للبرمجة، ولا تعتمد الواجهة على نص الرسالة.
- `details` للتحقق: `{ "field": "messageText" }` أو تفاصيل تشغيلية.

### 8.2 كتالوج الأخطاء

| code | HTTP | messageAr | messageEn |
|---|---|---|---|
| VALIDATION_ERROR | 400 | بيانات الإدخال غير صحيحة | Invalid input data |
| EMAIL_OR_PHONE_REQUIRED | 400 | مطلوب بريد إلكتروني أو رقم هاتف | Email or phone is required |
| UNAUTHENTICATED | 401 | يجب تسجيل الدخول | Authentication required |
| INVALID_CREDENTIALS | 401 | البريد الإلكتروني أو كلمة المرور غير صحيحة | Invalid email or password |
| INVALID_TOKEN | 401 | رمز الدخول غير صالح أو منتهٍ | Invalid or expired token |
| FORBIDDEN | 403 | ليس لديك صلاحية لهذا الإجراء | You do not have permission |
| NOT_FOUND | 404 | المورد غير موجود | Resource not found |
| EMAIL_ALREADY_REGISTERED | 409 | البريد الإلكتروني مسجل مسبقًا | Email is already registered |
| PHONE_ALREADY_REGISTERED | 409 | رقم الهاتف مسجل مسبقًا | Phone is already registered |
| CONFLICT | 409 | تعارض مع الحالة الحالية | Conflicts with current state |
| IDEMPOTENCY_KEY_REUSED | 409 | مفتاح الطلب مستخدم مع بيانات مختلفة | Idempotency key reused with a different request |
| BUSINESS_RULE_VIOLATION | 422 | الإجراء يخالف قاعدة عمل | Business rule violation |
| NO_ELIGIBLE_WAREHOUSE | 422 | لا يوجد مخزن متاح يغطي الطلب | No eligible warehouse can fulfill the order |
| OUT_OF_STOCK | 422 | الكمية المطلوبة غير متاحة | Requested quantity is out of stock |
| ADDRESS_LOCATION_REQUIRED | 422 | يرجى تحديد موقع العنوان بدقة | Please provide a precise address location |
| COUPON_INVALID | 422 | الكوبون غير صالح أو منتهٍ | Coupon is invalid or expired |
| COD_NOT_ALLOWED | 422 | الدفع عند الاستلام غير متاح لهذا الطلب | Cash on delivery is not available for this order |
| ORDER_NOT_PAYABLE | 422 | لا يمكن دفع هذا الطلب في حالته الحالية | Order cannot be paid in its current state |
| ORDER_NOT_CANCELLABLE | 422 | لا يمكن إلغاء هذا الطلب في حالته الحالية | Order cannot be cancelled in its current state |
| RETURN_NOT_ELIGIBLE | 422 | المنتج غير مؤهل للإرجاع | Item is not eligible for return |
| REFUND_EXCEEDS_PAID | 422 | مبلغ الاسترداد يتجاوز المدفوع | Refund amount exceeds paid amount |
| RATE_LIMITED | 429 | محاولات كثيرة، حاول لاحقًا | Too many requests, try again later |
| INTERNAL_ERROR | 500 | حدث خطأ غير متوقع | An unexpected error occurred |

**ملاحظة تصحيح:** `NO_ELIGIBLE_WAREHOUSE` صار 422 دائمًا (قاعدة عمل)، وليس 409.

---

## 9. واجهات REST API

Base: `/api/v1`. هذه العقود مواصفات مطلوب توثيقها في OpenAPI، وليست ادعاء تنفيذ.

**عدد العمليات في v1.1: 69 عملية.** الرقم الدقيق هو المرجع لمعيار القبول في T-06، ويُعدّل فقط بقرار Change Request.

الإضافات التي لم ترد نصًا في v1.0 مميزة بـ (مشتقة من FR) وتحتاج تأكيد PO عند الاعتماد.

### 9.1 الكتالوج العام (4)

| # | Method | Path | Auth | ملاحظة |
|---|---|---|---|---|
| 1 | GET | /products | Public | فلترة وبحث وترقيم |
| 2 | GET | /products/{slug} | Public | تفاصيل ومتغيرات |
| 3 | GET | /categories | Public (مشتقة من FR-CAT-02) | |
| 4 | GET | /brands | Public (مشتقة من FR-CAT-02) | |

### 9.2 الهوية (7)

| # | Method | Path | Auth |
|---|---|---|---|
| 5 | POST | /auth/register | Public |
| 6 | POST | /auth/login | Public |
| 7 | POST | /auth/refresh | Refresh Token |
| 8 | POST | /auth/logout | Bearer، 204 |
| 9 | POST | /auth/password/change | Customer |
| 10 | POST | /auth/password/forgot | Public، 202 دائمًا |
| 11 | POST | /auth/password/reset | Reset token |

### 9.3 الحساب والعناوين (8)

| # | Method | Path | Auth |
|---|---|---|---|
| 12 | GET | /me | Customer (مشتقة) |
| 13 | PATCH | /me | Customer (مشتقة) |
| 14 | GET | /me/addresses | Customer |
| 15 | POST | /me/addresses | Customer |
| 16 | GET | /me/addresses/{id} | Owner |
| 17 | PUT | /me/addresses/{id} | Owner |
| 18 | DELETE | /me/addresses/{id} | Owner |
| 19 | GET | /me/orders | Customer (مشتقة) |

### 9.4 السلة (4)

| # | Method | Path | Auth |
|---|---|---|---|
| 20 | POST | /carts | Public/Customer |
| 21 | GET | /carts/{id} | Cart owner (مشتقة) |
| 22 | PUT | /carts/{id}/items/{sku} | Cart owner |
| 23 | DELETE | /carts/{id}/items/{sku} | Cart owner |

### 9.5 Checkout والطلبات والدفع (7)

| # | Method | Path | Auth |
|---|---|---|---|
| 24 | POST | /checkout/quote | Guest/Customer |
| 25 | POST | /checkout/orders | Guest/Customer، Idempotency-Key |
| 26 | GET | /orders/{id} | Owner/Authorized |
| 27 | POST | /orders/{id}/cancel | Owner/Operations |
| 28 | POST | /orders/{id}/payments | Owner/Authorized، Idempotency-Key |
| 29 | POST | /payments/{id}/webhooks/{provider} | Provider signature |
| 30 | GET | /guest/orders/{token} | Guest token |

### 9.6 المرتجعات للعميل (2)

| # | Method | Path | Auth |
|---|---|---|---|
| 31 | POST | /returns | Customer/Support |
| 32 | GET | /returns/{id} | Owner/Support (مشتقة) |

### 9.7 إدارة الكتالوج (8)

| # | Method | Path | Auth |
|---|---|---|---|
| 33 | GET | /admin/products | ADMIN |
| 34 | POST | /admin/products | ADMIN |
| 35 | GET | /admin/products/{id} | ADMIN (مشتقة) |
| 36 | PATCH | /admin/products/{id} | ADMIN (مشتقة، FR-CAT-01) |
| 37 | POST | /admin/products/{id}/archive | ADMIN (مشتقة، FR-CAT-01) |
| 38 | POST | /admin/products/{id}/variants | ADMIN (مشتقة، FR-CAT-03) |
| 39 | PATCH | /admin/variants/{sku} | ADMIN (مشتقة، FR-CAT-03) |
| 40 | POST | /admin/categories | ADMIN (مشتقة، FR-CAT-02) |

### 9.8 الكوبونات والشحن (6)

| # | Method | Path | Auth |
|---|---|---|---|
| 41 | GET | /admin/coupons | ADMIN/OPERATIONS (مشتقة) |
| 42 | POST | /admin/coupons | ADMIN/OPERATIONS (مشتقة) |
| 43 | PATCH | /admin/coupons/{id} | ADMIN/OPERATIONS (مشتقة) |
| 44 | GET | /admin/shipping-zones | OPERATIONS (مشتقة، FR-SHIP-01) |
| 45 | POST | /admin/shipping-zones | OPERATIONS (مشتقة) |
| 46 | PUT | /admin/shipping-zones/{id}/rates | OPERATIONS (مشتقة) |

### 9.9 المخازن والمخزون (6)

| # | Method | Path | Auth |
|---|---|---|---|
| 47 | GET | /admin/warehouses | WAREHOUSE/OPERATIONS (مشتقة) |
| 48 | POST | /admin/warehouses | ADMIN (مشتقة، FR-INV-08) |
| 49 | PATCH | /admin/warehouses/{id} | ADMIN (مشتقة، FR-INV-08) |
| 50 | GET | /admin/inventory | WAREHOUSE/OPERATIONS |
| 51 | POST | /admin/inventory/adjustments | WAREHOUSE/OPERATIONS، سبب إلزامي |
| 52 | GET | /admin/inventory/movements | WAREHOUSE/OPERATIONS (مشتقة، FR-INV-06) |

### 9.10 الطلبات والتجهيز والمرتجعات والاسترداد (8)

| # | Method | Path | Auth |
|---|---|---|---|
| 53 | GET | /admin/orders | OPERATIONS/SUPPORT (مشتقة) |
| 54 | POST | /admin/orders/{id}/allocate | OPERATIONS |
| 55 | PATCH | /admin/fulfillments/{id}/status | WAREHOUSE/OPERATIONS |
| 56 | GET | /admin/returns | OPERATIONS/SUPPORT (مشتقة) |
| 57 | POST | /admin/returns/{id}/approve | OPERATIONS (مشتقة، FR-RET-02) |
| 58 | POST | /admin/returns/{id}/reject | OPERATIONS (مشتقة، FR-RET-02) |
| 59 | POST | /admin/returns/{id}/receive | WAREHOUSE/OPERATIONS (مشتقة، FR-RET-02) |
| 60 | POST | /admin/refunds | OPERATIONS |

### 9.11 المستخدمون والتقارير والتدقيق (9)

| # | Method | Path | Auth |
|---|---|---|---|
| 61 | GET | /admin/users | ADMIN (مشتقة، FR-AUTH-08) |
| 62 | POST | /admin/users | ADMIN (مشتقة، FR-AUTH-08) |
| 63 | PATCH | /admin/users/{id}/role | ADMIN (مشتقة، FR-AUTH-08) |
| 64 | PATCH | /admin/users/{id}/status | ADMIN (مشتقة، FR-AUTH-08) |
| 65 | GET | /admin/reports/sales | OPERATIONS (مشتقة، FR-ADM-02) |
| 66 | GET | /admin/reports/inventory | WAREHOUSE/OPERATIONS (مشتقة، FR-ADM-02) |
| 67 | GET | /admin/audit-logs | ADMIN (مشتقة، FR-ADM-04) |
| 68 | POST | /admin/brands | ADMIN (مشتقة، FR-CAT-02) |
| 69 | GET | /admin/orders/{id}/status-history | OPERATIONS/SUPPORT (مشتقة، FR-CHK-06) |

**إجمالي: 69 عملية.** (مصنفة: 37 من الكتالوج/الهوية/الطلبات الأساسية، و32 إضافية مشتقة من FR وتحتاج تأكيد PO.)

### 9.12 قواعد عامة للعمليات

- كل عملية لها Authentication وAuthorization وأكواد أخطاء مذكورة في OpenAPI.
- `Idempotency-Key` مطلوب في: `POST /checkout/orders`، و`POST /orders/{id}/payments`.
- `POST /auth/logout` يعيد 204 دون ادعاء إبطال.
- فشل Bearer أو Refresh يعيد `INVALID_TOKEN`.
- `POST /auth/password/forgot` يعيد 202 بنفس الشكل سواء الحساب موجود أو لا (DEC-15).

---

## 10. عقود رئيسية

### 10.1 Checkout Quote

`POST /checkout/quote`

- Request: `cartId`، `shippingAddress` (countryCode، governorateId، cityId، latitude، longitude)، `couponCode` اختياري.
- ممنوع: `grandTotal`، `shippingCost` من العميل.
- Response 200: `subtotal`، `discount`، `shipping`، `tax`، `grandTotal`، `currency: "EGP"`، `warehouseCandidate` (معرف مخزن مرشح للعرض فقط، دون اعتماد). الأموال Strings.
- الأخطاء: `COUPON_INVALID`، `ADDRESS_LOCATION_REQUIRED`، `NO_ELIGIBLE_WAREHOUSE`، `OUT_OF_STOCK`.

### 10.2 إنشاء الطلب

`POST /checkout/orders`

- Headers: `Idempotency-Key: <UUID>` (مطلوب).
- Request: `cartId`، `customer` (name، phone، email)، `shippingAddress`، `paymentMethod` (`COD` أو `CARD` أو `WALLET`، مطابقة لـ enum `payment_method` في V1)، `couponCode`.
- ممنوع في Request: `grandTotal`، `status`، `warehouseId`. إذا أُرسلت تُرفض بـ `VALIDATION_ERROR`.
- Response 201: `orderId`، `orderNumber`، `status: "PENDING"`، `paymentStatus: "PENDING"`، `currency: "EGP"`، `grandTotal: "950.00"`، `reservationExpiresAt`.
- الأخطاء: `NO_ELIGIBLE_WAREHOUSE`، `OUT_OF_STOCK`، `COD_NOT_ALLOWED`، `IDEMPOTENCY_KEY_REUSED`، `COUPON_INVALID`، `ADDRESS_LOCATION_REQUIRED`.

### 10.3 إنشاء محاولة دفع

`POST /orders/{id}/payments`

- Headers: `Idempotency-Key: <UUID>` (مطلوب).
- Request دنيا: `method` (`CARD` | `WALLET` | `COD`)، `provider` (string).
- الخادم يحدد المبلغ والعملة من الطلب. العميل لا يرسل مبلغًا.
- **الحقول التفصيلية (redirect، client secret، مدة الصلاحية) معلقة على OPEN-01.**
- Response 201: `paymentId`، `paymentStatus: "PENDING"`، وحقول المزود معلقة على OPEN-01.
- الأخطاء: `ORDER_NOT_PAYABLE` (422)، `COD_NOT_ALLOWED` (422)، `IDEMPOTENCY_KEY_REUSED` (409)، `NOT_FOUND`، `FORBIDDEN`.
- `method: COD` لا ينشئ محاولة إلكترونية؛ يُسجل التحصيل وفق BR-11.

### 10.4 العناوين

- CRUD كامل؛ كل عملية تتحقق من الملكية. عنوان غير مملوك يعيد `NOT_FOUND` (404) لا 403.
- الحقول: `recipientName`، `phone` (OPEN-11)، `countryCode` (`EG`)، `governorateId` وَ`cityId` (OPEN-12)، `district`، `street`، `building`، `apartment`، `postalCode`، `latitude`، `longitude`، `isDefault`.

---

## 11. الحالات والتحولات

| الكيان | الحالات |
|---|---|
| Order | PENDING، CONFIRMED، PROCESSING، SHIPPED، DELIVERED، CANCELLED، RETURNED |
| Payment | PENDING، AUTHORIZED، PAID، FAILED، REFUNDED، PARTIALLY_REFUNDED، CANCELLED |
| Fulfillment | PENDING، ALLOCATED، PICKING، PACKED، DISPATCHED، DELIVERED، CANCELLED |
| Reservation | ACTIVE، CONSUMED، RELEASED، EXPIRED |

- انتقالات الطلب: PENDING→CONFIRMED/CANCELLED؛ CONFIRMED→PROCESSING/CANCELLED؛ PROCESSING→SHIPPED/CANCELLED وفق الشروط؛ SHIPPED→DELIVERED؛ DELIVERED→RETURNED وفق OPEN-04.
- حالات DRAFT وPICKING لا تُستخدم على Order. تخص Fulfillment فقط.
- **تحقق مطلوب قبل الاعتماد النهائي:** مطابقة enum الفعلي في V1 مع القائمة أعلاه.

---

## 12. المتطلبات غير الوظيفية

| ID | المجال | المتطلب |
|---|---|---|
| NFR-01 | الأمن | TLS، Hash قوي، Least Privilege، CORS، Rate Limiting، أسرار خارج Git. حدود مبدئية: login 10 محاولات/15 دقيقة لكل IP+حساب؛ forgot 5 طلبات/ساعة لكل بريد |
| NFR-02 | الخصوصية | إخفاء PII في Logs، سياسات احتفاظ وحذف، وطلبات أصحاب البيانات (OPEN-09) |
| NFR-03 | الأداء | p95: قراءة المنتجات ≤500ms، إضافة للسلة ≤700ms، Checkout ≤2s باستثناء مزود الدفع |
| NFR-04 | التوافر | هدف مبدئي 99.5% شهريًا (OPEN-08) |
| NFR-05 | النسخ | يومي وWAL/PITR؛ RPO ≤1h، RTO ≤4h كأهداف مبدئية (OPEN-08) |
| NFR-06 | التوسع | Pagination، فهارس، Connection Pooling، مراقبة Query Plans |
| NFR-07 | التدقيق | Correlation ID، وسجل تغييرات للطلب والدفع والمخزون والإدارة |
| NFR-08 | إمكانية الوصول | WCAG 2.2 AA لواجهات العميل الأساسية |
| NFR-09 | اللغة | عربي RTL أساسي، إنجليزي LTR، رسائل مترجمة |
| NFR-10 | الموثوقية | Outbox، Idempotency، Retries بـ Backoff، Timeouts، Circuit Breakers |
| NFR-11 | الجودة | Unit/Integration/E2E، Static Analysis، Dependency Scanning، CI Gates |
| NFR-12 | المراقبة | Structured Logs، Metrics، Traces، تنبيهات فشل الدفع وتراكم Outbox والحجوزات المنتهية |

NFR-03 وNFR-04 وNFR-05 **متابعة أداء وتشغيل، وليست أسئلة مفتوحة في OpenAPI.**

---

## 13. متطلبات واجهة المستخدم

- **Storefront:** الرئيسية، القوائم والبحث، تفاصيل المنتج، السلة، Checkout ونتيجته، الدفع، تفاصيل وتتبع الطلب، الحساب والعناوين، طلب مرتجع، استعادة كلمة المرور.
- **Admin:** Dashboard، المنتجات والمتغيرات والصور، الطلبات والمدفوعات والمرتجعات، المخازن والمخزون، Fulfillment، الكوبونات، مناطق وأسعار الشحن، المستخدمون والصلاحيات، التقارير، سجل التدقيق.
- كل شاشة: Loading، Empty، Error، Success، Responsive، Form Validation، RTL، حالة عدم توافر المخزون.
- الواجهة لا تعتمد على نص الرسالة، بل على `code`.

---

## 14. حالات اختبار القبول

| ID | الاختبار | معيار النجاح |
|---|---|---|
| AT-01 | Guest Checkout مع COD | طلب دون user_id وببيانات صحيحة |
| AT-02 | Nearest Warehouse | مخزن أبعد يغطي الكميات يفوز على أقرب غير كافٍ |
| AT-03 | Concurrent Reservation | مخزون 10 وطلبات متزامنة ⇒ مجموع الحجوزات ≤ 10 |
| AT-04 | Reservation Expiry | انتهاء TTL يفك reserved مرة واحدة |
| AT-05 | Payment Webhook Replay | إعادة الحدث لا تكرر التأكيد أو الخصم |
| AT-06 | Price Snapshot | تغيير السعر لا يغير order_item |
| AT-07 | Invalid Location | غياب lat/lon يمنع التخصيص (`ADDRESS_LOCATION_REQUIRED`) |
| AT-08 | Cross-order Fulfillment | بند من طلب آخر يفشل |
| AT-09 | Guest Order Privacy | رقم الطلب وحده لا يكشف البيانات |
| AT-10 | Refund Cap | الاسترداد أكبر من المدفوع يُرفض |
| AT-11 | Return Cap | المرتجع أكبر من المسلّم يُرفض |
| AT-12 | Authorization | Warehouse لا يعدّل بيانات مالية أو منتجات |
| AT-13 | Migrations | Flyway على DB نظيف V1–V7 ينجح، وإعادة التشغيل No-op |
| AT-14 | Cancellation Race | إلغاء وتأكيد دفع متزامنان لا يتركان تناقضًا |
| AT-15 | Shipping Quote | الشحن يحسب من zone/weight ويثبت بالطلب |
| AT-16 | Address Ownership | لا قراءة/تعديل/حذف لعنوان غير مملوك |
| AT-17 | Password Reset Expiry | الرابط يُرفض بعد 15 دقيقة |
| AT-18 | Password Reset Reuse | الرابط صالح خلال 15 دقيقة (AR-01) |
| AT-19 | Password Change Sessions | Refresh القديم صالح حتى انتهاء مدته (AR-02) |
| AT-20 | Refresh Stateless | Refresh صالح يجدد الجلسة |
| AT-21 | Logout Stateless | 204 دون ادعاء إبطال |
| AT-22 | Cart Item Deletion | حذف SKU يزيل عنصر صاحب السلة فقط |
| AT-23 | Payment Idempotency | إعادة الطلب بالمفتاح نفسه لا تنشئ محاولة مكررة |

---

## 15. خطة التسليم

الترتيب يتبع الاعتماد، والتوسع الكامل في النطاق يعني أن Sprints 1 وما بعدها تُعاد تقسيمها حسب FR.

| Sprint | النطاق | Definition of Done |
|---|---|---|
| 0 | SRS، DB V1–V7، CI، OpenAPI lint | Migrations خضراء، القرارات موثقة |
| 1 | Auth/RBAC، الكتالوج العام والإداري، العناوين CRUD | APIs موثقة، اختبارات، وحدات UI |
| 2 | السلة، التسعير، الكوبونات، الشحن، Quote | Quote يطابق الحساب |
| 3 | Checkout (Guest/Customer)، أقرب مخزن، الحجوزات | AT-01..04، AT-07، AT-14 |
| 4 | الدفع COD/إلكتروني، Webhooks، الطلبات | AT-05، AT-06، AT-09، AT-23 |
| 5 | التجهيز، الشحن، المرتجعات، الاستردادات | AT-08، AT-10، AT-11، AT-15 |
| 6 | التقارير، تصليب الأمان، الأداء، UAT، الإطلاق | مراجعة أمنية، Runbooks، Rollback |

**Definition of Done لكل Story:** كود مراجع، اختبارات، OpenAPI، Migration عند اللزوم، Logging، RBAC، QA evidence، توثيق، لا ثغرات حرجة مفتوحة.

---

## 16. النقاط المفتوحة (OPEN)

| ID | الموضوع | المالك | يؤثر على OpenAPI؟ |
|---|---|---|---|
| OPEN-01 | بوابة الدفع وطرق CARD/WALLET والرسوم والتسوية. يحدد حقول `POST /orders/{id}/payments` بعد الحد الأدنى | Product/Finance | نعم |
| OPEN-02 | شركات الشحن وSLA ومناطق التغطية وAPI التتبع | Operations | نعم |
| OPEN-03 | الضرائب والفواتير الإلكترونية | Finance/Legal | نعم |
| OPEN-04 | سياسة المرتجعات: المدة وحالة الأصناف | Product/Legal | نعم |
| OPEN-05 | حدود COD والحد الأقصى لقيمة الطلب | Operations/Finance | نعم |
| OPEN-06 | تقسيم الشحنة بين المخازن في إصدار لاحق | Product | لا في V1 (DEC-03) |
| OPEN-07 | Geocoding وجودة الإحداثيات والبديل | Product/Engineering | نعم |
| OPEN-08 | أهداف SLA وRPO/RTO والأداء | Tech Lead | لا |
| OPEN-09 | RBAC التفصيلي واحتفاظ البيانات وOTP | Security/Product | نعم (صلاحيات) |
| OPEN-10 | اعتماد V7 بعد اختبارات PostgreSQL والتزامن | DBA/Backend/QA | لا |
| **OPEN-11** | **صيغة رقم الهاتف المصري وتنسيق العنوان والتحقق منهما** | **Product/Operations** | **نعم** |
| **OPEN-12** | **مصدر قوائم المحافظات والمدن ومعرفاتها (governorateId وcityId)** | **Operations/Product** | **نعم** |

**قواعد:** `x-open-question` يستخدم لأرقام OPEN-01 لـ OPEN-07 وOPEN-09 وOPEN-11 وOPEN-12 فقط، عند تأثرها بالعقد. OPEN-08 وOPEN-10 لا يظهران فيه. لا تُستخدم أي NEW-Q-xx.

---

## 17. المخاطر والموانع

- التأكد من سلامة قيود الربط بين Fulfillment وReservation وOrder.
- اختبار انتهاء صلاحية الحجوزات.
- منع تعديل بنود الطلب بعد الحجز دون سير موثق.
- اختبار سباقات الإلغاء والدفع.
- مطابقة المبالغ والمرتجعات.
- أي فشل في AT-02/03/04/05/08/09/10/14 يمنع الإطلاق.
- AR-01 وAR-02 مسجلان في سجل المخاطر ويظهران في التوثيق.

---

## 18. تتبع المتطلبات

| المجال | المتطلبات | الاختبارات | المكونات |
|---|---|---|---|
| Guest Checkout | FR-CHK-01..04 | AT-01، AT-06، AT-09 | Checkout API، Orders |
| Nearest Warehouse | FR-INV-01..07 | AT-02، AT-03، AT-04، AT-07، AT-14 | Inventory Service، SQL Functions |
| Payments | FR-PAY-01..06 | AT-05، AT-10، AT-14، AT-23 | Payment Service، Webhooks |
| Shipping/Returns | FR-SHIP-01..04، FR-RET-01..03 | AT-08، AT-11، AT-15 | Fulfillment/Returns |
| Security | FR-AUTH-01..08، NFR-01 | AT-09، AT-12، AT-16..21 | Spring Security، RBAC |
| Cart | FR-CART-01..04 | AT-22 | Cart Service |
| Password Reset | FR-AUTH-06..07 | AT-17، AT-18 | Auth API، Email |

---

## 19. المراجع

- `db/reference/Classic_Store_Consolidated_V1-V7.sql` على commit `0c6e9f1ad9614aba87e2a91b5e7f5f3c72b4ee85` (المصدر المثبت).
- `backend/db-source.lock` (hashes V1–V7 المعتمدة).
- `backend/src/main/resources/db/migration/` (Migrations المولّدة).
- ERD وData Dictionary المرفوعين.
- SRS v1.0 (21 أكتوبر 2026) كمرجع سابق.

---

## 20. الاعتماد

| الدور | الاسم | التوقيع | التاريخ |
|---|---|---|---|
| Product Owner | معتمد | اعتماد صريح بالمحادثة | 11 نوفمبر 2026 |
| Tech Lead | | | |
| QA Lead | | | |
| Operations | | | |
| Security | | | |

**تصحيح تحريري (v1.1.1) قبل T-06:** مطابقة `paymentMethod` مع enum الفعلي في V1. كانت المسودة تذكر `ONLINE` وهي غير موجودة في enum. الحقول الآن: `COD` و`CARD` و`WALLET`. القيمة `OTHER` موجودة في DB لكنها غير معروضة في API v1.

**مطابقة enums الأخرى مع V1 (تمت):** user_role، order_status، payment_status، fulfillment_status، reservation_status، product_status، stock_movement_type متطابقة مع القسم 11 والـ FR.

**شرط الدخول إلى T-06:** اعتماد هذا الإصدار صراحةً من الجهات أعلاه، مع الاعتماد الصريح لقائمة الـ69 عملية، وخاصة العمليات المشتقة (المميزة في القسم 9).
