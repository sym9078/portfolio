import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import fs from "fs";

const db = new Database("portfolio.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS portfolio_data (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL
  )
`);

const defaultData = {
  projects: [
    {
      id: "01",
      title: "Etude Brand Film",
      subtitle: "Content x AI",
      role: "Content Marketer",
      desc: "뷰티 타겟 트렌드 분석 및 AI 툴 활용 브랜드 필름 제작",
      year: "2025"
    },
    {
      id: "02",
      title: "Megabox MSG Launch",
      subtitle: "Performance x Data",
      role: "Performance Marketer",
      desc: "서브컬처 특화관 기획 및 입지 선정 데이터 분석",
      year: "2024"
    },
    {
      id: "03",
      title: "Steam Data Strategy",
      subtitle: "Data x Automation",
      role: "Data Analyst",
      desc: "글로벌 게임 플랫폼 데이터 분석 및 마케팅 인사이트 도출",
      year: "2024"
    }
  ]
};

// Insert default data if empty
const row = db.prepare("SELECT * FROM portfolio_data WHERE id = 1").get();
if (!row) {
  db.prepare("INSERT INTO portfolio_data (id, data) VALUES (1, ?)").run(JSON.stringify(defaultData));
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
    const row = db.prepare("SELECT data FROM portfolio_data WHERE id = 1").get() as any;
    res.json(JSON.parse(row.data));
  });

  app.post("/api/data", (req, res) => {
    const { token, data } = req.body;
    if (token !== "admin-token-123") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    db.prepare("UPDATE portfolio_data SET data = ? WHERE id = 1").run(JSON.stringify(data));
    res.json({ success: true });
  });

  app.post("/api/save-profile-image", express.json({ limit: '10mb' }), (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).send('No image data');
    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    try {
      fs.writeFileSync('src/components/profile.png', buffer);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to save image');
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
