/**
 * 📝 ./src/store/useStore.js
 * Version: 1.0.0
 * lastUpdatedAt:[{ "date": "20/09/2025", "by": ["BomBa"], "comment": "طريقة استخدام Redux مع vanilla JavaScript" }]
 */

//#region USE Redux:

// 📌 استيراد المخزن والإجراءات
import store, { dispatch } from "./store.js";
import { increment, decrement, reset } from "./counterSlice.js";
// ---------- ---------- ---------- ---------- ----------


// 📌 عناصر HTML:-
const
  $countEl = document.querySelectorAll(".count"),
  $btns_inc = document.querySelectorAll(".inc"),
  $btns_dec = document.querySelectorAll(".dec"),
  $btns_reset = document.querySelectorAll(".reset");
// ---------- ---------- ---------- ---------- ----------


// Methods: - ---------- ---------- ---------- ----------

// تحديث القيم في كل العناصر التي تحمل نفس الصنف
const updateCountElements = v => $countEl.forEach(el => el.textContent = v);

// تحديث القيمة في البداية
updateCountElements(store.getState().counter.value);
// تحديث القيمة عند تغيير الحالة
store.subscribe(() => {
  const { value } = store.getState().counter;
  updateCountElements(value);
});

// ---------- ---------- ---------- ---------- ----------


// 📌 ربط الأزرار مع احداث Redux: -- -------- ----------

$btns_inc.forEach(btn => { btn.addEventListener("click", () => dispatch(increment()) ); });
$btns_dec.forEach(btn => { btn.addEventListener("click", () => dispatch(decrement()) ); });
$btns_reset.forEach(btn => { btn.addEventListener("click", () => dispatch(reset()) ); });

// ---------- ---------- ---------- ---------- ----------



//#endregion ---------- ---------- ---------- ----------
