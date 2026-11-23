# F1 — تقرير إغلاق Shared Storefront Shell

**تاريخ التوثيق:** 2026-11-22  
**المستودع:** `mosalah00x-source/classic-store-New`  
**فرع التطبيق:** `FrontendApp`  
**فرع هذا التقرير:** `docs/project-reference`  
**PR:** [#26 — feat(frontend): add shared storefront shell](https://github.com/mosalah00x-source/classic-store-New/pull/26)

> هذا تقرير توثيق ووقائع GitHub. تسجيل الدمج لا يثبت موافقة PO، ولا يثبت اكتمال القبول البصري أو قياس وميض الثيم.

## 1. ملخص F1 والنطاق المنفذ

قدّم PR #26 الهيكل المشترك للمتجر على مسارات اللغة، ويشمل:

- Header وFooter مشتركين عبر Locale Layout.
- Mega menu للتصنيفات، مع جلب التصنيفات من Catalog API.
- البحث في الهيدر.
- زر تبديل اللغة مع الحفاظ على المسار.
- مزود ثيم موحد يستخدم تفضيل `classic-store-theme`، مع Light/Dark.
- رابط تسجيل الدخول.
- أيقونة السلة مع عداد مؤقت قيمته `0`؛ لا يمثل ذلك تنفيذ Cart API أو سلة فعلية.
- تفعيل مسارات Catalog وProduct بالإنجليزية، مع استخدام حقول البيانات الإنجليزية المتاحة وfallback عند غيابها.
- اختبارات بنيوية للـ Shell واتجاه اللغة ومفاتيح الرسائل وعدم وجود نصوص عربية ثابتة في ملفات Catalog/Product المحددة.

**حدود ما يثبته ذلك:** نجاح الاختبارات وCI لا يثبت المطابقة البصرية. كما أن English data fallback قد يعرض بيانات عربية عندما لا تتوفر حقول EN من API؛ وهذا قيد بيانات مسجل في وصف PR.

## 2. سجل GitHub للدمج

| البند | الحقيقة المتحققة |
|---|---|
| PR | #26 — `feat(frontend): add shared storefront shell` |
| الحالة النهائية | Closed وMerged |
| Created | 2026-11-19 12:53:35 UTC |
| Ready for review | حدث `ready_for_review` في 2026-11-22 12:14:22 UTC |
| Merged / Closed | 2026-11-22 12:14:33 UTC |
| الفاعل الظاهر في حدث الدمج | `mosalah00x-source` |
| PR Head قبل الدمج | `b1a4d29f4f78b1cc4a69b2d7d63140b7cafe9192` |
| Merge commit | `eea323cde726ef17666525bb047f4c2e093af1ac` |
| Base SHA المسجل في PR | `dd00ddd5fb6c21800f9928662893a27b4a290d63` |
| عدد commits داخل PR | 36 |
| Reviews | 0 review submissions |
| Conversation comments | 3 تعليقات |
| Inline review comments / threads | 0 / 0 |

### علاقة Merge commit بالـ base

GitHub يعرض Merge commit `eea323cde726ef17666525bb047f4c2e093af1ac` بوالد واحد فقط هو `dd00ddd5fb6c21800f9928662893a27b4a290d63`، وهو نفسه Base SHA المسجل في PR. إذن commit الدمج موجود، وعلاقته بالـ base صحيحة؛ لكنه ليس commit ذا والدين كما في merge commit تقليدي. لا أصف استراتيجية الدمج بأنها two-parent merge.

### حالة Draft قبل الدمج

حدث GitHub `ready_for_review` بواسطة `mosalah00x-source` عند **12:14:22 UTC**، ثم حدث `merged` بعده بـ11 ثانية عند **12:14:33 UTC**. هذا يثبت انتقال PR إلى Ready for review قبل الدمج مباشرة؛ أي إنه لم يكن Draft لحظة الدمج. ويشير حدث Ready for review إلى أنه كان Draft قبل هذا الانتقال. حالة PR النهائية `draft=false`.

## 3. التعليقات والقرار المتعلق باللقطات

وجد GitHub ثلاثة Conversation comments، ولا توجد Review submissions أو inline review comments. تعليق التنازل موجود، وهو التعليق رقم [7078863065](https://github.com/mosalah00x-source/classic-store-New/pull/26#issuecomment-7078863065)، ونصه الحرفي:

> ## PO decision — scoped F1 screenshot concession
>
> يتنازل PO عن استكمال مصفوفة اللقطات الأصلية (24 لقطة) لـ F1، ويكتفي بأدلة اللقطات المرفقة في الملف المؤرخ **18 نوفمبر 2026**، وذلك في النطاق المحدد أدناه فقط.
>
> ### النطاق المغطّى بالأدلة
> - الكتالوج `/en/products` و`/ar/products` على Desktop في وضعي Light وDark.
> - صفحة تفاصيل المنتج على Desktop في وضعي Light وDark، باللغتين العربية والإنجليزية.
> - صفحة تفاصيل المنتج على Mobile بصورة جزئية؛ ولا تُعد تغطية الوضع الداكن على Mobile مكتملة أو واضحة.
> - صفحات تسجيل الدخول والتسجيل واستعادة كلمة المرور على Mobile وDesktop.
> - تصفية الكتالوج بتصنيف **«قبعات»** على Desktop وMobile.
>
> ### غير مغطّى — ولا يشمله هذا التنازل
> - الصفحة الرئيسية `/ar` و`/en` بالكامل.
> - صفحة تفاصيل المنتج على Mobile في الوضع الداكن بصورة واضحة ومثبتة.
> - قياس وميض الثيم عند التحميل (Theme flash).
> - أي مسار أو حالة أو تحقق آخر غير مذكور صراحةً ضمن النطاق المغطّى أعلاه.
>
> ### حدود القرار
> - هذا تنازل محدود عن استكمال مصفوفة اللقطات الـ24، وليس إعلانًا بأن التحقق البصري لـ F1 مكتمل عمومًا.
> - لا يُعد هذا التنازل دليلًا على غياب وميض الثيم؛ يظل قياسه **UNVERIFIED** إلى حين إجراء اختبار فعلي.
> - لا يتضمن القرار تعديل `docs/project-reference` أو رفع لقطات جديدة إلى فرع الوثائق أو فرع التطبيق.
> - يظل PR #26 **Open / Draft / Not merged** إلى أن يُقاس وميض الثيم وتُراجع نتيجته ويصدر قرار PO لاحق بشأن الدمج.
>
> هذا التنازل لا يمتد إلى أي نطاق آخر.

**حدود التنازل:** يغطي فقط نطاق اللقطات الموصوف أعلاه، ولا يغطي Home أو تفاصيل المنتج Mobile Dark بوضوح أو قياس الوميض أو أي تحقق آخر. لا يساوي هذا التنازل إعلان اكتمال التحقق البصري.

## 4. سجل commits الرئيسية

| الغرض | SHA | رسالة GitHub | الملفات الرئيسية |
|---|---|---|---|
| بداية تنفيذ F1 / Shell | [`b6e1d7e`](https://github.com/mosalah00x-source/classic-store-New/commit/b6e1d7e6deee69e3cccdb261a408a1ac446c79a6) | `feat(frontend): add shared storefront shell components` | `frontend/src/components/StorefrontThemeProvider.tsx` |
| إصلاح Script الذي كان يُدار داخل React | [`2b396b2`](https://github.com/mosalah00x-source/classic-store-New/commit/2b396b230333205676bbfe8f7e47d766ec7a49b4) | `fix(frontend): remove React-managed theme bootstrap script` | `frontend/src/app/[locale]/layout.tsx` |
| إصلاح مزامنة الثيم بـ useSyncExternalStore | [`354a9ed`](https://github.com/mosalah00x-source/classic-store-New/commit/354a9ed5b77d64941c868427e4daec0c8948f3c4) | `fix(frontend): synchronize theme without effect state updates` | `frontend/src/components/StorefrontThemeProvider.tsx` |
| إصلاح Link المستورد مرتين في Catalog | [`911831d`](https://github.com/mosalah00x-source/classic-store-New/commit/911831d6df2e52dd9d68dbb7a15aff70c3d07749) | `fix(frontend): remove duplicate catalog Link import` | `frontend/src/components/CatalogClient.tsx` |
| تنظيف ملف theme bootstrap الخارجي | [`676cdc2`](https://github.com/mosalah00x-source/classic-store-New/commit/676cdc27d5dc3046e6d673a027688f1d2c9cc184) | `chore(frontend): remove unused theme bootstrap script` | حذف `frontend/public/classic-store-theme-init.js` |
| نقل نصوص Catalog/Product الإنجليزية للرسائل | [`18f0916`](https://github.com/mosalah00x-source/classic-store-New/commit/18f0916a9eb43f9382f247562071e6d420337197) | `fix(frontend): localize English catalog and product UI` | `CatalogClient.tsx`، `ProductDetailClient.tsx`، صفحة Product، `messages/en.json`، `messages/ar.json`، اختبار الرسائل |
| استكمال ترجمة العملة | [`2fd752b`](https://github.com/mosalah00x-source/classic-store-New/commit/2fd752b47bf17cda69d63b635c9731bac89c143d) | `fix(frontend): localize product currency label` | `ProductDetailClient.tsx` |
| آخر commit ترجمة قبل الدمج / PR Head | [`b1a4d29`](https://github.com/mosalah00x-source/classic-store-New/commit/b1a4d29f4f78b1cc4a69b2d7d63140b7cafe9192) | `fix(frontend): add localized product currency messages` | `frontend/src/messages/ar.json`، `frontend/src/messages/en.json` |
| Merge commit | [`eea323c`](https://github.com/mosalah00x-source/classic-store-New/commit/eea323cde726ef17666525bb047f4c2e093af1ac) | `feat(frontend): add shared storefront shell (#26)` | دمج تغييرات PR #26؛ 15 ملفًا متغيرًا في PR |

**تصحيح مهم للتسمية:** `676cdc2` ليس آخر commit قبل الدمج. إنه commit تنظيف ملف bootstrap، وتلاه commits الترجمة `18f0916` و`2fd752b` و`b1a4d29`. آخر PR Head قبل الدمج هو `b1a4d29...`.

## 5. نتائج CI

| Run | SHA الذي اختُبر | الحالة العامة | Install | Lint | Typecheck | Unit tests | Production build |
|---|---|---|---|---|---|---|---|
| [#88 — 44528675531](https://github.com/mosalah00x-source/classic-store-New/actions/runs/44528675531) | `354a9ed5b77d64941c868427e4daec0c8948f3c4` | **FAIL** | PASS | PASS | **FAIL** | SKIPPED | SKIPPED |
| [#94 — 45017616604](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45017616604) | `676cdc27d5dc3046e6d673a027688f1d2c9cc184` | **PASS** | PASS | PASS | PASS | PASS | PASS |
| [#97 — 45018782645](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45018782645) | `b1a4d29f4f78b1cc4a69b2d7d63140b7cafe9192` | **PASS** | PASS | PASS | PASS | PASS | PASS |

لم يُعثر على Workflow run مرتبط بـ Merge SHA `eea323c...` عبر بيانات GitHub Actions المسترجعة، كما أن Commit Statuses لذلك SHA فارغة. لذلك **لم يُثبت إعادة تشغيل CI على Merge commit نفسه**. آخر CI أخضر هو Run #97 على PR Head `b1a4d29...` قبل الدمج.

## 6. حالة وميض الثيم

<badge color="warning">UNVERIFIED</badge>

لم يتم قياس أول إطار مرئي في متصفح على Merge SHA. الدمج وقع في **12:14:33 UTC**، بينما لم يكن القياس قد نُفذ. لا يثبت هذا التقرير وجود الوميض أو غيابه، ولا يصفه بأنه مقبول أو محلول.

يبقى قياس Theme flash مهمة مفتوحة مستقلة، ويجب أن يسجل الاختبارات الفعلية على `eea323c...`، بما فيها Dark وLight وprefers-color-scheme وحالة CPU throttling، مع تسجيل أول 500ms.

## 7. قرار الدمج كما تثبته السجلات

- GitHub يثبت أن PR #26 دُمج وأُغلق.
- GitHub يثبت أن حساب `mosalah00x-source` هو الفاعل الظاهر في حدث الدمج.
- لا يوجد Review submission من PO؛ عدد Reviews المسجلة صفر.
- لا يوجد في التعليقات الثلاثة تصريح لاحق صريح يوافق على الدمج بعد التنازل. تعليق التنازل نفسه ينص على بقاء PR مفتوحًا وDraft وغير مدمج إلى حين قياس الوميض ومراجعة النتيجة وصدور قرار PO لاحق.
- لذلك لا أستنتج موافقة PO على الدمج من حدث الدمج، ولا أعتبر الدمج إغلاقًا لمتطلب قياس الوميض.

## 8. تحقق يدوي مطلوب

1. **موافقة PO الصريحة على الدمج:** لم يظهر مصدر GitHub يثبت موافقة PO على دمج PR #26 بعد تعليق التنازل. يلزم تسجيل مصدر مستقل/تصريح صريح إن كان موجودًا خارج GitHub؛ لا يُستعاض عنه بحدث الدمج.
2. **قياس Theme flash:** لم يُنفذ؛ الحالة UNVERIFIED.
3. **لقطات Home:** لا توجد لقطات Home ضمن نطاق التنازل، ويظل التقاط `/ar` و`/en` مطلوبًا.
4. **تأكيد بصري لصفحة Product على Mobile Dark:** التنازل يصرح بأن هذه التغطية غير مكتملة أو غير واضحة.
5. **تشغيل CI على Merge SHA:** لا يوجد Run أو status check مسترجع على `eea323c...`; آخر Run أخضر على PR Head السابق.

## 9. المتبقي من F1

- قياس وميض الثيم وتوثيق النتيجة الفعلية.
- التقاط لقطات Home بالعربية والإنجليزية.
- معالجة أي تبعات تظهر من القياس أو المراجعة اليدوية، بعد قرار PO مناسب؛ لا يتضمن هذا التقرير أي تعديل كود أو إصلاحًا مفترضًا.

## 10. تعارضات بين وصف PR والوقائع اللاحقة على GitHub

1. **Head المذكور في وصف PR قديم:** الوصف يذكر `354a9ed5b77d64941c868427e4daec0c8948f3c4` على أنه Current Head، بينما GitHub يسجل PR Head الفعلي قبل الدمج `b1a4d29f4f78b1cc4a69b2d7d63140b7cafe9192`. كما أن `354a9ed...` هو commit إصلاح `useSyncExternalStore` وليس آخر commit في PR.
2. **وصف Run #88 بأنه queued لا يطابق نتيجته:** وصف PR يشير إلى Run ID `44528675531` على أنه rerun queued. سجل Actions الفعلي يعرض Run #88 مكتملًا بنتيجة **failure**: Install وLint نجحا، Typecheck فشل، وUnit tests وProduction build تم تخطيهما. تبعه Run #94 ثم Run #97 الناجحان على SHAs أحدث.
3. **شرط Draft وعدم الدمج لا يطابق الحدث النهائي:** وصف PR يقول Draft only ولا merge قبل CI واللقطات ومراجعة PO. والتعليقان رقم `7078707631` و`7078863065` ينصان على إبقاء PR Open / Draft / Not merged، مع بقاء قياس الوميض UNVERIFIED. لكن Timeline يسجل `ready_for_review` عند 12:14:22 UTC ثم `merged` عند 12:14:33 UTC. لا يوجد Review submission مسجل يثبت موافقة PO.
4. **نطاق التحقق البصري لم يصبح مكتملاً:** التنازل الأخير يقتصر على اللقطات المحددة في تعليق `7078863065`، ويستثني Home وTheme flash صراحةً. لذلك لا يصح وصف الدمج بأنه اكتمال عام للتحقق البصري.
5. **وصف آلية early script في PR قديم:** نص PR يصف تطبيق الثيم عبر guarded early script؛ لكن سجل commits اللاحق يتضمن إزالة React-managed Script ثم حذف ملف `classic-store-theme-init.js` غير المستخدم. لذلك لا ينبغي استخدام وصف PR وحده لوصف آلية التنفيذ النهائية.

هذه نقاط اختلاف بين وصف PR/التعليقات السابقة والحالة الفعلية اللاحقة. لا يُستنتج منها سبب الدمج أو وجود موافقة PO؛ يلزم مصدر صريح مستقل إذا كانت الموافقة قد صدرت خارج GitHub.

## 11. مصادر GitHub

- [PR #26](https://github.com/mosalah00x-source/classic-store-New/pull/26)
- [Merge commit eea323c](https://github.com/mosalah00x-source/classic-store-New/commit/eea323cde726ef17666525bb047f4c2e093af1ac)
- [Run #88](https://github.com/mosalah00x-source/classic-store-New/actions/runs/44528675531)
- [Run #94](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45017616604)
- [Run #97](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45018782645)
- [تعليق التنازل عن اللقطات](https://github.com/mosalah00x-source/classic-store-New/pull/26#issuecomment-7078863065)
