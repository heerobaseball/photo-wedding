import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Heart, Sparkles, MessageSquare, Lock } from 'lucide-react';

// スライドショー用の画像URL（この中からランダムで1枚選ばれます）
const introImages = [
  "/1.jpg",
  "/2.jpg"
];

// ゲストに案内する共通パスワード
const GUEST_PASSWORD = "hiro0321mami"; 

export default function App() {
  // ==========================================
  // 1. ログイン状態の管理（ブラウザに記憶させます）
  // ==========================================
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // 過去にログインして記憶されていれば、最初から true にする
    return localStorage.getItem('weddingAuth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // ログインボタンを押したときの処理
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === GUEST_PASSWORD) {
      // パスワードが合っていれば記憶してメイン画面へ
      localStorage.setItem('weddingAuth', 'true');
      setIsAuthenticated(true);
    } else {
      // 間違っていればエラーを出す
      setLoginError(true);
      setPasswordInput('');
    }
  };


  // ==========================================
  // 2. メイン画面の各種設定
  // ==========================================
  const [activeTab, setActiveTab] = useState('schedule');
  
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('weddingIntroSeen');
  });
  
  // フェードインとフェードアウトの両方を管理するステート
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // ★確実に画像をランダムにするための修正を適用しています
  const [randomImage, setRandomImage] = useState(introImages[0]);

  useEffect(() => {
    // 画面が読み込まれた瞬間にサイコロを振り、ランダムな1枚をセットする
    const randomIndex = Math.floor(Math.random() * introImages.length);
    setRandomImage(introImages[randomIndex]);
  }, []);

  // スライドショーのアニメーション
  useEffect(() => {
    if (!isAuthenticated || !showIntro) return;

    sessionStorage.setItem('weddingIntroSeen', 'true');

    // 1. 開いてすぐ（0.05秒後）に「写真と文字」がフワッと現れ始める
    const fadeInTimer = setTimeout(() => {
      setIsFadingIn(true);
    }, 50);

    // 2. 4秒後に「画面全体」がフワッと消え始める（フェードアウト）
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4000);

    // 3. 5秒後に完全に画面をDOMから消す
    const removeTimer = setTimeout(() => {
      setShowIntro(false);
    }, 5000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [isAuthenticated, showIntro]);

  // LINEブラウザで開かれたら外部ブラウザへ自動で飛ばす
  useEffect(() => {
    if (navigator.userAgent.match(/Line/i)) {
      if (window.location.search.indexOf('openExternalBrowser=1') === -1) {
        const newUrl = window.location.href + (window.location.search ? '&' : '?') + 'openExternalBrowser=1';
        window.location.href = newUrl;
      }
    }
  }, []);

  const scheduleData = [
    { time: "12:50", title: "受付", desc: "現地で着替える場合、撮影開始20分前をめどにご到着ください" },
    { time: "13:00", title: "撮影開始", desc: "結婚式写真、その後自由撮影" },
    { time: "14:00", title: "撮影終了", desc: " " },
    { time: "15:00", title: "お茶会", desc: (
      <>
        場所: <a href="https://maps.app.goo.gl/WnEiV2UgmZ7eTi827" target="_blank" rel="noopener noreferrer" className="text-rose-500 underline font-bold">セレンディピティタータ</a><br />アクセス : JR西大宮駅から徒歩5分
      </>
    )},
    { time: "16:30", title: "お開き", desc: "ありがとうございました" },
  ];


  // ==========================================
  // 3. 画面の表示（パスワード画面 or メイン画面）
  // ==========================================

  // ★ログインしていない場合は、この「専用ログイン画面」を表示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4 font-sans text-stone-800">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 w-full max-w-sm text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <Lock className="w-8 h-8 text-rose-300" />
          </div>
          <h1 className="text-2xl font-serif text-stone-700 mb-2">Photo Wedding</h1>
          <p className="text-sm text-stone-500 mb-6">ゲスト専用ページです。<br/>ご案内のパスワードを入力してください。</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setLoginError(false);
                }}
                className="w-full border border-stone-300 rounded-lg p-3 text-center focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-shadow tracking-widest"
                placeholder="パスワード"
              />
              {loginError && (
                <p className="text-xs text-rose-500 mt-2 font-bold animate-pulse">
                  パスワードが間違っています
                </p>
              )}
            </div>
            <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 rounded-lg shadow-md hover:bg-rose-500 transition-colors">
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ★ログイン済みの場合は、こちらの「メイン画面」を表示
  return (
    <>
      {/* --- スライドショーのオーバーレイ画面 --- */}
      {showIntro && (
        <div 
          // 背景（bg-stone-900）は最初から不透明のままにし、消える時（isFadingOut）だけ透明にします
          className={`fixed inset-0 z-50 flex items-center justify-center bg-stone-900 overflow-hidden transition-opacity duration-1000 ease-in-out ${
            isFadingOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* 中の画像と文字だけを透明からフワッと表示させます */}
          <div 
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isFadingIn ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={randomImage}
              alt="intro-slide"
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* 画像の上に重ねるうっすらとした黒いフィルターと文字 */}
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center z-10">
              <h1 className="text-4xl font-serif text-white tracking-widest animate-pulse drop-shadow-lg">
                Welcome
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* --- 通常のメイン画面 --- */}
      <div className="min-h-screen bg-stone-50 font-sans text-stone-800 pb-20">
        {/* Header / Hero Section */}
        <div className="relative h-64 bg-rose-100 overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10"></div>
          {/* Decorative Circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
          
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-stone-500 tracking-widest text-sm mb-2">2026.03.21 (SAT)</p>
            <h1 className="text-3xl font-serif text-stone-700 mb-2">Photo Wedding</h1>
            <div className="flex items-center gap-3 text-lg font-medium text-stone-600">
              <span>Hiroki</span>
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>Mami</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm flex justify-around p-2 animate-fade-in">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center p-2 w-1/3 text-xs ${activeTab === 'schedule' ? 'text-rose-500 font-bold' : 'text-stone-400'}`}
          >
            <Clock className="w-5 h-5 mb-1" />
            当日の流れ
          </button>
          
          <button 
            onClick={() => setActiveTab('contact')}
            className={`flex flex-col items-center p-2 w-1/3 text-xs ${activeTab === 'contact' ? 'text-rose-500 font-bold' : 'text-stone-400'}`}
          >
            <MessageSquare className="w-5 h-5 mb-1" />
            備考・要望
          </button>

          <button 
            onClick={() => setActiveTab('access')}
            className={`flex flex-col items-center p-2 w-1/3 text-xs ${activeTab === 'access' ? 'text-rose-500 font-bold' : 'text-stone-400'}`}
          >
            <MapPin className="w-5 h-5 mb-1" />
            アクセス
          </button>
        </div>

        {/* Content Area */}
        <div className="max-w-md mx-auto p-6">
          
          {/* --- SCHEDULE TAB --- */}
          {activeTab === 'schedule' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-serif text-center mb-6 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> Time Schedule
              </h2>
              <div className="relative border-l-2 border-rose-200 ml-3 space-y-8 pl-6 py-2">
                {scheduleData.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 bg-rose-400 rounded-full border-2 border-white shadow-sm"></div>
                    <span className="text-sm font-bold text-rose-500 block mb-1">{item.time}</span>
                    <h3 className="text-lg font-medium text-stone-800">{item.title}</h3>
                    <p className="text-stone-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- CONTACT TAB --- */}
          {activeTab === 'contact' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-serif text-center mb-6">Message</h2>
              
              <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100">
                <p className="text-sm text-stone-600 mb-2 px-3 pt-3 leading-relaxed">
                  連絡事項などありましたら、こちらからお気軽にお知らせください。
                </p>
                
                <div className="w-full overflow-hidden rounded-lg">
                  <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLScEfJ5EyVlPr5kWWOqe14ENMF2VcZF6AwK5qOGCMogcmzYIUA/viewform?usp=dialog" 
                    width="100%" 
                    height="600" 
                    frameBorder="0" 
                    marginHeight="0" 
                    marginWidth="0"
                  >
                    読み込んでいます…
                  </iframe>
                </div>
              </div>
            </div>
          )}

          {/* --- ACCESS TAB --- */}
          {activeTab === 'access' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-serif text-center mb-6">Access & Contact</h2>
              
              <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 mb-4">
                <h3 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" /> 集合場所
                </h3>
                <p className="text-stone-600 font-bold mb-1">小さな結婚式 大宮店</p>
                <p className="text-sm text-stone-500 mb-3">埼玉県さいたま市大宮区桜木町2丁目3 丸井大宮店 7階</p>
                
                <div className="w-full h-48 mb-3 rounded-lg overflow-hidden border border-stone-200">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3231.6375335291!2d139.62158349999999!3d35.90689210000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018c1437a393069%3A0xc425bbc7d3396524!2z5bCP44GV44Gq57WQ5ama5byPIOWkp-WuruW6lw!5e0!3m2!1sja!2sjp!4v1771546356588!5m2!1sja!2sjp" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                
                <div className="bg-stone-100 rounded p-3 text-xs text-stone-600">
                  <p>🚃 大宮駅西口 徒歩1分</p>
                  <p>🚗 近くにコインパーキング有 (DOM地下・立体駐車場)</p>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 mb-4">
                <h3 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" /> お茶会 集合場所
                </h3>
                <p className="text-stone-600 font-bold mb-1">セレンディピティタータ</p>
                <p className="text-sm text-stone-500 mb-3">埼玉県さいたま市西区指扇3547−9</p>
                
                <div className="w-full h-48 mb-3 rounded-lg overflow-hidden border border-stone-200">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12925.065372305058!2d139.5780144!3d35.9159802!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018c53328d707b7%3A0x29a45e3e4ef77edb!2z44K744Os44Oz44OH44Kj44OU44OG44Kj44K_44O844K_!5e0!3m2!1sja!2sjp!4v1772027428159!5m2!1sja!2sjp" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                
                <div className="bg-stone-100 rounded p-3 text-xs text-stone-600">
                  <p>🚃 西大宮駅から徒歩5分</p>
                  <p>🚗 駐車場が御座いませんので、西大宮駅周辺のコインパーキングのご利用お願い致します</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}