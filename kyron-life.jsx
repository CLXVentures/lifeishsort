import { useState, useMemo } from "react";

const AVG_LIFE_EXPECTANCY = 82;
const WEEKS_PER_YEAR = 52;
const HOURS_PER_WEEK = 168;

const COMMITMENT_CATEGORIES = [
  { id: "sleep",    label: "Sleep",                color: "#4A5568", icon: "🌙" },
  { id: "work",     label: "Work / Career",         color: "#2B6CB0", icon: "💼" },
  { id: "family",   label: "Family & Relationships", color: "#C05621", icon: "❤️" },
  { id: "health",   label: "Health & Fitness",      color: "#276749", icon: "⚡" },
  { id: "growth",   label: "Personal Growth",       color: "#553C9A", icon: "📚" },
  { id: "creative", label: "Creativity & Passion",  color: "#B7791F", icon: "✦" },
];

const GOAL_COLORS = [
  "#E53E3E","#DD6B20","#D69E2E","#38A169","#3182CE","#805AD5","#D53F8C"
];

const weeksLived = (age) => Math.floor(age * WEEKS_PER_YEAR);
const totalWeeks = (life) => Math.floor(life * WEEKS_PER_YEAR);
const weeksRemaining = (age, life) => totalWeeks(life) - weeksLived(age);

const dateToWeekIndex = (date, birthYear) => {
  const start = new Date(birthYear, 0, 1);
  const diff = date - start;
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
};

const freeHoursPerWeek = (commitments) => {
  const used = commitments.reduce((sum, c) => sum + (parseFloat(c.hoursPerWeek) || 0), 0);
  return Math.max(0, HOURS_PER_WEEK - used);
};

const C = {
  bg:      "#0D0D0D",
  surface: "#161616",
  border:  "#2A2A2A",
  gold:    "#C9A84C",
  text:    "#E8E4DC",
  muted:   "#666666",
  dim:     "#222222",
  dotLive: "#3A3A3A",
  dotPast: "#1A1A1A",
};

const Input = ({ label, value, onChange, type = "text", min, max, placeholder, hint }) => (
  <div style={{ marginBottom: 20 }}>
    {label && <div style={{ color: C.muted, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>}
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      min={min} max={max} placeholder={placeholder}
      style={{ width: "100%", background: C.dim, border: "1px solid " + C.border, color: C.text, borderRadius: 6, padding: "10px 14px", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "system-ui, -apple-system, sans-serif" }}
    />
    {hint && <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{hint}</div>}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", small = false, style: s = {} }) => (
  <button onClick={onClick} style={{ background: variant === "primary" ? C.gold : variant === "ghost" ? "transparent" : C.dim, color: variant === "primary" ? "#0D0D0D" : C.text, border: variant === "ghost" ? "1px solid " + C.border : "none", borderRadius: 6, padding: small ? "6px 14px" : "11px 24px", fontSize: small ? 12 : 14, fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em", ...s }}>{children}</button>
);

const LeadIn = ({ onNext }) => (
  <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
    <div style={{ maxWidth: 540, textAlign: "center" }}>
      <div style={{ fontSize: 13, letterSpacing: "0.2em", color: C.gold, textTransform: "uppercase", marginBottom: 32 }}>KYRON LIFE</div>
      <div style={{ fontSize: 38, fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 24 }}>You have been given<br />a finite number of weeks.</div>
      <div style={{ fontSize: 17, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>Most of them are already behind you.</div>
      <div style={{ fontSize: 17, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>The ones ahead are not guaranteed —<br />but they can be <em style={{ color: C.text }}>intentional.</em></div>
      <div style={{ fontSize: 17, color: C.muted, lineHeight: 1.7, marginBottom: 48 }}>Kyron Life shows you what you have, what you have committed to,<br />and what is still yours to spend.</div>
      <Btn onClick={onNext}>See my life in weeks</Btn>
      <div style={{ marginTop: 20, color: C.muted, fontSize: 12 }}>Takes 2 minutes. Nothing is stored.</div>
    </div>
  </div>
);

const Setup = ({ onNext }) => {
  const [age, setAge] = useState("");
  const [life, setLife] = useState(AVG_LIFE_EXPECTANCY);
  const weeksLeft = age ? weeksRemaining(parseInt(age), parseInt(life)) : null;
  const yearsLeft = weeksLeft ? Math.floor(weeksLeft / 52) : null;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <div style={{ fontSize: 13, letterSpacing: "0.2em", color: C.gold, textTransform: "uppercase", marginBottom: 24 }}>STEP 1 OF 3</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 8 }}>Your time, in weeks</div>
        <div style={{ fontSize: 15, color: C.muted, marginBottom: 36, lineHeight: 1.6 }}>We will use average life expectancy as a starting point. Adjust it to reflect your health and lifestyle.</div>
        <Input label="Your current age" type="number" value={age} onChange={setAge} min={1} max={99} placeholder="e.g. 34" />
        <Input label="Life expectancy (years)" type="number" value={life} onChange={v => setLife(v)} min={50} max={120} hint={"Global average is " + AVG_LIFE_EXPECTANCY + ". Adjust up for healthy lifestyle or family longevity."} />
        {weeksLeft !== null && (
          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: "20px 24px", marginBottom: 28, textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: C.gold, lineHeight: 1 }}>{weeksLeft.toLocaleString()}</div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 6 }}>weeks remaining · {yearsLeft} years</div>
          </div>
        )}
        <Btn onClick={() => age && onNext({ age: parseInt(age), life: parseInt(life) })} style={{ width: "100%", opacity: age ? 1 : 0.4 }}>Show me my dot grid</Btn>
      </div>
    </div>
  );
};

const DotGrid = ({ age, life, goals, goalToggle }) => {
  const lived = weeksLived(age);
  const total = totalWeeks(life);
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;

  const goalWeekMap = useMemo(() => {
    const map = {};
    goals.forEach((g, gi) => {
      if (!g.deadline) return;
      const wi = dateToWeekIndex(new Date(g.deadline), birthYear);
      if (!map[wi]) map[wi] = [];
      map[wi].push(gi);
    });
    return map;
  }, [goals, birthYear]);

  const dotSize = 9;
  const gap = 2;
  const cols = 52;

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "52vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(" + cols + ", " + dotSize + "px)", gap: gap + "px", width: cols * (dotSize + gap) }}>
        {Array.from({ length: total }, (_, i) => {
          const isPast = i < lived;
          const isCurrent = i === lived;
          const goalIndices = goalToggle ? (goalWeekMap[i] || []) : [];
          const hasGoal = goalIndices.length > 0;
          const goalColor = hasGoal ? GOAL_COLORS[goalIndices[0] % GOAL_COLORS.length] : null;
          return (
            <div key={i} title={"Week " + (i + 1) + " of " + total} style={{ width: dotSize, height: dotSize, borderRadius: "50%", background: hasGoal ? goalColor : isPast ? C.dotPast : isCurrent ? C.gold : C.dotLive, boxShadow: isCurrent ? "0 0 6px " + C.gold : "none", opacity: isPast ? 0.35 : 1, flexShrink: 0 }} />
          );
        })}
      </div>
    </div>
  );
};

const CommitmentsPanel = ({ commitments, setCommitments }) => {
  const add = () => setCommitments([...commitments, { id: Date.now(), categoryId: "work", hoursPerWeek: "" }]);
  const remove = (id) => setCommitments(commitments.filter(c => c.id !== id));
  const update = (id, field, val) => setCommitments(commitments.map(c => c.id === id ? { ...c, [field]: val } : c));
  const used = commitments.reduce((s, c) => s + (parseFloat(c.hoursPerWeek) || 0), 0);
  const free = Math.max(0, HOURS_PER_WEEK - used);
  const pct = Math.min(100, (used / HOURS_PER_WEEK) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: "0.06em" }}>WEEKLY COMMITMENTS</div>
        <Btn small onClick={add} variant="ghost">+ Add</Btn>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ height: 4, background: C.dim, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", background: pct > 90 ? "#E53E3E" : C.gold, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: C.muted }}>
          <span>{used.toFixed(0)}h committed</span>
          <span style={{ color: free < 20 ? "#E53E3E" : C.gold }}>{free.toFixed(0)}h free per week</span>
        </div>
      </div>
      {commitments.map(c => (
        <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
          <select value={c.categoryId} onChange={e => update(c.id, "categoryId", e.target.value)} style={{ background: C.dim, border: "1px solid " + C.border, color: C.text, borderRadius: 6, padding: "8px 10px", fontSize: 13, flex: 2 }}>
            {COMMITMENT_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>)}
          </select>
          <input type="number" value={c.hoursPerWeek} onChange={e => update(c.id, "hoursPerWeek", e.target.value)} placeholder="hrs/wk" min={0} max={168} style={{ background: C.dim, border: "1px solid " + C.border, color: C.text, borderRadius: 6, padding: "8px 10px", fontSize: 13, width: 70, textAlign: "center" }} />
          <button onClick={() => remove(c.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16, padding: "0 4px" }}>x</button>
        </div>
      ))}
    </div>
  );
};

const GoalsPanel = ({ goals, setGoals, freeHours }) => {
  const add = () => setGoals([...goals, { id: Date.now(), label: "", deadline: "", hoursPerWeek: "", colorIndex: goals.length % GOAL_COLORS.length }]);
  const remove = (id) => setGoals(goals.filter(g => g.id !== id));
  const update = (id, field, val) => setGoals(goals.map(g => g.id === id ? { ...g, [field]: val } : g));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: "0.06em" }}>GOALS</div>
        <Btn small onClick={add} variant="ghost">+ Add Goal</Btn>
      </div>
      {goals.length === 0 && <div style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: "24px 0" }}>Add a goal. See if your time can actually hold it.</div>}
      {goals.map((g) => {
        const color = GOAL_COLORS[g.colorIndex % GOAL_COLORS.length];
        const weeksToDeadline = g.deadline ? Math.max(0, Math.floor((new Date(g.deadline) - new Date()) / (7 * 24 * 60 * 60 * 1000))) : null;
        const totalHrsNeeded = g.hoursPerWeek && weeksToDeadline !== null ? parseFloat(g.hoursPerWeek) * weeksToDeadline : null;
        const totalHrsAvailable = weeksToDeadline !== null ? freeHours * weeksToDeadline : null;
        const shortfall = totalHrsNeeded !== null && totalHrsAvailable !== null ? totalHrsNeeded - totalHrsAvailable : null;
        const feasible = shortfall !== null ? shortfall <= 0 : null;
        return (
          <div key={g.id} style={{ background: C.dim, border: "1px solid " + color + "33", borderRadius: 8, padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <input value={g.label} onChange={e => update(g.id, "label", e.target.value)} placeholder="Name this goal..." style={{ flex: 1, background: "transparent", border: "none", color: C.text, fontSize: 14, fontWeight: 600, outline: "none" }} />
              <button onClick={() => remove(g.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>x</button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, letterSpacing: "0.08em" }}>DEADLINE</div>
                <input type="date" value={g.deadline} onChange={e => update(g.id, "deadline", e.target.value)} style={{ width: "100%", background: C.surface, border: "1px solid " + C.border, color: C.text, borderRadius: 6, padding: "7px 10px", fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, letterSpacing: "0.08em" }}>HRS / WEEK NEEDED</div>
                <input type="number" value={g.hoursPerWeek} onChange={e => update(g.id, "hoursPerWeek", e.target.value)} placeholder="e.g. 5" min={0} style={{ width: "100%", background: C.surface, border: "1px solid " + C.border, color: C.text, borderRadius: 6, padding: "7px 10px", fontSize: 13, boxSizing: "border-box" }} />
              </div>
            </div>
            {shortfall !== null && weeksToDeadline > 0 && (
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 6, background: feasible ? "#27674922" : "#E53E3E18", border: "1px solid " + (feasible ? "#27674944" : "#E53E3E44") }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: feasible ? "#68D391" : "#FC8181", marginBottom: 4 }}>{feasible ? "Achievable" : "Not enough time"}</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
                  {weeksToDeadline} weeks to deadline · {totalHrsAvailable !== null ? totalHrsAvailable.toFixed(0) : 0}h available
                  <br />{totalHrsNeeded !== null ? totalHrsNeeded.toFixed(0) : 0}h needed at {g.hoursPerWeek}h/week
                  {!feasible && shortfall > 0 && <span style={{ color: "#FC8181" }}> · {shortfall.toFixed(0)}h shortfall</span>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function KyronLife() {
  const [screen, setScreen] = useState("leadin");
  const [userData, setUserData] = useState(null);
  const [commitments, setCommitments] = useState([
    { id: 1, categoryId: "sleep",  hoursPerWeek: "56" },
    { id: 2, categoryId: "work",   hoursPerWeek: "45" },
    { id: 3, categoryId: "family", hoursPerWeek: "20" },
  ]);
  const [goals, setGoals] = useState([]);
  const [goalToggle, setGoalToggle] = useState(true);
  const [activeTab, setActiveTab] = useState("commitments");

  const freeHrs = freeHoursPerWeek(commitments);
  const lived = userData ? weeksLived(userData.age) : 0;
  const total = userData ? totalWeeks(userData.life) : 0;
  const remaining = total - lived;
  const pctLived = total > 0 ? ((lived / total) * 100).toFixed(1) : 0;

  if (screen === "leadin") return <LeadIn onNext={() => setScreen("setup")} />;
  if (screen === "setup") return <Setup onNext={(data) => { setUserData(data); setScreen("main"); }} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: "1px solid " + C.border, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.2em", color: C.gold }}>KYRON LIFE</div>
          <div style={{ width: 1, height: 16, background: C.border }} />
          <div style={{ fontSize: 12, color: C.muted }}>Age {userData.age} · {remaining.toLocaleString()} weeks remaining</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 11, color: C.muted }}>Goal deadlines</div>
          <div onClick={() => setGoalToggle(!goalToggle)} style={{ width: 36, height: 20, borderRadius: 10, cursor: "pointer", position: "relative", background: goalToggle ? C.gold : C.dim, transition: "background 0.2s" }}>
            <div style={{ position: "absolute", top: 3, left: goalToggle ? 18 : 3, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
          <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              { label: "Weeks lived",      value: lived.toLocaleString(),     color: C.muted },
              { label: "Weeks remaining",  value: remaining.toLocaleString(), color: C.gold },
              { label: "Life elapsed",     value: pctLived + "%",             color: C.text },
              { label: "Free hrs / week",  value: freeHrs.toFixed(0) + "h",  color: freeHrs < 20 ? "#FC8181" : "#68D391" },
            ].map(s => (
              <div key={s.label} style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: "12px 18px", minWidth: 110 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
            {[
              { dot: C.dotPast, label: "Weeks lived", opacity: 0.35 },
              { dot: C.gold,    label: "This week" },
              { dot: C.dotLive, label: "Weeks ahead" },
              ...(goalToggle ? goals.filter(g => g.deadline && g.label).map((g) => ({ dot: GOAL_COLORS[g.colorIndex % GOAL_COLORS.length], label: g.label })) : [])
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.dot, opacity: l.opacity || 1, flexShrink: 0 }} />
                {l.label}
              </div>
            ))}
          </div>
          <DotGrid age={userData.age} life={userData.life} goals={goals} goalToggle={goalToggle} />
          <div style={{ marginTop: 16, fontSize: 11, color: C.muted }}>Each dot = one week · {total.toLocaleString()} total · columns = years</div>
        </div>
        <div style={{ width: 360, borderLeft: "1px solid " + C.border, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ display: "flex", borderBottom: "1px solid " + C.border }}>
            {["commitments", "goals"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: "14px 0", background: "none", border: "none", color: activeTab === tab ? C.gold : C.muted, borderBottom: activeTab === tab ? "2px solid " + C.gold : "2px solid transparent", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                {tab === "commitments" ? "Commitments" : "Goals"}
              </button>
            ))}
          </div>
          <div style={{ padding: "20px 20px", flex: 1 }}>
            {activeTab === "commitments"
              ? <CommitmentsPanel commitments={commitments} setCommitments={setCommitments} />
              : <GoalsPanel goals={goals} setGoals={setGoals} freeHours={freeHrs} />}
          </div>
          <div style={{ borderTop: "1px solid " + C.border, padding: "16px 20px", background: C.surface }}>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7 }}>
              {freeHrs < 10
                ? <span style={{ color: "#FC8181" }}>Less than {freeHrs.toFixed(0)} free hours per week. Something has to give.</span>
                : freeHrs < 25
                ? <span style={{ color: "#F6AD55" }}>You have {freeHrs.toFixed(0)} free hours per week. Enough — if you protect them.</span>
                : <span style={{ color: "#68D391" }}>You have {freeHrs.toFixed(0)} free hours per week. The question is what you fill them with.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
