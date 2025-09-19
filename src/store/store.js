/**
 * 📝 ./src/store/store.js
 * Version: 1.0.0
 * lastUpdatedAt:[{ "date": "20/09/2025", "by": ["BomBa"], "comment": "ملف التخزين الرئيسي" }]
 */

// استيراد مكتبة Redux من CDN
import "https://cdn.jsdelivr.net/npm/@reduxjs/toolkit@latest/dist/redux-toolkit.umd.min.js";
import "https://cdn.jsdelivr.net/npm/redux@latest/dist/redux.min.js";
// ---------- ---------- ---------- ---------- ----------

// استيراد الدوال اللازمة من مكتبة Redux Toolkit
const { configureStore } = window.RTK; // <--: يتم استخدام هذه الطريقة في حالة تم استيراد المكتبة من CDN:
// import { configureStore } from "@reduxjs/toolkit"; // <--: يتم استخدام هذه الطريقة في حالة تم تثبيت المكتبة عبر npm: 
// استيراد ال Slice:
import counterReducer from "./counterSlice.js";
// ---------- ---------- ---------- ---------- ----------

// تكوين المخزن
const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});

// ---------- ---------- ---------- ---------- ----------
// تصدير المخزن والدوال اللازمة
export const dispatch = store.dispatch;
export default store;
