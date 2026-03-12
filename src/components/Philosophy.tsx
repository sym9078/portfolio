import { motion } from 'motion/react';
import { Zap, Target, LineChart } from 'lucide-react';

export default function Philosophy() {
  const philosophies = [
    {
      title: "Automation First",
      icon: <Zap className="w-6 h-6 text-indigo-400" />,
      desc: "단순 반복 작업은 파이썬과 자동화 스크립트에 맡기고, 마케터로서 'Why'와 'How'에 집중합니다."
    },
    {
      title: "Relentless Refinement",
      icon: <Target className="w-6 h-6 text-indigo-400" />,
      desc: "원하는 결과물이 나올 때까지 집요하게 AI 프롬프트를 수정하고 깎아내는 집념이 있습니다."
    },
    {
      title: "Data-Led Intuition",
      icon: <LineChart className="w-6 h-6 text-indigo-400" />,
      desc: "직관에만 의존하지 않고, 데이터 분석을 통해 가설을 검증하며 성과를 최적화합니다."
    }
  ];

  return (
    <section className="relative py-32 px-6 md:px-12 bg-zinc-950 overflow-hidden">
      {/* Subtle Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-screen-xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-sm font-mono text-zinc-500 tracking-widest uppercase mb-4">
            Core Value
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            WORK PHILOSOPHY
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {philosophies.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 hover:-translate-y-2 hover:bg-zinc-900/80 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-indigo-500/30 transition-all duration-300">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
              <p className="text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
