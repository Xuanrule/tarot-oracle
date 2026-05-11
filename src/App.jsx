import { useState, useEffect } from "react";

const MAJOR_ARCANA = [
  { id: 0, name: "愚者", emoji: "🌟", keywords: "新开始・自由・冒险", color: "#C4A882" },
  { id: 1, name: "魔术师", emoji: "✨", keywords: "意志力・技巧・行动", color: "#8B6F9E" },
  { id: 2, name: "女祭司", emoji: "🌙", keywords: "直觉・神秘・内在智慧", color: "#5B8DB8" },
  { id: 3, name: "女皇", emoji: "🌸", keywords: "丰盛・创造・母性", color: "#8FB87A" },
  { id: 4, name: "皇帝", emoji: "👑", keywords: "权威・稳定・秩序", color: "#C17B5A" },
  { id: 5, name: "教皇", emoji: "🔮", keywords: "传统・信仰・精神指引", color: "#7B8DB8" },
  { id: 6, name: "恋人", emoji: "💫", keywords: "爱情・选择・和谐", color: "#C48B9E" },
  { id: 7, name: "战车", emoji: "⚡", keywords: "胜利・控制・意志", color: "#B8A85B" },
  { id: 8, name: "力量", emoji: "🦁", keywords: "勇气・耐心・内在力量", color: "#D4A843" },
  { id: 9, name: "隐士", emoji: "🕯", keywords: "内省・孤独・寻求智慧", color: "#A0A0A0" },
  { id: 10, name: "命运之轮", emoji: "🌀", keywords: "命运・转机・循环", color: "#7A9E8F" },
  { id: 11, name: "正义", emoji: "⚖️", keywords: "公正・平衡・真相", color: "#8BB87A" },
  { id: 12, name: "倒吊人", emoji: "🌿", keywords: "暂停・牺牲・新视角", color: "#5B8D9E" },
  { id: 13, name: "死神", emoji: "🌑", keywords: "结束・转变・重生", color: "#6B7B8B" },
  { id: 14, name: "节制", emoji: "🌊", keywords: "平衡・耐心・调和", color: "#7AB8B0" },
  { id: 15, name: "恶魔", emoji: "🔗", keywords: "束缚・物欲・阴暗面", color: "#8B6060" },
  { id: 16, name: "塔", emoji: "⚡", keywords: "突变・打破・启示", color: "#C07050" },
  { id: 17, name: "星星", emoji: "⭐", keywords: "希望・灵感・指引", color: "#7A8FB8" },
  { id: 18, name: "月亮", emoji: "🌙", keywords: "幻象・恐惧・潜意识", color: "#8B7AB8" },
  { id: 19, name: "太阳", emoji: "☀️", keywords: "喜悦・活力・成功", color: "#D4B043" },
  { id: 20, name: "审判", emoji: "🎺", keywords: "觉醒・救赎・反思", color: "#8FA0B8" },
  { id: 21, name: "世界", emoji: "🌍", keywords: "完成・整合・成就", color: "#7AAB7A" },
];

const POSITIONS = ["过去", "现在", "未来"];

function TarotCard({ card, isReversed, isFlipping, isRevealed, position, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isFlipping) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isFlipping, delay]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{
        fontSize: "11px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#A89070",
        fontFamily: "'Ma Shan Zheng', serif",
      }}>{position}</div>
      <div style={{
        width: "110px",
        height: "190px",
        perspective: "600px",
        cursor: "default",
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
          transform: visible && isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}>
          {/* 背面 */}
          <div style={{
            position: "absolute", width: "100%", height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #1a1020 0%, #2a1a35 50%, #1a1020 100%)",
            border: "1.5px solid #5a3a7a",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 24px rgba(80,30,120,0.3)",
          }}>
            <div style={{
              width: "80px", height: "80px",
              borderRadius: "50%",
              border: "1px solid #5a3a7a",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px",
              background: "radial-gradient(circle, rgba(90,58,122,0.3) 0%, transparent 70%)",
            }}>✦</div>
          </div>
          {/* 正面 */}
          <div style={{
            position: "absolute", width: "100%", height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "10px",
            background: `linear-gradient(160deg, #1a1020 0%, #251535 60%, #1e1228 100%)`,
            border: `1.5px solid ${card ? card.color : "#5a3a7a"}`,
            boxShadow: card ? `0 4px 28px ${card.color}44, 0 0 0 0.5px ${card.color}33` : "none",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "12px 8px",
            transform: isReversed ? "rotateY(180deg) rotate(180deg)" : "rotateY(180deg)",
          }}>
            {card && (
              <>
                <div style={{ fontSize: "36px", marginBottom: "8px", filter: `drop-shadow(0 0 6px ${card.color})` }}>{card.emoji}</div>
                <div style={{
                  fontSize: "15px",
                  fontFamily: "'Ma Shan Zheng', serif",
                  color: "#F0E8D8",
                  marginBottom: "4px",
                  textAlign: "center",
                  letterSpacing: "0.05em",
                }}>{card.name}</div>
                <div style={{
                  fontSize: "9px",
                  color: card.color,
                  textAlign: "center",
                  letterSpacing: "0.08em",
                  lineHeight: 1.5,
                  opacity: 0.85,
                }}>{card.keywords}</div>
                {isReversed && (
                  <div style={{
                    marginTop: "6px",
                    fontSize: "8px",
                    color: "#C06080",
                    letterSpacing: "0.1em",
                    border: "0.5px solid #C06080",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}>逆位</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.6 + 0.2,
  delay: Math.random() * 3,
}));

export default function TarotApp() {
  const [question, setQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState([]);
  const [reversals, setReversals] = useState([]);
  const [flipping, setFlipping] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [aiReading, setAiReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("input");

  const drawCards = () => {
    if (!question.trim()) return;
    const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 3);
    const rev = [Math.random() > 0.5, Math.random() > 0.5, Math.random() > 0.5];
    setDrawnCards(picked);
    setReversals(rev);
    setFlipping(true);
    setPhase("cards");
    setAiReading("");
    setTimeout(() => setRevealed(true), 200);
    setTimeout(() => fetchReading(picked, rev), 2400);
  };

  const fetchReading = async (cards, rev) => {
    setLoading(true);
    const cardDesc = cards.map((c, i) =>
      `${POSITIONS[i]}：${c.name}（${rev[i] ? "逆位" : "正位"}，关键词：${c.keywords}）`
    ).join("\n");

    const prompt = `你是一位充满智慧与神秘气息的塔罗占卜师。请用中文，以优美、深邃的语言为来访者进行解读。

来访者的问题：${question}

抽到的三张牌：
${cardDesc}

请以"📿 塔罗启示"开头，分别解读三张牌（过去、现在、未来）与问题的关系，最后给出一个综合建议。语气温暖而神秘，富有诗意，但也要有实质性的指引。控制在300字以内。`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "无法获取解读，请重试。";
      setAiReading(text);
    } catch {
      setAiReading("✦ 星盘暂时失联，请稍后重试。");
    }
    setLoading(false);
  };

  const reset = () => {
    setPhase("input");
    setQuestion("");
    setDrawnCards([]);
    setReversals([]);
    setFlipping(false);
    setRevealed(false);
    setAiReading("");
    setLoading(false);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet" />
      <div style={{
        minHeight: "600px",
        background: "linear-gradient(180deg, #0d0818 0%, #130d22 40%, #0d0818 100%)",
        borderRadius: "16px",
        padding: "40px 32px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'ZCOOL XiaoWei', serif",
      }}>
        {/* Stars */}
        {STARS.map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            borderRadius: "50%",
            background: "#fff",
            opacity: s.opacity,
            animation: `twinkle ${2 + s.delay}s ease-in-out infinite alternate`,
            pointerEvents: "none",
          }} />
        ))}

        <style>{`
          @keyframes twinkle { from { opacity: 0.1; } to { opacity: 0.7; } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes shimmer { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
          .tarot-input {
            width: 100%; box-sizing: border-box;
            background: rgba(255,255,255,0.05);
            border: 0.5px solid rgba(160,120,200,0.4);
            border-radius: 8px;
            color: #E8D8F0;
            font-size: 15px;
            padding: 12px 16px;
            outline: none;
            font-family: 'ZCOOL XiaoWei', serif;
            resize: none;
            transition: border-color 0.3s;
          }
          .tarot-input:focus { border-color: rgba(180,140,220,0.8); }
          .tarot-input::placeholder { color: rgba(160,120,200,0.5); }
          .draw-btn {
            background: linear-gradient(135deg, #3a1a5a, #5a2a8a);
            border: 0.5px solid rgba(160,100,220,0.6);
            border-radius: 8px;
            color: #E8D0FF;
            font-size: 16px;
            padding: 12px 36px;
            cursor: pointer;
            font-family: 'ZCOOL XiaoWei', serif;
            letter-spacing: 0.15em;
            transition: all 0.2s;
            box-shadow: 0 4px 20px rgba(100,40,160,0.3);
          }
          .draw-btn:hover { background: linear-gradient(135deg, #4a2a6a, #6a3a9a); transform: translateY(-1px); }
          .draw-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
          .reset-btn {
            background: transparent;
            border: 0.5px solid rgba(160,100,200,0.4);
            border-radius: 6px;
            color: rgba(180,140,210,0.8);
            font-size: 13px;
            padding: 6px 18px;
            cursor: pointer;
            font-family: 'ZCOOL XiaoWei', serif;
            transition: all 0.2s;
          }
          .reset-btn:hover { border-color: rgba(180,140,220,0.8); color: #D0B8E8; }
        `}</style>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#8A6AAA", marginBottom: "8px" }}>✦ TAROT ORACLE ✦</div>
          <div style={{
            fontSize: "32px",
            fontFamily: "'Ma Shan Zheng', serif",
            color: "#E8D8FF",
            letterSpacing: "0.1em",
            textShadow: "0 0 30px rgba(180,120,255,0.4)",
          }}>塔罗神谕</div>
        </div>

        {/* Input Phase */}
        {phase === "input" && (
          <div style={{ maxWidth: "440px", margin: "0 auto", position: "relative", zIndex: 1, animation: "fadeUp 0.5s ease" }}>
            <div style={{ fontSize: "13px", color: "#8A6AAA", marginBottom: "10px", letterSpacing: "0.08em" }}>
              ✦ 将心中所惑，化作文字
            </div>
            <textarea
              className="tarot-input"
              rows={3}
              placeholder="请输入你想占卜的问题……"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button
                className="draw-btn"
                onClick={drawCards}
                disabled={!question.trim()}
              >
                ✦ 抽 牌 ✦
              </button>
            </div>
          </div>
        )}

        {/* Cards Phase */}
        {phase === "cards" && (
          <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.4s ease" }}>
            {/* Question echo */}
            <div style={{
              textAlign: "center",
              fontSize: "13px",
              color: "rgba(200,170,240,0.7)",
              marginBottom: "28px",
              letterSpacing: "0.05em",
            }}>
              「{question}」
            </div>

            {/* Cards */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "36px",
            }}>
              {drawnCards.map((card, i) => (
                <TarotCard
                  key={i}
                  card={card}
                  isReversed={reversals[i]}
                  isFlipping={flipping}
                  isRevealed={revealed}
                  position={POSITIONS[i]}
                  delay={i * 350}
                />
              ))}
            </div>

            {/* AI Reading */}
            <div style={{
              maxWidth: "520px",
              margin: "0 auto",
              background: "rgba(60,20,90,0.3)",
              border: "0.5px solid rgba(140,90,200,0.3)",
              borderRadius: "12px",
              padding: "24px",
              minHeight: "80px",
            }}>
              {loading && (
                <div style={{
                  textAlign: "center",
                  color: "#9A7ABB",
                  fontSize: "13px",
                  letterSpacing: "0.15em",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}>
                  ✦ 正在解读星象 ✦
                </div>
              )}
              {aiReading && (
                <div style={{
                  color: "#D8C8F0",
                  fontSize: "14px",
                  lineHeight: 2,
                  letterSpacing: "0.03em",
                  animation: "fadeUp 0.6s ease",
                  whiteSpace: "pre-wrap",
                }}>
                  {aiReading}
                </div>
              )}
            </div>

            {/* Reset */}
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button className="reset-btn" onClick={reset}>↩ 重新占卜</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
