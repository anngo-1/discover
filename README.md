# Discover 🔍

Discover is an analytics platform that transforms research data into actionable insights. With Discover, you can explore publication metrics, uncover emerging research trends, and measure the impact of journals, publishers, researchers, and topics.

## 🌟 Features (WORK IN PROGRESS)
- **Publication Analytics**: View research work and citation metrics
- **Institution Insights**: Explore research output and collaboration networks
- **Author Metrics**: Track researcher impact and publication history
- **Topic Trends**: Identify emerging research areas and track field evolution
- **Interactive Visualizations**: Beautiful, intuitive data representations 

## 🔑 Required Configuration
Before running the application (with either method below), you must create a `.env` file in the `/frontend` directory:

```bash
# /frontend/.env
NEXT_PUBLIC_HOST=http://localhost:5000  # Use this URL for local development
```

## ⚡️ Quick Start

### Using Docker (Recommended)
The fastest way to get started:
```
docker compose up --build
```
Navigate to `http://localhost:3000` to access the application.

### Manual Setup
#### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Set up your Python environment:
   ```
   # Using pip
   pip install -r requirements.txt
   # OR using conda
   conda env create --file=environment.yml
   conda activate discover-api
   ```
3. Start the API server:
   ```
   python app.py
   ```
#### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
Visit `http://localhost:3000` to access the application.
