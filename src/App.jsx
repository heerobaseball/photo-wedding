import React, { useState, useEffect } from 'react';
import { Camera, Clock, MapPin, Heart, CheckSquare, Sparkles, Phone, Music, Sun } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');

  // チェックリストの状態管理
  // ★変更点：保存機能付きのリスト管理
  const [items, setItems] = useState(() => {
    // まず保存されたデータがあるか確認
    const saved = localStorage.getItem("weddingChecklist");
    if (saved) {
      return JSON.parse(saved);
    } else {
      // 保存データがなければ初期値を使う
      return [
        { id: 1, text: "結婚指輪・婚約指輪", checked: false, essential: true },
        { id: 2, text: "撮影指示書（ポーズ集）", checked: false, essential: true },
        { id: 3, text: "肌着・ストッキング", checked: false, essential: true },
        { id: 4, text: "新郎用靴下（黒/白）", checked: false, essential: true },
        { id: 5, text: "現金・カード（決済用）", checked: false, essential: true },
        { id: 6, text: "スマホ・充電器", checked: false, essential: false },
        { id: 7, text: "手鏡・メイク直し用品", checked: false, essential: false },
        { id: 8, text: "飲み物（ストロー付き）", checked: false, essential: false },
        { id: 9, text: "日焼け止め・虫除け", checked: false, essential: false },
        { id: 10, text: "撮影小物（ガーランド等）", checked: false, essential: false },
        { id: 11, text: "軽食（ひと口サイズ）", checked: false, essential: false },
      ];
    }
  });

  // ★追加点：チェックが変わるたびに自動保存する
  useEffect(() => {
    localStorage.setItem("weddingChecklist", JSON.stringify(items));
  }, [items]);

  const toggleCheck = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const scheduleData = [
    { time: "12:50", title: "受付", desc: "現地で着替える場合、撮影開始20分前をめどにご到着ください" },
    { time: "13:00", title: "撮影開始", desc: "結婚式写真、その後自由撮影" },
    { time: "14:00", title: "撮影終了", desc: " " },
    { time: "15:00", title: "お茶会", desc: "場所:" },
    { time: "16:30", title: "お開き", desc: "ありがとうございました" },
  ];

  const shotList = [
    "指輪の交換シーン", "背中合わせで座る", "ベール越しのショット",
    "遠近法を使った面白写真", "二人の手元のアップ", "自然に歩いている後ろ姿"
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 pb-20">
      {/* Header / Hero Section */}
      <div className="relative h-64 bg-rose-100 overflow-hidden">
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
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm flex justify-around p-2">
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center p-2 text-xs ${activeTab === 'schedule' ? 'text-rose-500 font-bold' : 'text-stone-400'}`}
        >
          <Clock className="w-5 h-5 mb-1" />
          当日の流れ
        </button>
        <button 
          onClick={() => setActiveTab('items')}
          className={`flex flex-col items-center p-2 text-xs ${activeTab === 'items' ? 'text-rose-500 font-bold' : 'text-stone-400'}`}
        >
          <CheckSquare className="w-5 h-5 mb-1" />
          持ち物
        </button>
        <button 
          onClick={() => setActiveTab('photo')}
          className={`flex flex-col items-center p-2 text-xs ${activeTab === 'photo' ? 'text-rose-500 font-bold' : 'text-stone-400'}`}
        >
          <Camera className="w-5 h-5 mb-1" />
          撮影指示書
        </button>
        <button 
          onClick={() => setActiveTab('access')}
          className={`flex flex-col items-center p-2 text-xs ${activeTab === 'access' ? 'text-rose-500 font-bold' : 'text-stone-400'}`}
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

        {/* --- ITEMS TAB --- */}
        {activeTab === 'items' && (
          <div className="animate-fade-in">
             <h2 className="text-xl font-serif text-center mb-6">Check List</h2>
             
             <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 mb-6">
               <h3 className="text-sm font-bold text-rose-500 mb-3 border-b border-rose-100 pb-2">絶対に忘れてはいけないもの</h3>
               <div className="space-y-3">
                 {items.filter(i => i.essential).map(item => (
                   <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-rose-500 border-rose-500' : 'border-stone-300 bg-white'}`}>
                       {item.checked && <CheckSquare className="w-3 h-3 text-white" />}
                     </div>
                     <input type="checkbox" className="hidden" checked={item.checked} onChange={() => toggleCheck(item.id)} />
                     <span className={`text-stone-700 transition-all ${item.checked ? 'text-stone-400 line-through' : ''}`}>{item.text}</span>
                   </label>
                 ))}
               </div>
             </div>

             <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
               <h3 className="text-sm font-bold text-stone-500 mb-3 border-b border-stone-100 pb-2">あると便利なもの</h3>
               <div className="space-y-3">
                 {items.filter(i => !i.essential).map(item => (
                   <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-rose-500 border-rose-500' : 'border-stone-300 bg-white'}`}>
                       {item.checked && <CheckSquare className="w-3 h-3 text-white" />}
                     </div>
                     <input type="checkbox" className="hidden" checked={item.checked} onChange={() => toggleCheck(item.id)} />
                     <span className={`text-stone-700 transition-all ${item.checked ? 'text-stone-400 line-through' : ''}`}>{item.text}</span>
                   </label>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* --- PHOTO TAB --- */}
        {activeTab === 'photo' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-serif text-center mb-6">Shot List</h2>
            <p className="text-xs text-center text-stone-500 mb-6">カメラマンさんにお願いしたいポーズ</p>
            <div className="grid grid-cols-2 gap-4">
              {shotList.map((shot, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-stone-100 flex flex-col items-center text-center justify-center aspect-square hover:bg-rose-50 transition-colors">
                  <Camera className="w-6 h-6 text-rose-300 mb-2" />
                  <span className="text-sm font-medium text-stone-700">{shot}</span>
                </div>
              ))}
              <div className="bg-stone-100 p-4 rounded-lg border border-dashed border-stone-300 flex flex-col items-center text-center justify-center aspect-square text-stone-400">
                <span className="text-xs">他にも思いついたら<br/>メモしておこう</span>
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
              <p className="text-sm text-stone-500 mb-3">埼玉県さいたま市大宮区桜木町２丁目３ 丸井大宮店 7階</p>
              <div className="w-full h-48 mb-3 rounded-lg overflow-hidden border border-stone-200">
                <iframe 
                  /* ↓↓↓ この src="◯◯" の中身を、手順1でコピーしたURLと差し替えてください ↓↓↓ */
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3231.6375335291!2d139.62158349999999!3d35.90689210000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018c1437a393069%3A0xc425bbc7d3396524!2z5bCP44GV44Gq57WQ5ama5byPIOWkp-WuruW6lw!5e0!3m2!1sja!2sjp!4v1771545984145!5m2!1sja!2sjp" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="bg-stone-100 rounded p-3 text-xs text-stone-600">
                <p>🚃 大宮駅日口 徒歩1分</p>
                <p>🚗 近くにコインパーキング有 (DOM地下・立体駐車場)</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
              <h3 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500" /> 緊急連絡先
              </h3>
              <div className="space-y-2 text-sm">
                 <div className="flex justify-between border-b border-stone-100 pb-2">
                   <span className="text-stone-500">スタジオ</span>
                   <span className="font-mono">03-0000-0000</span>
                 </div>
                 <div className="flex justify-between border-b border-stone-100 pb-2">
                   <span className="text-stone-500">新郎携帯</span>
                   <span className="font-mono">090-0000-0000</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-stone-500">新婦携帯</span>
                   <span className="font-mono">090-0000-0000</span>
                 </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}