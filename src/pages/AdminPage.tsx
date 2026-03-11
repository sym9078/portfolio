import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'admin-token-123') {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setData({ projects: [] }); // Fallback to empty data
    }
  };

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
      fetchData();
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, data })
    });
    if (res.ok) {
      alert('저장되었습니다.');
    } else {
      alert('저장 실패');
    }
    setLoading(false);
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newData = { ...data };
    newData.projects[index][field] = value;
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
      link: '',
      links: []
    });
    setData(newData);
  };

  const removeProject = (index: number) => {
    const newData = { ...data };
    newData.projects.splice(index, 1);
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
            placeholder="비밀번호를 입력하세요"
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
        <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
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
              disabled={loading}
              className="px-6 py-2 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Projects (WORK)</h2>
            <button onClick={addProject} className="text-indigo-400 hover:text-indigo-300 text-sm font-bold">+ 프로젝트 추가</button>
          </div>
          
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
                  <label className="block text-zinc-500 text-xs mb-1">Role</label>
                  <input value={project.role} onChange={(e) => handleProjectChange(index, 'role', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" />
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
                  
                  {/* Backward compatibility for old single link */}
                  {project.link && (!project.links || project.links.length === 0) && (
                    <div className="flex gap-2 mb-2 items-center">
                      <span className="text-xs text-zinc-500 w-1/4">Legacy Link:</span>
                      <select 
                        value={project.linkType || 'auto'} 
                        onChange={(e) => handleProjectChange(index, 'linkType', e.target.value)} 
                        className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm w-24"
                      >
                        <option value="auto">Auto</option>
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                        <option value="external">Link</option>
                      </select>
                      <input 
                        value={project.link || ''} 
                        onChange={(e) => handleProjectChange(index, 'link', e.target.value)} 
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white text-sm" 
                        placeholder="https://..." 
                      />
                      <button onClick={() => {
                        const newData = { ...data };
                        newData.projects[index].links = [{ url: project.link, type: project.linkType || 'auto', label: 'Link' }];
                        newData.projects[index].link = '';
                        newData.projects[index].linkType = '';
                        setData(newData);
                      }} className="px-3 py-2 bg-zinc-800 text-white rounded text-xs hover:bg-zinc-700">Migrate</button>
                    </div>
                  )}

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
      </div>
    </div>
  );
}
