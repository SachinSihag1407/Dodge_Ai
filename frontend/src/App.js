import React, { useState, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './App.css';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconSidebar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);
const IconMinimize = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
    <line x1="10" y1="14" x2="3" y2="21" /><line x1="21" y1="3" x2="14" y2="10" />
  </svg>
);
const IconLayers = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
);
const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Zero-dependency Markdown renderer ───────────────────────────────────────
// Handles: **bold**, `code`, tables, bullet lists, numbered lists, paragraphs.

/** Apply inline styles: **bold** and `code` */
function renderInline(text) {
  const parts = [];
  // Split on **bold** and `code` tokens
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
  let last = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[2] !== undefined) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      parts.push(<code key={key++} className="md-inline-code">{match[3]}</code>);
    }
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Check if a line is a markdown table separator  e.g.  |---|---| */
function isTableSeparator(line) {
  return /^\|[\s\-|:]+\|$/.test(line.trim());
}

/** Parse a table block (array of raw lines) into a <table> element */
function parseTable(lines, key) {
  const rows = lines
    .filter(l => !isTableSeparator(l))
    .map(l =>
      l.trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => cell.trim())
    );

  if (rows.length === 0) return null;
  const [head, ...body] = rows;

  return (
    <div key={key} className="md-table-wrap">
      <table className="md-table">
        <thead>
          <tr>{head.map((cell, i) => <th key={i}>{renderInline(cell)}</th>)}</tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) => <td key={i}>{renderInline(cell)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Main markdown → React renderer.
 * Processes the text line-by-line, grouping into:
 *   - table blocks
 *   - bullet lists  (- item)
 *   - numbered lists (1. item)
 *   - blank-line-separated paragraphs
 */
function MarkdownMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const blocks = [];
  let i = 0;
  let keyIdx = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Table block ──────────────────────────────────────────────────────────
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push(parseTable(tableLines, `tbl-${keyIdx++}`));
      continue;
    }

    // ── Bullet list ──────────────────────────────────────────────────────────
    if (/^(\s*[-*+]\s)/.test(line)) {
      const items = [];
      while (i < lines.length && /^(\s*[-*+]\s)/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s/, '').trim());
        i++;
      }
      blocks.push(
        <ul key={`ul-${keyIdx++}`} className="md-list">
          {items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    // ── Numbered list ────────────────────────────────────────────────────────
    if (/^\s*\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s/, '').trim());
        i++;
      }
      blocks.push(
        <ol key={`ol-${keyIdx++}`} className="md-list">
          {items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
        </ol>
      );
      continue;
    }

    // ── Blank line → skip (paragraph separator) ──────────────────────────────
    if (line.trim() === '') {
      i++;
      continue;
    }

    // ── Plain paragraph ──────────────────────────────────────────────────────
    // Collect consecutive non-special lines into one <p>
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(\s*[-*+]\s)/.test(lines[i]) &&
      !/^\s*\d+\.\s/.test(lines[i]) &&
      !(lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|'))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push(
        <p key={`p-${keyIdx++}`} className="md-para">
          {renderInline(paraLines.join(' '))}
        </p>
      );
    }
  }

  return <div className="md-body">{blocks}</div>;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_VISIBLE_PROPS = 8;

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [isLoading, setIsLoading]       = useState(false);
  const [graphData, setGraphData]       = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [showOverlay, setShowOverlay]   = useState(true);
  const [openCyphers, setOpenCyphers]   = useState({});
  const messagesEndRef                  = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  const toggleCypher = (idx) =>
    setOpenCyphers((prev) => ({ ...prev, [idx]: !prev[idx] }));

  // ── Build force-graph from result rows ──────────────────────────────────────
  const processGraph = (results) => {
    if (!results || results.length === 0) {
      setGraphData({ nodes: [{ id: 'No Data', name: 'No Data', val: 5 }], links: [] });
      return;
    }
    const nodes = [];
    const links = [];
    const rootId = 'Query Results';
    nodes.push({ id: rootId, name: 'Query Results', val: 5, color: '#1d4ed8', __type: 'root' });

    results.forEach((row, idx) => {
      const rowId = `Row-${idx}`;
      nodes.push({ id: rowId, name: `Result ${idx + 1}`, val: 3, color: '#3b82f6', __type: 'row', __data: row });
      links.push({ source: rootId, target: rowId });

      Object.entries(row).forEach(([key, value]) => {
        let valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (valStr.length > 50) valStr = valStr.substring(0, 50) + '...';
        const propId = `${rowId}-${key}`;
        nodes.push({ id: propId, name: `${key}: ${valStr}`, val: 1, color: '#93c5fd', __type: 'prop', __key: key, __val: valStr, __parent: rowId });
        links.push({ source: rowId, target: propId });
      });
    });
    setGraphData({ nodes, links });
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const question = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setIsLoading(true);
    setSelectedNode(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: data.natural_language_answer || data.response || data.answer || "I didn't receive a valid response.",
          cypher: data.cypher_query,
        },
      ]);
      processGraph(data.result_data);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'error', content: 'Failed to connect to the backend. Is the server running?' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Node card ────────────────────────────────────────────────────────────────
  const renderNodeCard = () => {
    if (!selectedNode) return null;
    let props = {};
    let entityType = selectedNode.__type || 'Node';
    let connectionCount = null;

    if (selectedNode.__type === 'row' && selectedNode.__data) {
      props = selectedNode.__data;
      entityType = 'Result Row';
      connectionCount = Object.keys(props).length;
    } else if (selectedNode.__type === 'prop') {
      props = { [selectedNode.__key]: selectedNode.__val };
      entityType = 'Property';
    } else if (selectedNode.__type === 'root') {
      props = { Type: 'Query Results Root' };
      entityType = 'Root';
    } else {
      props = { Label: selectedNode.name || selectedNode.id };
    }

    const propEntries = Object.entries(props);
    const visible = propEntries.slice(0, MAX_VISIBLE_PROPS);
    const hidden  = propEntries.length - visible.length;

    return (
      <div className="node-card">
        <div className="node-card-header">
          <span className="node-card-title">{entityType}</span>
          <button className="node-card-close" onClick={() => setSelectedNode(null)}><IconClose /></button>
        </div>
        <div className="node-card-body">
          <div className="node-prop">
            <span className="node-prop-key">Entity</span>
            <span className="node-prop-value">{entityType}</span>
          </div>
          {visible.map(([k, v]) => (
            <div className="node-prop" key={k}>
              <span className="node-prop-key">{k}</span>
              <span className="node-prop-value">{String(v)}</span>
            </div>
          ))}
          {hidden > 0 && <div className="node-prop-hidden">Additional fields hidden for readability</div>}
          {connectionCount !== null && <div className="node-connections">Connections: {connectionCount}</div>}
        </div>
      </div>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="App">

      {/* TOP NAV */}
      <nav className="top-nav">
        <button className="nav-toggle" aria-label="Toggle sidebar"><IconSidebar /></button>
        <div className="nav-breadcrumb">
          <span className="nav-parent">Mapping</span>
          <span className="nav-slash">/</span>
          <span className="nav-current">Order to Cash</span>
        </div>
      </nav>

      <div className="main-content">

        {/* LEFT — GRAPH */}
        <div className="left-panel">
          <div className="graph-controls">
            <button className="control-btn" onClick={() => { setGraphData({ nodes: [], links: [] }); setSelectedNode(null); }}>
              <IconMinimize /> Minimize
            </button>
            <button className="control-btn" onClick={() => setShowOverlay(v => !v)}>
              <IconLayers /> {showOverlay ? 'Hide' : 'Show'} Granular Overlay
            </button>
          </div>

          <div className="graph-container">
            {graphData.nodes.length > 0 ? (
              <ForceGraph2D
                graphData={graphData}
                nodeLabel="name"
                nodeColor={n => n.color || '#93c5fd'}
                nodeRelSize={5}
                linkColor={() => 'rgba(147,197,253,0.55)'}
                linkWidth={1}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                linkDirectionalParticleColor={() => '#bfdbfe'}
                onNodeClick={n => setSelectedNode(n)}
                backgroundColor="#f8f9fa"
              />
            ) : (
              <div className="graph-placeholder">
                <div className="placeholder-inner">
                  <div className="placeholder-title">Graph Visualization Area</div>
                  <div className="placeholder-sub">Submit a query to see database entities and relationships mapped here.</div>
                </div>
              </div>
            )}
          </div>

          {renderNodeCard()}
        </div>

        {/* RIGHT — CHAT */}
        <div className="right-panel">

          <div className="chat-header">
            <div className="chat-header-title">Chat with Graph</div>
            <div className="chat-header-sub">Order to Cash</div>
            <div className="agent-identity">
              <div className="agent-avatar">D</div>
              <div>
                <div className="agent-info-name">Dodge AI</div>
                <div className="agent-info-role">Graph Agent</div>
              </div>
            </div>
          </div>

          <div className="messages-area">
            {/* Welcome */}
            <div className="msg-row bot-row">
              <div className="msg-avatar bot-av">D</div>
              <div className="msg-bubble bot-bubble">
                Hi! I can help you analyze the <strong>Order to Cash</strong> process.
              </div>
            </div>

            {messages.map((msg, idx) => {
              if (msg.role === 'user') {
                return (
                  <div key={idx} className="msg-row user-row">
                    <div className="msg-avatar user-av"><UserIcon /></div>
                    <div className="msg-bubble user-bubble">{msg.content}</div>
                  </div>
                );
              }
              if (msg.role === 'error') {
                return (
                  <div key={idx} className="msg-row bot-row">
                    <div className="msg-avatar bot-av">D</div>
                    <div className="msg-bubble error-bubble">{msg.content}</div>
                  </div>
                );
              }
              // bot — full markdown render
              return (
                <div key={idx} className="msg-row bot-row">
                  <div className="msg-avatar bot-av">D</div>
                  <div className="msg-bubble bot-bubble">
                    <MarkdownMessage text={msg.content} />
                    {msg.cypher && msg.cypher !== 'N/A' && (
                      <>
                        <button className="cypher-toggle" onClick={() => toggleCypher(idx)}>
                          {openCyphers[idx] ? '▲' : '▼'} View Cypher
                        </button>
                        {openCyphers[idx] && (
                          <div className="cypher-code"><pre>{msg.cypher}</pre></div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="msg-row bot-row">
                <div className="msg-avatar bot-av">D</div>
                <div className="msg-bubble bot-bubble">
                  <div className="loading-dots">
                    <span className="dot" /><span className="dot" /><span className="dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="input-section">
            <div className="status-row">
              <span className="status-dot" />
              <span className="status-label">Dodge AI is awaiting instructions</span>
            </div>
            <form className="input-row" onSubmit={handleSubmit}>
              <input
                className="chat-input"
                type="text"
                placeholder="Analyze anything"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button className="send-btn" type="submit" disabled={isLoading}>Send</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;