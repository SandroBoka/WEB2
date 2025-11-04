import { Router } from 'express'
import { state, log } from '../state'
import { getCurrentUser } from '../user'
import { setSessionCookies } from '../cookies'

export const securityRouter = Router()

// Pomoćna: health (ostaje ti i tvoj /api/health)
securityRouter.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Pročitaj trenutno stanje (za frontend)
securityRouter.get('/api/state', (req, res) => {
  const me = getCurrentUser(req)
  res.json({
    xssEnabled: state.xssEnabled,
    bacEnabled: state.bacEnabled,
    messages: state.messages,
    logs: state.logs,
    me
  })
})

// Uključi/isključi ranjivosti
securityRouter.post('/api/toggle', (req, res) => {
  const { xssEnabled, bacEnabled } = req.body ?? {}
  if (typeof xssEnabled === 'boolean') state.xssEnabled = xssEnabled
  if (typeof bacEnabled === 'boolean') state.bacEnabled = bacEnabled
  log(`Toggles -> XSS=${state.xssEnabled ? 'ON':'OFF'}, BAC=${state.bacEnabled ? 'ON':'OFF'}`)
  res.json({ ok: true, state: { xssEnabled: state.xssEnabled, bacEnabled: state.bacEnabled } })
})

// XSS: spremi poruku (kasnije će se renderirati escaped/ne-escaped u Reactu)
securityRouter.post('/api/xss', (req, res) => {
  const msg = (req.body?.message ?? '').toString()
  state.messages.unshift(msg)
  state.messages = state.messages.slice(0, 12)
  log(`XSS input: ${msg}`)
  res.json({ ok: true })
})

// Demo login
securityRouter.post('/api/login', (req, res) => {
  const { username, password } = req.body ?? {}
  let ok = false, role: 'guest'|'user'|'admin' = 'guest'

  if (username === 'admin' && password === 'admin123') { ok = true; role = 'admin' }
  else if (username === 'alice' && password === 'alice123') { ok = true; role = 'user' }

  if (!ok) {
    log(`Login failed for ${username}`)
    return res.status(401).json({ error: 'Bad credentials' })
  }
  setSessionCookies(req, res, username, role)
  log(`Login ${username} (${role})`)
  res.json({ ok: true })
})

// Admin endpoint
// RANJIVO (bacEnabled=TRUE): admin pristup ako role=admin dođe iz query stringa ili cookie
// SIGURNIJE (bacEnabled=FALSE): admin je SAMO stvarno ulogirani 'admin'
securityRouter.get('/api/admin', (req, res) => {
  const me = getCurrentUser(req)
  const allowed = state.bacEnabled
    ? (me.role === 'admin')                   // RANJIVO: role iz klijenta
    : ((req.cookies?.username as string) === 'admin')  // SIGURNIJE: provjera stvarnog identiteta
  if (!allowed) return res.status(403).json({ error: 'Forbidden' })

  res.json({
    secret: 'very-secret-demo',
    message: `Welcome ${me.username}`
  })
})
