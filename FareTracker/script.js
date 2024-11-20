let stationList = []; // To store station names
let stationMap = {}; // To map station names to indices

// Function to load stations
async function loadStations() {
    try {
        const response = await fetch('http://localhost:3000/stations');
        const stations = await response.json();

        // Populate station list and map
        stationList = stations.map(station => station.name);
        stations.forEach(station => {
            stationMap[station.name] = station.id;
        });
    } catch (error) {
        console.error("Error fetching stations:", error);
        document.getElementById('result').textContent = "Failed to load stations. Please try again.";
    }
}

// Function to calculate fare dynamically
function calculateFare(startIndex, endIndex) {
    const distance = Math.abs(startIndex - endIndex); // Calculate distance
    let fare;

    // Dynamic fare structure
    if (distance <= 2) fare = 10;
    else if (distance <= 5) fare = 20;
    else if (distance <= 12) fare = 30;
    else if (distance <= 21) fare = 40;
    else if (distance <= 32) fare = 50;
    else fare = 60;

    return fare;
}

// Autocomplete filter
function filterStations(inputId) {
    const input = document.getElementById(inputId);
    const suggestions = document.getElementById('suggestions');
    const query = input.value.toLowerCase();

    // Show suggestions based on input
    const matches = stationList.filter(station =>
        station.toLowerCase().includes(query)
    );

    // Populate suggestion list
    suggestions.innerHTML = '';
    matches.forEach(match => {
        const listItem = document.createElement('li');
        listItem.textContent = match;
        listItem.onclick = () => {
            input.value = match;
            suggestions.innerHTML = '';
        };
        suggestions.appendChild(listItem);
    });

    // Toggle visibility
    suggestions.classList.toggle('hidden', matches.length === 0);
}

// Function to check fare
function checkFare() {
    const start = document.getElementById('startStation').value;
    const end = document.getElementById('endStation').value;

    if (!start || !end) {
        document.getElementById('result').textContent = 'Please select both stations!';
        return;
    }

    if (start === end) {
        document.getElementById('result').textContent = 'Start and end stations cannot be the same!';
        return;
    }

    // Get indices of stations
    const startIndex = stationMap[start];
    const endIndex = stationMap[end];

    if (startIndex && endIndex) {
        const fare = calculateFare(startIndex, endIndex);
        document.getElementById('result').textContent = `Fare: ₹${fare}`;
    } else {
        document.getElementById('result').textContent = 'Invalid station names!';
    }
}

// Load stations on page load
window.onload = loadStations;
