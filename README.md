# Rakt — Blood Help (Prototype)

Emergency blood-donor matching demo in a **single HTML file** (`index.html`, ~74KB, no build step, no backend).
A needer broadcasts in ~1 minute; only nearby, compatible, eligible donors get pinged; a live tracker,
escalation ladder, coordinator desk, hospital fast lane, thalassemia circles, and a bank admin console
complete the loop described in `RaktCo Mechanism.pdf`.

---

## 1. Setup instructions

### Requirements
- Any modern browser (Chrome recommended — needed for mic/voice legs, optional elsewhere).
- Internet **once** per load for CDNs: Tailwind Play CDN + Google Fonts (Fraunces, Manrope, JetBrains Mono).
- No install, no build, no server required. Location permission is optional (falls back to Delhi).

### Run it (pick one)
```powershell
# Option A — fastest: double-click index.html (file:// works; WhatsApp/call links still work)
# Option B — recommended: serve over http so geolocation + clipboard behave best
python -m http.server 8000
# then open http://localhost:8000
# Option C
npx serve .
```

### First-time walkthrough (60 seconds)
1. Landing → **I Need Blood** → tap a blood group → pick hospital / bags / phone / urgency → Review → enter the mock OTP shown on screen → **SEND**.
2. Live tracker counts up; 2 demo donors auto-accept; cards show WhatsApp / Call / Way / Share.
3. Switch to **Donate** tab → act as a donor → **I CAN DONATE** → answer the 4 health questions → Confirm → you appear on the live tracker.
4. Fastest path: landing → **Emergency SOS** → group + urgency + bags → **SEND EMERGENCY ALERT**.

---

## 2. Architecture documentation

### 2.1 Layout (single file)
```
index.html
├── <style>            design system: ivory/maroon/gold theme, cards, big buttons,
│                      toggles, radar box, modals, toasts, floating-blood canvas, ECG strip
├── header             logo (home), clock + LIVE badge, tabs Need/Donate/SOS, Staff drawer
├── #landing           first screen: Need / Donate / Emergency / Staff
├── main #views
│   ├── #viewNeed      4-step wizard: Blood → Details → Send → Live (+ radar + donor tools)
│   ├── #viewDonate    donor profile, toggles, incoming request, 4-Q quiz, register form
│   ├── #viewEm        express emergency form (shares the Need live screen)
│   ├── #viewTeam      coordinator console (requests, confirm/fake, widen, takeover, banks, alert log, history)
│   ├── #viewHosp      hospital mock login + Verify → Tier 3
│   ├── #viewCircle    thalassemia circles (scheduled requests, rotation)
│   └── #viewBank      bank admin (open request, response times, stock editor, camps)
├── modals             compat chart, lifesaver certificate
├── #toasts            transient feedback
└── <script> ×2        (1) app: data + engine + renders + radar  (2) ambient blood canvas
```

### 2.2 Runtime model
- **View router:** `nav(view)` toggles the 7 panes + staff drawer tabs; `chooseRole()` from landing; logo → `goLanding()`.
- **Need wizard:** `ndShow(1..4)` renders Blood → Details → Review(+OTP) → Live. Emergency (`emBroadcast`) reuses the same broadcast + live screen.
- **Broadcast engine** (`fireBroadcast`): guards → tier init → wave-1 cap → timers → simulated accepts → ladder.
- **Donor side:** `renderDonate()` gates visibility (compatible + eligible + on-duty + this-week + not opted-out + live stage); quiz → `donorAccepts()` → masked reveal (contact appears only post-accept).
- **Radar:** two `requestAnimationFrame` canvases (`initRadar`), sweep lights up dots: green = reachable, grey = resting, red = bank.
- **Persistence (localStorage):** `rakt_hist` (last 8 requests), `rakt_block` (fake numbers), `rakt_rate` (daily caps),
  `rakt_ping` (pings per donor/year), `rakt_remind` (eligibility-day reminders), `rakt_stock`/`rakt_camps` (bank edits),
  `rakt_extra` (registered donors).

### 2.3 Request lifecycle (PDF §2)
`idle → live(waves) → done(fulfilled) | done(cancelled) | takeover(expired)`
- Deadlines: Critical 60 min / Urgent 4 hrs / Planned 24 hrs, live countdown, auto-expire → Team desk.
- Tier 1 (`Unverified`, cap 4) → Tier 2 (`Checked`, cap 8, coordinator confirms hospital) → Tier 3 (`Verified by X`, cap 12, hospital verifies). Verification never blocks wave 1 (parallel).
- Escalation ladder: 25 s widen (Tier-1 gated) → 60 s bank alert → 120 s coordinator page.

### 2.4 Trust, privacy, guards (PDF §§3–4)
- Requester OTP entry on review screen (mock code shown on screen); emergency path auto-verifies so alerts are never delayed.
- Donor phone masked pre-accept; revealed only in post-accept cards. Requester phone masked in Team desk.
- Fake flow: coordinator Fake → request cancelled, acceptors notified, number blocked.
- Rate limits: 3/phone/day, 5/hospital/day. Donor Report → flags Team desk. Declines logged in alert log.
- Eligibility: 90 days (Male) / 120 days (Female, doctor-tunable `GAP`), + on-duty + this-week + opt-out + age 18–65 + 45 kg+ at registration.

---

## 3. Sample data (baked into the file)

### Donors (12 seed + user-registered → `rakt_extra`)
| Name | Group | Last donation | Note |
|---|---|---|---|
| Aman | A+ | 120d ago | eligible, platelet-eligible |
| Priya | O+ | 200d ago | eligible |
| Gurjot | B+ | 30d ago | resting (<90d), never pinged |
| Neha | A− | 150d ago | eligible, not platelet-flagged (narrower pool demo) |
| Rahul | O− | 400d ago | eligible universal donor |
| Sana | AB+ | 95d ago | eligible but **off this week** (reachable-only demo) |
| Vikram | A+ | 20d ago | resting |
| Kavya / Arjun / Meera / Farhan / Simran | mixed | 110–250d | eligible pool |

### Blood banks (9, mock stock, editable in Bank tab → `rakt_stock`)
AIIMS, Safdarjung, Red Cross (LOW), LNJP, Max Saket (LOW), Fortis Okhla, Faridabad, Meerut 65KM, Alwar 150KM+.
Sorted live by haversine distance from geolocation (Delhi fallback).

### Circles (mock)
- Aarav (B+, every 28d @ AIIMS Day Care) — members Aman, Kavya, Meera
- Zara (O−, every 21d @ LNJP Day Care) — members Rahul, Neha

---

## 4. Test cases

### PDF scenarios (PDF §10)
| # | Scenario | Steps | Expected |
|---|---|---|---|
| 1 | Happy path | Need → A+ → nearest bank → 2 bags → OTP → SEND → wait ~10 s | 2 accept cards appear with WA/Call; mark ✔ Done → certificate + reminders saved |
| 2 | No response | Throttle: use AB− (tiny pool) or decline as each donor; wait past deadline* | Request flips Expired → lands on Team desk top |
| 3 | Fast lane | Fire SOS → Team/Hospital tab → enter hospital name → VERIFY | Tier → 3, tag “Verified by X”, wave widens |
| 4 | Fake request | Team desk → ✘ FAKE | Cancelled, acceptors notified, number blocked (re-send from same phone is refused) |
| 5 | Ineligible donor | Donate as Gurjot/Vikram during a live compatible request | “No alert — donated recently” |
| 6 | Privacy | Before any accept, inspect needer side | No donor phone visible anywhere; full number only inside post-accept cards |

\* Demo deadlines are compressed in code comments; force it by temporarily lowering `S.deadline` in console, or observe the 25/60/120 s ladder live.

### Feature tests (user-requested set)
| Feature | Test | Expected |
|---|---|---|
| Escalation ladder | Fire request, accept nothing for 25 s (Tier 2 via Team confirm first) | +donors widen at 25 s → bank alert at 60 s → coordinator paged at 120 s |
| Availability toggle | Donate → uncheck “Free this week” during live matching request | Request card disappears (“paused this week”) |
| Components | Details step → Platelets, send | Pending pool narrower than whole-blood pool; Plasma narrowest (AB/A−/B− only) |
| Circles | Circles tab → SEND SCHEDULED REQUEST (Aarav) | 2 fittest members pinged, rotation dates update; empty circle → fallback message |
| Post-donation loop | ✔ Done with ≥1 accept | Certificate modal with names; donor card shows “reminder <date>” |
| Bank admin | Bank tab → set Red Cross LOW→YES, units 3; add camp | Chat bank list reflects stock; camp persists after reload |
| OTP | Review → SEND without code | Blocked until correct mock code entered; emergency path skips (never blocks alerts) |
| Opt-out | Donate → Stop all alerts | No pings; “Opt back in” restores |
| Rate limit | Send 4th request same day (same phone) | Refused with limit toast |
| Gender gap | Donate profile → Female | Next-eligible uses 120-day rule |

### UI checks (non-tech bar)
- Landing is the first screen; logo returns home; Staff hidden in drawer.
- All primary buttons ≥52 px; chat-free wizard (Blood → Details → Send → Live) with step pills.
- No Hindi strings; no dev jargon on needer/donor surfaces (`grep` audit: 0 Devanagari runs).

---

## 5. Tuning constants (single places to change)
| What | Where | Default |
|---|---|---|
| Tier caps | `TIER_CAP` | 1:4, 2:8, 3:12 |
| Eligibility gaps | `GAP` | Male 90 / Female 120 (needs doctor sign-off) |
| Deadlines | `fireBroadcast` (`S.deadline`) | Critical 60 m / Urgent 4 h / Planned 24 h |
| Ladder timing | `escalate25`/`bankAlert`/`coordPing` timeouts | 25 s / 60 s / 120 s (demo-compressed; use minutes in prod) |
| Auto demo accepts | `fireBroadcast` `pending.slice(0,2)` | first 2, 3.5 s apart (demo liveliness — remove for real backend) |
| Registration rules | `registerDonor` | 18–65 y, 45 kg+, consent required |

## 6. Known mocks & limits (do not pitch as production)
e-RaktKosh stock is static mock data; WhatsApp = `wa.me` deep links (no Cloud API templates);
hospital login is mock; OTP codes display on screen; circle scheduling has no cron;
reminders/rate-limits/blocks live in browser localStorage; mic/voice removed (English-only build).
