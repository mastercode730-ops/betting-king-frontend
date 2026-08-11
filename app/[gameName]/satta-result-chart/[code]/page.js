'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { STATIC_GAMES, getMockGameAnnualChart, WHATSAPP_URL, WHATSAPP_NUMBER } from '../../../../lib/mockData';

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function GameChartPage() {
  const params = useParams();
  const gameCode = params.code?.toUpperCase() || 'FB';

  const currentYear = new Date().getFullYear();
  const [year, setYear]           = useState(String(currentYear));
  const [gameData, setGameData]   = useState(() => STATIC_GAMES.find(g => g.code === gameCode) || { name: gameCode, draw_time: '08:00 PM' });
  const [monthlyData, setMonthly] = useState(() => getMockGameAnnualChart(gameCode, String(currentYear)).monthly_data);
  const [todayResults, setToday]  = useState(STATIC_GAMES);
  const [todayDate, setTDate]     = useState(() => new Date().toISOString().split('T')[0]);
  const [yesterdayDate, setYDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  // Fetch chart data for this game + year with fallback
  const loadGameChart = useCallback(async (yr) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/chart/game/${gameCode}?year=${yr}`);
      if (!res.ok) throw new Error('Failed to fetch game chart');
      const json = await res.json();
      if (json.success && json.monthly_data) {
        setGameData(json.game || STATIC_GAMES.find(g => g.code === gameCode) || { name: gameCode, draw_time: '08:00 PM' });
        setMonthly(json.monthly_data);
        return;
      }
    } catch (e) {
      // Fallback
      const mock = getMockGameAnnualChart(gameCode, yr);
      setGameData(mock.game);
      setMonthly(mock.monthly_data);
    } finally {
      setLoading(false);
    }
  }, [gameCode]);

  // Fetch today's live results board with fallback
  const loadToday = useCallback(async () => {
    try {
      const res = await fetch('/api/results/today');
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setToday(json.data);
        if (json.today_date) setTDate(json.today_date);
        if (json.yesterday_date) setYDate(json.yesterday_date);
      }
    } catch (e) {
      // Keep static data
    }
  }, []);

  useEffect(() => { loadGameChart(year); }, [loadGameChart, year]);
  useEffect(() => { loadToday(); const id = setInterval(loadToday, 15000); return () => clearInterval(id); }, [loadToday]);

  const fmt = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });
  };

  const years = [2026, 2025, 2024, 2023, 2022];
  const categories = [
    { key: 'LIVE', label: '🔴 LIVE', cls: '' },
    { key: 'NEXT', label: '⏳ NEXT', cls: 'cat-next' },
    { key: 'REST', label: '✓ DONE', cls: 'cat-rest' },
  ];

  const thisGame = todayResults.find(g => g.code === gameCode);

  const SpinnerIcon = () => (
    <span className="wait-spinner" title="रिजल्ट का इंतज़ार">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9.5" />
        <line className="clock-hand" x1="12" y1="12" x2="12" y2="6.5" />
      </svg>
    </span>
  );

  return (
    <div id="wrapper">
      <div className="aurora" aria-hidden="true" />
      <div className="orbs" aria-hidden="true">
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
      </div>

      {/* ── TOP NAV ── */}
      <header className="nav">
        <Link href="/" className="brand-wrapper">
          <div className="brand-mark">
            <span className="brand-dot" />
          </div>
          <div className="brand-text">
            <span className="brand-title">SATTA KING FAST</span>
            <span className="brand-sub">ANNUAL RECORD ARCHIVE</span>
          </div>
        </Link>
        <div className="nav-right">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-wa">
            💬 WhatsApp
          </a>
          <Link href="/" className="nav-btn">
            ← BACK TO HOME
          </Link>
        </div>
      </header>

      <main className="wrap">
        {/* PROMINENT WHATSAPP BANNER */}
        <div className="wa-banner" style={{ marginTop: 18 }}>
          <div className="wa-banner-text">
            <span className="wa-banner-title">
              👑 {gameData?.name || gameCode} का लीक सिंगल नंबर सीधे WhatsApp पर प्राप्त करें
            </span>
            <span className="wa-banner-sub">
              100% सटीक लीक नंबर और सुपरफास्ट रिजल्ट सर्विस &bull; WhatsApp: {WHATSAPP_NUMBER}
            </span>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-wa">
            📲 सीधा चैट करें
          </a>
        </div>

        {/* CHART TITLE SECTION */}
        <div className="section-head" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="section-title">
              📊 {gameData?.name || gameCode} SATTA RECORD CHART {year}
            </span>
            <span className="section-meta" style={{ marginTop: 4 }}>
              Draw Time: {gameData?.draw_time} &nbsp;|&nbsp; Annual Result Record &nbsp;|&nbsp; Code: {gameCode}
            </span>
          </div>
        </div>

        {/* HIGHLIGHT: THIS GAME'S TODAY RESULT */}
        {thisGame && (
          <div className="game-card highlight" style={{ margin: '18px 0', borderColor: 'rgba(34,211,238,0.5)', background: 'rgba(34,211,238,0.06)' }}>
            <div className="game-info">
              <div className="game-title" style={{ fontSize: 18 }}>{thisGame.name} — TODAY&apos;S RESULT</div>
              <div className="game-time">⏰ {thisGame.draw_time}</div>
            </div>
            <div className="numbers-wrapper">
              <div className="num-box">
                <span className="num-label">YEST ({fmt(yesterdayDate)})</span>
                <span className="num-badge yesterday" style={{ width: 56, height: 50, fontSize: 26 }}>
                  {thisGame.yesterday_number}
                </span>
              </div>
              <div className="num-box">
                <span className="num-label">TODAY ({fmt(todayDate)})</span>
                <span
                  className={`num-badge ${thisGame.today_number === 'XX' || thisGame.today_number === '--' ? 'pending' : 'today is-highlight-num'}`}
                  style={{ width: 56, height: 50, fontSize: 26 }}
                >
                  {thisGame.today_number === 'XX' || thisGame.today_number === '--' ? <SpinnerIcon /> : thisGame.today_number}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* YEAR NAV SELECTOR */}
        <div className="year-nav" id="year-nav">
          {years.map(y => (
            <button
              key={y}
              className={`year-btn ${year === String(y) ? 'active' : ''}`}
              onClick={() => setYear(String(y))}
              id={`year-btn-${y}`}
            >
              {y} CHART
            </button>
          ))}
        </div>

        {/* ANNUAL CHART TABLE */}
        <div className="annual-chart-wrapper" id="annual-chart-wrapper">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--dim)' }}>
              <SpinnerIcon /> FETCHING {gameCode} {year} ANNUAL RECORD...
            </div>
          ) : (
            <table className="annual-table" id="annual-chart-table" aria-label={`${gameData?.name} annual result chart ${year}`}>
              <thead>
                <tr>
                  <th style={{ width: 50 }}>DATE</th>
                  {MONTH_SHORT.map(m => <th key={m}>{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 31 }, (_, i) => {
                  const dPad = String(i + 1).padStart(2, '0');
                  return (
                    <tr key={dPad}>
                      <td className="day-col">{dPad}</td>
                      {Array.from({ length: 12 }, (_, m) => {
                        const mPad = String(m + 1).padStart(2, '0');
                        const num = monthlyData?.[mPad]?.[dPad] || 'XX';
                        const hasNum = num && num !== 'XX' && num !== '--';
                        return (
                          <td key={mPad} className={`num-cell ${hasNum ? 'has-num' : ''}`}>
                            {num === 'XX' && year === String(currentYear) && m === new Date().getMonth() + 1 && i + 1 === new Date().getDate() ? (
                              <SpinnerIcon />
                            ) : (
                              num
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* COMBINED REGIONAL RESULTS BOARD */}
        <div className="section-head" style={{ marginTop: 40 }}>
          <span className="section-title">▦ ALL OTHER REGIONAL RESULTS</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span className="section-meta">↩ {fmt(yesterdayDate)}</span>
            <span className="section-meta" style={{ color: 'var(--cyan)' }}>⬤ {fmt(todayDate)} (TODAY)</span>
          </div>
        </div>

        <div id="results-board">
          {categories.map(cat => {
            const catGames = todayResults.filter(g => g.category === cat.key);
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
                      <div key={g.code} className={`game-card ${isHighlight} ${g.code === gameCode ? 'highlight' : ''}`}>
                        <div className="game-info">
                          <div className="game-title">{g.name}</div>
                          <div className="game-time">⏰ {g.draw_time}</div>
                          <Link href={chartHref} className="chart-link">
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
                            <span className={`num-badge ${todayCls}`}>
                              {isPending ? <SpinnerIcon /> : g.today_number}
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
      </main>

      {/* FLOATING WHATSAPP BUTTON */}
      <div className="floating-wa">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-floating-wa">
          💬 WhatsApp
        </a>
      </div>

      {/* FAB */}
      <div className="floating-bar">
        <button className="btn-fab fab-refresh" id="btn-refresh" onClick={() => window.location.reload()}>
          ↺ REFRESH
        </button>
      </div>
    </div>
  );
}
