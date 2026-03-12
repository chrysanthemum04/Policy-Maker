# PolicyWave
**Understanding policy in motion**

PolicyWave is a civic-tech platform that helps **citizens, policymakers, and experts understand the real-world impact of public policy before implementation**.

Instead of static reports and generalised explanations, PolicyWave uses **AI-driven simulations, role-aware reasoning, and structured outputs** to turn legislation into something people can actually reason about.

**Demo Video** : 
[Loom Video](https://www.loom.com/share/c1d65c86ad5746e59773c87deb41e53c)


---

##  How PolicyWave Works

PolicyWave is built around an **agent first architecture**.

Rather than a generic chatbot, the system:
- Acknowledges **who is asking** (citizen, government, or expert)
- Routes the request through a **specialized AI workflow**
- Applies **role-specific constraints, explanations, and outputs**

This ensures that:
- Citizens receive clear, plain-language explanations
- Policymakers see trade-offs, assumptions, and comparisons
- Experts access deeper analytical context

All simulations are **assumption-driven, directional, and logged immutably**.

---

##  Tech Stack & Architecture

### Frontend
- **Next.js (App Router) + React**
- **TypeScript**
- **Tailwind CSS**
- Role-based navigation

### Backend
- **Node.js + Express (TypeScript)**
- **PostgreSQL + Prisma**
- **JWT authentication with RBAC**
- Backend-only AI orchestration
- Rate-limited, auditable AI calls

### AI & Reasoning
- **On-Demand.io Agents Flow Builder**
- Single controlled policy reasoning agent
- Role aware simulation logic
- Structured + hybrid outputs (for detailed reports)
- **Google Gemini** for large context policy reasoning and summaries

### System Principles
- No Docker (simple local Node.js setup)
- Immutable simulation logs
- No auto-running AI
- No policy predictions, only decision support

---

##  Core Product Features

### Simulation Engine (The Core)
- **Citizen Chat Simulator**: “What does this mean for me?”
- **Government Scenario Builder**: Test “what-if” policy changes
- **Old vs New** regime comparisons
- **Tiered Results**:
  - Brief (TL;DR)
  - Detailed (assumptions & risks)
  - Visual Report (comparative charts)
- Custom variable tweaking (income, inflation, timelines)

---

### Discovery & Trends
- Interest-based policy discovery
- Velocity tracking for emerging topics
- “Policy Shorts” — complex updates as swipeable cards

---

### Community & Experts
- Policy-tagged discussion forums
- Verified expert profiles
- Public webinars via external platforms
- Engagement metrics to surface high-quality contributions

---

## Key Engineering Challenges

- Maintaining consistency across multi-agent workflows
- Enforcing structured AI outputs for reliable visualization
- Accurate policy-domain routing
- Robust parameter extraction from natural language
- Preventing hallucination across tiered summaries
- Guardrails against biased or unsafe outputs
- Managing latency and version drift in stored simulations

---

##  Running the Project

### Prerequisites
- Node.js (v18+)
- PostgreSQL (local)

### Setup

```bash
git clone https://github.com/OfEarthAndEther/PolicyWave.git
cd PolicyWave
npm install
```

Configure environment variables:

* `apps/api/.env`
* `apps/web/.env.local`

Run database schema:

```bash
cd apps/api
npx prisma db push
```

### Start the app

```bash
npm run dev

cd ..
cd apps/web
npm run dev
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend: [http://localhost:3001](http://localhost:3001)

---

## Roles & Access

* **Citizen** — private simulations, explanations, community access
* **Government** — private policy simulations and comparisons
* **Expert** — simulations, validation, and webinars

Government simulations are **never publicly visible**.

---

## License

MIT License

---

## TL;DR

**PolicyWave** lets people reason about policy *before it’s implemented*.

* Role-aware AI simulations instead of static reports
* Clear explanations for citizens, structured analysis for policymakers
* Assumption-driven, non-predictive outputs
* Thoughtful UX for complex civic information

**Not a chatbot. Not a predictor.
A policy reasoning system.**
