import { useState, useRef, useEffect } from "react";

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

export default function App() {
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
  const [emailCount, setEmailCount] = useState(() => parseInt(localStorage.getItem('promail_count') || '0'));
  const [showPaywall, setShowPaywall] = useState(false);
  const outputRef = useRef(null);

  useEffect(() => {
    if (body && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [body]);

  const generate = async () => {
    if (!context.trim() || !emailType) return;
    if (emailCount >= 5) { setShowPaywall(true); return; }
    setLoading(true);
    setStreaming(true);
    setBody("");
    setSubject("");
    setError("");
    setStep(2);

    const toneMap = {
      formal: "very formal and official, appropriate for government offices, regulatory bodies, and senior executives",
      professional: "professional and polished, appropriate for business clients and corporate communications",
      friendly: "warm and professional, appropriate for colleagues, partners, and familiar contacts",
    };

    const typeMap = {
      request: "a formal request email",
      followup: "a follow-up email to chase a previous communication",
      introduction: "a professional introduction email",
      complaint: "a formal complaint email that is firm but respectful",
      proposal: "a business proposal email",
      apology: "a professional apology email",
      thankyou: "a formal thank you email",
      resignation: "a professional resignation email",
    };

    const prompt = `Write ${typeMap[emailType]} for an African business professional.

Context and details provided by the sender:
${context}

Recipient/Organisation: ${recipient || "the relevant party"}
Tone: ${toneMap[tone]}

Instructions:
- Write a complete, professional email ready to send
- Use clear, formal English appropriate for African business culture
- Be direct and specific — no vague filler sentences
- Keep it concise but comprehensive — under 250 words for the body
- Include a strong subject line
- Use appropriate salutation and closing for the tone
- Make it sound like a confident, educated African professional wrote it

Format your response EXACTLY like this:
SUBJECT: [subject line here]
---
[email body here]`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 1000,
          stream: true,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(`${resp.status}: ${errData?.error?.message || "API error"}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "content_block_delta" && data.delta?.text) {
                fullText += data.delta.text;
                if (fullText.includes("---")) {
                  const parts = fullText.split("---");
                  const subjectLine = parts[0].replace("SUBJECT:", "").trim();
                  setSubject(subjectLine);
                  setBody(parts.slice(1).join("---").trim());
                } else {
                  setBody(fullText);
                }
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
      setStep(1);
    } finally {
      setLoading(false);
      setStreaming(false);
      const newCount = emailCount + 1;
      setEmailCount(newCount);
      localStorage.setItem('promail_count', newCount);
    }
  };

  const copyAll = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySubject = () => {
    navigator.clipboard.writeText(subject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const reset = () => {
    setStep(0);
    setBody("");
    setSubject("");
    setError("");
    setEmailType("");
    setContext("");
    setRecipient("");
    setTone("professional");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef", fontFamily: "'DM Mono', monospace", padding: "0 0 80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #b8b0a4 !important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .type-card:hover { background: #fff !important; border-color: #1a3a2a !important; transform: translateY(-2px); }
        .gen-btn:hover:not(:disabled) { background: #2a5a3a !important; }
      `}</style>

      <div style={{ background: "#1a3a2a", padding: "32px 24px 28px", textAlign: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px,5vw,38px)", fontWeight: 900, color: "#f7f4ef", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Write Emails That <em style={{ color: "#a8d878" }}>Command Respect</em>
        </h1>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(247,244,239,0.45)", margin: "10px 0 0", letterSpacing: "0.04em" }}>
          Professional emails for African business — in seconds
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px" }}>
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

        {showPaywall && (
          <div style={{ animation: "fadeUp 0.4s ease", textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 900, color: "#1a3a2a", marginBottom: 12, lineHeight: 1.2 }}>
              You've used your 5 free emails
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#8a8278", lineHeight: 1.8, marginBottom: 32, maxWidth: 360, margin: "0 auto 32px" }}>
              Upgrade to Pro for unlimited emails,<br />all 8 types, and subject lines included.
            </p>
            <a href="https://selar.com/YOUR_PROMAIL_LINK" target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "#1a3a2a", color: "#f7f4ef", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", padding: "18px 40px", borderRadius: 8, textDecoration: "none" }}>
              Upgrade to Pro — ₦14,000
            </a>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#b8b0a4", marginTop: 16 }}>
              One-time or monthly · Cancel anytime
            </div>
          </div>
        )}

        {!showPaywall && emailCount > 0 && emailCount < 5 && (
          <div style={{ background: "#f0f9e8", border: "1.5px solid #c8e8a0", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#2a5a3a" }}>
              {5 - emailCount} free email{5 - emailCount !== 1 ? "s" : ""} remaining
            </span>
            <a href="https://selar.com/YOUR_PROMAIL_LINK" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#1a3a2a", fontWeight: 500, textDecoration: "underline" }}>
              Upgrade for unlimited →
            </a>
          </div>
        )}

        {step === 0 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>What type of email?</div>
              <div style={{ fontSize: 12, color: "#8a8278", letterSpacing: "0.04em" }}>Select the email you need to write</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
              {EMAIL_TYPES.map(type => (
                <button key={type.id} onClick={() => setEmailType(type.id)} className="type-card" style={{ background: emailType === type.id ? "#1a3a2a" : "#fff", border: `1.5px solid ${emailType === type.id ? "#1a3a2a" : "#e8e2da"}`, borderRadius: 10, padding: "16px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s ease" }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{type.emoji}</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: emailType === type.id ? "#f7f4ef" : "#1a1a1a", marginBottom: 4 }}>{type.label}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: emailType === type.id ? "rgba(247,244,239,0.6)" : "#a8a09a", letterSpacing: "0.04em" }}>{type.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} disabled={!emailType} className="gen-btn" style={{ width: "100%", padding: "16px", background: emailType ? "#1a3a2a" : "#e8e2da", color: emailType ? "#f7f4ef" : "#b8b0a4", border: "none", borderRadius: 10, fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em", cursor: emailType ? "pointer" : "not-allowed", transition: "all 0.2s", textTransform: "uppercase" }}>
              Next — Add Details →
            </button>
          </div>
        )}

        {step === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>Give me the details</div>
              <div style={{ fontSize: 12, color: "#8a8278", letterSpacing: "0.04em" }}>The more context you give, the better your email</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", color: "#1a3a2a", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Who are you writing to? <span style={{ color: "#b8b0a4", textTransform: "none", letterSpacing: 0 }}>— optional</span></label>
                <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="e.g. HR Manager at GTBank, The Director of NAFDAC..." style={{ width: "100%", background: "#fff", border: "1.5px solid #e8e2da", borderRadius: 10, color: "#1a1a1a", fontFamily: "'DM Mono', monospace", fontSize: 13, padding: "13px 16px", outline: "none", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = "#1a3a2a"} onBlur={e => e.target.style.borderColor = "#e8e2da"} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", color: "#1a3a2a", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>What is this email about? <span style={{ color: "#e85c3a" }}>*</span></label>
                <textarea value={context} onChange={e => setContext(e.target.value)} rows={6} placeholder="Describe what you want to say. e.g. I want to follow up on my job application I submitted 2 weeks ago..." style={{ width: "100%", background: "#fff", border: "1.5px solid #e8e2da", borderRadius: 10, color: "#1a1a1a", fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.7, padding: "14px 16px", outline: "none", resize: "vertical", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = "#1a3a2a"} onBlur={e => e.target.style.borderColor = "#e8e2da"} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10, letterSpacing: "0.12em", color: "#1a3a2a", textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>Tone</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {TONES.map(t => (
                    <button key={t.id} onClick={() => setTone(t.id)} style={{ background: tone === t.id ? "#1a3a2a" : "#fff", border: `1.5px solid ${tone === t.id ? "#1a3a2a" : "#e8e2da"}`, borderRadius: 10, padding: "14px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontWeight: 700, color: tone === t.id ? "#f7f4ef" : "#1a1a1a", marginBottom: 4 }}>{t.label}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: tone === t.id ? "rgba(247,244,239,0.55)" : "#a8a09a", letterSpacing: "0.03em" }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setStep(0)} style={{ flex: "0 0 auto", padding: "15px 20px", background: "transparent", border: "1.5px solid #d4cdc4", color: "#8a8278", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>← Back</button>
              <button onClick={generate} disabled={!context.trim()} className="gen-btn" style={{ flex: 1, padding: "15px", background: context.trim() ? "#1a3a2a" : "#e8e2da", color: context.trim() ? "#f7f4ef" : "#b8b0a4", border: "none", borderRadius: 10, fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", cursor: context.trim() ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                ✦ Write My Email
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
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
                <button onClick={reset} style={{ flex: 1, padding: "14px", background: "transparent", border: "1.5px solid #d4cdc4", color: "#8a8278", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s" }}>← New Email</button>
                <button onClick={() => { setStep(1); setBody(""); setSubject(""); }} style={{ flex: 1, padding: "14px", background: "#1a3a2a", color: "#f7f4ef", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s" }}>↻ Regenerate</button>
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 24, fontSize: 10, letterSpacing: "0.1em", color: "#c8bfb4" }}>PROMAIL · AI-POWERED PROFESSIONAL EMAILS</div>
          </div>
        )}
      </div>
    </div>
  );
}
