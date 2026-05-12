import { useState, useEffect } from "react";

// ─── i18n ────────────────────────────────────────────────────────────────────
const T = {
  en: {
    subtitle: "TAROT ORACLE", title: "The Oracle", switchKey: "Change Key",
    connectTitle: "Connect Your Oracle", connectDesc: "Your key is stored locally only — never sent to any server",
    keyPlaceholder: "Enter API Key", howToGet: "How to get an API Key?", collapse: "Collapse",
    enterOracle: "✦ Enter the Oracle ✦", chooseTheme: "Choose Your Path", chooseSpread: "Choose a Spread",
    back: "← Back", yourQuestion: "Your Question", questionPlaceholder: "What do you wish to ask the cards...",
    drawCards: "✦ Draw the Cards ✦", reading: "✦ Reading the stars ✦", newReading: "↩ New Reading",
    reversed: "Reversed", upright: "Upright", cards: "cards",
    themes: [
      { id: "daily", name: "Whispers of Today", desc: "Daily guidance & reflections" },
      { id: "love", name: "Heart's Mirror", desc: "Love, connection & desire" },
      { id: "career", name: "Path of Destiny", desc: "Career, ambition & purpose" },
      { id: "growth", name: "Soul's Lantern", desc: "Inner growth & self-discovery" },
    ],
    spreads: {
      daily: [
        { id: "day", name: "Dawn Light", cards: 1, desc: "One card for today's energy" },
        { id: "day3", name: "Morning, Noon & Night", cards: 3, desc: "How your day will unfold" },
        { id: "mind", name: "Mind & Shadow", cards: 2, desc: "Conscious vs hidden forces" },
      ],
      love: [
        { id: "heart3", name: "The Lovers' Triangle", cards: 3, desc: "You · Them · The connection" },
        { id: "heart5", name: "Rose & Thorn", cards: 5, desc: "Deep dive into your love story" },
        { id: "heartself", name: "Mirror of the Heart", cards: 3, desc: "How you love yourself & others" },
      ],
      career: [
        { id: "career3", name: "The Compass", cards: 3, desc: "Where you are · obstacles · direction" },
        { id: "career5", name: "The Crossroads", cards: 5, desc: "Full career landscape reading" },
        { id: "potential", name: "Hidden Potential", cards: 3, desc: "Talents waiting to be unlocked" },
      ],
      growth: [
        { id: "soul3", name: "The Inner Temple", cards: 3, desc: "Mind · Body · Spirit" },
        { id: "shadow", name: "Shadow & Light", cards: 4, desc: "Your shadow self revealed" },
        { id: "year", name: "Year Ahead", cards: 6, desc: "Six months of transformation" },
      ],
    },
    spreadPositions: {
      day: ["Today"], day3: ["Morning", "Afternoon", "Evening"], mind: ["Conscious Mind", "Hidden Force"],
      heart3: ["You", "Them", "The Bond"], heart5: ["Your Heart", "Their Heart", "The Bond", "Challenge", "Outcome"],
      heartself: ["How You Love", "What You Seek", "What You Offer"],
      career3: ["Where You Stand", "The Obstacle", "The Path Forward"],
      career5: ["Foundation", "Strength", "Challenge", "Hidden Factor", "Outcome"],
      potential: ["Known Talent", "Hidden Gift", "How to Unlock"],
      soul3: ["Mind", "Body", "Spirit"], shadow: ["Your Light", "Your Shadow", "Root Cause", "Path to Wholeness"],
      year: ["Now", "Month 1–2", "Month 3–4", "Month 5–6", "What to Release", "What to Embrace"],
    },
    providers: [
      { id: "deepseek", name: "DeepSeek", url: "https://platform.deepseek.com/api_keys", steps: ["Go to platform.deepseek.com", "Register with email", "Go to API Keys → Create Key", "New users get free credits"] },
      { id: "openai", name: "OpenAI GPT", url: "https://platform.openai.com/api-keys", steps: ["Go to platform.openai.com", "Register an account", "Go to API Keys → Create new key", "Requires credit card for continued use"] },
    ],
  },
  zh: {
    subtitle: "塔罗神谕", title: "神谕之镜", switchKey: "切换 Key",
    connectTitle: "连接你的 AI 神谕", connectDesc: "你的 Key 仅储存在本地浏览器，不会上传至任何服务器",
    keyPlaceholder: "输入 API Key", howToGet: "如何获取 API Key？", collapse: "收起",
    enterOracle: "✦ 进入神谕 ✦", chooseTheme: "选择你的占卜方向", chooseSpread: "选择牌阵",
    back: "← 返回", yourQuestion: "你的问题", questionPlaceholder: "将心中所惑，化作文字……",
    drawCards: "✦ 抽 牌 ✦", reading: "✦ 正在解读星象 ✦", newReading: "↩ 重新占卜",
    reversed: "逆位", upright: "正位", cards: "张",
    themes: [
      { id: "daily", name: "今日絮语", desc: "日常指引与当下能量" },
      { id: "love", name: "心之镜", desc: "爱情、连结与渴望" },
      { id: "career", name: "命途罗盘", desc: "事业、抱负与人生使命" },
      { id: "growth", name: "灵魂灯笼", desc: "内在成长与自我探索" },
    ],
    spreads: {
      daily: [
        { id: "day", name: "晨曦一叶", cards: 1, desc: "一张牌，感知今日能量" },
        { id: "day3", name: "晨昏三时", cards: 3, desc: "早晨·午后·夜晚的展开" },
        { id: "mind", name: "明暗之间", cards: 2, desc: "意识与潜藏力量的对话" },
      ],
      love: [
        { id: "heart3", name: "恋人三角", cards: 3, desc: "你·对方·这段缘分" },
        { id: "heart5", name: "玫瑰与刺", cards: 5, desc: "深度解读你的爱情故事" },
        { id: "heartself", name: "心之倒影", cards: 3, desc: "你如何爱自己与他人" },
      ],
      career: [
        { id: "career3", name: "指南三针", cards: 3, desc: "现状·阻碍·前进方向" },
        { id: "career5", name: "命途十字路", cards: 5, desc: "全面解读你的事业格局" },
        { id: "potential", name: "潜能密钥", cards: 3, desc: "等待被唤醒的天赋" },
      ],
      growth: [
        { id: "soul3", name: "内在圣殿", cards: 3, desc: "心智·身体·灵魂" },
        { id: "shadow", name: "光与影", cards: 4, desc: "揭示你的阴影自我" },
        { id: "year", name: "前路六月", cards: 6, desc: "六个月的蜕变之旅" },
      ],
    },
    spreadPositions: {
      day: ["今日"], day3: ["早晨", "午后", "夜晚"], mind: ["意识层", "潜藏力量"],
      heart3: ["你", "对方", "这段缘"], heart5: ["你的心", "对方的心", "羁绊", "挑战", "结果"],
      heartself: ["你如何去爱", "你在寻找什么", "你能给予什么"],
      career3: ["你的现状", "阻碍所在", "前进方向"],
      career5: ["根基", "优势", "挑战", "隐藏因素", "结果"],
      potential: ["已知天赋", "潜藏天赋", "如何唤醒"],
      soul3: ["心智", "身体", "灵魂"], shadow: ["你的光", "你的影", "根源", "走向完整之路"],
      year: ["此刻", "第1-2月", "第3-4月", "第5-6月", "需要放下", "需要拥抱"],
    },
    providers: [
      { id: "deepseek", name: "DeepSeek", url: "https://platform.deepseek.com/api_keys", steps: ["前往 platform.deepseek.com 注册", "进入 API Keys → 创建 Key", "复制密钥（sk- 开头）", "新用户有免费额度"] },
      { id: "openai", name: "OpenAI GPT", url: "https://platform.openai.com/api-keys", steps: ["前往 platform.openai.com 注册", "进入 API Keys → 创建新密钥", "复制密钥", "需绑定信用卡才能持续使用"] },
    ],
  },
  tw: {
    subtitle: "塔羅神諭", title: "神諭之鏡", switchKey: "切換 Key",
    connectTitle: "連接你的 AI 神諭", connectDesc: "你的 Key 僅儲存在本地瀏覽器，不會上傳至任何伺服器",
    keyPlaceholder: "輸入 API Key", howToGet: "如何獲取 API Key？", collapse: "收起",
    enterOracle: "✦ 進入神諭 ✦", chooseTheme: "選擇你的占卜方向", chooseSpread: "選擇牌陣",
    back: "← 返回", yourQuestion: "你的問題", questionPlaceholder: "將心中所惑，化作文字……",
    drawCards: "✦ 抽 牌 ✦", reading: "✦ 正在解讀星象 ✦", newReading: "↩ 重新占卜",
    reversed: "逆位", upright: "正位", cards: "張",
    themes: [
      { id: "daily", name: "今日絮語", desc: "日常指引與當下能量" },
      { id: "love", name: "心之鏡", desc: "愛情、連結與渴望" },
      { id: "career", name: "命途羅盤", desc: "事業、抱負與人生使命" },
      { id: "growth", name: "靈魂燈籠", desc: "內在成長與自我探索" },
    ],
    spreads: {
      daily: [
        { id: "day", name: "晨曦一葉", cards: 1, desc: "一張牌，感知今日能量" },
        { id: "day3", name: "晨昏三時", cards: 3, desc: "早晨·午後·夜晚的展開" },
        { id: "mind", name: "明暗之間", cards: 2, desc: "意識與潛藏力量的對話" },
      ],
      love: [
        { id: "heart3", name: "戀人三角", cards: 3, desc: "你·對方·這段緣分" },
        { id: "heart5", name: "玫瑰與刺", cards: 5, desc: "深度解讀你的愛情故事" },
        { id: "heartself", name: "心之倒影", cards: 3, desc: "你如何愛自己與他人" },
      ],
      career: [
        { id: "career3", name: "指南三針", cards: 3, desc: "現狀·阻礙·前進方向" },
        { id: "career5", name: "命途十字路", cards: 5, desc: "全面解讀你的事業格局" },
        { id: "potential", name: "潛能密鑰", cards: 3, desc: "等待被喚醒的天賦" },
      ],
      growth: [
        { id: "soul3", name: "內在聖殿", cards: 3, desc: "心智·身體·靈魂" },
        { id: "shadow", name: "光與影", cards: 4, desc: "揭示你的陰影自我" },
        { id: "year", name: "前路六月", cards: 6, desc: "六個月的蛻變之旅" },
      ],
    },
    spreadPositions: {
      day: ["今日"], day3: ["早晨", "午後", "夜晚"], mind: ["意識層", "潛藏力量"],
      heart3: ["你", "對方", "這段緣"], heart5: ["你的心", "對方的心", "羈絆", "挑戰", "結果"],
      heartself: ["你如何去愛", "你在尋找什麼", "你能給予什麼"],
      career3: ["你的現狀", "阻礙所在", "前進方向"],
      career5: ["根基", "優勢", "挑戰", "隱藏因素", "結果"],
      potential: ["已知天賦", "潛藏天賦", "如何喚醒"],
      soul3: ["心智", "身體", "靈魂"], shadow: ["你的光", "你的影", "根源", "走向完整之路"],
      year: ["此刻", "第1-2月", "第3-4月", "第5-6月", "需要放下", "需要擁抱"],
    },
    providers: [
      { id: "deepseek", name: "DeepSeek", url: "https://platform.deepseek.com/api_keys", steps: ["前往 platform.deepseek.com 註冊", "進入 API Keys → 建立 Key", "複製密鑰（sk- 開頭）", "新用戶有免費額度"] },
      { id: "openai", name: "OpenAI GPT", url: "https://platform.openai.com/api-keys", steps: ["前往 platform.openai.com 註冊", "進入 API Keys → 建立新密鑰", "複製密鑰", "需綁定信用卡才能持續使用"] },
    ],
  },
};

// ─── 78 Cards ────────────────────────────────────────────────────────────────
const DECK = [
  { n:"The Fool",zh:"愚者",tw:"愚者",e:"🌟",k:"beginnings · freedom · adventure",c:"#C4A882"},
  { n:"The Magician",zh:"魔术师",tw:"魔術師",e:"✨",k:"will · skill · action",c:"#8B6F9E"},
  { n:"The High Priestess",zh:"女祭司",tw:"女祭司",e:"🌙",k:"intuition · mystery · wisdom",c:"#5B8DB8"},
  { n:"The Empress",zh:"女皇",tw:"女皇",e:"🌸",k:"abundance · creation · nurture",c:"#8FB87A"},
  { n:"The Emperor",zh:"皇帝",tw:"皇帝",e:"👑",k:"authority · stability · order",c:"#C17B5A"},
  { n:"The Hierophant",zh:"教皇",tw:"教皇",e:"🔮",k:"tradition · faith · guidance",c:"#7B8DB8"},
  { n:"The Lovers",zh:"恋人",tw:"戀人",e:"💫",k:"love · choice · harmony",c:"#C48B9E"},
  { n:"The Chariot",zh:"战车",tw:"戰車",e:"⚡",k:"victory · control · willpower",c:"#B8A85B"},
  { n:"Strength",zh:"力量",tw:"力量",e:"🦁",k:"courage · patience · inner strength",c:"#D4A843"},
  { n:"The Hermit",zh:"隐士",tw:"隱士",e:"🕯",k:"solitude · introspection · wisdom",c:"#A0A0A0"},
  { n:"Wheel of Fortune",zh:"命运之轮",tw:"命運之輪",e:"🌀",k:"fate · turning point · cycles",c:"#7A9E8F"},
  { n:"Justice",zh:"正义",tw:"正義",e:"⚖️",k:"fairness · balance · truth",c:"#8BB87A"},
  { n:"The Hanged Man",zh:"倒吊人",tw:"倒吊人",e:"🌿",k:"pause · sacrifice · new perspective",c:"#5B8D9E"},
  { n:"Death",zh:"死神",tw:"死神",e:"🌑",k:"endings · transformation · rebirth",c:"#6B7B8B"},
  { n:"Temperance",zh:"节制",tw:"節制",e:"🌊",k:"balance · patience · moderation",c:"#7AB8B0"},
  { n:"The Devil",zh:"恶魔",tw:"惡魔",e:"🔗",k:"bondage · materialism · shadow",c:"#8B6060"},
  { n:"The Tower",zh:"塔",tw:"塔",e:"🌩",k:"upheaval · revelation · chaos",c:"#C07050"},
  { n:"The Star",zh:"星星",tw:"星星",e:"⭐",k:"hope · inspiration · guidance",c:"#7A8FB8"},
  { n:"The Moon",zh:"月亮",tw:"月亮",e:"🌙",k:"illusion · fear · subconscious",c:"#8B7AB8"},
  { n:"The Sun",zh:"太阳",tw:"太陽",e:"☀️",k:"joy · vitality · success",c:"#D4B043"},
  { n:"Judgement",zh:"审判",tw:"審判",e:"🎺",k:"awakening · redemption · reflection",c:"#8FA0B8"},
  { n:"The World",zh:"世界",tw:"世界",e:"🌍",k:"completion · integration · wholeness",c:"#7AAB7A"},
  // Wands (14)
  { n:"Ace of Wands",zh:"权杖王牌",tw:"權杖王牌",e:"🔥",k:"spark · inspiration · new passion",c:"#D4703A"},
  { n:"Two of Wands",zh:"权杖二",tw:"權杖二",e:"🔥",k:"planning · future vision · bold choices",c:"#D4703A"},
  { n:"Three of Wands",zh:"权杖三",tw:"權杖三",e:"🔥",k:"expansion · foresight · opportunity",c:"#D4703A"},
  { n:"Four of Wands",zh:"权杖四",tw:"權杖四",e:"🔥",k:"celebration · harmony · homecoming",c:"#D4703A"},
  { n:"Five of Wands",zh:"权杖五",tw:"權杖五",e:"🔥",k:"conflict · competition · tension",c:"#D4703A"},
  { n:"Six of Wands",zh:"权杖六",tw:"權杖六",e:"🔥",k:"victory · recognition · pride",c:"#D4703A"},
  { n:"Seven of Wands",zh:"权杖七",tw:"權杖七",e:"🔥",k:"defense · perseverance · challenge",c:"#D4703A"},
  { n:"Eight of Wands",zh:"权杖八",tw:"權杖八",e:"🔥",k:"speed · momentum · swift change",c:"#D4703A"},
  { n:"Nine of Wands",zh:"权杖九",tw:"權杖九",e:"🔥",k:"resilience · endurance · last stand",c:"#D4703A"},
  { n:"Ten of Wands",zh:"权杖十",tw:"權杖十",e:"🔥",k:"burden · responsibility · overload",c:"#D4703A"},
  { n:"Page of Wands",zh:"权杖侍从",tw:"權杖侍從",e:"🔥",k:"curiosity · enthusiasm · adventure",c:"#D4703A"},
  { n:"Knight of Wands",zh:"权杖骑士",tw:"權杖騎士",e:"🔥",k:"energy · passion · impulsiveness",c:"#D4703A"},
  { n:"Queen of Wands",zh:"权杖女王",tw:"權杖女王",e:"🔥",k:"charisma · confidence · warmth",c:"#D4703A"},
  { n:"King of Wands",zh:"权杖国王",tw:"權杖國王",e:"🔥",k:"vision · leadership · boldness",c:"#D4703A"},
  // Cups (14)
  { n:"Ace of Cups",zh:"圣杯王牌",tw:"聖杯王牌",e:"💧",k:"love · new emotion · compassion",c:"#5B8DB8"},
  { n:"Two of Cups",zh:"圣杯二",tw:"聖杯二",e:"💧",k:"union · connection · mutual attraction",c:"#5B8DB8"},
  { n:"Three of Cups",zh:"圣杯三",tw:"聖杯三",e:"💧",k:"friendship · celebration · community",c:"#5B8DB8"},
  { n:"Four of Cups",zh:"圣杯四",tw:"聖杯四",e:"💧",k:"apathy · contemplation · missed opportunity",c:"#5B8DB8"},
  { n:"Five of Cups",zh:"圣杯五",tw:"聖杯五",e:"💧",k:"loss · grief · focusing on the negative",c:"#5B8DB8"},
  { n:"Six of Cups",zh:"圣杯六",tw:"聖杯六",e:"💧",k:"nostalgia · innocence · past joy",c:"#5B8DB8"},
  { n:"Seven of Cups",zh:"圣杯七",tw:"聖杯七",e:"💧",k:"illusion · choices · fantasy",c:"#5B8DB8"},
  { n:"Eight of Cups",zh:"圣杯八",tw:"聖杯八",e:"💧",k:"withdrawal · moving on · seeking meaning",c:"#5B8DB8"},
  { n:"Nine of Cups",zh:"圣杯九",tw:"聖杯九",e:"💧",k:"satisfaction · contentment · wish fulfilled",c:"#5B8DB8"},
  { n:"Ten of Cups",zh:"圣杯十",tw:"聖杯十",e:"💧",k:"happiness · harmony · family bliss",c:"#5B8DB8"},
  { n:"Page of Cups",zh:"圣杯侍从",tw:"聖杯侍從",e:"💧",k:"creativity · intuition · sensitive soul",c:"#5B8DB8"},
  { n:"Knight of Cups",zh:"圣杯骑士",tw:"聖杯騎士",e:"💧",k:"romance · charm · idealism",c:"#5B8DB8"},
  { n:"Queen of Cups",zh:"圣杯女王",tw:"聖杯女王",e:"💧",k:"empathy · compassion · emotional depth",c:"#5B8DB8"},
  { n:"King of Cups",zh:"圣杯国王",tw:"聖杯國王",e:"💧",k:"emotional balance · wisdom · diplomacy",c:"#5B8DB8"},
  // Swords (14)
  { n:"Ace of Swords",zh:"宝剑王牌",tw:"寶劍王牌",e:"⚔️",k:"clarity · breakthrough · truth",c:"#8FA0B8"},
  { n:"Two of Swords",zh:"宝剑二",tw:"寶劍二",e:"⚔️",k:"indecision · stalemate · avoidance",c:"#8FA0B8"},
  { n:"Three of Swords",zh:"宝剑三",tw:"寶劍三",e:"⚔️",k:"heartbreak · sorrow · grief",c:"#8FA0B8"},
  { n:"Four of Swords",zh:"宝剑四",tw:"寶劍四",e:"⚔️",k:"rest · recuperation · contemplation",c:"#8FA0B8"},
  { n:"Five of Swords",zh:"宝剑五",tw:"寶劍五",e:"⚔️",k:"conflict · defeat · hollow victory",c:"#8FA0B8"},
  { n:"Six of Swords",zh:"宝剑六",tw:"寶劍六",e:"⚔️",k:"transition · moving on · calmer waters",c:"#8FA0B8"},
  { n:"Seven of Swords",zh:"宝剑七",tw:"寶劍七",e:"⚔️",k:"deception · strategy · secrecy",c:"#8FA0B8"},
  { n:"Eight of Swords",zh:"宝剑八",tw:"寶劍八",e:"⚔️",k:"restriction · self-imposed limits · trapped",c:"#8FA0B8"},
  { n:"Nine of Swords",zh:"宝剑九",tw:"寶劍九",e:"⚔️",k:"anxiety · fear · nightmares",c:"#8FA0B8"},
  { n:"Ten of Swords",zh:"宝剑十",tw:"寶劍十",e:"⚔️",k:"painful endings · betrayal · rock bottom",c:"#8FA0B8"},
  { n:"Page of Swords",zh:"宝剑侍从",tw:"寶劍侍從",e:"⚔️",k:"curiosity · wit · mental agility",c:"#8FA0B8"},
  { n:"Knight of Swords",zh:"宝剑骑士",tw:"寶劍騎士",e:"⚔️",k:"ambition · swift action · sharp mind",c:"#8FA0B8"},
  { n:"Queen of Swords",zh:"宝剑女王",tw:"寶劍女王",e:"⚔️",k:"clarity · independence · sharp perception",c:"#8FA0B8"},
  { n:"King of Swords",zh:"宝剑国王",tw:"寶劍國王",e:"⚔️",k:"intellect · authority · ethical judgment",c:"#8FA0B8"},
  // Pentacles (14)
  { n:"Ace of Pentacles",zh:"星币王牌",tw:"星幣王牌",e:"🪙",k:"prosperity · new opportunity · abundance",c:"#8FB87A"},
  { n:"Two of Pentacles",zh:"星币二",tw:"星幣二",e:"🪙",k:"balance · adaptability · juggling priorities",c:"#8FB87A"},
  { n:"Three of Pentacles",zh:"星币三",tw:"星幣三",e:"🪙",k:"teamwork · skill · craftsmanship",c:"#8FB87A"},
  { n:"Four of Pentacles",zh:"星币四",tw:"星幣四",e:"🪙",k:"security · control · holding on",c:"#8FB87A"},
  { n:"Five of Pentacles",zh:"星币五",tw:"星幣五",e:"🪙",k:"hardship · isolation · financial loss",c:"#8FB87A"},
  { n:"Six of Pentacles",zh:"星币六",tw:"星幣六",e:"🪙",k:"generosity · giving · receiving",c:"#8FB87A"},
  { n:"Seven of Pentacles",zh:"星币七",tw:"星幣七",e:"🪙",k:"patience · investment · long-term vision",c:"#8FB87A"},
  { n:"Eight of Pentacles",zh:"星币八",tw:"星幣八",e:"🪙",k:"diligence · mastery · dedication",c:"#8FB87A"},
  { n:"Nine of Pentacles",zh:"星币九",tw:"星幣九",e:"🪙",k:"luxury · self-reliance · refinement",c:"#8FB87A"},
  { n:"Ten of Pentacles",zh:"星币十",tw:"星幣十",e:"🪙",k:"legacy · wealth · lasting security",c:"#8FB87A"},
  { n:"Page of Pentacles",zh:"星币侍从",tw:"星幣侍從",e:"🪙",k:"ambition · diligence · new financial path",c:"#8FB87A"},
  { n:"Knight of Pentacles",zh:"星币骑士",tw:"星幣騎士",e:"🪙",k:"reliability · patience · methodical",c:"#8FB87A"},
  { n:"Queen of Pentacles",zh:"星币女王",tw:"星幣女王",e:"🪙",k:"nurturing · practical · earthly abundance",c:"#8FB87A"},
  { n:"King of Pentacles",zh:"星币国王",tw:"星幣國王",e:"🪙",k:"wealth · stability · provider",c:"#8FB87A"},
];

const STARS_BG = Array.from({ length: 60 }, () => ({
  x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.6 + 0.2, delay: Math.random() * 3,
}));

const PROVIDER_CALL = {
  deepseek: async (key, prompt) => {
    const r = await fetch("https://api.deepseek.com/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` }, body: JSON.stringify({ model: "deepseek-chat", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }) });
    const d = await r.json(); if (d.error) throw new Error(d.error.message); return d.choices?.[0]?.message?.content || "";
  },
  openai: async (key, prompt) => {
    const r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` }, body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }) });
    const d = await r.json(); if (d.error) throw new Error(d.error.message); return d.choices?.[0]?.message?.content || "";
  },
};

function cardName(card, lang) { return lang === "zh" ? card.zh : lang === "tw" ? card.tw : card.n; }

function TarotCard({ card, isReversed, isRevealed, position, delay, lang }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  const t = T[lang];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", maxWidth: "95px" }}>
      <div style={{ fontSize: "9px", letterSpacing: "0.1em", color: "#A89070", fontFamily: "'Ma Shan Zheng', serif", textAlign: "center", lineHeight: 1.3 }}>{position}</div>
      <div style={{ width: "86px", height: "148px", perspective: "600px" }}>
        <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)", transform: vis && isRevealed ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", borderRadius: "8px", background: "linear-gradient(135deg,#1a1020,#2a1a35,#1a1020)", border: "1.5px solid #5a3a7a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "20px", color: "#5a3a7a" }}>✦</div>
          </div>
          <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", borderRadius: "8px", background: "linear-gradient(160deg,#1a1020,#251535,#1e1228)", border: `1.5px solid ${card?.c || "#5a3a7a"}`, boxShadow: card ? `0 4px 18px ${card.c}44` : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 6px", transform: isReversed ? "rotateY(180deg) rotate(180deg)" : "rotateY(180deg)" }}>
            {card && (<>
              <div style={{ fontSize: "24px", marginBottom: "5px", filter: `drop-shadow(0 0 5px ${card.c})` }}>{card.e}</div>
              <div style={{ fontSize: "10px", fontFamily: "'Ma Shan Zheng', serif", color: "#F0E8D8", marginBottom: "3px", textAlign: "center", lineHeight: 1.3 }}>{cardName(card, lang)}</div>
              <div style={{ fontSize: "8px", color: card.c, textAlign: "center", lineHeight: 1.5, opacity: 0.85 }}>{card.k.split(" · ").slice(0, 2).join(" · ")}</div>
              {isReversed && <div style={{ marginTop: "4px", fontSize: "7px", color: "#C06080", border: "0.5px solid #C06080", padding: "1px 4px", borderRadius: "3px" }}>{t.reversed}</div>}
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TarotApp() {
  const [lang, setLang] = useState("zh");
  const [phase, setPhase] = useState("setup");
  const [providerId, setProviderId] = useState("deepseek");
  const [apiKey, setApiKey] = useState("");
  const [showTut, setShowTut] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [theme, setTheme] = useState(null);
  const [spread, setSpread] = useState(null);
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState([]);
  const [revs, setRevs] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const t = T[lang];

  useEffect(() => {
    const k = localStorage.getItem("tarot_key"), p = localStorage.getItem("tarot_provider"), l = localStorage.getItem("tarot_lang");
    if (k && p) { setApiKey(k); setProviderId(p); setPhase("theme"); }
    if (l && T[l]) setLang(l);
  }, []);

  const setLangSave = (l) => { setLang(l); localStorage.setItem("tarot_lang", l); };

  const handleSave = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem("tarot_key", apiKey); localStorage.setItem("tarot_provider", providerId);
    setPhase("theme");
  };

  const drawCards = () => {
    if (!question.trim()) return;
    const shuffled = [...DECK].sort(() => Math.random() - 0.5).slice(0, spread.cards);
    const r = shuffled.map(() => Math.random() > 0.5);
    setCards(shuffled); setRevs(r); setPhase("cards"); setReading(""); setError("");
    setTimeout(() => setRevealed(true), 200);
    setTimeout(() => doReading(shuffled, r), shuffled.length * 320 + 800);
  };

  const doReading = async (drawnCards, r) => {
    setLoading(true);
    const pos = t.spreadPositions[spread.id];
    const desc = drawnCards.map((c, i) => `${pos[i]}: ${cardName(c, lang)} (${r[i] ? t.reversed : t.upright}, ${c.k})`).join("\n");
    const langInstr = lang === "en" ? "Respond in English." : lang === "tw" ? "請用繁體中文回應。" : "请用简体中文回应。";
    const prompt = `You are a wise, mystical tarot reader. ${langInstr}\n\nQuestion: ${question}\nSpread: ${spread.name} | Theme: ${theme.name}\n\nCards:\n${desc}\n\nProvide a poetic, insightful reading addressing each card position, then give an overall synthesis. Under 350 words. Warm, mysterious, genuinely helpful.`;
    try {
      setReading(await PROVIDER_CALL[providerId](apiKey, prompt));
    } catch (e) { setError(`⚠️ ${e.message || "API error"}`); }
    setLoading(false);
  };

  const reset = () => { setPhase("theme"); setTheme(null); setSpread(null); setQuestion(""); setCards([]); setRevs([]); setRevealed(false); setReading(""); setError(""); };
  const clearKey = () => { localStorage.removeItem("tarot_key"); localStorage.removeItem("tarot_provider"); setApiKey(""); setPhase("setup"); reset(); };

  const provider = t.providers.find(p => p.id === providerId);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "600px", background: "linear-gradient(180deg,#0d0818 0%,#130d22 40%,#0d0818 100%)", borderRadius: "16px", padding: "36px 28px", position: "relative", overflow: "hidden", fontFamily: "'ZCOOL XiaoWei',serif" }}>
        {STARS_BG.map((s, i) => <div key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, borderRadius: "50%", background: "#fff", opacity: s.opacity, animation: `twinkle ${2 + s.delay}s ease-in-out infinite alternate`, pointerEvents: "none" }} />)}
        <style>{`@keyframes twinkle{from{opacity:0.1}to{opacity:0.7}}@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes shimmer{0%,100%{opacity:0.5}50%{opacity:1}}.ti{width:100%;box-sizing:border-box;background:rgba(255,255,255,0.05);border:0.5px solid rgba(160,120,200,0.4);border-radius:8px;color:#E8D8F0;font-size:14px;padding:10px 14px;outline:none;font-family:'ZCOOL XiaoWei',serif;resize:none;transition:border-color 0.3s}.ti:focus{border-color:rgba(180,140,220,0.8)}.ti::placeholder{color:rgba(160,120,200,0.45)}.tb{background:linear-gradient(135deg,#3a1a5a,#5a2a8a);border:0.5px solid rgba(160,100,220,0.6);border-radius:8px;color:#E8D0FF;font-size:15px;padding:11px 32px;cursor:pointer;font-family:'ZCOOL XiaoWei',serif;letter-spacing:0.12em;transition:all 0.2s}.tb:hover{background:linear-gradient(135deg,#4a2a6a,#6a3a9a);transform:translateY(-1px)}.tb:disabled{opacity:0.35;cursor:not-allowed;transform:none}.gb{background:transparent;border:0.5px solid rgba(160,100,200,0.35);border-radius:6px;color:rgba(180,140,210,0.75);font-size:12px;padding:5px 14px;cursor:pointer;font-family:'ZCOOL XiaoWei',serif;transition:all 0.2s}.gb:hover{border-color:rgba(180,140,220,0.7);color:#D0B8E8}.cc{background:rgba(60,20,90,0.25);border:0.5px solid rgba(140,90,200,0.3);border-radius:12px;padding:16px 18px;cursor:pointer;transition:all 0.2s;text-align:left;width:100%}.cc:hover{background:rgba(80,30,120,0.35);border-color:rgba(180,120,240,0.5);transform:translateY(-2px)}.lb{background:transparent;border:0.5px solid rgba(160,100,200,0.3);border-radius:5px;color:rgba(180,140,210,0.6);font-size:11px;padding:3px 10px;cursor:pointer;font-family:'ZCOOL XiaoWei',serif;transition:all 0.2s}.lb.on{border-color:rgba(180,120,240,0.7);color:#C8A8E8;background:rgba(80,40,120,0.3)}`}</style>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "26px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.28em", color: "#8A6AAA", marginBottom: "5px" }}>✦ {t.subtitle} ✦</div>
          <div style={{ fontSize: "27px", fontFamily: "'Ma Shan Zheng',serif", color: "#E8D8FF", letterSpacing: "0.1em", textShadow: "0 0 26px rgba(180,120,255,0.4)" }}>{t.title}</div>
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "10px" }}>
            {["zh","tw","en"].map(l => <button key={l} className={`lb${lang===l?" on":""}`} onClick={() => setLangSave(l)}>{l==="zh"?"简体":l==="tw"?"繁體":"EN"}</button>)}
          </div>
          {phase !== "setup" && <button className="gb" onClick={clearKey} style={{ position: "absolute", right: 0, top: "6px", fontSize: "11px" }}>{t.switchKey}</button>}
        </div>

        <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.4s ease" }}>

          {/* Setup */}
          {phase === "setup" && (
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", color: "#8A6AAA", marginBottom: "5px" }}>✦ {t.connectTitle} ✦</div>
                <div style={{ fontSize: "11px", color: "rgba(160,130,200,0.55)", lineHeight: 1.7 }}>{t.connectDesc}</div>
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px", justifyContent: "center" }}>
                {t.providers.map(p => <button key={p.id} onClick={() => setProviderId(p.id)} style={{ background: providerId===p.id?"rgba(140,90,200,0.2)":"transparent", border: `0.5px solid ${providerId===p.id?"rgba(180,120,240,0.7)":"rgba(160,100,200,0.3)"}`, borderRadius: "6px", color: providerId===p.id?"#C8A8E8":"rgba(180,140,210,0.6)", fontSize: "12px", padding: "6px 16px", cursor: "pointer", fontFamily: "'ZCOOL XiaoWei',serif" }}>{p.name}</button>)}
              </div>
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <input type={showKey?"text":"password"} className="ti" placeholder={t.keyPlaceholder} value={apiKey} onChange={e => setApiKey(e.target.value)} style={{ paddingRight: "38px" }} />
                <button onClick={() => setShowKey(!showKey)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(160,120,200,0.6)", cursor: "pointer", fontSize: "13px" }}>{showKey?"🙈":"👁"}</button>
              </div>
              <button onClick={() => setShowTut(!showTut)} style={{ background: "none", border: "none", color: "rgba(160,120,200,0.65)", fontSize: "12px", cursor: "pointer", padding: "0 0 12px", fontFamily: "'ZCOOL XiaoWei',serif" }}>{showTut?`▲ ${t.collapse}`:`▼ ${t.howToGet}`}</button>
              {showTut && provider && (
                <div style={{ background: "rgba(60,20,90,0.3)", border: "0.5px solid rgba(140,90,200,0.25)", borderRadius: "10px", padding: "14px 18px", marginBottom: "14px" }}>
                  {provider.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "rgba(140,90,200,0.2)", border: "0.5px solid rgba(180,120,240,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#C8A8E8", flexShrink: 0, marginTop: "2px" }}>{i+1}</div>
                      <div style={{ fontSize: "12px", color: "rgba(220,200,240,0.8)", lineHeight: 1.6 }}>{step}</div>
                    </div>
                  ))}
                  <a href={provider.url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "6px", fontSize: "11px", color: "rgba(180,140,240,0.8)", textDecoration: "none", borderBottom: "0.5px solid rgba(180,140,240,0.4)" }}>→ {provider.name}</a>
                </div>
              )}
              <button className="tb" onClick={handleSave} disabled={!apiKey.trim()} style={{ width: "100%" }}>{t.enterOracle}</button>
            </div>
          )}

          {/* Theme */}
          {phase === "theme" && (
            <div style={{ maxWidth: "460px", margin: "0 auto" }}>
              <div style={{ fontSize: "12px", color: "#8A6AAA", letterSpacing: "0.1em", textAlign: "center", marginBottom: "16px" }}>✦ {t.chooseTheme} ✦</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {t.themes.map(th => (
                  <button key={th.id} className="cc" onClick={() => { setTheme(th); setPhase("spread"); }}>
                    <div style={{ fontSize: "14px", color: "#E8D8FF", marginBottom: "4px", fontFamily: "'Ma Shan Zheng',serif" }}>{th.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(180,140,210,0.65)", lineHeight: 1.5 }}>{th.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spread */}
          {phase === "spread" && theme && (
            <div style={{ maxWidth: "460px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <button className="gb" onClick={() => setPhase("theme")}>{t.back}</button>
                <div style={{ fontSize: "12px", color: "#8A6AAA" }}>✦ {theme.name}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {t.spreads[theme.id].map(sp => (
                  <button key={sp.id} className="cc" onClick={() => { setSpread(sp); setPhase("input"); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "14px", color: "#E8D8FF", marginBottom: "3px", fontFamily: "'Ma Shan Zheng',serif" }}>{sp.name}</div>
                      <div style={{ fontSize: "11px", color: "rgba(180,140,210,0.65)" }}>{sp.desc}</div>
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(180,120,240,0.6)", border: "0.5px solid rgba(180,120,240,0.3)", borderRadius: "4px", padding: "3px 8px", whiteSpace: "nowrap", marginLeft: "12px" }}>{sp.cards} {t.cards}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          {phase === "input" && spread && (
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <button className="gb" onClick={() => setPhase("spread")}>{t.back}</button>
                <div style={{ fontSize: "12px", color: "#8A6AAA" }}>✦ {spread.name}</div>
              </div>
              <div style={{ fontSize: "12px", color: "#8A6AAA", marginBottom: "8px" }}>✦ {t.yourQuestion}</div>
              <textarea className="ti" rows={3} placeholder={t.questionPlaceholder} value={question} onChange={e => setQuestion(e.target.value)} />
              <div style={{ textAlign: "center", marginTop: "22px" }}>
                <button className="tb" onClick={drawCards} disabled={!question.trim()}>{t.drawCards}</button>
              </div>
            </div>
          )}

          {/* Cards */}
          {phase === "cards" && (
            <div>
              <div style={{ textAlign: "center", fontSize: "12px", color: "rgba(200,170,240,0.65)", marginBottom: "20px" }}>「{question}」</div>
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "26px" }}>
                {cards.map((card, i) => <TarotCard key={i} card={card} isReversed={revs[i]} isRevealed={revealed} position={t.spreadPositions[spread.id][i]} delay={i * 300} lang={lang} />)}
              </div>
              <div style={{ maxWidth: "520px", margin: "0 auto", background: "rgba(60,20,90,0.3)", border: "0.5px solid rgba(140,90,200,0.3)", borderRadius: "12px", padding: "20px", minHeight: "70px" }}>
                {loading && <div style={{ textAlign: "center", color: "#9A7ABB", fontSize: "12px", letterSpacing: "0.14em", animation: "shimmer 1.5s ease-in-out infinite" }}>{t.reading}</div>}
                {error && <div style={{ color: "#C06080", fontSize: "12px", textAlign: "center" }}>{error}</div>}
                {reading && <div style={{ color: "#D8C8F0", fontSize: "13px", lineHeight: 2, letterSpacing: "0.03em", animation: "fadeUp 0.6s ease", whiteSpace: "pre-wrap" }}>{reading}</div>}
              </div>
              <div style={{ textAlign: "center", marginTop: "18px" }}>
                <button className="gb" onClick={reset}>{t.newReading}</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
