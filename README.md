# DeliverSafe

AI-powered parametric insurance platform for delivery partners. Protects daily earnings from weather, pollution, and sudden disruptions with automated, fair, and real-time payouts.

Delivery partners typically earn between ₹300–₹800 a day. When extreme weather or curfews hit, their income stops. DeliverSafe provides a safety net by monitoring environmental conditions and triggering automatic payouts based on personalized income protection models.

---

## Features

- **Automated Parametric Payouts**: No claims to file. Payouts trigger automatically when weather or AQI thresholds are crossed.
- **Adaptive Income Protection**: Calculates compensation based on a user's specific hourly earnings and shift patterns.
- **Adversarial Defense**: Real-time trust scoring to detect GPS spoofing, unrealistic movement, and coordinated fraud attempts.
- **Live Dashboard**: Real-time monitoring of environment data, trust scores, and payout history.
- **Dynamic Pricing**: Weekly premiums (₹20–₹50) scaled based on location risk and work frequency.

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, MySQL
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion
- **Tooling**: Maven, ESLint, Lucide React

## Project Structure

```text
.
├── backend/            # Spring Boot application
│   ├── src/main/java   # Business logic (Services, Controllers, Models)
│   └── pom.xml         # Java dependencies
└── frontend/           # React SPA
    ├── src/components  # UI components & Layouts
    ├── src/pages       # Dashboard & Landing views
    └── package.json    # Node.js dependencies
```

## Installation

### Prerequisites
- Java 17+ & Maven
- Node.js 18+ & npm
- MySQL (running on `localhost:3306`)

### 1. Database Setup
Create a database named `deliverysafe`:
```sql
CREATE DATABASE deliverysafe;
```

### 2. Backend Setup
```bash
cd backend
# Configure application.properties if your MySQL credentials differ
mvn spring-boot:run
```
The API will be available at `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

## Configuration

### Backend (`backend/src/main/resources/application.properties`)
| Property | Description | Default |
|----------|-------------|---------|
| `spring.datasource.url` | MySQL connection string | `jdbc:mysql://localhost:3306/deliverysafe` |
| `spring.datasource.username` | Database user | `root` |
| `spring.datasource.password` | Database password | `password` |

### Environment Thresholds
The system uses the following default triggers:
- **Rainfall**: > 50mm
- **Temperature**: > 45°C
- **AQI**: > 300

## How It Works

### 1. Risk Detection Pipeline
When weather data is received, the `RiskDetectionService` evaluates it against thresholds. If a disruption is detected, the `Adaptive Income Protection Engine` calculates loss:
`Income Loss = Hours Lost × Average Hourly Earnings`

### 2. Trust Scoring & Anti-Spoofing
Every payout undergoes a multi-layer verification check via `TrustScoreService`:
- **Speed Check**: Flags speeds > 80km/h as suspicious and > 120km/h as impossible.
- **Activity Consistency**: Cross-references session activity with claimed location.
- **Decision Matrix**:
    - 🟢 **Low Risk (Score 80+)**: Instant Payout.
    - 🟡 **Medium Risk (Score 50-79)**: Delayed verification.
    - 🔴 **High Risk (Score < 50)**: Flagged for review; partial safety-net payout.

## Development

- **Formatting**: The project uses standard Prettier/ESLint configs.
- **Testing**: Run backend tests with `mvn test`.
- **API Documentation**: The backend provides REST endpoints for weather simulation and payout management.

## Demo Flow

1. **Dashboard**: The app initializes a "Demo User" automatically.
2. **Simulate Event**: Use the "Simulate Events" panel to trigger "Heavy Rain".
3. **Automatic Payout**: The system detects the risk, calculates the payout (e.g., ₹320), and updates the history.
4. **Fraud Simulation**: Click "Simulate Suspicious Activity" to see the trust score drop and fraud insights appear.

## License

This project is open-source.
