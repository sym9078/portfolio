import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, LineChart, Terminal, Video, Image as ImageIcon, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Profile() {
  const { data } = usePortfolio();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  // Auto-slide effect inside modal
  useEffect(() => {
    if (isModalOpen && data.profileImages && data.profileImages.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % data.profileImages!.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isModalOpen, data.profileImages]);

  const workflow = [
    {
      step: "01",
      title: "Ideation",
      desc: "ChatGPT & Claude를 활용한 페르소나 설계 및 카피라이팅 최적화",
      tools: [
        { name: "ChatGPT", icon: <Bot size={14} /> },
        { name: "Claude", icon: <Sparkles size={14} /> }
      ]
    },
    {
      step: "02",
      title: "Creation",
      desc: "Kling, Flow를 활용한 고효율 소재 제작 및 Nano Banana 기반 비주얼 브랜딩",
      tools: [
        { name: "Kling", icon: <Video size={14} /> },
        { name: "Flow", icon: <ImageIcon size={14} /> },
        { name: "Nano Banana", icon: <Sparkles size={14} /> }
      ],
      signature: true
    },
    {
      step: "03",
      title: "Optimization",
      desc: "Python 기반 유저 행동 분석 및 GA4 지표 개선",
      tools: [
        { name: "Python", icon: <Terminal size={14} /> },
        { name: "GA4", icon: <LineChart size={14} /> }
      ]
    }
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 bg-zinc-950 overflow-hidden">
      {/* Visual Anchor Background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none mix-blend-screen">
        <img 
          src="/profile_bg.png" 
          alt="Abstract Data Art" 
          className="w-full h-full object-cover rounded-full blur-3xl"
          onError={(e) => {
            // Fallback if image not generated yet
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/data-art/800/800";
          }}
        />
      </div>

      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-mono text-zinc-500 tracking-widest uppercase mb-8">
              Profile
            </h2>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-indigo-400">
              "콘텐츠로 사람을 모으고,<br />
              퍼포먼스로 숫자를 만듭니다."
            </p>
            <p className="text-zinc-400 leading-relaxed text-lg">
              단순히 툴을 사용하는 것을 넘어, 마케팅의 본질인 '설득'과 '성과'에 집중합니다.
              AI는 속도를, 데이터는 방향을 제시하는 도구일 뿐입니다.
              그 도구를 가장 잘 다루는 마케터가 되겠습니다.
            </p>
          </motion.div>

          <div className="space-y-16">
            {workflow.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pt-8"
              >
                {/* Oversized Background Number */}
                <span className="absolute -top-8 -left-6 text-8xl md:text-9xl font-thin text-zinc-800/30 select-none -z-10">
                  {item.step}
                </span>

                <div className="border-t border-zinc-800/50 pt-4">
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-zinc-400 mb-6 leading-relaxed">{item.desc}</p>

                  {/* Tools */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tools.map((tool, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-300 font-medium">
                        {tool.icon}
                        {tool.name}
                      </span>
                    ))}
                  </div>

                  {/* AI Signature Static Preview */}
                  {item.signature && data.profileImages && data.profileImages.length > 0 && (
                    <div 
                      className="relative w-48 h-64 ml-auto -mt-4 z-20 group cursor-pointer overflow-hidden rounded-xl border border-zinc-800 shadow-2xl shadow-black/50"
                      onClick={handleCardClick}
                    >
                      <img 
                        src={data.profileImages[0] || "/creation_sig.png"} 
                        alt="My Work Preview" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://picsum.photos/seed/beauty-film/400/300";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                          Click to Expand
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Screen Carousel Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-5xl aspect-video md:aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 100, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 1.1 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="absolute inset-0"
                >
                  <img 
                    src={data.profileImages![activeIndex]} 
                    alt={`My Work ${activeIndex}`} 
                    className="w-full h-full object-contain bg-zinc-900"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Progress Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-[110]">
                {data.profileImages!.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === activeIndex ? 'w-12 bg-indigo-500' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-md text-white/70 text-xs font-mono px-3 py-1.5 rounded-full border border-white/10">
                {String(activeIndex + 1).padStart(2, '0')} / {String(data.profileImages!.length).padStart(2, '0')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
