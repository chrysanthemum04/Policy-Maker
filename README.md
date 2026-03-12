# Policy-Maker
**Understanding policy in motion**

Policy-Maker is a **civic-tech platform** that helps citizens, policymakers, and experts **analyze and simulate the real-world impact of public policies before implementation**.  

Instead of static reports, Policy-Maker uses **AI-driven simulations, role-aware reasoning, and structured outputs** to provide actionable insights for decision-making.

**Demo Video:**  
[Loom Video](https://www.loom.com/share/c1d65c86ad5746e59773c87deb41e53c)

---

## How Policy-Maker Works

Policy-Maker is built around a **role-aware AI agent architecture**.  

Key workflow features:

- Recognizes **user role**: Citizen, Government, or Expert  
- Routes requests through **specialized AI workflows**  
- Applies **role-specific constraints, explanations, and outputs**  

Role-based outputs:

- **Citizens:** Clear, plain-language explanations of policy impact  
- **Policymakers:** Trade-offs, assumptions, and scenario comparisons  
- **Experts:** Analytical insights and validation of policy assumptions  

All simulations are **assumption-driven, non-predictive, and logged immutably** for transparency.

---

## Tech Stack & Architecture

### Frontend
- **Next.js (App Router) + React**  
- **TypeScript**  
- **Tailwind CSS**  
- Role-based navigation and UI for multiple stakeholders  

### Backend
- **Node.js + Express (TypeScript)**  
- **PostgreSQL + Prisma**  
- **JWT authentication with RBAC**  
- Backend-only AI orchestration, rate-limited and auditable  

### AI & Reasoning
- **On-Demand.io Agents Flow Builder** for controlled multi-agent simulations  
- Role-aware simulation logic with structured + hybrid outputs  
- **Google Gemini** for large-context policy reasoning and summaries  

### System Principles
- Simple local Node.js setup, no Docker required  
- Immutable simulation logs  
- No auto-running AI; non-predictive outputs only  
- Decision-support focused  

---

## Core Features

### Simulation Engine
- **Citizen Chat Simulator**: “What does this mean for me?”  
- **Government Scenario Builder**: Test “what-if” policy changes  
- Compare **Old vs New regime policies**  
- **Tiered Results:** Brief, Detailed, Visual Reports  
- Adjustable variables (income, inflation, timelines)  

### Policy Discovery & Trends
- Interest-based policy discovery and filtering  
- Trend velocity tracking for emerging topics  
- “Policy Shorts”: digestible policy updates as swipeable cards  

### Community & Expert Collaboration
- Policy-tagged discussion forums  
- Verified expert profiles  
- Public webinars and engagement metrics  
- Facilitate high-quality contribution and review  

---

## Key Engineering Challenges

- Maintaining consistency across multi-agent workflows  
- Enforcing structured AI outputs for reliable visualization  
- Accurate policy-domain routing and parameter extraction  
- Reducing AI hallucinations and bias across tiered summaries  
- Managing latency and version drift in simulation logs  

---

## Running the Project

### Prerequisites
- Node.js (v18+)  
- PostgreSQL (local setup)  

### Setup

```bash
git clone https://github.com/your-username/Policy-Maker.git
cd Policy-Maker
npm install

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
