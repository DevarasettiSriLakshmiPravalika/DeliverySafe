# DeliverSafe — AI-Powered Parametric Insurance for Delivery Partners

> Protecting the daily earnings of food delivery workers from weather, pollution, and sudden disruptions — automatically, fairly, and in real time.

---

## The Problem

If you're a Zomato or Swiggy delivery partner, your income stops the moment conditions outside your control make it impossible to work. Heavy rain, extreme heat, a sudden curfew — and just like that, a day's earnings are gone. There's no fallback, no compensation, no safety net.

Delivery partners typically earn between ₹300–₹800 a day, working 8–10 hour shifts. Studies suggest they lose **20–30% of their income** annually to disruptions like:

- Heavy rainfall
- Extreme heat (above 45°C)
- Hazardous air quality (AQI above 300)
- Government-imposed curfews or city-wide strikes

Until now, there's been no product designed to fix this.

---

## What We've Built

DeliverSafe is a parametric insurance platform built specifically for gig delivery workers. Instead of making workers file claims and wait weeks for a decision, the system **watches the environment for them** — and pays out automatically when conditions cross predefined thresholds.

Here's the basic flow:

1. A delivery partner signs up and sets up their profile  
2. Our AI calculates a personalized weekly premium (₹20–₹50)  
3. The system monitors real-time weather, AQI, and civic alerts in their area  
4. When a disruption is detected, a claim is triggered automatically — no paperwork, no waiting  
5. Payout hits their account instantly  

---

## How Payouts Are Calculated

Most insurance products pay fixed slabs — which either underpay or overpay. We do it differently.

Our **Adaptive Income Protection Engine** calculates compensation based on what *that specific person* actually loses:

```
Income Loss = Hours Lost × That User's Average Hourly Earnings
```

This means a partner who works mornings and earns more per hour gets compensated differently from someone on a different shift pattern — because fairness requires personalization.

### Triggers That Activate a Payout

| Condition | Threshold |
|---|---|
| Rainfall | > 50mm |
| Air Quality Index (AQI) | > 300 |
| Temperature | > 45°C |
| Government curfew | Declared officially |

All of these are verified against real-time data sources. No manual claim required.

---

## 🔐 Adversarial Defense & Anti-Spoofing Strategy

Here's an honest challenge with any automated payout system: bad actors will try to game it. In our case, the risk is GPS spoofing — someone faking their location to claim they were in an affected area when they weren't.

We designed the system to resist not just individual fraud attempts, but coordinated ones — like organized groups using Telegram to simultaneously spoof claims during a weather event (what we call the **DEVTrails Market Crash scenario**).

Our defense runs on multiple layers:

### 1. Trust Scores, Not Just GPS

Every claim gets a Trust Score before a payout is released. We analyze:

- **Movement continuity** — does the GPS trail look like a real person navigating roads, or does it jump unnaturally?  
- **Speed and route plausibility** — are the speeds realistic for a two-wheeler?  
- **Session activity** — was the account actively accepting delivery orders, or was it idle?  
- **Historical consistency** — does this claim match the user's normal patterns?  

We use anomaly detection models (Isolation Forest / Autoencoders) trained on normal delivery behavior, allowing us to flag deviations like unrealistic movement, inactive sessions during claimed disruptions, or synchronized patterns across users.

---

### 2. Signals Beyond GPS

GPS alone is too easy to fake. We cross-reference it against:

- **Network signals**: Does the GPS location match the IP geolocation and cell tower data?  
- **Device signals**: Is this a rooted device? An emulator? Has this hardware ID appeared across multiple accounts?  
- **Delivery activity logs**: Did this person actually receive and complete orders before the disruption?  
- **Hyperlocal weather validation**: Was the weather event real and localized to *exactly* where this person claims to have been?  

---

### 3. Fraud Ring Detection

Individual spoofers are one thing. Coordinated attacks are another. We model users as a graph network — if a cluster of accounts suddenly files claims with shared IPs, similar device fingerprints, or synchronized timestamps, that pattern gets flagged immediately.

This is what allows us to detect an organized attack, not just a single bad actor.

---

### 4. Fairness First

The goal isn't to be maximally suspicious — it's to protect honest workers while catching fraud. So risk levels trigger different responses:

| Risk Level | Action |
|---|---|
| 🟢 Low | Instant payout |
| 🟡 Medium | Short delay + lightweight verification |
| 🔴 High | Flagged for review + partial safety-net payout |

Even flagged users receive a partial payout during review. Someone who genuinely couldn't work shouldn't go a week without income while we investigate.

---

### 5. Real-Time Risk Pipeline

```
Claim → Feature Extraction → Trust Score Model → Risk Classification → Decision Engine → Payout / Flag
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Spring Boot |
| Database | MySQL |
| Weather Data | Weather API (mock for demo) |
| Payments | Razorpay (test mode) |

The fraud detection and risk scoring pipeline is designed to run in real-time using scalable backend services.

---

## Pricing

Weekly premiums range from **₹20 to ₹50**, dynamically priced based on:

- The user's delivery location and its historical risk profile  
- Local weather and pollution patterns  
- How frequently the user works  

---

## What's Next

- Live integration with Zomato and Swiggy partner APIs  
- More sophisticated AI risk models with richer training data  
- Expansion to auto-rickshaw drivers, construction workers, and other gig categories  
- Optional: blockchain-based claim audit trail for transparency  

---

## Demo

https://www.youtube.com/watch?v=IxMxBYXhohs

---

## How to Run the MVP

### Prerequisites
- Java 17+
- Maven
- Node.js & npm
- MySQL (running on localhost:3306)

### 1. Setup Database
Create a database named `deliverysafe` in MySQL:
```sql
CREATE DATABASE deliverysafe;
```
Update `backend/src/main/resources/application.properties` with your MySQL username and password if different from `root`/`password`.

### 2. Run Backend
```bash
cd backend
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

---

## Demo Flow

1. **Open Dashboard**: The app automatically initializes a "Demo User" in the database.
2. **Environment Data**: Shows current (safe) conditions.
3. **Trigger Disruption**: Use the "Simulate Events" panel on the right.
   - Click **"Simulate Heavy Rain"** (Rainfall > 50mm).
4. **Automatic Payout**:
   - System detects the risk.
   - Calculates payout: `Hours Lost (4) * Hourly Earnings (₹80) = ₹320`.
   - **"Payout Triggered!"** alert appears.
   - Claim status updates to **Approved**.
   - **Payout History** updates in real-time with the new entry from the database.
5. **Fraud Simulation**:
   - Click **"Simulate Suspicious Activity"**.
   - Trust score drops, and detailed **Fraud Insights** appear.
