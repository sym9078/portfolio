import { motion } from 'motion/react';
import { ExternalLink, FileText, PlayCircle, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Projects() {
  const { data, loading } = usePortfolio();

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;
  }

  const projects = data.projects || [];

  if (!loading && projects.length === 0) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">No projects found.</div>;
  }

  const getLinkIcon = (link?: string, type?: string, className: string = "w-4 h-4") => {
    if (!link) return null;
    const lowerLink = link.toLowerCase();
    const isPdf = type === 'pdf' || lowerLink.endsWith('.pdf') || lowerLink.includes('drive.google.com/file/d/') && lowerLink.includes('view');
    const isVideo = type === 'video' || lowerLink.includes('youtube.com') || lowerLink.includes('youtu.be') || lowerLink.includes('vimeo.com');

    if (isPdf) return <FileText className={className} />;
    if (isVideo) return <PlayCircle className={className} />;
    return <ExternalLink className={className} />;
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-zinc-950 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex items-end justify-between border-b border-zinc-900 pb-6"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
            SELECTED <br /> WORKS
          </h2>
          <span className="hidden md:block text-zinc-500 font-mono text-sm">
            ( {projects.length} )
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all duration-500 flex flex-col"
            >
              {/* Image Thumbnail */}
              <div className="relative h-64 overflow-hidden bg-zinc-800">
                <img 
                  src={project.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                
                {/* Top Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium text-white">
                    {project.year}
                  </span>
                </div>
                
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-indigo-400 text-sm">/{project.id}</span>
                  <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">{project.subtitle}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-zinc-400 leading-relaxed mb-6 flex-grow text-sm">
                  {project.desc}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-zinc-800/50 text-zinc-300 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {(() => {
                  const links = project.links || [];
                  if ((project as any).link && links.length === 0) {
                    links.push({ url: (project as any).link, type: (project as any).linkType, label: 'View Project' });
                  }
                  if (links.length === 0) return null;
                  
                  return (
                    <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-zinc-800/50">
                      {links.map((link: any, idx: number) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-indigo-400 transition-colors group/link"
                        >
                          {getLinkIcon(link.url, link.type)}
                          {link.label || 'View Link'}
                        </a>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
