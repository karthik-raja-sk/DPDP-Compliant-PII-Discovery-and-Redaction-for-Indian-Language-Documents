#!/bin/bash

# DPDP PII Redaction Platform - Quick Starter Script
echo "Starting DPDP PII Redaction Platform..."

# Build and start services
docker-compose -f infra/docker/docker-compose.yml up --build -d

echo "------------------------------------------------"
echo "Backend running at: http://localhost:8000"
echo "Frontend running at: http://localhost:5173"
echo "Docs running at: http://localhost:8000/docs"
echo "------------------------------------------------"
echo "Use 'docker-compose logs -f' to view activity."
