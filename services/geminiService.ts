import { GoogleGenAI } from "@google/genai";
import { Deal, Client, Task, Activity } from "../types";

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
      model: 'gemini-3-flash-preview', // Flash for fast, simple text generation
      contents: prompt,
    });

    return response.text || "Failed to generate email content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't generate the email at this time. Please try again later.";
  }
};

/**
 * Generates a daily briefing using Gemini 3.0 Pro with Thinking Mode.
 */
export const generateDailyBriefing = async (deals: Deal[], tasks: Task[], activities: Activity[]): Promise<string> => {
  try {
    const prompt = `
      Act as an Executive Sales Assistant providing a daily morning briefing.
      
      Deals: ${JSON.stringify(deals)}
      Tasks: ${JSON.stringify(tasks)}
      Recent Activities: ${JSON.stringify(activities)}
      
      Create a concise, high-impact daily briefing.
      1. Highlight the top 3 priorities for today based on deadlines and deal value.
      2. Summarize recent key activity (last 24 hours).
      3. Provide a motivational "Thought for the Day" related to sales.
      
      Format as HTML with <h3>, <ul>, <li>, <p>, <strong>.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 } // Enable Thinking Mode
      }
    });

    return response.text || "<h3>Briefing Unavailable</h3><p>Could not generate the daily briefing.</p>";
  } catch (error) {
    console.error("Gemini Daily Briefing Error:", error);
    return "<h3>Briefing Unavailable</h3><p>Could not generate the daily briefing at this moment.</p>";
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

/**
 * Generates a strategic account plan using Gemini 3.0 Pro with Thinking Mode.
 */
export const generateAccountStrategy = async (clientName: string, recentHistory: string): Promise<string> => {
    try {
        const prompt = `
          Act as a Strategic Account Manager.
          Client: ${clientName}
          Recent History: ${recentHistory}
          
          Develop a brief strategic growth plan.
          1. Identify 2 potential upsell or expansion opportunities based on typical agency services.
          2. Suggest a specific "value-add" idea we can pitch to them next week.
          3. Identify one potential risk in the relationship.
          
          Format as HTML with <h4> for section headers and <ul> for lists. Keep it professional and punchy.
        `;
    
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingBudget: 32768 } // High budget for strategic reasoning
          }
        });
    
        return response.text || "Unable to generate strategy.";
      } catch (error) {
        console.error("Gemini Strategy Error:", error);
        return "<p>Strategy generation unavailable at this time.</p>";
      }
};

/**
 * Analyzes a specific deal using Gemini 3.0 Pro Thinking Mode.
 */
export const analyzeDealStrategies = async (dealTitle: string, dealStage: string, dealValue: number, clientName: string, history: string): Promise<string> => {
    try {
      const prompt = `
        Act as a Deal Desk Analyst.
        Deal: ${dealTitle} ($${dealValue}) with ${clientName}.
        Current Stage: ${dealStage}.
        Activity History: ${history}
  
        Perform a deep analysis using your reasoning capabilities:
        1. Calculate a "Realism Score" (0-100%) based on the stage and history. Explain why.
        2. Identify the single biggest "Deal Killer" risk.
        3. Propose a "Closing Strategy" with 3 specific steps (e.g. "Send a whitepaper", "Offer a limited discount").
  
        Format as HTML with <h3>, <h4>, <p>, <ul>, <li>. Use <strong> for emphasis.
      `;
  
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32768 } // Thinking Mode for deep analysis
        }
      });
  
      return response.text || "Unable to generate deal analysis.";
    } catch (error) {
      console.error("Gemini Deal Analysis Error:", error);
      return "<p>Deal analysis unavailable at this time.</p>";
    }
};

/**
 * Suggests the single next best action for a deal using Thinking Mode.
 */
export const suggestNextAction = async (clientName: string, dealStage: string, lastActivity: string): Promise<{ title: string, type: 'email' | 'call' | 'task', description: string }> => {
  try {
    const prompt = `
      Context: Deal with ${clientName} is in ${dealStage}. Last activity: ${lastActivity}.
      
      Determine the single most effective next step to move this deal forward.
      Return valid JSON only. Format:
      {
        "title": "Action Title (e.g. Send Follow-up)",
        "type": "email" | "call" | "task",
        "description": "One sentence explanation of why and what to do."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 } // Deep thinking to find the *best* action
      }
    });

    const text = response.text || "{}";
    // Sanitize in case markdown blocks are included (though mimeType usually handles this)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Next Action Error:", error);
    return { title: "Review Deal", type: "task", description: "Review deal details and determine next steps manually." };
  }
};