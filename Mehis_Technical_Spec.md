# Mehis - Complete Technical Specification

## Current Status (April 10, 2026)

### What's Working
- ✅ Telegram bot running with Ollama/Mehis model
- ✅ Discord bot running with Ollama/Mehis model  
- ✅ Question tracking in Supabase (creates new rows instead of updating - bug)
- ✅ Website login (Discord OAuth + Email)
- ✅ Website dashboard with chat UI
- ✅ Discord OAuth connected to Supabase

### What's NOT Working
- ❌ Dashboard chat (CORS blocked - can't connect to localhost Ollama from GitHub Pages)
- ❌ Question counter increments properly (creates duplicates instead of updating)
- ❌ User data not fully connected to dashboard

---

## PART 1: IMMEDIATE FIXES (This Week)

### 1.1 Fix Question Counter (Critical)
**Problem:** Bot creates new row each time instead of updating existing row
**Root Cause:** No unique constraint on user_id + increment logic broken
**Fix Required:**
- Add unique index on usage.user_id in Supabase
- Change code from POST to PATCH or use UPSERT
- Test: Verify count increments properly (1, 2, 3... not always 1)

### 1.2 Fix Telegram Bot
**Required:**
- Ensure adhd_coach_bot.py is in private repo
- Test with /start command
- Add question tracking (same as Discord)
- Deploy on server that runs 24/7 (not local PC)

### 1.3 Dashboard Chat Fix
**Required:** Two solutions
- **Option A:** Run local server for website (not GitHub Pages)
- **Option B:** Set up backend API that connects to Ollama

---

## PART 2: PLATFORM INTEGRATION

### 2.1 Telegram Bot (@Mehis)
**Features Required:**
- [ ] Basic AI responses (DONE)
- [ ] Question tracking per user (PARTIAL - broken)
- [ ] Daily limit enforcement (10 free, premium unlimited)
- [ ] /start command with welcome message
- [ ] /help command with instructions
- [ ] /status command showing question count
- [ ] Premium subscription prompts
- [ ] Multi-child support (families with multiple kids)
- [ ] Language selection (EN, ET, RU)

**Infrastructure:**
- Bot Token: 8682826816:AAFAal7fADDVxjAjPL6yfeZ2zlfrFEPRwP4
- Needs 24/7 hosting (not local PC)

### 2.2 Discord Bot (@Mehis)
**Features Required:**
- [ ] Basic AI responses (DONE)
- [ ] Question tracking per user (PARTIAL - creates duplicates)
- [ ] Daily limit enforcement (PARTIAL)
- [ ] Welcome message for new users
- [ ] Channel-specific responses
- [ ] Premium role assignment

**Infrastructure:**
- Discord App: Mehis
- Client ID: 1491751860640550912
- Bot Token: (get from Discord Developer portal)

### 2.3 Website Dashboard (alexsproject.github.io/Mehis_web)
**Features Required:**
- [x] Login with Discord (DONE)
- [x] Login with Email (DONE)
- [x] Dashboard with account info (PARTIAL)
- [x] Chat UI (EXISTS but CORS broken)
- [ ] Connect chat to backend (NOT WORKING)
- [ ] Show question count from database
- [ ] Premium upgrade UI
- [ ] User profile management

**Alternative Domain:** mehis.app (future)

### 2.4 Website Chat Integration
**Options:**
- **Option A:** Local server (users run locally)
- **Option B:** Backend API server (recommended for production)
- **Option C:** WebRTC direct connection (complex)

---

## PART 3: BACKEND ARCHITECTURE

### 3.1 Database (Supabase)

#### Tables Required:
```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  tier TEXT DEFAULT 'free', -- free, premium, family
  created_at TIMESTAMP,
  telegram_id TEXT,
  discord_id TEXT
)

-- Question tracking
usage (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL, -- can be discord_id or telegram_id
  question_today INT DEFAULT 0,
  date DATE NOT NULL,
  UNIQUE(user_id, date)
)

-- Payments (future)
payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INT,
  status TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMP
)

-- Children (for families)
children (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT,
  age INT,
  diagnosis TEXT,
  created_at TIMESTAMP
)
```

#### Required Actions:
- [ ] Add unique constraint on usage(user_id, date)
- [ ] Add RLS policies (allow read/write with proper authentication)
- [ ] Set up triggers for daily reset at midnight

### 3.2 Backend API Server

**Technology Stack:**
- **Option A:** Node.js + Express (simple)
- **Option B:** Python + FastAPI (Ollama integration)
- **Option C:** Supabase Edge Functions (serverless)

**Required Endpoints:**
```
POST /api/chat
  - Input: { message: string, user_id: string, platform: string }
  - Output: { response: string }
  - Rate limiting: 10 requests/day for free

GET /api/usage/:user_id
  - Returns current day's question count

POST /api/usage/increment
  - Increments question count for user

POST /api/auth/register
  - Creates user account

POST /api/auth/login
  - Returns JWT token
```

### 3.3 Ollama Integration

**Current Setup:**
- URL: http://localhost:11434
- Model: mehis (fine-tuned Llama 3.1 8B)

**For Production:**
- Need to host Ollama on server (not localhost!)
- Options:
  1. Run Ollama on same server as backend
  2. Use third-party Ollama hosting
  3. Use OpenAI API as fallback (paid)

### 3.4 Security Requirements

- [ ] JWT authentication for all API endpoints
- [ ] Rate limiting (10 req/day free, unlimited premium)
- [ ] Input sanitization (prevent prompt injection)
- [ ] HTTPS/TLS for all connections
- [ ] Environment variables for secrets (not hardcoded)
- [ ] API key rotation
- [ ] Backup strategy for database
- [ ] GDPR compliance (user data privacy)

---

## PART 4: INFRASTRUCTURE

### 4.1 Hosting Requirements

**For 24/7 Operation:**

| Component | Current | Needed |
|-----------|---------|--------|
| Telegram Bot | Local PC | Server (VPS/Cloud) |
| Discord Bot | Local PC | Server (VPS/Cloud) |
| Ollama AI | Local PC | Server (VPS/Cloud) |
| Website | GitHub Pages | VPS or Netlify/Vercel |
| Database | Supabase | Supabase (good) |
| Backend API | None | Server needed |

**Recommended Stack:**
- **VPS:** DigitalOcean ($20/mo) or Hetzner (€10/mo)
- **Database:** Supabase (free tier)
- **CDN:** Cloudflare (free)
- **Domain:** mehis.app (~$10/year)

### 4.2 Deployment Steps

```
Week 1: Fix critical bugs
  - Fix question counter
  - Fix Telegram bot deployment
  
Week 2: Backend development
  - Set up VPS server
  - Deploy backend API
  - Connect Ollama to server
  
Week 3: Website improvements
  - Fix dashboard chat
  - Connect to backend API
  - Add premium UI
  
Week 4: Testing & Launch
  - Security audit
  - Load testing
  - Bug fixes
  - Public launch
```

---

## PART 5: FEATURE ROADMAP

### Phase 1: MVP (Now)
- [x] Discord bot
- [x] Telegram bot  
- [x] Basic question tracking (broken)
- [x] Website login
- [ ] Fix question counter

### Phase 2: Launch Ready
- [ ] 24/7 bot hosting
- [ ] Proper backend API
- [ ] Question counter fixed
- [ ] Premium subscriptions
- [ ] Multi-child support

### Phase 3: Scale
- [ ] Mobile app
- [ ] WhatsApp integration
- [ ] Email support
- [ ] Therapist marketplace
- [ ] Family plans

---

## PART 6: BUDGET

### Free Tier:
- Supabase (free)
- GitHub Pages (free)
- Discord (free)

### Paid (~$50-100/month):
- VPS server: €20/month
- Domain: €10/year
- Optional: OpenAI API fallback: ~$20/month

---

## SUMMARY: WHAT TO DO RIGHT NOW

1. **Fix question counter** (30 min)
   - Add unique index to Supabase
   - Fix increment code

2. **Deploy Telegram bot** (1 hour)
   - Get VPS server
   - Deploy bot code

3. **Fix dashboard chat** (2 hours)
   - Option A: Local server
   - Option B: Backend API

4. **Test everything** (1 day)

5. **Launch publicly** 

---

## CURRENT TOKENS & KEYS (SECURE!)

- Supabase URL: etgaxhkizapqzzxdttrn.supabase.co
- Supabase Keys: (in config files)
- Discord Bot Token: (in private repo)
- Telegram Bot Token: 8682826816:AAFAal7fADDVxjAjPL6yfeZ2zlfrFEPRwP4
- GitHub Token: [SECRET_REMOVED]

EOF