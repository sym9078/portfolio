import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../lib/supabase';

export default function ImageGenerator() {
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (prompt: string, filename: string) => {
    try {
      setStatus(`Generating ${filename}...`);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });

      let base64Image = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }

      if (!base64Image) {
        throw new Error('No image generated');
      }

      setStatus(`Saving ${filename} to Supabase...`);
      
      // Convert base64 to Blob
      const byteCharacters = atob(base64Image);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filename, blob, {
          upsert: true,
          contentType: 'image/png'
        });

      if (uploadError) {
        throw uploadError;
      }

      setStatus(`Success! Image saved to Supabase Storage as ${filename}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred');
      setStatus('Failed');
    }
  };

  return (
    <div className="pt-32 px-10 text-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">AI Image Generator</h1>
      <p className="mb-6 text-lg">Status: <span className="font-bold text-indigo-400">{status}</span></p>
      {error && <p className="text-red-500 mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">Error: {error}</p>}
      
      <div className="space-y-6">
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h2 className="text-xl font-bold mb-2">1. Profile Image</h2>
          <p className="text-zinc-400 text-sm mb-4">Generates the main profile image for the Hero section.</p>
          <button 
            onClick={() => generateImage('A high-quality professional studio portrait of a confident Korean male marketer in his late 20s, wearing a modern dark suit, clean-cut, professional lighting, pure white background (transparent style), no watermark, high resolution, 4k, subject is large and centered.', 'profile.png')}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg transition-colors w-full md:w-auto"
          >
            Generate profile.png
          </button>
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h2 className="text-xl font-bold mb-2">2. Profile Background Art</h2>
          <p className="text-zinc-400 text-sm mb-4">Generates the abstract 3D artwork for the Profile section background.</p>
          <button 
            onClick={() => generateImage('Abstract 3D artwork combining data analysis networks and creative flowing colorful shapes, dark background, high quality, 4k, subtle and elegant.', 'profile_bg.png')}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg transition-colors w-full md:w-auto"
          >
            Generate profile_bg.png
          </button>
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h2 className="text-xl font-bold mb-2">3. AI Signature (Creation)</h2>
          <p className="text-zinc-400 text-sm mb-4">Generates a cinematic still frame for the "Creation" floating card.</p>
          <button 
            onClick={() => generateImage('A cinematic, high-quality still frame from a modern beauty brand film, soft pink and neon lighting, elegant and trendy, 4k.', 'creation_sig.png')}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg transition-colors w-full md:w-auto"
          >
            Generate creation_sig.png
          </button>
        </div>
      </div>
    </div>
  );
}
