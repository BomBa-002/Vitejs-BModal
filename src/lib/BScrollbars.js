/**
 * مكتبة BScrollbars - إصدار محسن ومطور
 * مكتبة مخصصة لأشرطة التمرير العائمة مع تحكم كامل في الخصائص
 * @version 1.0.0
 * @author مطور ويب
 */
import "./BScrollbars.css";

export class BScrollbars {
    /**
     * إنشاء مثيل جديد من BScrollbars
     * @param {HTMLElement} element - العنصر المستهدف لتطبيق أشرطة التمرير
     * @param {Object} options - خيارات التخصيص
     */
    constructor(element, options = {}) {
        // التحقق من صحة العنصر
        if (!element || !(element instanceof HTMLElement)) {
            throw new Error('عنصر غير صالح: يجب تمرير عنصر HTML صالح');
        }

        this.element = element;
        this.options = this._mergeDefaults(options);
        this.instance = null;
        this.scrollbars = {
            horizontal: null,
            vertical: null
        };
        this.autoHideTimeout = null;
        this.isSleeping = false;
        
        this._init();
    }

    /**
     * دمج الخيارات المحددة مع القيم الافتراضية
     * @private
     * @returns {Object} الخيارات المدمجة
     */
    _mergeDefaults(options) {
        const defaults = {
            size: {
                width: 12,
                height: 12
            },
            position: {
                x: 'right',
                y: 'bottom'
            },
            theme: 'bs-theme-dark',
            autoHide: 'scroll',
            autoHideDelay: 1300,
            visibility: 'auto',
            dragScroll: true,
            clickScroll: false,
            overflowBehavior: {
                x: 'scroll',
                y: 'scroll'
            }
        };

        return {
            ...defaults,
            ...options,
            size: { ...defaults.size, ...options.size },
            position: { ...defaults.position, ...options.position },
            overflowBehavior: { ...defaults.overflowBehavior, ...options.overflowBehavior }
        };
    }

    /**
     * تهيئة المكتبة وإنشاء أشرطة التمرير
     * @private
     */
    _init() {
        try {
            // إضافة الفئة الأساسية للعنصر
            this.element.classList.add('b-scrollbars-container');
            
            // إنشاء هيكل DOM لأشرطة التمرير
            this._createScrollbarStructure();
            
            // تهيئة أحداث أشرطة التمرير
            this._initEvents();
            
            // تحديث أشرطة التمرير بناءً على المحتوى
            this.update();
            
            console.log('✅ BScrollbars: تم التهيئة بنجاح');
        } catch (error) {
            console.error('❌ BScrollbars: خطأ في التهيئة', error);
        }
    }

    /**
     * إنشاء الهيكل DOM لأشرطة التمرير
     * @private
     */
    _createScrollbarStructure() {
        // إنشاء عنصر الـ viewport
        this.viewport = document.createElement('div');
        this.viewport.className = 'b-scrollbars-viewport';
        
        // نقل محتوى العنصر الأصلي إلى الـ viewport
        while (this.element.firstChild) {
            this.viewport.appendChild(this.element.firstChild);
        }
        
        // إضافة الـ viewport إلى العنصر الأصلي
        this.element.appendChild(this.viewport);
        
        // إنشاء أشرطة التمرير الأفقية والعمودية
        this._createHorizontalScrollbar();
        this._createVerticalScrollbar();
        
        // تطبيق التنسيقات المخصصة
        this._applyCustomStyles();
    }

    /**
     * إنشاء شريط التمرير الأفقي
     * @private
     */
    _createHorizontalScrollbar() {
        this.scrollbars.horizontal = document.createElement('div');
        this.scrollbars.horizontal.className = `b-scrollbar b-scrollbar-horizontal ${this.options.theme}`;
        
        this.scrollbars.horizontal.innerHTML = `
            <div class="b-scrollbar-track">
                <div class="b-scrollbar-handle"></div>
            </div>
        `;
        
        this.element.appendChild(this.scrollbars.horizontal);
    }

    /**
     * إنشاء شريط التمرير العمودي
     * @private
     */
    _createVerticalScrollbar() {
        this.scrollbars.vertical = document.createElement('div');
        this.scrollbars.vertical.className = `b-scrollbar b-scrollbar-vertical ${this.options.theme}`;
        
        this.scrollbars.vertical.innerHTML = `
            <div class="b-scrollbar-track">
                <div class="b-scrollbar-handle"></div>
            </div>
        `;
        
        this.element.appendChild(this.scrollbars.vertical);
    }

    /**
     * تطبيق التنسيقات المخصصة بناءً على الخيارات
     * @private
     */
    _applyCustomStyles() {
        // إزالة التنسيقات القديمة إذا كانت موجودة
        const oldStyle = document.getElementById('b-scrollbars-styles');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        const styles = `
            .b-scrollbar-horizontal {
                height: ${this.options.size.height}px;
                bottom: ${this.options.position.y === 'bottom' ? '0' : 'auto'};
                top: ${this.options.position.y === 'top' ? '0' : 'auto'};
            }
            
            .b-scrollbar-vertical {
                width: ${this.options.size.width}px;
                right: ${this.options.position.x === 'right' ? '0' : 'auto'};
                left: ${this.options.position.x === 'left' ? '0' : 'auto'};
            }
            
            .b-scrollbar-handle {
                min-width: ${this.options.size.width}px;
                min-height: ${this.options.size.height}px;
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'b-scrollbars-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    /**
     * تهيئة الأحداث والتفاعلات
     * @private
     */
    _initEvents() {
        // حدث التمرير للعنصر الرئيسي
        this.viewport.addEventListener('scroll', () => this._handleScroll());
        
        // أحداث السحب لأشرطة التمرير
        this._initDragEvents();
        
        // أحداث إخفاء أشرطة التمرير تلقائياً
        if (this.options.autoHide !== 'never') {
            this._initAutoHideEvents();
        }
        
        // حدث redimensionnement النافذة
        window.addEventListener('resize', () => this.update());
    }

    /**
     * تهيئة أحداث السحب لأشرطة التمرير
     * @private
     */
    _initDragEvents() {
        if (this.options.dragScroll) {
            const verticalHandle = this.scrollbars.vertical.querySelector('.b-scrollbar-handle');
            const horizontalHandle = this.scrollbars.horizontal.querySelector('.b-scrollbar-handle');
            
            if (verticalHandle) {
                verticalHandle.addEventListener('mousedown', this._startDrag.bind(this, 'vertical'));
            }
            
            if (horizontalHandle) {
                horizontalHandle.addEventListener('mousedown', this._startDrag.bind(this, 'horizontal'));
            }
        }
    }

    /**
     * بدء عملية سحب شريط التمرير
     * @private
     * @param {string} orientation - اتجاه شريط التمرير (عمودي أو أفقي)
     * @param {Event} e - حدث الماوس
     */
    _startDrag(orientation, e) {
        e.preventDefault();
        e.stopPropagation();
        
        const handle = e.target;
        const track = handle.parentElement;
        const isVertical = orientation === 'vertical';
        
        const startPos = e[isVertical ? 'clientY' : 'clientX'];
        const startScroll = this.viewport[isVertical ? 'scrollTop' : 'scrollLeft'];
        const trackRect = track.getBoundingClientRect();
        const handleRect = handle.getBoundingClientRect();
        
        const maxScroll = isVertical 
            ? this.viewport.scrollHeight - this.viewport.clientHeight
            : this.viewport.scrollWidth - this.viewport.clientWidth;
        
        const trackSize = isVertical ? trackRect.height : trackRect.width;
        const handleSize = isVertical ? handleRect.height : handleRect.width;
        
        const scrollRatio = maxScroll / Math.max(1, (trackSize - handleSize));
        
        // دالة السحب
        const doDrag = (moveEvent) => {
            const currentPos = moveEvent[isVertical ? 'clientY' : 'clientX'];
            const delta = (currentPos - startPos) * scrollRatio;
            const newScroll = startScroll + delta;
            
            this.viewport[isVertical ? 'scrollTop' : 'scrollLeft'] = Math.max(0, Math.min(maxScroll, newScroll));
        };
        
        // دالة إيقاف السحب
        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.body.style.removeProperty('user-select');
            document.body.style.removeProperty('cursor');
        };
        
        document.body.style.userSelect = 'none';
        document.body.style.cursor = isVertical ? 'ns-resize' : 'ew-resize';
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    }

    /**
     * التعامل مع حدث التمرير وتحديث واجهة المستخدم
     * @private
     */
    _handleScroll() {
        this._updateScrollbarHandles();
        
        // إظهار أشرطة التمرير مؤقتاً عند التمرير
        if (this.options.autoHide === 'scroll') {
            this._showTemporarily();
        }
    }

    /**
     * تحديث مقابض أشرطة التمرير بناءً على موضع التمرير
     * @private
     */
    _updateScrollbarHandles() {
        const { scrollTop, scrollLeft, clientHeight, clientWidth, scrollHeight, scrollWidth } = this.viewport;
        
        // تحديث الشريط العمودي
        const verticalHandle = this.scrollbars.vertical.querySelector('.b-scrollbar-handle');
        const verticalTrack = this.scrollbars.vertical.querySelector('.b-scrollbar-track');
        
        if (verticalHandle && verticalTrack) {
            const verticalTrackHeight = verticalTrack.clientHeight;
            const verticalRatio = clientHeight / Math.max(1, scrollHeight);
            const verticalHandleHeight = Math.max(verticalRatio * verticalTrackHeight, this.options.size.height * 2);
            const verticalMaxScroll = Math.max(1, scrollHeight - clientHeight);
            const verticalHandlePosition = (scrollTop / verticalMaxScroll) * (verticalTrackHeight - verticalHandleHeight);
            
            verticalHandle.style.height = `${verticalHandleHeight}px`;
            verticalHandle.style.transform = `translateY(${verticalHandlePosition}px)`;
        }
        
        // تحديث الشريط الأفقي
        const horizontalHandle = this.scrollbars.horizontal.querySelector('.b-scrollbar-handle');
        const horizontalTrack = this.scrollbars.horizontal.querySelector('.b-scrollbar-track');
        
        if (horizontalHandle && horizontalTrack) {
            const horizontalTrackWidth = horizontalTrack.clientWidth;
            const horizontalRatio = clientWidth / Math.max(1, scrollWidth);
            const horizontalHandleWidth = Math.max(horizontalRatio * horizontalTrackWidth, this.options.size.width * 2);
            const horizontalMaxScroll = Math.max(1, scrollWidth - clientWidth);
            const horizontalHandlePosition = (scrollLeft / horizontalMaxScroll) * (horizontalTrackWidth - horizontalHandleWidth);
            
            horizontalHandle.style.width = `${horizontalHandleWidth}px`;
            horizontalHandle.style.transform = `translateX(${horizontalHandlePosition}px)`;
        }
    }

    /**
     * إظهار أشرطة التمرير مؤقتاً
     * @private
     */
    _showTemporarily() {
        this.element.classList.add('b-scrollbars-visible');
        
        if (this.autoHideTimeout) {
            clearTimeout(this.autoHideTimeout);
        }
        
        this.autoHideTimeout = setTimeout(() => {
            if (this.options.autoHide === 'scroll') {
                this.element.classList.remove('b-scrollbars-visible');
            }
        }, this.options.autoHideDelay);
    }

    /**
     * تهيئة أحداث الإخفاء التلقائي
     * @private
     */
    _initAutoHideEvents() {
        this.element.addEventListener('mouseenter', () => {
            this.element.classList.add('b-scrollbars-visible');
        });
        
        this.element.addEventListener('mouseleave', () => {
            if (this.options.autoHide === 'leave') {
                this.element.classList.remove('b-scrollbars-visible');
            }
        });
    }

    // ========== الواجهة البرمجية العامة ==========

    /**
     * تحديث حالة أشرطة التمرير (مفيد عند تغيير المحتوى ديناميكياً)
     * @public
     */
    update() {
        if (this.isSleeping) return;
        
        try {
            this._updateScrollbarHandles();
            
            // إظهار/إخفاء أشرطة التمرير بناءً على الحاجة
            const needsVertical = this.viewport.scrollHeight > this.viewport.clientHeight;
            const needsHorizontal = this.viewport.scrollWidth > this.viewport.clientWidth;
            
            this.scrollbars.vertical.style.display = needsVertical ? 'block' : 'none';
            this.scrollbars.horizontal.style.display = needsHorizontal ? 'block' : 'none';
            
            console.log('🔄 BScrollbars: تم التحديث');
        } catch (error) {
            console.error('❌ BScrollbars: خطأ في التحديث', error);
        }
    }

    /**
     * تعطيل أشرطة التمرير مؤقتاً
     * @public
     */
    sleep() {
        this.isSleeping = true;
        this.element.classList.add('b-scrollbars-sleeping');
        console.log('💤 BScrollbars: وضع السكون مفعل');
    }

    /**
     * إعادة تفعيل أشرطة التمرير
     * @public
     */
    wake() {
        this.isSleeping = false;
        this.element.classList.remove('b-scrollbars-sleeping');
        this.update();
        console.log('✅ BScrollbars: تم إعادة التفعيل');
    }

    /**
     * الحصول على معلومات التمرير الحالية
     * @public
     * @returns {Object} معلومات التمرير
     */
    getScrollInfo() {
        return {
            x: {
                position: this.viewport.scrollLeft,
                max: Math.max(0, this.viewport.scrollWidth - this.viewport.clientWidth),
                percentage: this.viewport.scrollLeft / Math.max(1, this.viewport.scrollWidth - this.viewport.clientWidth)
            },
            y: {
                position: this.viewport.scrollTop,
                max: Math.max(0, this.viewport.scrollHeight - this.viewport.clientHeight),
                percentage: this.viewport.scrollTop / Math.max(1, this.viewport.scrollHeight - this.viewport.clientHeight)
            },
            element: {
                scrollWidth: this.viewport.scrollWidth,
                scrollHeight: this.viewport.scrollHeight,
                clientWidth: this.viewport.clientWidth,
                clientHeight: this.viewport.clientHeight
            }
        };
    }

    /**
     * التمرير إلى موضع معين
     * @public
     * @param {number|Object} options - موضع التمرير أو كائن خيارات
     * @param {number} duration - مدة الحركة (بالميلي ثانية)
     */
    scrollTo(options, duration = 300) {
        let targetX, targetY;
        
        if (typeof options === 'object') {
            targetX = options.x !== undefined ? options.x : this.viewport.scrollLeft;
            targetY = options.y !== undefined ? options.y : this.viewport.scrollTop;
        } else {
            targetY = options;
            targetX = this.viewport.scrollLeft;
        }
        
        this._animateScroll(targetX, targetY, duration);
    }

    /**
     * تحريك التمرير بشكل سلس
     * @private
     * @param {number} targetX - الموضع الأفقي الهدف
     * @param {number} targetY - الموضع العمودي الهدف
     * @param {number} duration - مدة الحركة
     */
    _animateScroll(targetX, targetY, duration) {
        const startX = this.viewport.scrollLeft;
        const startY = this.viewport.scrollTop;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // استخدام دالة التسهيل (easing function)
            const ease = this._easeInOutCubic(progress);
            
            this.viewport.scrollLeft = startX + (targetX - startX) * ease;
            this.viewport.scrollTop = startY + (targetY - startY) * ease;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * دالة التسهيل للحركات السلسة
     * @private
     * @param {number} t - القيمة الزمنية (0-1)
     * @returns {number} القيمة المعدلة
     */
    _easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * تعيين حجم جديد لأشرطة التمرير
     * @public
     * @param {number|Object} size - الحجم الجديد
     */
    setSize(size) {
        if (typeof size === 'object') {
            this.options.size = { ...this.options.size, ...size };
        } else {
            this.options.size = { width: size, height: size };
        }
        
        this._applyCustomStyles();
        this.update();
        console.log('📏 BScrollbars: تم تحديث الحجم', this.options.size);
    }

    /**
     * تعيين موضع جديد لأشرطة التمرير
     * @public
     * @param {Object} position - الموضع الجديد
     */
    setPosition(position) {
        this.options.position = { ...this.options.position, ...position };
        this._applyCustomStyles();
        console.log('📍 BScrollbars: تم تحديث الموضع', this.options.position);
    }

    /**
     * تغيير سمة شريط التمرير
     * @public
     * @param {string} theme - اسم السمة الجديدة
     */
    setTheme(theme) {
        // إزالة السمة القديمة
        this.scrollbars.horizontal.classList.remove(this.options.theme);
        this.scrollbars.vertical.classList.remove(this.options.theme);
        
        // تطبيق السمة الجديدة
        this.options.theme = theme;
        this.scrollbars.horizontal.classList.add(theme);
        this.scrollbars.vertical.classList.add(theme);
        
        console.log('🎨 BScrollbars: تم تغيير السمة إلى', theme);
    }

    /**
     * الحصول على الخيارات الحالية
     * @public
     * @returns {Object} الخيارات الحالية
     */
    getOptions() {
        return { ...this.options };
    }

    /**
     * إعادة تعيين الخيارات إلى القيم الافتراضية
     * @public
     */
    reset() {
        this.options = this._mergeDefaults({});
        this._applyCustomStyles();
        this.update();
        console.log('🔄 BScrollbars: تم إعادة التعيين');
    }

    /**
     * تدمير المكتبة وإزالة جميع العناصر المضافة
     * @public
     */
    destroy() {
        try {
            // إزالة المهلات
            if (this.autoHideTimeout) {
                clearTimeout(this.autoHideTimeout);
            }
            
            // إزالة أشرطة التمرير
            if (this.scrollbars.horizontal) {
                this.scrollbars.horizontal.remove();
            }
            if (this.scrollbars.vertical) {
                this.scrollbars.vertical.remove();
            }
            
            // استعادة المحتوى الأصلي
            if (this.viewport) {
                while (this.viewport.firstChild) {
                    this.element.appendChild(this.viewport.firstChild);
                }
                this.viewport.remove();
            }
            
            // إزالة التنسيقات المخصصة
            const styleElement = document.getElementById('b-scrollbars-styles');
            if (styleElement) {
                styleElement.remove();
            }
            
            // إزالة الفئات المضافة
            this.element.classList.remove('b-scrollbars-container', 'b-scrollbars-visible', 'b-scrollbars-sleeping');
            
            console.log('🗑️ BScrollbars: تم التدمير');
        } catch (error) {
            console.error('❌ BScrollbars: خطأ في التدمير', error);
        }
    }
}

// جعل المكتبة متاحة عالمياً مع التحقق من عدم وجود تضارب
if (typeof window !== 'undefined' && !window.BScrollbars) {
    window.BScrollbars = BScrollbars;
}

// تصدير المكتبة للاستخدام في أنظمة الموديولات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BScrollbars;
}