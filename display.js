(async function () {
  const jsonUrl = "https://ensho3601.github.io/waittime/wait.json";
  const res = await fetch(jsonUrl);
  const data = await res.json();

  const now = new Date();
  const weekdayList = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const weekday = weekdayList[now.getDay()];

  function roundTo30min(date) {
    const h = date.getHours();
    const m = date.getMinutes();
    return (m < 30)
      ? `${String(h).padStart(2,"0")}:00`
      : `${String(h).padStart(2,"0")}:30`;
  }

  const timeKey = roundTo30min(now);

  function getColor(wait) {
    if (wait === 0) return "blue";
    if (wait < 10) return "green";
    if (wait < 20) return "orange";
    if (wait < 30) return "red";
    return "purple"; 
  }

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const timeText = `${h}時${m}分現在`;

  // ▼全店舗ブロックを処理
  document.querySelectorAll(".waittime-box").forEach(box => {
    const storeId = box.dataset.store;
    const storeData = data[storeId];
    const todayData = storeData ? storeData[weekday] : null;
    const info = todayData ? todayData[timeKey] : null;

    const timeEl = box.querySelector(".wt_time");
    const peopleEl = box.querySelector(".wt_people");
    const waitEl = box.querySelector(".wt_wait");

    if (!info) {
      timeEl.textContent = "";
      peopleEl.textContent = "データなし";
      waitEl.textContent = "";
      return;
    }

    const color = getColor(info.wait);

    timeEl.textContent = timeText;
    peopleEl.innerHTML = `<span style="color:${color}; font-weight:bold;">約${info.people}名</span>`;
    waitEl.innerHTML = `<span style="color:${color}; font-weight:bold;">約${info.wait}分待ち</span>`;
  });

})();
