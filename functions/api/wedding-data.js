export async function onRequestPost(context) {
  const { request } = context;

  try {
    // ゲストのスマホ（アプリ）から送られてきたパスワードを受け取る
    const body = await request.json();

    // ★ここでパスワードチェック
    if (body.password !== "hiro0321mami") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // パスワードが合っていたら、秘密のデータをまとめて返す
    const secretData = {
      // フォームのURL
      formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScEfJ5EyVlPr5kWWOqe14ENMF2VcZF6AwK5qOGCMogcmzYIUA/viewform?usp=dialog",
      
      // ★追加：アクセス情報（施設名や住所など）
      access: {
        location1: {
          title: "集合場所",
          name: "小さな結婚式 大宮店",
          address: "埼玉県さいたま市大宮区桜木町2丁目3 丸井大宮店 7階",
          mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3231.6375335291!2d139.62158349999999!3d35.90689210000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018c1437a393069%3A0xc425bbc7d3396524!2z5bCP44GV44Gq57WQ5ama5byPIOWkp-WuruW6lw!5e0!3m2!1sja!2sjp!4v1771546356588!5m2!1sja!2sjp",
          note1: "🚃 大宮駅西口 徒歩1分",
          note2: "🚗 近くにコインパーキング有 (DOM地下・立体駐車場)"
        },
        location2: {
          title: "お茶会 集合場所",
          name: "セレンディピティタータ",
          address: "埼玉県さいたま市西区指扇3547−9",
          mapUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12925.065372305058!2d139.5780144!3d35.9159802!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018c53328d707b7%3A0x29a45e3e4ef77edb!2z44K744Os44Oz44OH44Kj44OU44OG44Kj44K_44O844K_!5e0!3m2!1sja!2sjp!4v1772027428159!5m2!1sja!2sjp",
          note1: "🚃 西大宮駅から徒歩5分",
          note2: "🚗 駐車場が御座いませんので、西大宮駅周辺のコインパーキングのご利用お願い致します"
        }
      },

      // スケジュールデータ
      schedule: [
        { time: "12:50", title: "受付", desc: "現地で着替える場合、撮影開始20分前をめどにご到着ください" },
        { time: "13:00", title: "撮影開始", desc: "結婚式写真、その後自由撮影" },
        { time: "14:00", title: "撮影終了", desc: " " },
        { time: "15:00", title: "お茶会", desc: "場所: セレンディピティタータ\nアクセス : JR西大宮駅から徒歩5分" },
        { time: "16:30", title: "お開き", desc: "ご参加ありがとうございました  お気をつけてお帰りください" }
      ]
    };

    return new Response(JSON.stringify(secretData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response("Bad Request", { status: 400 });
  }
}