import React, { useState } from 'react';
import { Send, Paperclip, Sparkles } from 'lucide-react';

export default function MessageInput({ onSendMessage, isAnalyzing }) {
  const [inputText, setInputText] = useState('');

  const quickActions = [
    "Where is my order?",
    "Can I get a refund?",
    "I need to speak to someone"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isAnalyzing) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickAction = (text) => {
    setInputText(text);
  };

  return (
    <div className="pt-2 border-t border-border bg-surface">
      {/* Suggested Quick Messages */}
      <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-medium text-ink-secondary flex items-center gap-1 whitespace-nowrap pl-1">
          <Sparkles className="w-3 h-3 text-primary" />
          Suggested:
        </span>
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickAction(action)}
            className="px-2.5 py-1 rounded-full bg-background hover:bg-primary-subtle text-ink-secondary hover:text-primary-dark border border-border hover:border-primary/30 text-xs whitespace-nowrap transition-smooth shadow-subtle"
          >
            "{action}"
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 p-1.5 bg-background border border-border rounded-xl focus-within:border-primary focus-within:bg-surface focus-within:ring-1 focus-within:ring-primary/20 transition-smooth">

          {/* Attach Button */}
          <button
            type="button"
            className="p-2 text-ink-secondary hover:text-ink rounded-lg hover:bg-black/5 transition-smooth"
            title="Attach file or screenshot"
            aria-label="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Input field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            disabled={isAnalyzing}
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-secondary/70 focus:outline-none disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isAnalyzing}
            className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-subtle transition-smooth cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Send</span>
            <Send className="w-3 h-3" />
          </button>
        </div>

        {/* Subtle AI Disclosure Note */}
        <p className="text-[11px] text-center text-ink-secondary/80 mt-2">
          AI responses may be reviewed for accuracy.
        </p>
      </form>
    </div>
  );
}
