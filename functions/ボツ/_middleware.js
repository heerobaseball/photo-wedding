export async function onRequest(context) {
  const { request, next } = context;

  // 1. ブラウザに「30日間有効な入場券（クッキー）」があるかチェック
  const cookie = request.headers.get("Cookie");
  if (cookie && cookie.includes("wedding_auth=logged_in")) {
    return next(); // 入場券があれば、パスワードなしでそのままページを表示
  }

  // ★ここをご自身で設定したユーザー名とパスワードに書き換えてください
  const USERNAME = "guest";     // ユーザー名
  const PASSWORD = "hiro0321mami"; // パスワード

  // 認証情報の作成
  const expectedAuth = "Basic " + btoa(`${USERNAME}:${PASSWORD}`);
  const authHeader = request.headers.get("Authorization");

  // 2. 入場券もなく、パスワードも入力されていない（または間違っている）場合はログイン画面を出す
  if (!authHeader || authHeader !== expectedAuth) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Please enter your password"',
      },
    });
  }

  // 3. パスワードが合っていた場合：ページを表示しつつ「30日間有効な入場券」をブラウザに渡す
  const response = await next();
  const newResponse = new Response(response.body, response);
  
  // クッキーをセット（Max-Age=2592000 は 30日間有効 という意味です）
  newResponse.headers.set(
    "Set-Cookie",
    "wedding_auth=logged_in; Max-Age=2592000; Path=/; HttpOnly; Secure; SameSite=Lax"
  );

  return newResponse;
}