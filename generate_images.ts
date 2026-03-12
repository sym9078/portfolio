import { GoogleGenAI } from "@google/genai";
import fs from "fs";

async function generate() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    console.log("Generating background...");
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

    console.log("Generating signature...");
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
    console.log("Done!");
  } catch (e) {
    console.error(e);
  }
}
generate();
