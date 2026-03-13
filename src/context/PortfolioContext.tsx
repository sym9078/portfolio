import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  profileImages?: string[];
}

interface PortfolioContextType {
  data: PortfolioData;
  loading: boolean;
  updateData: (newData: PortfolioData) => Promise<boolean>;
}

const defaultData: PortfolioData = { 
  projects: [], 
  skills: [
    {
      category: "AI & Automation",
      items: [
        { name: "ChatGPT / Claude", icon: "Bot" },
        { name: "Midjourney / Stable Diffusion", icon: "ImageIcon" },
        { name: "Kling / Flow", icon: "Video" },
        { name: "Zapier / Make", icon: "Zap" }
      ]
    },
    {
      category: "Performance & Data",
      items: [
        { name: "Google Analytics 4", icon: "BarChart3" },
        { name: "Python (Pandas, Selenium)", icon: "Terminal" },
        { name: "SQL (BigQuery, MySQL)", icon: "Database" },
        { name: "Excel / Spreadsheets", icon: "Layout" }
      ]
    },
    {
      category: "Content & Planning",
      items: [
        { name: "Notion / Slack", icon: "Layers" },
        { name: "Figma", icon: "PenTool" },
        { name: "Premiere Pro / After Effects", icon: "Video" },
        { name: "Copywriting", icon: "BookOpen" }
      ]
    }
  ], 
  profileImages: ['/creation_sig.png'] 
};

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
    const fetchData = async () => {
      try {
        const { data: supabaseData, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('id', 1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows found, use default data
            console.log('No data found in Supabase, using default data.');
          } else {
            throw error;
          }
        }

        if (supabaseData) {
          // Handle legacy profile_image (string) or new profile_images (array)
          let imgs = supabaseData.profile_images || [];
          if (imgs.length === 0 && supabaseData.profile_image) {
            imgs = [supabaseData.profile_image];
          }
          if (imgs.length === 0) imgs = defaultData.profileImages || [];

          setData({
            projects: supabaseData.projects || [],
            skills: supabaseData.skills && supabaseData.skills.length > 0 ? supabaseData.skills : defaultData.skills,
            profileImages: imgs
          });
        }
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateData = async (newData: PortfolioData) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          id: 1,
          projects: newData.projects,
          skills: newData.skills,
          profile_images: newData.profileImages,
          profile_image: newData.profileImages?.[0] || '' // Sync first image to legacy field
        });

      if (error) throw error;

      setData(newData);
      return true;
    } catch (err) {
      console.error('Error updating data in Supabase:', err);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider value={{ data, loading, updateData }}>
      {children}
    </PortfolioContext.Provider>
  );
};
