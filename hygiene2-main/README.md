# Hygiene Compliance Auditor (Full-Stack)

This is a comprehensive hygiene monitoring system with a computer vision backend and a modern React frontend. It detects PPE violations (e.g., missing gloves, hairnets) in real-time.

## Project Structure

- **`/backend`**: FastAPI application (Python) using YOLOv8 for detection.
- **`/frontend`**: React application (Vite + Tailwind CSS + TypeScript) for the monitoring dashboard.

---

## 🚀 Getting Started

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server (if API layer is ready):
   ```bash
   uvicorn app.main:app --reload
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛠 Features

- **Real-Time Monitoring**: Process video frames for PPE violations.
- **Automated Logging**: Violations are logged to a SQLite database with image evidence.
- **Interactive Dashboard**: Modern UI to monitor live feeds and review alerts.
- **Dynamic Scoring**: Track compliance scores over time.

## 📦 Ignored Files (Local Only)

The following files are **not** committed to the repository (see `.gitignore`):
- `venv/`, `node_modules/` (Dependencies)
- `data/`, `runs/`, `temp_uploads/` (Datasets & Training outputs)
- `*.pt` (Large model weight files - use an external storage like S3 or HuggingFace)
- `*.log`, `*.zip`, `*.mp4` (Temporary or large assets)

---

## 📋 Notes

- The PPE detection relies on a YOLOv8 model (`yolov8n.pt` or custom weights).
- Ensure your backend and frontend are properly linked via the `VITE_API_URL` environment variable if necessary.

