// Google Apps Script Web App URL
// بعد نشر السكريبت في Google Sheets، ضع الرابط هنا
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby.../exec"; // استبدل هذا برابطك

// متغيرات DOM
const uploadForm = document.getElementById('uploadForm');
const imageUpload = document.getElementById('imageUpload');
const dropArea = document.getElementById('dropArea');
const fileInfo = document.getElementById('fileInfo');
const imagePreview = document.getElementById('imagePreview');
const commentInput = document.getElementById('comment');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');
const confirmationModal = document.getElementById('confirmationModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeModalSpan = document.querySelector('.close-modal');
const modalImagePreview = document.getElementById('modalImagePreview');
const modalCommentPreview = document.getElementById('modalCommentPreview');
const sheetLink = document.getElementById('sheetLink');
const totalSubmissionsEl = document.getElementById('totalSubmissions');
const lastSubmissionEl = document.getElementById('lastSubmission');
const imagesInVideoEl = document.getElementById('imagesInVideo');

// بيانات مؤقتة للتجربة (يتم استبدالها بالبيانات الفعلية من Google Sheets)
let submissionsData = {
    total: 42,
    lastDate: "2023-10-15",
    imagesInVideo: 15
};

// تهيئة عداد الأحرف
commentInput.addEventListener('input', () => {
    const length = commentInput.value.length;
    charCount.textContent = length;
    
    if (length > 200) {
        charCount.style.color = '#ff6b6b';
    } else {
        charCount.style.color = '#666';
    }
});

// التعامل مع سحب وإسقاط الملفات
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add('dragover');
}

function unhighlight() {
    dropArea.classList.remove('dragover');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    imageUpload.files = files;
    handleFiles(files);
}

// التعامل مع اختيار الملفات
imageUpload.addEventListener('change', function() {
    handleFiles(this.files);
});

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        
        // التحقق من نوع الملف
        if (!file.type.match('image.*')) {
            showStatus('يرجى اختيار ملف صورة فقط (JPG, PNG, GIF)', 'error');
            return;
        }
        
        // التحقق من حجم الملف (5MB كحد أقصى)
        if (file.size > 5 * 1024 * 1024) {
            showStatus('حجم الملف كبير جداً. الحد الأقصى 5MB', 'error');
            return;
        }
        
        // عرض معلومات الملف
        fileInfo.innerHTML = `
            <i class="fas fa-file-image"></i> ${file.name} 
            <span class="file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
        `;
        
        // عرض معاينة الصورة
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="معاينة الصورة">`;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// إظهار رسالة الحالة
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
}

// تحديث الإحصائيات
function updateStats() {
    totalSubmissionsEl.textContent = submissionsData.total;
    lastSubmissionEl.textContent = submissionsData.lastDate;
    imagesInVideoEl.textContent = submissionsData.imagesInVideo;
}

// إرسال النموذج إلى Google Sheets
uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // التحقق من وجود صورة
    if (!imageUpload.files || imageUpload.files.length === 0) {
        showStatus('يرجى اختيار صورة أولاً', 'error');
        return;
    }
    
    // التحقق من التعليق
    if (!commentInput.value.trim()) {
        showStatus('يرجى إضافة تعليق أو ملاحظة', 'error');
        return;
    }
    
    // التحقق من طول التعليق
    if (commentInput.value.length > 200) {
        showStatus('التعليق طويل جداً. الحد الأقصى 200 حرف', 'error');
        return;
    }
    
    // تعطيل زر الإرسال أثناء المعالجة
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    
    try {
        // في التطبيق الحقيقي، هنا سيتم رفع الصورة إلى خادم
        // وحاليا سنستخدم بيانات وهمية للتوضيح
        
        // محاكاة التأخير في الإرسال
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // إنشاء بيانات للإرسال
        const formData = new FormData();
        formData.append('image', imageUpload.files[0]);
        formData.append('comment', commentInput.value);
        formData.append('timestamp', new Date().toISOString());
        formData.append('filename', imageUpload.files[0].name);
        
        // إرسال البيانات إلى Google Sheets عبر Apps Script
        // في التطبيق الحقيقي، استخدم GOOGLE_SCRIPT_URL الفعلي
        console.log('إرسال البيانات إلى Google Sheets:', {
            filename: imageUpload.files[0].name,
            comment: commentInput.value,
            timestamp: new Date().toISOString()
        });
        
        // محاكاة الاستجابة من Google Sheets
        const mockResponse = {
            success: true,
            message: "تم حفظ البيانات بنجاح في Google Sheets",
            rowNumber: submissionsData.total + 1,
            sheetUrl: "https://docs.google.com/spreadsheets/d/1ABC.../edit"
        };
        
        // إظهار رسالة النجاح
        showStatus(mockResponse.message, 'success');
        
        // تحديث الإحصائيات
        submissionsData.total += 1;
        submissionsData.lastDate = new Date().toLocaleDateString('ar-SA');
        submissionsData.imagesInVideo += 1;
        updateStats();
        
        // عرض نافذة التأكيد
        const reader = new FileReader();
        reader.onload = function(e) {
            modalImagePreview.src = e.target.result;
            modalCommentPreview.textContent = commentInput.value;
            sheetLink.textContent = "Google Sheets - صف جديد #" + mockResponse.rowNumber;
            confirmationModal.style.display = 'flex';
        };
        reader.readAsDataURL(imageUpload.files[0]);
        
        // إعادة تعيين النموذج
        uploadForm.reset();
        fileInfo.innerHTML = '';
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
        charCount.textContent = '0';
        
    } catch (error) {
        console.error('خطأ في الإرسال:', error);
        showStatus('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى', 'error');
    } finally {
        // إعادة تفعيل زر الإرسال
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال للمشاركة في الفيديو';
    }
});

// إغلاق النافذة المنبثقة
closeModalBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
});

closeModalSpan.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
});

// إغلاق النافذة عند النقر خارجها
window.addEventListener('click', (e) => {
    if (e.target === confirmationModal) {
        confirmationModal.style.display = 'none';
    }
});

// تحديث الإحصائيات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    
    // إضافة بعض البيانات الوهمية للتجربة
    console.log('لإعداد Google Sheets:');
    console.log('1. افتح Google Sheets جديد');
    console.log('2. من القائمة: ملحقات > Apps Script');
    console.log('3. استبدل الكود بكود Google Apps Script المرفق');
    console.log('4. انشر التطبيق كتطبيق ويب');
    console.log('5. ضع الرابط في المتغير GOOGLE_SCRIPT_URL في الكود');
});
