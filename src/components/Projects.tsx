import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, FileText, PlayCircle, ArrowUpRight, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Projects() {
  const { data, loading } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<any>(null);

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
              onClick={() => setSelectedProject(project)}
              className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all duration-500 flex flex-col cursor-pointer"
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
                
                <p className="text-zinc-400 leading-relaxed mb-6 flex-grow text-sm line-clamp-3">
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

                {/* Links Indicator */}
                {project.links && project.links.length > 0 && (
                  <div className="flex gap-3 mt-auto pt-4 border-t border-zinc-800/50 text-zinc-500 text-sm">
                    {project.links.length} attached file(s)
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-6xl max-h-full overflow-y-auto relative flex flex-col md:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)} 
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-50"
              >
                <X size={20} />
              </button>
              
              {/* Left: Media Area */}
              <div className="flex-1 p-6 md:p-10 bg-zinc-900/30 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                {selectedProject.links && selectedProject.links.length > 0 ? (
                  selectedProject.links.map((link: any, idx: number) => {
                    const lowerLink = link.url.toLowerCase();
                    const isVideo = link.type === 'video' || lowerLink.includes('youtube.com') || lowerLink.includes('youtu.be');
                    const isPdf = link.type === 'pdf' || lowerLink.endsWith('.pdf') || lowerLink.includes('drive.google.com/file/d/');
                    
                    if (isVideo) {
                      const ytMatch = link.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                      const videoId = ytMatch ? ytMatch[1] : null;
                      
                      if (videoId) {
                        return (
                          <div key={idx} className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-lg">
                            <iframe 
                              src={`https://www.youtube.com/embed/${videoId}`} 
                              className="w-full h-full"
                              allowFullScreen
                            />
                          </div>
                        );
                      } else {
                        return (
                          <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="block relative group rounded-2xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-900 shadow-lg">
                            <img src={selectedProject.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <PlayCircle size={64} className="text-white mb-4 group-hover:scale-110 transition-transform drop-shadow-lg" />
                              <span className="text-white font-bold tracking-wider bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">{link.label || 'Watch Video'}</span>
                            </div>
                          </a>
                        );
                      }
                    }
                    
                    // For PDF or External, show the project image as a cover
                    return (
                      <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="block relative group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-lg">
                        <img src={selectedProject.image} className="w-full h-auto object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                          {isPdf ? <FileText size={48} className="text-white mb-4 drop-shadow-lg" /> : <ExternalLink size={48} className="text-white mb-4 drop-shadow-lg" />}
                          <span className="text-white font-bold tracking-wider bg-black/50 px-4 py-2 rounded-full">{link.label || (isPdf ? 'Open PDF' : 'Visit Link')}</span>
                        </div>
                      </a>
                    );
                  })
                ) : (
                  <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-lg">
                    <img src={selectedProject.image} className="w-full h-auto object-cover" />
                  </div>
                )}
              </div>
              
              {/* Right: Info Area */}
              <div className="w-full md:w-[400px] lg:w-[450px] p-6 md:p-10 border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col bg-zinc-950">
                <div className="font-mono text-indigo-400 text-sm mb-3">/{selectedProject.id}</div>
                <h3 className="text-3xl font-bold text-white mb-3">{selectedProject.title}</h3>
                <div className="text-zinc-500 text-sm uppercase tracking-wider font-semibold mb-8">{selectedProject.subtitle}</div>
                
                <div className="prose prose-invert prose-zinc max-w-none mb-8">
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{selectedProject.desc}</p>
                </div>
                
                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div className="mb-8">
                    <div className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProject.links && selectedProject.links.length > 0 && (
                  <div className="mt-auto pt-8 border-t border-zinc-800/50">
                    <div className="text-xs text-zinc-600 uppercase tracking-widest mb-4">Attachments</div>
                    <div className="flex flex-col gap-3">
                      {selectedProject.links.map((link: any, idx: number) => (
                        <a 
                          key={idx} 
                          href={link.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 transition-colors text-zinc-300 hover:text-white group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                            {getLinkIcon(link.url, link.type, "w-5 h-5")}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{link.label || 'View Link'}</span>
                            <span className="text-xs text-zinc-500 truncate max-w-[200px]">{link.url}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
