import { WebContainer } from '@webcontainer/api';
import { SystemPrompt } from './systemPrompt';
import { AzureAIClient, AIModel } from './aiInference';

/**
 * File system structure for WebContainer
 */
export interface FileSystemTree {
  [key: string]: {
    file?: { contents: string };
    directory?: FileSystemTree;
  };
}

/**
 * Environment variable configuration
 */
export interface EnvConfig {
  GITHUB_TOKEN?: string;
  [key: string]: string | undefined;
}

/**
 * WebContainerService handles the initialization and management of WebContainers
 * for running code in the browser with AI assistance
 */
export class WebContainerService {
  private container: WebContainer | null = null;
  private systemPrompt: SystemPrompt;
  private aiClient: AzureAIClient | null = null;
  private isReady: boolean = false;
  private envConfig: EnvConfig = {};

  constructor() {
    this.systemPrompt = new SystemPrompt();
  }

  /**
   * Initialize the WebContainer with filesystem and environment
   */
  public async initialize(files: FileSystemTree, env: EnvConfig = {}): Promise<boolean> {
    try {
      // Save env config for later use
      this.envConfig = env;

      // Initialize WebContainer
      this.container = await WebContainer.boot();
      
      // Mount the filesystem
      await this.container.mount(files);

      // Setup environment variables
      await this.setEnvironmentVariables(env);

      // Initialize AI client if GitHub token is provided
      if (env.GITHUB_TOKEN) {
        try {
          this.aiClient = new AzureAIClient();
        } catch (error) {
          console.error("Failed to initialize AI client:", error);
        }
      }

      this.isReady = true;
      return true;
    } catch (error) {
      console.error("WebContainer initialization failed:", error);
      return false;
    }
  }

  /**
   * Set environment variables in the WebContainer
   */
  private async setEnvironmentVariables(env: EnvConfig): Promise<void> {
    if (!this.container) return;

    // Create .env file content
    const envContent = Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Write to .env file
    await this.container.fs.writeFile('.env', envContent);
    
    // Also set them in the process environment
    const shellProcess = await this.container.spawn('bash', ['-c', 'source .env']);
    const exitCode = await shellProcess.exit;
    
    if (exitCode !== 0) {
      console.error("Failed to set environment variables, exit code:", exitCode);
    }
  }

  /**
   * Run a command in the WebContainer
   */
  public async runCommand(command: string): Promise<{ exitCode: number, output: string }> {
    if (!this.container || !this.isReady) {
      throw new Error("WebContainer is not initialized");
    }

    const output: string[] = [];
    
    const process = await this.container.spawn('bash', ['-c', command]);
    
    // Capture output
    process.output.pipeTo(
      new WritableStream({
 const decoder = new TextDecoder();
 write(chunk) {
   output.push(decoder.decode(chunk));
 }
      })
    );
    
    // Wait for the process to exit
    const exitCode = await process.exit;
    
    return {
      exitCode,
      output: output.join('')
    };
  }

  /**
   * Generate code using AI with the configured system prompt
   */
  public async generateCode(userPrompt: string, model: AIModel = AIModel.GPT4): Promise<string> {
    if (!this.aiClient) {
      throw new Error("AI client is not initialized. Make sure GITHUB_TOKEN is provided.");
    }

    const systemPromptText = this.systemPrompt.generatePrompt();
    
    try {
      const response = await this.aiClient.sendMessage(
        userPrompt,
        systemPromptText,
        { model }
      );
      
      return response.content;
    } catch (error) {
      console.error("Code generation failed:", error);
      throw error;
    }
  }

  /**
   * Analyze a website and generate a conversion template
   */
  public async analyzeWebsite(url: string): Promise<string> {
    if (!this.container || !this.isReady) {
      throw new Error("WebContainer is not initialized");
    }

    if (!this.aiClient) {
      throw new Error("AI client is not initialized. Make sure GITHUB_TOKEN is provided.");
    }

    // Add a specialized section for website analysis
    this.systemPrompt.addSection(
      "website_analysis",
      `Analyze the website at ${url} and identify:\n` +
      "1. Color scheme and design patterns\n" +
      "2. Component structure\n" +
      "3. Layout and responsive design approach\n" +
      "4. Content structure\n" +
      "5. Interactive elements\n" +
      "6. Accessibility features\n\n" +
      "Provide a detailed breakdown that can be used to create a customizable template."
    );

    // Generate analysis using AI
    const analysisPrompt = `Analyze the website at ${url} and create a detailed breakdown for converting it to a template.`;
    return this.generateCode(analysisPrompt);
  }

  /**
   * Install dependencies in the WebContainer
   */
  public async installDependencies(): Promise<boolean> {
    try {
      const { exitCode } = await this.runCommand('npm install');
      return exitCode === 0;
    } catch (error) {
      console.error("Failed to install dependencies:", error);
      return false;
    }
  }

  /**
   * Start a development server in the WebContainer
   * @param onData Optional callback to receive real-time server logs
   */
  public async startDevServer(onData?: (data: string) => void): Promise<string> {
    if (!this.container || !this.isReady) {
      throw new Error("WebContainer is not initialized");
    }

    try {
      // Spawn the dev server process (do not await its exit)
      const process = await this.container.spawn('bash', ['-c', 'npm run dev']);

      // Pipe output to the provided callback for real-time logs
      if (onData) {
        const decoder = new TextDecoder();
        process.output.pipeTo(
          new WritableStream({
            write(chunk) {
              onData(decoder.decode(chunk));
            }
          })
        );
      }

      // Get the URL for the WebContainer server
      const serverUrl = await this.container.serveHostedDirectory({
        path: '/',
        options: {
          port: 3000, // Default port for Next.js
        }
      });

      return serverUrl;
    } catch (error) {
      console.error("Failed to start development server:", error);
      throw error;
    }
  }

  /**
   * Get a file from the WebContainer filesystem
   */
  public async getFile(path: string): Promise<string> {
    if (!this.container || !this.isReady) {
      throw new Error("WebContainer is not initialized");
    }

    try {
      const file = await this.container.fs.readFile(path, 'utf-8');
      return file;
    } catch (error) {
      console.error(`Failed to read file ${path}:`, error);
      throw error;
    }
  }

  /**
   * Write a file to the WebContainer filesystem
   */
  public async writeFile(path: string, content: string): Promise<void> {
    if (!this.container || !this.isReady) {
      throw new Error("WebContainer is not initialized");
    }

    try {
      await this.container.fs.writeFile(path, content);
    } catch (error) {
      console.error(`Failed to write file ${path}:`, error);
      throw error;
    }
  }

  /**
   * Get the current WebContainer
   */
  public getContainer(): WebContainer | null {
    return this.container;
  }

  /**
   * Get the system prompt instance
   */
  public getSystemPrompt(): SystemPrompt {
    return this.systemPrompt;
  }

  /**
   * Check if the WebContainer is ready
   */
  public isContainerReady(): boolean {
    return this.isReady;
  }
}
