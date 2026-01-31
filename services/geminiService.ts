import { GoogleGenAI } from "@google/genai";
import { Deal, Client } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEmailDraft = async (
  clientName: string,
  companyName: string,
  context: string,
  tone: string
): Promise<string> => {
  try {
    const prompt = `
      You are an expert sales assistant.
      Draft a short, professional email to ${clientName} from ${companyName}.
      Context of the email: ${context}.
      Desired tone: ${tone}.
      Keep it concise (under 150 words) and actionable.
      Do not include subject lines or placeholders like [Your Name], just the body text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Failed to generate email content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't generate the email at this time. Please try again later.";
  }
};

/**
 * Analyzes the pipeline using Gemini 3.0 Pro with Thinking Mode enabled.
 */
export const analyzePipeline = async (deals: Deal[], clients: Client[]): Promise<string> => {
  try {
    // Enrich deal data with client names for the context
    const enrichedDeals = deals.map(d => {
      const client = clients.find(c => c.id === d.clientId);
      return {
        ...d,
        clientName: client?.name || 'Unknown',
        companyName: client?.company || 'Unknown',
      };
    });

    const prompt = `
      Act as a senior Sales Director analyzing this CRM pipeline.
      
      Data: ${JSON.stringify(enrichedDeals)}
      
      Please provide a strategic analysis including:
      1. Pipeline Health: Total value, weighted probability value, and overall velocity.
      2. Key Risks: Identify stalled deals (older than 14 days last activity) or high-value deals with low probability.
      3. Action Plan: 3 specific, high-impact actions the user should take today to move deals forward.
      
      Format the output in clean HTML (no markdown code blocks, just inner HTML tags like <h3>, <ul>, <li>, <p>, <strong>) so it can be rendered directly in a dashboard widget.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 } // Enable Thinking Mode for complex reasoning
      }
    });

    return response.text || "Unable to generate analysis.";
  } catch (error) {
    console.error("Gemini Pipeline Analysis Error:", error);
    return "<h3>Analysis Unavailable</h3><p>Could not analyze the pipeline at this moment. Please try again later.</p>";
  }
};

/**
 * Researches an entity (Company/Person) using Gemini 3.0 Pro with Thinking Mode and Grounding.
 */
export const researchEntity = async (query: string): Promise<{text: string, sources: Array<{title: string, uri: string}>}> => {
  try {
      const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `Find the latest news, recent business developments, and key facts about: ${query}. Summarize it for a sales context in 3 bullet points.`,
          config: {
              tools: [{googleSearch: {}}],
              thinkingConfig: { thinkingBudget: 32768 } // Thinking Mode for deep research synthesis
          }
      });
      
      // Extract grounding chunks if available
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      // Map chunks to a safe source format
      const sources = chunks
        .filter((c: any) => c.web && c.web.uri)
        .map((c: any) => ({
            title: c.web.title || 'Source Link',
            uri: c.web.uri
        }));

      return {
          text: response.text || "No information found.",
          sources: sources
      };
  } catch (error) {
      console.error("Gemini Research Error", error);
      return { text: "Search unavailable.", sources: [] };
  }
};