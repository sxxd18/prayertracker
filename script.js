 document.getElementById('grantStorageAccess').addEventListener('click', function() {
      if (document.hasStorageAccess) {
        document.requestStorageAccess()
          .then(() => {
            console.log('Storage access granted.');
            // Optionally hide the button after access is granted.
            document.getElementById('grantStorageAccess').style.display = 'none';
          })
          .catch(err => {
            console.error('Storage access denied:', err);
          });
      } else {
        console.log('Storage Access API not supported.');
      }
    });

document.addEventListener("DOMContentLoaded", function () {
  const checkboxIds = ["fajr", "zuhr", "asr", "maghrib", "isha"];
  const todayDate = getTodayDate();

  // Retrieve saved tracker data or create a default object.
  let trackerData = JSON.parse(localStorage.getItem("prayerTracker")) || {
    date: todayDate,
    prayers: {
      fajr: false,
      zuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    },
    streak: 0,
  };

  // If the date has changed, reset the tracker for the new day.
  if (trackerData.date !== todayDate) {
    const allTicked = Object.values(trackerData.prayers).every(val => val === true);
    trackerData.streak = allTicked ? trackerData.streak + 1 : 0;
    trackerData.prayers = {
      fajr: false,
      zuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    };
    trackerData.date = todayDate;
    localStorage.setItem("prayerTracker", JSON.stringify(trackerData));
  }

  // Update the streak display.
  document.getElementById("streak").textContent = trackerData.streak;

  // Set each checkbox’s state based on saved data and update localStorage on changes.
  checkboxIds.forEach(function (id) {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.checked = trackerData.prayers[id];
      if (checkbox.checked) {
        checkbox.disabled = true; // Disable the checkbox if it's already checked.
      }
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          trackerData.prayers[id] = true;
          checkbox.disabled = true; // Disable the checkbox once checked.
          localStorage.setItem("prayerTracker", JSON.stringify(trackerData));
        }
      });
    }
  });

  // Schedule a reset at midnight.
  function scheduleMidnightReset() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow - now;

    setTimeout(function () {
      resetTrackerData();
      scheduleMidnightReset(); // Reschedule for the next day.
    }, msUntilMidnight);
  }

  scheduleMidnightReset();

  // Function to reset tracker data for a new day.
  function resetTrackerData() {
    const allTicked = Object.values(trackerData.prayers).every(val => val === true);
    trackerData.streak = allTicked ? trackerData.streak + 1 : 0;
    trackerData.prayers = {
      fajr: false,
      zuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    };
    trackerData.date = getTodayDate();
    localStorage.setItem("prayerTracker", JSON.stringify(trackerData));

    // Update the UI to reflect the reset.
    checkboxIds.forEach(function (id) {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = false;
        checkbox.disabled = false; // Re-enable checkboxes for the new day.
      }
    });
    document.getElementById("streak").textContent = trackerData.streak;
  }
});

// Returns today's date in "YYYY-MM-DD" format.
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
