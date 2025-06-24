# crime-hotspot-prototype
An AI based visualizer cum prediction of crime hotspots.

---

# Crime Hotspot Analysis & Prediction Prototype

![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.78-green?logo=fastapi)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-brightgreen?logo=leaflet)
![Status](https://img.shields.io/badge/status-prototype-orange)

This project is a rapid prototype of a crime analysis and early warning system, inspired by the objective to process Dial 112 data for law enforcement in Andhra Pradesh. It provides a web-based dashboard that visualizes crime incidents on an interactive map, analyzes their severity using basic AI, and generates a simple predictive forecast for future hotspots.


*(Feel free to replace this with your own screenshot!)*

---

## ✨ Core Features

### 1. Interactive Map Visualization
*   **Dynamic Plotting:** Crime incidents are fetched from a backend API and plotted on an interactive map centered on Andhra Pradesh.
*   **Marker Clustering:** Utilizes `Leaflet.markercluster` to cleanly handle a large number of incidents, grouping them by proximity at different zoom levels.
*   **Color-Coded Markers:** Markers are distinctly colored by crime type for immediate visual identification.

### 2. Real-time Filtering
*   **Incident Filtering:** Users can filter the displayed incidents by crime type (e.g., Theft, Assault, Domestic Violence) via a dropdown menu.
*   **Instant Updates:** The map, statistics, and hotspot lists instantly update to reflect the filtered data without a page reload.

### 3. AI-Powered Severity Analysis
*   **NLP Integration:** A simple Natural Language Processing (NLP) model (`TextBlob`) analyzes the text summary of each incident.
*   **Severity Scoring:** It assigns a "Severity Score" (Low, Medium, High) based on the negative sentiment of the incident description. This score is visible in each marker's popup, providing deeper context.

### 4. Predictive Hotspot Forecast
*   **Rule-Based Prediction:** A prototype predictive algorithm identifies potential future hotspots.
*   **Risk Score Calculation:** The forecast calculates a "Risk Score" for each location by combining two key metrics: incident **frequency** and average **severity**.
*   **Actionable Intelligence:** The top 3 high-risk locations are displayed in a "Future Hotspot Forecast" panel, providing a simple yet powerful early warning.

### 5. At-a-Glance Dashboard
*   **Key Statistics:** A sidebar provides key metrics, including the total number of incidents for the current filter.
*   **Hotspot Lists:** It displays both the top 3 *current* hotspots (by incident count) and the top 3 *forecasted* hotspots (by risk score).

---

## 🛠️ Tech Stack

This prototype is built with a modern, fast, and easy-to-use tech stack.

| Area      | Technology                                                                                                    | Description                                                 |
| :-------- | :------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------- |
| **Backend** | ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)                             | Core programming language.                                  |
|           | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)                           | High-performance framework for building the API.            |
|           | `TextBlob`                                                                                                    | NLP library for sentiment analysis and severity scoring.    |
|           | `Uvicorn`                                                                                                     | ASGI server to run the FastAPI application.                 |
| **Frontend**| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)                                 | Structure of the web application.                           |
|           | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)                                     | Styling for a clean, modern user interface.                 |
|           | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)                 | Logic for interactivity, fetching data, and map control.    |
|           | ![Leaflet](https://img.shields.io/badge/Leaflet-1AD668?logo=leaflet&logoColor=white)                           | The leading open-source library for interactive maps.       |
| **Data**    | `JSON`                                                                                                        | Using a `mock_incidents.json` file to simulate a database.  |

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   Python 3.7+
*   `pip` (Python package installer)
*   A modern web browser
*   (Optional) VS Code with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://your-repository-url/crime-hotspot-prototype.git
    cd crime-hotspot-prototype
    ```

2.  **Set up the Backend:**
    *   Install the required Python packages.
      ```sh
      pip install fastapi "uvicorn[standard]" textblob
      ```
    *   Download the necessary language corpora for `TextBlob`. This is a one-time setup.
      ```sh
      python -m textblob.download_corpora
      ```

### Running the Application

1.  **Start the Backend Server:**
    *   From the project's **root directory**, run the following command:
      ```sh
      uvicorn backend.main:app --reload
      ```
    *   The API will be live at `http://127.0.0.1:8000`.

2.  **Launch the Frontend:**
    *   The easiest method is to use a live server to avoid CORS issues.
    *   In VS Code, right-click the `frontend/index.html` file and select "Open with Live Server".
    *   Your browser will open automatically to the application, typically at an address like `http://127.0.0.1:5500/frontend/`.

You should now see the fully interactive crime map and dashboard
