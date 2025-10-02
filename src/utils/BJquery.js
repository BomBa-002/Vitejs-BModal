/**
 * Bquery - مكتبة JavaScript خفيفة الوزن وحديثة
 * نسخة مبسطة ومحسنة مستوحاة من jQuery
 * @version 1.0.0
 */

(function (global, factory) {
  // دعم كل من CommonJS و AMD و ES Modules والمتصفح
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.Bquery = global.$B = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  /**
   * الكلاس الأساسي لـ Bquery
   * يحتوي على جميع الدوال والميثودات
   */
  class Bquery {
    constructor(selector) {
      // إذا كان Selector عنصر DOM بالفعل
      if (selector instanceof Element) {
        this.elements = [selector];
      }
      // إذا كان NodeList أو Array
      else if (selector instanceof NodeList || Array.isArray(selector)) {
        this.elements = Array.from(selector);
      }
      // إذا كان string selector
      else if (typeof selector === 'string') {
        // التحقق من HTML string
        if (selector.trim().startsWith('<')) {
          this.elements = this._parseHTML(selector);
        } else {
          this.elements = Array.from(document.querySelectorAll(selector));
        }
      }
      // إذا كان دالة - تشغيلها عند جاهزية DOM
      else if (typeof selector === 'function') {
        this._ready(selector);
        this.elements = [];
      }
      // حالة افتراضية
      else {
        this.elements = [];
      }

      this.length = this.elements.length;
    }

    /**
     * تحويل HTML string إلى عناصر DOM
     */
    _parseHTML(html) {
      const temp = document.createElement('div');
      temp.innerHTML = html.trim();
      return Array.from(temp.children);
    }

    /**
     * تنفيذ دالة عند جاهزية DOM
     */
    _ready(callback) {
      if (document.readyState !== 'loading') {
        callback();
      } else {
        document.addEventListener('DOMContentLoaded', callback);
      }
    }

    // ==================== اختيار العناصر ====================

    /**
     * البحث عن عناصر فرعية داخل العناصر الحالية
     */
    find(selector) {
      const found = [];
      this.elements.forEach(el => {
        found.push(...el.querySelectorAll(selector));
      });
      return new Bquery(found);
    }

    /**
     * الحصول على العنصر الأب
     */
    parent() {
      const parents = this.elements.map(el => el.parentElement).filter(Boolean);
      return new Bquery([...new Set(parents)]);
    }

    /**
     * الحصول على جميع العناصر الأبناء المباشرين
     */
    children() {
      const children = [];
      this.elements.forEach(el => {
        children.push(...el.children);
      });
      return new Bquery(children);
    }

    /**
     * الحصول على عنصر بناءً على الفهرس
     */
    eq(index) {
      const el = this.elements[index];
      return el ? new Bquery(el) : new Bquery([]);
    }

    /**
     * إرجاع عنصر DOM الأصلي
     */
    get(index) {
      return index !== undefined ? this.elements[index] : this.elements;
    }

    /**
     * الحصول على العنصر الأول
     */
    first() {
      return this.eq(0);
    }

    /**
     * الحصول على العنصر الأخير
     */
    last() {
      return this.eq(this.length - 1);
    }

    /**
     * فلترة العناصر بناءً على selector أو دالة
     */
    filter(selector) {
      if (typeof selector === 'function') {
        return new Bquery(this.elements.filter(selector));
      }
      return new Bquery(this.elements.filter(el => el.matches(selector)));
    }

    // ==================== التلاعب بـ DOM ====================

    /**
     * الحصول على أو تعيين HTML الداخلي
     */
    html(content) {
      if (content === undefined) {
        return this.elements[0]?.innerHTML;
      }
      this.elements.forEach(el => (el.innerHTML = content));
      return this;
    }

    /**
     * الحصول على أو تعيين النص
     */
    text(content) {
      if (content === undefined) {
        return this.elements[0]?.textContent;
      }
      this.elements.forEach(el => (el.textContent = content));
      return this;
    }

    /**
     * إضافة محتوى في نهاية العنصر
     */
    append(content) {
      const nodes = this._getNodes(content);
      this.elements.forEach(el => {
        nodes.forEach(node => el.appendChild(node.cloneNode(true)));
      });
      return this;
    }

    /**
     * إضافة محتوى في بداية العنصر
     */
    prepend(content) {
      const nodes = this._getNodes(content);
      this.elements.forEach(el => {
        nodes.reverse().forEach(node => el.insertBefore(node.cloneNode(true), el.firstChild));
      });
      return this;
    }

    /**
     * إضافة العنصر قبل عنصر آخر
     */
    before(content) {
      const nodes = this._getNodes(content);
      this.elements.forEach(el => {
        nodes.forEach(node => el.parentNode?.insertBefore(node.cloneNode(true), el));
      });
      return this;
    }

    /**
     * إضافة العنصر بعد عنصر آخر
     */
    after(content) {
      const nodes = this._getNodes(content);
      this.elements.forEach(el => {
        nodes.forEach(node => el.parentNode?.insertBefore(node.cloneNode(true), el.nextSibling));
      });
      return this;
    }

    /**
     * حذف العناصر من DOM
     */
    remove() {
      this.elements.forEach(el => el.remove());
      return this;
    }

    /**
     * إفراغ محتويات العنصر
     */
    empty() {
      this.elements.forEach(el => (el.innerHTML = ''));
      return this;
    }

    /**
     * استنساخ العناصر
     */
    clone(deep = true) {
      const cloned = this.elements.map(el => el.cloneNode(deep));
      return new Bquery(cloned);
    }

    /**
     * استبدال العناصر بمحتوى آخر
     */
    replaceWith(content) {
      const nodes = this._getNodes(content);
      this.elements.forEach(el => {
        nodes.forEach(node => el.parentNode?.replaceChild(node.cloneNode(true), el));
      });
      return this;
    }

    /**
     * دالة مساعدة لتحويل المحتوى إلى عقد DOM
     */
    _getNodes(content) {
      if (content instanceof Bquery) {
        return content.elements;
      }
      if (content instanceof Element) {
        return [content];
      }
      if (typeof content === 'string') {
        if (content.trim().startsWith('<')) {
          return this._parseHTML(content);
        }
        const textNode = document.createTextNode(content);
        return [textNode];
      }
      return [];
    }

    // ==================== الكلاسات ====================

    /**
     * إضافة كلاس واحد أو أكثر
     */
    addClass(...classes) {
      this.elements.forEach(el => el.classList.add(...classes));
      return this;
    }

    /**
     * حذف كلاس واحد أو أكثر
     */
    removeClass(...classes) {
      if (classes.length === 0) {
        this.elements.forEach(el => (el.className = ''));
      } else {
        this.elements.forEach(el => el.classList.remove(...classes));
      }
      return this;
    }

    /**
     * التبديل بين إضافة وحذف الكلاس
     */
    toggleClass(className, state) {
      this.elements.forEach(el => el.classList.toggle(className, state));
      return this;
    }

    /**
     * التحقق من وجود كلاس
     */
    hasClass(className) {
      return this.elements.some(el => el.classList.contains(className));
    }

    // ==================== الخصائص والسمات ====================

    /**
     * الحصول على أو تعيين سمة (attribute)
     */
    attr(name, value) {
      if (typeof name === 'object') {
        Object.keys(name).forEach(key => {
          this.elements.forEach(el => el.setAttribute(key, name[key]));
        });
        return this;
      }
      if (value === undefined) {
        return this.elements[0]?.getAttribute(name);
      }
      this.elements.forEach(el => el.setAttribute(name, value));
      return this;
    }

    /**
     * حذف سمة
     */
    removeAttr(name) {
      this.elements.forEach(el => el.removeAttribute(name));
      return this;
    }

    /**
     * الحصول على أو تعيين خاصية (property)
     */
    prop(name, value) {
      if (typeof name === 'object') {
        Object.keys(name).forEach(key => {
          this.elements.forEach(el => (el[key] = name[key]));
        });
        return this;
      }
      if (value === undefined) {
        return this.elements[0]?.[name];
      }
      this.elements.forEach(el => (el[name] = value));
      return this;
    }

    /**
     * الحصول على أو تعيين قيمة الحقول
     */
    val(value) {
      if (value === undefined) {
        return this.elements[0]?.value;
      }
      this.elements.forEach(el => (el.value = value));
      return this;
    }

    /**
     * الحصول على أو تعيين data attributes
     */
    data(key, value) {
      if (key === undefined) {
        return this.elements[0]?.dataset;
      }
      if (typeof key === 'object') {
        Object.keys(key).forEach(k => {
          this.elements.forEach(el => (el.dataset[k] = key[k]));
        });
        return this;
      }
      if (value === undefined) {
        return this.elements[0]?.dataset[key];
      }
      this.elements.forEach(el => (el.dataset[key] = value));
      return this;
    }

    // ==================== الأنماط ====================

    /**
     * الحصول على أو تعيين أنماط CSS
     */
    css(property, value) {
      if (typeof property === 'object') {
        Object.keys(property).forEach(key => {
          this.elements.forEach(el => (el.style[key] = property[key]));
        });
        return this;
      }
      if (value === undefined) {
        return this.elements[0] ? getComputedStyle(this.elements[0])[property] : undefined;
      }
      this.elements.forEach(el => (el.style[property] = value));
      return this;
    }

    /**
     * إظهار العناصر
     */
    show(display = 'block') {
      this.elements.forEach(el => (el.style.display = display));
      return this;
    }

    /**
     * إخفاء العناصر
     */
    hide() {
      this.elements.forEach(el => (el.style.display = 'none'));
      return this;
    }

    /**
     * التبديل بين الإظهار والإخفاء
     */
    toggle(display = 'block') {
      this.elements.forEach(el => {
        el.style.display = el.style.display === 'none' ? display : 'none';
      });
      return this;
    }

    /**
     * تطبيق تأثير الظهور التدريجي
     */
    fadeIn(duration = 400) {
      this.elements.forEach(el => {
        el.style.opacity = '0';
        el.style.display = 'block';
        const start = performance.now();
        const animate = (time) => {
          const progress = (time - start) / duration;
          el.style.opacity = Math.min(progress, 1);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      });
      return this;
    }

    /**
     * تطبيق تأثير الاختفاء التدريجي
     */
    fadeOut(duration = 400) {
      this.elements.forEach(el => {
        const start = performance.now();
        const animate = (time) => {
          const progress = (time - start) / duration;
          el.style.opacity = 1 - Math.min(progress, 1);
          if (progress >= 1) el.style.display = 'none';
          else requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      });
      return this;
    }

    /**
     * الحصول على الأبعاد
     */
    width(value) {
      if (value === undefined) {
        return this.elements[0]?.offsetWidth;
      }
      this.css('width', typeof value === 'number' ? `${value}px` : value);
      return this;
    }

    height(value) {
      if (value === undefined) {
        return this.elements[0]?.offsetHeight;
      }
      this.css('height', typeof value === 'number' ? `${value}px` : value);
      return this;
    }

    /**
     * الحصول على الموضع
     */
    offset() {
      const el = this.elements[0];
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
      };
    }

    position() {
      const el = this.elements[0];
      return el ? { top: el.offsetTop, left: el.offsetLeft } : null;
    }

    // ==================== الأحداث ====================

    /**
     * إضافة مستمع للحدث
     */
    on(event, selector, handler) {
      // إذا لم يتم تمرير selector
      if (typeof selector === 'function') {
        handler = selector;
        selector = null;
      }

      this.elements.forEach(el => {
        if (selector) {
          // Event delegation
          const delegatedHandler = (e) => {
            const target = e.target.closest(selector);
            if (target && el.contains(target)) {
              handler.call(target, e);
            }
          };
          el.addEventListener(event, delegatedHandler);
          // حفظ المرجع للحذف لاحقاً
          if (!el._bqueryEvents) el._bqueryEvents = {};
          if (!el._bqueryEvents[event]) el._bqueryEvents[event] = [];
          el._bqueryEvents[event].push({ selector, handler, delegatedHandler });
        } else {
          el.addEventListener(event, handler);
          if (!el._bqueryEvents) el._bqueryEvents = {};
          if (!el._bqueryEvents[event]) el._bqueryEvents[event] = [];
          el._bqueryEvents[event].push({ handler });
        }
      });

      return this;
    }

    /**
     * حذف مستمع الحدث
     */
    off(event, selector, handler) {
      if (typeof selector === 'function') {
        handler = selector;
        selector = null;
      }

      this.elements.forEach(el => {
        if (!el._bqueryEvents || !el._bqueryEvents[event]) return;

        if (handler) {
          const events = el._bqueryEvents[event];
          const index = events.findIndex(e => e.handler === handler);
          if (index > -1) {
            const eventData = events[index];
            el.removeEventListener(event, eventData.delegatedHandler || handler);
            events.splice(index, 1);
          }
        } else {
          // حذف جميع المستمعين للحدث
          el._bqueryEvents[event].forEach(e => {
            el.removeEventListener(event, e.delegatedHandler || e.handler);
          });
          delete el._bqueryEvents[event];
        }
      });

      return this;
    }

    /**
     * إطلاق حدث مخصص
     */
    trigger(event, data) {
      const customEvent = new CustomEvent(event, { detail: data, bubbles: true });
      this.elements.forEach(el => el.dispatchEvent(customEvent));
      return this;
    }

    /**
     * دوال اختصار للأحداث الشائعة
     */
    click(handler) {
      return handler ? this.on('click', handler) : this.trigger('click');
    }

    change(handler) {
      return handler ? this.on('change', handler) : this.trigger('change');
    }

    submit(handler) {
      return handler ? this.on('submit', handler) : this.trigger('submit');
    }

    focus(handler) {
      return handler ? this.on('focus', handler) : this.trigger('focus');
    }

    blur(handler) {
      return handler ? this.on('blur', handler) : this.trigger('blur');
    }

    hover(handlerIn, handlerOut) {
      return this.on('mouseenter', handlerIn).on('mouseleave', handlerOut || handlerIn);
    }

    // ==================== Utilities ====================

    /**
     * تكرار على كل عنصر
     */
    each(callback) {
      this.elements.forEach((el, index) => callback.call(el, index, el));
      return this;
    }

    /**
     * تحويل العناصر باستخدام دالة
     */
    map(callback) {
      return this.elements.map((el, index) => callback.call(el, index, el));
    }

    /**
     * التحقق من وجود عناصر
     */
    is(selector) {
      return this.elements.some(el => el.matches(selector));
    }

    /**
     * التحقق من عدم وجود عناصر
     */
    not(selector) {
      return new Bquery(this.elements.filter(el => !el.matches(selector)));
    }

    /**
     * الحصول على الفهرس
     */
    index() {
      const el = this.elements[0];
      return el ? Array.from(el.parentNode.children).indexOf(el) : -1;
    }
  }

  // ==================== الدوال الثابتة ====================

  /**
   * دمج الكائنات (مشابه لـ Object.assign)
   */
  Bquery.extend = function (...objects) {
    return Object.assign({}, ...objects);
  };

  /**
   * التحقق من نوع البيانات
   */
  Bquery.type = function (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  };

  /**
   * التحقق من كون القيمة array
   */
  Bquery.isArray = Array.isArray;

  /**
   * التحقق من كون القيمة function
   */
  Bquery.isFunction = function (obj) {
    return typeof obj === 'function';
  };

  /**
   * التحقق من كون القيمة object عادي
   */
  Bquery.isPlainObject = function (obj) {
    return obj !== null && typeof obj === 'object' && obj.constructor === Object;
  };

  /**
   * طلبات AJAX مبسطة باستخدام fetch
   */
  Bquery.ajax = function (options) {
    const defaults = {
      url: '',
      method: 'GET',
      headers: {},
      data: null,
      contentType: 'application/json',
      dataType: 'json',
      success: () => {},
      error: () => {},
      complete: () => {},
    };

    const config = { ...defaults, ...options };

    // تحضير الـ headers
    const headers = new Headers(config.headers);
    if (config.contentType && config.method !== 'GET') {
      headers.set('Content-Type', config.contentType);
    }

    // تحضير الـ body
    let body = config.data;
    if (body && config.contentType === 'application/json') {
      body = JSON.stringify(body);
    }

    // تنفيذ الطلب
    return fetch(config.url, {
      method: config.method,
      headers: headers,
      body: config.method !== 'GET' ? body : undefined,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return config.dataType === 'json' ? response.json() : response.text();
      })
      .then(data => {
        config.success(data);
        return data;
      })
      .catch(error => {
        config.error(error);
        throw error;
      })
      .finally(() => {
        config.complete();
      });
  };

  /**
   * طلب GET مختصر
   */
  Bquery.get = function (url, data, success) {
    if (typeof data === 'function') {
      success = data;
      data = null;
    }
    const queryString = data ? '?' + new URLSearchParams(data).toString() : '';
    return Bquery.ajax({
      url: url + queryString,
      method: 'GET',
      success: success,
    });
  };

  /**
   * طلب POST مختصر
   */
  Bquery.post = function (url, data, success) {
    return Bquery.ajax({
      url: url,
      method: 'POST',
      data: data,
      success: success,
    });
  };

  /**
   * طلب JSON مختصر
   */
  Bquery.getJSON = function (url, data, success) {
    if (typeof data === 'function') {
      success = data;
      data = null;
    }
    return Bquery.get(url, data, success);
  };

  /**
   * تحليل JSON
   */
  Bquery.parseJSON = function (json) {
    return JSON.parse(json);
  };

  /**
   * تأخير التنفيذ
   */
  Bquery.delay = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  /**
   * Debounce - تأخير تنفيذ الدالة حتى انتهاء الاستدعاءات المتتالية
   */
  Bquery.debounce = function (func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  /**
   * Throttle - تحديد عدد مرات تنفيذ الدالة خلال فترة زمنية
   */
  Bquery.throttle = function (func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // ==================== الدوال الرئيسية للاختيار ====================

  /**
   * اختيار أول عنصر أو إنشاء instance من Bquery
   */
  function $B(selector) { return new Bquery(selector); }

  /**
   * اختيار جميع العناصر
   */
  function $$B(selector) { return new Bquery(selector); }

  // نسخ الدوال الثابتة إلى الدالة الرئيسية
  Object.keys(Bquery).forEach(key => {
    if (typeof Bquery[key] === 'function') {
      $B[key] = Bquery[key];
    }
  });

  // إرجاع الدالة الرئيسية
  $B.fn = Bquery.prototype;
  return $B;
});

// export { 
//   $B, $B as $, 
//   $$B, $$B as $$, 
  
//   Bquery, };