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

  // Persistent Storage Button Logic
  const enableStorageButton = document.getElementById('enableStorage');
  if (enableStorageButton) {
    enableStorageButton.addEventListener('click', function() {
      if (document.hasStorageAccess) {
        document.requestStorageAccess().then(function() {
          console.log('Persistent storage access granted.');
          // Animate the button away
          enableStorageButton.classList.add('fade-out');
          setTimeout(function() {
            enableStorageButton.style.display = 'none';
          }, 400);
        }).catch(function(err) {
          console.error('Persistent storage access denied:', err);
          alert('Unable to enable persistent storage. Please check your browser settings.');
        });
      } else {
        console.log('Storage Access API not supported in this browser.');
        enableStorageButton.style.display = 'none';
      }
    });
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
