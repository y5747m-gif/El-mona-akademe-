// Simple localStorage store for full academy system
const STORAGE_KEYS = {
  STUDENTS: 'elmona_students',
  COURSES: 'elmona_courses',
  LIVE: 'elmona_live',
  ANNOUNCEMENTS: 'elmona_announcements',
  ATTENDANCE: 'elmona_attendance',
  MESSAGES: 'elmona_messages',
}

const defaultStudents = [
  { id: 'STU-2024-001', name: 'أحمد محمد السيد', email: 'ahmed@elmona.edu', phone: '01012345678', level: 'الثانوية العامة', group: 'المجموعة A - فيزياء', password: '123456', avatar: 'أح', status: 'نشط', joinDate: '2024-09-01', attendance: 94, avg: 87 },
  { id: 'STU-2024-002', name: 'سارة أحمد علي', email: 'sara@elmona.edu', phone: '01123456789', level: 'الصف الثالث الثانوي', group: 'المجموعة B - كيمياء', password: '123456', avatar: 'سا', status: 'نشط', joinDate: '2024-09-05', attendance: 98, avg: 92 },
  { id: 'STU-2024-003', name: 'محمد خالد حسن', email: 'mohamed@elmona.edu', phone: '01234567890', level: 'الصف الثاني الثانوي', group: 'المجموعة A - فيزياء', password: '123456', avatar: 'مح', status: 'نشط', joinDate: '2024-09-10', attendance: 88, avg: 79 },
  { id: 'STU-2024-004', name: 'نورا حسين إبراهيم', email: 'nora@elmona.edu', phone: '01512345678', level: 'الصف الأول الثانوي', group: 'المجموعة C - أحياء', password: '123456', avatar: 'نو', status: 'موقوف', joinDate: '2024-08-20', attendance: 72, avg: 68 },
  { id: 'STU-2024-005', name: 'عمر وليد منصور', email: 'omar@elmona.edu', phone: '01098765432', level: 'الثانوية العامة', group: 'المجموعة B - كيمياء', password: '123456', avatar: 'عم', status: 'نشط', joinDate: '2024-09-12', attendance: 96, avg: 90 },
]

const defaultCourses = [
  { id: 1, title: 'الفيزياء - الثانوية العامة', teacher: 'د. أحمد المنى', students: 124, price: 'مجاناً للمسجلين', level: 'متقدم', image: '⚛️', color: 'from-[#0B2447] to-[#19376D]', progress: 65 },
  { id: 2, title: 'الكيمياء العضوية', teacher: 'د. سارة المنى', students: 98, price: 'مجاناً للمسجلين', level: 'متوسط', image: '🧪', color: 'from-[#C5A253] to-[#D4AF37]', progress: 40 },
  { id: 3, title: 'الأحياء - المناعة', teacher: 'د. خالد المنى', students: 112, price: 'مجاناً للمسجلين', level: 'مبتدئ', image: '🧬', color: 'from-[#0E7490] to-[#06B6D4]', progress: 80 },
  { id: 4, title: 'الرياضيات - التفاضل', teacher: 'أ. محمد المنى', students: 156, price: 'مجاناً للمسجلين', level: 'متقدم', image: '📐', color: 'from-[#7C3AED] to-[#A855F7]', progress: 20 },
  { id: 5, title: 'اللغة العربية', teacher: 'أ. نورا فهمي', students: 87, price: 'مجاناً للمسجلين', level: 'متوسط', image: '📜', color: 'from-[#059669] to-[#10B981]', progress: 55 },
  { id: 6, title: 'اللغة الإنجليزية', teacher: 'Mr. Omar', students: 103, price: 'مجاناً للمسجلين', level: 'متوسط', image: '🇬🇧', color: 'from-[#DC2626] to-[#EF4444]', progress: 30 },
]

export function initStore() {
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(defaultStudents))
  }
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(defaultCourses))
  }
  if (!localStorage.getItem(STORAGE_KEYS.LIVE)) {
    localStorage.setItem(STORAGE_KEYS.LIVE, JSON.stringify({ isLive: false, title: '', startedAt: null, viewers: 0, chat: [], ownerStream: false }))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify([
      { id: 1, title: 'بدء المراجعة النهائية للثانوية العامة', date: '2026-09-10', important: true, content: 'تبدأ المراجعات النهائية يوم السبت القادم الساعة 8 مساءً بتوقيت القاهرة.' },
      { id: 2, title: 'جدول الحصص المباشرة - الأسبوع القادم', date: '2026-09-12', important: false, content: 'فيزياء - الإثنين 8م | كيمياء - الثلاثاء 8م | أحياء - الأربعاء 7م' },
    ]))
  }
}

export function getStudents() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]') } catch { return [] }
}
export function saveStudents(arr) { localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(arr)); window.dispatchEvent(new Event('students-updated')) }
export function getCourses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]') } catch { return [] }
}
export function saveCourses(arr) { localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(arr)) }
export function getLive() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE) || '{}') } catch { return { isLive: false } }
}
export function saveLive(obj) { localStorage.setItem(STORAGE_KEYS.LIVE, JSON.stringify(obj)); window.dispatchEvent(new Event('live-updated')) }
export function getAnnouncements() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]') } catch { return [] }
}
export function saveAnnouncements(arr) { localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(arr)) }

export const OWNER_CREDENTIALS = { email: 'owner@elmona.com', password: 'owner123', name: 'إدارة أكاديمية المنى', role: 'owner' }
