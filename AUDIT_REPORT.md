# 🩺 Deep Codebase Audit: Wallet Waitlist

**Date:** January 29, 2026
**Auditor:** Antigravity (Principal Engineer)
**Scope:** Frontend (`src/app/wallet-waitlist`), Backend (`backend/src`), Database, API, Auth

---

## 🔴 CRITICAL ISSUES (Must Fix ASAP)

### 1. Banned Users Can Still Login & Act
**Location:** `backend/src/modules/auth/service.ts` (Lines 119-191) & `waitlist/service.ts`
**Explanation:** The `loginUser` function verifies email and password but **completely ignores** the `isBanned` field. A user marked as `isBanned: true` in the database can successfully log in and receive a valid JWT. Furthermore, the `completeTask` and other waitlist services do not check the `isBanned` status of the user before awarding points.
**Impact:** A malicious user or bot farm you "banned" can continue to log in, farm points, and pollute your leaderboard.
**Risk Level:** **High**
**Recommendation:** 
1. Add `if (user.isBanned) throw new ForbiddenError('Account suspended');` in `loginUser`.
2. Add a global hook or middleware check for `isBanned` on every authenticated request, or check it in the `getAuthUser` helper.

### 2. Hardcoded Admin Backdoor in Frontend
**Location:** `src/app/wallet-waitlist/components/WaitlistLayout.tsx` (Line 68)
**Explanation:** The code contains a hardcoded user ID logic for admin access: `user.id === '019bf0e4-f6ba-7881-b73a-9e4ccb0afdb7'`.
**Impact:** If this ID belongs to a developer or a specific user, it creates a permanent backdoor that survives role changes. If this ID is guessable or leaks, anyone with it gets admin UI access (though backend *should* still reject them if middleware is correct, relying on frontend security is bad practice).
**Risk Level:** **High**
**Recommendation:** Remove the hardcoded ID check immediately. Rely strictly on `user.role === 'ADMIN' | 'SUPERADMIN'`.

### 3. Missing Wallet Login Implementation (Broken Flow)
**Location:** `backend/src/modules/auth/service.ts` (Line 189) vs `Frontend Login`
**Explanation:** The frontend `login` function allows submitting `walletAddress` and `signature`. However, the backend explicitly throws `UnauthorizedError('Invalid login credentials')` because the wallet login logic is commented out/not implemented: `// Wallet-based login not yet implemented`.
**Impact:** Users attempting to log in with a wallet (a core Web3 feature) will fail with a generic "Invalid credentials" error, confusing them.
**Risk Level:** **Medium** (Functional Break)
**Recommendation:** Either implement the signature verification (e.g., using `verifyMessage` from `ethers`/`viem`) or remove the Wallet Login option from the frontend until ready.

---

## 🟠 MAJOR ISSUES

### 4. "Trust-Me-Bro" Task Verification
**Location:** `src/app/wallet-waitlist/components/TaskCard.tsx` & `backend/src/modules/waitlist/service.ts`
**Explanation:** Task verification is purely client-side timing. The frontend waits random seconds or 5 minutes (for blog) and then calls `completeTask`. The backend `completeTask` **does not verify** if the action (Twitter follow, Telegram join) actually happened.
**Impact:** Users can click every task, wait a few seconds, and farm maximum points without engaging with the community. This devalues the PXP currency and gamification.
**Risk Level:** **Medium** (Business Logic)
**Recommendation:** 
1. For Twitter/Discord, use OAuth callbacks to verify joins/follows server-side.
2. For "Visit" tasks, this is acceptable, but for "Join" tasks, it is not.
3. If real verification is too hard for v1, rename tasks to "Visit X" instead of "Follow X" to be honest.

### 5. Referral System Race Condition
**Location:** `backend/src/modules/auth/service.ts` (Lines 60-70)
**Explanation:** The code performs a `findFirst` to get the referrer, then later does an `update`. In a high-concurrency environment (e.g., viral launch), distinct transactions might overlap. While Prisma `increment` is atomic for the balance, the logic relies on extensive state logic in the app layer.
**Impact:** Minor risk of inconsistency or double-counting if logic becomes more complex.
**Risk Level:** **Low/Medium**
**Recommendation:** Use a transaction for the entire signup flow: creating the user and updating the referrer should happen atomically to ensure data integrity.

### 6. Inefficient Leaderboard Rank Calculation
**Location:** `backend/src/modules/waitlist/service.ts` (getUserStats)
**Explanation:** The rank calculation uses `db.user.count({ where: { pxpBalance: { gt: user.pxpBalance } } })`.
**Impact:** This is an O(N) operation. As the user base grows to 10k, 100k, or 1M, this query will become extremely slow and slam the database CPU on every dashboard load.
**Risk Level:** **Medium** (Scalability)
**Recommendation:** Rely on the Redis Sorted Set (`waitlist:leaderboard`) for rank queries (`zRevRank`), which is O(log N). Only fallback to DB if Redis is down.

---

## 🟡 MINOR ISSUES / TECH DEBT

### 7. Missing Auth Guards on Waitlist Routes
**Location:** `backend/src/modules/waitlist/routes.ts` (Line 10)
**Explanation:** There is a comment `// TODO: Add Auth Guard here (onRequest hook)`. While the controllers call `getAuthUser` (which checks auth), it is safer and cleaner to enforce this at the route/plugin level to prevent accidental exposure of new endpoints.
**Impact:** Maintenance risk. New dev might add a handler that forgets to call `getAuthUser`.
**Recommendation:** Implementation `server.addHook('onRequest', verifyJwt)` or similar.

### 8. Redis Connection Race Condition
**Location:** `backend/src/shared/redis.ts`
**Explanation:** Redis connects asynchronously without `await` at the top level. The app starts immediately.
**Impact:** If a request comes in ms after startup, `redisClient` might be null, causing a "cache miss" behavior even if Redis is up.
**Recommendation:** Await the Redis connection in `app.ts` before starting the Fastify server.

### 9. Task Type Inconsistency
**Location:** `Frontend Admin` sends `type: "ONE_TIME"` vs `Backend Enum`
**Explanation:** Ensure the string literals in frontend match the Prisma enum `TaskType` exactly.
**Recommendation:** Share types between frontend and backend (e.g., usage of `nx` or a shared types package) or rigorously check casing.

---

## 🟢 IMPROVEMENTS & OPTIMIZATIONS

*   **Optimistic UI Updates:** The `TaskCard` waits for the timer *then* the API call. It could feel snappier.
*   **Security**: Implement `helmet` and `rate-limit` (Good job, these are already in `app.ts`!).
*   **Logging**: `logger.ts` is used, but error handler could be more robust in distinguishing 4xx vs 5xx for alerting.

---

## 🧠 OVERALL CODEBASE HEALTH SUMMARY

**Strengths:**
*   Clean code structure (Modules pattern is nice).
*   Use of Zod for validation is excellent.
*   Frontend UI code is modern (Tailwind + Framer Motion).
*   Separation of concerns is generally good.

**Weaknesses:**
*   **Security Theater**: Verification is fake.
*   **Auth Holes**: Banning logic is incomplete; Admin logic relies on hardcodes.
*   **Scalability**: DB-based ranking will hurt.

**Risk Profile:** **Medium-High**. The app looks good but is vulnerable to abuse (farming) and simple hacks (banned users).

**Readiness for Scale:** **Low**. The database rank query is a killer bottleneck for a leaderboard-focused app.

## 🏁 Fix Roadmap (Suggested)

1.  **Security Hotfix**: Add `isBanned` check to login & auth middleware. Remove hardcoded admin ID.
2.  **Auth Fix**: Implement or Hide Wallet Login.
3.  **Performance**: Move Rank calculation to Redis exclusively.
4.  **Feature**: Implement real OAuth for Twitter/Discord tasks.
