FROM python:3.11-slim

WORKDIR /app

COPY backend/ ./backend
COPY sap-o2c-data/ ./sap-o2c-data

WORKDIR /app/backend

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["sh", "-c", "python ingest.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
