export const onRequest = async (context) => {
  // 環境変数からユーザー名とパスワードを取得
  const USER = context.env.BASIC_USER;
  const PASS = context.env.BASIC_PASS;

  // 設定されていなければ認証なしで通す（事故防止）
  if (!USER || !PASS) {
    return context.next();
  }

  // ブラウザから送られてきた認証情報をチェック
  const authHeader = context.request.headers.get('Authorization');

  if (authHeader) {
    // "Basic xxxxx" の xxxxx 部分（Base64）をデコード
    const base64 = authHeader.split(' ')[1];
    if (base64) {
      const [user, pass] = atob(base64).split(':');
      // 一致したらページを表示
      if (user === USER && pass === PASS) {
        return context.next();
      }
    }
  }

  // 一致しない（または初回アクセス）場合は、ログイン画面を出す
  return new Response('パスワードを入力してください', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Photo Wedding Access"',
    },
  });
};