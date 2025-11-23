(async function () {
  const jsonUrl = "https://ensho3601.github.io/waittime/wait.json";
  const res = await fetch(jsonUrl);
  const data = await res.json();

  const now = new Date();
  const weekdayList = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

  function getNearestSlot(date) {
    const h = date.getHours();
    const m = date.getMinutes();
    let targetHour = h;
    let targetMinutes = 0;

    if (m <= 14) {
      targetMinutes = 0;
    } else if (m <= 44) {
      targetMinutes = 30;
    } else {
      targetMinutes = 0;
      targetHour = h + 1;
    }

    let dayOffset = 0;
    if (targetHour >= 24) {
      targetHour = 0;
      dayOffset = 1;
    }

    const timeKey = `${String(targetHour).padStart(2,"0")}:${String(targetMinutes).padStart(2,"0")}`;
    return { timeKey, dayOffset };
  }

  const { timeKey, dayOffset } = getNearestSlot(now);
  const weekdayIndex = (now.getDay() + dayOffset) % 7;
  const weekday = weekdayList[weekdayIndex];

  // ▼色分けルール
  function getColor(wait) {
    if (wait === 0) return "blue";        // 0分
    if (wait < 10) return "green";        // 10分未満
    if (wait < 30) return "orange";       // 30分未満
    if (wait < 60) return "red";          // 60分未満
    return "purple";                      // 60分以上
  }

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const timeText = `${h}時${m}分現在`;

  document.querySelectorAll(".waittime-box").forEach(box => {
    const storeId = box.dataset.store;
    const storeData = data[storeId];
    const todayData = storeData ? storeData[weekday] : null;
    const info = todayData ? todayData[timeKey] : null;

    const timeEl = box.querySelector(".wt_time");
    const peopleEl = box.querySelector(".wt_people");
    const waitEl = box.querySelector(".wt_wait");

    if (!info) {
      timeEl.textContent = timeText;
      peopleEl.textContent = "";
      waitEl.textContent = "営業時間外";
      waitEl.style.color = "gray";
      return;
    }

    const color = getColor(info.wait);
    timeEl.textContent = timeText;
    peopleEl.innerHTML = `<span style="color:${color}; font-weight:bold;">約${info.people}名</span>`;
    waitEl.innerHTML = `<span style="color:${color}; font-weight:bold;">約${info.wait}分待ち</span>`;
  });
})();
