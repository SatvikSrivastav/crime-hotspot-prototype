// Global variables
let map;
let markersLayer;

// --- MAP INITIALIZATION ---
function initializeMap() {
    // Center the map on Andhra Pradesh
    map = L.map('map').setView([15.9129, 79.7400], 7);

    // Add a tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Initialize the marker cluster group
    markersLayer = L.markerClusterGroup();
    map.addLayer(markersLayer);
}

// --- HELPER FUNCTIONS ---
// Assign colors to different crime types
const crimeColors = {
    "Theft": "orange",
    "Assault": "red",
    "Domestic Violence": "purple",
    "Land Dispute": "brown",
    "Vandalism": "darkred",
    "default": "blue"
};

function getCrimeIcon(crimeType) {
    const color = crimeColors[crimeType] || crimeColors['default'];
    // For this prototype, we'll just use default markers, but you could
    // create custom colored icons here if you had more time.
    return L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}


// --- DATA PROCESSING FUNCTIONS ---

// --- NEW: Function to fetch and display the forecast ---
async function fetchAndDisplayForecast() {
    const list = document.getElementById('forecast-list');
    list.innerHTML = '<li>Generating forecast...</li>'; // Show loading state

    try {
        const response = await fetch('http://127.0.0.1:8000/api/forecast');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const forecasts = await response.json();
        
        list.innerHTML = ''; // Clear loading state

        if (forecasts.length === 0) {
            list.innerHTML = '<li>Could not generate forecast.</li>';
            return;
        }

        forecasts.forEach(item => {
            const listItem = document.createElement('li');
            // Use a data-attribute to apply CSS color-coding
            listItem.setAttribute('data-risk', item.risk_level); 
            listItem.innerHTML = `
                <strong>${item.location} - Risk: ${item.risk_level}</strong>
                <p>${item.reason}</p>
            `;
            list.appendChild(listItem);
        });

    } catch (error) {
        console.error("Could not fetch forecast data:", error);
        list.innerHTML = '<li>Error loading forecast.</li>';
    }
}

// Function to add markers to the map
function addMarkers(crimeData) {
    markersLayer.clearLayers(); // Clear previous markers

    crimeData.forEach(crime => {
        const marker = L.marker([crime.lat, crime.lng], { icon: getCrimeIcon(crime.type) });
        marker.bindPopup(`
            <strong>${crime.type}</strong><br>
            Location: ${crime.location}<br>
            Summary: ${crime.summary}
        `);
        markersLayer.addLayer(marker);
    });
}

// Simple hotspot detection by grouping incidents by location (District)
function detectHotspots(crimeData) {
    const counts = crimeData.reduce((acc, crime) => {
        acc[crime.location] = (acc[crime.location] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1]) // Sort descending by count
        .slice(0, 3); // Return top 3
}

// Update the statistics in the sidebar
function updateStatistics(crimeData, hotspots) {
    document.getElementById('totalIncidents').textContent = crimeData.length;
    
    const topHotspotSpan = document.getElementById('topHotspot');
    if (hotspots.length > 0) {
        topHotspotSpan.textContent = `${hotspots[0][0]} (${hotspots[0][1]} incidents)`;
    } else {
        topHotspotSpan.textContent = 'N/A';
    }
}

// Update the list of hotspots in the sidebar
function updateHotspotsList(hotspots) {
    const list = document.getElementById('hotspots-list');
    list.innerHTML = ''; // Clear previous list

    if (hotspots.length === 0) {
        list.innerHTML = '<li>No hotspots detected for this filter.</li>';
        return;
    }

    hotspots.forEach(hotspot => {
        const [location, count] = hotspot;
        const listItem = document.createElement('li');
        listItem.innerHTML = `${location} <span class="count">${count}</span>`;
        list.appendChild(listItem);
    });
}


// --- MODIFIED FUNCTION (from your file) ---
// Function to filter data - NOW ASYNCHRONOUS
async function filterData() {
    const timePeriod = document.getElementById('timePeriod').value;
    const crimeType = document.getElementById('crimeType').value;
    
    // The URL of our backend API endpoint
    const apiUrl = 'http://127.0.0.1:8000/api/incidents';
    
    try {
        // Fetch data from the backend
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let crimeData = await response.json();
        
        // --- Client-side filtering ---
        if (crimeType !== 'all') {
            crimeData = crimeData.filter(crime => crime.type === crimeType);
        }
        
        // Time filtering would be implemented here with real timestamps
        // We will ignore the timePeriod value for this prototype.
        
        const hotspots = detectHotspots(crimeData);
        addMarkers(crimeData);
        updateHotspotsList(hotspots);
        updateStatistics(crimeData, hotspots);

    } catch (error) {
        console.error("Could not fetch crime data:", error);
        alert("Failed to load crime data from the server. Please ensure the backend is running and accessible.");
    }
}


// --- INITIALIZATION & EVENT LISTENERS ---

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();

    // Attach event listeners to filters
    document.getElementById('timePeriod').addEventListener('change', filterData);
    document.getElementById('crimeType').addEventListener('change', filterData);

    // Initial data load
    filterData();
});

// At the bottom of map.js
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();

    // Attach event listeners to filters
    document.getElementById('timePeriod').addEventListener('change', filterData);
    document.getElementById('crimeType').addEventListener('change', filterData);

    // Initial data load
    filterData();
    fetchAndDisplayForecast(); // <-- ADD THIS LINE
});