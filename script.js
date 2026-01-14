/* File: script.js
   الوصف: هذا السكربت يتحكم في عرض الأزرار لكل وحدة دراسية،
   إظهار دروس الوحدة المختارة، ويوجه المستخدم لصفحات الفيديو والاختبارات.
   ملاحظة: بيانات أسئلة الاختبارات محفوظة في ملف خارجي باسم questions.json
*/

document.addEventListener('DOMContentLoaded', () => {
  // حاوية أزرار الوحدات
  const unitsContainer   = document.getElementById('units-container');
  // حاوية قسم الدروس (مخفية افتراضياً)
  const lessonsContainer = document.getElementById('lessons-container');
  // عنصر العنوان المتغير لعرض رقم الوحدة
  const lessonsTitle     = document.getElementById('lessons-title');
  // الحاوية التي ستملأ بأزرار الدروس
  const lessonsList      = document.getElementById('lessons-list');

  // إضافة مستمع حدث للنقر على كل زر وحدة
  document.querySelectorAll('.unit-button').forEach(button => {
    button.addEventListener('click', () => {
      // نقرأ رقم الوحدة من الخاصية data-unit
      const unitNumber = button.dataset.unit;
      // نستدعي دالة إظهار الدروس ونمرر لها رقم الوحدة
      showLessons(unitNumber);
    });
  });

  /**
   * دالة لإخفاء أزرار الوحدات، وملء وعرض دروس الوحدة المختارة
   * @param {string} unitNumber رقم الوحدة (1 إلى 12)
   */
  function showLessons(unitNumber) {
    // أخفِّ قسم الوحدات
    unitsContainer.classList.add('hidden');

    // حدّث عنوان الدروس ليعرض رقم الوحدة الحالي
    lessonsTitle.textContent = `دروس الوحدة ${unitNumber}`;

    // نظّف الحاوية قبل إضافة الدروس الجديدة
    lessonsList.innerHTML = '';

    // أنشئ 10 دروس لكل وحدة
    for (let i = 1; i <= 10; i++) {
      // عنصر يحتوي على زرين: "الدرس" و"اختبار"
      const lessonItem = document.createElement('div');
      lessonItem.classList.add('lesson-item');

      // زر لفتح صفحة الفيديو الخاصة بالدرس
      const lessonBtn = document.createElement('button');
      lessonBtn.classList.add('lesson-button');
      lessonBtn.textContent = `الدرس ${i}`;
      lessonBtn.addEventListener('click', () => {
        // التوجيه لصفحة الفيديو مع تمرير الوحدة والدرس في عنوان URL
        window.location.href = `video.html?unit=${unitNumber}&lesson=${i}`;
      });

      // زر لفتح صفحة الاختبار الخاصة بالدرس
      const quizBtn = document.createElement('button');
      quizBtn.classList.add('lesson-button', 'quiz-button');
      quizBtn.textContent = 'اختبار';
      quizBtn.addEventListener('click', () => {
        // التوجيه لصفحة الاختبار مع تمرير الوحدة والدرس في عنوان URL
        window.location.href = `quiz.html?unit=${unitNumber}&lesson=${i}`;
      });

      // أضف الزرين إلى الحاوية ثم الحاوية إلى القائمة
      lessonItem.appendChild(lessonBtn);
      lessonItem.appendChild(quizBtn);
      lessonsList.appendChild(lessonItem);
    }

    // إظهار قسم الدروس بعد الإضافة
    lessonsContainer.classList.remove('hidden');
  }
});