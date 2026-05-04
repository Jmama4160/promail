import { useState, useRef, useEffect } from "react";

// ============================================
// UPDATE THESE TWO LINKS BEFORE DEPLOYING
// ============================================
const SELAR_LINK = "YOUR_SELAR_LINK_HERE";
const APP_URL = "YOUR_PROMAIL_VERCEL_URL_HERE";
// ============================================

const FREE_LIMIT = 5;

const EMAIL_TYPES = [
  { id: "request", label: "Request", emoji: "📋", desc: "Ask for something formally" },
  { id: "followup", label: "Follow-up", emoji: "🔄", desc: "Chase a response" },
  { id: "introduction", label: "Introduction", emoji: "🤝", desc: "Introduce yourself" },
  { id: "complaint", label: "Complaint", emoji: "⚠️", desc: "Raise an issue formally" },
  { id: "proposal", label: "Proposal", emoji: "💡", desc: "Pitch an idea or service" },
  { id: "apology", label: "Apology", emoji: "🙏", desc: "Apologise professionally" },
  { id: "thankyou", label: "Thank You", emoji: "⭐", desc: "Express gratitude formally" },
  { id: "resignation", label: "Resignation", emoji: "📄", desc: "Leave gracefully" },
];

const TONES = [
  { id: "formal", label: "Formal", desc: "Government & corporates" },
  { id: "professional", label: "Professional", desc: "Business & clients" },
  { id: "friendly", label: "Friendly", desc: "Colleagues & partners" },
];

const STEPS = ["Email Type", "Details", "Your Email"];

// ============================================
// LANDING PAGE
// ============================================
function LandingPage({ onStart }) {
  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: "#f7f4ef", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{overflow-x:hidden;}
        .lnav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:20px 48px;background:rgba(247,244,239,0.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(26,58,42,0.08);}
        .llogo{font-family:'Fraunces',serif;font-size:22px;font-weight:900;color:#1a3a2a;border:none;background:none;cursor:pointer;}
        .llogo span{color:#a8d878;background:#1a3a2a;padding:2px 8px;border-radius:4px;margin-left:2px;}
        .lnav-links{display:flex;gap:32px;align-items:center;}
        .lnav-links a{font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8278;text-decoration:none;transition:color 0.2s;}
        .lnav-links a:hover{color:#1a3a2a;}
        .lnav-cta{background:#1a3a2a !important;color:#f7f4ef !important;padding:10px 20px;border-radius:6px;}
        .lhero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:120px 48px 80px;position:relative;overflow:hidden;}
        .lhero::before{content:'';position:absolute;top:-200px;right:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(168,216,120,0.12) 0%,transparent 70%);pointer-events:none;}
        .ltag{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#1a3a2a;margin-bottom:28px;display:flex;align-items:center;gap:10px;}
        .ltag::before{content:'';display:inline-block;width:28px;height:2px;background:#1a3a2a;}
        .lh1{font-family:'Fraunces',serif;font-size:clamp(48px,8vw,96px);font-weight:900;line-height:0.94;letter-spacing:-0.03em;max-width:860px;margin-bottom:36px;color:#1a1a1a;}
        .lh1 em{font-style:italic;color:#1a3a2a;}
        .lh1 .hl{background:#1a3a2a;color:#a8d878;padding:0 12px;}
        .lsub{font-family:'Fraunces',serif;font-size:clamp(16px,2vw,20px);color:#8a8278;max-width:500px;line-height:1.7;margin-bottom:48px;}
        .lactions{display:flex;gap:16px;align-items:center;flex-wrap:wrap;}
        .lprimary{background:#1a3a2a;color:#f7f4ef;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:18px 36px;border-radius:6px;border:2px solid #1a3a2a;cursor:pointer;font-family:'DM Mono',monospace;transition:all 0.25s;}
        .lprimary:hover{background:#2a5a3a;transform:translateY(-2px);box-shadow:0 12px 32px rgba(26,58,42,0.25);}
        .lghost{font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8278;background:none;border:none;cursor:pointer;font-family:'DM Mono',monospace;transition:color 0.2s;}
        .lghost:hover{color:#1a3a2a;}
        .lbadge{position:absolute;right:80px;top:50%;transform:translateY(-50%);width:200px;height:200px;border-radius:50%;background:#1a3a2a;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px;animation:float 4s ease-in-out infinite;}
        @keyframes float{0%,100%{transform:translateY(-50%)}50%{transform:translateY(calc(-50% - 12px))}}
        .lbadge-num{font-family:'Fraunces',serif;font-size:52px;font-weight:900;color:#a8d878;line-height:1;}
        .lbadge-text{font-size:10px;letter-spacing:0.1em;color:rgba(247,244,239,0.6);text-transform:uppercase;margin-top:8px;line-height:1.5;}
        .lmarquee{background:#1a3a2a;padding:14px 0;overflow:hidden;}
        .lmarquee-track{display:flex;animation:marquee 20s linear infinite;white-space:nowrap;}
        .lmarquee-item{font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(247,244,239,0.4);padding:0 36px;flex-shrink:0;}
        .lmarquee-item span{color:#a8d878;margin-right:36px;}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .lsection{padding:100px 48px;}
        .lstag{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8a8278;margin-bottom:20px;}
        .lstitle{font-family:'Fraunces',serif;font-size:clamp(32px,5vw,60px);font-weight:900;letter-spacing:-0.03em;line-height:1.05;margin-bottom:56px;max-width:680px;color:#1a1a1a;}
        .lstitle em{font-style:italic;color:#1a3a2a;}
        .ltypes{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
        .ltype{background:#fff;border:1.5px solid rgba(26,58,42,0.1);border-radius:14px;padding:28px 24px;transition:all 0.3s;}
        .ltype:hover{border-color:#1a3a2a;transform:translateY(-4px);background:#1a3a2a;}
        .ltype:hover .ltype-title{color:#f7f4ef;}
        .ltype:hover .ltype-desc{color:rgba(247,244,239,0.6);}
        .ltype-emoji{font-size:28px;margin-bottom:16px;}
        .ltype-title{font-family:'Fraunces',serif;font-size:18px;font-weight:700;margin-bottom:8px;transition:color 0.3s;color:#1a1a1a;}
        .ltype-desc{font-size:11px;color:#8a8278;letter-spacing:0.04em;line-height:1.5;transition:color 0.3s;}
        .lwho{background:#1a3a2a;border-radius:20px;margin:0 48px;padding:80px 64px;}
        .lwho-title{font-family:'Fraunces',serif;font-size:clamp(32px,5vw,56px);font-weight:900;color:#f7f4ef;letter-spacing:-0.03em;line-height:1.05;margin-bottom:48px;}
        .lwho-title em{font-style:italic;color:#a8d878;}
        .lwho-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
        .lwho-card{background:rgba(247,244,239,0.06);border:1px solid rgba(247,244,239,0.1);border-radius:12px;padding:32px 28px;}
        .lwho-icon{font-size:32px;margin-bottom:16px;}
        .lwho-name{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:#f7f4ef;margin-bottom:10px;}
        .lwho-desc{font-size:12px;color:rgba(247,244,239,0.5);line-height:1.7;}
        .lfeat-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;background:#ede8e0;border-radius:16px;overflow:hidden;}
        .lfeat{padding:44px;border-bottom:1px solid rgba(26,58,42,0.08);border-right:1px solid rgba(26,58,42,0.08);transition:background 0.3s;}
        .lfeat:hover{background:rgba(26,58,42,0.04);}
        .lfeat:nth-child(even){border-right:none;}
        .lfeat:nth-last-child(-n+2){border-bottom:none;}
        .lfeat-icon{font-size:24px;margin-bottom:18px;}
        .lfeat-title{font-family:'Fraunces',serif;font-size:20px;font-weight:700;margin-bottom:10px;color:#1a1a1a;}
        .lfeat-desc{font-family:'Fraunces',serif;font-size:15px;line-height:1.7;color:#8a8278;}
        .ltests{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        .ltest{background:#fff;border-radius:14px;padding:32px 28px;border:1.5px solid rgba(26,58,42,0.08);transition:all 0.3s;}
        .ltest:hover{box-shadow:0 16px 48px rgba(26,58,42,0.1);transform:translateY(-4px);border-color:#1a3a2a;}
        .ltest-q{font-family:'Fraunces',serif;font-size:16px;line-height:1.75;font-style:italic;margin-bottom:24px;color:#1a1a1a;}
        .ltest-q::before{content:'\201C';color:#1a3a2a;font-size:40px;line-height:0;vertical-align:-14px;margin-right:4px;}
        .ltest-author{display:flex;align-items:center;gap:12px;}
        .ltest-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
        .ltest-name{font-size:12px;font-weight:500;color:#1a1a1a;}
        .ltest-role{font-size:10px;color:#8a8278;margin-top:2px;text-transform:uppercase;letter-spacing:0.06em;}
        .lpricing{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;align-items:start;}
        .lplan{border:1.5px solid rgba(26,58,42,0.12);border-radius:16px;padding:40px 32px;transition:all 0.3s;background:#f7f4ef;}
        .lplan:hover{border-color:#1a3a2a;transform:translateY(-4px);}
        .lplan.feat{background:#1a3a2a;border-color:#1a3a2a;transform:scale(1.04);box-shadow:0 24px 64px rgba(26,58,42,0.3);}
        .lplan.feat:hover{transform:scale(1.04) translateY(-4px);}
        .lbadge2{font-size:10px;letter-spacing:0.12em;text-transform:uppercase;background:#a8d878;color:#1a3a2a;padding:4px 10px;border-radius:20px;display:inline-block;margin-bottom:20px;}
        .lplan-name{font-family:'Fraunces',serif;font-size:22px;font-weight:700;margin-bottom:6px;color:#1a1a1a;}
        .feat .lplan-name{color:#f7f4ef;}
        .lplan-price{font-family:'Fraunces',serif;font-size:52px;font-weight:900;line-height:1;letter-spacing:-0.03em;margin-bottom:6px;color:#1a1a1a;}
        .feat .lplan-price{color:#f7f4ef;}
        .lplan-price sup{font-size:24px;vertical-align:super;}
        .lplan-period{font-size:11px;color:#8a8278;margin-bottom:28px;}
        .feat .lplan-period{color:rgba(247,244,239,0.45);}
        .lplan-div{height:1px;background:rgba(26,58,42,0.1);margin-bottom:24px;}
        .feat .lplan-div{background:rgba(247,244,239,0.1);}
        .lplan-feats{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:32px;}
        .lplan-feats li{font-family:'Fraunces',serif;font-size:15px;display:flex;align-items:flex-start;gap:10px;color:#8a8278;}
        .feat .lplan-feats li{color:rgba(247,244,239,0.7);}
        .lplan-feats li::before{content:'✓';color:#1a3a2a;font-weight:700;flex-shrink:0;}
        .feat .lplan-feats li::before{color:#a8d878;}
        .lplan-feats li.no::before{content:'✗';color:rgba(26,58,42,0.2);}
        .feat .lplan-feats li.no::before{color:rgba(247,244,239,0.2);}
        .lplan-btn{display:block;text-align:center;text-decoration:none;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:15px 24px;border-radius:8px;border:2px solid rgba(26,58,42,0.15);color:#1a3a2a;transition:all 0.25s;cursor:pointer;background:transparent;font-family:'DM Mono',monospace;width:100%;}
        .lplan-btn:hover{border-color:#1a3a2a;background:#1a3a2a;color:#f7f4ef;}
        .feat .lplan-btn{background:#a8d878;color:#1a3a2a;border-color:#a8d878;}
        .feat .lplan-btn:hover{background:#c4f090;}
        .lcta{background:#1a3a2a;margin:0 48px 100px;border-radius:20px;padding:80px 64px;text-align:center;}
        .lcta-title{font-family:'Fraunces',serif;font-size:clamp(32px,5vw,56px);font-weight:900;color:#f7f4ef;line-height:1.1;letter-spacing:-0.03em;margin-bottom:20px;}
        .lcta-title em{font-style:italic;color:#a8d878;}
        .lcta-sub{font-family:'Fraunces',serif;font-size:18px;color:rgba(247,244,239,0.5);margin-bottom:40px;max-width:460px;margin-left:auto;margin-right:auto;line-height:1.6;}
        .lcta-note{font-size:11px;color:rgba(247,244,239,0.25);margin-top:20px;letter-spacing:0.08em;}
        .lfooter{border-top:1px solid rgba(26,58,42,0.1);padding:40px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;}
        .lfooter-logo{font-family:'Fraunces',serif;font-size:18px;font-weight:900;color:#1a3a2a;}
        .lfooter-logo span{background:#1a3a2a;color:#a8d878;padding:1px 6px;border-radius:3px;}
        .lfooter-links{display:flex;gap:24px;}
        .lfooter-links a{font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8278;text-decoration:none;}
        .lfooter-copy{font-size:10px;color:#8a8278;text-transform:uppercase;}
        .ldivider{height:1px;background:rgba(26,58,42,0.08);margin:0 48px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:900px){
          .lnav{padding:16px 24px;}
          .lnav-links{display:none;}
          .lhero{padding:100px 24px 60px;}
          .lbadge{display:none;}
          .lsection{padding:64px 24px;}
          .ltypes{grid-template-columns:1fr 1fr;}
          .lwho{margin:0 24px;padding:48px 32px;}
          .lwho-grid{grid-template-columns:1fr;}
          .lfeat-grid{grid-template-columns:1fr;}
          .lfeat{border-right:none;}
          .ltests{grid-template-columns:1fr;}
          .lpricing{grid-template-columns:1fr;}
          .lplan.feat{transform:none;}
          .lcta{margin:0 24px 60px;padding:56px 32px;}
          .lfooter{padding:32px 24px;}
          .ldivider{margin:0 24px;}
        }
      `}</style>

      {/* NAV */}
      <nav className="lnav">
        <button className="llogo">Pro<span>Mail</span></button>
        <div className="lnav-links">
          <a href="#types">Email Types</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <button onClick={onStart} className="lplan-btn lnav-cta" style={{width:"auto",padding:"10px 20px"}}>Try Free →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="lhero">
        <div className="ltag">Built for African Professionals</div>
        <h1 className="lh1">Your words.<br /><em>Their</em> <span className="hl">respect.</span></h1>
        <p className="lsub">ProMail writes professional emails for African business in seconds — formal enough for government, sharp enough for corporates, warm enough for partners.</p>
        <div className="lactions">
          <button onClick={onStart} className="lprimary">Write my email — free</button>
          <button className="lghost" onClick={() => document.getElementById('types').scrollIntoView()}>See email types →</button>
        </div>
        <div className="lbadge">
          <div className="lbadge-num">8</div>
          <div className="lbadge-text">Email types covered</div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="lmarquee">
        <div className="lmarquee-track">
          {["Request emails","Follow-ups that get responses","Formal complaints","Business proposals","Professional introductions","Resignation letters","Request emails","Follow-ups that get responses","Formal complaints","Business proposals","Professional introductions","Resignation letters"].map((t,i) => (
            <div key={i} className="lmarquee-item"><span>✦</span>{t}</div>
          ))}
        </div>
      </div>

      {/* EMAIL TYPES */}
      <section className="lsection" id="types">
        <div className="lstag">What we cover</div>
        <h2 className="lstitle">Every email you <em>dread</em> writing</h2>
        <div className="ltypes">
          {EMAIL_TYPES.map(t => (
            <div key={t.id} className="ltype">
              <div className="ltype-emoji">{t.emoji}</div>
              <div className="ltype-title">{t.label}</div>
              <div className="ltype-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="ldivider" />

      {/* WHO IT'S FOR */}
      <div className="lwho">
        <div className="lwho-title">Built for <em>every</em> African professional</div>
        <div className="lwho-grid">
          <div className="lwho-card"><div className="lwho-icon">🏢</div><div className="lwho-name">Corporate Professionals</div><div className="lwho-desc">Write to clients, senior management, and board members with the right tone every time</div></div>
          <div className="lwho-card"><div className="lwho-icon">🏛️</div><div className="lwho-name">Government & NGO Staff</div><div className="lwho-desc">Navigate formal correspondence with regulatory bodies, donors, and government agencies</div></div>
          <div className="lwho-card"><div className="lwho-icon">💼</div><div className="lwho-name">Entrepreneurs & SMEs</div><div className="lwho-desc">Communicate with partners, vendors, and investors like a seasoned professional</div></div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="lsection" id="features">
        <div className="lstag">Features</div>
        <h2 className="lstitle">Everything your email <em>needs</em></h2>
        <div className="lfeat-grid">
          <div className="lfeat"><div className="lfeat-icon">🌍</div><div className="lfeat-title">African business context</div><div className="lfeat-desc">Written for how business is actually done in Nigeria, Ghana, Kenya, and across the continent — not American or British templates.</div></div>
          <div className="lfeat"><div className="lfeat-icon">📝</div><div className="lfeat-title">Subject line included</div><div className="lfeat-desc">Every email comes with a ready-to-use subject line. Copy both with one click and paste directly into your email client.</div></div>
          <div className="lfeat"><div className="lfeat-icon">🎯</div><div className="lfeat-title">3 tone levels</div><div className="lfeat-desc">Formal for government and regulators, Professional for corporate clients, Friendly for colleagues and partners.</div></div>
          <div className="lfeat"><div className="lfeat-icon">⚡</div><div className="lfeat-title">Under 60 seconds</div><div className="lfeat-desc">Describe your situation, click generate, and your professional email is ready faster than you can open a template.</div></div>
          <div className="lfeat"><div className="lfeat-icon">✏️</div><div className="lfeat-title">No robotic language</div><div className="lfeat-desc">No "I hope this email finds you well." Every email sounds like a real, confident professional wrote it intentionally.</div></div>
          <div className="lfeat"><div className="lfeat-icon">🔁</div><div className="lfeat-title">Regenerate instantly</div><div className="lfeat-desc">Not satisfied? Hit regenerate and get a completely fresh version in seconds. No extra cost, no waiting.</div></div>
        </div>
      </section>

      <div className="ldivider" />

      {/* TESTIMONIALS */}
      <section className="lsection">
        <div className="lstag">Results</div>
        <h2 className="lstitle">Professionals getting <em>results</em></h2>
        <div className="ltests">
          <div className="ltest"><div className="ltest-q">I used it to write a complaint to my bank and got a response within 24 hours. The formal tone was exactly right — firm but not aggressive.</div><div className="ltest-author"><div className="ltest-avatar" style={{background:"#d1fae5"}}>👩‍💼</div><div><div className="ltest-name">Amaka O.</div><div className="ltest-role">Finance Manager · Lagos</div></div></div></div>
          <div className="ltest"><div className="ltest-q">Writing proposals used to take me half a day. Now I describe what I want, generate the email, and spend my time actually doing business.</div><div className="ltest-author"><div className="ltest-avatar" style={{background:"#fef3c7"}}>🧑‍💻</div><div><div className="ltest-name">Emeka T.</div><div className="ltest-role">SME Owner · Abuja</div></div></div></div>
          <div className="ltest"><div className="ltest-q">As someone who didn't grow up writing formal English, this tool has been a game changer. My emails now sound like I've been in corporate for 20 years.</div><div className="ltest-author"><div className="ltest-avatar" style={{background:"#ede9fe"}}>👨‍🎓</div><div><div className="ltest-name">Kwame A.</div><div className="ltest-role">Graduate Trainee · Accra</div></div></div></div>
        </div>
      </section>

      <div className="ldivider" />

      {/* PRICING */}
      <section className="lsection" id="pricing">
        <div className="lstag">Pricing</div>
        <h2 className="lstitle">Simple, <em>honest</em> pricing</h2>
        <div className="lpricing">
          <div className="lplan">
            <div className="lplan-name">Starter</div>
            <div className="lplan-price"><sup>$</sup>0</div>
            <div className="lplan-period">Free forever</div>
            <div className="lplan-div" />
            <ul className="lplan-feats">
              <li>5 emails per month</li>
              <li>All 8 email types</li>
              <li>All 3 tone options</li>
              <li>Subject line included</li>
              <li className="no">Unlimited emails</li>
              <li className="no">Email history</li>
            </ul>
            <button onClick={onStart} className="lplan-btn">Start free</button>
          </div>
          <div className="lplan feat">
            <div className="lbadge2">Most Popular</div>
            <div className="lplan-name">Pro</div>
            <div className="lplan-price"><sup>$</sup>9</div>
            <div className="lplan-period">per month · cancel anytime</div>
            <div className="lplan-div" />
            <ul className="lplan-feats">
              <li>Unlimited emails</li>
              <li>All 8 email types</li>
              <li>All 3 tone options</li>
              <li>Subject line included</li>
              <li>Email history (30 days)</li>
              <li className="no">Priority support</li>
            </ul>
            <a href={SELAR_LINK} target="_blank" rel="noreferrer" className="lplan-btn">Get Pro</a>
          </div>
          <div className="lplan">
            <div className="lplan-name">Lifetime</div>
            <div className="lplan-price"><sup>$</sup>49</div>
            <div className="lplan-period">one-time payment</div>
            <div className="lplan-div" />
            <ul className="lplan-feats">
              <li>Unlimited emails, forever</li>
              <li>All 8 email types</li>
              <li>All 3 tone options</li>
              <li>Subject line included</li>
              <li>Email history (unlimited)</li>
              <li>Priority support</li>
            </ul>
            <a href={SELAR_LINK} target="_blank" rel="noreferrer" className="lplan-btn">Get Lifetime</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="lcta">
        <div className="lcta-title">Your next email could<br />open the <em>right door.</em></div>
        <p className="lcta-sub">Write it in 60 seconds. Professional, tailored, and ready to send.</p>
        <button onClick={onStart} className="lprimary" style={{background:"#a8d878",color:"#1a3a2a",borderColor:"#a8d878",fontSize:"13px",padding:"20px 44px"}}>Write my email — free</button>
        <div className="lcta-note">No credit card · No signup · 5 free emails per month</div>
      </div>

      {/* FOOTER */}
      <footer className="lfooter">
        <div className="lfooter-logo">Pro<span>Mail</span></div>
        <div className="lfooter-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
        <div className="lfooter-copy">© 2026 ProMail</div>
      </footer>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [page, setPage] = useState("landing");
  const [step, setStep] = useState(0);
  const [emailType, setEmailType] = useState("");
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("professional");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [emailCount, setEmailCount] = useState(() => parseInt(localStorage.getItem("promail_count") || "0"));
  const [showPaywall, setShowPaywall] = useState(false);
  const outputRef = useRef(null);

  useEffect(() => {
    if (body && outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [body]);

  if (page === "landing") return <LandingPage onStart={() => setPage("app")} />;

  const generate = async () => {
    if (!context.trim() || !emailType) return;
    if (emailCount >= FREE_LIMIT) { setShowPaywall(true); return; }
    setLoading(true); setStreaming(true); setBody(""); setSubject(""); setError(""); setStep(2);

    const toneMap = {
      formal: "very formal and official, appropriate for government offices and senior executives",
      professional: "professional and polished, appropriate for business clients and corporate communications",
      friendly: "warm and professional, appropriate for colleagues and familiar contacts",
    };
    const typeMap = {
      request: "a formal request email", followup: "a follow-up email to chase a previous communication",
      introduction: "a professional introduction email", complaint: "a formal complaint email that is firm but respectful",
      proposal: "a business proposal email", apology: "a professional apology email",
      thankyou: "a formal thank you email", resignation: "a professional resignation email",
    };

    const prompt = `Write ${typeMap[emailType]} for an African business professional.
Context: ${context}
Recipient: ${recipient || "the relevant party"}
Tone: ${toneMap[tone]}
Instructions:
- Complete professional email ready to send
- Clear formal English appropriate for African business culture
- Direct and specific — no vague filler
- Under 250 words for the body
- Include a strong subject line
- Sound like a confident educated African professional wrote it
Format EXACTLY like this:
SUBJECT: [subject line]
---
[email body]`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({ model: "claude-sonnet-4-5-20250929", max_tokens: 1000, stream: true, messages: [{ role: "user", content: prompt }] }),
      });
      if (!resp.ok) { const e = await resp.json(); throw new Error(`${resp.status}: ${e?.error?.message}`); }
      const reader = resp.body.getReader(); const decoder = new TextDecoder(); let buffer = ""; let full = "";
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n"); buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "content_block_delta" && data.delta?.text) {
                full += data.delta.text;
                if (full.includes("---")) { const parts = full.split("---"); setSubject(parts[0].replace("SUBJECT:", "").trim()); setBody(parts.slice(1).join("---").trim()); }
                else setBody(full);
              }
            } catch {}
          }
        }
      }
    } catch (e) { setError(`Error: ${e.message}`); setStep(1); }
    finally {
      setLoading(false); setStreaming(false);
      const n = emailCount + 1; setEmailCount(n); localStorage.setItem("promail_count", n);
    }
  };

  const copyAll = () => { navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copySubject = () => { navigator.clipboard.writeText(subject); setCopiedSubject(true); setTimeout(() => setCopiedSubject(false), 2000); };
  const reset = () => { setStep(0); setBody(""); setSubject(""); setError(""); setEmailType(""); setContext(""); setRecipient(""); setTone("professional"); setShowPaywall(false); };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef", fontFamily: "'DM Mono', monospace", padding: "0 0 80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap');
        *{box-sizing:border-box;}
        ::placeholder{color:#b8b0a4 !important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .tc:hover{background:#fff !important;border-color:#1a3a2a !important;transform:translateY(-2px);}
        .gb:hover:not(:disabled){background:#2a5a3a !important;}
      `}</style>

      {/* Header */}
      <div style={{ background: "#1a3a2a", padding: "28px 24px", textAlign: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 640, margin: "0 auto" }}>
          <button onClick={() => setPage("landing")} style={{ background: "none", border: "none", color: "rgba(247,244,239,0.5)", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", letterSpacing: "0.08em" }}>← Back</button>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(20px,4vw,30px)", fontWeight: 900, color: "#f7f4ef", letterSpacing: "-0.02em" }}>
              Write Emails That <em style={{ color: "#a8d878" }}>Command Respect</em>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(247,244,239,0.4)", marginTop: 4 }}>Professional emails for African business — in seconds</div>
          </div>
          <div style={{ width: 60 }} />
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px" }}>
        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", padding: "32px 0 28px" }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: i <= step ? "#1a3a2a" : "transparent", border: `2px solid ${i <= step ? "#1a3a2a" : "#d4cdc4"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: i <= step ? "#f7f4ef" : "#b8b0a4", transition: "all 0.3s" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: i === step ? "#1a3a2a" : "#b8b0a4", whiteSpace: "nowrap", fontWeight: i === step ? 500 : 400 }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1.5, background: i < step ? "#1a3a2a" : "#d4cdc4", margin: "0 8px", marginTop: -16, transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>

        {/* Free emails counter */}
        {!showPaywall && emailCount > 0 && emailCount < FREE_LIMIT && (
          <div style={{ background: "#f0f9e8", border: "1.5px solid #c8e8a0", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#2a5a3a" }}>{FREE_LIMIT - emailCount} free email{FREE_LIMIT - emailCount !== 1 ? "s" : ""} remaining</span>
            <a href={SELAR_LINK} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#1a3a2a", fontWeight: 500, textDecoration: "underline" }}>Upgrade for unlimited →</a>
          </div>
        )}

        {/* Paywall */}
        {showPaywall && (
          <div style={{ animation: "fadeUp 0.4s ease", textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 900, color: "#1a3a2a", marginBottom: 12, lineHeight: 1.2 }}>You've used your 5 free emails</div>
            <p style={{ fontSize: 13, color: "#8a8278", lineHeight: 1.8, marginBottom: 32, maxWidth: 360, margin: "0 auto 32px" }}>Upgrade to Pro for unlimited emails, all 8 types, and subject lines included.</p>
            <a href={SELAR_LINK} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "#1a3a2a", color: "#f7f4ef", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", padding: "18px 40px", borderRadius: 8, textDecoration: "none" }}>Upgrade to Pro — ₦75,000</a>
            <div style={{ fontSize: 11, color: "#b8b0a4", marginTop: 16 }}>One-time payment · Unlimited forever</div>
          </div>
        )}

        {/* Step 0 */}
        {!showPaywall && step === 0 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>What type of email?</div>
              <div style={{ fontSize: 12, color: "#8a8278" }}>Select the email you need to write</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
              {EMAIL_TYPES.map(type => (
                <button key={type.id} onClick={() => setEmailType(type.id)} className="tc" style={{ background: emailType === type.id ? "#1a3a2a" : "#fff", border: `1.5px solid ${emailType === type.id ? "#1a3a2a" : "#e8e2da"}`, borderRadius: 10, padding: "16px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{type.emoji}</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: emailType === type.id ? "#f7f4ef" : "#1a1a1a", marginBottom: 4 }}>{type.label}</div>
                  <div style={{ fontSize: 10, color: emailType === type.id ? "rgba(247,244,239,0.6)" : "#a8a09a", letterSpacing: "0.04em" }}>{type.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} disabled={!emailType} className="gb" style={{ width: "100%", padding: "16px", background: emailType ? "#1a3a2a" : "#e8e2da", color: emailType ? "#f7f4ef" : "#b8b0a4", border: "none", borderRadius: 10, fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em", cursor: emailType ? "pointer" : "not-allowed", transition: "all 0.2s", textTransform: "uppercase" }}>Next — Add Details →</button>
          </div>
        )}

        {/* Step 1 */}
        {!showPaywall && step === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>Give me the details</div>
              <div style={{ fontSize: 12, color: "#8a8278" }}>The more context you give, the better your email</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", color: "#1a3a2a", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Who are you writing to? <span style={{ color: "#b8b0a4", textTransform: "none" }}>— optional</span></label>
                <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="e.g. HR Manager at GTBank, The Director of NAFDAC..." style={{ width: "100%", background: "#fff", border: "1.5px solid #e8e2da", borderRadius: 10, color: "#1a1a1a", fontFamily: "'DM Mono', monospace", fontSize: 13, padding: "13px 16px", outline: "none", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = "#1a3a2a"} onBlur={e => e.target.style.borderColor = "#e8e2da"} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", color: "#1a3a2a", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>What is this email about? <span style={{ color: "#e85c3a" }}>*</span></label>
                <textarea value={context} onChange={e => setContext(e.target.value)} rows={6} placeholder="Describe what you want to say. e.g. I want to follow up on my job application submitted 2 weeks ago..." style={{ width: "100%", background: "#fff", border: "1.5px solid #e8e2da", borderRadius: 10, color: "#1a1a1a", fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.7, padding: "14px 16px", outline: "none", resize: "vertical", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = "#1a3a2a"} onBlur={e => e.target.style.borderColor = "#e8e2da"} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", color: "#1a3a2a", textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>Tone</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {TONES.map(t => (
                    <button key={t.id} onClick={() => setTone(t.id)} style={{ background: tone === t.id ? "#1a3a2a" : "#fff", border: `1.5px solid ${tone === t.id ? "#1a3a2a" : "#e8e2da"}`, borderRadius: 10, padding: "14px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 700, color: tone === t.id ? "#f7f4ef" : "#1a1a1a", marginBottom: 4 }}>{t.label}</div>
                      <div style={{ fontSize: 10, color: tone === t.id ? "rgba(247,244,239,0.55)" : "#a8a09a", letterSpacing: "0.03em" }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setStep(0)} style={{ flex: "0 0 auto", padding: "15px 20px", background: "transparent", border: "1.5px solid #d4cdc4", color: "#8a8278", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>← Back</button>
              <button onClick={generate} disabled={!context.trim()} className="gb" style={{ flex: 1, padding: "15px", background: context.trim() ? "#1a3a2a" : "#e8e2da", color: context.trim() ? "#f7f4ef" : "#b8b0a4", border: "none", borderRadius: 10, fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: context.trim() ? "pointer" : "not-allowed", transition: "all 0.2s" }}>✦ Write My Email</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {!showPaywall && step === 2 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Your Email</div>
                {streaming && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a3a2a", animation: "blink 1.2s infinite" }} /><span style={{ fontSize: 10, letterSpacing: "0.1em", color: "#1a3a2a", textTransform: "uppercase" }}>Writing...</span></div>}
              </div>
              {body && !streaming && <button onClick={copyAll} style={{ padding: "9px 16px", background: copied ? "#1a3a2a" : "#fff", border: `1.5px solid ${copied ? "#1a3a2a" : "#e8e2da"}`, color: copied ? "#f7f4ef" : "#1a1a1a", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s" }}>{copied ? "✓ Copied" : "Copy All"}</button>}
            </div>
            {error && <div style={{ background: "#fef0ed", border: "1.5px solid #f4b8a8", borderRadius: 10, padding: 16, color: "#c0392b", fontSize: 12, marginBottom: 16 }}>{error}</div>}
            {subject && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#1a3a2a", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Subject Line</div>
                <div style={{ background: "#fff", border: "1.5px solid #e8e2da", borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{subject}</span>
                  <button onClick={copySubject} style={{ padding: "6px 12px", flexShrink: 0, background: copiedSubject ? "#1a3a2a" : "transparent", border: `1px solid ${copiedSubject ? "#1a3a2a" : "#d4cdc4"}`, color: copiedSubject ? "#f7f4ef" : "#8a8278", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 10, transition: "all 0.2s" }}>{copiedSubject ? "✓" : "Copy"}</button>
                </div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#1a3a2a", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Email Body</div>
              <div ref={outputRef} style={{ background: "#fff", border: "1.5px solid #e8e2da", borderRadius: 10, padding: "20px 22px", minHeight: 240, maxHeight: 420, overflowY: "auto", fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.9, color: "#2a2a2a", whiteSpace: "pre-wrap" }}>
                {body || <span style={{ color: "#c8bfb4", fontStyle: "italic" }}>Your email will appear here...</span>}
                {streaming && <span style={{ display: "inline-block", width: 2, height: "1em", background: "#1a3a2a", marginLeft: 2, animation: "blink 1s infinite", verticalAlign: "text-bottom" }} />}
              </div>
            </div>
            {body && !streaming && (
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={reset} style={{ flex: 1, padding: "14px", background: "transparent", border: "1.5px solid #d4cdc4", color: "#8a8278", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>← New Email</button>
                <button onClick={() => { setStep(1); setBody(""); setSubject(""); }} style={{ flex: 1, padding: "14px", background: "#1a3a2a", color: "#f7f4ef", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>↻ Regenerate</button>
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 24, fontSize: 10, letterSpacing: "0.1em", color: "#c8bfb4" }}>PROMAIL · PROFESSIONAL EMAILS FOR AFRICAN BUSINESS</div>
          </div>
        )}
      </div>
    </div>
  );
}
