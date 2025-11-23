(async function () {

  const jsonUrl = "https://ensho3601.github.io/waittime/wait.json";
  const res = await fetch(jsonUrl);
  const data = await res.json();

  // ▼店舗IDを指定（例：store1）
  const storeId = "store1";  
  const storeData = data[storeId];

  const now = new Date();
  const weekdayList = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const weekday = weekdayList[now.getDay()];

  // ▼30分丸め
  function roundTo30min(date) {
    const h = date.getHours();
    const m = date.getMinutes();
    return (m < 30)
      ? `${String(h).padStart(2,"0")}:00`
      : `${String(h).padStart(2,"0")}:30`;
  }

  const timeKey = roundTo30min(now);
  const todayData = storeData[weekday];

  if (!todayData || !todayData[timeKey]) {
    document.getElementById("wt_time").textContent = "";
    document.getElementById("wt_people").textContent = "データなし";
    document.getElementById("wt_wait").textContent = "";
    return;
  }

  const info = todayData[timeKey];

  // ▼色分け
  function getColor(wait) {
    if (wait === 0) return "blue";
    if (wait < 10) return "green";
    if (wait < 20) return "orange";
    if (wait < 30) return "red";
    return "purple"; 
  }

  const color = getColor(info.wait);

  // ▼現在時刻
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const timeText = `${h}時${m}分現在`;

  // ▼出力
  document.getElementById("wt_time").textContent = timeText;
  document.getElementById("wt_people").innerHTML =
    `<span style="color:${color}; font-weight:bold;">約${info.people}名</span>`;
  document.getElementById("wt_wait").innerHTML =
    `<span style="color:${color}; font-weight:bold;">約${info.wait}分待ち</span>`;

})();
