// نظام التحديث التلقائي للموقع
// المشكلة: بعد نشر أي تحديث، المتصفح يفتح النسخة القديمة من الكاش ولا يظهر التحديث إلا بعد ريفرش يدوي
// الحل: الموقع يفحص دورياً نسخة index.html المنشورة على السيرفر،
// ولو وجد نسخة جديدة (هاش ملفات مختلف) يحدّث نفسه تلقائياً بدون أي تدخل من المستخدم

const CHECK_INTERVAL_MS = 90 * 1000 // فحص كل دقيقة ونصف
const INITIAL_CHECK_DELAY_MS = 4000 // أول فحص بعد 4 ثواني من فتح الموقع
const RETRY_GUARD_KEY = 'elmona_asset_retry'

let toastEl = null
let checking = false
let started = false

// هل الموقع شغال في وضع التطوير؟ (في التطوير Vite HMR يتكفل بالتحديث الحي تلقائياً)
function isDev() {
  const scripts = document.querySelectorAll('script[type="module"][src]')
  for (const s of scripts) {
    const src = s.getAttribute('src') || ''
    if (src.startsWith('/src/') || src.startsWith('/@')) return true
  }
  return false
}

// بصمة النسخة الحالية = مسار ملف الجافاسكريبت + مسار ملف الستايل (فيهم هاش يتغير مع كل تحديث)
function currentSignature() {
  const script = document.querySelector('script[type="module"][src]')
  const css = document.querySelector('link[rel="stylesheet"]')
  return (script?.getAttribute('src') || '') + '|' + (css?.getAttribute('href') || '')
}

// استخراج نفس البصمة من صفحة index.html المنشورة على السيرفر
function signatureFromHtml(html) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const script = doc.querySelector('script[type="module"][src]')
    const css = doc.querySelector('link[rel="stylesheet"]')
    return (script?.getAttribute('src') || '') + '|' + (css?.getAttribute('href') || '')
  } catch {
    return null
  }
}

async function fetchRemoteSignature() {
  try {
    //?t= لتكسير الكاش والتأكد إننا بناخد أحدث نسخة من السيرفر مش من ذاكرة المتصفح
    const res = await fetch(`/index.html?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return null
    const html = await res.text()
    return signatureFromHtml(html)
  } catch {
    return null
  }
}

// هل المستخدم بيكتب في فورم دلوقتي؟ (عشان ما نمسحش كلامه مع التحديث التلقائي)
function isFormActive() {
  const el = document.activeElement
  if (!el) return false
  const tag = (el.tagName || '').toUpperCase()
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true
}

function reloadNow() {
  try { sessionStorage.setItem(RETRY_GUARD_KEY, '1') } catch {}
  location.reload()
}

// إشعار عربي بسيط وأنيق يظهر أسفل الشاشة
function showUpdateToast(auto) {
  if (toastEl) return
  toastEl = document.createElement('div')
  toastEl.dir = 'rtl'
  Object.assign(toastEl.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '2147483647',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, #0B2447, #19376D)',
    color: '#fff',
    borderRadius: '999px',
    padding: '12px 22px',
    fontFamily: 'inherit',
    boxShadow: '0 12px 36px rgba(11,36,71,0.45)',
    border: '1px solid rgba(197,162,83,0.55)',
    fontSize: '14px',
    fontWeight: '800',
    direction: 'rtl',
    maxWidth: '92vw',
  })

  const text = document.createElement('span')
  text.textContent = auto ? '✨ يوجد تحديث جديد — جارٍ تحديث الموقع...' : '✨ يوجد تحديث جديد للموقع'
  toastEl.appendChild(text)

  // لو المستخدم بيكتب في فورم، منستنيةش عليه — نسيبه يحدّث بنفسه لما يخلص
  if (!auto) {
    const btn = document.createElement('button')
    btn.textContent = 'تحديث الآن'
    Object.assign(btn.style, {
      background: 'linear-gradient(135deg, #C5A253, #D4AF37)',
      color: '#fff',
      border: 'none',
      borderRadius: '999px',
      padding: '8px 18px',
      fontSize: '13px',
      fontWeight: '900',
      cursor: 'pointer',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    })
    btn.onclick = reloadNow
    toastEl.appendChild(btn)
  }

  document.body.appendChild(toastEl)
}

function handleNewVersion() {
  const hidden = document.visibilityState === 'hidden'
  if (hidden || !isFormActive()) {
    // التاب مخفي أو مفيش كتابة في فورم — التحديث فوري وآمن
    if (!hidden) showUpdateToast(true)
    setTimeout(reloadNow, hidden ? 0 : 1800)
  } else {
    showUpdateToast(false)
  }
}

async function checkForUpdate() {
  if (checking || toastEl) return
  checking = true
  try {
    const [remote] = await Promise.all([fetchRemoteSignature()])
    const current = currentSignature()
    if (remote && current && remote !== current) handleNewVersion()
  } catch {
  } finally {
    checking = false
  }
}

export function startAutoUpdate() {
  if (started) return
  started = true

  // الموقع اشتغل بنجاح — نمسح علامة إعادة المحاولة بتاعة الحارس في index.html
  try { sessionStorage.removeItem(RETRY_GUARD_KEY) } catch {}

  // لو فشل تحميل أي جزء من الموقع داخلياً — نعمل ريفرش مرة واحدة فقط (بدون حلقات لا نهائية)
  window.addEventListener('vite:preloadError', () => {
    try {
      if (!sessionStorage.getItem(RETRY_GUARD_KEY)) reloadNow()
    } catch {}
  })

  // في وضع التطوير لا نحتاج الفحص — Vite HMR يحدث الصفحة لحظياً
  if (isDev()) return

  setTimeout(checkForUpdate, INITIAL_CHECK_DELAY_MS)
  setInterval(checkForUpdate, CHECK_INTERVAL_MS)

  // فحص فوري لما المستخدم يرجع للتاب أو يركز على الصفحة
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate()
  })
  window.addEventListener('focus', checkForUpdate)
}
