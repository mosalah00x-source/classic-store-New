# ClassicStore — Documentation Index

**Repository:** mosalah00x-source/classic-store-New  
**Canonical documentation branch:** docs/project-reference  
**Current report:** V5 replaces V4 as the current project status; V2–V4 remain historical snapshots.

## مرجع الإدارة والقرارات المعتمدة
- [ADMIN-0 — الجرد والتصميم وقرارات PO](project-reference/ADMIN-0.md)
- [ADM-1 — خطة المصادقة والأدوار وسجل التدقيق (تقرير فقط)](project-reference/ADM-1-plan.md)
- [فهرس مرجع الإدارة](project-reference/README.md)
- [Backlog والبنود المفتوحة](project-reference/open-items.md)

## ملخص المشروع وسجل المهام
- [تقرير المشروع V5 — الحالة الحالية](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V5.md)
- [سجل مهام PR #22–#30](tasks/README.md)
- [دليل التشغيل المحلي والمراجعة البصرية](project-reference/local-development-and-visual-review.md)

## المراجع التاريخية والقرارات
- [قرار PO — شريط التنقل السفلي .dn](decisions/F2-dn-nav-bar-decision.md)
- [قرار PO — تأجيل شارات الخصم و«جديد» من F4](decisions/F4-badges-deferred.md)
- [تقرير المشروع V4 — لقطة 22 نوفمبر (تاريخي)](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V4_2026-11-22.md)
- [تقرير المشروع V3](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V3_2026-11-18.md)
- [تقرير التحقق V3](reports/V3-verification-report-2026-11-18.md)
- [تقرير إغلاق F1 — Shared Storefront Shell](reports/F1-storefront-shell-completion-report.md)
- [تقرير إغلاق F3 — Home Storefront](reports/F3-home-storefront-completion-report.md)
- [تقرير V2 التاريخي — لا يُعدّل](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V2_PO_DECISIONS_2026-11-18.md)

## المراجع التقنية
- [Project Master Reference (Arabic)](reference/Classic_Store_Project_Master_Reference_AR.md)
- [Consolidated SQL reference V1–V7](reference/Classic_Store_Consolidated_V1-V7.sql)
- [Frontend Language, Direction and Theme Guide](reference/FRONTEND_LANGUAGE_THEME_GUIDE.md)
- [Static UI prototype guide](ui-reference/README.md)

## الوثائق المركزية ومصادرها
راجع جدول المصدر والملكية التفصيلي في النسخ السابقة من هذا الفهرس وسجلات المستودع؛ أي ملف جديد يجب أن يسجل مصدره الأصلي والفرع والمسار وBlob SHA قبل اعتباره نسخة معتمدة.

## قواعد المصدر والحوكمة
1. docs/project-reference هو المصدر المركزي الجاري للتوثيق؛ الفروع الأخرى مصادر تنفيذ وليست أماكن تحديث هذه الوثائق.
2. GitHub هو المرجع لحالة الفروع والـ PRs والـ commits والـ CI.
3. قرار PO لا يُستنتج من Ready أو Merge أو CI.
4. لا يُدّعى التطابق البصري دون screenshots فعلية قابلة لإعادة الفحص.
5. لا يُدّعى نجاح CI على Merge SHA من نجاح Head SHA.
6. لا يُستنتج تنفيذ ميزة من وجود SRS أو OpenAPI أو schema وحدها.
7. لا يبدأ ADM-1 implementation قبل موافقة PO المكتوبة على الخطة.
