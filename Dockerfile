# STAGE 1: Build Angular frontend
FROM node:20-alpine AS frontend-builder

# Set working directory for frontend build
WORKDIR /app/frontend

# Copy package.json and package-lock.json (if exists) first
COPY weather-frontend/package*.json ./

# Install dependencies (this layer will be cached if package.json doesn't change)
RUN npm install

# Now copy the rest of the frontend source code
COPY weather-frontend/ ./

# Build Angular app for production
RUN npm run build

# STAGE 2: Setup Python backend
FROM python:3.11-slim AS backend

# Set working directory for backend
WORKDIR /app

# Copy requirements.txt first (same optimization principle!)
COPY requirements.txt ./

# Install Python dependencies (this layer will be cached)
RUN pip install -r requirements.txt

# Copy backend source code
COPY backend/ ./

# Copy environment file for API key
COPY backend/.env ./

# Copy built Angular files from Stage 1 (this is the multi-stage magic!)
COPY --from=frontend-builder /app/frontend/dist/weather-frontend/browser ./static

# Expose the port Flask will run on
EXPOSE 5000

# Command to run when container starts
CMD ["python", "app.py"]
