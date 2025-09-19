import { Storage } from "./utils/BHelper.js";

// ملف: BModal.js
export default class BModal {
  /** قائمة النوافذ النشطة */
  static activeModals = [];

  constructor(options = {}) {
    // إنشاء معرف فريد
    this.id = options.id || `bmodal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // إعدادات افتراضية + دمج خيارات المستخدم
    this.options = Object.assign({
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
      title: {
        show: true,
        icon: { show: false, value: "" },
        text: { value: "Modal", align: "center" },
        closeBtn: { show: true, align: "right" },
        maximizeBtn: { show: true, align: "right" },
        minimizeBtn: { show: true, align: "right" },
        draggable: true,
        dblClickMaximize: true
      },
      body: {
        show: true,
        content: ``,
        scroll: "auto"
      },
      footer: {
        show: false,
        content: "",
        align: "center"
      }
    }, options);

    // حالات
    this.isMaximized = false;
    this.isDragging = false;
    this.position = { x: 0, y: 0 }; // لتخزين الموضع أثناء التحريك

    // إنشاء العناصر
    this._createModal();
    this._restoreState();
  }

  /** إنشاء الهيكل الأساسي */
  _createModal() {
    this.overlay = document.createElement("div");
    this.overlay.className = "bm-overlay";

    this.modal = document.createElement("div");
    this.modal.className = "bm-modal";
    this.modal.style.width = this.options.width;
    this.modal.style.height = this.options.height;

    // إضافة الأجزاء
    this._createHeader();
    this._createBody();
    this._createFooter();

    // التحكم في تغيير الحجم
    if (this.options.resizable) {
      this._addResizer();
    }

    this.overlay.appendChild(this.modal);

    // إغلاق عند الضغط على الخلفية
    if (this.options.overlay) {
      this.overlay.addEventListener("click", (e) => {
        if (this.options.closeOnOverlayClick && e.target === this.overlay) {
          this.close();
        }
      });
    }

    // إغلاق بالـ ESC → يغلق النافذة النشطة فقط
    if (this.options.closeOnEsc) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this._isActive()) {
          this.close();
        }
      });
    }
  }

  /** إنشاء الهيدر */
  _createHeader() {
    if (!this.options.title.show) return;

    this.header = document.createElement("div");
    this.header.className = "bm-header";

    // أيقونة
    if (this.options.title.icon.show) {
      const iconEl = document.createElement("span");
      iconEl.className = "bm-icon";
      iconEl.innerHTML = this.options.title.icon.value;
      this.header.appendChild(iconEl);
    }

    // العنوان
    const titleEl = document.createElement("span");
    titleEl.className = `bm-title align-${this.options.title.text.align}`;
    titleEl.textContent = this.options.title.text.value;
    this.header.appendChild(titleEl);

    // الأزرار
    if (this.options.title.minimizeBtn.show) {
      const minBtn = this._createBtn("—", "bm-minimize", () => this.minimize());
      this.header.appendChild(minBtn);
    }
    if (this.options.title.maximizeBtn.show) {
      const maxBtn = this._createBtn("⬜", "bm-maximize", () => this.toggleMaximize());
      this.header.appendChild(maxBtn);
    }
    if (this.options.title.closeBtn.show) {
      const closeBtn = this._createBtn("×", "bm-close", () => this.close());
      this.header.appendChild(closeBtn);
    }

    // سحب
    if (this.options.title.draggable) this._enableDrag();

    // دبل كليك للتكبير
    if (this.options.title.dblClickMaximize) {
      this.header.addEventListener("dblclick", () => this.toggleMaximize());
    }

    this.modal.appendChild(this.header);
  }

  /** إنشاء الجسم */
  _createBody() {
    if (!this.options.body.show) return;
    this.body = document.createElement("div");
    this.body.className = "bm-body";
    this.body.innerHTML = this.options.body.content;
    this.body.style.overflow = this.options.body.scroll;
    this.modal.appendChild(this.body);
  }

  /** إنشاء الفوتر */
  _createFooter() {
    if (!this.options.footer.show) return;
    this.footer = document.createElement("div");
    this.footer.className = `bm-footer align-${this.options.footer.align}`;
    this.footer.innerHTML = this.options.footer.content;
    this.modal.appendChild(this.footer);
  }

  /** إنشاء زر */
  _createBtn(label, className, onClick) {
    const btn = document.createElement("button");
    btn.className = `bm-btn ${className}`;
    btn.innerHTML = label;
    btn.addEventListener("click", onClick);
    return btn;
  }

  /** إضافة أداة تغيير الحجم */
  _addResizer() {
    this.resizer = document.createElement("div");
    this.resizer.className = "bm-resizer";
    this.modal.appendChild(this.resizer);
    this._enableResize();
  }

  /** فتح النافذة */
  open() {
    document.body.appendChild(this.overlay);
    BModal.activeModals.push(this);
    setTimeout(() => this.overlay.classList.add("bm-show"), 10);
    this._focus();
    this._saveState();
  }

  /** إغلاق النافذة */
  close() {
    this.overlay.classList.remove("bm-show");
    setTimeout(() => this.overlay.remove(), 300);
    BModal.activeModals = BModal.activeModals.filter(m => m !== this);
    Storage.remove(`settings.ModaleSetting.${this.id}`, "session")
  }

  /** تصغير */
  minimize() {
    this.modal.classList.toggle("bm-minimized");
    this._saveState();
  }

  /** تكبير */
  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
    this.modal.classList.toggle("bm-maximized");

    if (this.isMaximized) { this._disableDrag(); this._disableResize(); }
    else {
      if (this.options.title.draggable) this._enableDrag();
      if (this.options.resizable) this._enableResize();
    }
    this._saveState();
  }

  /** التركيز على النافذة */
  _focus() {
    BModal.activeModals.forEach(m => m.modal.classList.remove("bm-active"));
    this.modal.classList.add("bm-active");
  }

  /** التحقق إذا النافذة هي النشطة */
  _isActive() {
    return this.modal.classList.contains("bm-active");
  }

  /** سحب سلس */
  _enableDrag() {
    if (!this.header) return;
    let startX, startY;

    const mouseDown = (e) => {
      if (this.isMaximized) return;
      this.isDragging = true;
      startX = e.clientX - this.position.x;
      startY = e.clientY - this.position.y;
      this.modal.style.transition = "none";
      document.body.style.userSelect = "none";
    };

    const mouseMove = (e) => {
      if (!this.isDragging) return;
      this.position.x = e.clientX - startX;
      this.position.y = e.clientY - startY;
      this.modal.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    };

    const mouseUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.modal.style.transition = "transform 0.2s ease";
        document.body.style.userSelect = "auto";
        this._saveState();
      }
    };

    this.header.addEventListener("mousedown", mouseDown);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
  }
  _disableDrag() {
    this.isDragging = false;
  }

  /** تغيير الحجم */
  _enableResize() {
    let isResizing = false, startX, startY, startWidth, startHeight;

    this.resizer.addEventListener("mousedown", (e) => {
      if (this.isMaximized) return;
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = this.modal.offsetWidth;
      startHeight = this.modal.offsetHeight;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      let newWidth = startWidth + (e.clientX - startX);
      let newHeight = startHeight + (e.clientY - startY);

      const maxW = this._convertToPx(this.options.maxWidth, window.innerWidth);
      const maxH = this._convertToPx(this.options.maxHeight, window.innerHeight);
      const minW = this._convertToPx(this.options.minWidth, window.innerWidth);
      const minH = this._convertToPx(this.options.minHeight, window.innerHeight);

      newWidth = Math.min(Math.max(newWidth, minW), maxW);
      newHeight = Math.min(Math.max(newHeight, minH), maxH);

      this.modal.style.width = `${newWidth}px`;
      this.modal.style.height = `${newHeight}px`;
    });

    document.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        this._saveState();
      }
    });
  }
  _disableResize() {
    if (this.resizer) this.resizer.style.display = "none";
  }

  /** تحويل em/% إلى px */
  _convertToPx(value, parentSize) {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * parentSize;
    } else if (typeof value === "string" && value.includes("em")) {
      return parseFloat(value) * 16;
    }
    return parseFloat(value);
  }

  /** تخزين الحالة */
  _saveState() {
    if (!this.options.storage) return;
    const state = {
      width: this.modal.style.width,
      height: this.modal.style.height,
      position: this.position,
      isMaximized: this.isMaximized
    };
    Storage.set(`settings.ModaleSetting.${this.id}`, JSON.stringify(state), "session");
  }

  /** استرجاع الحالة */
  _restoreState() {
    if (!this.options.storage) return;
    const {data : saved} = Storage.get(`settings.ModaleSetting.${this.id}`, "session");
    console.log(saved);
    if (!saved) return;
    const state = JSON.parse(saved);

    if (state.width) this.modal.style.width = state.width;
    if (state.height) this.modal.style.height = state.height;
    if (state.position) {
      this.position = state.position;
      this.modal.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
    if (state.isMaximized) this.toggleMaximize();
  }
}
