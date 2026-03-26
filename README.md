<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SAP O2C — Graph DB + LLM Interface</title>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #16161f;
    --border: #1e1e2e;
    --border2: #252535;
    --accent: #6c63ff;
    --accent2: #a78bfa;
    --accent3: #38bdf8;
    --green: #34d399;
    --red: #f87171;
    --yellow: #fbbf24;
    --text: #e2e8f0;
    --text2: #94a3b8;
    --text3: #64748b;
    --code-bg: #0d0d14;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-weight: 300;
    line-height: 1.7;
    font-size: 15px;
  }

  /* Background grid */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(108, 99, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(108, 99, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .wrapper {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 32px 100px;
    position: relative;
    z-index: 1;
  }

  /* ── HERO ── */
  .hero {
    padding: 80px 0 60px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 64px;
  }

  .badge-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }

  .badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 4px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .badge-purple { background: rgba(108,99,255,0.15); color: var(--accent2); border: 1px solid rgba(108,99,255,0.3); }
  .badge-blue   { background: rgba(56,189,248,0.1);  color: var(--accent3); border: 1px solid rgba(56,189,248,0.25); }
  .badge-green  { background: rgba(52,211,153,0.1);  color: var(--green);   border: 1px solid rgba(52,211,153,0.25); }
  .badge-yellow { background: rgba(251,191,36,0.1);  color: var(--yellow);  border: 1px solid rgba(251,191,36,0.25); }

  h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
  }

  h1 span.grad {
    background: linear-gradient(135deg, var(--accent2), var(--accent3));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    font-size: 17px;
    color: var(--text2);
    max-width: 620px;
    line-height: 1.6;
    margin-bottom: 36px;
  }

  .hero-stats {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 800;
    color: var(--accent2);
  }

  .stat-label {
    font-size: 12px;
    color: var(--text3);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* ── TOC ── */
  .toc {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px 32px;
    margin-bottom: 64px;
  }

  .toc-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--text3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .toc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 32px;
  }

  .toc a {
    color: var(--text2);
    text-decoration: none;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 0;
    transition: color 0.2s;
  }

  .toc a:hover { color: var(--accent2); }

  .toc-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text3);
    min-width: 20px;
  }

  /* ── SECTIONS ── */
  section {
    margin-bottom: 72px;
    scroll-margin-top: 32px;
  }

  h2 {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-bottom: 24px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  h2 .icon {
    width: 32px;
    height: 32px;
    background: rgba(108,99,255,0.12);
    border: 1px solid rgba(108,99,255,0.25);
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  h3 {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    margin: 32px 0 12px;
  }

  p { color: var(--text2); margin-bottom: 14px; }

  a { color: var(--accent2); text-decoration: none; }
  a:hover { text-decoration: underline; }

  /* ── CARDS ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 24px;
    margin-bottom: 16px;
  }

  .card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 600px) {
    .card-grid { grid-template-columns: 1fr; }
    .toc-grid  { grid-template-columns: 1fr; }
  }

  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
  }

  .feature-card .fc-icon {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .feature-card h4 {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 6px;
    color: var(--text);
  }

  .feature-card p {
    font-size: 13px;
    color: var(--text3);
    margin: 0;
    line-height: 1.5;
  }

  /* ── CODE ── */
  pre, code {
    font-family: 'JetBrains Mono', monospace;
  }

  code {
    font-size: 12.5px;
    background: rgba(108,99,255,0.1);
    color: var(--accent2);
    padding: 2px 7px;
    border-radius: 4px;
    border: 1px solid rgba(108,99,255,0.2);
  }

  .code-block {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    margin: 16px 0;
  }

  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
  }

  .code-lang {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: var(--text3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .code-dots {
    display: flex;
    gap: 6px;
  }

  .code-dots span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .dot-r { background: #f87171; }
  .dot-y { background: #fbbf24; }
  .dot-g { background: #34d399; }

  pre {
    padding: 20px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.65;
    color: #c9d1d9;
  }

  /* Syntax colours */
  .kw  { color: #c792ea; }
  .str { color: #c3e88d; }
  .cm  { color: #546e7a; font-style: italic; }
  .fn  { color: #82aaff; }
  .var { color: #f07178; }
  .num { color: #f78c6c; }
  .op  { color: #89ddff; }

  /* ── ENV FILE BOX ── */
  .env-box {
    background: var(--code-bg);
    border: 1px solid rgba(52,211,153,0.25);
    border-radius: 10px;
    overflow: hidden;
    margin: 16px 0;
  }

  .env-header {
    background: rgba(52,211,153,0.06);
    border-bottom: 1px solid rgba(52,211,153,0.2);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .env-header span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--green);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .env-dot {
    width: 8px; height: 8px;
    background: var(--green);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--green);
  }

  .env-body {
    padding: 18px 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 2;
  }

  .env-comment { color: #546e7a; }
  .env-key     { color: var(--accent3); }
  .env-eq      { color: var(--text3); }
  .env-val     { color: #c3e88d; }
  .env-placeholder { color: var(--text3); font-style: italic; }

  .warning-box {
    background: rgba(251,191,36,0.06);
    border: 1px solid rgba(251,191,36,0.25);
    border-radius: 8px;
    padding: 14px 18px;
    margin: 16px 0;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    font-size: 13.5px;
    color: var(--text2);
  }

  .warning-box .wi { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

  /* ── TABLE ── */
  .table-wrap { overflow-x: auto; margin: 16px 0; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }

  thead th {
    background: var(--surface2);
    color: var(--text3);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }

  tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }

  tbody tr:hover { background: var(--surface2); }
  tbody tr:last-child { border-bottom: none; }

  td {
    padding: 12px 16px;
    color: var(--text2);
    vertical-align: top;
  }

  td:first-child { color: var(--text); }

  /* ── FLOW DIAGRAM ── */
  .flow {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 20px 0;
  }

  .flow-step {
    display: flex;
    align-items: flex-start;
    gap: 0;
  }

  .flow-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40px;
    flex-shrink: 0;
  }

  .flow-node {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
    border: 2px solid;
  }

  .flow-node.purple { background: rgba(108,99,255,0.15); border-color: var(--accent); color: var(--accent2); }
  .flow-node.blue   { background: rgba(56,189,248,0.1);  border-color: var(--accent3); color: var(--accent3); }
  .flow-node.green  { background: rgba(52,211,153,0.1);  border-color: var(--green);   color: var(--green); }
  .flow-node.yellow { background: rgba(251,191,36,0.1);  border-color: var(--yellow);  color: var(--yellow); }
  .flow-node.red    { background: rgba(248,113,113,0.1); border-color: var(--red);     color: var(--red); }

  .flow-line {
    width: 2px;
    flex: 1;
    min-height: 20px;
    background: linear-gradient(to bottom, var(--border2), transparent);
    margin: 2px auto;
  }

  .flow-content {
    padding: 6px 0 24px 16px;
    flex: 1;
  }

  .flow-title {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }

  .flow-desc {
    font-size: 13px;
    color: var(--text3);
    line-height: 1.5;
  }

  /* ── GUARDRAILS ── */
  .guardrail {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 24px;
    margin-bottom: 14px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .gr-num {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .gr-num.g1 { background: rgba(108,99,255,0.15); color: var(--accent2); }
  .gr-num.g2 { background: rgba(56,189,248,0.12); color: var(--accent3); }
  .gr-num.g3 { background: rgba(52,211,153,0.12); color: var(--green); }

  .gr-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .gr-desc {
    font-size: 13.5px;
    color: var(--text2);
    line-height: 1.6;
  }

  .gr-quote {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--text3);
    background: var(--code-bg);
    border-left: 3px solid var(--border2);
    padding: 8px 12px;
    border-radius: 0 6px 6px 0;
    margin-top: 10px;
    font-style: italic;
  }

  /* ── QUERIES ── */
  .query-section { margin-bottom: 24px; }

  .query-section h3 { margin-top: 24px; margin-bottom: 12px; }

  .query-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .query-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
    color: var(--text2);
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .query-item::before {
    content: '›';
    color: var(--accent);
    font-size: 16px;
    line-height: 1;
    flex-shrink: 0;
  }

  .query-item.blocked {
    border-color: rgba(248,113,113,0.2);
    background: rgba(248,113,113,0.04);
  }

  .query-item.blocked::before { content: '✕'; color: var(--red); font-size: 12px; }

  /* ── STEPS (numbered) ── */
  .steps { counter-reset: step; display: flex; flex-direction: column; gap: 16px; }

  .step {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .step-num {
    counter-increment: step;
    width: 28px;
    height: 28px;
    background: rgba(108,99,255,0.12);
    border: 1px solid rgba(108,99,255,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--accent2);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .step-num::before { content: counter(step); }

  .step-body {
    flex: 1;
    font-size: 14px;
    color: var(--text2);
    padding-top: 3px;
  }

  /* ── TERMINAL ── */
  .terminal {
    background: #0d0d14;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    margin: 16px 0;
  }

  .terminal-bar {
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .terminal-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text3);
    margin-left: 4px;
  }

  .terminal pre {
    padding: 18px 20px;
    color: #c9d1d9;
    font-size: 13px;
    line-height: 1.7;
  }

  .t-prompt { color: var(--green); }
  .t-cmd    { color: var(--text); }
  .t-out    { color: var(--text3); }
  .t-ok     { color: var(--green); }

  /* ── DIVIDER ── */
  .divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 56px 0;
  }

  /* ── FOOTER ── */
  footer {
    text-align: center;
    padding: 40px 0;
    border-top: 1px solid var(--border);
    font-size: 12px;
    color: var(--text3);
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── SCHEMA GRAPH ── */
  .schema-visual {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 32px;
    margin: 20px 0;
    display: flex;
    justify-content: center;
    overflow-x: auto;
  }

  .schema-visual svg { max-width: 100%; }
</style>
</head>
<body>
<div class="wrapper">

  <!-- ═══════════════ HERO ═══════════════ -->
  <div class="hero">
    <div class="badge-row">
      <span class="badge badge-purple">Neo4j</span>
      <span class="badge badge-blue">FastAPI</span>
      <span class="badge badge-green">Groq LLM</span>
      <span class="badge badge-yellow">React</span>
    </div>
    <h1>SAP O2C <span class="grad">Graph DB</span><br>+ LLM Interface</h1>
    <p class="hero-sub">A production-ready pipeline that ingests SAP Order-to-Cash data into a Neo4j graph, then lets users query it in plain English — zero hallucination, full guardrails.</p>
    <div class="hero-stats">
      <div class="stat"><span class="stat-val">4</span><span class="stat-label">Node Types</span></div>
      <div class="stat"><span class="stat-val">4</span><span class="stat-label">Relationships</span></div>
      <div class="stat"><span class="stat-val">3</span><span class="stat-label">Safety Guardrails</span></div>
      <div class="stat"><span class="stat-val">6</span><span class="stat-label">Data Sources</span></div>
    </div>
  </div>

  <!-- ═══════════════ TOC ═══════════════ -->
  <div class="toc">
    <div class="toc-title">// Table of Contents</div>
    <div class="toc-grid">
      <a href="#overview"><span class="toc-num">01</span> Project Overview</a>
      <a href="#stack"><span class="toc-num">02</span> Tech Stack</a>
      <a href="#structure"><span class="toc-num">03</span> Project Structure</a>
      <a href="#prereqs"><span class="toc-num">04</span> Prerequisites</a>
      <a href="#setup"><span class="toc-num">05</span> Setup & Installation</a>
      <a href="#env"><span class="toc-num">06</span> Environment Variables</a>
      <a href="#ingestion"><span class="toc-num">07</span> Data Ingestion</a>
      <a href="#run"><span class="toc-num">08</span> Running the App</a>
      <a href="#flow"><span class="toc-num">09</span> End-to-End Flow</a>
      <a href="#schema"><span class="toc-num">10</span> Graph Schema</a>
      <a href="#api"><span class="toc-num">11</span> API Reference</a>
      <a href="#guardrails"><span class="toc-num">12</span> Guardrails & Safety</a>
      <a href="#queries"><span class="toc-num">13</span> Sample Queries</a>
      <a href="#deploy"><span class="toc-num">14</span> Deployment</a>
      <a href="#troubleshoot"><span class="toc-num">15</span> Troubleshooting</a>
    </div>
  </div>

  <!-- ═══════════════ 01 OVERVIEW ═══════════════ -->
  <section id="overview">
    <h2><span class="icon">🗺</span> Project Overview</h2>
    <p>This system solves a core enterprise problem: SAP O2C data lives in fragmented tables — orders, customers, products, invoices — that are hard to relate and even harder to query. This project converts all of that into a <strong>graph</strong>, then wraps an LLM on top so anyone can ask questions in plain English.</p>

    <div class="card-grid">
      <div class="feature-card">
        <div class="fc-icon">🔗</div>
        <h4>Natural Language → Cypher</h4>
        <p>User questions are translated into Cypher graph queries by the LLM, then executed directly against Neo4j.</p>
      </div>
      <div class="feature-card">
        <div class="fc-icon">🛡</div>
        <h4>No Hallucination</h4>
        <p>Answers come strictly from Neo4j query results. If the DB returns nothing, the LLM is never called.</p>
      </div>
      <div class="feature-card">
        <div class="fc-icon">🚫</div>
        <h4>Domain Guardrails</h4>
        <p>Off-topic questions are rejected before any Cypher is generated. Mutation queries are blocked at the syntax level.</p>
      </div>
      <div class="feature-card">
        <div class="fc-icon">📊</div>
        <h4>Live Graph Visualization</h4>
        <p>Query results render as an interactive force-directed graph in the left panel. Click nodes to inspect details.</p>
      </div>
    </div>
  </section>

  <!-- ═══════════════ 02 TECH STACK ═══════════════ -->
  <section id="stack">
    <h2><span class="icon">⚙</span> Tech Stack</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Layer</th><th>Technology</th><th>Reasoning</th></tr>
        </thead>
        <tbody>
          <tr><td>Graph Database</td><td><code>Neo4j</code></td><td>Persistent, Cypher-queryable, proven Text2Cypher pattern with LLMs</td></tr>
          <tr><td>Backend</td><td><code>FastAPI</code> (Python)</td><td>Natively async — ideal for non-blocking Groq API calls; no SQL ORM bloat</td></tr>
          <tr><td>LLM</td><td><code>openai/gpt-oss-120b</code> via Groq</td><td>High throughput, low latency inference</td></tr>
          <tr><td>Frontend</td><td><code>React</code></td><td>Component-based, hot-reload dev experience</td></tr>
          <tr><td>Graph Viz</td><td><code>react-force-graph-2d</code></td><td>WebGL-accelerated, interactive force-directed layout</td></tr>
        </tbody>
      </table>
    </div>
    <div class="warning-box">
      <span class="wi">💡</span>
      <span><strong>Why not NetworkX?</strong> NetworkX is purely in-memory with no native query language. To do Text-to-Graph, the LLM must output code that interfaces with the graph — generating Cypher is safe and well-established. Having an LLM generate arbitrary NetworkX Python code that then executes on a server is a major security risk.</span>
    </div>
  </section>

  <!-- ═══════════════ 03 STRUCTURE ═══════════════ -->
  <section id="structure">
    <h2><span class="icon">📁</span> Project Structure</h2>
    <div class="code-block">
      <div class="code-header">
        <span class="code-lang">directory tree</span>
        <div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div>
      </div>
      <pre>sachin_assignment_2/
├── sap-o2c-data/                    <span class="cm"># Raw JSONL dataset (6 entity types)</span>
│   ├── business_partners/
│   ├── products/
│   ├── sales_order_headers/
│   ├── sales_order_items/
│   ├── billing_document_headers/
│   └── billing_document_items/
│
├── backend/
│   ├── ingest.py                    <span class="cm"># JSONL → Neo4j  (batch MERGE + UNWIND)</span>
│   ├── llm_agent.py                 <span class="cm"># Groq: domain check + Cypher gen + answer</span>
│   ├── main.py                      <span class="cm"># FastAPI app — orchestrates full pipeline</span>
│   ├── requirements.txt
│   └── .env                         <span class="cm"># ← secrets live here, NEVER commit</span>
│
├── frontend/
│   ├── src/
│   │   ├── App.js                   <span class="cm"># Two-panel layout (graph + chat)</span>
│   │   └── App.css
│   └── package.json
│
├── docker-compose.yml               <span class="cm"># Optional full-stack Docker deploy</span>
├── Dockerfile.backend
└── Dockerfile.frontend</pre>
    </div>
  </section>

  <!-- ═══════════════ 04 PREREQS ═══════════════ -->
  <section id="prereqs">
    <h2><span class="icon">📋</span> Prerequisites</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Tool</th><th>Version</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td>Python</td><td>3.9+</td><td>Backend runtime</td></tr>
          <tr><td>Node.js + npm</td><td>18+</td><td>Frontend build & dev server</td></tr>
          <tr><td>Docker</td><td>any</td><td>Run Neo4j locally (recommended)</td></tr>
          <tr><td>Groq API Key</td><td>—</td><td>Free at <a href="https://console.groq.com" target="_blank">console.groq.com</a></td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- ═══════════════ 05 SETUP ═══════════════ -->
  <section id="setup">
    <h2><span class="icon">🚀</span> Setup & Installation</h2>

    <h3>Step 1 — Start Neo4j</h3>
    <p>The quickest way is Docker. Run this once:</p>
    <div class="code-block">
      <div class="code-header"><span class="code-lang">bash</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
      <pre><span class="fn">docker</span> <span class="kw">run</span> \
  --name testneo4j \
  -p <span class="num">7474</span>:<span class="num">7474</span> -p <span class="num">7687</span>:<span class="num">7687</span> \
  -e NEO4J_AUTH=<span class="str">neo4j/password</span> \
  neo4j:latest</pre>
    </div>
    <p>Neo4j browser → <code>http://localhost:7474</code> &nbsp;|&nbsp; Bolt port → <code>7687</code><br>To stop/restart: <code>docker stop testneo4j</code> / <code>docker start testneo4j</code></p>

    <h3>Step 2 — Backend</h3>
    <div class="code-block">
      <div class="code-header"><span class="code-lang">bash</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
      <pre><span class="cm"># From the project root</span>
python3 -m venv .venv
<span class="fn">source</span> .venv/bin/activate        <span class="cm"># Windows: .venv\Scripts\activate</span>
pip install -r backend/requirements.txt</pre>
    </div>

    <h3>Step 3 — Frontend</h3>
    <div class="code-block">
      <div class="code-header"><span class="code-lang">bash</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
      <pre><span class="fn">cd</span> frontend
npm install</pre>
    </div>
  </section>

  <!-- ═══════════════ 06 ENV VARS ═══════════════ -->
  <section id="env">
    <h2><span class="icon">🔑</span> Environment Variables</h2>
    <p>Create a file at <code>backend/.env</code> with all of the following variables. This file is read by both <code>ingest.py</code> and <code>main.py</code> at startup.</p>

    <div class="env-box">
      <div class="env-header">
        <div class="env-dot"></div>
        <span>backend/.env</span>
      </div>
      <div class="env-body">
        <span class="env-comment"># ── Groq LLM ────────────────────────────────────────</span><br>
        <span class="env-key">GROQ_API_KEY</span><span class="env-eq">=</span><span class="env-placeholder">gsk_your_actual_groq_api_key_here</span><br>
        <br>
        <span class="env-comment"># ── Neo4j Connection ─────────────────────────────────</span><br>
        <span class="env-key">NEO4J_URI</span><span class="env-eq">=</span><span class="env-val">bolt://localhost:7687</span><br>
        <span class="env-key">NEO4J_USERNAME</span><span class="env-eq">=</span><span class="env-val">neo4j</span><br>
        <span class="env-key">NEO4J_PASSWORD</span><span class="env-eq">=</span><span class="env-val">password</span><br>
        <br>
        <span class="env-comment"># ── Frontend (only needed for production build) ───────</span><br>
        <span class="env-key">REACT_APP_API_URL</span><span class="env-eq">=</span><span class="env-val">http://localhost:8000</span>
      </div>
    </div>

    <div class="warning-box">
      <span class="wi">⚠️</span>
      <span><strong>Never commit .env to Git.</strong> Add <code>backend/.env</code> to your <code>.gitignore</code>. It holds your Groq API key and database credentials.</span>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th>Variable</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>GROQ_API_KEY</code></td><td>—</td><td>Your Groq API key (required)</td></tr>
          <tr><td><code>NEO4J_URI</code></td><td><code>bolt://localhost:7687</code></td><td>Bolt URI for Neo4j instance</td></tr>
          <tr><td><code>NEO4J_USERNAME</code></td><td><code>neo4j</code></td><td>Neo4j database username</td></tr>
          <tr><td><code>NEO4J_PASSWORD</code></td><td><code>password</code></td><td>Neo4j database password</td></tr>
          <tr><td><code>REACT_APP_API_URL</code></td><td><code>http://localhost:8000</code></td><td>Backend URL used by the React app</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- ═══════════════ 07 INGESTION ═══════════════ -->
  <section id="ingestion">
    <h2><span class="icon">⚡</span> Data Ingestion</h2>
    <p>Before querying, load the JSONL dataset into Neo4j. Make sure Neo4j is running, then:</p>
    <div class="code-block">
      <div class="code-header"><span class="code-lang">bash</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
      <pre><span class="cm"># From the project root (not from inside /backend)</span>
<span class="fn">source</span> .venv/bin/activate
python backend/ingest.py</pre>
    </div>

    <div class="terminal">
      <div class="terminal-bar">
        <span class="dot-r" style="width:10px;height:10px;border-radius:50%;display:inline-block;"></span>
        <span class="dot-y" style="width:10px;height:10px;border-radius:50%;display:inline-block;margin:0 4px;"></span>
        <span class="dot-g" style="width:10px;height:10px;border-radius:50%;display:inline-block;"></span>
        <span class="terminal-title">Expected output</span>
      </div>
      <pre><span class="t-out">Setting up Neo4j constraints...</span>
<span class="t-ok">Constraints set successfully.</span>
<span class="t-out">Found 1 files in business_partners. Ingesting...</span>
<span class="t-ok">Completed business_partners.</span>
<span class="t-out">Found 2 files in products. Ingesting...</span>
<span class="t-ok">Completed products.</span>
<span class="t-out">Found 1 files in sales_order_headers. Ingesting...</span>
<span class="t-ok">Completed sales_order_headers.</span>
<span class="t-out">Found 2 files in billing_document_headers. Ingesting...</span>
<span class="t-ok">Completed billing_document_headers.</span>
<span class="t-out">Found 2 files in sales_order_items + billing_document_items...</span>
<span class="t-ok">Data ingestion complete!</span></pre>
    </div>

    <h3>How ingestion works</h3>
    <div class="steps">
      <div class="step"><div class="step-num"></div><div class="step-body">Creates <strong>uniqueness constraints</strong> on all node IDs before any data is inserted — speeds up <code>MERGE</code> by building indexes upfront.</div></div>
      <div class="step"><div class="step-num"></div><div class="step-body">Reads each JSONL file using a <strong>generator in batches of 2000 lines</strong> — RAM usage stays flat regardless of file size.</div></div>
      <div class="step"><div class="step-num"></div><div class="step-body">Sends each batch as a single <code>UNWIND $batch</code> Cypher command — 2000 objects in one network round-trip instead of 2000 individual queries.</div></div>
      <div class="step"><div class="step-num"></div><div class="step-body">Uses <code>MERGE</code> everywhere (not <code>CREATE</code>) — re-running is safe. Creates <strong>placeholder nodes</strong> for relationships when the related entity hasn't been ingested yet; those get filled in automatically when the correct file is processed later.</div></div>
    </div>
  </section>

  <!-- ═══════════════ 08 RUNNING ═══════════════ -->
  <section id="run">
    <h2><span class="icon">▶</span> Running the Application</h2>
    <p>You need three things running simultaneously — open three separate terminal windows:</p>

    <h3>Terminal 1 — Neo4j</h3>
    <div class="code-block">
      <div class="code-header"><span class="code-lang">bash</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
      <pre>docker start testneo4j</pre>
    </div>

    <h3>Terminal 2 — FastAPI Backend</h3>
    <div class="code-block">
      <div class="code-header"><span class="code-lang">bash</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
      <pre><span class="fn">cd</span> sachin_assignment_2
<span class="fn">source</span> .venv/bin/activate
<span class="fn">cd</span> backend
uvicorn main:app --reload</pre>
    </div>
    <p>API → <code>http://localhost:8000</code> &nbsp;|&nbsp; Swagger docs → <code>http://localhost:8000/docs</code></p>

    <h3>Terminal 3 — React Frontend</h3>
    <div class="code-block">
      <div class="code-header"><span class="code-lang">bash</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
      <pre><span class="fn">cd</span> sachin_assignment_2/frontend
npm start</pre>
    </div>
    <p>UI opens automatically at <code>http://localhost:3000</code></p>
  </section>

  <!-- ═══════════════ 09 FLOW ═══════════════ -->
  <section id="flow">
    <h2><span class="icon">🔄</span> End-to-End Flow</h2>
    <div class="flow">
      <div class="flow-step">
        <div class="flow-left"><div class="flow-node purple">1</div><div class="flow-line"></div></div>
        <div class="flow-content"><div class="flow-title">User types a question</div><div class="flow-desc">React UI sends <code>POST /api/query</code> with <code>{ "question": "..." }</code></div></div>
      </div>
      <div class="flow-step">
        <div class="flow-left"><div class="flow-node yellow">2</div><div class="flow-line"></div></div>
        <div class="flow-content"><div class="flow-title">Guardrail 1 — Domain Relevance Check</div><div class="flow-desc">A lightweight Groq call checks if the question is O2C-related. Off-topic questions are rejected immediately with a fallback message.</div></div>
      </div>
      <div class="flow-step">
        <div class="flow-left"><div class="flow-node purple">3</div><div class="flow-line"></div></div>
        <div class="flow-content"><div class="flow-title">LLM generates Cypher query</div><div class="flow-desc">The question + full graph schema is sent to <code>gpt-oss-120b</code> via Groq. The LLM returns a Cypher query.</div></div>
      </div>
      <div class="flow-step">
        <div class="flow-left"><div class="flow-node red">4</div><div class="flow-line"></div></div>
        <div class="flow-content"><div class="flow-title">Guardrail 2 — Cypher Safety Validation</div><div class="flow-desc">The Cypher is lexically checked. Must contain <code>MATCH</code>. Must NOT contain <code>DELETE</code>, <code>DROP</code>, <code>CREATE</code>, <code>SET</code>, etc.</div></div>
      </div>
      <div class="flow-step">
        <div class="flow-left"><div class="flow-node blue">5</div><div class="flow-line"></div></div>
        <div class="flow-content"><div class="flow-title">Execute against Neo4j</div><div class="flow-desc">The query runs against the graph database. Results are returned as JSON rows.</div></div>
      </div>
      <div class="flow-step">
        <div class="flow-left"><div class="flow-node green">6</div><div class="flow-line"></div></div>
        <div class="flow-content"><div class="flow-title">Guardrail 3 — Empty Result Check</div><div class="flow-desc">If Neo4j returns <code>[]</code>, the LLM is never called. Returns "no data found" immediately.</div></div>
      </div>
      <div class="flow-step">
        <div class="flow-left"><div class="flow-node purple">7</div><div class="flow-line" style="background:none;"></div></div>
        <div class="flow-content"><div class="flow-title">Natural language answer returned</div><div class="flow-desc">LLM converts the Neo4j JSON result into a readable answer. Response: <code>{ cypher_query, result_data, natural_language_answer }</code></div></div>
      </div>
    </div>
  </section>

  <!-- ═══════════════ 10 SCHEMA ═══════════════ -->
  <section id="schema">
    <h2><span class="icon">🕸</span> Graph Schema</h2>

    <h3>Nodes</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Label</th><th>Source File</th><th>ID Field</th><th>Key Properties</th></tr></thead>
        <tbody>
          <tr><td><code>Customer</code></td><td>business_partners/*.jsonl</td><td><code>businessPartner</code></td><td>name, category, industry</td></tr>
          <tr><td><code>Product</code></td><td>products/*.jsonl</td><td><code>product</code></td><td>type, group, weight</td></tr>
          <tr><td><code>SalesOrder</code></td><td>sales_order_headers/*.jsonl</td><td><code>salesOrder</code></td><td>type, netAmount, currency, date, status</td></tr>
          <tr><td><code>BillingDocument</code></td><td>billing_document_headers/*.jsonl</td><td><code>billingDocument</code></td><td>type, netAmount, currency, date</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Relationships</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Relationship</th><th>Direction</th><th>Source Field</th></tr></thead>
        <tbody>
          <tr><td><code>[:PLACED]</code></td><td>Customer → SalesOrder</td><td>soldToParty in sales_order_headers</td></tr>
          <tr><td><code>[:CONTAINS]</code></td><td>SalesOrder → Product</td><td>material in sales_order_items</td></tr>
          <tr><td><code>[:BILLS]</code></td><td>BillingDocument → Customer</td><td>soldToParty in billing_document_headers</td></tr>
          <tr><td><code>[:REFERENCES]</code></td><td>BillingDocument → SalesOrder</td><td>referenceSdDocument in billing_document_items</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Example Cypher Traversal</h3>
    <div class="code-block">
      <div class="code-header"><span class="code-lang">cypher</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
      <pre><span class="cm">// Trace customers → orders → billing docs in one query</span>
<span class="kw">MATCH</span> (c:Customer)-[:PLACED]->(o:SalesOrder)<-[:REFERENCES]-(b:BillingDocument)
<span class="kw">RETURN</span> c.name, o.id, b.id, b.netAmount
<span class="kw">LIMIT</span> <span class="num">10</span></pre>
    </div>
  </section>

  <!-- ═══════════════ 11 API ═══════════════ -->
  <section id="api">
    <h2><span class="icon">🔌</span> API Reference</h2>

    <div class="card">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
        <span class="badge badge-green">POST</span>
        <code style="font-size:15px;">/api/query</code>
      </div>

      <h3 style="margin-top:0;">Request body</h3>
      <div class="code-block">
        <div class="code-header"><span class="code-lang">json</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
        <pre>{
  <span class="str">"question"</span>: <span class="str">"Which customers have placed sales orders?"</span>
}</pre>
      </div>

      <h3>Success response <span style="color:var(--green);font-family:'JetBrains Mono',monospace;font-size:13px;margin-left:8px;">200</span></h3>
      <div class="code-block">
        <div class="code-header"><span class="code-lang">json</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
        <pre>{
  <span class="str">"cypher_query"</span>: <span class="str">"MATCH (c:Customer)-[:PLACED]->(so:SalesOrder) RETURN c.name LIMIT 10"</span>,
  <span class="str">"result_data"</span>: [
    { <span class="str">"c.name"</span>: <span class="str">"Cardenas, Parker and Avila"</span> },
    { <span class="str">"c.name"</span>: <span class="str">"Bradley-Kelley"</span> }
  ],
  <span class="str">"natural_language_answer"</span>: <span class="str">"The following customers have placed sales orders: ..."</span>
}</pre>
      </div>

      <h3>Error codes</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Code</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>400</code></td><td>Query rejected — off-topic, unsafe Cypher, or no data returned</td></tr>
            <tr><td><code>422</code></td><td>Malformed body — make sure the key is <code>"question"</code>, not <code>"query"</code></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ═══════════════ 12 GUARDRAILS ═══════════════ -->
  <section id="guardrails">
    <h2><span class="icon">🛡</span> Guardrails & Safety</h2>

    <div class="guardrail">
      <div class="gr-num g1">G1</div>
      <div>
        <div class="gr-title">Domain Relevance Check</div>
        <div class="gr-desc">Every question is routed through a lightweight LLM call that returns <code>YES</code> or <code>NO</code> based on whether it relates to O2C entities — before any Cypher is generated. Unrelated questions are rejected instantly.</div>
        <div class="gr-quote">"I am an AI assistant specifically built to query this SAP Order-to-Cash dataset. I cannot answer general knowledge or unrelated questions."</div>
      </div>
    </div>

    <div class="guardrail">
      <div class="gr-num g2">G2</div>
      <div>
        <div class="gr-title">Cypher Safety Validation</div>
        <div class="gr-desc">The generated Cypher is checked lexically before any database call is made. Blocked keywords: <code>DELETE</code>, <code>DETACH</code>, <code>REMOVE</code>, <code>SET</code>, <code>CREATE</code>, <code>DROP</code>. The query must also contain <code>MATCH</code> — otherwise it's rejected as invalid.</div>
      </div>
    </div>

    <div class="guardrail">
      <div class="gr-num g3">G3</div>
      <div>
        <div class="gr-title">Anti-Hallucination (Empty Result Guard)</div>
        <div class="gr-desc">If Neo4j returns an empty result set <code>[]</code>, the summarisation LLM call is skipped entirely. The system returns a hardcoded response instead of letting the LLM invent an answer.</div>
        <div class="gr-quote">"I could not find any data matching your request."</div>
      </div>
    </div>
  </section>

  <!-- ═══════════════ 13 QUERIES ═══════════════ -->
  <section id="queries">
    <h2><span class="icon">💬</span> Sample Queries to Test</h2>

    <div class="query-section">
      <h3>Basic — single node lookups</h3>
      <div class="query-list">
        <div class="query-item">Show me 5 products in the database.</div>
        <div class="query-item">What are the different types of products available?</div>
        <div class="query-item">List 5 sales orders in the system.</div>
        <div class="query-item">Show me a few billing documents.</div>
      </div>
    </div>

    <div class="query-section">
      <h3>Intermediate — one-hop relationships</h3>
      <div class="query-list">
        <div class="query-item">Which customers have placed a sales order?</div>
        <div class="query-item">Show me the products contained in the latest sales orders.</div>
        <div class="query-item">What billing documents are associated with our customers?</div>
      </div>
    </div>

    <div class="query-section">
      <h3>Advanced — multi-hop traversals</h3>
      <div class="query-list">
        <div class="query-item">Which top 3 customers have the highest total net amount across all their billed documents that reference a sales order?</div>
        <div class="query-item">List the names of customers who have placed sales orders containing products of type 'FERT'.</div>
        <div class="query-item">Show me IDs of sales orders that have been placed but do not have any associated billing documents referencing them.</div>
        <div class="query-item">Find a sales order containing a product with weight greater than 10. Return the order ID, the customer's name, and the billing document ID.</div>
      </div>
    </div>

    <div class="query-section">
      <h3>Guardrail tests — these should be blocked</h3>
      <div class="query-list">
        <div class="query-item blocked">What is the capital of France? — off-topic, rejected by G1</div>
        <div class="query-item blocked">Delete all nodes in the database. — blocked by G2 (mutation keyword)</div>
      </div>
    </div>
  </section>

  <!-- ═══════════════ 14 DEPLOY ═══════════════ -->
  <section id="deploy">
    <h2><span class="icon">☁</span> Deployment (Without Docker)</h2>

    <h3>Option A — Cloud (Free tier, recommended)</h3>

    <div class="card" style="margin-bottom:16px;">
      <div style="font-family:'Syne',sans-serif;font-weight:700;margin-bottom:10px;">Backend → Render.com</div>
      <div class="steps">
        <div class="step"><div class="step-num"></div><div class="step-body">Push <code>backend/</code> to a GitHub repo</div></div>
        <div class="step"><div class="step-num"></div><div class="step-body">Create a new Web Service on Render, root directory = <code>backend/</code></div></div>
        <div class="step"><div class="step-num"></div><div class="step-body">Start command: <code>uvicorn main:app --host 0.0.0.0 --port $PORT</code></div></div>
        <div class="step"><div class="step-num"></div><div class="step-body">Add all env vars from your <code>.env</code> — point <code>NEO4J_URI</code> to a cloud Neo4j AuraDB instance</div></div>
        <div class="step"><div class="step-num"></div><div class="step-body">Render gives you a URL like <code>https://your-app.onrender.com</code></div></div>
      </div>
    </div>

    <div class="card">
      <div style="font-family:'Syne',sans-serif;font-weight:700;margin-bottom:10px;">Frontend → Vercel.com</div>
      <div class="steps">
        <div class="step"><div class="step-num"></div><div class="step-body">Push <code>frontend/</code> to GitHub</div></div>
        <div class="step"><div class="step-num"></div><div class="step-body">Import on Vercel, root = <code>frontend/</code></div></div>
        <div class="step"><div class="step-num"></div><div class="step-body">Add env var: <code>REACT_APP_API_URL=https://your-app.onrender.com</code></div></div>
        <div class="step"><div class="step-num"></div><div class="step-body">Deploy — Vercel auto-detects React and runs <code>npm run build</code></div></div>
      </div>
    </div>

    <h3>Option B — VPS / Linux Server</h3>
    <div class="code-block">
      <div class="code-header"><span class="code-lang">bash — backend</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
      <pre>git clone &lt;your-repo&gt; &amp;&amp; cd backend
python3 -m venv .venv &amp;&amp; source .venv/bin/activate
pip install -r requirements.txt gunicorn
<span class="cm"># Create .env with all your keys</span>
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000 --daemon</pre>
    </div>
    <div class="code-block">
      <div class="code-header"><span class="code-lang">bash — frontend</span><div class="code-dots"><span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span></div></div>
      <pre>cd frontend
npm install
export REACT_APP_API_URL="http://&lt;YOUR_SERVER_IP&gt;:8000"
npm run build
sudo cp -r build/* /var/www/html/
sudo systemctl restart nginx</pre>
    </div>
  </section>

  <!-- ═══════════════ 15 TROUBLESHOOT ═══════════════ -->
  <section id="troubleshoot">
    <h2><span class="icon">🔧</span> Troubleshooting</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Problem</th><th>Likely Cause</th><th>Fix</th></tr></thead>
        <tbody>
          <tr>
            <td><code>Connection refused</code> on port 7687</td>
            <td>Neo4j container is stopped</td>
            <td>Run <code>docker start testneo4j</code></td>
          </tr>
          <tr>
            <td><code>422 Unprocessable Entity</code></td>
            <td>Wrong JSON key in request body</td>
            <td>Use <code>"question"</code> not <code>"query"</code></td>
          </tr>
          <tr>
            <td>Frontend shows blank screen</td>
            <td>App.js is empty or compile error</td>
            <td>Check browser console; restart <code>npm start</code></td>
          </tr>
          <tr>
            <td>LLM model error / decommissioned</td>
            <td>Wrong model string in <code>llm_agent.py</code></td>
            <td>Currently using <code>openai/gpt-oss-120b</code> — update if needed</td>
          </tr>
          <tr>
            <td>Graph panel shows nothing</td>
            <td>Query returned no result data</td>
            <td>Try a broader query: <em>"show me 5 products"</em></td>
          </tr>
          <tr>
            <td>Ingestion fails — no files found</td>
            <td>Wrong working directory</td>
            <td>Run <code>python backend/ingest.py</code> from the project root, not from inside <code>backend/</code></td>
          </tr>
          <tr>
            <td>Backend can't read env vars</td>
            <td><code>.env</code> file missing or wrong path</td>
            <td>Make sure <code>backend/.env</code> exists and has all 4 variables</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <footer>
    // SAP O2C Graph DB + LLM Interface &nbsp;·&nbsp; Neo4j + FastAPI + Groq + React
  </footer>

</div>
</body>
</html>
