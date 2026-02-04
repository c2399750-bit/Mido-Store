
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `اكتب وصفاً تسويقياً جذاباً باللهجة العربية لمنتج اسمه "${productName}" في قسم "${category}". اجعل الوصف قصيراً ومركزاً على الفوائد.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || "عذراً، لم نتمكن من توليد الوصف حالياً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء محاولة توليد الوصف.";
  }
};

export const suggestSpecs = async (productName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `اعطني قائمة بـ 3 مواصفات فنية أساسية للمنتج "${productName}" باللغة العربية.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Suggest Error:", error);
    return [];
  }
};
