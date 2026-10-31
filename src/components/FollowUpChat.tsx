import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  Bot,
  Copy,
  Check,
  Trash2,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { AnalysisResult, ChatMessage, Language } from '../types';
import { translations } from '../utils/translations';

interface FollowUpChatProps {
  analysisResult: AnalysisResult;
  language: Language;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({ analysisResult, language }) => {
  const t = translations[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [chatNotice, setChatNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isRtl = language === 'ur';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setChatNotice(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          analysisContext: {
            errorTitle: analysisResult.errorTitle,
            category: analysisResult.category,
            severity: analysisResult.severity,
            detectedErrorText: analysisResult.detectedErrorText,
            rootCause: analysisResult.rootCause,
            quickFix: analysisResult.quickFix,
            steps: analysisResult.steps,
            alternativeSolution: analysisResult.alternativeSolution,
          },
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        content: `⚠️ Error: ${err.message || 'Could not connect to Gemini AI. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    setMessages([]);
    setChatNotice(t.chatCleared);
    setTimeout(() => setChatNotice(null), 3000);
  };

  const handleCopyMessage = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      className={`bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/40 ${
        isRtl ? 'dir-rtl' : ''
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header with Clear Chat action */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t.chatHeading}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.chatSubtitle}
            </p>
          </div>
        </div>

        {/* Clear Chat Button */}
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Clear conversation history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearChat}</span>
          </button>
        )}
      </div>

      {/* Notice Alert (e.g. chat cleared) */}
      {chatNotice && (
        <div className="mb-4 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs text-center font-medium">
          {chatNotice}
        </div>
      )}

      {/* Suggested Quick Prompt Pills */}
      {messages.length === 0 && (
        <div className="mb-6 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Suggested questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {[t.chatSuggestedPrompt1, t.chatSuggestedPrompt2, t.chatSuggestedPrompt3].map(
              (prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className={`text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/60 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 transition text-left cursor-pointer ${
                    isRtl ? 'font-urdu' : ''
                  }`}
                >
                  💡 {prompt}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? (isRtl ? 'justify-start' : 'justify-end') : (isRtl ? 'justify-end' : 'justify-start')
            }`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`relative group max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/60 dark:border-slate-700/60'
              } ${isRtl ? 'font-urdu leading-loose text-right' : ''}`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>

              <div className="mt-1 flex items-center justify-between gap-4 text-[10px] opacity-70">
                <span>{msg.timestamp}</span>
                {msg.role === 'model' && (
                  <button
                    onClick={() => handleCopyMessage(msg.content, idx)}
                    className="opacity-0 group-hover:opacity-100 transition hover:text-blue-500 flex items-center gap-1 cursor-pointer"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/90 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
              <div
                className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: '0.15s' }}
              />
              <div
                className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: '0.3s' }}
              />
              <span className="ml-1">{t.chatThinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="relative flex items-end gap-2 p-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.chatPlaceholder}
          rows={1}
          disabled={isLoading}
          className={`w-full resize-none bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none max-h-32 ${
            isRtl ? 'font-urdu text-right' : ''
          }`}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-medium text-xs flex items-center justify-center transition shadow-md shadow-blue-500/20 flex-shrink-0 cursor-pointer"
        >
          <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-500" /> Powered by Gemini
        </span>
      </div>
    </div>
  );
};
