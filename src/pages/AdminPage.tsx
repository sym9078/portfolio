import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function AdminPage() {
  const { data: contextData, updateData } = usePortfolio();
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const profileImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'admin-token-123') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0) {
      // Deep copy to avoid mutating context directly
      setData(JSON.parse(JSON.stringify(contextData)));
    }
  }, [contextData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const json = await res.json();
    if (json.success) {
      localStorage.setItem('adminToken', json.token);
      setIsLoggedIn(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const success = await updateData(data, token || '');
    if (success) {
      alert('저장되었습니다.');
    } else {
      alert('저장 실패');
    }
    setLoading(false);
  };

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    if (!file) return;
    setUploadingImage(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      const filename = `upload_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      try {
        const res = await fetch('/api/save-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image, filename })
        });
        
        const result = await res.json();
        if (result.success) {
          callback(result.url);
        } else {
          alert('이미지 업로드 실패');
        }
      } catch (err) {
        console.error(err);
        alert('이미지 업로드 중 오류 발생');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newData = { ...data };
    if (field === 'tags') {
      newData.projects[index][field] = value.split(',').map(t => t.trim()).filter(Boolean);
    } else {
      newData.projects[index][field] = value;
    }
    setData(newData);
  };

  const addLink = (projectIndex: number) => {
    const newData = { ...data };
    if (!newData.projects[projectIndex].links) {
      newData.projects[projectIndex].links = [];
    }
    newData.projects[projectIndex].links.push({ url: '', type: 'auto', label: '' });
    setData(newData);
  };

  const removeLink = (projectIndex: number, linkIndex: number) => {
    const newData = { ...data };
    newData.projects[projectIndex].links.splice(linkIndex, 1);
    setData(newData);
  };

  const handleLinkChange = (projectIndex: number, linkIndex: number, field: string, value: string) => {
    const newData = { ...data };
    newData.projects[projectIndex].links[linkIndex][field] = value;
    setData(newData);
  };

  const addProject = () => {
    const newData = { ...data };
    newData.projects.push({
      id: String(newData.projects.length + 1).padStart(2, '0'),
      title: 'New Project',
      subtitle: '',
      role: '',
      desc: '',
      year: new Date().getFullYear().toString(),
      image: '',
      tags: [],
      links: []
    });
    setData(newData);
  };

  const removeProject = (index: number) => {
    const newData = { ...data };
    newData.projects.splice(index, 1);
    setData(newData);
  };

  const handleSkillChange = (catIndex: number, itemIndex: number, field: string, value: string) => {
    const newData = { ...data };
    newData.skills[catIndex].items[itemIndex][field] = value;
    setData(newData);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 pt-20">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요 (기본: 9078)"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="w-full bg-white text-zinc-950 font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors">
            로그인
          </button>
        </form>
      </div>
    );
  }

  if (!data) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white pt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6 sticky top-20 bg-zinc-950 z-10 pt-4">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              로그아웃
            </button>
            <button 
              onClick={handleSave}
              disabled={loading || uploadingImage}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm shadow-lg shadow-indigo-500/20"
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>

        <div className="space-y-16">
          {/* Profile Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Profile (MY WORK)</h2>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <label className="block text-zinc-500 text-xs mb-2">My Work Image</label>
              <div className="flex items-center gap-4">
                {data.profileImage && (
                  <img src={data.profileImage} alt="Profile" className="w-24 h-24 object-cover rounded-lg border border-zinc-800" />
                )}
                <div className="flex-1">
                  <input 
                    value={data.profileImage || ''} 
                    onChange={(e) => setData({ ...data, profileImage: e.target.value })} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white mb-2" 
                    placeholder="Image URL or upload file" 
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={profileImageInputRef}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0], (url) => {
                          setData({ ...data, profileImage: url });
                        });
                      }
                    }}
                  />
                  <button 
                    onClick={() => profileImageInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2 bg-zinc-800 text-white rounded text-sm hover:bg-zinc-700 disabled:opacity-50"
                  >
                    {uploadingImage ? '업로드 중...' : '이미지 첨부하기'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Projects (WORK)</h2>
              <button onClick={addProject} className="text-indigo-400 hover:text-indigo-300 text-sm font-bold">+ 프로젝트 추가</button>
            </div>
            
            <div className="space-y-6">
              {data.projects.map((project: any, index: number) => (
                <div key={index} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative">
                  <button 
                    onClick={() => removeProject(index)}
                    className="absolute top-6 right-6 text-red-400 hover:text-red-300 text-sm"
                  >
                    삭제
                  </button>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-zinc-500 text-xs mb-1">ID (ex: 01)</label>
                      <input value={project.id} onChange={(e) => handleProjectChange(index, 'id', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-xs mb-1">Year</label>
                      <input value={project.year} onChange={(e) => handleProjectChange(index, 'year', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-zinc-500 text-xs mb-1">Title</label>
                      <input value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-xs mb-1">Subtitle</label>
                      <input value={project.subtitle} onChange={(e) => handleProjectChange(index, 'subtitle', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-xs mb-1">Tags (comma separated)</label>
                      <input value={(project.tags || []).join(', ')} onChange={(e) => handleProjectChange(index, 'tags', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" placeholder="AI Video, Data Analysis" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-zinc-500 text-xs mb-1">Image URL</label>
                      <div className="flex gap-2">
                        <input value={project.image || ''} onChange={(e) => handleProjectChange(index, 'image', e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" placeholder="https://..." />
                        <input 
                          type="file" 
                          accept="image/*" 
                          id={`project-image-${index}`}
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(e.target.files[0], (url) => {
                                handleProjectChange(index, 'image', url);
                              });
                            }
                          }}
                        />
                        <button 
                          onClick={() => document.getElementById(`project-image-${index}`)?.click()}
                          disabled={uploadingImage}
                          className="px-4 py-2 bg-zinc-800 text-white rounded text-sm hover:bg-zinc-700 disabled:opacity-50 whitespace-nowrap"
                        >
                          이미지 첨부
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-zinc-500 text-xs mb-1">Description</label>
                      <textarea value={project.desc} onChange={(e) => handleProjectChange(index, 'desc', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white h-24" />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-zinc-500 text-xs">Attachments / Links</label>
                        <button onClick={() => addLink(index)} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add Link</button>
                      </div>

                      {(project.links || []).map((link: any, lIndex: number) => (
                        <div key={lIndex} className="flex gap-2 mb-2 items-center">
                          <input 
                            value={link.label || ''} 
                            onChange={(e) => handleLinkChange(index, lIndex, 'label', e.target.value)} 
                            className="w-1/4 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm" 
                            placeholder="Label (e.g. PDF)" 
                          />
                          <select 
                            value={link.type || 'auto'} 
                            onChange={(e) => handleLinkChange(index, lIndex, 'type', e.target.value)} 
                            className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm w-24"
                          >
                            <option value="auto">Auto</option>
                            <option value="pdf">PDF</option>
                            <option value="video">Video</option>
                            <option value="external">Link</option>
                          </select>
                          <input 
                            value={link.url || ''} 
                            onChange={(e) => handleLinkChange(index, lIndex, 'url', e.target.value)} 
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm" 
                            placeholder="https://..." 
                          />
                          <button onClick={() => removeLink(index, lIndex)} className="text-red-400 hover:text-red-300 text-xs px-2">X</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Skills (CAPABILITIES)</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {(data.skills || []).map((category: any, catIndex: number) => (
                <div key={catIndex} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="flex flex-col gap-1">
                        <input 
                          value={item.name} 
                          onChange={(e) => handleSkillChange(catIndex, itemIndex, 'name', e.target.value)} 
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm" 
                          placeholder="Skill Name"
                        />
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-zinc-500 w-12">Icon:</span>
                          <input 
                            value={item.icon} 
                            onChange={(e) => handleSkillChange(catIndex, itemIndex, 'icon', e.target.value)} 
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm" 
                            placeholder="Lucide Icon Name"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
