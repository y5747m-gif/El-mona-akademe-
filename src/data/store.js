// Simple localStorage store for full academy system - نسخة فارغة نظيفة
const STORAGE_KEYS = {
  STUDENTS: 'elmona_students',
  COURSES: 'elmona_courses',
  LIVE: 'elmona_live',
  ANNOUNCEMENTS: 'elmona_announcements',
  ATTENDANCE: 'elmona_attendance',
  MESSAGES: 'elmona_messages',
  VERSION: 'elmona_version',
}

// فارغ تماماً كما طلب المالك — سيضيف كل شيء بنفسه
const defaultStudents = []
const defaultCourses = []
const defaultAnnouncements = []

const CURRENT_VERSION = '2.0-empty'

export function initStore() {
  // إذا كان الإصدار القديم أو بيانات تجريبية موجودة، امسحها واجعل كل شيء فارغ
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
    // لا نمسح حالة البث والشات
    if (!localStorage.getItem(STORAGE_KEYS.LIVE)) {
      localStorage.setItem(STORAGE_KEYS.LIVE, JSON.stringify({ isLive: false, title: '', startedAt: null, viewers: 0, chat: [], ownerStream: false }))
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

// بيانات المالك — غير معروضة في الواجهة، فقط المالك يعرفها
export const OWNER_CREDENTIALS = { email: 'owner@elmona.com', password: 'owner123', name: 'إدارة أكاديمية المنى', role: 'owner' }
