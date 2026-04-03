import http from 'node:http'
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const PORT = Number(process.env.PORT || 8787)
const ROOT = process.cwd()
const DATA_DIR = path.join(ROOT, 'server-data')
const DB_PATH = path.join(DATA_DIR, 'db.json')
const DIST_DIR = path.join(ROOT, 'dist')
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
}

ensureStorage()

const server = http.createServer(async (req, res) => {
  applyCors(res)

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  try {
    if (url.pathname === '/api/health') return sendJson(res, 200, { ok: true })
    if (url.pathname === '/api/auth/register' && req.method === 'POST') return register(req, res)
    if (url.pathname === '/api/auth/login' && req.method === 'POST') return login(req, res)
    if (url.pathname === '/api/auth/logout' && req.method === 'POST') return logout(req, res)
    if (url.pathname === '/api/me' && req.method === 'GET') return me(req, res)
    if (url.pathname === '/api/state' && req.method === 'GET') return getState(req, res)
    if (url.pathname === '/api/state' && req.method === 'PUT') return setState(req, res)
    if (url.pathname === '/api/ai/suggest' && req.method === 'POST') return suggest(req, res)

    if (serveStatic(url.pathname, res)) return
    sendNotFound(res)
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Server error' })
  }
})

server.listen(PORT, () => {
  console.log(`Student Life OS API running on http://localhost:${PORT}`)
})

function ensureStorage() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, JSON.stringify({ users: [], sessions: [] }, null, 2), 'utf8')
  }
}

function loadDb() {
  return JSON.parse(readFileSync(DB_PATH, 'utf8'))
}

async function saveDb(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8')
}

function applyCors(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => res.setHeader(key, value))
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

function sendNotFound(res) {
  sendJson(res, 404, { error: 'Not found' })
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return { salt, hash }
}

function verifyPassword(password, salt, expectedHash) {
  const { hash } = hashPassword(password, salt)
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'))
}

function createToken() {
  return crypto.randomBytes(32).toString('hex')
}

function getToken(req) {
  const auth = req.headers.authorization || ''
  const [, token] = auth.split(' ')
  return token || ''
}

function getSession(db, token) {
  const session = db.sessions.find((item) => item.token === token)
  if (!session) return null
  return db.users.find((user) => user.id === session.userId) || null
}

function defaultState() {
  return {
    theme: 'dark',
    soundEnabled: true,
    quoteIndex: 0,
    appearance: { accent: 'ocean', density: 'roomy', liquid: 'flow' },
    lastActiveDate: '',
    streak: 1,
    tasks: [],
    notes: '',
    timetable: {},
    stats: {},
    timer: { mode: 'work', remaining: 1500, running: false },
    focusSession: { duration: 1500, remaining: 1500, running: false },
    focusSettings: { hours: 0, minutes: 25, seconds: 0 },
    taskHistory: [],
    aiHistory: [],
  }
}

function normalizeState(state = {}) {
  return { ...defaultState(), ...state }
}

async function register(req, res) {
  const { name, email, password } = await readBody(req)
  if (!name || !email || !password) return sendJson(res, 400, { error: 'Missing fields' })

  const db = loadDb()
  const normalizedEmail = String(email).trim().toLowerCase()
  if (db.users.some((user) => user.email === normalizedEmail)) {
    return sendJson(res, 409, { error: 'Account already exists' })
  }

  const { salt, hash } = hashPassword(String(password))
  const user = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: normalizedEmail,
    salt,
    hash,
    createdAt: new Date().toISOString(),
    state: defaultState(),
  }
  const token = createToken()
  db.users.push(user)
  db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() })
  await saveDb(db)
  sendJson(res, 201, { token, user: publicUser(user), state: user.state })
}

async function login(req, res) {
  const { email, password } = await readBody(req)
  const db = loadDb()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const user = db.users.find((item) => item.email === normalizedEmail)
  if (!user || !verifyPassword(String(password || ''), user.salt, user.hash)) {
    return sendJson(res, 401, { error: 'Invalid credentials' })
  }

  const token = createToken()
  db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() })
  await saveDb(db)
  sendJson(res, 200, { token, user: publicUser(user), state: normalizeState(user.state) })
}

async function logout(req, res) {
  const token = getToken(req)
  const db = loadDb()
  db.sessions = db.sessions.filter((session) => session.token !== token)
  await saveDb(db)
  sendJson(res, 200, { ok: true })
}

function me(req, res) {
  const user = requireUser(req, res)
  if (!user) return
  sendJson(res, 200, { user: publicUser(user) })
}

function getState(req, res) {
  const user = requireUser(req, res)
  if (!user) return
  sendJson(res, 200, { state: normalizeState(user.state) })
}

async function setState(req, res) {
  const user = requireUser(req, res)
  if (!user) return

  const { state } = await readBody(req)
  const db = loadDb()
  const stored = db.users.find((item) => item.id === user.id)
  if (!stored) return sendJson(res, 404, { error: 'User not found' })

  stored.state = normalizeState(state)
  await saveDb(db)
  sendJson(res, 200, { state: stored.state })
}

async function suggest(req, res) {
  const user = requireUser(req, res)
  if (!user) return

  const { prompt, context } = await readBody(req)
  const suggestion = OPENAI_API_KEY
    ? await suggestWithOpenAI(prompt, context)
    : suggestLocally(prompt, context)

  const db = loadDb()
  const stored = db.users.find((item) => item.id === user.id)
  if (stored) {
    stored.state.aiHistory = Array.isArray(stored.state.aiHistory) ? stored.state.aiHistory : []
    stored.state.aiHistory.unshift({ id: crypto.randomUUID(), prompt: String(prompt || ''), suggestion, at: new Date().toISOString() })
    stored.state.aiHistory = stored.state.aiHistory.slice(0, 20)
    await saveDb(db)
  }

  sendJson(res, 200, { suggestion })
}

async function suggestWithOpenAI(prompt, context) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'You are a calm student productivity coach. Give concise, practical advice.' },
        { role: 'user', content: `Prompt: ${prompt}\nContext: ${JSON.stringify(context || {})}` },
      ],
    }),
  })
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`)
  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || 'Try breaking the task into one small step.'
}

function suggestLocally(prompt, context) {
  const text = String(prompt || '').toLowerCase()
  const tasks = Array.isArray(context?.tasks) ? context.tasks : []
  const openTasks = tasks.filter((task) => !task.completed).length
  if (text.includes('plan')) return `You have ${openTasks} open tasks. Start with the smallest one, then run 25 minutes of focus.`
  if (text.includes('study')) return 'Use one session for recall, one for practice, then one for review.'
  if (text.includes('task')) return 'Pick one task, set a 25-minute timer, and stop after that one win.'
  return 'Keep it simple: one goal, one timer, one next action.'
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
}

function requireUser(req, res) {
  const token = getToken(req)
  if (!token) {
    sendJson(res, 401, { error: 'Missing token' })
    return null
  }

  const db = loadDb()
  const user = getSession(db, token)
  if (!user) {
    sendJson(res, 401, { error: 'Invalid session' })
    return null
  }

  return user
}

function serveStatic(requestPath, res) {
  if (!existsSync(DIST_DIR)) return false

  const cleanPath = requestPath === '/' ? '/index.html' : requestPath
  const filePath = path.join(DIST_DIR, cleanPath)
  if (!filePath.startsWith(DIST_DIR) || !existsSync(filePath)) return false

  const ext = path.extname(filePath)
  const type = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.json': 'application/json; charset=utf-8',
  }[ext] || 'application/octet-stream'

  res.writeHead(200, { 'Content-Type': type })
  createReadStream(filePath).pipe(res)
  return true
}
