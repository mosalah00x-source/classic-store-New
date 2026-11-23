# دليل التشغيل المحلي والمراجعة البصرية

**النطاق:** static prototype على المنفذ 8000، وتطبيق Next.js على المنفذ 3000. هذا الدليل لا يفترض أن التطبيق والـ prototype نفس المصدر.

## 1. تشغيل الـ static prototype

من جذر المستودع:

```bash
python3 -m http.server 8000
```

افتح `http://localhost:8000`. ملفات prototype هي `docs/ui-reference/index.html` وملفات CSS/JS/assets التابعة لها. يحتاج خط Cairo إلى اتصال إنترنت وفق README الخاص بالـ prototype.

## 2. إعداد Next.js محليًا

من مجلد frontend:

```powershell
cd frontend
Copy-Item .env.example .env.local
npm ci
npm run dev
```

**تنبيه:** لا يوجد `frontend/.env.example` ضمن الملفات الحالية حتى تاريخ هذا السجل؛ لذلك أمر النسخ أعلاه يصبح صالحًا بعد تنفيذ ENV-01. إلى ذلك الحين أنشئ `.env.local` محليًا يدويًا، ولا ترفعه إلى Git.

القيم المحلية التي يقرأها الكود الحالي على فرع FrontendApp:

```dotenv
API_MOCKING=true
API_MOCK_SCENARIO=showcase
API_BASE_URL=http://localhost:8080
```

- `API_MOCKING=true` يفعّل بيانات mock خارج production فقط.
- `API_MOCK_SCENARIO` يقبل `default` أو `many` أو `showcase`.
- `API_BASE_URL` مطلوب حتى في وضع mock؛ الكود يبني URL منه قبل تمرير الطلب إلى mock handler. لا تتركه فارغًا في `.env.local`.
- عند استخدام Backend الحقيقي، اجعل `API_MOCKING=false` واضبط `API_BASE_URL` على عنوان Backend المحلي الصحيح.
- `NODE_ENV` يضبطه Next.js؛ لا تضبطه يدويًا في هذا الملف.
- لا توجد حاجة إلى `NEXT_PUBLIC_` لهذه المتغيرات؛ استدعاءات API server-side.

بعد أي تعديل في `.env.local` أوقف خادم Next.js ثم أعد تشغيل `npm run dev`. Next.js لا يضمن تحميل تغييرات البيئة في عملية dev قائمة.

## 3. تشخيص «تعذر تحميل بيانات الكتالوج»

1. تأكد أن `.env.local` موجود داخل مجلد `frontend` وليس جذر المستودع.
2. تأكد من وجود `API_BASE_URL` بقيمة URL صحيحة؛ غيابه يؤدي إلى الخطأ `API_BASE_URL must be configured on the server`.
3. في العرض المحلي استخدم `API_MOCKING=true` و`API_MOCK_SCENARIO=showcase`، وتأكد أن `NODE_ENV` ليس production.
4. أعد تشغيل خادم Next.js بعد تعديل المتغيرات.
5. إذا كان mock مغلقًا، تحقق أن Backend يعمل على العنوان المحدد وأن endpoints المطلوبة متاحة.
6. راجع Terminal وNetwork response؛ لا تعتبر رسالة الواجهة وحدها تشخيصًا كافيًا.

## 4. معيار المراجعة البصرية المرجعي

- Browser viewport: **1440 × 900 CSS px**.
- Device Pixel Ratio: **1**.
- Theme: **Light**.
- الصفحة المرجعية: static prototype على `http://localhost:8000`.
- في حالة Light، يظهر زر الثيم بأيقونة الهلال باعتبارها رمز الانتقال إلى Dark؛ لا تغيّر الثيم إلى Dark عند التقاط baseline Light.
- استخدم نفس المتصفح ونفس zoom (100%) ونفس viewport وDPR عند مقارنة prototype بتطبيق Next.js.
- سجّل URL واللغة والثيم والعرض والارتفاع وDPR في اسم اللقطة أو ملاحظتها.
- لا تستخدم لقطة شاشة مقصوصة أو resized كدليل على الأبعاد الأصلية.

### مصفوفة المراجعة المطلوبة

| المنطقة | Desktop | Mobile |
|---|---|---|
| Home F3 | 1440×900، AR/EN، Light/Dark | 390px، AR/EN، Light/Dark |
| Catalog F4 | 1440×900، AR/EN، Light/Dark | 390px، AR/EN، Light/Dark |
| Mega Menu #30 | 1440 و1100 و1000px، AR/EN، Light/Dark | 390px، AR/EN، Light/Dark |
| Favorite heart #30 | 1440px، AR/EN، Light/Dark | 390px، AR/EN، Light/Dark |

### نقاط القبول لـ PR #30

- القائمة لا تقص أسماء التصنيفات ولا تعرض horizontal scrollbar.
- hover bridge يسمح بالانتقال من trigger إلى القائمة دون إغلاق غير مقصود.
- الإغلاق يعمل عند pointer exit/outside click/Escape، والتنقل بلوحة المفاتيح يعمل.
- القلب غير المحدد Outline واضح وليس glyph شبيهًا بقائمة؛ والمحدد Filled.
- aria-label مترجم وaria-pressed يعكس الحالة.
- التحقق مطلوب على Light/Dark و390px؛ لا يوجد اعتماد بصري بعد حتى ترفق اللقطات ويوافق PO.

## 5. الحالة الحالية للأدلة

- لقطات F3 غير المغطاة في تنازل PO ما زالت مطلوبة.
- لقطات F4 الخاصة ببطاقة المنتج ما زالت غير مثبتة في سجل PR #29.
- لقطات قائمة التصنيفات وقلب المفضلة بعد دمج PR #30 ما زالت مطلوبة.
- لا يثبت نجاح CI أيًا من بنود القبول البصري أعلاه.
