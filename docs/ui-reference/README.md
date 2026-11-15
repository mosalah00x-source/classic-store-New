# ClassicStore – Frontend UI (Static Prototype)

واجهة متجر ClassicStore (HTML/CSS/JS صافي، بدون frameworks). الاتجاه الافتراضي عربي RTL مع دعم الإنجليزي LTR والوضع الداكن.

## التشغيل
افتح `index.html` مباشرة، أو الأفضل من سيرفر محلي:
```
python3 -m http.server 8000     # ثم http://localhost:8000
```
خط Cairo بيتحمل من Google Fonts (محتاج إنترنت).

## هيكل الملفات
```
index.html          كل الصفحات (views) + الهيدر والفوتر
css/base.css        التوكنز (:root) + الهيدر + الصفحة الرئيسية + الكروت + الفوتر
css/pages.css       الوضع الداكن + صفحات المنتجات/المنتج/السلة/الدفع + شريط التنقل + LTR + قناع اللوجو
js/main.js          قائمة التصنيفات (mega menu) + سحب الكاروسيل + المفضلة
js/store.js         الراوتر + السلة + صفحة المنتج + الثيم + الدفع
js/i18n.js          ترجمة AR/EN + زر اللغة + شريط التنقل
assets/img/         صور الهيرو/الفئات/المنتجات (placeholders مقصوصة من screenshots)
assets/logo.png     لوجو شفاف (أبيض + alpha) بيتلوّن بالـ CSS mask
assets/logo-original.jpeg   اللوجو الأصلي
```

## الصفحات (hash routing)
`#home` · `#products` · `#product` · `#cart` · `#checkout` · `#done`
كل صفحة عبارة عن `<main id="v-<name>" class="view">`، والراوتر في `store.js` (`route()`).

## التوكنز (غيّرها من `:root` في base.css)
`--org` البرتقالي · `--red` الخصم · `--green` جديد · `--bg/--surf/--text/--bd/--muted` ألوان الثيم.
الوضع الداكن: متغيرات في `pages.css` (`prefers-color-scheme` + `[data-theme]`)، والزر في الهيدر بيحفظ الاختيار في localStorage (`cs-theme`).

## اللغة
زر EN/AR في الهيدر. القواميس في `js/i18n.js` (`X` للجمل الكاملة، `P` للعبارات الجزئية). بيحفظ الاختيار في `cs-lang`. أي نص جديد بيضاف للـ DOM بيتترجم تلقائياً (MutationObserver).

## اللي لازم يتربط بالـ Backend
- المنتجات (الأقسام الرئيسية + `#products`) حالياً HTML ثابت: استبدلها بـ render من الـ API (اسم، سعر، سعر قديم، نسبة الخصم، صور).
- كل كارت منتج محتاج `data-n` (اسم المنتج) — بيستخدمه `pick()` في `store.js` للسلة.
- السلة في الذاكرة فقط (`cart[]` في `store.js`): اربطها بـ API/Storage.
- الفلاتر والترتيب وكود الخصم ونموذج الدفع شكل فقط (بدون منطق).
- صور الفئات/المنتجات placeholders: استبدلها بصور الـ API.
- شريط "صفحات العرض" (`<nav class="dn">`) للعرض على العميل فقط: احذفه قبل الإنتاج.
- النصوص (الأسماء/الوصف) الجاية من الـ API لازم تيجي مترجمة من الباك إند أو تتضاف لقاموس `i18n.js`.
