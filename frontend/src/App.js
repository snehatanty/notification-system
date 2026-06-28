import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

function getStatusColor(status) {
  switch (status) {
    case 'SENT': return '#00ff88';
    case 'QUEUED': return '#ffb800';
    case 'FAILED': return '#ff4444';
    case 'RATE_LIMITED': return '#aa44ff';
    default: return '#888';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'SENT': return '◉';
    case 'QUEUED': return '◎';
    case 'FAILED': return '✕';
    case 'RATE_LIMITED': return '⊘';
    default: return '•';
  }
}

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(1);
  const [form, setForm] = useState({ userId: 1, type: 'EMAIL', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/notifications/${userId}`);
      setNotifications(res.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const sendNotification = async () => {
    if (!form.subject || !form.message) {
      setMsg('⚠ Fields required: subject and message');
      setMsgType('error');
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API_BASE}/notifications`, form);
      setMsg('◉ Notification dispatched successfully');
      setMsgType('success');
      setForm({ ...form, subject: '', message: '' });
      fetchNotifications();
    } catch (err) {
      setMsg('✕ Dispatch failed — check system logs');
      setMsgType('error');
    }
    setSending(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const counts = {
    SENT: notifications.filter(n => n.status === 'SENT').length,
    QUEUED: notifications.filter(n => n.status === 'QUEUED').length,
    FAILED: notifications.filter(n => n.status === 'FAILED').length,
    RATE_LIMITED: notifications.filter(n => n.status === 'RATE_LIMITED').length,
  };

  return (
    <div style={{
      margin: 0,
      fontFamily: "'Courier New', monospace",
      background: '#0a0e1a',
      minHeight: '100vh',
      padding: '24px',
      boxSizing: 'border-box',
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(0,100,255,0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(0,255,136,0.05) 0%, transparent 50%),
        linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          border: '1px solid #00ff8840',
          borderRadius: '4px',
          padding: '20px 28px',
          marginBottom: '24px',
          background: 'rgba(0,255,136,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
          }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <span style={{ color: '#00ff88', fontSize: '20px' }}>⬡</span>
              <h1 style={{ color: '#00ff88', margin: 0, fontSize: '22px', fontWeight: '700', letterSpacing: '0.1em' }}>
                NOTIFICATION SYSTEM
              </h1>
              <span style={{
                background: '#00ff8820', color: '#00ff88', fontSize: '10px',
                padding: '2px 8px', borderRadius: '2px', border: '1px solid #00ff8840',
                letterSpacing: '0.1em',
              }}>ONLINE</span>
            </div>
            <p style={{ color: '#445566', margin: 0, fontSize: '12px', letterSpacing: '0.05em' }}>
              SPRING BOOT • RABBITMQ • REDIS • SENDGRID • REACT
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#00ff88', fontSize: '18px', fontWeight: '700', letterSpacing: '0.1em' }}>
              {time.toLocaleTimeString()}
            </div>
            <div style={{ color: '#445566', fontSize: '11px', marginTop: '2px' }}>
              {time.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'DELIVERED', key: 'SENT', color: '#00ff88' },
            { label: 'QUEUED', key: 'QUEUED', color: '#ffb800' },
            { label: 'FAILED', key: 'FAILED', color: '#ff4444' },
            { label: 'RATE LIMITED', key: 'RATE_LIMITED', color: '#aa44ff' },
          ].map(s => (
            <div key={s.key} style={{
              border: `1px solid ${s.color}30`,
              borderRadius: '4px',
              padding: '16px',
              background: `${s.color}08`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: s.color, opacity: 0.6,
              }} />
              <div style={{ color: s.color, fontSize: '36px', fontWeight: '700', lineHeight: 1 }}>
                {counts[s.key].toString().padStart(2, '0')}
              </div>
              <div style={{ color: '#445566', fontSize: '11px', marginTop: '8px', letterSpacing: '0.1em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>

          {/* Send Form */}
          <div style={{
            border: '1px solid #1a2a3a',
            borderRadius: '4px',
            padding: '20px',
            background: '#0d1117',
          }}>
            <div style={{ color: '#00ff88', fontSize: '12px', letterSpacing: '0.15em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>▶</span> DISPATCH NOTIFICATION
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ color: '#445566', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '6px' }}>USER_ID</div>
              <input type="number" value={form.userId}
                onChange={e => setForm({ ...form, userId: parseInt(e.target.value) })}
                style={{
                  width: '100%', padding: '8px 12px', background: '#0a0e1a',
                  border: '1px solid #1a2a3a', borderRadius: '3px', color: '#00ff88',
                  fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none',
                }} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ color: '#445566', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '6px' }}>CHANNEL</div>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                style={{
                  width: '100%', padding: '8px 12px', background: '#0a0e1a',
                  border: '1px solid #1a2a3a', borderRadius: '3px', color: '#00ff88',
                  fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none',
                }}>
                <option value="EMAIL">[ EMAIL ]</option>
                <option value="IN_APP">[ IN_APP ]</option>
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ color: '#445566', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '6px' }}>SUBJECT</div>
              <input type="text" value={form.subject} placeholder="enter subject..."
                onChange={e => setForm({ ...form, subject: e.target.value })}
                style={{
                  width: '100%', padding: '8px 12px', background: '#0a0e1a',
                  border: '1px solid #1a2a3a', borderRadius: '3px', color: '#00ff88',
                  fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none',
                }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: '#445566', fontSize: '11px', letterSpacing: '0.1em', marginBottom: '6px' }}>MESSAGE</div>
              <textarea rows={4} value={form.message} placeholder="enter message..."
                onChange={e => setForm({ ...form, message: e.target.value })}
                style={{
                  width: '100%', padding: '8px 12px', background: '#0a0e1a',
                  border: '1px solid #1a2a3a', borderRadius: '3px', color: '#00ff88',
                  fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box',
                  outline: 'none', resize: 'vertical',
                }} />
            </div>

            <button onClick={sendNotification} disabled={sending}
              style={{
                width: '100%', padding: '10px', background: sending ? '#0a0e1a' : '#00ff8815',
                border: `1px solid ${sending ? '#1a2a3a' : '#00ff88'}`,
                borderRadius: '3px', color: sending ? '#445566' : '#00ff88',
                fontSize: '12px', fontFamily: 'monospace', cursor: sending ? 'not-allowed' : 'pointer',
                letterSpacing: '0.15em', fontWeight: '700',
              }}>
              {sending ? '[ DISPATCHING... ]' : '[ SEND NOTIFICATION ]'}
            </button>

            {msg && (
              <div style={{
                marginTop: '12px', padding: '8px 12px', borderRadius: '3px', fontSize: '12px',
                fontFamily: 'monospace', letterSpacing: '0.05em',
                background: msgType === 'success' ? '#00ff8810' : '#ff444410',
                border: `1px solid ${msgType === 'success' ? '#00ff8840' : '#ff444440'}`,
                color: msgType === 'success' ? '#00ff88' : '#ff4444',
              }}>
                {msg}
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div style={{
            border: '1px solid #1a2a3a',
            borderRadius: '4px',
            padding: '20px',
            background: '#0d1117',
            maxHeight: '520px',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ color: '#00ff88', fontSize: '12px', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>▶</span> EVENT LOG
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="number" value={userId} onChange={e => setUserId(parseInt(e.target.value))}
                  style={{
                    width: '60px', padding: '4px 8px', background: '#0a0e1a',
                    border: '1px solid #1a2a3a', borderRadius: '3px', color: '#00ff88',
                    fontSize: '12px', fontFamily: 'monospace', outline: 'none', textAlign: 'center',
                  }} />
                <button onClick={fetchNotifications}
                  style={{
                    padding: '4px 12px', background: '#0a0e1a', border: '1px solid #1a2a3a',
                    borderRadius: '3px', color: '#445566', fontSize: '11px',
                    fontFamily: 'monospace', cursor: 'pointer', letterSpacing: '0.1em',
                  }}>
                  REFRESH
                </button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#1a2a3a' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>[ EMPTY ]</div>
                <div style={{ fontSize: '12px', letterSpacing: '0.1em' }}>NO EVENTS RECORDED</div>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{
                  borderLeft: `3px solid ${getStatusColor(n.status)}`,
                  padding: '10px 14px',
                  marginBottom: '8px',
                  background: `${getStatusColor(n.status)}06`,
                  borderRadius: '0 3px 3px 0',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ color: '#445566', fontSize: '11px' }}>#{String(n.id).padStart(4, '0')}</span>
                        <span style={{ color: '#ccd6f6', fontSize: '13px', fontWeight: '600' }}>{n.subject}</span>
                        <span style={{
                          fontSize: '10px', padding: '1px 6px',
                          border: `1px solid ${n.type === 'EMAIL' ? '#1a4a8a' : '#4a1a6a'}`,
                          color: n.type === 'EMAIL' ? '#4488cc' : '#aa44cc',
                          borderRadius: '2px', letterSpacing: '0.05em',
                        }}>{n.type}</span>
                      </div>
                      <div style={{ color: '#445566', fontSize: '12px', marginBottom: '4px' }}>{n.message}</div>
                      {n.retryCount > 0 && (
                        <div style={{ color: '#ff444460', fontSize: '10px', letterSpacing: '0.05em' }}>
                          RETRY_COUNT: {n.retryCount}
                        </div>
                      )}
                    </div>
                    <span style={{
                      fontSize: '11px', padding: '3px 8px', marginLeft: '12px',
                      border: `1px solid ${getStatusColor(n.status)}40`,
                      color: getStatusColor(n.status), borderRadius: '2px',
                      letterSpacing: '0.05em', whiteSpace: 'nowrap',
                      background: `${getStatusColor(n.status)}10`,
                    }}>
                      {getStatusIcon(n.status)} {n.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#1a2a3a', fontSize: '11px', letterSpacing: '0.1em' }}>
          DISTRIBUTED NOTIFICATION SYSTEM • BUILT BY SNEHA TANTY • {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
}