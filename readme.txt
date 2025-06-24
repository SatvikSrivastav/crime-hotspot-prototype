# Crime Hotspot Analysis & Prediction Prototype

This project is a rapid prototype of a crime analysis and early warning system, inspired by the objective to process Dial 112 data for law enforcement in Andhra Pradesh. It provides a web-based dashboard that visualizes crime incidents on an interactive map, analyzes their severity using basic AI, and generates a simple predictive forecast for future hotspots.

## Core Features

1.  **Interactive Map Visualization:**
    *   Crime incidents are fetched from a backend API and plotted on an interactive map of Andhra Pradesh.
    *   Uses marker clustering to handle a large number of incidents cleanly.
    *   Markers are color-coded by crime type for easy identification.

2.  **Dynamic Filtering:**
    *   Users can filter the displayed incidents by crime type (e.g., Theft, Assault, etc.) in real-time.
    *   The map and all statistics instantly update based on the selected filters.

3.  **AI-Powered Severity Analysis:**
    *   A simple Natural Language Processing (NLP) model (`TextBlob`) analyzes the text summary of each incident.
    *   It assigns a "Severity Score" (Low, Medium, High) based on the sentiment of the incident description. This score is visible in the marker popups.

4.  **Predictive Hotspot Forecast:**
    *   A rule-based predictive algorithm identifies potential future hotspots.
    *   The forecast calculates a "Risk Score" for each location based on a combination of incident **frequency** and average **severity**.
    *   The top 3 high-risk locations are displayed in a "Future Hotspot Forecast" panel, providing an early warning.

5.  **Data Dashboard:**
    *   A sidebar provides at-a-glance statistics, including the total number of incidents for the current filter.
    *   It also lists the top 3 current hotspots based purely on incident count.

## Tech Stack

This prototype is built with a modern, fast, and easy-to-use tech stack.

*   **Backend:**
    *   **Language:** Python 3
    *   **Framework:** FastAPI (for creating a high-performance, easy-to-use API)
    *   **AI/ML Library:** TextBlob (for NLP-based sentiment analysis to score severity)
    *   **Server:** Uvicorn (as the ASGI server to run the FastAPI application)

*   **Frontend:**
    *   **Languages:** HTML5, CSS3, JavaScript (ES6+)
    *   **Mapping Library:** Leaflet.js (a leading open-source library for interactive maps)
    *   **Map Plugins:** Leaflet.markercluster (for clustering map markers)

*   **Data:**
    *   **Format:** JSON (using a `mock_incidents.json` file to simulate a database)

## How to Run

1.  **Backend Setup:**
    *   Navigate to the project root directory.
    *   Install dependencies: `pip install -r requirements.txt` (or install fastapi, uvicorn, textblob manually)
    *   Run the one-time data download for the AI model: `python -m textblob.download_corpora`
    *   Start the server: `uvicorn backend.main:app --reload`

2.  **Frontend Setup:**
    *   Navigate to the `frontend/` directory.
    *   Open `index.html` with a live server (e.g., VS Code's "Live Server" extension) to handle local development without CORS issues.