/**
 * 📝 ./src/store/counterSlice.js
 * Version: 1.0.0
 * lastUpdatedAt:[{ "date": "20/09/2025", "by": ["BomBa"], "comment": "ملف تخزين العداد" }]
 */

// counterSlice.js
const { createSlice } = window.RTK; // لو تستخدم CDN
// أو import { createSlice } from "@reduxjs/toolkit"; مع NPM

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 5 },
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
    reset: (state) => { state.value = 0 }
  }
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
