'use client';

import React, { useState } from 'react';
import { Tender } from '../lib/types';
import { answerTenderQuery } from '@/lib/ai/ai-service';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Bot, 
  User, 
  HelpCircle, 
  Bookmark,
  CheckCircle2
} from 'lucide-react';

interface Props {
  tender: Tender;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: string[];
  timestamp: string;
}

export default function AiChatbot({ tender }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I am GovStart AI's clause-grounded procurement assistant. I am linked directly to the official RFP for "${tender.title}" (${tender.referenceNumber}). Ask me anything regarding technical specs, delivery deadlines, or statutory startup exemptions.`,
      citations: [tender.referenceNumber, 'Ministry Procurement Manual'],
      timestamp: 'Just now'
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    'What is the EMD exemption rule for startups?',
    'When is the final submission cutoff deadline?',
    'Is prior turnover mandatory for this tender?',
    'What is the estimated total budget?'
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    setTimeout(() => {
      const response = answerTenderQuery(text, tender);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-4 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[600px]">
      
      {/* Chat Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              Clause-Grounded RAG Assistant
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-sm bg-emerald-950 text-emerald-400 border border-emerald-800">
                Grounded
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-md">
              Context: {tender.referenceNumber} • Guardrails Active
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
        <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0">Ask:</span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shrink-0 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
              m.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
              m.sender === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-xs' 
                : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
            }`}>
              <p>{m.text}</p>

              {/* Citations pill container */}
              {m.citations && m.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1 items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Citations:</span>
                  {m.citations.map((c, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <div className={`text-[9px] ${m.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>Analyzing tender clauses and statutory regulations...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(inputQuestion); }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={`Ask anything about ${tender.referenceNumber}...`}
          className="flex-1 py-2 px-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isTyping}
          className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
        >
          <Send className="w-4 h-4 text-emerald-400" />
        </button>
      </form>

    </div>
  );
}
