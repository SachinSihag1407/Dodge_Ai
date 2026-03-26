FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY sap-o2c-data /app/sap-o2c-data

EXPOSE 8000

CMD ["sh", "-c", "python ingest.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
