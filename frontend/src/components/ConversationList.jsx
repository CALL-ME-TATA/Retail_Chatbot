import React, { useState } from 'react';
import { Search, User, Calendar, PackageCheck, Clock, Tag } from 'lucide-react';
import ConversationItem from './ConversationItem';

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = conversations.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.customer.toLowerCase().includes(term) ||
      c.orderId.toLowerCase().includes(term) ||
      c.product.toLowerCase().includes(term) ||
      c.lastMessage.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Conversations Card */}
      <div className="bg-surface rounded-card border border-border p-4 shadow-subtle">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-ink">Conversations</h2>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-subtle text-primary-dark">
            {conversations.length} total
          </span>
        </div>

        {/* Search Field */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-ink placeholder:text-ink-secondary/70 focus:outline-none focus:border-primary focus:bg-surface transition-smooth"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {filtered.length > 0 ? (
            filtered.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedConversation?.id === conv.id}
                onSelect={onSelectConversation}
              />
            ))
          ) : (
            <div className="py-6 text-center text-xs text-ink-secondary">
              No conversations match your search.
            </div>
          )}
        </div>
      </div>

      {/* Selected Customer Information Context Card */}
      {selectedConversation && (
        <div className="bg-surface rounded-card border border-border p-4 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                Customer Context
              </h3>
            </div>
            <span className="text-[11px] font-medium text-ink-secondary">
              ID: {selectedConversation.id}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-ink-secondary">Customer:</span>
              <span className="font-semibold text-ink">{selectedConversation.customer}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-ink-secondary">Customer since:</span>
              <span className="font-medium text-ink">{selectedConversation.customerSince}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-ink-secondary">Order:</span>
              <span className="font-mono font-medium text-ink bg-background px-1.5 py-0.5 rounded border border-border text-[11px]">
                {selectedConversation.orderId}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <span className="text-ink-secondary">Product:</span>
              <span className="font-medium text-ink text-right line-clamp-1">
                {selectedConversation.product}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-ink-secondary">Order status:</span>
              <span className={`font-medium px-2 py-0.5 rounded text-[11px] ${
                selectedConversation.orderStatus.toLowerCase().includes('delayed')
                  ? 'bg-danger-light text-danger border border-danger-border'
                  : selectedConversation.orderStatus.toLowerCase().includes('delivered')
                  ? 'bg-success-light text-success border border-success-border'
                  : 'bg-warning-light text-warning border border-warning-border'
              }`}>
                {selectedConversation.orderStatus}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-ink-secondary">Expected delivery:</span>
              <span className="font-medium text-ink">{selectedConversation.expectedDelivery}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
