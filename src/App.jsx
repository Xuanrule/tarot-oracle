import { useState, useEffect, useRef } from "react";

// ─── i18n ────────────────────────────────────────────────────────────────────
const T = {
  zh: {
    subtitle:"TARTOT ORACLE", title:"塔罗神谕", switchKey:"切换 Key",
    connectTitle:"连接你的 AI 神谕", connectDesc:"你的 Key 仅储存在本地浏览器，不会上传至任何服务器",
    keyPlaceholder:"输入 API Key（sk-...）", howToGet:"如何获取 API Key？", collapse:"收起教程",
    enterOracle:"✦ 进入神谕 ✦", chooseTheme:"选择占卜方向", chooseSpread:"选择牌阵",
    back:"← 返回", yourQuestion:"你的问题", questionPlaceholder:"将心中所惑，化作文字……",
    drawCards:"✦ 抽 牌 ✦", readingLoading:"✦ 正在解读星象 ✦", newReading:"↩ 重新占卜",
    reversed:"逆位", upright:"正位", cards:"张",
    themes:[
      {id:"general", name:"通用占卜", icon:"✦", desc:"日常问题 · 综合指引", color:"#C8A86A"},
      {id:"love",    name:"感情占卜", icon:"♡", desc:"爱情 · 缘分 · 关系",   color:"#D87A9A"},
      {id:"career",  name:"事业职场", icon:"◈", desc:"职业 · 机遇 · 人际",   color:"#7AAAD8"},
    ],
    spreads:{
      general:[
        {id:"single",   name:"单牌阵",   cards:1, desc:"是与否 · 每日运势 "},
        {id:"general3", name:"三牌阵", cards:3, desc:"通用问题推荐"},
        {id:"timeline", name:"时间流牌阵",     cards:3, desc:"过去 · 现在 · 未来的脉络"},
        {id:"choice",   name:"抉择二选一阵",     cards:2, desc:"两难选择 · 找到最优方向"},
      ],
      love:[
        {id:"lovetri",    name:"爱情三角牌阵",     cards:3, desc:"分析两人关系 · 预测未来潜力"},
        {id:"lovepyra",   name:"恋人金字塔牌阵",   cards:4, desc:"分析双方关系和立场 · 推测感情走向"},
        {id:"lovecross",  name:"爱情十字牌阵",     cards:5, desc:"大部分感情问题都适用 · 分手复合志爱发展"},
        {id:"lovereturn", name:"恋人回归复合牌阵", cards:4, desc:"分析前任想法 · 推测复合走向及可能性"},
      ],
      career:[
        {id:"careerpano",  name:"职业发展全景牌阵", cards:7, desc:"全面了解当前工作状态与发展空间"},
        {id:"opportunity", name:"机遇选择牌阵",     cards:5, desc:"分析眼前机会 · 评估成功几率"},
        {id:"transition",  name:"职业转型牌阵",     cards:6, desc:"转型过渡策略 · 找到新方向"},
        {id:"workplace",   name:"职场人际关系牌阵", cards:3, desc:"职场形象 · 上司 · 同事关系"},
      ],
    },
    spreadPositions:{
      single:     ["今日指引"],
      general3:   ["牌①","牌②","牌③"],
      timeline:   ["过去","现在","未来"],
      choice:     ["选项 A","选项 B","建议"],
      lovetri:    ["问卜者","对方","两人关系"],
      lovepyra:   ["问卜者","对象","彼此关系","未来走向"],
      lovecross:  ["我的态度","对方态度","现阶段","未来发展","结果"],
      lovereturn: ["前任对我","前任对复合","复合阻碍","关系未来"],
      careerpano: ["是否适合","晋升空间","人际发展","领导看法","注意事项","其他机会","综合建议"],
      opportunity:["内心纠结","眼前机会","成功几率","目前阻碍","最终结果"],
      transition: ["当前困境","潜在阻碍","过渡策略","外部支持","所需技能","理想状态"],
      workplace:  ["职场形象","与上司","与同事"],
    },
    providers:[
      {id:"deepseek", name:"DeepSeek", url:"https://platform.deepseek.com/api_keys",
       steps:["前往 platform.deepseek.com 注册","进入 API Keys → 创建 Key","复制密钥（sk- 开头）","新用户有免费额度，价格极低"]},
      {id:"openai",   name:"OpenAI GPT", url:"https://platform.openai.com/api-keys",
       steps:["前往 platform.openai.com 注册","进入 API Keys → 创建新密钥","复制密钥","需绑定信用卡才能持续使用"]},
    ],
  },
  en: {
    subtitle:"TAROT ORACLE", title:"The Oracle", switchKey:"Change Key",
    connectTitle:"Connect Your Oracle", connectDesc:"Your key is stored locally — never sent to any server",
    keyPlaceholder:"Enter API Key (sk-...)", howToGet:"How to get an API Key?", collapse:"Collapse",
    enterOracle:"✦ Enter the Oracle ✦", chooseTheme:"Choose Your Path", chooseSpread:"Choose a Spread",
    back:"← Back", yourQuestion:"Your Question", questionPlaceholder:"What do you wish to ask the cards...",
    drawCards:"✦ Draw the Cards ✦", readingLoading:"✦ Reading the stars ✦", newReading:"↩ New Reading",
    reversed:"Reversed", upright:"Upright", cards:"cards",
    themes:[
      {id:"general", name:"General", icon:"✦", desc:"Daily guidance · universal questions", color:"#C8A86A"},
      {id:"love",    name:"Love",  icon:"♡", desc:"Romance · bonds · relationships",      color:"#D87A9A"},
      {id:"career",  name:"Career",  icon:"◈", desc:"Work · opportunity · colleagues",      color:"#7AAAD8"},
    ],
    spreads:{
      general:[
        {id:"single",   name:"Single Card",       cards:1, desc:"Yes/no · daily energy · direct questions"},
        {id:"general3", name:"Three-Card General", cards:3, desc:"Versatile spread for any topic"},
        {id:"timeline", name:"Timeline",           cards:3, desc:"Past · Present · Future"},
        {id:"choice",   name:"Choice Spread",      cards:3, desc:"Two paths · find your direction"},
      ],
      love:[
        {id:"lovetri",    name:"Love Triangle",     cards:3, desc:"You · Them · The relationship potential"},
        {id:"lovepyra",   name:"Lovers' Pyramid",   cards:4, desc:"Positions, dynamics & future direction"},
        {id:"lovecross",  name:"Love Cross",        cards:5, desc:"Feelings, situation & outcome"},
        {id:"lovereturn", name:"Reunion Spread",    cards:4, desc:"Ex's thoughts · chances of reconciliation"},
      ],
      career:[
        {id:"careerpano",  name:"Career Panorama",    cards:7, desc:"Full overview of your career landscape"},
        {id:"opportunity", name:"Opportunity Spread", cards:5, desc:"Analyse a chance · assess success odds"},
        {id:"transition",  name:"Career Transition",  cards:6, desc:"Change strategy · find new direction"},
        {id:"workplace",   name:"Workplace Relations",cards:3, desc:"Your image · boss · colleagues"},
      ],
    },
    spreadPositions:{
      single:     ["Today's Guidance"],
      general3:   ["Card ①","Card ②","Card ③"],
      timeline:   ["Past","Present","Future"],
      choice:     ["Option A","Option B","Advice"],
      lovetri:    ["You","Them","The Bond"],
      lovepyra:   ["You","Them","Your Bond","Future"],
      lovecross:  ["Your Attitude","Their Attitude","Now","Future","Outcome"],
      lovereturn: ["How They See You","On Reunion","The Obstacle","Future"],
      careerpano: ["Fit?","Growth","Relations","Boss's View","Watch Out","Other Opps","Overall"],
      opportunity:["Inner Conflict","Opportunity","Success Odds","Obstacle","Outcome"],
      transition: ["Struggle","Obstacle","Strategy","Support","Skills Needed","Ideal State"],
      workplace:  ["Your Image","With Boss","With Colleagues"],
    },
    providers:[
      {id:"deepseek", name:"DeepSeek", url:"https://platform.deepseek.com/api_keys",
       steps:["Go to platform.deepseek.com","Go to API Keys → Create Key","Copy the key (starts with sk-)","New users get free credits"]},
      {id:"openai",   name:"OpenAI GPT", url:"https://platform.openai.com/api-keys",
       steps:["Go to platform.openai.com","Go to API Keys → Create new key","Copy the key","Credit card required for continued use"]},
    ],
  },
};

// ─── Spread grid layouts: {row,col} 1-indexed, 3-col grid ────────────────────
const SPREAD_GRIDS = {
  single:     [[1,2]],
  general3:   [[1,1],[1,2],[1,3]],
  timeline:   [[1,1],[1,2],[1,3]],
  choice:     [[1,1],[1,2],[1,3]],
  lovetri:    [[1,1],[1,3],[2,2]],
  lovepyra:   [[1,2],[2,1],[2,2],[2,3]],
  lovecross:  [[1,2],[2,1],[2,2],[2,3],[3,2]],
  lovereturn: [[1,1],[1,3],[2,1],[2,3]],
  careerpano: [[1,1],[1,2],[1,3],[2,2],[3,1],[3,3],[4,2]],
  opportunity:[[1,1],[1,3],[2,2],[3,1],[3,3]],
  transition: [[1,2],[2,1],[2,2],[2,3],[3,2],[4,2]],
  workplace:  [[1,2],[2,1],[2,3]],
};

// ─── Ornate SVG card back ─────────────────────────────────────────────────────
function OrnateBack({w=88,h=152,glowColor="#9A60E0"}) {
  const cx=w/2, cy=h/2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:"block"}}>
      <defs>
        <radialGradient id={`bg${w}`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#2e1550"/>
          <stop offset="100%" stopColor="#150830"/>
        </radialGradient>
        <filter id={`glow${w}`}>
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Card bg */}
      <rect x="0" y="0" width={w} height={h} rx="8" fill={`url(#bg${w})`}/>
      <rect x="1" y="1" width={w-2} height={h-2} rx="7" fill="none" stroke={glowColor} strokeWidth="1" opacity="0.6"/>
      {/* Inner border */}
      <rect x="6" y="6" width={w-12} height={h-12} rx="5" fill="none" stroke={glowColor} strokeWidth="0.5" opacity="0.35"/>
      {/* Corner ornaments */}
      {[[8,8],[w-8,8],[8,h-8],[w-8,h-8]].map(([x,y],i)=>(
        <g key={i} transform={`translate(${x},${y})`} filter={`url(#glow${w})`}>
          <circle r="3.5" fill="none" stroke={glowColor} strokeWidth="0.8" opacity="0.7"/>
          <circle r="1.2" fill={glowColor} opacity="0.8"/>
          <line x1="-7" y1="0" x2="7" y2="0" stroke={glowColor} strokeWidth="0.5" opacity="0.5"/>
          <line x1="0" y1="-7" x2="0" y2="7" stroke={glowColor} strokeWidth="0.5" opacity="0.5"/>
        </g>
      ))}
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={Math.min(w,h)*0.3} fill="none" stroke={glowColor} strokeWidth="0.6" opacity="0.3" strokeDasharray="3 4"/>
      <circle cx={cx} cy={cy} r={Math.min(w,h)*0.22} fill="none" stroke={glowColor} strokeWidth="0.5" opacity="0.5"/>
      {/* 8-pointed star */}
      {Array.from({length:8}).map((_,i)=>{
        const a=(i*45)*Math.PI/180, r1=Math.min(w,h)*0.19, r2=Math.min(w,h)*0.10;
        const x1=cx+Math.cos(a)*r1, y1=cy+Math.sin(a)*r1;
        const a2=((i*45)+22.5)*Math.PI/180;
        const x2=cx+Math.cos(a2)*r2, y2=cy+Math.sin(a2)*r2;
        return <line key={i} x1={cx} y1={cy} x2={x1} y2={y1} stroke={glowColor} strokeWidth="0.7" opacity="0.6"/>;
      })}
      {/* Petals */}
      {Array.from({length:8}).map((_,i)=>{
        const a=(i*45-22.5)*Math.PI/180, r=Math.min(w,h)*0.14;
        const px=cx+Math.cos(a)*r, py=cy+Math.sin(a)*r;
        return <ellipse key={i} cx={px} cy={py} rx="3" ry="5.5"
          transform={`rotate(${i*45+67.5},${px},${py})`}
          fill="none" stroke={glowColor} strokeWidth="0.5" opacity="0.45"/>;
      })}
      {/* Center gem */}
      <polygon points={`${cx},${cy-8} ${cx+7},${cy+4} ${cx},${cy+2} ${cx-7},${cy+4}`}
        fill={glowColor} opacity="0.25" filter={`url(#glow${w})`}/>
      <polygon points={`${cx},${cy-8} ${cx+7},${cy+4} ${cx},${cy+2} ${cx-7},${cy+4}`}
        fill="none" stroke={glowColor} strokeWidth="0.8" opacity="0.9"/>
      <circle cx={cx} cy={cy} r="2.5" fill={glowColor} opacity="0.9" filter={`url(#glow${w})`}/>
      {/* Side flourishes */}
      {[[cx,10],[cx,h-10],[12,cy],[w-12,cy]].map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="2" fill="none" stroke={glowColor} strokeWidth="0.6" opacity="0.55"/>
          <circle cx={x} cy={y} r="0.8" fill={glowColor} opacity="0.7"/>
        </g>
      ))}
    </svg>
  );
}

// ─── Spread diagram card (ornate mini) ───────────────────────────────────────
function MiniCard({label, glowColor}) {
  const w=32, h=48;
  return (
    <div style={{position:"relative",width:w,height:h}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:"block"}}>
        <defs>
          <radialGradient id="mcbg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#2e1550"/>
            <stop offset="100%" stopColor="#150830"/>
          </radialGradient>
          <filter id="mcglow">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect x="0" y="0" width={w} height={h} rx="4" fill="url(#mcbg)"/>
        <rect x="0.5" y="0.5" width={w-1} height={h-1} rx="3.5" fill="none" stroke={glowColor} strokeWidth="0.8" opacity="0.7"/>
        <rect x="3" y="3" width={w-6} height={h-6} rx="2" fill="none" stroke={glowColor} strokeWidth="0.4" opacity="0.4"/>
        {/* Corner dots */}
        {[[4,4],[w-4,4],[4,h-4],[w-4,h-4]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="1" fill={glowColor} opacity="0.6"/>
        ))}
        {/* Center star */}
        {Array.from({length:6}).map((_,i)=>{
          const a=(i*60)*Math.PI/180, r=7, cx=w/2, cy=h/2;
          return <line key={i} x1={cx} y1={cy} x2={cx+Math.cos(a)*r} y2={cy+Math.sin(a)*r}
            stroke={glowColor} strokeWidth="0.5" opacity="0.5" filter="url(#mcglow)"/>;
        })}
        <circle cx={w/2} cy={h/2} r="2" fill={glowColor} opacity="0.7" filter="url(#mcglow)"/>
      </svg>
    </div>
  );
}

function SpreadDiagram({spreadId, glowColor}) {
  const grid = SPREAD_GRIDS[spreadId];
  if (!grid) return null;
  const maxR = Math.max(...grid.map(([r])=>r));
  const maxC = Math.max(...grid.map(([,c])=>c));
  const cw=36, ch=52, gap=6;
  const tw = maxC*cw+(maxC-1)*gap, th = maxR*ch+(maxR-1)*gap;
  return (
    <div style={{display:"flex",justifyContent:"center",margin:"10px 0 8px"}}>
      <div style={{position:"relative",width:tw,height:th}}>
        {grid.map(([r,c],i)=>(
          <div key={i} style={{position:"absolute",left:(c-1)*(cw+gap),top:(r-1)*(ch+gap)}}>
            <MiniCard label={i+1} glowColor={glowColor}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Animated star canvas ─────────────────────────────────────────────────────
function StarCanvas() {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const N = 120;
    const stars = Array.from({length:N},()=>({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.2+0.2,
      phase: Math.random()*Math.PI*2,
      speed: Math.random()*0.008+0.003,
      color: Math.random()>0.85 ? `hsl(${280+Math.random()*40},80%,85%)` : "#ffffff",
    }));
    // Shooting stars
    const shoots = [];
    let shootTimer=0;
    const spawnShoot=()=>{
      shoots.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height*0.5,vx:3+Math.random()*3,vy:1+Math.random()*2,life:1});
    };
    const draw = (t) => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      // Stars
      stars.forEach(s=>{
        s.phase += s.speed;
        const alpha = 0.15 + 0.7*Math.abs(Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        // Glint cross for bigger stars
        if(s.r>0.9 && Math.abs(Math.sin(s.phase))>0.7){
          ctx.globalAlpha=alpha*0.4;
          ctx.strokeStyle=s.color;
          ctx.lineWidth=0.5;
          ctx.beginPath();ctx.moveTo(s.x-s.r*3,s.y);ctx.lineTo(s.x+s.r*3,s.y);ctx.stroke();
          ctx.beginPath();ctx.moveTo(s.x,s.y-s.r*3);ctx.lineTo(s.x,s.y+s.r*3);ctx.stroke();
        }
      });
      // Shooting stars
      shootTimer++;
      if(shootTimer>180){shootTimer=0;spawnShoot();}
      for(let i=shoots.length-1;i>=0;i--){
        const s=shoots[i];
        s.x+=s.vx; s.y+=s.vy; s.life-=0.02;
        if(s.life<=0){shoots.splice(i,1);continue;}
        const grad=ctx.createLinearGradient(s.x-s.vx*10,s.y-s.vy*10,s.x,s.y);
        grad.addColorStop(0,"transparent");
        grad.addColorStop(1,`rgba(255,255,240,${s.life*0.8})`);
        ctx.globalAlpha=s.life;
        ctx.strokeStyle=grad;
        ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(s.x-s.vx*10,s.y-s.vy*10);ctx.lineTo(s.x,s.y);ctx.stroke();
      }
      ctx.globalAlpha=1;
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>;
}

// ─── 78 Cards ─────────────────────────────────────────────────────────────────
const DECK=[
  {n:"The Fool",zh:"愚者",e:"🌟",k:"新开始·自由·冒险",c:"#C4A882"},
  {n:"The Magician",zh:"魔术师",e:"✨",k:"意志力·技巧·行动",c:"#8B6F9E"},
  {n:"The High Priestess",zh:"女祭司",e:"🌙",k:"直觉·神秘·内在智慧",c:"#5B8DB8"},
  {n:"The Empress",zh:"女皇",e:"🌸",k:"丰盛·创造·母性",c:"#8FB87A"},
  {n:"The Emperor",zh:"皇帝",e:"👑",k:"权威·稳定·秩序",c:"#C17B5A"},
  {n:"The Hierophant",zh:"教皇",e:"🔮",k:"传统·信仰·精神指引",c:"#7B8DB8"},
  {n:"The Lovers",zh:"恋人",e:"💫",k:"爱情·选择·和谐",c:"#C48B9E"},
  {n:"The Chariot",zh:"战车",e:"⚡",k:"胜利·控制·意志",c:"#B8A85B"},
  {n:"Strength",zh:"力量",e:"🦁",k:"勇气·耐心·内在力量",c:"#D4A843"},
  {n:"The Hermit",zh:"隐士",e:"🕯",k:"内省·孤独·寻求智慧",c:"#A0A0A0"},
  {n:"Wheel of Fortune",zh:"命运之轮",e:"🌀",k:"命运·转机·循环",c:"#7A9E8F"},
  {n:"Justice",zh:"正义",e:"⚖️",k:"公正·平衡·真相",c:"#8BB87A"},
  {n:"The Hanged Man",zh:"倒吊人",e:"🌿",k:"暂停·牺牲·新视角",c:"#5B8D9E"},
  {n:"Death",zh:"死神",e:"🌑",k:"结束·转变·重生",c:"#6B7B8B"},
  {n:"Temperance",zh:"节制",e:"🌊",k:"平衡·耐心·调和",c:"#7AB8B0"},
  {n:"The Devil",zh:"恶魔",e:"🔗",k:"束缚·物欲·阴暗面",c:"#8B6060"},
  {n:"The Tower",zh:"塔",e:"🌩",k:"突变·打破·启示",c:"#C07050"},
  {n:"The Star",zh:"星星",e:"⭐",k:"希望·灵感·指引",c:"#7A8FB8"},
  {n:"The Moon",zh:"月亮",e:"🌙",k:"幻象·恐惧·潜意识",c:"#8B7AB8"},
  {n:"The Sun",zh:"太阳",e:"☀️",k:"喜悦·活力·成功",c:"#D4B043"},
  {n:"Judgement",zh:"审判",e:"🎺",k:"觉醒·救赎·反思",c:"#8FA0B8"},
  {n:"The World",zh:"世界",e:"🌍",k:"完成·整合·成就",c:"#7AAB7A"},
  {n:"Ace of Wands",zh:"权杖王牌",e:"🔥",k:"灵感·热情·新开始",c:"#D4703A"},
  {n:"Two of Wands",zh:"权杖二",e:"🔥",k:"规划·远见·大胆选择",c:"#D4703A"},
  {n:"Three of Wands",zh:"权杖三",e:"🔥",k:"扩展·预见·机遇",c:"#D4703A"},
  {n:"Four of Wands",zh:"权杖四",e:"🔥",k:"庆祝·和谐·归属",c:"#D4703A"},
  {n:"Five of Wands",zh:"权杖五",e:"🔥",k:"冲突·竞争·张力",c:"#D4703A"},
  {n:"Six of Wands",zh:"权杖六",e:"🔥",k:"胜利·认可·自豪",c:"#D4703A"},
  {n:"Seven of Wands",zh:"权杖七",e:"🔥",k:"防守·坚持·挑战",c:"#D4703A"},
  {n:"Eight of Wands",zh:"权杖八",e:"🔥",k:"速度·动力·迅速变化",c:"#D4703A"},
  {n:"Nine of Wands",zh:"权杖九",e:"🔥",k:"韧性·耐力·最后防线",c:"#D4703A"},
  {n:"Ten of Wands",zh:"权杖十",e:"🔥",k:"负担·责任·超负荷",c:"#D4703A"},
  {n:"Page of Wands",zh:"权杖侍从",e:"🔥",k:"好奇·热情·冒险",c:"#D4703A"},
  {n:"Knight of Wands",zh:"权杖骑士",e:"🔥",k:"能量·激情·冲动",c:"#D4703A"},
  {n:"Queen of Wands",zh:"权杖女王",e:"🔥",k:"魅力·自信·热情",c:"#D4703A"},
  {n:"King of Wands",zh:"权杖国王",e:"🔥",k:"远见·领导力·大胆",c:"#D4703A"},
  {n:"Ace of Cups",zh:"圣杯王牌",e:"💧",k:"爱·新情感·慈悲",c:"#5B8DB8"},
  {n:"Two of Cups",zh:"圣杯二",e:"💧",k:"结合·连结·相互吸引",c:"#5B8DB8"},
  {n:"Three of Cups",zh:"圣杯三",e:"💧",k:"友谊·庆祝·社群",c:"#5B8DB8"},
  {n:"Four of Cups",zh:"圣杯四",e:"💧",k:"冷漠·沉思·错失机会",c:"#5B8DB8"},
  {n:"Five of Cups",zh:"圣杯五",e:"💧",k:"失落·悲伤·关注负面",c:"#5B8DB8"},
  {n:"Six of Cups",zh:"圣杯六",e:"💧",k:"怀旧·纯真·过去喜悦",c:"#5B8DB8"},
  {n:"Seven of Cups",zh:"圣杯七",e:"💧",k:"幻象·选择·幻想",c:"#5B8DB8"},
  {n:"Eight of Cups",zh:"圣杯八",e:"💧",k:"退场·继续前进·寻找意义",c:"#5B8DB8"},
  {n:"Nine of Cups",zh:"圣杯九",e:"💧",k:"满足·心满意足·愿望成真",c:"#5B8DB8"},
  {n:"Ten of Cups",zh:"圣杯十",e:"💧",k:"幸福·和谐·家庭美满",c:"#5B8DB8"},
  {n:"Page of Cups",zh:"圣杯侍从",e:"💧",k:"创意·直觉·敏感灵魂",c:"#5B8DB8"},
  {n:"Knight of Cups",zh:"圣杯骑士",e:"💧",k:"浪漫·魅力·理想主义",c:"#5B8DB8"},
  {n:"Queen of Cups",zh:"圣杯女王",e:"💧",k:"同理心·慈悲·情感深度",c:"#5B8DB8"},
  {n:"King of Cups",zh:"圣杯国王",e:"💧",k:"情感平衡·智慧·外交",c:"#5B8DB8"},
  {n:"Ace of Swords",zh:"宝剑王牌",e:"⚔️",k:"清晰·突破·真相",c:"#8FA0B8"},
  {n:"Two of Swords",zh:"宝剑二",e:"⚔️",k:"犹豫·僵局·回避",c:"#8FA0B8"},
  {n:"Three of Swords",zh:"宝剑三",e:"⚔️",k:"心碎·悲伤·痛苦",c:"#8FA0B8"},
  {n:"Four of Swords",zh:"宝剑四",e:"⚔️",k:"休息·恢复·沉思",c:"#8FA0B8"},
  {n:"Five of Swords",zh:"宝剑五",e:"⚔️",k:"冲突·失败·空洞胜利",c:"#8FA0B8"},
  {n:"Six of Swords",zh:"宝剑六",e:"⚔️",k:"过渡·继续前进·平静水域",c:"#8FA0B8"},
  {n:"Seven of Swords",zh:"宝剑七",e:"⚔️",k:"欺骗·策略·秘密",c:"#8FA0B8"},
  {n:"Eight of Swords",zh:"宝剑八",e:"⚔️",k:"限制·自我设限·困境",c:"#8FA0B8"},
  {n:"Nine of Swords",zh:"宝剑九",e:"⚔️",k:"焦虑·恐惧·噩梦",c:"#8FA0B8"},
  {n:"Ten of Swords",zh:"宝剑十",e:"⚔️",k:"痛苦结局·背叛·触底",c:"#8FA0B8"},
  {n:"Page of Swords",zh:"宝剑侍从",e:"⚔️",k:"好奇·机智·思维敏捷",c:"#8FA0B8"},
  {n:"Knight of Swords",zh:"宝剑骑士",e:"⚔️",k:"雄心·迅速行动·敏锐思维",c:"#8FA0B8"},
  {n:"Queen of Swords",zh:"宝剑女王",e:"⚔️",k:"清晰·独立·敏锐感知",c:"#8FA0B8"},
  {n:"King of Swords",zh:"宝剑国王",e:"⚔️",k:"智识·权威·道德判断",c:"#8FA0B8"},
  {n:"Ace of Pentacles",zh:"星币王牌",e:"🪙",k:"繁荣·新机会·丰盛",c:"#8FB87A"},
  {n:"Two of Pentacles",zh:"星币二",e:"🪙",k:"平衡·适应力·兼顾优先",c:"#8FB87A"},
  {n:"Three of Pentacles",zh:"星币三",e:"🪙",k:"团队合作·技能·工艺",c:"#8FB87A"},
  {n:"Four of Pentacles",zh:"星币四",e:"🪙",k:"安全感·控制·执着",c:"#8FB87A"},
  {n:"Five of Pentacles",zh:"星币五",e:"🪙",k:"困苦·孤立·财务损失",c:"#8FB87A"},
  {n:"Six of Pentacles",zh:"星币六",e:"🪙",k:"慷慨·给予·接受",c:"#8FB87A"},
  {n:"Seven of Pentacles",zh:"星币七",e:"🪙",k:"耐心·投资·长远眼光",c:"#8FB87A"},
  {n:"Eight of Pentacles",zh:"星币八",e:"🪙",k:"勤奋·精通·专注",c:"#8FB87A"},
  {n:"Nine of Pentacles",zh:"星币九",e:"🪙",k:"奢华·自立·精致",c:"#8FB87A"},
  {n:"Ten of Pentacles",zh:"星币十",e:"🪙",k:"遗产·财富·长久安全",c:"#8FB87A"},
  {n:"Page of Pentacles",zh:"星币侍从",e:"🪙",k:"雄心·勤奋·新财务方向",c:"#8FB87A"},
  {n:"Knight of Pentacles",zh:"星币骑士",e:"🪙",k:"可靠·耐心·有条不紊",c:"#8FB87A"},
  {n:"Queen of Pentacles",zh:"星币女王",e:"🪙",k:"养育·务实·大地丰盛",c:"#8FB87A"},
  {n:"King of Pentacles",zh:"星币国王",e:"🪙",k:"财富·稳定·供给者",c:"#8FB87A"},
];

const PROVIDER_CALL={
  deepseek:async(key,prompt)=>{
    const r=await fetch("https://api.deepseek.com/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:"deepseek-chat",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
    const d=await r.json();if(d.error)throw new Error(d.error.message);return d.choices?.[0]?.message?.content||"";
  },
  openai:async(key,prompt)=>{
    const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:"gpt-4o-mini",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
    const d=await r.json();if(d.error)throw new Error(d.error.message);return d.choices?.[0]?.message?.content||"";
  },
};

function cname(card,lang){return lang==="en"?card.n:card.zh;}

function TarotCard({card,isReversed,isRevealed,position,delay,lang}){
  const [vis,setVis]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVis(true),delay);return()=>clearTimeout(t);},[delay]);
  const t=T[lang];
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",maxWidth:"100px"}}>
      <div style={{fontSize:"11px",color:"#C0A8D8",fontFamily:"'ZCOOL XiaoWei',serif",textAlign:"center",lineHeight:1.4,minHeight:"18px",letterSpacing:"0.04em"}}>{position}</div>
      <div style={{width:"88px",height:"152px",perspective:"700px"}}>
        <div style={{width:"100%",height:"100%",position:"relative",transformStyle:"preserve-3d",transition:"transform 0.8s cubic-bezier(0.4,0,0.2,1)",transform:vis&&isRevealed?"rotateY(180deg)":"rotateY(0deg)"}}>
          {/* Back */}
          <div style={{position:"absolute",width:"100%",height:"100%",backfaceVisibility:"hidden"}}>
            <OrnateBack w={88} h={152}/>
          </div>
          {/* Front */}
          <div style={{position:"absolute",width:"100%",height:"100%",backfaceVisibility:"hidden",borderRadius:"8px",background:`linear-gradient(160deg,#1e1030,#2a1840,#1e1030)`,border:`1.5px solid ${card?.c||"#9A60E0"}`,boxShadow:card?`0 4px 22px ${card.c}55,inset 0 0 20px rgba(0,0,0,0.4)`:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"10px 8px",transform:isReversed?"rotateY(180deg) rotate(180deg)":"rotateY(180deg)"}}>
            {card&&(<>
              <div style={{fontSize:"28px",marginBottom:"8px",filter:`drop-shadow(0 0 8px ${card.c})`}}>{card.e}</div>
              <div style={{fontSize:"13px",fontFamily:"'Ma Shan Zheng',serif",color:"#F5EDE0",marginBottom:"5px",textAlign:"center",lineHeight:1.3,letterSpacing:"0.04em"}}>{cname(card,lang)}</div>
              <div style={{fontSize:"9px",color:card.c,textAlign:"center",lineHeight:1.6,opacity:0.9,letterSpacing:"0.03em"}}>{card.k.split("·").slice(0,2).join("·")}</div>
              {isReversed&&<div style={{marginTop:"6px",fontSize:"9px",color:"#E080A0",border:"0.5px solid #E080A0",padding:"2px 6px",borderRadius:"3px",letterSpacing:"0.08em"}}>{t.reversed}</div>}
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TarotApp(){
  const [lang,setLang]       = useState("zh");
  const [phase,setPhase]     = useState("setup");
  const [provId,setProvId]   = useState("deepseek");
  const [apiKey,setApiKey]   = useState("");
  const [showTut,setShowTut] = useState(false);
  const [showKey,setShowKey] = useState(false);
  const [theme,setTheme]     = useState(null);
  const [spread,setSpread]   = useState(null);
  const [question,setQ]      = useState("");
  const [cards,setCards]     = useState([]);
  const [revs,setRevs]       = useState([]);
  const [revealed,setRev]    = useState(false);
  const [reading,setReading] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError]     = useState("");

  const t=T[lang];

  useEffect(()=>{
    const k=localStorage.getItem("tarot_key"),p=localStorage.getItem("tarot_provider"),l=localStorage.getItem("tarot_lang");
    if(k&&p){setApiKey(k);setProvId(p);setPhase("theme");}
    if(l&&T[l])setLang(l);
  },[]);

  const saveLang=l=>{setLang(l);localStorage.setItem("tarot_lang",l);};
  const doSave=()=>{if(!apiKey.trim())return;localStorage.setItem("tarot_key",apiKey);localStorage.setItem("tarot_provider",provId);setPhase("theme");};

  const drawCards=()=>{
    if(!question.trim())return;
    const shuffled=[...DECK].sort(()=>Math.random()-0.5).slice(0,spread.cards);
    const r=shuffled.map(()=>Math.random()>0.5);
    setCards(shuffled);setRevs(r);setPhase("cards");setReading("");setError("");
    setTimeout(()=>setRev(true),200);
    setTimeout(()=>doReading(shuffled,r),shuffled.length*320+900);
  };

  const doReading=async(drawn,r)=>{
    setLoading(true);
    const pos=t.spreadPositions[spread.id];
    const desc=drawn.map((c,i)=>`${pos[i]}: ${cname(c,lang)} (${r[i]?t.reversed:t.upright}, ${c.k})`).join("\n");
    const li=lang==="en"?"Respond in English.":"请用简体中文回应。";
    const prompt=`你是一位充满智慧与神秘气息的塔罗占卜师。${li}\n\n问题：${question}\n牌阵：${spread.name}（${theme.name}）\n\n抽到的牌：\n${desc}\n\n请逐一解读每张牌与问题的关系，最后给出综合建议。语气温暖而神秘，富有诗意，同时有实质性指引。300字以内。`;
    try{setReading(await PROVIDER_CALL[provId](apiKey,prompt));}
    catch(e){setError(`⚠️ ${e.message||"API 调用失败，请检查 Key"}`);}
    setLoading(false);
  };

  const reset=()=>{setPhase("theme");setTheme(null);setSpread(null);setQ("");setCards([]);setRevs([]);setRev(false);setReading("");setError("");};
  const clearKey=()=>{localStorage.removeItem("tarot_key");localStorage.removeItem("tarot_provider");setApiKey("");setPhase("setup");reset();};
  const prov=t.providers.find(p=>p.id===provId);

  return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet"/>
      <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#0e0820 0%,#160d30 50%,#0e0820 100%)",position:"relative",overflow:"hidden",fontFamily:"'ZCOOL XiaoWei',serif"}}>

        <StarCanvas/>

        <style>{`
          @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          @keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:1}}
          @keyframes pulse{0%,100%{box-shadow:0 0 20px rgba(180,120,255,0.2)}50%{box-shadow:0 0 40px rgba(180,120,255,0.5)}}
          .ti{width:100%;box-sizing:border-box;background:rgba(255,255,255,0.06);border:1px solid rgba(180,130,255,0.35);border-radius:10px;color:#EEE0FF;font-size:16px;padding:13px 16px;outline:none;font-family:'ZCOOL XiaoWei',serif;resize:none;transition:border-color 0.3s}
          .ti:focus{border-color:rgba(210,160,255,0.8);background:rgba(255,255,255,0.09)}
          .ti::placeholder{color:rgba(180,140,220,0.4)}
          .tb{background:linear-gradient(135deg,#4a1f78,#7030b0);border:1px solid rgba(200,140,255,0.5);border-radius:10px;color:#F0E4FF;font-size:17px;padding:14px 40px;cursor:pointer;font-family:'ZCOOL XiaoWei',serif;letter-spacing:0.15em;transition:all 0.25s;box-shadow:0 4px 24px rgba(130,60,220,0.4)}
          .tb:hover{background:linear-gradient(135deg,#5a2888,#8040c0);transform:translateY(-2px);box-shadow:0 8px 32px rgba(150,80,240,0.5)}
          .tb:disabled{opacity:0.3;cursor:not-allowed;transform:none;box-shadow:none}
          .gb{background:transparent;border:1px solid rgba(180,130,220,0.3);border-radius:7px;color:rgba(210,170,250,0.7);font-size:14px;padding:7px 18px;cursor:pointer;font-family:'ZCOOL XiaoWei',serif;transition:all 0.2s}
          .gb:hover{border-color:rgba(210,170,255,0.7);color:#E0C8FF;background:rgba(100,50,160,0.15)}
          .pvbtn{background:transparent;border:1px solid rgba(160,100,210,0.3);border-radius:7px;color:rgba(200,160,240,0.65);font-size:14px;padding:7px 20px;cursor:pointer;font-family:'ZCOOL XiaoWei',serif;transition:all 0.2s}
          .pvbtn.on{background:rgba(110,45,170,0.35);border-color:rgba(210,150,255,0.65);color:#E0C0FF}
          .lb{background:transparent;border:1px solid rgba(180,120,230,0.25);border-radius:6px;color:rgba(200,160,230,0.55);font-size:13px;padding:5px 14px;cursor:pointer;font-family:'ZCOOL XiaoWei',serif;transition:all 0.2s}
          .lb.on{border-color:rgba(210,150,255,0.7);color:#DCC0F8;background:rgba(110,45,170,0.3)}
          .themecard{position:relative;border-radius:16px;padding:28px 24px;cursor:pointer;transition:all 0.3s;text-align:center;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);backdrop-filter:blur(4px);overflow:hidden}
          .themecard:hover{transform:translateY(-3px);border-color:rgba(255,255,255,0.2)}
          .spreadcard{background:rgba(255,255,255,0.04);border:1px solid rgba(180,130,240,0.2);border-radius:14px;padding:18px 16px;cursor:pointer;transition:all 0.25s;text-align:center}
          .spreadcard:hover{background:rgba(120,60,200,0.2);border-color:rgba(210,160,255,0.45);transform:translateY(-3px)}
        `}</style>

        {/* Header */}
        <div style={{textAlign:"center",padding:"32px 28px 20px",position:"relative",zIndex:1}}>
          <div style={{fontSize:"11px",letterSpacing:"0.35em",color:"#9A70C8",marginBottom:"8px"}}>✦ {t.subtitle} ✦</div>
          <div style={{fontSize:"32px",fontFamily:"'Ma Shan Zheng',serif",color:"#F0E4FF",letterSpacing:"0.12em",textShadow:"0 0 40px rgba(210,150,255,0.5)"}}>{t.title}</div>
          <div style={{display:"flex",gap:"8px",justifyContent:"center",marginTop:"14px"}}>
            {["zh","en"].map(l=><button key={l} className={`lb${lang===l?" on":""}`} onClick={()=>saveLang(l)}>{l==="zh"?"简体中文":"English"}</button>)}
          </div>
          {phase!=="setup"&&(
            <button className="gb" onClick={clearKey} style={{position:"absolute",right:"24px",top:"36px",fontSize:"12px"}}>{t.switchKey}</button>
          )}
        </div>

        <div style={{position:"relative",zIndex:1,padding:"0 20px 40px",animation:"fadeUp 0.5s ease"}}>

          {/* ── Setup ── */}
          {phase==="setup"&&(
            <div style={{maxWidth:"440px",margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:"26px"}}>
                <div style={{fontSize:"16px",color:"#9A70C8",marginBottom:"8px",letterSpacing:"0.06em"}}>✦ {t.connectTitle} ✦</div>
                <div style={{fontSize:"13px",color:"rgba(180,150,220,0.55)",lineHeight:1.9}}>{t.connectDesc}</div>
              </div>
              <div style={{display:"flex",gap:"10px",marginBottom:"18px",justifyContent:"center"}}>
                {t.providers.map(p=><button key={p.id} className={`pvbtn${provId===p.id?" on":""}`} onClick={()=>setProvId(p.id)}>{p.name}</button>)}
              </div>
              <div style={{position:"relative",marginBottom:"14px"}}>
                <input type={showKey?"text":"password"} className="ti" placeholder={t.keyPlaceholder} value={apiKey} onChange={e=>setApiKey(e.target.value)} style={{paddingRight:"44px"}}/>
                <button onClick={()=>setShowKey(!showKey)} style={{position:"absolute",right:"14px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(190,150,230,0.7)",cursor:"pointer",fontSize:"16px"}}>{showKey?"🙈":"👁"}</button>
              </div>
              <button onClick={()=>setShowTut(!showTut)} style={{background:"none",border:"none",color:"rgba(190,150,230,0.65)",fontSize:"14px",cursor:"pointer",padding:"0 0 16px",fontFamily:"'ZCOOL XiaoWei',serif"}}>{showTut?`▲ ${t.collapse}`:`▼ ${t.howToGet}`}</button>
              {showTut&&prov&&(
                <div style={{background:"rgba(80,30,130,0.25)",border:"1px solid rgba(160,100,230,0.2)",borderRadius:"12px",padding:"18px 22px",marginBottom:"18px"}}>
                  {prov.steps.map((step,i)=>(
                    <div key={i} style={{display:"flex",gap:"12px",marginBottom:"12px",alignItems:"flex-start"}}>
                      <div style={{width:"20px",height:"20px",borderRadius:"50%",background:"rgba(160,100,230,0.2)",border:"1px solid rgba(210,150,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",color:"#C8A8F0",flexShrink:0,marginTop:"2px"}}>{i+1}</div>
                      <div style={{fontSize:"14px",color:"rgba(235,215,255,0.85)",lineHeight:1.8}}>{step}</div>
                    </div>
                  ))}
                  <a href={prov.url} target="_blank" rel="noreferrer" style={{display:"inline-block",marginTop:"8px",fontSize:"13px",color:"rgba(210,170,255,0.85)",textDecoration:"none",borderBottom:"1px solid rgba(210,170,255,0.3)"}}>→ 前往 {prov.name}</a>
                </div>
              )}
              <button className="tb" onClick={doSave} disabled={!apiKey.trim()} style={{width:"100%"}}>{t.enterOracle}</button>
            </div>
          )}

          {/* ── Theme — full screen vertical ── */}
          {phase==="theme"&&(
            <div style={{maxWidth:"500px",margin:"0 auto"}}>
              <div style={{fontSize:"15px",color:"#9A70C8",letterSpacing:"0.12em",textAlign:"center",marginBottom:"22px"}}>✦ {t.chooseTheme} ✦</div>
              <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                {t.themes.map(th=>(
                  <button key={th.id} className="themecard" onClick={()=>{setTheme(th);setPhase("spread");}}
                    style={{borderColor:`${th.color}33`}}>
                    {/* Subtle gradient bg */}
                    <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 0%, ${th.color}18 0%, transparent 70%)`,borderRadius:"16px",pointerEvents:"none"}}/>
                    <div style={{position:"relative"}}>
                      <div style={{fontSize:"32px",marginBottom:"6px",filter:`drop-shadow(0 0 12px ${th.color})`}}>{th.icon}</div>
                      <div style={{fontSize:"11px",letterSpacing:"0.3em",color:th.color,opacity:0.7,marginBottom:"4px"}}>{th.sub}</div>
                      <div style={{fontSize:"22px",fontFamily:"'Ma Shan Zheng',serif",color:"#F0E4FF",marginBottom:"8px",letterSpacing:"0.08em"}}>{th.name}</div>
                      <div style={{fontSize:"14px",color:"rgba(210,185,250,0.6)",letterSpacing:"0.04em"}}>{th.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Spread ── */}
          {phase==="spread"&&theme&&(
            <div style={{maxWidth:"560px",margin:"0 auto"}}>
              <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"22px"}}>
                <button className="gb" onClick={()=>setPhase("theme")}>{t.back}</button>
                <div style={{fontSize:"15px",color:theme.color,letterSpacing:"0.06em"}}>✦ {theme.name} — {t.chooseSpread}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
                {t.spreads[theme.id].map(sp=>(
                  <button key={sp.id} className="spreadcard" onClick={()=>{setSpread(sp);setPhase("input");}}>
                    <div style={{fontSize:"17px",fontFamily:"'Ma Shan Zheng',serif",color:"#F0E4FF",marginBottom:"4px",letterSpacing:"0.04em"}}>{sp.name}</div>
                    <SpreadDiagram spreadId={sp.id} glowColor={theme.color}/>
                    <div style={{fontSize:"12px",color:"rgba(200,175,240,0.65)",lineHeight:1.7,marginTop:"6px"}}>{sp.desc}</div>
                    <div style={{marginTop:"10px",fontSize:"12px",color:theme.color,border:`1px solid ${theme.color}44`,borderRadius:"5px",padding:"3px 10px",display:"inline-block",opacity:0.85}}>{sp.cards} {t.cards}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Input ── */}
          {phase==="input"&&spread&&(
            <div style={{maxWidth:"460px",margin:"0 auto"}}>
              <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"20px"}}>
                <button className="gb" onClick={()=>setPhase("spread")}>{t.back}</button>
                <div style={{fontSize:"15px",color:theme?.color||"#9A70C8"}}>✦ {spread.name}</div>
              </div>
              <div style={{fontSize:"14px",color:"#9A70C8",marginBottom:"12px",letterSpacing:"0.06em"}}>✦ {t.yourQuestion}</div>
              <textarea className="ti" rows={4} placeholder={t.questionPlaceholder} value={question} onChange={e=>setQ(e.target.value)}/>
              <div style={{textAlign:"center",marginTop:"28px"}}>
                <button className="tb" onClick={drawCards} disabled={!question.trim()}>{t.drawCards}</button>
              </div>
            </div>
          )}

          {/* ── Cards ── */}
          {phase==="cards"&&(
            <div>
              <div style={{textAlign:"center",fontSize:"15px",color:"rgba(220,190,255,0.65)",marginBottom:"26px",fontStyle:"italic"}}>「{question}」</div>
              <div style={{display:"flex",justifyContent:"center",gap:"12px",flexWrap:"wrap",marginBottom:"32px"}}>
                {cards.map((card,i)=><TarotCard key={i} card={card} isReversed={revs[i]} isRevealed={revealed} position={t.spreadPositions[spread.id][i]} delay={i*320} lang={lang}/>)}
              </div>
              <div style={{maxWidth:"560px",margin:"0 auto",background:"rgba(80,30,130,0.2)",border:"1px solid rgba(170,110,240,0.25)",borderRadius:"16px",padding:"26px",minHeight:"90px",backdropFilter:"blur(6px)"}}>
                {loading&&<div style={{textAlign:"center",color:"#B898E0",fontSize:"15px",letterSpacing:"0.15em",animation:"shimmer 1.8s ease-in-out infinite"}}>{t.readingLoading}</div>}
                {error&&<div style={{color:"#E08088",fontSize:"14px",textAlign:"center"}}>{error}</div>}
                {reading&&<div style={{color:"#EEE0FF",fontSize:"16px",lineHeight:2.1,letterSpacing:"0.03em",animation:"fadeUp 0.7s ease",whiteSpace:"pre-wrap"}}>{reading}</div>}
              </div>
              <div style={{textAlign:"center",marginTop:"24px"}}>
                <button className="gb" onClick={reset}>{t.newReading}</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
