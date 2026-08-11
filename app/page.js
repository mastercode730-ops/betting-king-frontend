'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

const MONTH_NAMES  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const REFRESH_MS   = 15_000;

export default function HomePage() {
  const [games, setGames]           = useState([]);
  const [todayDate, setTodayDate]   = useState('');
  const [yesterdayDate, setYDate]   = useState('');
  const [searchQ, setSearchQ]       = useState('');
  const [clock, setClock]           = useState('');
  const [chartData, setChartData]   = useState(null);
  const [chartMonth, setChartMonth] = useState(() => String(new Date().getMonth() + 1).padStart(2,'0'));
  const [chartYear, setChartYear]   = useState(() => String(new Date().getFullYear()));
  const prevNums = useRef({});

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

  useEffect(() => { loadChart(chartMonth, chartYear); }, [loadChart, chartMonth, chartYear]);

  const filtered = searchQ
    ? games.filter(g => g.name.toLowerCase().includes(searchQ.toLowerCase()) || g.code.toLowerCase().includes(searchQ.toLowerCase()))
    : games;

  const heroes = games.filter(g => g.is_highlight && g.is_main);
  const hero = heroes.length > 0 ? heroes[0] : (filtered[0] || null);

  const nextGames = games.filter(g => g.today_number === 'XX' || g.today_number === '--');
  const nextGame = nextGames.length > 0 ? nextGames[0] : null;

  return (
    <>
      {hero && (
        <div className="lrs">
            <span className="lrs-tag"><i className="lrs-dot"></i>अभी आया रिजल्ट</span>
            <span className="lrs-game">{hero.name}</span>
            <span className="lrs-time">({hero.draw_time})</span>
            <span className="lrs-arrow">&#10148;</span>
            <span className="lrs-num">{hero.today_number}</span>
        </div>
      )}

      <header className="top">
          <span className="brand">
              <span className="stumps"><i></i><i></i><i></i></span>
              SATTA KING FAST
          </span>
          <span className="tabs">
              <a href="/" className="active">स्कोर</a>
              <a href="#chart">चार्ट</a>
              <input 
                type="text" 
                placeholder="Search game..." 
                value={searchQ} 
                onChange={e => setSearchQ(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--board)', color: '#fff', marginLeft: '10px' }}
              />
          </span>
      </header>

      <div className="side-pot" aria-hidden="true">
          <span className="sp-num" style={{'--nx':'-14px', '--nr':'-20deg', animationDelay:'0s'}}>74</span>
          <span className="sp-num" style={{'--nx':'19px', '--nr':'32deg', animationDelay:'0.68s'}}>78</span>
          <span className="sp-num" style={{'--nx':'-24px', '--nr':'-44deg', animationDelay:'1.36s'}}>30</span>
          <span className="sp-num" style={{'--nx':'29px', '--nr':'56deg', animationDelay:'2.04s'}}>88</span>
          <span className="sp-num" style={{'--nx':'-34px', '--nr':'-68deg', animationDelay:'2.72s'}}>01</span>
          <span className="sp-num" style={{'--nx':'39px', '--nr':'80deg', animationDelay:'3.4s'}}>54</span>
          
          <div className="sp-pot">
              <div className="sp-body"><span className="sp-band"></span></div>
              <div className="sp-neck"></div>
              <div className="sp-mouth"></div>
          </div>
          <span className="sp-label">मटका लाइव</span>
      </div>

      <section className="board">
          <div className="board-in">
              <div className="board-top">
                  <span className="live-tag"><i></i> लाइव</span>
                  <span className="board-date">{todayDate} | {clock}</span>
              </div>

              {hero && (
              <div className="board-main">
                  <div className="board-team">
                      <div className="label">आज का ताज़ा रिजल्ट</div>
                      <div className="name">{hero.name}</div>
                      <div className="sub">रिजल्ट टाइम &middot; {hero.draw_time} &nbsp;|&nbsp; कल: {hero.yesterday_number}</div>
                  </div>

                  <div className="score">
                      {String(hero.today_number).split('').map((char, i) => (
                          <span className="odo" key={i}>
                              {char === 'X' || char === '-' ? (
                                  <span className="odo-strip" style={{'--d': 0, animation: 'none'}}>
                                      <b>-</b>
                                  </span>
                              ) : (
                                  <span className="odo-strip" style={{'--d': parseInt(char) || 0, animationDelay: `${i * 0.18}s`}}>
                                      <b>0</b><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b><b>6</b><b>7</b><b>8</b><b>9</b>
                                      <b>0</b><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b><b>6</b><b>7</b><b>8</b><b>9</b>
                                      <b>0</b><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b><b>6</b><b>7</b><b>8</b><b>9</b>
                                  </span>
                              )}
                          </span>
                      ))}
                  </div>
              </div>
              )}
              
              {nextGame && (
              <div className="next-bar">
                  <span className="k">अगला रिजल्ट</span>
                  <span className="v">{nextGame.name} &middot; {nextGame.draw_time}</span>
              </div>
              )}
          </div>
      </section>

      <div className="wrap">
          <div className="card">
              <div className="card-head">
                  <h2>आज का रिजल्ट</h2>
                  <span className="hint">{filtered.filter(g => g.today_number !== 'XX' && g.today_number !== '--').length}/{filtered.length} आ चुके</span>
              </div>
              <div className="sc-scroll">
                  <table className="sc">
                      <thead>
                          <tr>
                              <th>सट्टा का नाम</th>
                              <th style={{textAlign:'center'}}>कल आया था</th>
                              <th style={{textAlign:'center'}}>आज का रिजल्ट</th>
                              <th>स्थिति</th>
                              <th style={{textAlign:'right'}}>चार्ट</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filtered.map(g => (
                              <tr key={g.code}>
                                  <td>
                                      <div className="p-name">{g.name}</div>
                                      <div className="p-sub">{g.draw_time}</div>
                                  </td>
                                  <td className="num-cell num-prev">{g.yesterday_number}</td>
                                  <td className="num-cell">
                                      <span className="num-today">{g.today_number}</span>
                                  </td>
                                  <td>
                                      {(g.today_number === 'XX' || g.today_number === '--') ? (
                                          <span className="status bat"><i></i> इंतज़ार</span>
                                      ) : (
                                          <span className="status out">आ गया</span>
                                      )}
                                  </td>
                                  <td style={{textAlign:'right'}}>
                                      <Link className="chart-link" href={`/${g.slug || g.code.toLowerCase()}/satta-result-chart/${g.code.toLowerCase()}/`}>देखें &rarr;</Link>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          <div className="card" id="chart">
              <div className="card-head">
                  <h2>{chartData ? `${MONTH_NAMES[parseInt(chartData.month,10)-1].toUpperCase()} ${chartData.year}` : 'CHART'}</h2>
                  <div style={{marginLeft: 'auto', display: 'flex', gap: '8px'}}>
                      <select style={{padding: '4px', background: 'var(--board)', color: '#fff', border: '1px solid var(--line)'}} value={chartMonth} onChange={e => setChartMonth(e.target.value)}>
                          {MONTH_NAMES.map((m, i) => (
                              <option key={m} value={String(i+1).padStart(2,'0')}>{m}</option>
                          ))}
                      </select>
                      <select style={{padding: '4px', background: 'var(--board)', color: '#fff', border: '1px solid var(--line)'}} value={chartYear} onChange={e => setChartYear(e.target.value)}>
                          {[2026,2025,2024,2023,2022].map(y => (
                              <option key={y} value={y}>{y}</option>
                          ))}
                      </select>
                  </div>
              </div>
              <div className="sc-scroll">
                  <table className="sc">
                      <thead>
                          <tr>
                              <th>DAY</th>
                              <th style={{textAlign:'center'}}>DSWR</th>
                              <th style={{textAlign:'center'}}>FRBD</th>
                              <th style={{textAlign:'center'}}>GZBD</th>
                              <th style={{textAlign:'center'}}>GALI</th>
                          </tr>
                      </thead>
                      <tbody>
                          {chartData?.rows?.map(r => (
                              <tr key={r.day}>
                                  <td>{r.day}</td>
                                  <td className="num-cell num-prev">{r.DS}</td>
                                  <td className="num-cell num-prev">{r.FB}</td>
                                  <td className="num-cell num-prev">{r.GB}</td>
                                  <td className="num-cell num-prev">{r.GL}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </>
  );
}
