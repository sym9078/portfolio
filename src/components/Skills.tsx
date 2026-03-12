import React from 'react';
import { motion } from 'motion/react';
import { 
  Bot, Video, Image as ImageIcon, Cpu, 
  BarChart3, TrendingUp, Split, 
  Radar, BookOpen, PenTool, Lightbulb,
  Code, Database, Terminal, Layout, Smartphone, Globe, Layers, Zap, Star
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const iconMap: Record<string, React.ReactNode> = {
  Bot: <Bot size={22} />,
  Video: <Video size={22} />,
  ImageIcon: <ImageIcon size={22} />,
  Cpu: <Cpu size={22} />,
  BarChart3: <BarChart3 size={22} />,
  TrendingUp: <TrendingUp size={22} />,
  Split: <Split size={22} />,
  Radar: <Radar size={22} />,
  BookOpen: <BookOpen size={22} />,
  PenTool: <PenTool size={22} />,
  Lightbulb: <Lightbulb size={22} />,
  Code: <Code size={22} />,
  Database: <Database size={22} />,
  Terminal: <Terminal size={22} />,
  Layout: <Layout size={22} />,
  Smartphone: <Smartphone size={22} />,
  Globe: <Globe size={22} />,
  Layers: <Layers size={22} />,
  Zap: <Zap size={22} />,
  Star: <Star size={22} />
};

export default function Skills() {
  const { data, loading } = usePortfolio();
  
  if (loading) {
    return <div className="py-24 px-6 md:px-12 bg-zinc-950 min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const skills = data.skills || [];

  return (
    <section className="py-24 px-6 md:px-12 bg-zinc-950">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
            CAPABILITIES
          </h2>
          <div className="h-px w-full bg-zinc-900" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {skills.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-900 pb-2">
                {group.category}
              </h3>
              <ul className="space-y-5">
                {group.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xl md:text-2xl text-zinc-300 font-light hover:text-white transition-colors cursor-default group">
                    {/* IconContainer: 나중에 고해상도 SVG나 이미지로 교체하기 쉽도록 래퍼 요소 사용 */}
                    <span className="icon-container flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      {iconMap[item.icon] || <Star size={22} />}
                    </span>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
