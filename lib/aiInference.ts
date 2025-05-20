import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// Types for AI model responses
export interface ModelResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelOptions {
  model: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

// Available models
export enum AIModel {
  GPT4 = "openai/gpt-4.1",
  O4_MINI = "openai/o4-mini",
  GROK3 = "xai/grok-3",
}

/**
 * Azure AI Inference client for interacting with GitHub AI models
 */
export class AzureAIClient {
  private client: ReturnType<typeof ModelClient>;
  private defaultModel: string;

  constructor(token?: string) {
    const githubToken = token || process.env.GITHUB_TOKEN || "";
    const endpoint = "https://models.github.ai/inference";
    
    if (!githubToken) {
      throw new Error("GitHub token is required. Please provide it or set GITHUB_TOKEN environment variable.");
    }

    this.client = ModelClient(
      endpoint,
      new AzureKeyCredential(githubToken),
    );

    this.defaultModel = AIModel.GPT4;
  }

  /**
   * Send a single message to the AI model
   */
  async sendMessage(
    message: string,
    systemPrompt: string,
    options: Partial<ModelOptions> = {}
  ): Promise<ModelResponse> {
    try {
      const response = await this.client.path("/chat/completions").post({
        body: {
          messages: [
            { role: "system", content: systemPrompt || "" },
            { role: "user", content: message }
          ],
          temperature: options.temperature ?? 0.7,
          top_p: options.top_p ?? 1.0,
          max_tokens: options.max_tokens,
          model: options.model ?? this.defaultModel
        }
      });

      if (isUnexpected(response)) {
        throw new Error(`Error: ${response.body.error}`);
      }

      const messageContent = response.body.choices[0].message.content || "";
      
      return {
        content: messageContent,
        usage: response.body.usage
      };
    } catch (error) {
      console.error("AI inference error:", error);
      throw error;
    }
  }

  /**
   * Send a conversation history to the AI model
   */
  async sendConversation(
    messages: Array<{ role: string, content: string }>,
    options: Partial<ModelOptions> = {}
  ): Promise<ModelResponse> {
    try {
      const response = await this.client.path("/chat/completions").post({
        body: {
          messages,
          temperature: options.temperature ?? 0.7,
          top_p: options.top_p ?? 1.0,
          max_tokens: options.max_tokens,
          model: options.model ?? this.defaultModel
        }
      });

      if (isUnexpected(response)) {
        throw new Error(`Error: ${response.body.error}`);
      }

      const messageContent = response.body.choices[0].message.content || "";
      
      return {
        content: messageContent,
        usage: response.body.usage
      };
    } catch (error) {
      console.error("AI inference error:", error);
      throw error;
    }
  }

  /**
   * Analyze a website and generate HTML/CSS/JS code
   */
  async analyzeWebsite(url: string, systemPrompt: string): Promise<string> {
    try {
      const response = await this.client.path("/conversation").post({
        body: {
          messages: [
            { role: "system", content: systemPrompt || "" },
            { role: "user", content: `Analyze this website: ${url}` }
          ],
          temperature: 0.5,
          top_p: 0.95,
          model: AIModel.GPT4
        }
      });

      if (isUnexpected(response)) {
        throw new Error(`Error: ${response.body.error}`);
      }

      const messageContent = response.body.choices[0].message.content || "";
      return messageContent;
    } catch (error) {
      console.error("Website analysis error:", error);
      throw error;
    }
  }
}
