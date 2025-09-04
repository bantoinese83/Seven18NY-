

import { GoogleGenAI, Type } from "@google/genai";
import { BookingFormData, BookingQuote, EventInspiration, WeatherData } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("VITE_GEMINI_API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

export const generateBookingQuote = async (formData: BookingFormData): Promise<BookingQuote> => {
  if (!GEMINI_API_KEY) {
    throw new Error("AI service is currently unavailable. Please contact us directly for a quote.");
  }
  
  const isWeekend = formData.date ? [0, 6].includes(formData.date.getDay()) : false;
  
  const prompt = `
    You are an expert booking and quoting assistant for 'Seven18BK', a stylish event venue in Brooklyn. A customer is inquiring about renting the venue. Your task is to generate a detailed quote and a summary based on their selections.

    Customer's Data:
    - Name: ${formData.name}
    - Email: ${formData.email}
    - Phone: ${formData.phone}
    - Event Type: ${formData.eventType}
    - Number of Guests: ${formData.guests}
    - Preferred Date: ${formData.date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    - Preferred Time Slot: ${formData.timeSlot}
    - Selected Package: ${formData.selectedPackage?.name} (${formData.selectedPackage?.price})
    - Additional Details: ${formData.details || 'None'}

    Pricing Rules:
    1.  The price for the package is: "${formData.selectedPackage?.price}". Parse this to get the base cost. If it's per guest, multiply by the number of guests. If it's a flat fee, use that as the base.
    2.  Add a 20% "Weekend Surcharge" to the base cost if the selected date is a Saturday or Sunday. The provided date is a ${isWeekend ? 'weekend' : 'weekday'}.
    3.  The total estimate is the base cost plus any surcharges.
    4.  The quote notes should always mention that the final price may vary based on special requests and that taxes and gratuity are not yet included.

    Tasks:
    1.  **Generate a summary:** Write a friendly, personalized confirmation summary. Address the customer by name and confirm the key details of their inquiry (event type, date, guest count).
    2.  **Generate a quote object:** Calculate the costs based on the rules above and format it precisely into the 'quote' object. Show the surcharge only if it applies.
    3.  **Generate next steps:** Provide a clear, ordered list of 2-3 next steps. For example: "1. Review the quote.", "2. A team member will email you within 24 hours to confirm availability and answer questions.", "3. A deposit will be required to secure your date."

    Format the entire output as a single JSON object matching the provided schema. Do not include any markdown formatting like \`\`\`json. Respond with ONLY the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            quote: {
              type: Type.OBJECT,
              properties: {
                packageName: { type: Type.STRING },
                guestCount: { type: Type.INTEGER },
                baseCost: { type: Type.NUMBER },
                weekendSurcharge: { type: Type.NUMBER },
                totalEstimate: { type: Type.NUMBER },
                notes: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["packageName", "guestCount", "baseCost", "totalEstimate", "notes"]
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "quote", "nextSteps"]
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    return parsedResponse as BookingQuote;

  } catch (error) {
    console.error("Error generating booking quote with Gemini:", error);
    throw new Error("We had trouble generating your quote. Please check your details or try again later.");
  }
};


export const generateEventInspiration = async (eventType: string, details: string): Promise<EventInspiration> => {
  if (!GEMINI_API_KEY) {
    throw new Error("AI service is currently unavailable. Please contact us directly for event inspiration.");
  }
  
  const prompt = `
    You are 'Aura', a creative event stylist for the 'Seven18BK' venue. A customer is planning an event and needs inspiration. Based on their event type and details, generate a creative "Inspiration Plan".

    Event Details:
    - Event Type: "${eventType}"
    - Additional Details from user: "${details || 'None'}"

    Your Task:
    Generate a concise and stylish Inspiration Plan. The tone should be inspiring and chic.
    - **themeName**: A catchy theme name that reflects the event type and vibe.
    - **planningTip**: A crucial, concise planning tip for this type of event. This should be a single, impactful sentence.
    - **colorPalette**: An array of exactly 4 hex color codes that match the vibe.
    - **decorIdeas**: An array of 3-4 brief, evocative decor ideas.
    - **musicSuggestions**: An array of 2-3 music genres or artist suggestions.
    - **signatureCocktail**: An enticing cocktail object that fits the event theme.

    Format the entire output as a single JSON object matching the provided schema. Do not include any markdown. Respond with ONLY the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeName: { type: Type.STRING, description: "A catchy, creative name for the event theme." },
            planningTip: { type: Type.STRING, description: "A concise planning tip related to the weather." },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 4 hex color codes that match the vibe." },
            decorIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 3-4 brief, inspiring decor ideas." },
            musicSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 2-3 music genres or artist suggestions." },
            signatureCocktail: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["name", "description"]
            }
          },
          required: ["themeName", "planningTip", "colorPalette", "decorIdeas", "musicSuggestions", "signatureCocktail"]
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as EventInspiration;

  } catch (error) {
    console.error("Error generating inspiration with Gemini:", error);
    throw new Error("We had trouble generating inspiration. Please try again.");
  }
}