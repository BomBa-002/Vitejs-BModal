import './styles.scss';
// import './bmodal.js';
import BModal from './bmodal.js';
// إنشاء نافذة رئيسية
const modal1 = new BModal({
  title: 'Main Modal',
  content: 'Hello from BomBaModal ✨',
  closeOnOutside: true,
});

document.getElementById('open').addEventListener('click', () => {
  modal1.open();

  // نافذة فرعية داخلية بعد ثانيتين
  setTimeout(() => {
    const modal2 = new BModal({
      title: 'Nested Modal',
      content: 'This is a nested modal 🚀',
      closeOnOutside: false,
    });
    modal2.open();
  }, 2000);
});
