(async function() {
  // JSON の URL（GitHub Pages の URL）
  const jsonUrl = "https://ensho3601.github.io/waittime/wait.json?ver=" + Date.now();

  try {
    // JSON を取得
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error("データ取得失敗");
    const data = await res.json();

    const now = new Date();
    const weekdayNames = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    const weekday = weekdayNames[now.getDay()];

    // 現在の時刻（1分単位）
    const hour = now.getHours().toString().padStart(2,"0");
    const minute = now.getMinutes().toString().padStart(2,"0");

    // JSON は30分単位でもOK → 近い時刻を取得
    const roundedMin = now.getMinutes() < 30 ? "00" : "30";
    const timeKey = `${hour}:${roundedMin}`;

    const info = data[weekday][timeKey];

    const waitDiv = document.getElementById("waittime");

    if(info){
      waitDiv.textContent = `${hour}時${minute}分現在　行列約${info.people}人　待ち時間約${info.wait}分`;
    } else {
      waitDiv.textContent = `${hour}時${minute}分現在　現在の情報はありません`;
    }

  } catch(err) {
    console.error(err);
    const waitDiv = document.getElementById("waittime");
    waitDiv.textContent = "情報取得に失敗しました";
  }
})();
