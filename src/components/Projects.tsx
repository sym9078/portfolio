import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ExternalLink, FileText, PlayCircle } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data && data.projects) {
          setProjects(data.projects);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!loading && projects.length === 0) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">No projects found.</div>;
  }

  const getLinkIcon = (link?: string, type?: string, className: string = "w-6 h-6 text-zinc-500 group-hover:text-indigo-400 transition-colors") => {
    if (!link) return null;
    const lowerLink = link.toLowerCase();
    const isPdf = type === 'pdf' || lowerLink.endsWith('.pdf') || lowerLink.includes('drive.google.com/file/d/') && lowerLink.includes('view');
    const isVideo = type === 'video' || lowerLink.includes('youtube.com') || lowerLink.includes('youtu.be') || lowerLink.includes('vimeo.com');

    if (isPdf) {
      return <FileText className={className} />;
    }
    if (isVideo) {
      return <PlayCircle className={className} />;
    }
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

        <div className="flex flex-col">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative border-b border-zinc-900 py-12 md:py-16 transition-colors hover:bg-zinc-900/30"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
                <div className="flex items-baseline gap-6 md:w-1/3">
                  <span className="font-mono text-zinc-600 text-sm">/{project.id}</span>
                  <h3 className="text-2xl md:text-4xl font-bold text-white group-hover:text-zinc-300 transition-colors">
                    {project.title}
                  </h3>
                </div>
                
                <div className="md:w-1/3">
                  <span className="block text-zinc-500 text-sm uppercase tracking-wider mb-2">{project.subtitle}</span>
                  <p className="text-zinc-400 leading-relaxed">
                    {project.desc}
                  </p>
                  {/* Links */}
                  {(() => {
                    const links = project.links || [];
                    // Backward compatibility for old single link
                    if (project.link && links.length === 0) {
                      links.push({ url: project.link, type: project.linkType, label: 'Link' });
                    }
                    if (links.length === 0) return null;
                    
                    return (
                      <div className="flex flex-wrap gap-3 mt-6">
                        {links.map((link: any, idx: number) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-xs font-medium text-zinc-300 hover:text-indigo-400 transition-colors group/link"
                          >
                            {getLinkIcon(link.url, link.type, "w-4 h-4 text-zinc-400 group-hover/link:text-indigo-400 transition-colors")}
                            {link.label || 'View Link'}
                          </a>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div className="md:w-1/6 text-right">
                  <span className="font-mono text-zinc-600 text-sm">{project.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
