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
      else if(wait < 20){ textColor="orange"; bgColor="#fff0
