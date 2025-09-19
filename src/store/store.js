// store.js
const { configureStore } = window.RTK; // <--: يتم استخدام هذه الطريقة في حالة تم استيراد المكتبة من CDN:
import { configureStore } from "@reduxjs/toolkit"; // <--: 

import counterReducer from "./counterSlice.js";

const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});

export default store;
