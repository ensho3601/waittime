(async function() {

  // ▼あなたのGitHub PagesのURL
  const jsonUrl = "https://ensho3601.github.io/waittime/wait.json";

  const res = await fetch(jsonUrl);
  const data = await res.json();

  const now = new Date();
  const weekdayList = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const weekday = weekdayList[now.getDay()];

  // ▼データ参照は30分丸め（あなたの元データ仕様）
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

  // ▼色分けロジック（あなたの元仕様）
  function getColor(wait) {
    if (wait === 0) return "blue";
    if (wait < 10) return "green";
    if (wait < 20) return "orange";
    if (wait < 30) return "red";
    return "purple";
  }

  const color = getColor(info.wait);

  // ▼待ち時間と行列人数は色分けして太字
  document.getElementById("waittime").innerHTML =
    `<span style="color:${color}; font-weight:bold;">待ち時間：約${info.wait}分</span>`;

  document.getElementById("people").innerHTML =
    `<span style="color:${color}; font-weight:bold;">行列：約${info.people}人</span>`;

  // ▼★ここを修正 — 1分単位で表示させる★
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("timestamp").textContent =
    `（${h}時${m}分 現在）`;

})();
