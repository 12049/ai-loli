/* File: results.js
   الوصف: هذا السكربت مخصص لصفحة الاختبار (quiz.html).
   يقوم بتحميل الأسئلة من ملف questions.json، 
   يعرض الأسئلة وخياراتها، ثم يحسب النتيجة ويعرضها.
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. قراءة معطيات الوحدة والدرس من رابط الصفحة (Query Params)
  const params         = new URLSearchParams(window.location.search);
  const unit           = params.get('unit');    // رقم الوحدة
  const lesson         = params.get('lesson');  // رقم الدرس

  // 2. عناصر DOM التي سنتفاعل معها
  const quizTitle      = document.getElementById('quiz-title');       // عنوان الاختبار
  const questionsArea  = document.getElementById('questions-container'); // حاوية الأسئلة
  const resultArea     = document.getElementById('result-container');    // حاوية النتيجة

  // 3. تحديد عنوان الصفحة بناءً على الوحدة والدرس
  quizTitle.textContent = `اختبار الوحدة ${unit} - الدرس ${lesson}`;

  // 4. جلب ملف الأسئلة JSON
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      // 5. مفتاح البحث في JSON: مثلاً "unit1_lesson2"
      const key       = `unit${unit}_lesson${lesson}`;
      const questions = data[key] || [];

      // 6. إذا لم توجد أسئلة، عرض رسالة وعدم متابعة
      if (questions.length === 0) {
        questionsArea.innerHTML = '<p>لا توجد أسئلة لهذا الاختبار.</p>';
        return;
      }

      // 7. إنشاء نموذج (form) ليحتوي الأسئلة وخياراتها
      const form = document.createElement('form');
      form.id = 'quiz-form';

      questions.forEach((q, index) => {
        // 7.1. حاوية السؤال الواحد
        const qDiv = document.createElement('div');
        qDiv.classList.add('question-item');

        // 7.2. نص السؤال
        const qText = document.createElement('p');
        qText.classList.add('question-text');
        qText.textContent = `${index + 1}. ${q.question}`;
        qDiv.appendChild(qText);

        // 7.3. إنشاء الخيارات (radiobutton)
        q.options.forEach((opt, optIndex) => {
          const optDiv = document.createElement('div');
          optDiv.classList.add('option-item');

          const input = document.createElement('input');
          input.type  = 'radio';
          input.name  = `question_${index}`;
          input.id    = `q${index}_opt${optIndex}`;
          input.value = optIndex; // قيمة الخيار تساوي رقم الفهرس

          const label = document.createElement('label');
          label.htmlFor   = input.id;
          label.textContent = opt;

          optDiv.appendChild(input);
          optDiv.appendChild(label);
          qDiv.appendChild(optDiv);
        });

        form.appendChild(qDiv);
      });

      // 8. إضافة زر إنهاء الاختبار
      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'انهاء الاختبار';
      submitBtn.classList.add('btn-submit');
      form.appendChild(submitBtn);

      questionsArea.appendChild(form);

      // 9. التعامل مع إرسال النموذج وحساب النتيجة
      form.addEventListener('submit', (e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        let correctCount = 0;
        questions.forEach((q, index) => {
          const selected = form[`question_${index}`].value;
          if (Number(selected) === q.answer) {
            correctCount++;
          }
        });

        const total     = questions.length;
        const percent   = Math.round((correctCount / total) * 100);

        // 10. عرض نتائج التصحيح
        resultArea.innerHTML = `
          <h2>نتيجة الاختبار</h2>
          <p>أجبت صحيحاً على ${correctCount} من أصل ${total} سؤال.</p>
          <p>النسبة المئوية: ${percent}%</p>
        `;
        // تمرير الشاشة إلى عرض النتيجة بسلاسة
        resultArea.scrollIntoView({ behavior: 'smooth' });
      });
    })
    .catch(error => {
      // 11. في حال فشل جلب ملف الأسئلة
      questionsArea.innerHTML = '<p>تعذر تحميل الأسئلة. حاول إعادة تحميل الصفحة.</p>';
      console.error('Error loading questions.json:', error);
    });