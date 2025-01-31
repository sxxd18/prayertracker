// Utility: Formats a Date object as "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

// Save the state (true/false) for a given prayer checkbox
function savePrayerState(prayer, state) {
  localStorage.setItem(`prayer_${prayer}`, state);
}

// Retrieve the state for a given prayer checkbox (defaults to false if not set)
function loadPrayerState(prayer) {
  const stored = localStorage.getItem(`prayer_${prayer}`);
  return stored === "true"; // Returns true if stored value is "true", else false
}

// Save the streak count
function saveStreak(streak) {
  localStorage.setItem("streak", streak);
}

// Load the streak count
function loadStreak() {
  const stored = localStorage.getItem("streak");
  return stored ? parseInt(stored, 10) : 0;
}

// Initialize the prayer tracker
function initPrayerTracker() {
  const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  prayers.forEach((prayer) => {
    const checkbox = document.getElementById(prayer);
    if (checkbox) {
      checkbox.checked = loadPrayerState(prayer);
    }
  });
  document.getElementById("streakCount").textContent = loadStreak();
}

// Attach event listeners to checkboxes
function attachCheckboxListeners() {
  const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  prayers.forEach((prayer) => {
    const checkbox = document.getElementById(prayer);
    if (checkbox) {
      checkbox.addEventListener("change", (e) => {
        savePrayerState(prayer, e.target.checked);
      });
    }
  });
}

// Initialize everything when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initPrayerTracker();
  attachCheckboxListeners();
});