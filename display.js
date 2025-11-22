(async function() {
  // JSON の URL（GitHub Pages の URL を正確に指定）
  const jsonUrl = "https://ensho3601.github.io/waittime/wait.json?ver=" + Date.now();

  try {
    // JSON を取得
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error("データ取得失敗");
    const data = await res.json();

    // 現在時刻を取得
    const now = new Date();
    const weekdayNames = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    const weekday = weekdayNames[now.getDay()];

    // 時刻を 30分単位に丸め
    const hour = now.getHours().toString().padStart(2,"0");
    const min = now.getMinutes();
    const roundedMin = min < 30 ? "00" : "30";
    const timeKey = `${hour}:${roundedMin}`;

    // JSON から情報を取得
    const info = data[weekday][timeKey];

    // 表示用 div を取得
    const waitDiv = document.getElementById("waittime");

    // 表示
    if(info){
      waitDiv.textContent = `${hour}時${roundedMin}分現在　行列約${info.people}人　待ち時間約${info.wait}分`;
    } else {
      waitDiv.textContent = "現在の情報はありません";
    }

  } catch(err) {
    console.error(err);
    const waitDiv = document.getElementById("waittime");
    waitDiv.textContent = "情報取得に失敗しました";
  }
})();
