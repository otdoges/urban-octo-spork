'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, Code, Send, Play, Download, Settings2 } from 'lucide-react';
import { WebContainerService, FileSystemTree } from '@/lib/webContainers';
import { SystemPrompt } from '@/lib/systemPrompt';
import { AIModel } from '@/lib/aiInference';

// Initial filesystem structure for the WebContainer
const initialFileSystem: FileSystemTree = {
  'index.js': {
    file: {
      contents: `
import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from WebContainer!');
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});
`
    }
  },
  'package.json': {
    file: {
      contents: `{
  "name": "webcontainer-project",
  "version": "1.0.0",
  "description": "WebContainer example",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}`
    }
  }
};

export default function AIPlayground() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<AIModel>(AIModel.GPT4);
  const [url, setUrl] = useState<string>('');
  const [systemPromptText, setSystemPromptText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('prompt');
  
  const webContainerRef = useRef<WebContainerService | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Function to initialize WebContainer
  const initWebContainer = async () => {
    if (webContainerRef.current) return;
    try {
      setLoading(true);
      setOutput('Initializing WebContainer...');
      
      const service = new WebContainerService();
      webContainerRef.current = service;
      
      // Initialize with basic filesystem
      const success = await service.initialize(
        initialFileSystem,
        { GITHUB_TOKEN: token }
      );
      
      if (success) {
        setOutput(prev => prev + '\nWebContainer initialized successfully!');
        
        // Load system prompt
        const systemPrompt = service.getSystemPrompt();
        setSystemPromptText(systemPrompt.generatePrompt());
        
        setInitialized(true);
      } else {
        setOutput(prev => prev + '\nFailed to initialize WebContainer.');
      }
    } catch (error) {
      console.error('WebContainer initialization failed:', error);
      setOutput(prev => prev + `\nError: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Effect to initialize WebContainer when token is set
  useEffect(() => {
    // Clean up function
    return () => {
      webContainerRef.current = null;
    };
    
    // Only initialize if we have a token
    if (token && !initialized && !webContainerRef.current) {
      initWebContainer();
    }
  }, [token, initialized]);

  // Generate code with AI
  const handleGenerateCode = async () => {
    if (!webContainerRef.current || !initialized) {
      setOutput('WebContainer not initialized. Please set your GitHub token first.');
      return;
    }
    
    if (!prompt) {
      setOutput('Please enter a prompt.');
      return;
    }
    
    try {
      setLoading(true);
      setOutput('Generating code...');
      
      const result = await webContainerRef.current.generateCode(prompt, selectedModel);
      setOutput(result);
      
      // Create a file with the generated code
      await webContainerRef.current.writeFile('generated-code.js', result);
      setOutput(prev => prev + '\n\nCode saved to generated-code.js');
    } catch (error) {
      console.error('Code generation failed:', error);
      setOutput(`Error generating code: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Analyze website with AI
  const handleAnalyzeWebsite = async () => {
    if (!webContainerRef.current || !initialized) {
      setOutput('WebContainer not initialized. Please set your GitHub token first.');
      return;
    }
    
    if (!url) {
      setOutput('Please enter a URL to analyze.');
      return;
    }
    
    try {
      setLoading(true);
      setOutput(`Analyzing website: ${url}`);
      
      const result = await webContainerRef.current.analyzeWebsite(url);
      setOutput(result);
    } catch (error) {
      console.error('Website analysis failed:', error);
      setOutput(`Error analyzing website: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Update system prompt
  const handleUpdateSystemPrompt = () => {
    if (!webContainerRef.current || !initialized) {
      setOutput('WebContainer not initialized. Please set your GitHub token first.');
      return;
    }
    
    try {
      webContainerRef.current.getSystemPrompt().loadFromJSON(systemPromptText);
      setOutput('System prompt updated successfully.');
    } catch (error) {
      console.error('System prompt update failed:', error);
      setOutput(`Error updating system prompt: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Run generated code
  const handleRunCode = async () => {
    if (!webContainerRef.current || !initialized) {
      setOutput('WebContainer not initialized. Please set your GitHub token first.');
      return;
    }
    
    try {
      setLoading(true);
      setOutput('Installing dependencies...');
      
      const installSuccess = await webContainerRef.current.installDependencies();
      
      if (installSuccess) {
        setOutput(prev => prev + '\nDependencies installed successfully.');
        setOutput(prev => prev + '\nStarting server...');
        
        const serverUrl = await webContainerRef.current.startDevServer();
        setOutput(prev => prev + `\nServer started at ${serverUrl}`);
        
        // Load the server in the iframe
        if (iframeRef.current) {
          iframeRef.current.src = serverUrl;
        }
      } else {
        setOutput(prev => prev + '\nFailed to install dependencies.');
      }
    } catch (error) {
      console.error('Failed to run code:', error);
      setOutput(prev => prev + `\nError: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI-Powered Website Converter</CardTitle>
          <CardDescription>Convert any website to modern React & Tailwind CSS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">GitHub Token</label>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Enter your GitHub token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={initialized}
                className="flex-1"
              />
              <Button variant="outline" disabled={!token || initialized} onClick={initWebContainer}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Set Token'}
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Required for AI capabilities. Get one from{' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                GitHub
              </a>
            </p>
          </div>

          <Tabs defaultValue="prompt" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="prompt">AI Prompt</TabsTrigger>
              <TabsTrigger value="website">Website Analysis</TabsTrigger>
              <TabsTrigger value="system">System Prompt</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prompt" className="space-y-4">
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium">Write a prompt for code generation</label>
                <Textarea
                  placeholder="Create a React component for a responsive navigation bar with dark mode support..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="mb-2"
                />
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Model:</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                      className="rounded border p-1 text-sm"
                    >
                      <option value={AIModel.GPT4}>GPT-4</option>
                      <option value={AIModel.O4_MINI}>O4-Mini</option>
                      <option value={AIModel.GROK3}>Grok-3</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleGenerateCode} 
                      disabled={loading || !initialized}
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Code className="mr-2 h-4 w-4" />}
                      Generate Code
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleRunCode} 
                      disabled={loading || !initialized}
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                      Run Code
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="website" className="space-y-4">
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium">Enter a website URL to analyze</label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAnalyzeWebsite} 
                    disabled={loading || !initialized}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Analyze
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="system" className="space-y-4">
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium">Customize System Prompt</label>
                <Textarea
                  placeholder="System prompt for the AI..."
                  value={systemPromptText}
                  onChange={(e) => setSystemPromptText(e.target.value)}
                  rows={10}
                  className="mb-2 font-mono text-sm"
                />
                <Button 
                  onClick={handleUpdateSystemPrompt}
                  disabled={loading || !initialized}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings2 className="mr-2 h-4 w-4" />}
                  Update System Prompt
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium">Output</label>
            <div className="h-64 overflow-auto rounded border bg-black p-4 font-mono text-sm text-white">
              <pre>{output || 'Set your GitHub token to begin...'}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="h-80 overflow-hidden rounded border">
        <iframe
          ref={iframeRef}
          className="h-full w-full"
          src="about:blank"
          title="WebContainer Output"
        />
      </div>
    </div>
  );
}
