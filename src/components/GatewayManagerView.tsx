import React, { useState } from 'react';
import { ChannelSpec } from '../types';
import { Radio, Send, CheckCircle, XCircle, Shield, Key } from 'lucide-react';

interface GatewayManagerViewProps {
  channels: ChannelSpec[];
  outbox: Array<Record<string, string>>;
  onToggleChannel: (channelId: string, enabled: boolean) => void;
  onTestEnvelope: (channel: string, sender: string, content: string, authenticated: boolean) => string;
}

export const GatewayManagerView: React.FC<GatewayManagerViewProps> = ({
  channels,
  outbox,
  onToggleChannel,
  onTestEnvelope
}) => {
  const [selectedChannel, setSelectedChannel] = useState('web');
  const [senderRef, setSenderRef] = useState('user_ref_001');
  const [testMessage, setTestMessage] = useState('Hello Positron, query active capabilities.');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessage.trim()) return;
    const res = onTestEnvelope(selectedChannel, senderRef, testMessage, isAuthenticated);
    setTestResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Channels Configuration Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
          <Radio className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-semibold font-mono text-slate-100">
            Multi-Channel Agent Gateway Router
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((ch) => (
            <div
              key={ch.channelId}
              className={`border rounded-xl p-4 transition-all ${
                ch.enabled
                  ? 'bg-slate-950 border-slate-700/80 shadow-md'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wide">
                  {ch.channelId}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ch.enabled}
                    onChange={(e) => onToggleChannel(ch.channelId, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Kind:</span>
                  <span className="text-slate-200">{ch.kind}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Inbound Auth:</span>
                  <span className={ch.inboundAuthRequired ? 'text-amber-400' : 'text-slate-400'}>
                    {ch.inboundAuthRequired ? 'Required' : 'Public'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Outbound Policy:</span>
                  <span className={ch.outboundRequiresApproval ? 'text-amber-400' : 'text-emerald-400'}>
                    {ch.outboundRequiresApproval ? 'Approval Needed' : 'Direct Dispatch'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Envelope Test Runner + Outbox Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Envelope Test Runner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-mono font-semibold text-slate-100 mb-4 pb-2 border-b border-slate-800 flex items-center space-x-2">
            <Send className="w-4 h-4 text-sky-400" />
            <span>Interactive Gateway Envelope Test Runner</span>
          </h3>

          <form onSubmit={handleSendTest} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Target Gateway Channel:</label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2.5 focus:border-sky-500 focus:outline-none"
              >
                {channels.map((ch) => (
                  <option key={ch.channelId} value={ch.channelId}>
                    {ch.channelId.toUpperCase()} ({ch.enabled ? 'ENABLED' : 'DISABLED'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Sender Reference Token:</label>
              <input
                type="text"
                value={senderRef}
                onChange={(e) => setSenderRef(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2.5 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Inbound Envelope Content:</label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2.5 focus:border-sky-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                id="authCheck"
                checked={isAuthenticated}
                onChange={(e) => setIsAuthenticated(e.target.checked)}
                className="rounded border-slate-700 text-sky-500 focus:ring-sky-500 bg-slate-900"
              />
              <label htmlFor="authCheck" className="text-slate-300 cursor-pointer flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Pass Authenticated Token In Header</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-md shadow-sky-500/20"
            >
              <Send className="w-4 h-4" />
              <span>TEST GATEWAY ACCEPTANCE</span>
            </button>
          </form>

          {testResult && (
            <div
              className={`mt-4 p-3 rounded-lg border text-xs font-mono ${
                testResult.includes('accepted')
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold mb-1">
                {testResult.includes('accepted') ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>Gateway Acceptance Result:</span>
              </div>
              <p>{testResult}</p>
            </div>
          )}
        </div>

        {/* Outbox Queue Ledger */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col h-[420px]">
          <h3 className="text-sm font-mono font-semibold text-slate-100 mb-4 pb-2 border-b border-slate-800">
            Outbound Dispatch Outbox ({outbox.length})
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono">
            {outbox.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No outbound messages in dispatch outbox.
              </div>
            ) : (
              outbox.map((msg, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span className="text-sky-400 font-bold uppercase">{msg.channel}</span>
                    <span>{msg.timestamp?.substring(11, 19)} UTC</span>
                  </div>
                  <p className="text-slate-200">{msg.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
