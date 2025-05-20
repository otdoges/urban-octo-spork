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
});`
    }
  },
  'package.json': {
    file: {
      contents: `{
  "name": "webcontainer-project",
  "type": "module",
  "dependencies": {
    "express": "latest",
    "@azure-rest/ai-inference": "latest",
    "@azure/core-auth": "latest",
    "@azure/core-sse": "latest"
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function initWebContainer() {
      if (!webContainerRef.current) {
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
      }
    }
    
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

  // Analyze website
  const handleAnalyzeWebsite = async () => {
    if (!webContainerRef.current || !initialized) {
      setOutput('WebContainer not initialized. Please set your GitHub token first.');
      return;
    }
    
    if (!url) {
      setOutput('Please enter a website URL.');
      return;
    }
    
    try {
      setLoading(true);
      setOutput(`Analyzing website: ${url}...`);
      
      const analysis = await webContainerRef.current.analyzeWebsite(url);
      setOutput(analysis);
    } catch (error) {
      console.error('Website analysis failed:', error);
      setOutput(`Error analyzing website: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Run code in WebContainer
  const handleRunCode = async () => {
    if (!webContainerRef.current || !initialized) {
      setOutput('WebContainer not initialized. Please set your GitHub token first.');
      return;
    }
    
    try {
      setLoading(true);
      setOutput('Installing dependencies...');
      
      // Install dependencies
      const installed = await webContainerRef.current.installDependencies();
      
      if (installed) {
        setOutput(prev => prev + '\nDependencies installed successfully.');
        setOutput(prev => prev + '\nStarting server...');
        
        // Start the server
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

  // Update system prompt
  const handleUpdateSystemPrompt = () => {
    if (!webContainerRef.current || !initialized) {
      setOutput('WebContainer not initialized. Please set your GitHub token first.');
      return;
    }
    
    try {
      const systemPrompt = webContainerRef.current.getSystemPrompt();
      
      // Parse the text and update the system prompt
      const sections = systemPromptText.split(/(?=<[a-z_]+>)/);
      
      for (const section of sections) {
        const matches = section.match(/<([a-z_]+)>([\s\S]*?)<\/\1>/);
        
        if (matches && matches.length === 3) {
          const [, title, content] = matches;
          systemPrompt.addSection(title, content.trim());
        }
      }
      
      setOutput('System prompt updated successfully.');
    } catch (error) {
      console.error('Failed to update system prompt:', error);
      setOutput(`Error updating system prompt: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Website Converter</CardTitle>
          <CardDescription>
            Convert any website into a customizable template using WebContainers and AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="password"
                placeholder="Enter your GitHub token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={initialized}
                className="flex-1"
              />
              <Button variant="outline" disabled={!token || initialized} onClick={() => {
                if (webContainerRef.current) return;
                async function initContainer() {
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
                }
                initContainer();
              }}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Set Token'}
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="prompt">AI Prompt</TabsTrigger>
                <TabsTrigger value="system">System Prompt</TabsTrigger>
                <TabsTrigger value="website">Website Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="prompt" className="space-y-4">
                <Textarea
                  placeholder="Enter your code generation prompt..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[200px]"
                />
                
                <div className="flex items-center space-x-2">
                  <select
                    className="border rounded-md px-3 py-2"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                  >
                    <option value={AIModel.GPT4}>GPT-4.1</option>
                    <option value={AIModel.O4_MINI}>O4-Mini</option>
                    <option value={AIModel.GROK3}>Grok-3</option>
                  </select>
                  
                  <Button 
                    onClick={handleGenerateCode} 
                    disabled={!initialized || loading || !prompt}
                    className="flex-1"
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Code className="h-4 w-4 mr-2" />}
                    Generate Code
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="system" className="space-y-4">
                <Textarea
                  placeholder="System prompt configuration..."
                  value={systemPromptText}
                  onChange={(e) => setSystemPromptText(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                
                <Button 
                  onClick={handleUpdateSystemPrompt} 
                  disabled={!initialized || loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Settings2 className="h-4 w-4 mr-2" />}
                  Update System Prompt
                </Button>
              </TabsContent>
              
              <TabsContent value="website" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="url"
                    placeholder="Enter website URL to analyze"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  
                  <Button 
                    onClick={handleAnalyzeWebsite} 
                    disabled={!initialized || loading || !url}
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                    Analyze
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setOutput('')}
            disabled={loading || !output}
          >
            Clear Output
          </Button>
          
          <Button 
            onClick={handleRunCode} 
            disabled={!initialized || loading}
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Run in WebContainer
          </Button>
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="h-[500px] overflow-hidden">
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm p-4 bg-muted rounded-lg">
              {output || 'Output will appear here...'}
            </pre>
          </CardContent>
        </Card>
        
        <Card className="h-[500px] overflow-hidden">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <iframe 
              ref={iframeRef}
              className="w-full h-full border-0 rounded-lg"
              src="about:blank"
              title="WebContainer Preview"
            ></iframe>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
