(async function() {

  // ▼あなたのGitHub PagesのURLに変更
  const jsonUrl = "https://ensho3601.github.io/waittime/wait.json";

  const res = await fetch(jsonUrl);
  const data = await res.json();

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
  const todayData = data[weekday];

  if (!todayData || !todayData[timeKey]) {
    document.getElementById("waittime").textContent = "データなし";
    document.getElementById("people").textContent = "";
    document.getElementById("timestamp").textContent = "";
    return;
  }

  const info = todayData[timeKey];

  // ▼色分けロジック
  function getColor(wait) {
    if (wait === 0) return "blue";                // 0分 → 青
    if (wait < 10) return "green";                // 10分未満 → 緑
    if (wait < 20) return "orange";               // 20分未満 → オレンジ
    if (wait < 30) return "red";                  // 30分未満 → 赤
    return "purple";                              // 30分以上 → 赤紫
  }

  const color = getColor(info.wait);

  // ▼色 + 太字で表示
  document.getElementById("waittime").innerHTML =
    `<span style="color:${color}; font-weight:bold;">待ち時間：約${info.wait}分</span>`;

  document.getElementById("people").innerHTML =
    `<span style="color:${color}; font-weight:bold;">行列：約${info.people}人</span>`;

  // ▼時刻表示（1分単位ではなく30分単位）
  document.getElementById("timestamp").textContent =
    `（${timeKey} 時点）`;

})();
