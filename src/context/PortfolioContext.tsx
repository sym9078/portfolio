import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  desc: string;
  year: string;
  image?: string;
  tags?: string[];
  links?: { url: string; type: string; label: string }[];
}

export interface SkillItem {
  name: string;
  icon: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

interface PortfolioData {
  projects: Project[];
  skills: SkillCategory[];
}

interface PortfolioContextType {
  data: PortfolioData;
  loading: boolean;
  updateData: (newData: PortfolioData, token: string) => Promise<boolean>;
}

const defaultData: PortfolioData = { projects: [], skills: [] };

const PortfolioContext = createContext<PortfolioContextType>({
  data: defaultData,
  loading: true,
  updateData: async () => false,
});

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(fetchedData => {
        if (fetchedData) {
          setData({
            projects: fetchedData.projects || [],
            skills: fetchedData.skills || []
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const updateData = async (newData: PortfolioData, token: string) => {
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, data: newData }),
      });
      const result = await res.json();
      if (result.success) {
        setData(newData);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider value={{ data, loading, updateData }}>
      {children}
    </PortfolioContext.Provider>
  );
};
