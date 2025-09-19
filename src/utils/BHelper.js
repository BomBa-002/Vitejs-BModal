/**
 * 📝 ./utils/BHelper.js
 * Version: 1.0.0
 * lastUpdatedAt:[{ "date": "11/09/2025", "by": ["BomBa"], "comment": "مكتبة صغيرة للتعامل مع DOM مثل jQuery" }]
 */



//#region Method Helper | دوال مساعدة :-

  /* //* @NAME sleep : تستخدم مع async/await لتأخير التنفيذ
  * مثال: await sleep(1000); // ينتظر ثانية واحدة
  * @param {number} ms - المدة بالميلي ثانية
  * @return {Promise}
  */
  export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
//#endregion

//#region TO STORAGE | دوال الحفظ و التخذين :-

// 🔒 Utilities لإدارة التخزين (localStorage, sessionStorage, cookies)
export class Storage {
  // -------------------- Local & Session Storage --------------------

  /**
   * دالة إرسال رد موحد عند النجاح أو الخطأ
   * @param a 
   * @returns 
   */ 
  static success(a) { return {status: "success", message: "✅ تم العملية بنجاح!", data: {} ,...a};}
  static error(a) { return {status: "error", message: "❌ خطأ أثناء العملية!", error ,...a};}


  /**
   * حفظ بيانات داخل localStorage , sessionStorage , cookies
   * @param {string} key - اسم المفتاح
   * @param {any} value - قيمة البيانات
   * @param {"local"|"session"|"cookies"} type - نوع التخزين
   * @param {Object} options - خيارات إضافية (مثل مدة الكوكيز)
   */
  static set(key, value, type, options = {}) {
    try {
      if (type === "local") { localStorage.setItem(key, JSON.stringify(value)); }
      else if (type === "session") { sessionStorage.setItem(key, JSON.stringify(value)); }
      else if (type === "cookies") {
        const days = options.days || 7; // الافتراضي 7 أيام
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${key}=${encodeURIComponent(
          value
        )}; ${expires}; path=/`;
      }
      return this.success();
    } catch (error) { return this.error({error}); }
  }

  /**
   * جلب بيانات من localStorage , sessionStorage , cookies
   * @param {string} key - اسم المفتاح
   * @param {"local"|"session"|"cookies"} type - نوع التخزين
   * @returns {any} - قيمة البيانات أو null إذا لم توجد
   */
  static get(key, type) {
    try {
      if (type === "local") {
        const item = localStorage.getItem(key);
        return this.success({data: item ? JSON.parse(item) : null});
      }
      else if (type === "session") {
        const item = sessionStorage.getItem(key);
        return this.success({data: item ? JSON.parse(item) : null});
      }
      else if (type === "cookies") {
        const nameEQ = key + "=";
        const ca = document.cookie.split("; ");
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          if (c.indexOf(nameEQ) === 0) {
            return this.success({data: decodeURIComponent(c.substring(nameEQ.length))});
          }
        }
        return this.success({data: null});
      }
    } catch (error) { return this.error({error}); }
  }

  /**
   * حذف بيانات من localStorage , sessionStorage , cookies
   * @param {string} key - اسم المفتاح
   * @param {"local"|"session"|"cookies"} type - نوع التخزين
   */
  static remove(key, type) {
    try {
      if (type === "local") { localStorage.removeItem(key); }
      else if (type === "session") { sessionStorage.removeItem(key); }
      else if (type === "cookies") {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
      return this.success();
    } catch (error) { return this.error({error}); }
  }

  /**
   * عرض جميع البيانات المخزنة
   * @param {"local"|"session"|"cookies"} type - نوع التخزين
   */
  static getAll(type) {
    try {
      if (type === "local" || type === "session") {
        const storage = type === "local" ? localStorage : sessionStorage;
        const data = {};
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          data[key] = JSON.parse(storage.getItem(key));
        }
        // console.table(data);
        return this.success({data});
      } else if (type === "cookies") {
        const cookies = document.cookie.split("; ");
        const data = {};
        cookies.forEach((cookie) => {
          const [name, value] = cookie.split("=");
          if (name) data[name] = decodeURIComponent(value);
        });
        // console.table(data);
        return this.success({data});
      }
    } catch (error) { return this.error({error}); }

  }

  /**
   * حذف جميع البيانات
   * @param {"local"|"session"|"cookies"} type - نوع التخزين
   */
  static clearAll(type) {
    try {
      if (type === "local") {
        localStorage.clear();
      } else if (type === "session") {
        sessionStorage.clear();
      } else if (type === "cookies") {
        const cookies = document.cookie.split("; ");
        cookies.forEach((cookie) => {
          const name = cookie.split("=")[0];
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
      }
    //   console.log(`🧹 تم مسح جميع البيانات من ${type}`);
        return this.success();
    } catch (error) { return this.error({error}); }

  }
}

// -------------------- ✅ أمثلة عملية --------------------
/*
  // حفظ بيانات مستخدم في localStorage
  Storage.set("user", { name: "BomBa", role: "Backend Master" }, "local");
  // جلب بيانات المستخدم من localStorage
  const user = Storage.get("user", "local");
  console.log(user);
  // حفظ بيانات جلسة في sessionStorage
  Storage.set("token", "abc123", "session");
  // جلب بيانات الجلسة
  const token = Storage.get("token", "session");
  console.log(token);

  // حفظ كوكي باسم "theme" لمدة 30 يوم
  Storage.set("theme", "dark", "cookies", { days: 30 });
  // جلب الكوكي
  const theme = Storage.get("theme", "cookies");
  console.log(theme); // dark
  // حذف الكوكي
  Storage.set("theme", "", "cookies", { days: -1 }); // حذف الكوكي

  // عرض جميع البيانات المخزنة
  const allLocal = Storage.getAll("local");
  console.log(allLocal);
  const allSession = Storage.getAll("session");
  console.log(allSession);
  const allCookies = Storage.getAll("cookies");
  console.log(allCookies);
  // حذف جميع البيانات
  // Storage.clearAll("local");
  // Storage.clearAll("session");
  // Storage.clearAll("cookies");

*/
//#endregion

export default 'I love BomBa ♥';