import { motion } from 'motion/react';
import { Bot, Sparkles, LineChart, Terminal, Video, Image as ImageIcon } from 'lucide-react';

export default function Profile() {
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

                  {/* AI Signature Floating Card */}
                  {item.signature && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, rotate: -2 }}
                      whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                      whileHover={{ rotate: 0, scale: 1.02 }}
                      transition={{ duration: 0.4 }}
                      className="relative w-48 p-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 ml-auto -mt-4 z-20"
                    >
                      <img 
                        src="/creation_sig.png" 
                        alt="Etude Brand Film Scene" 
                        className="w-full h-auto rounded-lg"
                        onError={(e) => {
                          // Fallback if image not generated yet
                          (e.target as HTMLImageElement).src = "https://picsum.photos/seed/beauty-film/400/300";
                        }}
                      />
                      <div className="absolute -bottom-3 -right-3 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        My Work
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
