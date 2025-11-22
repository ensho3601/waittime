(async function() {
  const jsonUrl = "https://ensho3601.github.io/waittime/wait.json?ver=" + Date.now();

  try {
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error("データ取得失敗");
    const data = await res.json();

    const now = new Date();
    const weekdayNames = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    const weekday = weekdayNames[now.getDay()];

    const hour = now.getHours().toString().padStart(2,"0");
    const minute = now.getMinutes().toString().padStart(2,"0");

    // JSON は30分単位
    const roundedMin = now.getMinutes() < 30 ? "00" : "30";
    const timeKey = `${hour}:${roundedMin}`;

    const info = data[weekday][timeKey];

    const waitDiv = document.getElementById("waittime");

    if(info){
      // 待ち時間による色分け
      let color = "black"; // デフォルト
      const wait = info.wait;
      if(wait === 0) color = "blue";
      else if(wait < 10) color = "green";
      else if(wait < 20) color = "orange";
      else if(wait < 30) color = "red";
      else color = "purple";

      // 太字 + 色付き表示
      waitDiv.innerHTML = `${hour}時${minute}分現在　` +
                          `<span style="font-weight:bold; color:${color}">` +
                          `行列約${info.people}人　待ち時間約${info.wait}分` +
                          `</span>`;
    } else {
      waitDiv.textContent = `${hour}時${minute}分現在　現在の情報はありません`;
    }

  } catch(err) {
    console.error(err);
    const waitDiv = document.getElementById("waittime");
    waitDiv.textContent = "情報取得に失敗しました";
  }
})();
