/**
 * 📝 ./src/main.js
 * Version: 1.0.0
 * lastUpdatedAt:[{ "date": "20/09/2025", "by": ["BomBa"], "comment": "ملف الإدارة الرئيسي" }]
 */

import "./store/useStore.js";
import { useThemeSystemOrDarkOrLight } from "./utils/BThemes.js";
import { useModal } from "./utils/BModal.js";
// ---------- ----------
import "./styles/main.scss";
// ---------- ---------- ---------- ---------- ----------




// دوال يتم تنفيذها عند تحميل المحتوى
window.addEventListener("DOMContentLoaded", () => {
  // عند تحميل الصفحة قم بإدراج وضع النظام  | الوضع الفاتح | الوضع الداكن
  useThemeSystemOrDarkOrLight();
  // TODO: تفعيل حفظ الوضع المختار في التخزين المحلي
  
  // تفعيل نموذج النوافذ
  useModal();
  // TODO: تحسين نموذج النوافذ
  

});

