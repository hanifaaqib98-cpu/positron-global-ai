import React, { useState } from 'react';
import { Network, Send, KeyRound, ShieldCheck, Check, X, MessageSquare, AlertCircle } from 'lucide-react';
import { ChannelSpec } from '../types/positron';

interface Props {
  channels: ChannelSpec[];
  outbox: Array<{ channel: string; content: string; timestamp: string }>;
  onToggleChannel: (spec: ChannelSpec) => Promise<void>;
  onTestEnvelope: (channel: string, sender: string, content: string, auth: boolean) => Promise<any>;
  onTestOutbound?: (channel: string, content: string, approved: boolean) => Promise<any>;
}

export const GatewayManager: React.FC<Props> = ({
  channels,
  outbox,
  onToggleChannel,
  onTestEnvelope,
  onTestOutbound,
}) => {
  const [testChannel, setTestChannel] = useState('telegram');
  const [senderRef, setSenderRef] = useState('user_421');
  const [testContent, setTestContent] = useState('Initiate system diagnostic query');
  const [authenticated, setAuthenticated] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Outbound simulator state
  const [outChannel, setOutChannel] = useState('telegram');
  const [outContent, setOutContent] = useState('Dispatch verified telemetry update');
  const [outApproved, setOutApproved] = useState(false);
  const [lastOutboundResult, setLastOutboundResult] = useState<any>(null);
  const [isSubmittingOut, setIsSubmittingOut] = useState(false);

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await onTestEnvelope(testChannel, senderRef, testContent, authenticated);
      setLastTestResult(res);
    } catch (err: any) {
      setLastTestResult({ accepted: false, reason: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOutboundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onTestOutbound) return;
    setIsSubmittingOut(true);
    try {
      const res = await onTestOutbound(outChannel, outContent, outApproved);
      setLastOutboundResult(res);
    } catch (err: any) {
      setLastOutboundResult({ queued: false, reason: err.message });
    } finally {
      setIsSubmittingOut(false);
    }
  };

  return (
    <div id="gateway-manager" className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Network className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-semibold text-slate-100">
            Positron Ingress/Egress Gateway Boundary
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          The Agent Gateway serves as the centralized boundary for always-on multi-channel interactions.
          Inbound traffic must satisfy channel-specific cryptographic or session authentication.
          Outbound messages on consequential channels enforce mandatory approval gates prior to queueing.
        </p>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.channel_id}
            className={`p-4 rounded-xl border transition-all ${
              ch.enabled
                ? 'bg-slate-900/80 border-slate-700 shadow-md'
                : 'bg-slate-950/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" style={{ display: ch.enabled ? 'block' : 'none' }} />
                <span className="font-mono text-sm font-semibold capitalize text-slate-200">
                  {ch.channel_id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onToggleChannel({ ...ch, enabled: !ch.enabled })}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                  ch.enabled
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {ch.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
                <span className="flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>Inbound Auth Required:</span>
                </span>
                <button
                  type="button"
                  onClick={() => onToggleChannel({ ...ch, inbound_auth_required: !ch.inbound_auth_required })}
                  className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                    ch.inbound_auth_required ? 'text-sky-300 bg-sky-950/60' : 'text-slate-500 bg-slate-900'
                  }`}
                >
                  {ch.inbound_auth_required ? 'TRUE' : 'FALSE'}
                </button>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Outbound Approval Required:</span>
                </span>
                <button
                  type="button"
                  onClick={() => onToggleChannel({ ...ch, outbound_requires_approval: !ch.outbound_requires_approval })}
                  className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                    ch.outbound_requires_approval ? 'text-amber-300 bg-amber-950/60' : 'text-slate-500 bg-slate-900'
                  }`}
                >
                  {ch.outbound_requires_approval ? 'TRUE' : 'FALSE'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Test Envelope Simulator & Outbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inbound Simulator */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center space-x-2">
            <Send className="w-4 h-4 text-sky-400" />
            <span>Simulate Inbound Gateway Envelope</span>
          </h3>

          <form onSubmit={handleTestSubmit} className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Target Channel</label>
                <select
                  value={testChannel}
                  onChange={(e) => setTestChannel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                >
                  {channels.map((c) => (
                    <option key={c.channel_id} value={c.channel_id}>{c.channel_id}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Sender Reference</label>
                <input
                  type="text"
                  value={senderRef}
                  onChange={(e) => setSenderRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Payload Content</label>
              <textarea
                value={testContent}
                onChange={(e) => setTestContent(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                id="auth-checkbox"
                type="checkbox"
                checked={authenticated}
                onChange={(e) => setAuthenticated(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-sky-600 focus:ring-0"
              />
              <label htmlFor="auth-checkbox" className="text-slate-300 font-sans cursor-pointer text-xs">
                Mark as Cryptographically Authenticated
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sky-600 hover:bg-sky-500 font-sans text-white font-medium py-2 rounded-lg transition-colors mt-2 text-xs"
            >
              Test Gateway Ingress
            </button>

            {lastTestResult && (
              <div
                className={`p-3 rounded border mt-3 font-mono text-xs ${
                  lastTestResult.accepted
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-red-950/40 border-red-800 text-red-300'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold mb-1">
                  {lastTestResult.accepted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>{lastTestResult.accepted ? 'ENVELOPE ACCEPTED' : 'ENVELOPE REJECTED'}</span>
                </div>
                <div>Reason: {lastTestResult.reason || 'Authentication and channel state valid'}</div>
              </div>
            )}
          </form>
        </div>

        {/* Outbound Dispatch Simulator */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center space-x-2">
            <Send className="w-4 h-4 text-amber-400 rotate-45" />
            <span>Simulate Outbound Dispatch & Approval Gate</span>
          </h3>

          <form onSubmit={handleOutboundSubmit} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Target Egress Channel</label>
              <select
                value={outChannel}
                onChange={(e) => setOutChannel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
              >
                {channels.map((c) => (
                  <option key={c.channel_id} value={c.channel_id}>
                    {c.channel_id} {c.outbound_requires_approval ? '(Approval Required)' : '(Direct)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Outbound Message Content</label>
              <textarea
                value={outContent}
                onChange={(e) => setOutContent(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                id="outbound-auth-checkbox"
                type="checkbox"
                checked={outApproved}
                onChange={(e) => setOutApproved(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
              />
              <label htmlFor="outbound-auth-checkbox" className="text-slate-300 font-sans cursor-pointer text-xs">
                Mark as Explicitly Approved for Outbound Dispatch
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmittingOut || !onTestOutbound}
              className="w-full bg-amber-600 hover:bg-amber-500 font-sans text-slate-950 font-bold py-2 rounded-lg transition-colors mt-2 text-xs"
            >
              {isSubmittingOut ? 'Evaluating Policy...' : 'Queue Outbound Message'}
            </button>

            {lastOutboundResult && (
              <div
                className={`p-3 rounded border mt-3 font-mono text-xs ${
                  lastOutboundResult.queued
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-800 text-amber-300'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold mb-1">
                  {lastOutboundResult.queued ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>{lastOutboundResult.queued ? 'OUTBOUND QUEUED TO OUTBOX' : 'OUTBOUND BLOCKED: APPROVAL REQUIRED'}</span>
                </div>
                <div>Status: {lastOutboundResult.reason || 'Approved and committed to Outbox journal'}</div>
              </div>
            )}
          </form>
        </div>

        {/* Live Outbox */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Gateway Outbox ({outbox.length})</span>
          </h3>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin text-xs font-mono">
            {outbox.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                Outbox is empty. Approved outbound channel events are staged here.
              </div>
            ) : (
              outbox.map((msg, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded p-3">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-sky-300 uppercase font-semibold">[{msg.channel}]</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-slate-200 font-sans">{msg.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
