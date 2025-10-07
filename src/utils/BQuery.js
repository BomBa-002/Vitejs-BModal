/*
 * Bquery.js - A lightweight jQuery-like library built with modern ES6 standards
 * ----------------------------------------------------------
 * ملاحظات:
 * - الكود مكتوب بشكل احترافي ومنظم مع تعليقات عربية لشرح الوظائف.
 * - يدعم جميع الدوال الأساسية المطلوبة مع آخر تحديثات دالة ready.
 */

class Bquery {
  constructor(selector, context = document) {
    if (!selector) { this.elements = []; }
    else if (selector instanceof Node) { this.elements = [selector]; }
    else if (selector instanceof NodeList || Array.isArray(selector)) { this.elements = Array.from(selector); }
    else if (typeof selector === 'string') { this.elements = Array.from(context.querySelectorAll(selector)); }
    else if (typeof selector === 'function') {
      // دعم $(function(){}) مباشرة
      Bquery.ready(selector);
      this.elements = [document];
    } else {
      this.elements = [];
    }

    
  }

  /* --------------------------------------------------
   * دوال مساعدة عامة
   * -------------------------------------------------- */
  each(callback) {
    this.elements.forEach((el, i) => callback.call(el, el, i));
    return this;
  }

  map(callback) {
    return this.elements.map((el, i) => callback.call(el, el, i));
  }

  /* --------------------------------------------------
   * دالة ready (تعمل على document أو Element)
   * -------------------------------------------------- */
  ready(callback) {
    if (this.elements[0] === document) {
      if (document.readyState !== 'loading') {
        callback();
      } else {
        document.addEventListener('DOMContentLoaded', callback);
      }
    } else {
      this.each(el => {
        if (el.tagName === 'IMG' || el.tagName === 'IFRAME') {
          if (el.complete) {
            callback.call(el);
          } else {
            el.addEventListener('load', () => callback.call(el));
          }
        } else {
          callback.call(el);
        }
      });
    }
    return this;
  }

  /* --------------------------------------------------
   * محتوى العناصر (HTML, Text, Value)
   * -------------------------------------------------- */
  html(value) {
    if (value === undefined) return this.elements[0]?.innerHTML;
    return this.each(el => (el.innerHTML = value));
  }

  text(value) {
    if (value === undefined) return this.elements[0]?.textContent;
    return this.each(el => (el.textContent = value));
  }

  val(value) {
    if (value === undefined) return this.elements[0]?.value;
    return this.each(el => (el.value = value));
  }

  /* --------------------------------------------------
   * الإضافة والحذف
   * -------------------------------------------------- */
  append(content) {
    return this.each(el => {
      if (typeof content === 'string') el.insertAdjacentHTML('beforeend', content);
      else if (content instanceof Node) el.appendChild(content.cloneNode(true));
    });
  }

  prepend(content) {
    return this.each(el => {
      if (typeof content === 'string') el.insertAdjacentHTML('afterbegin', content);
      else if (content instanceof Node) el.insertBefore(content.cloneNode(true), el.firstChild);
    });
  }

  remove() {
    return this.each(el => el.remove());
  }

  empty() {
    return this.each(el => (el.innerHTML = ''));
  }

  clone() {
    return new Bquery(this.elements.map(el => el.cloneNode(true)));
  }

  /* --------------------------------------------------
   * السمات والأنماط
   * -------------------------------------------------- */
  attr(name, value) {
    if (value === undefined) return this.elements[0]?.getAttribute(name);
    return this.each(el => el.setAttribute(name, value));
  }

  css(prop, value) {
    if (value === undefined && typeof prop === 'string') {
      return getComputedStyle(this.elements[0])[prop];
    }
    return this.each(el => {
      if (typeof prop === 'object') {
        for (let key in prop) el.style[key] = prop[key];
      } else {
        el.style[prop] = value;
      }
    });
  }

  addClass(cls) {
    return this.each(el => el.classList.add(cls));
  }

  removeClass(cls) {
    return this.each(el => el.classList.remove(cls));
  }

  toggleClass(cls) {
    return this.each(el => el.classList.toggle(cls));
  }

  hasClass(cls) {
    return this.elements[0]?.classList.contains(cls);
  }

  data(name, value) {
    if (value === undefined) return this.elements[0]?.dataset[name];
    return this.each(el => (el.dataset[name] = value));
  }

  /* --------------------------------------------------
   * إظهار / إخفاء
   * -------------------------------------------------- */
  show() {
    return this.each(el => (el.style.display = ''));
  }

  hide() {
    return this.each(el => (el.style.display = 'none'));
  }

  toggle() {
    return this.each(el => (el.style.display = el.style.display === 'none' ? '' : 'none'));
  }

  /* --------------------------------------------------
   * الأحداث
   * -------------------------------------------------- */
  on(event, handler) {
    return this.each(el => el.addEventListener(event, handler));
  }

  off(event, handler) {
    return this.each(el => el.removeEventListener(event, handler));
  }

  trigger(eventName) {
    return this.each(el => {
      const event = new Event(eventName, { bubbles: true });
      el.dispatchEvent(event);
    });
  }

  /* --------------------------------------------------
   * أدوات أخرى: filter, first, last, eq
   * -------------------------------------------------- */
  filter(callback) {
    return new Bquery(this.elements.filter(callback));
  }

  first() {
    return new Bquery(this.elements[0]);
  }

  last() {
    return new Bquery(this.elements[this.elements.length - 1]);
  }

  eq(index) {
    return new Bquery(this.elements[index]);
  }

  find(selector) {
    let found = [];
    this.each(el => found.push(...el.querySelectorAll(selector)));
    return new Bquery(found);
  }

  parent() {
    return new Bquery(this.elements.map(el => el.parentNode).filter(Boolean));
  }

  children() {
    let kids = [];
    this.each(el => kids.push(...el.children));
    return new Bquery(kids);
  }

  siblings() {
    let sibs = [];
    this.each(el => sibs.push(...[...el.parentNode.children].filter(c => c !== el)));
    return new Bquery(sibs);
  }

  next() {
    return new Bquery(this.elements.map(el => el.nextElementSibling).filter(Boolean));
  }

  prev() {
    return new Bquery(this.elements.map(el => el.previousElementSibling).filter(Boolean));
  }

  /* --------------------------------------------------
   * نماذج
   * -------------------------------------------------- */
  serialize() {
    if (this.elements[0] && this.elements[0].elements) {
      const data = {};
      Array.from(this.elements[0].elements).forEach(el => {
        if (el.name) data[el.name] = el.value;
      });
      return data;
    }
    return {};
  }

  /* --------------------------------------------------
   * أبعاد وإزاحة
   * -------------------------------------------------- */
  width(value) {
    if (value === undefined) return this.elements[0]?.offsetWidth;
    return this.each(el => (el.style.width = value + 'px'));
  }

  height(value) {
    if (value === undefined) return this.elements[0]?.offsetHeight;
    return this.each(el => (el.style.height = value + 'px'));
  }

  offset() {
    const el = this.elements[0];
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { top: rect.top + window.scrollY, left: rect.left + window.scrollX };
  }

  scrollTop(value) {
    if (value === undefined) return this.elements[0]?.scrollTop;
    return this.each(el => (el.scrollTop = value));
  }

  scrollLeft(value) {
    if (value === undefined) return this.elements[0]?.scrollLeft;
    return this.each(el => (el.scrollLeft = value));
  }

  /* --------------------------------------------------
   * تأثيرات بسيطة
   * -------------------------------------------------- */
  fadeIn(duration = 400) {
    return this.each(el => {
      el.style.opacity = 0;
      el.style.display = '';
      let last = +new Date();
      const tick = () => {
        el.style.opacity = +el.style.opacity + (new Date() - last) / duration;
        last = +new Date();
        if (+el.style.opacity < 1) requestAnimationFrame(tick);
      };
      tick();
    });
  }

  fadeOut(duration = 400) {
    return this.each(el => {
      el.style.opacity = 1;
      let last = +new Date();
      const tick = () => {
        el.style.opacity = +el.style.opacity - (new Date() - last) / duration;
        last = +new Date();
        if (+el.style.opacity > 0) requestAnimationFrame(tick);
        else el.style.display = 'none';
      };
      tick();
    });
  }

  /* --------------------------------------------------
   * دوال ثابتة (Static)
   * -------------------------------------------------- */
  static ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  static ajax({ url, method = 'GET', data = null, headers = {} }) {
    return fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: data ? JSON.stringify(data) : null
    }).then(res => res.json());
  }
}

// --------------------------------------------------
// اختصارات
// --------------------------------------------------
export function $(selector, context) {
  return new Bquery(selector, context);
}
export function $$(selector, context) {
  return new Bquery(context ? context.querySelectorAll(selector) : document.querySelectorAll(selector));
}

// تصدير عالمي
window.Bquery = Bquery;
window.$ = $;
window.$$ = $$;

export default Bquery;




/* example $$ 
  const _elements = $$('.class');
  _elements.each(_el => {console.log(_el)})
  .addClass('checked')
  .hide();
*/


// #region : Function : دوال مساعدة

/**
 * @description 
 * @param {نوع_البيان} الاسم - وصف المعامل.
 * @param {نوع_البيان} الاسم - وصف المعامل.
 * @returns {نوع_البيان} - وصف النتيجة.
 * @example
 *   const result = myFunction(arg1, arg2);
 */
/**
* @function sleep :-> 💤 أداة نوم متقدمة
* @description: يُؤخّر التنفيذ لمدة مُحددة مع دعم الإلغاء.
* @param {number} مللي ثانية - مدة الانتظار بالملي ثانية.
* @param {AbortSignal} [signal] - إشارة اختيارية لإلغاء التأخير.
* @returns {Promise<void>}: يُحلّ بعد الوقت المُحدد ما لم يُلغَ.
 * 
 * @example
 *   await sleep(1000); // wait 1 second
 * 
 *   // Example with cancel:
 *   const controller = new AbortController();
 *   const promise = sleep(5000, controller.signal);
 *   setTimeout(() => controller.abort('User canceled'), 2000);
 *   await promise.catch(console.error);
 */
export function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (typeof ms !== 'number' || ms < 0)
      return reject(new TypeError('sleep(ms): ms must be a positive number'));

    // إذا تم الإلغاء قبل البدء
    if (signal?.aborted) { return reject(signal.reason || new Error('Sleep aborted before start')); }

    const timeoutId = setTimeout(resolve, ms);

    // التعامل مع الإلغاء أثناء الانتظار
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(signal.reason || new Error('Sleep aborted'));
      }, { once: true });
    }
  });
}




/**
 * @function اسم_الدالة
 * @description وصف مختصر لوظيفة الدالة.
 * @param {نوع_البيان} الاسم - وصف المعامل.
 * @param {نوع_البيان} الاسم - وصف المعامل.
 * @returns {نوع_البيان} - وصف النتيجة.
 * @example
 *   const result = myFunction(arg1, arg2);
 */

// #endregion
