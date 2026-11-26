const SUPABASE_URL = 'https://qucobxzzjzlukwgvluaa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QJombBaaf7QxGW9me_7v4g_ZbBNXOKx';
const SUPABASE_HOST = 'qucobxzzjzlukwgvluaa.supabase.co';

const SESSION_STORAGE_KEY = 'zu_corporate_lab13_session';
const AUDIT_STORAGE_KEY = 'zu_corporate_lab13_audit';
const PBKDF2_ITERATIONS = 100000;
const SESSION_TTL_SEC = 24 * 60 * 60;
const SESSION_HMAC_SECRET = `ZU-Corporate-Lab13:${SUPABASE_HOST}:${SUPABASE_KEY}`;

const ARCHITECTURE_LAYERS = [
  {
    order: 1,
    id: 'presentation',
    name: 'Презентациялық қабат (Presentation Layer)',
    shortName: 'UI / Client Tier',
    purpose: 'Пайдаланушымен өзара әрекеттесу: тіркелу, кіру, рөлдік панельдер, кестелер және интерактивті диаграммаларды көрсету.',
    technologies: 'HTML5, CSS3 (Responsive Grid), Vanilla ES6+, SVG Interactive Diagrams',
    elements: ['Тіркелу және Кіру шлюзі', 'Навигация панелі', 'Басқару кестелері', 'Есеп беру графиктері'],
  },
  {
    order: 2,
    id: 'gateway',
    name: 'Қауіпсіздік шлюзі және Сессия қабаты (Security & Session Layer)',
    shortName: 'Auth Gate & RBAC Tier',
    purpose: 'Қолжетімділікті қатаң бақылау: тіркелмеген пайдаланушыларды оқшаулау, HMAC-SHA256 токенін тексеру, рөлдік шектеулерді (RBAC) қолдану.',
    technologies: 'Web Crypto API (HMAC-SHA256), TLS 1.3 HTTPS, RBAC Matrix, Audit Trail',
    elements: ['Қатаң Тіркелу → Кіру сүзгісі', 'HMAC-SHA256 токен тексерісі', 'Аудит журналы', 'Сұранысты валидациялау'],
  },
  {
    order: 3,
    id: 'business',
    name: 'Бизнес-логика қабаты (Business Logic Layer)',
    shortName: 'Application Logic Tier',
    purpose: 'Корпоративтік ережелерді орындау: құпия сөзді PBKDF2-HMAC-SHA256 хэштеу, бірегей логинді тексеру, бөлімше кодын генерациялау, KPI агрегациялау.',
    technologies: 'ES6+ Modules, Web Crypto PBKDF2 (100 000 итерация), Validation Rules',
    elements: ['Тіркелу/Кіру логикасы', 'Пайдаланушы профилі', 'Бөлімшелер CRUD', 'Есеп агрегаторы'],
  },
  {
    order: 4,
    id: 'data_access',
    name: 'Деректерге қол жеткізу қабаты (Data Access Layer)',
    shortName: 'DAL / PostgREST HTTPS API',
    purpose: 'Бизнес-логика мен деректер қоры арасындағы параметрленген қауіпсіз көпір; SQL-инъекциядан қорғайтын REST/JSON сұраныстарын орындау.',
    technologies: 'Supabase PostgREST v1 HTTPS API, Parameterized Filters, Health Monitor',
    elements: ['sbFetch() клиенті', 'DTO форматтау', 'Параметрленген eq.* сүзгілері', 'Health Check мониторы'],
  },
  {
    order: 5,
    id: 'database',
    name: 'Бұлттық Деректер Қоры қабаты (Cloud Database Layer)',
    shortName: 'Supabase PostgreSQL',
    purpose: 'Корпоративтік жүйенің барлық деректерін орталықтандырылған, сенімді және тұрақты сақтау.',
    technologies: 'Supabase Managed PostgreSQL 15+, ACID транзакциялар, UUID кілттері',
    elements: ['public.users кестесі', 'public.classes кестесі', 'public.assignments кестесі', 'public.submissions кестесі'],
  },
];

const FUNCTIONAL_MODULES = [
  {
    id: 'auth',
    number: 1,
    name: 'Авторизация модулі',
    purpose: 'Қатаң тіркелу-кіру тәртібін қамтамасыз ету: алдымен жаңа пайдаланушыны Supabase базасына тіркеу, содан кейін ғана HMAC-SHA256 сессия токенін беру.',
    requiredData: 'login, password (PBKDF2 хэш), first_name, last_name, role, group_name',
    interactions: 'Қауіпсіздік және Пайдаланушылар модульдерімен, сондай-ақ Supabase public.users кестесімен тікелей байланысады.',
    targetTab: 'analytics',
  },
  {
    id: 'users',
    number: 2,
    name: 'Пайдаланушылар модулі',
    purpose: 'Тіркелген студенттер мен оқытушылардың тізімін жүргізу, іздеу, рөлдер бойынша сүзу және профильді жаңарту.',
    requiredData: 'id (UUID), login, first_name, last_name, role, group_name, created_at',
    interactions: 'Авторизация модулінен расталған сессияны алады; Деректерді басқару және Есеп беру модульдеріне профиль деректерін береді.',
    targetTab: 'workspace',
  },
  {
    id: 'data',
    number: 3,
    name: 'Деректерді басқару модулі',
    purpose: 'Оқу бөлімшелері мен корпоративтік пәндерді (public.classes) құру, код беру, оқу және иесі тарапынан жою (CRUD).',
    requiredData: 'id, name, code (ZU-XXXX), teacher_id, students[], created_at',
    interactions: 'Пайдаланушылар модулі арқылы авторды (teacher_id) анықтайды, Есеп беру модуліне нақты статистика береді.',
    targetTab: 'workspace',
  },
  {
    id: 'reports',
    number: 4,
    name: 'Есеп беру модулі',
    purpose: 'Supabase деректері негізінде рөлдер, топтар және кестелер бойынша нақты уақыт аналитикасын құру және CSV экспорттау.',
    requiredData: 'users, classes, assignments, submissions кестелерінен агрегатталған көрсеткіштер',
    interactions: 'Пайдаланушылар мен Деректерді басқару модульдерінен дерек жинап, Әкімшілік басқару модуліне ұсынады.',
    targetTab: 'analytics',
  },
  {
    id: 'admin',
    number: 5,
    name: 'Әкімшілік басқару модулі',
    purpose: 'Жүйенің инфрақұрылым күйін бақылау, Supabase бұлттық байланысын диагностикалау және рөлдік саясатты (RBAC) реттеу.',
    requiredData: 'Supabase latency, кесте күйлері, RBAC матрицасы, сессия мәртебесі',
    interactions: 'Барлық модульдердің күйін бақылайды және Қауіпсіздік модулімен бірге жүйе тұрақтылығын қамтамасыз етеді.',
    targetTab: 'analytics',
  },
  {
    id: 'security',
    number: 6,
    name: 'Қауіпсіздік модулі',
    purpose: 'PBKDF2-HMAC-SHA256 криптографиялық хэштеу, HMAC-SHA256 сессия токенін тексеру, рұқсатсыз кіруді бұғаттау және аудит журналын жүргізу.',
    requiredData: 'Тұз (16 байт), PBKDF2 кілті, токен қолтаңбасы, оқиға түрі, уақыт (Asia/Almaty)',
    interactions: 'Барлық ішкі бөлімдердің алдында қорғаныс сүзгісі қызметін атқарып, әр әрекетті аудит журналына тіркейді.',
    targetTab: 'analytics',
  },
];

const NODE_DESCRIPTIONS = {
  client: 'Пайдаланушы (Презентациялық қабат): Тіркелу және кіру шлюзі, сондай-ақ корпоративтік басқару панелі. Барлық деректерді TLS 1.3 (HTTPS) арқылы алмасады.',
  gateway: 'Қауіпсіздік шлюзі және Сессия/RBAC сүзгісі: Тіркелмеген немесе сессиясы жоқ пайдаланушыларды жүйеге кіргізбейді; HMAC-SHA256 токенін тексеріп аудит жүргізеді.',
  auth: '1. Авторизация модулі: Қатаң «Алдымен тіркелу → содан кейін кіру» тәртібін іске асырады. Құпия сөзді PBKDF2-HMAC-SHA256 (100 000 итерация) алгоритмімен хэштеп Supabase public.users кестесіне сақтайды.',
  users: '2. Пайдаланушылар модулі: Supabase public.users кестесінен студенттер мен оқытушылар тізімін жүктейді, іздеу/сүзу жүргізеді және профильді жаңартады.',
  data: '3. Деректерді басқару модулі: Корпоративтік бөлімшелер мен оқу курстарын (public.classes) құрады, оқиды және иесі тарапынан жоюды басқарады.',
  reports: '4. Есеп беру модулі: Supabase кестелерінен нақты уақыт аналитикасын есептеп, диаграммалар мен CSV экспорт жасайды.',
  admin: '5. Әкімшілік басқару модулі: Жүйе қабаттары мен Supabase қосылымының күйін, RBAC қолжетімділік матрицасын бақылайды.',
  security: '6. Қауіпсіздік модулі: Web Crypto PBKDF2 хэштеу, HMAC-SHA256 сессия қолтаңбасын тексеру, сәтсіз кіруді бұғаттау және аудит журналын жүргізу.',
  db: 'Орталық Supabase PostgreSQL базасы: Барлық 6 модуль қолданатын бірыңғай бұлттық ДҚ (public.users, public.classes, public.assignments, public.submissions).',
};

const RBAC_MATRIX = [
  {
    resource: 'Auth Gate (Тіркелу / Кіру) + Health Check',
    guest: 'Рұқсат етілген',
    student: 'Рұқсат етілген',
    teacher: 'Рұқсат етілген',
  },
  {
    resource: 'Шолу, Қабаттар, Модульдер, Схема, Талдау',
    guest: 'Бұғатталған (Тіркеліп кіру қажет)',
    student: 'HMAC токенімен рұқсат',
    teacher: 'HMAC токенімен рұқсат',
  },
  {
    resource: 'PATCH public.users (Профильді өңдеу)',
    guest: 'Бұғатталған',
    student: 'Тек өз профилі',
    teacher: 'Тек өз профилі',
  },
  {
    resource: 'POST / DELETE public.classes',
    guest: 'Бұғатталған',
    student: 'Құру + тек өз жазбасын жою',
    teacher: 'Құру + тек өз жазбасын жою',
  },
];

const state = {
  token: localStorage.getItem(SESSION_STORAGE_KEY) || '',
  user: null,
  health: null,
  users: [],
  records: [],
  assignmentsCount: 0,
  submissionsCount: 0,
  reports: null,
  selectedLayerId: 'presentation',
};

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showAlert(el, type, message) {
  if (!el) return;
  if (!message) {
    el.className = 'alert hidden';
    el.textContent = '';
    return;
  }
  el.className = `alert ${type}`;
  el.textContent = message;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const clean = String(hex || '').trim();
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function constantTimeEqual(a, b) {
  const strA = String(a || '');
  const strB = String(b || '');
  if (strA.length !== strB.length) return false;
  let diff = 0;
  for (let i = 0; i < strA.length; i += 1) {
    diff |= strA.charCodeAt(i) ^ strB.charCodeAt(i);
  }
  return diff === 0;
}

function toBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function fromBase64Url(b64) {
  const norm = b64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = norm.length % 4 === 0 ? '' : '='.repeat(4 - (norm.length % 4));
  const bin = atob(norm + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getHmacKey() {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SESSION_HMAC_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function signSessionToken(payload) {
  const nowSec = Math.floor(Date.now() / 1000);
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = toBase64Url(JSON.stringify({ ...payload, iat: nowSec, exp: nowSec + SESSION_TTL_SEC }));
  const signingInput = `${header}.${body}`;
  const key = await getHmacKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
  return `${signingInput}.${bytesToHex(new Uint8Array(sig))}`;
}

async function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, bodyB64, sigHex] = parts;
  if (!/^[0-9a-f]+$/i.test(sigHex) || sigHex.length % 2 !== 0) return null;

  try {
    const key = await getHmacKey();
    const ok = await crypto.subtle.verify(
      'HMAC',
      key,
      hexToBytes(sigHex),
      new TextEncoder().encode(`${headerB64}.${bodyB64}`)
    );
    if (!ok) return null;

    const payload = JSON.parse(fromBase64Url(bodyB64));
    const nowSec = Math.floor(Date.now() / 1000);
    if (!payload.sub || typeof payload.exp !== 'number' || payload.exp <= nowSec) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(String(password)),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${bytesToHex(salt)}$${bytesToHex(new Uint8Array(bits))}`;
}

async function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;

  if (stored.startsWith('pbkdf2$')) {
    const parts = stored.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    const saltHex = parts[2];
    const expectedHex = parts[3];
    if (!iterations || !saltHex || !expectedHex) return false;

    try {
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(String(password)),
        'PBKDF2',
        false,
        ['deriveBits']
      );
      const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt: hexToBytes(saltHex), iterations, hash: 'SHA-256' },
        keyMaterial,
        256
      );
      return constantTimeEqual(bytesToHex(new Uint8Array(bits)), expectedHex);
    } catch {
      return false;
    }
  }

  return constantTimeEqual(String(password), stored);
}

// Persistent Audit Log (localStorage, max 100 entries)
function readAuditLogs() {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function logAudit({ event, login = 'anonymous', role = '-', status = 'INFO', details = '' }) {
  const now = new Date();
  let almatyTime = now.toISOString();
  try {
    almatyTime = now.toLocaleString('kk-KZ', {
      timeZone: 'Asia/Almaty',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    // keep ISO fallback
  }

  const entry = {
    id: bytesToHex(crypto.getRandomValues(new Uint8Array(4))),
    timestamp: now.toISOString(),
    almatyTime,
    event,
    login: String(login || 'anonymous'),
    role: String(role || '-'),
    status,
    details,
  };

  const logs = readAuditLogs();
  logs.unshift(entry);
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 100)));
  } catch {
    // ignore quota issues
  }
  return entry;
}

// Direct Supabase Cloud PostgREST Client (apikey header only — never Authorization: Bearer sb_publishable_...)
async function sbFetch(path, { method = 'GET', body, prefer } = {}) {
  const headers = {
    apikey: SUPABASE_KEY,
  };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (prefer) {
    headers.Prefer = prefer;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const rawText = await res.text();
  let data = null;
  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error_description || data.hint)) || `Supabase HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

async function checkSupabaseHealth() {
  const startedAt = performance.now();
  try {
    await sbFetch('users?select=id&limit=1');
    const latencyMs = Math.max(1, Math.round(performance.now() - startedAt));
    return { connected: true, latencyMs, projectHost: SUPABASE_HOST, error: null };
  } catch (err) {
    return {
      connected: false,
      latencyMs: Math.round(performance.now() - startedAt),
      projectHost: SUPABASE_HOST,
      error: err.message,
    };
  }
}

function formatSafeUser(u) {
  return {
    id: u.id,
    login: u.login,
    firstName: u.first_name || '',
    lastName: u.last_name || '',
    role: u.role || 'student',
    group: u.group_name || null,
    createdAt: u.created_at || null,
  };
}

function generateUnitCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rand = crypto.getRandomValues(new Uint8Array(4));
  let suffix = '';
  for (let i = 0; i < 4; i += 1) {
    suffix += chars.charAt(rand[i] % chars.length);
  }
  return `ZU-${suffix}`;
}

function switchAuthTab(tabName) {
  const isRegister = tabName === 'register';
  document.getElementById('tabRegisterBtn').classList.toggle('active', isRegister);
  document.getElementById('tabLoginBtn').classList.toggle('active', !isRegister);
  document.getElementById('registerForm').classList.toggle('hidden', !isRegister);
  document.getElementById('loginForm').classList.toggle('hidden', isRegister);
}

function updatePasswordStrength(password) {
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!password) {
    fill.style.width = '0%';
    fill.style.backgroundColor = '#ef4444';
    label.textContent = 'Энтропия: 0 бит';
    return;
  }

  let alphabet = 0;
  if (/[a-z]/.test(password)) alphabet += 26;
  if (/[A-Z]/.test(password)) alphabet += 26;
  if (/[0-9]/.test(password)) alphabet += 10;
  if (/[^a-zA-Z0-9]/.test(password)) alphabet += 32;
  alphabet = Math.max(alphabet, 10);

  const entropy = Math.round(password.length * Math.log2(alphabet));
  const pct = Math.min(100, Math.round((entropy / 80) * 100));
  fill.style.width = `${pct}%`;

  if (entropy < 36) {
    fill.style.backgroundColor = '#ef4444';
    label.textContent = `Әлсіз (${entropy} бит)`;
  } else if (entropy < 55) {
    fill.style.backgroundColor = '#f59e0b';
    label.textContent = `Орташа (${entropy} бит)`;
  } else {
    fill.style.backgroundColor = '#10b981';
    label.textContent = `Күшті (${entropy} бит)`;
  }
}

async function refreshHealthBanner() {
  const pill = document.getElementById('authHealthPill');
  const text = document.getElementById('authHealthText');
  const sb = await checkSupabaseHealth();
  state.health = sb;
  if (sb.connected) {
    pill.className = 'health-pill online';
    text.textContent = `Supabase Cloud қосулы (${sb.latencyMs} мс)`;
  } else {
    pill.className = 'health-pill offline';
    text.textContent = `Supabase қосылымы жоқ: ${sb.error || 'қате'}`;
  }
}

function showAuthGate(noticeType = '', noticeMsg = '') {
  document.getElementById('authGate').classList.remove('hidden');
  document.getElementById('appShell').classList.add('hidden');
  showAlert(document.getElementById('authNotice'), noticeType, noticeMsg);
  refreshHealthBanner();
}

function showWorkspace() {
  document.getElementById('authGate').classList.add('hidden');
  document.getElementById('appShell').classList.remove('hidden');

  const u = state.user;
  const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.login;
  const initials = ((u.firstName?.[0] || '') + (u.lastName?.[0] || '')).toUpperCase() || u.login.slice(0, 2).toUpperCase();
  const roleLabel = u.role === 'teacher' ? 'Оқытушы' : 'Студент';

  document.getElementById('userAvatar').textContent = initials;
  document.getElementById('userFullName').textContent = fullName;
  document.getElementById('userRoleGroup').textContent = `${roleLabel} • ${u.group || 'Бөлімсіз'}`;

  document.getElementById('profFirstName').value = u.firstName || '';
  document.getElementById('profLastName').value = u.lastName || '';
  document.getElementById('profGroup').value = u.group || '';
}

function forceLogout(msg = '') {
  state.token = '';
  state.user = null;
  localStorage.removeItem(SESSION_STORAGE_KEY);
  switchAuthTab('login');
  showAuthGate(msg ? 'error' : '', msg);
}

function switchWorkspaceTab(tabId) {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
  });
}

function renderOverview() {
  const studentsCount = state.users.filter((u) => u.role === 'student').length;
  const teachersCount = state.users.filter((u) => u.role === 'teacher').length;

  document.getElementById('kpiUsers').textContent = state.users.length;
  document.getElementById('kpiUsersSplit').textContent = `Студент: ${studentsCount} • Оқытушы: ${teachersCount}`;
  document.getElementById('kpiClasses').textContent = state.records.length;
  document.getElementById('kpiLayers').textContent = ARCHITECTURE_LAYERS.length;
  document.getElementById('kpiModules').textContent = FUNCTIONAL_MODULES.length;

  const badge = document.getElementById('topSupabaseBadge');
  const badgeText = document.getElementById('topSupabaseText');
  const healthCell = document.getElementById('overviewHealthStatus');
  if (state.health?.connected) {
    badge.className = 'cloud-badge online';
    badgeText.textContent = `Supabase Cloud (${state.health.latencyMs} мс)`;
    healthCell.textContent = `Қосулы • Іркіліс: ${state.health.latencyMs} мс`;
  } else {
    badge.className = 'cloud-badge offline';
    badgeText.textContent = 'Supabase қатесі';
    healthCell.textContent = state.health?.error || 'Байланыс үзілген';
  }
}

function renderLayers() {
  const stackEl = document.getElementById('layersStack');
  const tbody = document.getElementById('layersTableBody');

  stackEl.innerHTML = ARCHITECTURE_LAYERS
    .map(
      (layer) => `
      <div class="layer-item ${layer.id === state.selectedLayerId ? 'active' : ''}" data-layer-id="${esc(layer.id)}">
        <span class="layer-num">${layer.order}</span>
        <div class="layer-meta">
          <strong>${esc(layer.name)}</strong>
          <small>${esc(layer.shortName)} • ${esc(layer.technologies)}</small>
        </div>
      </div>`
    )
    .join('');

  stackEl.querySelectorAll('.layer-item').forEach((item) => {
    item.addEventListener('click', () => {
      state.selectedLayerId = item.dataset.layerId;
      renderLayers();
    });
  });

  const active = ARCHITECTURE_LAYERS.find((l) => l.id === state.selectedLayerId) || ARCHITECTURE_LAYERS[0];
  if (active) {
    document.getElementById('layerDetailCard').innerHTML = `
      <span class="eyebrow">${active.order}-қабат • ${esc(active.shortName)}</span>
      <h3>${esc(active.name)}</h3>
      <p>${esc(active.purpose)}</p>
      <p class="mt-12"><strong>Технологиялар:</strong> ${esc(active.technologies)}</p>
      <div class="chip-list">
        ${active.elements.map((el) => `<span class="chip">${esc(el)}</span>`).join('')}
      </div>
    `;
  }

  tbody.innerHTML = ARCHITECTURE_LAYERS
    .map(
      (l) => `
      <tr>
        <td><strong>${l.order}</strong></td>
        <td><strong>${esc(l.name)}</strong></td>
        <td>${esc(l.purpose)}</td>
        <td>${esc(l.technologies)}</td>
      </tr>`
    )
    .join('');
}

function renderModules() {
  const grid = document.getElementById('modulesGrid');
  const tbody = document.getElementById('modulesTableBody');

  grid.innerHTML = FUNCTIONAL_MODULES
    .map(
      (m) => `
      <article class="module-card">
        <div>
          <span class="eyebrow">Модуль №${m.number}</span>
          <h4>${esc(m.name)}</h4>
          <p>${esc(m.purpose)}</p>
          <p class="mt-12"><strong>Деректер:</strong> ${esc(m.requiredData)}</p>
        </div>
        <button type="button" class="btn btn-outline btn-sm" data-jump-tab="${esc(m.targetTab)}">Модульді ашу →</button>
      </article>`
    )
    .join('');

  grid.querySelectorAll('[data-jump-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchWorkspaceTab(btn.dataset.jumpTab);
    });
  });

  tbody.innerHTML = FUNCTIONAL_MODULES
    .map(
      (m) => `
      <tr>
        <td><strong>${m.number}</strong></td>
        <td><strong>${esc(m.name)}</strong></td>
        <td>${esc(m.purpose)}</td>
        <td>${esc(m.requiredData)}</td>
        <td>${esc(m.interactions)}</td>
      </tr>`
    )
    .join('');
}

function renderUsersTable() {
  const search = (document.getElementById('userSearchInput').value || '').trim().toLowerCase();
  const roleFilter = document.getElementById('userRoleFilter').value;

  const filtered = state.users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (!search) return true;
    const blob = `${u.firstName} ${u.lastName} ${u.login} ${u.group || ''}`.toLowerCase();
    return blob.includes(search);
  });

  const tbody = document.getElementById('usersTableBody');
  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="5">Сәйкес пайдаланушы табылмады.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered
    .map((u) => {
      const roleClass = u.role === 'teacher' ? 'badge-teacher' : 'badge-student';
      const roleText = u.role === 'teacher' ? 'Оқытушы' : 'Студент';
      const dt = u.createdAt ? new Date(u.createdAt).toLocaleString('kk-KZ') : '—';
      return `
        <tr>
          <td><strong>${esc(u.firstName)} ${esc(u.lastName)}</strong></td>
          <td><code>${esc(u.login)}</code></td>
          <td><span class="badge ${roleClass}">${roleText}</span></td>
          <td>${esc(u.group || '—')}</td>
          <td>${esc(dt)}</td>
        </tr>`;
    })
    .join('');
}

function renderRecordsTable() {
  const tbody = document.getElementById('recordsTableBody');
  if (!state.records.length) {
    tbody.innerHTML = '<tr><td colspan="5">Қазірше жазбалар жоқ.</td></tr>';
    return;
  }

  tbody.innerHTML = state.records
    .map(
      (r) => `
      <tr>
        <td><code>${esc(r.code)}</code></td>
        <td><strong>${esc(r.name)}</strong></td>
        <td>${esc(r.ownerName)}</td>
        <td>${r.studentsCount}</td>
        <td>
          ${
            r.canDelete
              ? `<button type="button" class="btn-danger-sm" data-delete-record="${esc(r.id)}">Жою</button>`
              : '<span class="muted">Тек оқу</span>'
          }
        </td>
      </tr>`
    )
    .join('');

  tbody.querySelectorAll('[data-delete-record]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.deleteRecord;
      const target = state.records.find((x) => String(x.id) === String(id));
      if (!target || !target.canDelete) return;

      btn.disabled = true;
      try {
        await sbFetch(`classes?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
        logAudit({
          event: 'RECORD_DELETED',
          login: state.user.login,
          role: state.user.role,
          status: 'INFO',
          details: `Корпоративтік жазба жойылды: ${target.name} (${target.code}).`,
        });
        await loadAllWorkspaceData();
      } catch (err) {
        showAlert(document.getElementById('recordNotice'), 'error', err.message);
        btn.disabled = false;
      }
    });
  });
}

function renderAnalyticsAndSecurity() {
  const tableCounts = [
    { table: 'users', label: 'Пайдаланушылар', count: state.users.length },
    { table: 'classes', label: 'Бөлімшелер / Курстар', count: state.records.length },
    { table: 'assignments', label: 'Тапсырмалар', count: state.assignmentsCount },
    { table: 'submissions', label: 'Жұмыс тапсырулар', count: state.submissionsCount },
  ];

  const maxVal = Math.max(1, ...tableCounts.map((t) => t.count));
  document.getElementById('reportsBars').innerHTML = tableCounts
    .map((item) => {
      const pct = Math.max(8, Math.round((item.count / maxVal) * 100));
      return `
        <div>
          <div class="bar-row-head">
            <span>${esc(item.label)} (<code>public.${esc(item.table)}</code>)</span>
            <span>${item.count} жазба</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        </div>`;
    })
    .join('');

  const studentCount = state.users.filter((u) => u.role === 'student').length;
  const teacherCount = state.users.filter((u) => u.role === 'teacher').length;
  const groupMap = new Map();
  for (const u of state.users) {
    const grp = (u.group || 'Көрсетілмеген').trim();
    groupMap.set(grp, (groupMap.get(grp) || 0) + 1);
  }
  const groupsHtml = Array.from(groupMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([group, count]) => `<span class="chip">${esc(group)}: ${count}</span>`)
    .join('');

  document.getElementById('groupsSummary').innerHTML = `
    <span class="chip">Студенттер: ${studentCount}</span>
    <span class="chip">Оқытушылар: ${teacherCount}</span>
    ${groupsHtml}
  `;

  const logs = readAuditLogs();
  const blockedCount = logs.filter((item) => item.status === 'BLOCKED' || item.status === 'FAILED').length;

  document.getElementById('cryptoSummary').innerHTML = `
    <div><strong>Хэштеу алгоритмі:</strong> Web Crypto PBKDF2-HMAC-SHA256 (${PBKDF2_ITERATIONS.toLocaleString('ru-RU')} итерация, 16-байт тұз, 256-бит кілт)</div>
    <div><strong>Сессия токені:</strong> HMAC-SHA256 қолтаңбалы токен • Жарамдылығы: ${SESSION_TTL_SEC / 3600} сағат</div>
    <div><strong>Supabase хосты:</strong> <code>${esc(SUPABASE_HOST)}</code> • Аудит оқиғалары: ${logs.length} (Бұғатталған/қате: ${blockedCount})</div>
  `;

  document.getElementById('rbacTableBody').innerHTML = RBAC_MATRIX
    .map(
      (row) => `
      <tr>
        <td><code>${esc(row.resource)}</code></td>
        <td>${esc(row.guest)}</td>
        <td>${esc(row.student)}</td>
        <td>${esc(row.teacher)}</td>
      </tr>`
    )
    .join('');

  const auditTbody = document.getElementById('auditTableBody');
  if (!logs.length) {
    auditTbody.innerHTML = '<tr><td colspan="6">Аудит оқиғалары әлі тіркелмеген.</td></tr>';
  } else {
    auditTbody.innerHTML = logs
      .slice(0, 50)
      .map((log) => {
        const st = String(log.status || 'INFO').toLowerCase();
        return `
          <tr>
            <td>${esc(log.almatyTime)}</td>
            <td><code>${esc(log.event)}</code></td>
            <td>${esc(log.login)}</td>
            <td>${esc(log.role)}</td>
            <td><span class="badge badge-${esc(st)}">${esc(log.status)}</span></td>
            <td>${esc(log.details)}</td>
          </tr>`;
      })
      .join('');
  }
}

async function loadAllWorkspaceData() {
  const [health, usersRows, classesRows, assignmentsRows, submissionsRows] = await Promise.all([
    checkSupabaseHealth(),
    sbFetch('users?select=id,login,first_name,last_name,role,group_name,created_at&order=created_at.desc'),
    sbFetch('classes?select=id,name,code,teacher_id,students,created_at&order=created_at.desc'),
    sbFetch('assignments?select=id'),
    sbFetch('submissions?select=id'),
  ]);

  state.health = health;
  state.users = (usersRows || []).map(formatSafeUser);

  const usersMap = new Map();
  for (const u of state.users) {
    usersMap.set(String(u.id), `${u.firstName} ${u.lastName}`.trim() || u.login);
  }

  state.records = (classesRows || []).map((row) => ({
    id: row.id,
    name: row.name,
    code: row.code,
    teacherId: row.teacher_id,
    ownerName: usersMap.get(String(row.teacher_id)) || 'Белгісіз',
    studentsCount: Array.isArray(row.students) ? row.students.length : 0,
    canDelete: String(row.teacher_id) === String(state.user.id),
    createdAt: row.created_at,
  }));

  state.assignmentsCount = (assignmentsRows || []).length;
  state.submissionsCount = (submissionsRows || []).length;

  renderOverview();
  renderLayers();
  renderModules();
  renderUsersTable();
  renderRecordsTable();
  renderAnalyticsAndSecurity();
}

function exportReportsCsv() {
  const rows = [
    ['Бөлім', 'Көрсеткіш', 'Мәні'],
    ...state.users.map((u) => ['Пайдаланушы', `${u.firstName} ${u.lastName} (${u.login})`, `${u.role} / ${u.group || '-'}`]),
    ...state.records.map((r) => ['Бөлімше/Курс', `${r.code} — ${r.name}`, `Иесі: ${r.ownerName}`]),
  ];
  const csv = '\uFEFF' + rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'zu_corporate_lab13_report.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

function wireEvents() {
  document.querySelectorAll('[data-auth-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchAuthTab(btn.dataset.authTab);
      showAlert(document.getElementById('authNotice'), '', '');
    });
  });

  document.querySelectorAll('[data-switch-auth]').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchAuthTab(btn.dataset.switchAuth);
      showAlert(document.getElementById('authNotice'), '', '');
    });
  });

  document.getElementById('regPassword').addEventListener('input', (e) => {
    updatePasswordStrength(e.target.value);
  });

  // 1. STRICT REGISTRATION HANDLER
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const notice = document.getElementById('authNotice');
    const submitBtn = document.getElementById('registerSubmitBtn');

    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const normalizedLogin = document.getElementById('regLogin').value.trim().toLowerCase();
    const role = document.getElementById('regRole').value.trim().toLowerCase();
    const group = document.getElementById('regGroup').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regPasswordConfirm').value;

    if (firstName.length < 2 || lastName.length < 2) {
      showAlert(notice, 'error', 'Аты-жөніңіз кемінде 2 таңбадан тұруы тиіс.');
      return;
    }
    if (!/^[a-z0-9._@-]{3,64}$/.test(normalizedLogin)) {
      showAlert(notice, 'error', 'Логин 3–64 таңбадан тұруы және тек латын әріптері, цифрлар, ., _, @, - белгілерін қамтуы керек.');
      return;
    }
    if (password.length < 6) {
      showAlert(notice, 'error', 'Құпия сөз кемінде 6 таңбадан тұруы тиіс.');
      return;
    }
    if (password !== confirm) {
      showAlert(notice, 'error', 'Құпия сөздер сәйкес келмейді!');
      return;
    }
    if (role !== 'student' && role !== 'teacher') {
      showAlert(notice, 'error', 'Рөл тек student немесе teacher бола алады.');
      return;
    }

    submitBtn.disabled = true;
    try {
      const existing = await sbFetch(`users?select=id,login&login=eq.${encodeURIComponent(normalizedLogin)}`);
      if (Array.isArray(existing) && existing.length > 0) {
        logAudit({
          event: 'REGISTER_DUPLICATE',
          login: normalizedLogin,
          role,
          status: 'BLOCKED',
          details: 'Қайталанатын логинмен тіркелу әрекеті тоқтатылды.',
        });
        showAlert(notice, 'error', 'Бұл логин бұрын тіркелген. «Кіру» бөліміне өтіп кіріңіз.');
        return;
      }

      const passwordHash = await hashPassword(password);
      const userId = crypto.randomUUID();
      await sbFetch('users', {
        method: 'POST',
        prefer: 'return=representation',
        body: {
          id: userId,
          login: normalizedLogin,
          password: passwordHash,
          first_name: firstName,
          last_name: lastName,
          role,
          group_name: group || null,
        },
      });

      logAudit({
        event: 'REGISTER_SUCCESS',
        login: normalizedLogin,
        role,
        status: 'SUCCESS',
        details: `Жаңа пайдаланушы Supabase базасына тіркелді (${firstName} ${lastName}).`,
      });

      // Strictly do NOT auto-login: switch to Login tab so user must authenticate with registered credentials
      e.target.reset();
      updatePasswordStrength('');
      switchAuthTab('login');
      document.getElementById('loginUsername').value = normalizedLogin;
      document.getElementById('loginPassword').value = '';
      document.getElementById('loginPassword').focus();
      showAlert(
        notice,
        'success',
        'Тіркелу сәтті аяқталды! Аккаунтыңыз Supabase деректер қорына сақталды. Енді «Кіру» бөлімі арқылы кіріңіз.'
      );
    } catch (err) {
      showAlert(notice, 'error', 'Тіркелу қатесі: ' + err.message);
    } finally {
      submitBtn.disabled = false;
    }
  });

  // 2. STRICT LOGIN HANDLER
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const notice = document.getElementById('authNotice');
    const submitBtn = document.getElementById('loginSubmitBtn');

    const normalizedLogin = document.getElementById('loginUsername').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!normalizedLogin || !password) {
      showAlert(notice, 'error', 'Логин мен құпия сөзді толық енгізіңіз.');
      return;
    }

    submitBtn.disabled = true;
    try {
      const rows = await sbFetch(
        `users?select=id,login,password,first_name,last_name,role,group_name,created_at&login=eq.${encodeURIComponent(normalizedLogin)}`
      );
      const user = Array.isArray(rows) ? rows[0] : null;

      if (!user) {
        logAudit({
          event: 'LOGIN_FAILED_NOT_FOUND',
          login: normalizedLogin,
          status: 'FAILED',
          details: 'Тіркелмеген логинмен кіру әрекеті қабылданбады.',
        });
        showAlert(notice, 'error', 'Бұл логин жүйеде тіркелмеген! Алдымен «Тіркелу» бөлімінен тіркеліңіз.');
        return;
      }

      const validPassword = await verifyPassword(password, user.password);
      if (!validPassword) {
        logAudit({
          event: 'LOGIN_FAILED_WRONG_PASSWORD',
          login: normalizedLogin,
          role: user.role,
          status: 'FAILED',
          details: 'Құпия сөз сәйкес келмеді.',
        });
        showAlert(notice, 'error', 'Құпия сөз қате! Қайта тексеріп енгізіңіз.');
        return;
      }

      const token = await signSessionToken({
        sub: user.id,
        login: user.login,
        role: user.role,
      });

      state.token = token;
      state.user = formatSafeUser(user);
      localStorage.setItem(SESSION_STORAGE_KEY, token);

      logAudit({
        event: 'LOGIN_SUCCESS',
        login: user.login,
        role: user.role,
        status: 'SUCCESS',
        details: `Жүйеге сәтті кіру орындалды (${user.first_name} ${user.last_name}).`,
      });

      e.target.reset();
      showWorkspace();
      await loadAllWorkspaceData();
    } catch (err) {
      showAlert(notice, 'error', 'Кіру қатесі: ' + err.message);
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchWorkspaceTab(btn.dataset.tab));
  });

  document.querySelectorAll('#archSvg .svg-node').forEach((node) => {
    node.addEventListener('click', () => {
      const key = node.dataset.node;
      const box = document.getElementById('diagramInspector');
      box.innerHTML = `<strong>Таңдалған компонент:</strong> ${esc(NODE_DESCRIPTIONS[key] || '')}`;
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (state.user) {
      logAudit({
        event: 'LOGOUT',
        login: state.user.login,
        role: state.user.role,
        status: 'INFO',
        details: 'Пайдаланушы сессияны аяқтап шықты.',
      });
    }
    forceLogout();
  });

  document.getElementById('refreshAllBtn').addEventListener('click', loadAllWorkspaceData);
  document.getElementById('refreshSecurityBtn').addEventListener('click', () => {
    renderAnalyticsAndSecurity();
  });

  document.getElementById('userSearchInput').addEventListener('input', renderUsersTable);
  document.getElementById('userRoleFilter').addEventListener('change', renderUsersTable);

  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const notice = document.getElementById('profileNotice');
    const firstName = document.getElementById('profFirstName').value.trim();
    const lastName = document.getElementById('profLastName').value.trim();
    const group = document.getElementById('profGroup').value.trim();

    if (firstName.length < 2 || lastName.length < 2) {
      showAlert(notice, 'error', 'Аты және тегі кемінде 2 таңбадан тұруы тиіс.');
      return;
    }

    try {
      const updated = await sbFetch(`users?id=eq.${encodeURIComponent(state.user.id)}`, {
        method: 'PATCH',
        prefer: 'return=representation',
        body: {
          first_name: firstName,
          last_name: lastName,
          group_name: group || null,
        },
      });
      const row = Array.isArray(updated) ? updated[0] : null;
      if (row) {
        state.user = formatSafeUser(row);
      }
      logAudit({
        event: 'PROFILE_UPDATED',
        login: state.user.login,
        role: state.user.role,
        status: 'SUCCESS',
        details: `Профиль жаңартылды: ${firstName} ${lastName} (${group || 'Тобы жоқ'}).`,
      });
      showWorkspace();
      showAlert(notice, 'success', 'Профиль деректері Supabase базасында сәтті жаңартылды.');
      await loadAllWorkspaceData();
    } catch (err) {
      showAlert(notice, 'error', err.message);
    }
  });

  document.getElementById('createRecordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const notice = document.getElementById('recordNotice');
    const name = document.getElementById('recordName').value.trim();
    let code = document.getElementById('recordCode').value.trim().toUpperCase();

    if (name.length < 2) {
      showAlert(notice, 'error', 'Бөлімше немесе пән атауы кемінде 2 таңба болуы тиіс.');
      return;
    }
    if (!code) {
      code = generateUnitCode();
    } else if (!/^[A-Z0-9-]{3,16}$/.test(code)) {
      showAlert(notice, 'error', 'Код 3–16 латын әрпі, цифр немесе сызықшадан тұруы тиіс.');
      return;
    }

    try {
      await sbFetch('classes', {
        method: 'POST',
        prefer: 'return=representation',
        body: {
          id: String(Date.now()),
          name,
          code,
          teacher_id: state.user.id,
          students: state.user.role === 'student' ? [state.user.id] : [],
        },
      });

      logAudit({
        event: 'RECORD_CREATED',
        login: state.user.login,
        role: state.user.role,
        status: 'SUCCESS',
        details: `Жаңа корпоративтік жазба құрылды: ${name} (${code}).`,
      });

      e.target.reset();
      showAlert(notice, 'success', 'Жаңа жазба Supabase базасына сақталды.');
      await loadAllWorkspaceData();
    } catch (err) {
      showAlert(notice, 'error', err.message);
    }
  });

  document.getElementById('exportCsvBtn').addEventListener('click', exportReportsCsv);
  document.getElementById('printReportBtn').addEventListener('click', () => window.print());
}

async function bootstrap() {
  wireEvents();
  if (!state.token) {
    showAuthGate();
    return;
  }

  const payload = await verifySessionToken(state.token);
  if (!payload) {
    logAudit({
      event: 'UNAUTHORIZED_ACCESS_BLOCKED',
      status: 'BLOCKED',
      details: 'Жарамсыз немесе мерзімі өткен сессия токені бұғатталды.',
    });
    forceLogout();
    return;
  }

  try {
    const rows = await sbFetch(
      `users?select=id,login,first_name,last_name,role,group_name,created_at&id=eq.${encodeURIComponent(payload.sub)}`
    );
    const user = Array.isArray(rows) ? rows[0] : null;
    if (!user) {
      forceLogout('Пайдаланушы Supabase базасынан табылмады. Қайта тіркеліңіз.');
      return;
    }

    state.user = formatSafeUser(user);
    showWorkspace();
    await loadAllWorkspaceData();
  } catch {
    forceLogout();
  }
}

bootstrap();
