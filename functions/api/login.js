export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    // ★ここでパスワードをチェックします
    if (body.password === "hiro0321mami") {
      // 正解ならセッショントークン（入場券）を発行します
      // （本格的なアプリでは毎回ランダムな文字列を作りますが、今回は十分安全な固定のシークレットキーにします）
      const token = "sec_token_wedding_2026_xyz987";
      
      return new Response(JSON.stringify({ token: token }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 不正解の場合
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response("Bad Request", { status: 400 });
  }
}