import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
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

// Migrate data from SQLite if it exists
try {
  if (fs.existsSync("portfolio.db")) {
    import("better-sqlite3").then(({ default: Database }) => {
      const db = new Database("portfolio.db");
      const row = db.prepare("SELECT data FROM portfolio_data WHERE id = 1").get() as any;
      if (row && row.data) {
        fs.writeFileSync(DATA_FILE, row.data);
        console.log("Migrated data from SQLite to JSON");
      }
      db.close();
      fs.renameSync("portfolio.db", "portfolio.db.bak");
    }).catch(err => console.error("Failed to migrate SQLite data:", err));
  }
} catch (e) {
  console.error("Migration error:", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

  app.post("/api/save-image", express.json({ limit: '10mb' }), (req, res) => {
    const { image, filename } = req.body;
    if (!image || !filename) return res.status(400).send('No image data or filename');
    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    try {
      fs.writeFileSync(`public/${filename}`, buffer);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to save image');
    }
  });

  app.get("/api/generate-images", async (req, res) => {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      console.log("API Key length:", process.env.GEMINI_API_KEY?.length);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const bgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: 'Abstract 3D artwork combining data analysis networks and creative flowing colorful shapes, dark background, high quality, 4k, subtle and elegant.',
      });
      for (const part of bgResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          fs.writeFileSync('public/profile_bg.png', Buffer.from(part.inlineData.data, 'base64'));
          break;
        }
      }

      const sigResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: 'A cinematic, high-quality still frame from a modern beauty brand film, soft pink and neon lighting, elegant and trendy, 4k.',
      });
      for (const part of sigResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          fs.writeFileSync('public/creation_sig.png', Buffer.from(part.inlineData.data, 'base64'));
          break;
        }
      }
      res.json({ success: true });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("index.html", { root: "dist" });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
