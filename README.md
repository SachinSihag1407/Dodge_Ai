# SAP O2C Graph DB + LLM Interface

> Neo4j + FastAPI + Groq LLM + React

A production-ready pipeline that ingests SAP Order-to-Cash data into a Neo4j graph, then lets users query it in plain English — zero hallucination, full guardrails.

---

## 📌 Project Overview

This system solves a core enterprise problem: SAP O2C data lives in fragmented tables — orders, customers, products, invoices — that are hard to relate and even harder to query.

This project converts all of that into a **graph**, then wraps an LLM on top so anyone can ask questions in plain English.

### ✨ Features

- 🔗 Natural Language → Cypher  
- 🛡 No Hallucination (strict DB-based answers)  
- 🚫 Domain Guardrails  
- 📊 Live Graph Visualization  

---

## ⚙ Tech Stack

| Layer | Technology | Reason |
|------|------------|--------|
| Graph DB | Neo4j | Cypher + persistent graph |
| Backend | FastAPI | Async + lightweight |
| LLM | openai/gpt-oss-120b (Groq) | Fast inference |
| Frontend | React | Component-based |
| Graph Viz | react-force-graph-2d | Interactive |

💡 **Why not NetworkX?**  
NetworkX is in-memory and unsafe for LLM-generated execution. Cypher is safer and standard.

---

## 📁 Project Structure

```bash
sachin_assignment_2/
├── sap-o2c-data/
├── backend/
│   ├── ingest.py
│   ├── llm_agent.py
│   ├── main.py
│   └── .env
├── frontend/
├── docs/
├── docker-compose.yml
```

---

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- Docker (recommended)
- Groq API Key

---

## 🚀 Setup & Installation

### 1. Start Neo4j

```bash
docker run \
  --name testneo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest
```

---

### 2. Backend Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

Create `backend/.env`

```env
GROQ_API_KEY=your_key

NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password

REACT_APP_API_URL=http://localhost:8000
```

⚠️ Never commit `.env`

---

## ⚡ Data Ingestion

```bash
source .venv/bin/activate
python backend/ingest.py
```

---

## ▶ Running the App

### Terminal 1

```bash
docker start testneo4j
```

### Terminal 2

```bash
cd backend
uvicorn main:app --reload
```

### Terminal 3

```bash
cd frontend
npm start
```

---

## 🔄 End-to-End Flow

1. User sends query  
2. Domain check (LLM)  
3. Cypher generated  
4. Query validated  
5. Executed in Neo4j  
6. Empty check  
7. Final answer returned  

---

## 🕸 Graph Schema

### Nodes

- Customer
- Product
- SalesOrder
- BillingDocument

### Relationships

- Customer → SalesOrder (`PLACED`)
- SalesOrder → Product (`CONTAINS`)
- Billing → Customer (`BILLS`)
- Billing → SalesOrder (`REFERENCES`)

---

## 🔌 API

### POST `/api/query`

#### Request

```json
{
  "question": "Which customers placed orders?"
}
```

#### Response

```json
{
  "cypher_query": "...",
  "result_data": [],
  "natural_language_answer": "..."
}
```

---

## 🛡 Guardrails

- G1: Domain check  
- G2: Safe Cypher only  
- G3: No hallucination  

---

## 💬 Sample Queries

### Basic
- Show 5 products
- List sales orders

### Intermediate
- Customers with orders
- Products in orders

### Advanced
- Top customers by billing
- Orders without billing

### Blocked
- "Capital of France"
- "Delete all data"

---

## ☁ Deployment

### Backend (Render)

- Push backend
- Add env vars
- Start:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel)

- Push frontend
- Set API URL
- Deploy

---

## 🔧 Troubleshooting

| Problem | Fix |
|--------|-----|
| Neo4j not running | `docker start testneo4j` |
| 422 error | Use `"question"` key |
| Blank UI | Restart frontend |
| No data | Try broader query |
| Env issue | Check `.env` |

---

## 🚀 Final Note

SAP O2C Graph DB + LLM Interface  
Built with Neo4j + FastAPI + Groq + React
