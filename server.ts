import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";

const DATA_FILE = "portfolio_data.json";

const defaultData = {
  projects: [
    {
      id: "01",
      title: "Etude Brand Film",
      subtitle: "Content x AI",
      role: "Content Marketer",
      desc: "뷰티 타겟 트렌드 분석 및 AI 툴 활용 브랜드 필름 제작",
      year: "2025",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
      tags: ["AI Video", "Brand Strategy"]
    },
    {
      id: "02",
      title: "Megabox MSG Launch",
      subtitle: "Performance x Data",
      role: "Performance Marketer",
      desc: "서브컬처 특화관 기획 및 입지 선정 데이터 분석",
      year: "2024",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      tags: ["Data Analysis", "Performance"]
    },
    {
      id: "03",
      title: "Steam Data Strategy",
      subtitle: "Data x Automation",
      role: "Data Analyst",
      desc: "글로벌 게임 플랫폼 데이터 분석 및 마케팅 인사이트 도출",
      year: "2024",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
      tags: ["Python", "Automation"]
    }
  ],
  skills: [
    {
      category: "AI & Automation",
      items: [
        { name: "Prompt Engineering", icon: "Bot" },
        { name: "AI Video (Kling/Flow)", icon: "Video" },
        { name: "AI Image (Nano banana)", icon: "ImageIcon" },
        { name: "Python Automation", icon: "Cpu" }
      ]
    },
    {
      category: "Performance & Data",
      items: [
        { name: "Data Analysis (Pandas)", icon: "BarChart3" },
        { name: "GA4 & Meta Ads", icon: "TrendingUp" },
        { name: "A/B Testing", icon: "Split" }
      ]
    },
    {
      category: "Content & Planning",
      items: [
        { name: "Trend Catching", icon: "Radar" },
        { name: "Brand Storytelling", icon: "BookOpen" },
        { name: "Copywriting", icon: "PenTool" },
        { name: "Creative Directing", icon: "Lightbulb" }
      ]
    }
  ]
};

// Initialize JSON DB
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    if (password === "9078") {
      res.json({ success: true, token: "admin-token-123" });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  app.get("/api/data", (req, res) => {
    try {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (err) {
      res.json(defaultData);
    }
  });

  app.post("/api/data", (req, res) => {
    const { token, data } = req.body;
    if (token !== "admin-token-123") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  });

  app.post("/api/save-image", (req, res) => {
    const { image, filename } = req.body;
    if (!image || !filename) return res.status(400).send('No image data or filename');
    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    try {
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicDir, filename), buffer);
      
      // Also write to dist/ if in production so it's served immediately
      if (process.env.NODE_ENV === "production") {
        const distDir = path.join(process.cwd(), 'dist');
        if (fs.existsSync(distDir)) {
          fs.writeFileSync(path.join(distDir, filename), buffer);
        }
      }
      
      res.json({ success: true, url: `/${filename}` });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to save image');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
