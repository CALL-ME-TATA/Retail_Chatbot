import React from 'react';
import { Sparkles, Bell, Sun, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'conversation', label: 'Conversation' },
    { id: 'insights', label: 'Insights' },
    { id: 'knowledge', label: 'Knowledge' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-lg tracking-tight text-ink">EmpathIQ</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-primary-light text-primary-dark border border-primary/20">
                  RETAIL AI
                </span>
              </div>
            </div>

            {/* Center/Left Navigation */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-border">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-smooth ${isActive
                      ? 'bg-primary-subtle text-primary-dark font-semibold'
                      : 'text-ink-secondary hover:text-ink hover:bg-black/5'
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <button
              type="button"
              className="relative p-2 rounded-lg text-ink-secondary hover:text-ink hover:bg-black/5 transition-smooth"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warning"></span>
            </button>

            {/* Theme Toggle (Visual only, maintains light mode per spec) */}
            <button
              type="button"
              className="p-2 rounded-lg text-ink-secondary hover:text-ink hover:bg-black/5 transition-smooth"
              aria-label="Light mode active"
              title="Light theme enforced"
            >
              <Sun className="w-4 h-4" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-dark text-xs font-semibold">
                SA
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-ink leading-none">Support Agent</p>
                <p className="text-[11px] text-ink-secondary mt-0.5 leading-none">Tier-1 Escalations</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
