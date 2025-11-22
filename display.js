(async function() {

  // JSON の URL（あなたのIDに置き換え）
  const jsonUrl = "https://ensho3601.github.io/waittime/wait.json";

  const res = await fetch(jsonUrl);
  const data = await res.json();
  
  const now = new Date();
  const weekdayList = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const weekday = weekdayList[now.getDay()];

  // 時刻を11:00、11:30のように30分丸め
  function roundTo30min(date) {
    const h = date.getHours();
    const m = date.getMinutes();
    return (m < 30)
      ? `${String(h).padStart(2,"0")}:00`
      : `${String(h).padStart(2,"0")}:30`;
  }

  const timeKey = roundTo30min(now);

  const todayData = data[weekday];

  if (!todayData || !todayData[timeKey]) {
    document.getElementById("waittime").textContent = "データなし";
    return;
  }

  const info = todayData[timeKey];

  document.getElementById("waittime").textContent =
    `待ち時間：約${info.wait}分`;

  document.getElementById("people").textContent =
    `行列：約${info.people}人`;

  document.getElementById("timestamp").textContent =
    `（${timeKey} 時点）`;

})();
