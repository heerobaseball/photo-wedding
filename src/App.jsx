import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Heart, Sparkles, MessageSquare, Lock } from 'lucide-react';

const introImages = ["/1.jpg", "/2.jpg"];

export default function App() {
  // ==========================================
  // 1. 状態管理
  // ==========================================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [weddingData, setWeddingData] = useState(null);

  // 初回読み込み時の処理
  useEffect(() => {
    const savedToken = localStorage.getItem('weddingToken');
    if (savedToken) {
      fetchWeddingData(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchWeddingData = async (token) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/wedding-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
      });

      if (response.ok) {
        const data = await response.json();
        setWeddingData(data);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('weddingToken');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const loginRes = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      if (loginRes.ok) {
        const { token } = await loginRes.json();
        localStorage.setItem('weddingToken', token);
        await fetchWeddingData(token);
      } else {
        setLoginError(true);
        setPasswordInput('');
        setIsLoading(false);
      }
    } catch (error) {
      console.error("通信エラーが発生しました");
      setIsLoading(false);
    }
  };

  // ==========================================
  // 2. メイン画面の各種設定
  // ==========================================
  const [activeTab, setActiveTab] = useState('schedule');
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('weddingIntroSeen'));
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [randomImage, setRandomImage] = useState(introImages[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * introImages.length);
    setRandomImage(introImages[randomIndex]);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !showIntro) return;
    sessionStorage.setItem('weddingIntroSeen', 'true');
    const fadeInTimer = setTimeout(() => setIsFadingIn(true), 50);
    const fadeOutTimer = setTimeout(() => setIsFadingOut(true), 4000);
    const removeTimer = setTimeout(() => setShowIntro(false), 5000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [isAuthenticated, showIntro]);

  useEffect(() => {
    if (navigator.userAgent.match(/Line/i)) {
      if (window.location.search.indexOf('openExternalBrowser=1') === -1) {
        const newUrl = window.location.href + (window.location.search ? '&' : '?') + 'openExternalBrowser=1';
        window.location.href = newUrl;
      }
    }
  }, []);

  // ==========================================
  // 3. 画面の表示
  // ==========================================
  if (isLoading) {
    return <div className="min-h-screen bg-rose-50 flex items-center justify-center font-serif text-rose-400">Loading...</div>;
  }

  if (!isAuthenticated || !weddingData) {
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
              {loginError && <p className="text-xs text-rose-500 mt-2 font-bold animate-pulse">パスワードが間違っています</p>}
            </div>
            <button type="submit" className="w-full bg-rose-400 text-white font-bold py-3 rounded-lg shadow-md hover:bg-rose-500 transition-colors">
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      {showIntro && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-stone-900 overflow-hidden transition-opacity duration-1000 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isFadingIn ? 'opacity-100' : 'opacity-0'}`}>
            <img src={randomImage} alt="intro-slide" className="absolute inset-0 w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center z-10">
              <h1 className="text-4xl font-serif text-white tracking-widest animate-pulse drop-shadow-lg">Welcome</h1>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-stone-50 font-sans text-stone-800 pb-20">
        <div className="relative h-64 bg-rose-100 overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-stone-500 tracking-widest text-sm mb-2">2026.03.21 (SAT)</p>
            <h1 className="text-3xl font-serif text-stone-700 mb-2">Photo Wedding</h1>
            <div className="flex items-center gap-3 text-lg font-medium text-stone-600">
              <span>Hiroki</span><Heart className="w-4 h-4 text-rose-400 fill-rose-400" /><span>Mami</span>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm flex justify-around p-2 animate-fade-in">
          <button onClick={() => setActiveTab('schedule')} className={`flex flex-col items-center p-2 w-1/3 text-xs ${activeTab === 'schedule' ? 'text-rose-500 font-bold' : 'text-stone-400'}`}><Clock className="w-5 h-5 mb-1" />当日の流れ</button>
          <button onClick={() => setActiveTab('contact')} className={`flex flex-col items-center p-2 w-1/3 text-xs ${activeTab === 'contact' ? 'text-rose-500 font-bold' : 'text-stone-400'}`}><MessageSquare className="w-5 h-5 mb-1" />備考・要望</button>
          <button onClick={() => setActiveTab('access')} className={`flex flex-col items-center p-2 w-1/3 text-xs ${activeTab === 'access' ? 'text-rose-500 font-bold' : 'text-stone-400'}`}><MapPin className="w-5 h-5 mb-1" />アクセス</button>
        </div>

        <div className="max-w-md mx-auto p-6">
          {activeTab === 'schedule' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-serif text-center mb-6 flex items-center justify-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500" /> Time Schedule</h2>
              <div className="relative border-l-2 border-rose-200 ml-3 space-y-8 pl-6 py-2">
                {weddingData.schedule.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 bg-rose-400 rounded-full border-2 border-white shadow-sm"></div>
                    <span className="text-sm font-bold text-rose-500 block mb-1">{item.time}</span>
                    <h3 className="text-lg font-medium text-stone-800">{item.title}</h3>
                    <p className="text-stone-500 text-sm mt-1 leading-relaxed whitespace-pre-wrap">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-serif text-center mb-6">Message</h2>
              <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100">
                <p className="text-sm text-stone-600 mb-2 px-3 pt-3 leading-relaxed">連絡事項などありましたら、こちらからお気軽にお知らせください。</p>
                <div className="w-full overflow-hidden rounded-lg">
                  <iframe src={weddingData.formUrl} width="100%" height="600" frameBorder="0" marginHeight="0" marginWidth="0">読み込んでいます…</iframe>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-serif text-center mb-6">Access & Contact</h2>
              
              {/* 大宮店の情報 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 mb-4">
                <h3 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" /> {weddingData.access.location1.title}
                </h3>
                <p className="text-stone-600 font-bold mb-1">{weddingData.access.location1.name}</p>
                <p className="text-sm text-stone-500 mb-3">{weddingData.access.location1.address}</p>
                <div className="w-full h-48 mb-3 rounded-lg overflow-hidden border border-stone-200">
                  <iframe src={weddingData.access.location1.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className="bg-stone-100 rounded p-3 text-xs text-stone-600">
                  <p>{weddingData.access.location1.note1}</p>
                  <p>{weddingData.access.location1.note2}</p>
                </div>
              </div>
              
              {/* セレンディピティタータ（2次会）の情報 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 mb-4">
                <h3 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" /> {weddingData.access.location2.title}
                </h3>
                
                {/* ★追加：店舗名と食べログリンクを横並びで表示 */}
                <div className="flex items-baseline gap-3 mb-1">
                  <p className="text-stone-600 font-bold">{weddingData.access.location2.name}</p>
                  {/* 金庫から届いたURLがある場合のみリンクを表示 */}
                  {weddingData.access.location2.siteUrl && (
                    <a 
                      href={weddingData.access.location2.siteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-rose-500 underline hover:text-rose-600 transition-colors"
                    >
                      食べログを見る
                    </a>
                  )}
                </div>
                
                <p className="text-sm text-stone-500 mb-3">{weddingData.access.location2.address}</p>
                <div className="w-full h-48 mb-3 rounded-lg overflow-hidden border border-stone-200">
                  <iframe src={weddingData.access.location2.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className="bg-stone-100 rounded p-3 text-xs text-stone-600">
                  <p>{weddingData.access.location2.note1}</p>
                  <p>{weddingData.access.location2.note2}</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}