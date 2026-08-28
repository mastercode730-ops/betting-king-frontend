"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const REFRESH_MS = 15_000;

export default function HomePage() {
  const staticGames = [
    {
      code: "INDIA_KING",
      name: "INDIA KING",
      draw_time: "02:20 PM",
      yesterday_number: "41",
      today_number: "74",
      is_highlight: false,
      is_main: false,
      slug: "india-king",
    },
    {
      code: "DELHI_BAZAAR",
      name: "DELHI BAZAAR",
      draw_time: "03:15 PM",
      yesterday_number: "85",
      today_number: "78",
      is_highlight: false,
      is_main: false,
      slug: "delhi-bazaar",
    },
    {
      code: "SHREE_GANESH",
      name: "SHREE GANESH",
      draw_time: "04:45 PM",
      yesterday_number: "64",
      today_number: "30",
      is_highlight: false,
      is_main: false,
      slug: "shree-ganesh",
    },
    {
      code: "FARIDABAD",
      name: "FARIDABAD",
      draw_time: "06:10 PM",
      yesterday_number: "58",
      today_number: "58",
      is_highlight: true,
      is_main: true,
      slug: "faridabad",
    },
    {
      code: "TRIDEV",
      name: "TRIDEV",
      draw_time: "08:15 PM",
      yesterday_number: "18",
      today_number: "--",
      is_highlight: false,
      is_main: false,
      slug: "tridev",
    },
    {
      code: "GAZIYABAD",
      name: "GAZIYABAD",
      draw_time: "09:50 PM",
      yesterday_number: "69",
      today_number: "--",
      is_highlight: false,
      is_main: false,
      slug: "gaziyabad",
    },
    {
      code: "GALI",
      name: "GALI",
      draw_time: "11:45 PM",
      yesterday_number: "57",
      today_number: "--",
      is_highlight: false,
      is_main: false,
      slug: "gali",
    },
    {
      code: "DESHAWER",
      name: "DESHAWER",
      draw_time: "05:15 AM",
      yesterday_number: "64",
      today_number: "88",
      is_highlight: false,
      is_main: false,
      slug: "deshawer",
    },
    {
      code: "NAMAN_CITY",
      name: "NAMAN CITY",
      draw_time: "08:35 PM",
      yesterday_number: "77",
      today_number: "--",
      is_highlight: false,
      is_main: false,
      slug: "naman-city",
    },
    {
      code: "MAHAKAL",
      name: "MAHAKAL",
      draw_time: "01:30 AM",
      yesterday_number: "07",
      today_number: "01",
      is_highlight: false,
      is_main: false,
      slug: "mahakal",
    },
    {
      code: "NEW_GAZIYABAD",
      name: "NEW GAZIYABAD",
      draw_time: "04:10 PM",
      yesterday_number: "87",
      today_number: "54",
      is_highlight: false,
      is_main: false,
      slug: "new-gaziyabad",
    },
    {
      code: "GALI_SUPER",
      name: "GALI SUPER",
      draw_time: "10:30 PM",
      yesterday_number: "27",
      today_number: "--",
      is_highlight: false,
      is_main: false,
      slug: "gali-super",
    },
    {
      code: "KALYUG",
      name: "KALYUG",
      draw_time: "02:20 PM",
      yesterday_number: "77",
      today_number: "49",
      is_highlight: false,
      is_main: false,
      slug: "kalyug",
    },
    {
      code: "FOOTPATH",
      name: "FOOTPATH",
      draw_time: "12:15 AM",
      yesterday_number: "16",
      today_number: "11",
      is_highlight: false,
      is_main: false,
      slug: "footpath",
    },
    {
      code: "BOMBAY_CITY",
      name: "BOMBAY CITY",
      draw_time: "02:20 PM",
      yesterday_number: "90",
      today_number: "49",
      is_highlight: false,
      is_main: false,
      slug: "bombay-city",
    },
    {
      code: "NOIDA_CITY",
      name: "NOIDA CITY",
      draw_time: "10:20 PM",
      yesterday_number: "05",
      today_number: "--",
      is_highlight: false,
      is_main: false,
      slug: "noida-city",
    },
  ];

  const [games, setGames] = useState(staticGames);
  const [todayDate, setTodayDate] = useState("11 अगस्त 2026, मंगलवार");
  const [yesterdayDate, setYDate] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [clock, setClock] = useState("");
  const [chartData, setChartData] = useState(null);
  const [chartMonth, setChartMonth] = useState(() =>
    String(new Date().getMonth() + 1).padStart(2, "0"),
  );
  const [chartYear, setChartYear] = useState(() =>
    String(new Date().getFullYear()),
  );
  const prevNums = useRef({});

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }) + " IST",
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch today results (Now mocked with static data)
  const loadResults = useCallback(async () => {
    // Data is initialized statically
  }, []);

  useEffect(() => {
    // Intentionally left empty as data is static
  }, [loadResults]);

  // Load chart
  const loadChart = useCallback(async (month, year) => {
    try {
      const res = await fetch(`/api/chart/monthly?month=${month}&year=${year}`);
      const json = await res.json();
      if (json.success) setChartData(json);
    } catch (e) {
      console.warn("[SK] Chart error:", e.message);
    }
  }, []);

  useEffect(() => {
    loadChart(chartMonth, chartYear);
  }, [loadChart, chartMonth, chartYear]);

  const filtered = searchQ
    ? games.filter(
        (g) =>
          g.name.toLowerCase().includes(searchQ.toLowerCase()) ||
          g.code.toLowerCase().includes(searchQ.toLowerCase()),
      )
    : games;

  const heroes = games.filter((g) => g.is_highlight && g.is_main);
  const hero = heroes.length > 0 ? heroes[0] : filtered[0] || null;

  const nextGames = games.filter(
    (g) => g.today_number === "XX" || g.today_number === "--",
  );
  const nextGame = nextGames.length > 0 ? nextGames[0] : null;

  return (
    <>
      {hero && (
        <div className="lrs">
          <span className="lrs-tag">
            <i className="lrs-dot"></i>अभी आया रिजल्ट
          </span>
          <span className="lrs-game">{hero.name}</span>
          <span className="lrs-time">({hero.draw_time})</span>
          <span className="lrs-arrow">&#10148;</span>
          <span className="lrs-num">{hero.today_number}</span>
        </div>
      )}

      <header className="top">
        <span className="brand">
          <span className="stumps">
            <i></i>
            <i></i>
            <i></i>
          </span>
          SATTA KING FAST
        </span>
        <span className="tabs">
          <a href="https://www.Gabbar247.vip" target="_blank" rel="noopener">
            Login
          </a>
          <a href="https://www.Gabbar247.vip" target="_blank" rel="noopener">
            Register
          </a>
          <a href="/" className="active">
            स्कोर
          </a>
          <a href="#chart">चार्ट</a>
          <input
            type="text"
            placeholder="Search game..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid var(--line)",
              background: "var(--board)",
              color: "#fff",
              marginLeft: "10px",
            }}
          />
        </span>
      </header>

      <div className="side-pot" aria-hidden="true">
        <span
          className="sp-num"
          style={{ "--nx": "-14px", "--nr": "-20deg", animationDelay: "0s" }}
        >
          74
        </span>
        <span
          className="sp-num"
          style={{ "--nx": "19px", "--nr": "32deg", animationDelay: "0.68s" }}
        >
          78
        </span>
        <span
          className="sp-num"
          style={{ "--nx": "-24px", "--nr": "-44deg", animationDelay: "1.36s" }}
        >
          30
        </span>
        <span
          className="sp-num"
          style={{ "--nx": "29px", "--nr": "56deg", animationDelay: "2.04s" }}
        >
          88
        </span>
        <span
          className="sp-num"
          style={{ "--nx": "-34px", "--nr": "-68deg", animationDelay: "2.72s" }}
        >
          01
        </span>
        <span
          className="sp-num"
          style={{ "--nx": "39px", "--nr": "80deg", animationDelay: "3.4s" }}
        >
          54
        </span>

        <div className="sp-pot">
          <div className="sp-body">
            <span className="sp-band"></span>
          </div>
          <div className="sp-neck"></div>
          <div className="sp-mouth"></div>
        </div>
        <span className="sp-label">मटका लाइव</span>
      </div>

      <section className="board">
        <div className="board-in">
          <div className="board-top">
            <span className="live-tag">
              <i></i> लाइव
            </span>
            <span className="board-date">
              {todayDate} | {clock}
            </span>
          </div>

          {hero && (
            <div className="board-main">
              <div className="board-team">
                <div className="label">आज का ताज़ा रिजल्ट</div>
                <div className="name">{hero.name}</div>
                <div className="sub">
                  रिजल्ट टाइम &middot; {hero.draw_time} &nbsp;|&nbsp; कल:{" "}
                  {hero.yesterday_number}
                </div>
              </div>

              <div className="score">
                {String(hero.today_number)
                  .split("")
                  .map((char, i) => (
                    <span className="odo" key={i}>
                      {char === "X" || char === "-" ? (
                        <span
                          className="odo-strip"
                          style={{ "--d": 0, animation: "none" }}
                        >
                          <b>-</b>
                        </span>
                      ) : (
                        <span
                          className="odo-strip"
                          style={{
                            "--d": parseInt(char) || 0,
                            animationDelay: `${i * 0.18}s`,
                          }}
                        >
                          <b>0</b>
                          <b>1</b>
                          <b>2</b>
                          <b>3</b>
                          <b>4</b>
                          <b>5</b>
                          <b>6</b>
                          <b>7</b>
                          <b>8</b>
                          <b>9</b>
                          <b>0</b>
                          <b>1</b>
                          <b>2</b>
                          <b>3</b>
                          <b>4</b>
                          <b>5</b>
                          <b>6</b>
                          <b>7</b>
                          <b>8</b>
                          <b>9</b>
                          <b>0</b>
                          <b>1</b>
                          <b>2</b>
                          <b>3</b>
                          <b>4</b>
                          <b>5</b>
                          <b>6</b>
                          <b>7</b>
                          <b>8</b>
                          <b>9</b>
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
              <span className="v">
                {nextGame.name} &middot; {nextGame.draw_time}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="wrap">
        <div className="card">
          <div className="card-head">
            <h2>आज का रिजल्ट</h2>
            <span className="hint">
              {
                filtered.filter(
                  (g) => g.today_number !== "XX" && g.today_number !== "--",
                ).length
              }
              /{filtered.length} आ चुके
            </span>
          </div>
          <div className="sc-scroll">
            <table className="sc">
              <thead>
                <tr>
                  <th>सट्टा का नाम</th>
                  <th style={{ textAlign: "center" }}>कल आया था</th>
                  <th style={{ textAlign: "center" }}>आज का रिजल्ट</th>
                  <th>स्थिति</th>
                  <th style={{ textAlign: "right" }}>चार्ट</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
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
                      {g.today_number === "XX" || g.today_number === "--" ? (
                        <span className="status bat">
                          <i></i> इंतज़ार
                        </span>
                      ) : (
                        <span className="status out">आ गया</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        className="chart-link"
                        href={`/${g.slug || g.code.toLowerCase()}/satta-result-chart/${g.code.toLowerCase()}/`}
                      >
                        देखें &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>इस महीने का फ़ॉर्म</h2>
            <span className="hint">पुराने से नए की तरफ</span>
          </div>
          <div className="sc-scroll" style={{ padding: "16px 0" }}>
            <div className="form-row">
              <div className="form-name">INDIA KING</div>
              <div className="balls">
                <span className="ball today">74</span>
                <span className="ball has">41</span>
                <span className="ball has">19</span>
                <span className="ball has">68</span>
                <span className="ball has">84</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-name">DELHI BAZAAR</div>
              <div className="balls">
                <span className="ball today">78</span>
                <span className="ball has">85</span>
                <span className="ball has">89</span>
                <span className="ball has">91</span>
                <span className="ball has">52</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-name">SHREE GANESH</div>
              <div className="balls">
                <span className="ball today">30</span>
                <span className="ball has">64</span>
                <span className="ball has">74</span>
                <span className="ball has">93</span>
                <span className="ball has">80</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-name">FARIDABAD</div>
              <div className="balls">
                <span className="ball today">58</span>
                <span className="ball has">58</span>
                <span className="ball has">63</span>
                <span className="ball has">81</span>
                <span className="ball has">26</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-name">TRIDEV</div>
              <div className="balls">
                <span className="ball none">-</span>
                <span className="ball has">18</span>
                <span className="ball has">15</span>
                <span className="ball has">47</span>
                <span className="ball has">52</span>
              </div>
            </div>
            <div className="form-row">
              <div className="form-name">GAZIYABAD</div>
              <div className="balls">
                <span className="ball none">-</span>
                <span className="ball has">69</span>
                <span className="ball has">53</span>
                <span className="ball has">99</span>
                <span className="ball has">60</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>आज की कॉमेंट्री</h2>
          </div>
          <ul className="comm">
            <li>
              <span className="when">02:20 PM</span>
              <span className="what">
                BOMBAY CITY का रिजल्ट आ गया — <b>49</b>
              </span>
            </li>
            <li>
              <span className="when">12:15 AM</span>
              <span className="what">
                FOOTPATH का रिजल्ट आ गया — <b>11</b>
              </span>
            </li>
            <li>
              <span className="when">02:20 PM</span>
              <span className="what">
                KALYUG का रिजल्ट आ गया — <b>49</b>
              </span>
            </li>
            <li>
              <span className="when">04:10 PM</span>
              <span className="what">
                NEW GAZIYABAD का रिजल्ट आ गया — <b>54</b>
              </span>
            </li>
            <li>
              <span className="when">01:30 AM</span>
              <span className="what">
                MAHAKAL का रिजल्ट आ गया — <b>01</b>
              </span>
            </li>
            <li>
              <span className="when">05:15 AM</span>
              <span className="what">
                DESHAWER का रिजल्ट आ गया — <b>88</b>
              </span>
            </li>
            <li>
              <span className="when">06:10 PM</span>
              <span className="what">
                FARIDABAD का रिजल्ट आ गया — <b>58</b>
              </span>
            </li>
          </ul>
        </div>

        <div className="panel" style={{ marginBottom: "26px" }}>
          <h3>AGHORI JI खाईवाल</h3>
          <div className="rate">
            (( JODI RATE 10=970/- )) (( HARUF RATE 100=970/- ))
          </div>
          <ul className="panel-list">
            <li>
              <span>INDIA KING</span>
              <i></i>
              <span>02:20 PM</span>
            </li>
            <li>
              <span>DELHI BAZAAR</span>
              <i></i>
              <span>03:15 PM</span>
            </li>
            <li>
              <span>SHREE GANESH</span>
              <i></i>
              <span>04:45 PM</span>
            </li>
            <li>
              <span>FARIDABAD</span>
              <i></i>
              <span>06:10 PM</span>
            </li>
            <li>
              <span>TRIDEV</span>
              <i></i>
              <span>08:15 PM</span>
            </li>
            <li>
              <span>GAZIYABAD</span>
              <i></i>
              <span>09:50 PM</span>
            </li>
            <li>
              <span>GALI</span>
              <i></i>
              <span>11:45 PM</span>
            </li>
            <li>
              <span>DESHAWER</span>
              <i></i>
              <span>05:15 AM</span>
            </li>
          </ul>
          <div className="note">
            रिजल्ट अपने समय पर अपने आप अपडेट होता है। किसी को लीक नंबर के पैसे न
            दें।
          </div>
          <a
            href="https://wa.me/1234567890"
            className="cta"
            target="_blank"
            rel="noopener"
          >
            WhatsApp
          </a>
          <a href="#" className="cta tg">
            Telegram
          </a>
        </div>

        <div className="card" id="chart">
          <div className="card-head">
            <h2>
              {chartData
                ? `${MONTH_NAMES[parseInt(chartData.month, 10) - 1].toUpperCase()} ${chartData.year}`
                : "CHART"}
            </h2>
            <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
              <select
                style={{
                  padding: "4px",
                  background: "var(--board)",
                  color: "#fff",
                  border: "1px solid var(--line)",
                }}
                value={chartMonth}
                onChange={(e) => setChartMonth(e.target.value)}
              >
                {MONTH_NAMES.map((m, i) => (
                  <option key={m} value={String(i + 1).padStart(2, "0")}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                style={{
                  padding: "4px",
                  background: "var(--board)",
                  color: "#fff",
                  border: "1px solid var(--line)",
                }}
                value={chartYear}
                onChange={(e) => setChartYear(e.target.value)}
              >
                {[2026, 2025, 2024, 2023, 2022].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="sc-scroll">
            <table className="sc">
              <thead>
                <tr>
                  <th>DAY</th>
                  <th style={{ textAlign: "center" }}>DSWR</th>
                  <th style={{ textAlign: "center" }}>FRBD</th>
                  <th style={{ textAlign: "center" }}>GZBD</th>
                  <th style={{ textAlign: "center" }}>GALI</th>
                </tr>
              </thead>
              <tbody>
                {chartData?.rows?.map((r) => (
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

      <div className="info-wrap">
        <div className="steps">
          <div className="step">
            <span className="step-ico">🗓️</span>
            <b>समय देखिए</b>
            <span>हर गेम के नाम के नीचे उसका रिजल्ट टाइम लिखा है।</span>
          </div>
          <div className="step">
            <span className="step-ico">⏳</span>
            <b>इंतज़ार कीजिए</b>
            <span>समय से पहले घड़ी का निशान दिखता है, नंबर नहीं।</span>
          </div>
          <div className="step">
            <span className="step-ico">🏆</span>
            <b>रिजल्ट पाइए</b>
            <span>समय होते ही नंबर अपने आप यहाँ आ जाता है।</span>
          </div>
        </div>

        <div className="info-block">
          <h3>SATTABAZAR पर रिजल्ट कैसे देखें?</h3>
          <p>
            इस साइट पर आने के बाद आपको सबसे ऊपर आज की तारीख और सबसे नज़दीकी गेम
            का रिजल्ट दिखता है। उसके नीचे सारे गेम एक लिस्ट में लगे होते हैं,
            जिसमें हर गेम का नाम, उसका समय, कल आया हुआ नंबर और आज का नंबर
            साथ-साथ दिखता है।
          </p>
          <p>
            जिस गेम का समय अभी नहीं आया, उसके सामने घड़ी का निशान दिखता है। इसका
            मतलब है कि रिजल्ट का इंतज़ार चल रहा है। समय पूरा होते ही वहाँ नंबर
            अपने आप आ जाता है — पेज बार-बार रिफ्रेश करने की ज़रूरत नहीं पड़ती।
          </p>
          <p>
            किसी एक गेम का पूरा पुराना रिकॉर्ड देखना हो तो उसके नाम के पास दिए
            चार्ट लिंक पर क्लिक कीजिए। वहाँ महीने और तारीख के हिसाब से सारा
            रिकॉर्ड मिल जाएगा।
          </p>
        </div>

        <div className="info-block">
          <h3>चार्ट और रिकॉर्ड का फ़ायदा</h3>
          <p>
            चार्ट में पिछले कई दिनों के नंबर एक ही जगह टेबल की शक्ल में मिलते
            हैं। बाएँ तरफ तारीख रहती है और ऊपर की तरफ गेम के नाम, जिससे किसी भी
            दिन का नंबर एक नज़र में ढूँढा जा सकता है।
          </p>
          <p>
            चार्ट पेज पर गेम चुनने का विकल्प और तारीख की रेंज दोनों मौजूद हैं।
            इससे आप सिर्फ अपने मतलब का रिकॉर्ड देख सकते हैं और बाकी सब छिपा रहता
            है।
          </p>
          <p>
            यहाँ दिखाया गया हर नंबर वैसा ही रहता है जैसा घोषित हुआ था। रिकॉर्ड
            में बाद में कोई फेरबदल नहीं किया जाता, इसलिए पुराना डेटा भरोसे लायक
            रहता है।
          </p>
        </div>

        <div className="info-block">
          <h3>ज़रुरी सूचना</h3>
          <p>
            यह वेबसाइट सिर्फ जानकारी देने के मक़सद से बनाई गई है। यहाँ दिखाए गए
            सारे नंबर और चार्ट केवल पढ़ने और रिकॉर्ड रखने के लिए हैं।
          </p>
          <p>
            किसी भी तरह के लेन-देन, नुकसान या विवाद की ज़िम्मेदारी इस वेबसाइट की
            नहीं है। अपने फ़ैसले सोच-समझकर और अपनी ज़िम्मेदारी पर लीजिए।
          </p>
          <p>
            कृपया ध्यान दें कि लीक नंबर के नाम पर किसी को पैसे न दें। ऐसा कोई
            दावा करने वाला व्यक्ति इस वेबसाइट से जुड़ा हुआ नहीं है।
          </p>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-name">SATTABAZAR.STORE</div>
        <p>
          SATTABAZAR पर फरीदाबाद, गाजियाबाद, गली, दिसावर सहित सभी गेम का आज का
          रिजल्ट और पूरा चार्ट देखें।
        </p>
        <p>SATTABAZAR — हर गेम का रिजल्ट सबसे पहले, बिल्कुल मुफ़्त।</p>
        <div className="legal">
          &copy; 2026 sattabazar.store. यहाँ दी गई सारी जानकारी सिर्फ पढ़ने के
          लिए है।
        </div>
      </footer>

      <a
        href="https://wa.me/1234567890"
        className="fab"
        target="_blank"
        rel="noopener"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>
    </>
  );
}
