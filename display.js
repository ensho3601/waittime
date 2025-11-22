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
      const wait = info.wait;
      let textColor = "black";
      let bgColor = "transparent";

      // 待ち時間による色分け・背景色
      if(wait === 0){ textColor="blue"; bgColor="#e0f0ff"; }
      else if(wait < 10){ textColor="green"; bgColor="#e0ffe0"; }
      else if(wait < 20){ textColor="orange"; bgColor="#fff0e0"; }
      else if(wait < 30){ textColor="red"; bgColor="#ffe0e0"; }
      else { textColor="purple"; bgColor="#f0e0ff"; }

      // CSS アニメーション pulse 定義（1回だけ head に追加）
      const styleId = "pulse-style";
      if(!document.getElementById(styleId)){
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .pulse {
            display:inline-block;
            animation: pulse 1s infinite;
          }
        `;
        document.head.appendChild(style);
      }

      // 太字 + 背景 + pulse
      waitDiv.innerHTML = `${hour}時${minute}分現在　` +
                          `<span class="pulse" style="font-weight:bold; color:${textColor}; background-color:${bgColor}; padding:2px 6px; border-radius:4px;">` +
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
