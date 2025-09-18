// مكتبة BModal - BomBaModal
// ✅ كود ES6 نظيف + تعليقات بالعربية
// ✅ دعم النوافذ المتداخلة و خيارات التحكم

export default class BModal {
  static modalsStack = []; // لتتبع النوافذ المفتوحة (يسمح بالتداخل)

  constructor(options = {}) {
    // خيارات افتراضية
    this.options = Object.assign(
      {
        title: 'BomBa Modal',
        content: 'Hello World!',
        html: false,
        showTitle: true,
        showStatus: true,
        draggable: true,
        closeOnOutside: true, // ✨ جديد: إغلاق عند الضغط خارج
        width: '30em',
        height: '20em',
        direction: 'ltr', // en افتراضي
        themeVars: {},
      },
      options
    );

    this.modal = null;
    this.isOpen = false;
    this._init();
  }

  // 🏗️ إنشاء عناصر المودال
  _init() {
    this.modal = document.createElement('div');
    this.modal.classList.add('bm-modal');
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.style.width = this.options.width;
    this.modal.style.height = this.options.height;
    this.modal.dir = this.options.direction;

    // غطاء الخلفية
    this.overlay = document.createElement('div');
    this.overlay.classList.add('bm-overlay');

    // حاوية المودال
    const box = document.createElement('div');
    box.classList.add('bm-box');

    // شريط العنوان
    if (this.options.showTitle) {
      const header = document.createElement('div');
      header.classList.add('bm-header');
      header.textContent = this.options.title;

      // دعم السحب
      if (this.options.draggable) {
        this._makeDraggable(header, box);
      }

      box.appendChild(header);
    }

    // الجسم
    const body = document.createElement('div');
    body.classList.add('bm-body');
    if (this.options.html) {
      body.innerHTML = this.options.content; // ⚠️ خطر XSS، يجب التنظيف
    } else {
      body.textContent = this.options.content;
    }
    box.appendChild(body);

    // شريط الحالة
    if (this.options.showStatus) {
      const footer = document.createElement('div');
      footer.classList.add('bm-footer');
      footer.textContent = 'Status: Ready ✅';
      box.appendChild(footer);
    }

    this.modal.appendChild(box);

    // إغلاق عند الضغط خارج (اختياري)
    if (this.options.closeOnOutside) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
  }

  // 🖱️ جعل المودال قابل للسحب
  _makeDraggable(header, box) {
    let isDragging = false,
      startX,
      startY,
      initX,
      initY;

    header.style.cursor = 'move';
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = box.getBoundingClientRect();
      initX = rect.left;
      initY = rect.top;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      box.style.position = 'absolute';
      box.style.left = `${initX + dx}px`;
      box.style.top = `${initY + dy}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.userSelect = 'auto';
    });
  }

  // 🚀 فتح المودال
  open() {
    if (this.isOpen) return;
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.modal);
    BModal.modalsStack.push(this); // ✨ دعم النوافذ المتداخلة
    this.isOpen = true;
  }

  // ❌ إغلاق المودال
  close() {
    if (!this.isOpen) return;
    this.overlay.remove();
    this.modal.remove();
    BModal.modalsStack.pop(); // إزالة من الستاك
    this.isOpen = false;
  }

  // 🟢 تبديل (فتح/إغلاق)
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
}
