'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, ThumbsUp, ThumbsDown, X, ExternalLink } from 'lucide-react';
import { fetchWithMock } from '@/lib/fetchWithMock';

interface ChatSource {
  title: string;
  excerpt: string;
  url: string;
  date: string;
}

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  timestamp: Date;
}

export const ChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, 'positive' | 'negative' | null>>({});

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetchWithMock('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        type: 'assistant',
        content: data.answer_html,
        sources: data.sources,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageIndex: number, type: 'positive' | 'negative') => {
    setFeedback(prev => ({ ...prev, [messageIndex]: type }));
    // In a real app, this would send feedback to the server
    console.log('Feedback:', type, 'for message', messageIndex);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className="chat-bubble flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <Card className="chat-panel">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                AI Assistant
              </CardTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 && (
                <div className="text-center text-white/60 text-sm py-8">
                  How can I help you today?
                </div>
              )}

              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={message.type === 'user' ? 'chat-message-user' : 'chat-message-assistant'}>
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-white/60">Sources:</div>
                        {message.sources.map((source, sourceIndex) => (
                          <div key={sourceIndex} className="bg-white/5 rounded p-2 text-xs">
                            <div className="font-medium text-white mb-1">{source.title}</div>
                            <div className="text-white/70 mb-2">{source.excerpt}</div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/60">{source.date}</span>
                              <a 
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {message.type === 'assistant' && (
                      <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-white/10">
                        <span className="text-xs text-white/60">Helpful?</span>
                        <button
                          onClick={() => handleFeedback(index, 'positive')}
                          className={`p-1 rounded ${
                            feedback[index] === 'positive' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'text-white/60 hover:text-green-400'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(index, 'negative')}
                          className={`p-1 rounded ${
                            feedback[index] === 'negative' 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'text-white/60 hover:text-red-400'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-message-assistant">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about brokers..."
                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/60"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="cta-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};