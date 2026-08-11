'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const REFRESH_MS = 15_000;

export default function HomePage() {
  const [games, setGames]           = useState([]);
  const [todayDate, setTodayDate]   = useState('');
  const [yesterdayDate, setYDate]   = useState('');
  const [searchQ, setSearchQ]       = useState('');
  const [clock, setClock]           = useState('');
  const [chartData, setChartData]   = useState(null);
  const [chartMonth, setChartMonth] = useState(() => String(new Date().getMonth() + 1).padStart(2, '0'));
  const [chartYear, setChartYear]   = useState(() => String(new Date().getFullYear()));

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) + ' IST');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch today results
  const loadResults = useCallback(async () => {
    try {
      const res = await fetch('/api/results/today');
      const json = await res.json();
      if (!json.success) return;
      setGames(json.data);
      setTodayDate(json.today_date);
      setYDate(json.yesterday_date);
    } catch (e) {
      console.warn('[SK] API error:', e.message);
    }
  }, []);

  useEffect(() => {
    loadResults();
    const id = setInterval(loadResults, REFRESH_MS);
    return () => clearInterval(id);
  }, [loadResults]);

  // Load chart
  const loadChart = useCallback(async (month, year) => {
    try {
      const res = await fetch(`/api/chart/monthly?month=${month}&year=${year}`);
      const json = await res.json();
      if (json.success) setChartData(json);
    } catch (e) {
      console.warn('[SK] Chart error:', e.message);
    }
  }, []);

  useEffect(() => {
    loadChart(chartMonth, chartYear);
  }, [loadChart, chartMonth, chartYear]);

  const filtered = searchQ
    ? games.filter(g => g.name.toLowerCase().includes(searchQ.toLowerCase()) || g.code.toLowerCase().includes(searchQ.toLowerCase()))
    : games;

  const heroes = games.filter(g => g.is_highlight && g.is_main).slice(0, 4);
  const latestDraw = games.find(g => g.today_number && g.today_number !== 'XX' && g.today_number !== '--') || games[0];

  const fmt = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const categories = [
    { key: 'LIVE', label: '🔴 LIVE — RECENT DRAWS', cls: '' },
    { key: 'NEXT', label: '⏳ UPCOMING DRAWS',       cls: 'cat-next' },
    { key: 'REST', label: '✓ COMPLETED DRAWS',      cls: 'cat-rest' },
  ];

  // Chart navigation
  const goToMonth = (month, year) => {
    setChartMonth(month);
    setChartYear(year);
  };

  const mIdx = parseInt(chartMonth, 10) - 1;
  const prevMIdx = mIdx === 0 ? 11 : mIdx - 1;
  const prevYear = mIdx === 0 ? parseInt(chartYear) - 1 : parseInt(chartYear);
  const nextMIdx = mIdx === 11 ? 0 : mIdx + 1;
  const nextYear = mIdx === 11 ? parseInt(chartYear) + 1 : parseInt(chartYear);
  const todayDay = todayDate ? todayDate.split('-')[2] : '';

  return (
    <div id="wrapper">
      {/* Background Aurora Canvas & Floating Orbs */}
      <div className="aurora" aria-hidden="true" />
      <div className="orbs" aria-hidden="true">
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
      </div>

      {/* ── BREAKING RESULT FLASH BAR ── */}
      {latestDraw && (
        <div className="lrs">
          <span className="lrs-tag"><i className="lrs-dot" />अभी आया रिजल्ट</span>
          <span className="lrs-game">{latestDraw.name}</span>
          <span className="lrs-time">({latestDraw.draw_time})</span>
          <span className="lrs-arrow">&#10148;</span>
          <span className="lrs-num">{latestDraw.today_number === 'XX' || latestDraw.today_number === '--' ? '??' : latestDraw.today_number}</span>
        </div>
      )}

      {/* ── TOP NAV ── */}
      <header className="nav">
        <Link href="/" className="brand-wrapper">
          <div className="brand-mark">
            <span className="brand-dot" />
          </div>
          <div className="brand-text">
            <span className="brand-title">SATTA KING FAST</span>
            <span className="brand-sub">SUPERFAST LIVE RESULTS</span>
          </div>
        </Link>

        <div className="nav-center">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              id="game-search-input"
              className="search-input"
              placeholder="Search games (Gali, Desawar…)"
              autoComplete="off"
              aria-label="Search games"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
          </div>
        </div>

        <div className="nav-right">
          <div className="clock-badge">
            <span className="lrs-dot" />
            <time id="live-timestamp">{clock || 'LIVE'}</time>
          </div>
        </div>
      </header>

      {/* ── LIVE TICKER MARQUEE ── */}
      <div className="ticker" aria-label="Live draws ticker">
        <div className="ticker-track">
          {games.concat(games).map((g, idx) => {
            const isPending = g.today_number === 'XX' || g.today_number === '--';
            return (
              <span key={`${g.code}-${idx}`} className="ticker-item">
                <b>{g.name}</b>
                <span className={`val ${isPending ? 'wait' : ''}`}>
                  {isPending ? '⏳ WAITING' : g.today_number}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="wrap">

        {/* HERO LIVE DRAWS */}
        <div className="section-head">
          <span className="section-title">⚡ LIVE HIGHLIGHT DRAWS</span>
          <span className="section-meta">Realtime · 15s auto-refresh</span>
        </div>

        <div className="hero-grid" id="hero-grid">
          {heroes.map((g) => {
            const isPending = g.today_number === 'XX' || g.today_number === '--';
            return (
              <div key={g.code} className="hero-card" id={`hero-${g.code}`}>
                <div className="hero-game-name">{g.name}</div>
                <span className={`hero-number ${isPending ? 'pending-hero' : ''}`}>
                  {isPending ? '??' : g.today_number}
                </span>
                <div className="hero-meta">
                  <span className="hero-time">DRAW: {g.draw_time}</span>
                  {isPending ? (
                    <span className="hero-badge" style={{ background: 'rgba(251,191,36,0.15)', color: 'var(--amber)', borderColor: 'rgba(251,191,36,0.3)' }}>
                      WAITING
                    </span>
                  ) : (
                    <span className="hero-badge">RESULT DECLARED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ALL REGIONS RESULTS */}
        <div className="section-head" style={{ marginTop: 40 }}>
          <span className="section-title">▦ ALL REGIONAL RESULTS</span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span className="section-meta" id="yesterday-label">↩ {fmt(yesterdayDate)}</span>
            <span className="section-meta" style={{ color: 'var(--cyan)' }} id="today-label">⬤ {fmt(todayDate)} (TODAY)</span>
          </div>
        </div>

        <div id="quick-board-container">
          {categories.map((cat) => {
            const catGames = filtered.filter(g => g.category === cat.key);
            if (!catGames.length) return null;
            return (
              <div key={cat.key}>
                <div className={`cat-label ${cat.cls}`}>
                  <span>{cat.label}</span>
                </div>
                <div className="results-grid">
                  {catGames.map((g) => {
                    const isPending = g.today_number === 'XX' || g.today_number === '--';
                    const todayCls = isPending ? 'pending' : `today${g.is_highlight ? ' is-highlight-num' : ''}`;
                    const isHighlight = g.is_highlight ? 'highlight' : '';
                    const chartHref = `/${g.slug || g.code.toLowerCase()}/satta-result-chart/${g.code.toLowerCase()}/`;

                    return (
                      <div key={g.code} className={`game-card ${isHighlight}`} id={`card-${g.code}`}>
                        <div className="game-info">
                          <div className="game-title">{g.name}</div>
                          <div className="game-time">⏰ {g.draw_time}</div>
                          <Link href={chartHref} className="chart-link" id={`chart-link-${g.code}`}>
                            ◈ RECORD CHART →
                          </Link>
                        </div>
                        <div className="numbers-wrapper">
                          <div className="num-box">
                            <span className="num-label">YEST</span>
                            <span className="num-badge yesterday">{g.yesterday_number}</span>
                          </div>
                          <div className="num-box">
                            <span className="num-label">TODAY</span>
                            <span className={`num-badge ${todayCls}`} id={`num-${g.code}`}>
                              {g.today_number}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* MONTHLY CHART ARCHIVE */}
        <div className="section-head" style={{ marginTop: 48 }}>
          <span className="section-title" id="chart-title">
            📊 {chartData ? `${MONTH_NAMES[parseInt(chartData.month, 10) - 1]?.toUpperCase()} ${chartData.year}` : 'MONTHLY CHART'}
          </span>
          <span className="section-meta" id="chart-subtitle">
            {chartData ? `${chartData.days_in_month} days · Combined Record Archive` : 'Archive'}
          </span>
        </div>

        <div className="chart-wrapper">
          <table className="brutalist-table" id="monthly-table" aria-label="Monthly result chart">
            <thead>
              <tr>
                <th style={{ width: 60 }}>DAY</th>
                <th>DSWR</th>
                <th>FRBD</th>
                <th>GZBD</th>
                <th>GALI</th>
              </tr>
            </thead>
            <tbody id="mix-chart-tbody">
              {chartData?.rows?.map((r) => {
                const isToday = r.day === todayDay;
                const cell = (val) => {
                  const hasNum = val && val !== 'XX' && val !== '--';
                  return `${hasNum ? 'has-num' : ''} ${isToday ? 'today-row' : ''}`;
                };
                return (
                  <tr key={r.day}>
                    <td className="day-col">{r.day}</td>
                    <td className={`num-col ${cell(r.DS)}`}>{r.DS}</td>
                    <td className={`num-col ${cell(r.FB)}`}>{r.FB}</td>
                    <td className={`num-col ${cell(r.GB)}`}>{r.GB}</td>
                    <td className={`num-col ${cell(r.GL)}`}>{r.GL}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="month-nav">
            <button
              className="nav-btn"
              id="prev-month-link"
              onClick={() => goToMonth(String(prevMIdx + 1).padStart(2, '0'), String(prevYear))}
            >
              ← {MONTH_NAMES[prevMIdx]?.substring(0, 3)} {prevYear}
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--dim)', letterSpacing: 2 }} id="nav-current-month">
              {chartData ? `${MONTH_NAMES[mIdx]?.substring(0, 3).toUpperCase()} ${chartData.year}` : ''}
            </span>
            <button
              className="nav-btn"
              id="next-month-link"
              onClick={() => goToMonth(String(nextMIdx + 1).padStart(2, '0'), String(nextYear))}
            >
              {MONTH_NAMES[nextMIdx]?.substring(0, 3)} {nextYear} →
            </button>
          </div>
        </div>
      </main>

      {/* ── FOOTER ARCHIVE SELECTOR ── */}
      <footer id="footer">
        <div className="form-card">
          <h3>Browse Complete Monthly Archives</h3>
          <div className="form-inline">
            <select
              id="month"
              aria-label="Select month"
              value={chartMonth}
              onChange={e => setChartMonth(e.target.value)}
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
              ))}
            </select>
            <select
              id="year"
              aria-label="Select year"
              value={chartYear}
              onChange={e => setChartYear(e.target.value)}
            >
              {[2026, 2025, 2024, 2023, 2022].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </footer>

      {/* FLOATING REFRESH FAB */}
      <div className="floating-bar">
        <button className="btn-fab fab-refresh" id="btn-refresh" onClick={() => window.location.reload()}>
          ↺ LIVE REFRESH
        </button>
      </div>
    </div>
  );
}
