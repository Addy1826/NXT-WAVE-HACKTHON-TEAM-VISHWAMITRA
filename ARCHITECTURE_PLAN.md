# 🏗️ ARCHITECTURE BLUEPRINT: Mental Health Platform
**Senior Architecture Review & Production Roadmap**

---

## 📊 EXECUTIVE SUMMARY

**Current Status:** Half-finished prototype with solid ML foundations but lacking production-grade UX, progressive profiling, and crisis safeguards.

**Critical Finding:** *Tech stack is sound, but the application lacks a "soul"—the empathetic design language and safety-first UX patterns needed for a mental health platform.*

**Mission:** Transform this into a scalable, HIPAA-ready, empathetic platform that feels like a "warm blanket" during a crisis.

---

## 🔍 CURRENT STATE ANALYSIS

### ✅ What's Working (The Good)

#### 1. **Tech Stack Verification**
| Component | Technology | Status | Assessment |
|-----------|-----------|--------|------------|
| Frontend | React 19 + Vite | ✅ Correct | Modern, fast. **NOT Next.js** (using Vite instead) |
| Backend | Node.js 18+ + Express | ✅ Correct | Solid foundation with TypeScript |
| Database | MongoDB (primary) | ✅ Correct | Good for chat/conversation storage |
| Database | PostgreSQL (mentioned) | ⚠️ Configured but unused | Docker setup exists, no Postgres models found |
| ML Service | Python + FastAPI | ✅ Correct | Advanced crisis detection (RoBERTa-based) |
| Cache/Sessions | Redis | ✅ Correct | Configured in Docker |

**Verdict:** Stack is production-ready. However, **PostgreSQL is defined but not utilized**—we're using MongoDB exclusively.

#### 2. **Existing Features (Implemented)**

**Frontend Pages:**
- ✅ Landing Page
- ✅ Login/Register Pages (traditional form-based)
- ✅ Patient Dashboard
- ✅ Chatbot Page (crisis detection integrated)
- ✅ Breathing Exercises
- ✅ Progress Tracking
- ✅ Resources Library
- ✅ Therapist Portal (complete with earnings, patients, sessions, video calls)

**Backend Capabilities:**
- ✅ Authentication (JWT-based)
- ✅ Real-time Chat (Socket.IO)
- ✅ Crisis Detection Service (10-level severity scoring)
- ✅ Therapist Matching Service
- ✅ Payment Integration (Razorpay)
- ✅ Video Call Infrastructure (WebRTC signaling)
- ✅ Appointment Scheduling
- ✅ Mood Tracking
- ✅ Notification Service (Email + SMS via Twilio)
- ✅ Rate Limiting & Security (Helmet, CORS, encryption middleware)

**ML Service:**
- ✅ Multi-language crisis detection (English, Spanish, French, German, Hindi, Arabic)
- ✅ Sentiment analysis (DistilBERT-based)
- ✅ Keyword-based severity scoring
- ✅ Context-aware escalation (time of day, conversation history)
- ✅ <200ms response time target

#### 3. **Infrastructure**
- ✅ Docker Compose setup (PostgreSQL, MongoDB, Redis, Nginx, Prometheus, Grafana)
- ✅ Health checks for all services
- ✅ Audit logging middleware
- ✅ Error handling & graceful degradation

---

### ❌ What's Missing (The Gaps)

#### **CRITICAL GAPS (Blocker for MVP)**

##### 1. **❌ Progressive Profiling System**
**Current:** Login requires full email/password upfront. No gradual onboarding.

**Required:**
- **Initial Touch:** "What brings you here today?" → Simple free-text or emotion picker
- **Defer Auth:** Allow anonymous chat for first 3-5 messages, *then* ask for email/name
- **Post-Login:** Gradual questions during chatbot flow (age, location, preferences)
- **No Walls:** Completely remove the "detailed form at signup" barrier

**Files to Create/Modify:**
- `frontend/src/pages/OnboardingPage.tsx` (NEW)
- `frontend/src/context/AuthContext.tsx` (MODIFY for anonymous sessions)
- `backend/src/routes/auth.ts` (MODIFY to support anonymous JWT)
- `backend/src/models/AnonymousSession.ts` (NEW)

---

##### 2. **❌ Crisis Protocol UI Override**
**Current:** Crisis detection exists in backend, but no UI "takeover" on frontend.

**Required:**
- **Auto-Detect:** When ML service returns `crisis_level >= 8`, chatbot UI should:
  - Pause conversation
  - Display **full-screen crisis intervention overlay** (not a small alert)
  - Show emergency helplines (Tele MANAS: 14416, etc.)
  - Offer "Connect to Therapist Now" button
  - Use **calming design** (soft lavender background, large readable text)

**Files to Create:**
- `frontend/src/components/CrisisInterventionModal.tsx` (NEW)
- `frontend/src/hooks/useCrisisDetection.ts` (NEW)
- `backend/src/services/crisisDetectionService.ts` (MODIFY to emit WebSocket events)

**Design Spec:**
```
┌─────────────────────────────────────┐
│   🛡️ We're Here to Help             │
│                                     │
│   [Large, readable text]            │
│   "It sounds like you're going      │
│   through something difficult.      │
│   You don't have to face this       │
│   alone."                           │
│                                     │
│   [Button: Talk to Someone Now]    │
│   [Button: Call Helpline]          │
│                                     │
│   📞 Tele MANAS: 14416 (24/7)      │
│   📞 Vandrevala: 1860-266-2345     │
└─────────────────────────────────────┘
```

---

##### 3. **❌ "Radical Calm" Design System**
**Current:** Generic Tailwind colors (sky blue, purple). Feels like a standard SaaS app.

**Required Color Palette:**
| Token | Hex | Usage |
|-------|-----|--------|
| `sage-50` | `#f5f8f5` | Background (main) |
| `sage-100` | `#e8ede8` | Cards, secondary bg |
| `sage-500` | `#7d9c7d` | Primary actions, links |
| `sage-700` | `#4a6b4a` | Hover states |
| `lavender-100` | `#f3f0ff` | Accent bg (calm zones) |
| `lavender-400` | `#b197fc` | Focus rings |
| `cream-50` | `#fffef7` | Alternative light bg |
| `warm-gray-600` | `#57534e` | Body text |
| `red-danger` | `#ef4444` | **ONLY for critical crisis alerts** |

**Typography:**
- Font Family: `Inter` (body), `Poppins` (headings)
- Font Sizes: Larger than typical (16px base, 18px for readability)
- Line Height: 1.7 (generous for anxiety reduction)

**Motion:**
- Transition Duration: `300ms` (slow, deliberate)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out, no jarring)
- **No Sudden Animations** (fade in/out only, no scale or rotate)

**Files to Create/Modify:**
- `frontend/tailwind.config.js` (REPLACE color palette)
- `frontend/src/index.css` (ADD custom fonts, base typography)
- `frontend/src/styles/design-tokens.css` (NEW - CSS variables)

---

##### 4. **❌ AI Chatbot "Triage Nurse" Personality**
**Current:** Generic bot responses. No personality or safety disclaimers.

**Required:**
- **Tone:** Warm, non-clinical, empathetic (e.g., "I hear you. That sounds really hard.")
- **Never Diagnose:** Always say "I'm here to listen and connect you with help" (not "You have depression")
- **Suggest, Don't Prescribe:** "Would you like to talk to a therapist?" (not "You need therapy")
- **Safety Disclaimer:** First message should include: *"I'm here to support you, but I'm not a replacement for professional care."*

**Files to Modify:**
- `backend/src/services/chatService.ts` (Update `generateBotResponse` logic)
- `backend/src/services/geminiService.ts` (Add system prompt for empathetic tone)

---

#### **HIGH-PRIORITY GAPS (Needed for Production)**

##### 5. **⚠️ Database Schema Confusion**
**Issue:** Docker Compose defines PostgreSQL, but *all models use MongoDB*. No Postgres schemas exist.

**Decision Needed:**
- **Option A:** Remove PostgreSQL, go MongoDB-only (simpler for MVP)
- **Option B:** Migrate user/therapist data to PostgreSQL, keep MongoDB for chat (better for scale)

**Recommendation:** **Option B** for production. Relational data (users, appointments, payments) belongs in PostgreSQL. Chat/messages stay in MongoDB.

**Action Items:**
- Create Prisma schema for PostgreSQL
- Migrate `User`, `Therapist`, `Appointment` models to Postgres
- Keep `Conversation`, `Chat`, `Mood` in MongoDB

---

##### 6. **⚠️ Missing Environment Configuration**
**Current:** `.env.example` doesn't exist. No `.env` template.

**Required:**
- Create `.env.example` with all required variables
- Document each variable's purpose
- Add validation on server startup

**Files to Create:**
- `.env.example`
- `backend/src/config/validateEnv.ts` (NEW)

---

##### 7. **⚠️ No End-to-End Testing**
**Current:** No test files found in `frontend/` or `backend/`.

**Required (Post-MVP):**
- Playwright for critical flows (signup, crisis detection, video call)
- Jest for backend unit tests (crisis scoring logic)
- Cypress component tests for `CrisisInterventionModal`

---

##### 8. **⚠️ HIPAA Compliance Gaps**
**Current:** Encryption middleware exists, but:
- ❌ No data retention policy
- ❌ No patient consent tracking
- ❌ No audit trail for therapist access
- ❌ No encryption-at-rest for MongoDB

**Action Items:**
- Add `dataRetentionDays` field to User model
- Implement `ConsentLog` model
- Enable MongoDB encryption (WiredTiger)
- Add therapist access logging to `auditLogger.ts`

---

## 🛤️ "VIBE CODING" ROADMAP

### **Phase 1: Foundation (Week 1-2)** 🟢

#### **1.1 Design System Overhaul**
- [ ] Replace Tailwind color palette with Sage/Lavender/Cream
- [ ] Add Inter & Poppins fonts via Google Fonts
- [ ] Create `design-tokens.css` with CSS variables
- [ ] Update all existing components to use new palette
- [ ] Add smooth transition utilities

**Files:**
- `frontend/tailwind.config.js`
- `frontend/src/index.css`
- `frontend/src/styles/design-tokens.css` (NEW)

---

#### **1.2 Progressive Profiling Implementation**
- [ ] Create `OnboardingPage.tsx` (emotion picker, "What brings you here?")
- [ ] Modify `AuthContext` to support anonymous sessions
- [ ] Add `AnonymousSession` model (MongoDB)
- [ ] Update `auth.ts` routes to issue temporary JWT for anonymous users
- [ ] Add "Upgrade to Full Account" flow after 5 messages

**Files:**
- `frontend/src/pages/OnboardingPage.tsx` (NEW)
- `frontend/src/context/AuthContext.tsx` (MODIFY)
- `backend/src/models/AnonymousSession.ts` (NEW)
- `backend/src/routes/auth.ts` (MODIFY)

---

#### **1.3 Crisis Protocol UI**
- [ ] Create `CrisisInterventionModal.tsx` (full-screen overlay)
- [ ] Create `useCrisisDetection` hook (WebSocket listener)
- [ ] Modify `crisisDetectionService.ts` to emit `crisis:critical` event
- [ ] Add helpline data to `server.ts` (Indian helplines)
- [ ] Test with sample crisis messages

**Files:**
- `frontend/src/components/CrisisInterventionModal.tsx` (NEW)
- `frontend/src/hooks/useCrisisDetection.ts` (NEW)
- `backend/src/services/crisisDetectionService.ts` (MODIFY)

---

### **Phase 2: Intelligence (Week 3-4)** 🟡

#### **2.1 AI Personality Refinement**
- [ ] Add empathetic system prompt to `geminiService.ts`
- [ ] Create response templates by crisis level (1-10)
- [ ] Add safety disclaimers to first bot message
- [ ] Implement "Check-in" messages (e.g., "How are you feeling now?")

**Files:**
- `backend/src/services/geminiService.ts`
- `backend/src/services/chatService.ts`
- `backend/src/config/bot-personality.json` (NEW)

---

#### **2.2 Database Architecture Cleanup**
- [ ] Install Prisma (`npm install prisma @prisma/client`)
- [ ] Create `prisma/schema.prisma`
- [ ] Migrate `User`, `Therapist`, `Appointment` to PostgreSQL
- [ ] Update controllers to use Prisma Client
- [ ] Test dual-database setup (Postgres + MongoDB)

**Files:**
- `backend/prisma/schema.prisma` (NEW)
- `backend/src/models/*.ts` (MODIFY/DELETE)
- `backend/src/controllers/auth.ts` (MODIFY)

---

### **Phase 3: Security & Compliance (Week 5-6)** 🔴

#### **3.1 HIPAA Compliance**
- [ ] Add `ConsentLog` model (track user consent for data use)
- [ ] Implement data retention policy (auto-delete after 7 years)
- [ ] Enable MongoDB encryption-at-rest
- [ ] Add therapist access audit trail
- [ ] Generate HIPAA compliance checklist

**Files:**
- `backend/src/models/ConsentLog.ts` (NEW)
- `backend/src/middleware/auditLogger.ts` (ENHANCE)
- `backend/src/scripts/data-retention-cleanup.ts` (NEW)

---

#### **3.2 Rate Limiting & Security**
- [ ] Add stricter rate limits for crisis endpoints (5 req/min)
- [ ] Implement CAPTCHA for registration (hCaptcha)
- [ ] Add IP-based abuse detection
- [ ] Set up CSP headers for XSS protection (already in `helmet`)

**Files:**
- `backend/src/middleware/rateLimiter.ts` (NEW)
- `backend/src/server.ts` (MODIFY)

---

### **Phase 4: Polish & Testing (Week 7-8)** 🎨

#### **4.1 UX Refinements**
- [ ] Add loading skeletons (no spinners—use content placeholders)
- [ ] Implement "typing indicators" for chatbot
- [ ] Add smooth page transitions (Framer Motion)
- [ ] Create empty states for all pages (e.g., "No appointments yet")
- [ ] Add micro-interactions (button hover states, focus rings)

**Files:**
- `frontend/src/components/LoadingSkeleton.tsx` (NEW)
- `frontend/src/components/TypingIndicator.tsx` (NEW)

---

#### **4.2 E2E Testing**
- [ ] Set up Playwright
- [ ] Write tests for:
  - Anonymous onboarding → Chat → Signup
  - Crisis detection → Modal appears
  - Therapist matching → Video call
- [ ] Add CI/CD pipeline (Github Actions)

**Files:**
- `tests/e2e/crisis-flow.spec.ts` (NEW)
- `.github/workflows/test.yml` (NEW)

---

## 🚨 CRITICAL DECISIONS NEEDED FROM YOU

Before proceeding, I need your input on:

1. **Database Strategy:**
   - Keep MongoDB only? (Simpler)
   - OR Migrate to dual Postgres+MongoDB? (Better for scale)

2. **MVP Scope:**
   - Should we build **all** of Phase 1-4? (8 weeks)
   - OR prioritize **Phase 1 only** (2 weeks) for a lean MVP?

3. **Design Approval:**
   - Do you approve the Sage/Lavender/Cream color palette?
   - OR provide your own brand colors?

4. **Authentication:**
   - OK with anonymous chat for first 5 messages?
   - OR require email upfront (contradicts "No Login Wall")?

---

## 📐 TECHNICAL DEBT

### **Current Issues to Address:**
1. **Frontend is Vite, not Next.js** (acceptable, but less SEO-friendly)
2. **No API documentation** (need Swagger/OpenAPI spec)
3. **No monitoring in production** (Prometheus setup exists but not integrated)
4. **File uploads missing** (for user avatars, therapist verification docs)
5. **No mobile app** (PWA capabilities not configured)

---

## 🎯 SUCCESS METRICS (Post-Launch)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Crisis Detection Accuracy | >90% | User feedback surveys |
| Time to Therapist Match | <5 minutes | Backend analytics |
| First Message Latency | <200ms | ML service monitoring |
| User Retention (Week 1) | >60% | Analytics dashboard |
| Crisis Escalation Rate | <5% of chats | Database queries |

---

## 🛠️ IMMEDIATE NEXT STEPS

Once you approve this plan, I will:

1. **Create a Task Breakdown** (`TASKS.md`)
2. **Implement Phase 1.1** (Design System Overhaul)
3. **Build `OnboardingPage.tsx`** (Progressive Profiling)
4. **Create Crisis Modal** (Safety Protocol)

**Estimated Time for Phase 1:** 2 weeks with 1 full-time developer.

---

## 📞 QUESTIONS? CONCERNS?

Reply with:
- Decision on database strategy
- Approval/changes to color palette
- MVP scope (Phases 1-4 or just Phase 1?)

I'm ready to "vibe code" this into a platform that truly cares.

**— Your Senior Architect**
