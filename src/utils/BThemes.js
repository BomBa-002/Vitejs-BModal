/**
 * 📝 ./src/utils/BThemes.js
 * Version: 1.0.0
 * lastUpdatedAt:[{ "date": "20/09/2025", "by": ["BomBa"], "comment": "ملف الإدارة الاوضاع (system|dark|light) في المشروع" }]
 */


//#region USE Theme Toggle Button:
// import { toggleTheme } from "./store/themeSlice.js";
// import { useAppDispatch } from "./store/useStore.js";

// دالة لإضافة زرار لتبديل الوضع بين (system|dark|light)
const useThemeSystemOrDarkOrLight = () =>{
  // إضافة الزرار بداخل body
  document.body.insertAdjacentHTML("beforeend", `<i class="btn btn_toggle_theme staticPosition"></i>`);
  // تنسيق الزرار
  const $btn_themeToggleBtn = document.querySelectorAll(".btn_toggle_theme");
  $btn_themeToggleBtn.forEach(btn => {
    btn.title = `الوضع الحالي هو التلقائي (يتبع نظام الجهاز)
انقر للتبديل إلي الوضع الداكن
    `;
    btn.setAttribute("aria-label", "تبديل الوضع");
    btn.setAttribute("role", "button");
    btn.style.cssText = `
      position: fixed;
      inset-block-start: 0.5em; 
      inset-inline-end: 0.5em; 
      z-index: 9999;
      width: 2.5em;
      height: 2.5em;
      font-size: 80%;

      box-shadow: 0 0.2em 0.5em var(--primary-a200);
      cursor: pointer;
      user-select: none;
      color: var(--text);
      transition: all 0.3s ease;
      opacity: 0.6;

      display: grid;
      place-items: center;

      border-radius: 50%;

      `;
    // hover effect
    btn.addEventListener("mouseenter", () => {
      btn.style.opacity = "1";
      btn.style.transform = "scale(1.1)";
      btn.style.boxShadow = "0 0.3em 0.7em var(--primary-a400)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.opacity = "0.6";
      btn.style.transform = "scale(1)";
      btn.style.boxShadow = "0 0.2em 0.5em var(--primary-a200)";
    });
    // click effect
    const DCL = document.documentElement.classList;
    // Toggle between "system" or "light" or "dark" classes on click
    btn.addEventListener("click", () => {
      if (DCL.contains("system")) {
        DCL.remove("system");
        DCL.add("dark");
        textAndtitleUpdate(btn, "dark");
        // useAppDispatch()(toggleTheme("dark"));
      } else if (DCL.contains("dark")) {
        DCL.remove("dark");
        DCL.add("light");
        textAndtitleUpdate(btn, "light");
        // useAppDispatch()(toggleTheme("light"));
      } else {
        DCL.remove("light");
        DCL.add("system");
        textAndtitleUpdate(btn, "system");
        // useAppDispatch()(toggleTheme("system"));
      }
    });
  });
  
  // تعيين الوضع الحالي عند التحميل
  const DCL = document.documentElement.classList;
  // تعيين الوضع الحالي على الزرار
  $btn_themeToggleBtn.forEach(btn => textAndtitleUpdate(btn, DCL.contains("system") ? "system" : DCL.contains("dark") ? "dark" : "light"));



  // دالة لتحديث نص الزرار والعنوان حسب الوضع الحالي
  function textAndtitleUpdate(btn, mode) {
    if (mode === "system") {
      btn.textContent = "💻";
      btn.title = `الوضع الحالي هو التلقائي (يتبع نظام الجهاز)
انقر للتبديل إلي الوضع الداكن`;
    } else if (mode === "dark") {
      btn.textContent = "🌒";
      btn.title = `الوضع الحالي هو الداكن
انقر للتبديل إلي الوضع الفاتح`;
    } else {
      btn.textContent = "🌞";
      btn.title = `الوضع الحالي هو الفاتح
انقر للتبديل إلي الوضع التلقائي (يتبع نظام الجهاز)`;
    }
  }
};


//#endregion ---------- ---------- ---------- ----------


export { useThemeSystemOrDarkOrLight };
