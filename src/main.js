import BModal from "./bmodal.js";
import "./styles/bmodal.scss";


// Demo: فتح نافذة رئيسية وزر لفتح نافذة متداخلة
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openModal");
  const defaultOptions = {
      /** إعدادات النافذة الرئيسية
       * مكان الظهور: في الوسط
       * العرض: 32em
       * الارتفاع: 18em
       * اقصى عرض: 90%
       * اقصى ارتفاع: 90%
       * قابلية تغير حجم:نعم  //  النافزة من خلال الزوية السفلية اليمني
       * خلفية خلف الشاشة : مظللة // overlay 
       * الإغلاق باستخدام زرار ESC: نعم
       * الإغلاق بالنقر على خلفية الشاشة: نعم
       * حفظ و مراقبة التغيرات بالمديل في localStorage: نعم
       * 
       */
      position: "center",
      width: "32em",
      height: "18em",
      maxWidth: "90%",
      maxHeight: "90%",
      minWidth: "30%",
      minHeight: "30%",
      resizable: true,
      overlay: true,
      closeOnEsc: true,
      closeOnOverlayClick: true,
      storage: true,

      /** إعدادات شريط العنوان
       * إظهار شريط العنوان: نعم
       * الايكونة : {إظهار: لا, (المسار او كود HTML او SVG): ""} // يمكن وضع مسار صورة الايكونة
       * النص: {النص: "رئيسية", المحاذاة: "center"} // المحاذاة: left, center, right
       * زرار الإغلاق: {إظهار: نعم, المحاذاة: "right"} // المحاذاة: left, center, right
       * زرار التكبير: {إظهار: نعم, المحاذاة: "right"} // المحاذاة: left, center, right
       * زرار التصغير: {إظهار: نعم, المحاذاة: "right"} // المحاذاة: left, center, right
       * يمكن سحب النافذة من شريط العنوان: نعم
       * يمكن تكبير او تصغير النافذة بالنقر المزدوج على شريط العنوان: نعم
       */
      title: {
          show: true,
          icon: { show: false, value: "" },
          text: { value: "", align: "center" },
          closeBtn: { show: true, align: "right" },
          maximizeBtn: { show: true, align: "right" },
          minimizeBtn: { show: true, align: "right" },
          draggable: true,
          dblClickMaximize: true
      },

      /** إعدادات الجسد
       * إظهار الجسد: نعم
       * المحتوى: HTML
       * التمرير: تلقائي
       */
      body: {
          show: true,
          content: ``,
          scroll: "auto"
      },

      /** شريط الحالة إعدادات التذييل
       * إظهار التذييل: لا
       * المحتوى: HTML
       * محاذاة المحتوى: center // left, center, right
       */
      footer: {
          show: false,
          content: "",
          align: "center"
      },
      };

  // نافذة رئيسية
  const mainModal = new BModal({
    ...defaultOptions,
    title: { ...defaultOptions.title, text: { value: "الرئيسية", align: "center" } },
    body: { ...defaultOptions.body, content: `<p>أنا نافذة رئيسية <button id="nestedBtn">افتح فرعية</button></p>` },
    footer: { show: true, content: "تذييل النافذة", align: "center" }
  });

  // نافذة فرعية
  const nestedModal = new BModal({
    ...defaultOptions,
    overlay: false,

    title: { ...defaultOptions.title, text: { value: "الفرعية", align: "center" } },
    body: { ...defaultOptions.body, content: `<p>أنا نافذة فرعية داخل الرئيسية</p>` }
  });



  openBtn.addEventListener("click", () => {
  mainModal.open();

  // فتح نافذة فرعية عند الضغط
  setTimeout(() => {
    document.getElementById("nestedBtn")?.addEventListener("click", () => {
      nestedModal.open();
    });
  }, 100);

  });
});





//#region USE Redux:

// import store from "./store/store.js";
// import { increment, decrement, reset } from "./store/counterSlice.js";
import "https://cdn.jsdelivr.net/npm/@reduxjs/toolkit@latest/dist/redux-toolkit.umd.min.js";
import "https://cdn.jsdelivr.net/npm/redux@latest/dist/redux.min.js";

import store from "./store/store.js";
import { increment, decrement, reset } from "./store/counterSlice.js";

const countEl = document.getElementById("count");

// 📌 تحديث القيمة عند تغيير الحالة
store.subscribe(() => {
  const state = store.getState();
  countEl.textContent = state.counter.value;
});

// 📌 ربط الأزرار
document.getElementById("inc").addEventListener("click", () => {
  store.dispatch(increment());
});

document.getElementById("dec").addEventListener("click", () => {
  store.dispatch(decrement());
});

document.getElementById("reset").addEventListener("click", () => {
  store.dispatch(reset());
});

//#endregion