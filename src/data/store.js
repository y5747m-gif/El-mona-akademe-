// Simple localStorage store for full academy system - نسخة فارغة نظيفة
const STORAGE_KEYS = {
  STUDENTS: 'elmona_students',
  COURSES: 'elmona_courses',
  LIVE: 'elmona_live',
  ANNOUNCEMENTS: 'elmona_announcements',
  ATTENDANCE: 'elmona_attendance',
  MESSAGES: 'elmona_messages',
  VERSION: 'elmona_version',
  LOGIN_LOGS: 'elmona_login_logs',
}

// أرقام التواصل الرسمية للأكاديمية
export const CONTACT_NUMBERS = {
  etisalat: { display: '+20 11 4075 2330', raw: '201140752330', name: 'اتصالات' },
  vodafone: { display: '+20 10 6124 0956', raw: '201061240956', name: 'فودافون' },
}

// فارغ تماماً كما طلب المالك — سيضيف كل شيء بنفسه
const defaultStudents = []
const defaultCourses = []
const defaultAnnouncements = []

const CURRENT_VERSION = '2.0-empty'

export function initStore() {
  const ver = localStorage.getItem(STORAGE_KEYS.VERSION)
  const hasOldDemo = (() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]')
      return s.some(x => String(x.id || '').startsWith('STU-2024-'))
    } catch { return false }
  })()

  if (ver !== CURRENT_VERSION || hasOldDemo) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(defaultStudents))
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(defaultCourses))
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(defaultAnnouncements))
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION)
    if (!localStorage.getItem(STORAGE_KEYS.LIVE)) {
      localStorage.setItem(STORAGE_KEYS.LIVE, JSON.stringify({ isLive: false, title: '', startedAt: null, viewers: 0, chat: [], ownerStream: false }))
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOGIN_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.LOGIN_LOGS, JSON.stringify([]))
    }
    return
  }

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
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(defaultAnnouncements))
  }
  if (!localStorage.getItem(STORAGE_KEYS.VERSION)) {
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION)
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOGIN_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.LOGIN_LOGS, JSON.stringify([]))
  }
}

export function getStudents() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]') } catch { return [] }
}
export function saveStudents(arr) { localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(arr)); window.dispatchEvent(new Event('students-updated')) }
export function getCourses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]') } catch { return [] }
}
export function saveCourses(arr) { localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(arr)); window.dispatchEvent(new Event('courses-updated')) }
export function getLive() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE) || '{}') } catch { return { isLive: false } }
}
export function saveLive(obj) { localStorage.setItem(STORAGE_KEYS.LIVE, JSON.stringify(obj)); window.dispatchEvent(new Event('live-updated')) }
export function getAnnouncements() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]') } catch { return [] }
}
export function saveAnnouncements(arr) { localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(arr)); window.dispatchEvent(new Event('announcements-updated')) }

export function getLoginLogs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGIN_LOGS) || '[]') } catch { return [] }
}
export function addLoginLog(entry) {
  const logs = getLoginLogs()
  logs.unshift(entry)
  localStorage.setItem(STORAGE_KEYS.LOGIN_LOGS, JSON.stringify(logs.slice(0, 200)))
}

// إرسال بيانات الطالب لواتساب الإدارة (يفتح واتساب مع رسالة جاهزة)
export function buildStudentLoginMessage(student) {
  const now = new Date().toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })
  return `🔔 *تسجيل دخول طالب - أكاديمية المنى*\n` +
    `━━━━━━━━━━━━━━━\n` +
    `👤 *الاسم:* ${student.name}\n` +
    `🆔 *الكود:* ${student.id}\n` +
    `📧 *الإيميل:* ${student.email}\n` +
    `📱 *الهاتف:* ${student.phone}\n` +
    `🎓 *المرحلة:* ${student.level}\n` +
    `👥 *المجموعة:* ${student.group}\n` +
    `📊 *الحالة:* ${student.status} | حضور ${student.attendance}% | معدل ${student.avg}%\n` +
    `🕐 *وقت الدخول:* ${now}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `تم تسجيل الدخول عبر منصة أكاديمية المنى الإلكترونية.`
}

export function getWhatsAppLinksForStudent(student) {
  const msg = encodeURIComponent(buildStudentLoginMessage(student))
  return {
    etisalat: `https://wa.me/${CONTACT_NUMBERS.etisalat.raw}?text=${msg}`,
    vodafone: `https://wa.me/${CONTACT_NUMBERS.vodafone.raw}?text=${msg}`,
  }
}

// بيانات المالك — غير معروضة في الواجهة، فقط المالك يعرفها
export const OWNER_CREDENTIALS = { email: 'owner@elmona.com', password: 'owner123', name: 'إدارة أكاديمية المنى', role: 'owner' }
