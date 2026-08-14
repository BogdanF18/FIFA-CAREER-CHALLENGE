function buildSeasonResultCard(challenge) {
  const season = challenge?.contractSeasonData || {};
  const completed = Number(season.completedObjectives || 0);
  const failed = Number(season.failedObjectives || 0);
  const trophies = Number(season.trophies || season.teamTrophies || 0);
  const position = Number(season.position || 0);
  const baseScore = Math.min(99, Math.max(55, 65 + completed * 7 + trophies * 8 + (position > 0 && position <= 4 ? 10 : 0) - failed * 8));
  const title = challenge?.type === "manager" ? "Review sezon — Manager" : "Review sezon — Jucător";
  const clubName = challenge?.club?.name || "Echipa ta";
  const leagueName = challenge?.club?.league || "Liga ta";
  const summary = `${clubName} · ${leagueName} · ${challenge?.objective || "Sezon nou"}`;
  const actions = ["Începe sezonul nou", "Descarcă cardul"];

  return {
    score: baseScore,
    title,
    summary,
    actions,
    stats: {
      placement: position || "—",
      trophies,
      completedObjectives: completed,
      failedObjectives: failed,
      boardSatisfaction: challenge?.seasonReview?.boardSatisfaction || 62
    }
  };
}

(function () {
  if (typeof document === "undefined") {
    if (typeof module !== "undefined") {
      module.exports = { buildSeasonResultCard };
    }
    return;
  }

  const allClubs = getAllClubs();
  document.getElementById("poolCount").textContent =
    `${allClubs.length} cluburi · ${LEAGUES.length} ligi în baza de date`;
  const footerNote = document.getElementById("footerNote");
  if (footerNote) {
    footerNote.innerHTML = `Baza de date conține <strong>${allClubs.length} cluburi</strong> din <strong>${LEAGUES.length} ligi</strong> FC26 (nu e 100% completă — poți adăuga cluburi ușor în <code>clubs.js</code>).`;
  }

  let state = {
    mode: "manager",
    difficulty: "usor",
    gender: "",
    filters: { region: "", league: "", teamType: "", duration: "" },
    current: null,
    renewalUnlocked: false
  };

  const cardArea = document.getElementById("cardArea");
  const historyList = document.getElementById("historyList");
  const completedCountEl = document.getElementById("completedCount");
  const HISTORY_KEY = "ccg_history_v1";
  const CURRENT_KEY = "ccg_current_v1";
  const REPORTS_KEY = "ccg_reports_v1";

  // ---------- Tab / chip wiring (mod, dificultate, liga/gen) ----------
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      state.mode = btn.dataset.mode;
    });
  });

  document.querySelectorAll("#difficultyChips .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#difficultyChips .chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.difficulty = btn.dataset.diff;
    });
  });

  document.querySelectorAll("#genderChips .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#genderChips .chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.gender = btn.dataset.gender;
      populateLeagueSelect(state.filters.region);
    });
  });

  // ---------- Filtre optionale: regiune, liga specifica, tip echipa, durata ----------
  const regionChipsWrap = document.getElementById("regionChips");
  REGIONS.forEach(region => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.dataset.region = region;
    btn.textContent = region;
    regionChipsWrap.appendChild(btn);
  });

  const leagueSelect = document.getElementById("leagueSelect");
  function populateLeagueSelect(regionFilter) {
    const current = leagueSelect.value;
    leagueSelect.innerHTML = `<option value="">Oricare ligă</option>`;
    LEAGUES
      .filter(l => (!state.gender || l.gender === state.gender) && (!regionFilter || l.region === regionFilter))
      .forEach(l => {
        const opt = document.createElement("option");
        opt.value = l.name;
        opt.textContent = `${l.name} (${l.country})`;
        leagueSelect.appendChild(opt);
      });
    const stillValid = Array.from(leagueSelect.options).some(o => o.value === current);
    leagueSelect.value = stillValid ? current : "";
    state.filters.league = leagueSelect.value;
  }
  populateLeagueSelect("");

  regionChipsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    regionChipsWrap.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.filters.region = btn.dataset.region;
    populateLeagueSelect(state.filters.region);
  });

  leagueSelect.addEventListener("change", () => {
    state.filters.league = leagueSelect.value;
  });

  const teamTypeChipsWrap = document.getElementById("teamTypeChips");
  Object.entries(TEAM_TYPES).forEach(([key, def]) => {
    if (key === "") return;
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.dataset.teamtype = key;
    btn.textContent = def.label;
    teamTypeChipsWrap.appendChild(btn);
  });
  teamTypeChipsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    teamTypeChipsWrap.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.filters.teamType = btn.dataset.teamtype;
  });

  const durationChipsWrap = document.getElementById("durationChips");
  Object.entries(DURATIONS).forEach(([key, def]) => {
    if (key === "") return;
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.dataset.duration = key;
    btn.textContent = def.label;
    durationChipsWrap.appendChild(btn);
  });
  durationChipsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    durationChipsWrap.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.filters.duration = btn.dataset.duration;
  });

  function currentFilters() {
    return {
      gender: state.gender,
      region: state.filters.region,
      league: state.filters.league,
      teamType: state.filters.teamType,
      duration: state.filters.duration
    };
  }

  function persistSessionState() {
    const payload = {
      mode: state.mode,
      difficulty: state.difficulty,
      gender: state.gender,
      filters: state.filters,
      current: state.current
    };
    localStorage.setItem(CURRENT_KEY, JSON.stringify(payload));
  }

  function syncControlsFromState() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      const active = btn.dataset.mode === state.mode;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    document.querySelectorAll("#difficultyChips .chip").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.diff === state.difficulty);
    });

    document.querySelectorAll("#genderChips .chip").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.gender === state.gender);
    });

    const regionBtn = regionChipsWrap.querySelector(`[data-region="${state.filters.region || ''}"]`);
    regionChipsWrap.querySelectorAll(".chip").forEach(btn => btn.classList.toggle("active", btn === regionBtn));

    if (leagueSelect) {
      leagueSelect.value = state.filters.league || "";
    }

    const teamBtn = teamTypeChipsWrap.querySelector(`[data-teamtype="${state.filters.teamType || ''}"]`);
    teamTypeChipsWrap.querySelectorAll(".chip").forEach(btn => btn.classList.toggle("active", btn === teamBtn));

    const durationBtn = durationChipsWrap.querySelector(`[data-duration="${state.filters.duration || ''}"]`);
    durationChipsWrap.querySelectorAll(".chip").forEach(btn => btn.classList.toggle("active", btn === durationBtn));
  }

  function restoreSessionState() {
    try {
      const saved = JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
      if (!saved) return;

      state.mode = saved.mode || state.mode;
      state.difficulty = saved.difficulty || state.difficulty;
      state.gender = saved.gender || state.gender;
      state.filters = { ...state.filters, ...(saved.filters || {}) };
      state.current = saved.current || null;

      syncControlsFromState();
      populateLeagueSelect(state.filters.region);
      syncControlsFromState();

      if (state.current) {
        state.current.randomEvent = state.current.randomEvent || generateRandomEvent(state.current);
        state.current.seasonReview = state.current.seasonReview || buildSeasonReview(state.current);
        renderCard(state.current);
      }
    } catch (error) {
      console.warn("Nu s-a putut restaura starea salvata.", error);
    }
  }

  function makeId() {
    return `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function getValidClubPool(filters = currentFilters()) {
    const diff = DIFFICULTIES[state.difficulty] || DIFFICULTIES.normal;
    const tierPool = (filters.teamType && TEAM_TYPES[filters.teamType] && TEAM_TYPES[filters.teamType].tierPool) || diff.tierPool;

    const exact = allClubs.filter(c =>
      tierPool.includes(c.tier) &&
      (!filters.gender || c.gender === filters.gender) &&
      (!filters.region || c.region === filters.region) &&
      (!filters.league || c.league === filters.league)
    );

    if (exact.length) return exact;

    const looseRegion = allClubs.filter(c =>
      tierPool.includes(c.tier) &&
      (!filters.gender || c.gender === filters.gender) &&
      (!filters.region || c.region === filters.region)
    );

    if (looseRegion.length) return looseRegion;

    return allClubs.filter(c =>
      tierPool.includes(c.tier) &&
      (!filters.gender || c.gender === filters.gender)
    );
  }

  function showGenerationWarning(message) {
    cardArea.innerHTML = `
      <div class="challenge-card warning-card">
        <div class="card-head">
          <span class="mode-label">Combinație invalidă</span>
        </div>
        <div class="card-body">
          <div class="field-row warning-row">
            <span class="field-label">Notificare</span>
            <span class="field-value">${message}</span>
            <button class="reroll-btn" type="button" title="Încearcă din nou" disabled>⚠</button>
          </div>
        </div>
      </div>
    `;
  }

  function openReportModal() {
    const modal = document.getElementById("reportProblemModal");
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeReportModal() {
    const modal = document.getElementById("reportProblemModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    const form = document.getElementById("reportIssueForm");
    if (form) form.reset();
  }

  function submitReportIssue(e) {
    e.preventDefault();
    const reportType = document.getElementById("reportIssueType").value;
    const message = document.getElementById("reportIssueMessage").value.trim();

    if (!message) return;

    const reports = JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
    reports.unshift({
      type: reportType,
      message,
      createdAt: new Date().toISOString(),
      mode: state.mode,
      difficulty: state.difficulty,
      filters: currentFilters()
    });
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports.slice(0, 30)));

    closeReportModal();
    alert("Raportul a fost trimis. Mulțumim pentru feedback!");
  }

  document.getElementById("generateBtn").addEventListener("click", () => {
    const filters = currentFilters();
    const validPool = getValidClubPool(filters);
    if (!validPool.length) {
      showGenerationWarning("Nu există o combinație validă pentru filtrele selectate. Încercați un alt tip de echipă, ligă sau gen pentru a genera o provocare coerentă.");
      return;
    }

    const challenge = state.mode === "manager"
      ? generateManagerChallenge(allClubs, state.difficulty, filters)
      : generatePlayerChallenge(allClubs, state.difficulty, filters);
    challenge.id = makeId();
    challenge.randomEvent = generateRandomEvent(challenge);
    challenge.seasonReview = buildSeasonReview(challenge);
    state.current = challenge;
    renderCard(challenge);
    persistSessionState();
    saveToHistory(challenge);
    refreshChallengeViews();
  });

  document.getElementById("heroGenerateBtn").addEventListener("click", () => {
    document.getElementById("generateBtn").click();
  });

  document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
    updateCompletedCount();
  });

  window.addEventListener("beforeunload", persistSessionState);
  window.addEventListener("pagehide", persistSessionState);

  restoreSessionState();

  // ---------- Rendering ----------
  function clubText(club) {
    return `${club.name} <span class="sub">${club.league} · ${club.country}</span>`;
  }

  function fieldsForManager(c) {
    return [
      { key: "club", label: "Echipă", value: clubText(c.club) },
      { key: "budget", label: "Buget", value: c.budget },
      { key: "objective", label: "Obiectiv sezon", value: c.objective },
      { key: "missionWindow", label: "Fereastră realistă", value: c.missionWindow || "2 sezoane" },
      { key: "restriction", label: "Transferuri", value: c.restriction },
      { key: "specialRule", label: "Regulă specială", value: c.specialRule },
      { key: "penalty", label: "Pedeapsă la eșec", value: c.penalty },
      { key: "contractRenewal", label: "Reînnoire de contract", value: c.contractRenewal }
    ];
  }

  function fieldsForPlayer(c) {
    return [
      { key: "name", label: "Nume jucător", value: c.name || "—" },
      { key: "nationality", label: "Naționalitate", value: c.nationality },
      { key: "age", label: "Vârstă start", value: `${c.age} ani <span class="sub">${c.ageNote}</span>` },
      { key: "club", label: "Echipă start", value: clubText(c.club) },
      { key: "ovr", label: "OVR start", value: `${c.ovr}` },
      { key: "position", label: "Post principal", value: c.position },
      { key: "objective", label: "Obiectiv final", value: c.objective },
      { key: "missionWindow", label: "Fereastră realistă", value: c.missionWindow || "2-3 sezoane" },
      { key: "specialRule", label: "Regulă specială", value: c.specialRule },
      { key: "penalty", label: "Pedeapsă la eșec", value: c.penalty },
      { key: "contractRenewal", label: "Reînnoire de contract", value: c.contractRenewal }
    ];
  }

  function careerPathHtml(c) {
    if (c.type !== "player" || !c.careerPath) return "";
    const steps = c.careerPath.map((s, i) => `
      <div class="career-step">
        <div>
          <p class="career-step-stage">${s.stage}</p>
          <p class="career-step-task">${s.task}</p>
        </div>
        <button class="career-reroll-btn" data-stage-index="${i}" title="Rerulează doar această etapă">🎲</button>
      </div>
    `).join("");
    return `
      <div class="career-path">
        <p class="career-path-title">Career Path — harta carierei</p>
        ${steps}
      </div>
    `;
  }

  function previousSeasonHtml(challenge) {
    const season = challenge?.contractSeasonData || challenge?.lastSeasonSummary;
    if (!season) return "";

    const seasonTitle = challenge?.contractSeasonData ? "Sezonul trecut" : "Preview sezon";
    const rows = challenge.type === "manager"
      ? [
          { label: "Loc", value: season.position || "—" },
          { label: "Trofee", value: season.trophies || 0 },
          { label: "Buget", value: `${season.budget || 0}€` },
          { label: "Transferuri", value: season.transfers || 0 },
          { label: "Obiective ratate", value: season.failedObjectives || 0 }
        ]
      : [
          { label: "Goluri", value: season.goals || 0 },
          { label: "Assist-uri", value: season.assists || 0 },
          { label: "Trofee", value: season.trophies || 0 },
          { label: "Media", value: `${season.ovr || 0}` },
          { label: "Obiective ratate", value: season.failedObjectives || 0 }
        ];

    return `
      <div class="season-summary">
        <p class="career-path-title">${seasonTitle}</p>
        <div class="season-summary-grid">
          ${rows.map(item => `
            <div class="season-summary-box">
              <span>${item.label}</span>
              <strong>${item.value}</strong>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderCard(challenge) {
    const isManager = challenge.type === "manager";
    const fields = isManager ? fieldsForManager(challenge) : fieldsForPlayer(challenge);

    const rows = fields.map(f => `
      <div class="field-row">
        <span class="field-label">${f.label}</span>
        <span class="field-value">${f.value}</span>
        <button class="reroll-btn" data-field="${f.key}" title="Rerulează doar acest câmp">🎲</button>
      </div>
    `).join("");

    cardArea.innerHTML = `
      <div class="challenge-card">
        <div class="card-head">
          <span class="mode-label">${isManager ? "Manager Career" : "Player Career"}</span>
          <span class="diff-badge">${challenge.difficulty}${challenge.duration ? " · " + challenge.duration : ""}</span>
        </div>
        <div class="card-body">${rows}</div>
        ${previousSeasonHtml(challenge)}
        ${careerPathHtml(challenge)}
        <div class="card-actions">
          <button class="ghost-btn" id="copyBtn">Copiază provocarea</button>
          <button class="ghost-btn" id="downloadBtn">Descarcă .txt</button>
          <button class="ghost-btn" id="renewContractBtn">🔄 Reînnoire de contract</button>
          <button class="complete-btn ${challenge.completed ? "is-done" : ""}" id="completeBtn">
            ${challenge.completed ? "✅ Provocare completată" : "Am completat provocarea"}
          </button>
        </div>
      </div>
    `;

    document.querySelectorAll(".reroll-btn").forEach(btn => {
      btn.addEventListener("click", () => rerollField(btn.dataset.field));
    });
    document.querySelectorAll(".career-reroll-btn").forEach(btn => {
      btn.addEventListener("click", () => rerollCareerStage(parseInt(btn.dataset.stageIndex, 10)));
    });
    document.getElementById("copyBtn").addEventListener("click", copyChallenge);
    document.getElementById("downloadBtn").addEventListener("click", downloadChallenge);
    document.getElementById("renewContractBtn").addEventListener("click", openRenewalModal);
    document.getElementById("completeBtn").addEventListener("click", markCompleted);
  }

  function rerollField(field) {
    const c = state.current;
    if (!c) return;
    const diff = DIFFICULTIES[state.difficulty] || DIFFICULTIES.normal;
    const filters = currentFilters();

    if (field === "club") {
      c.club = pickClub(allClubs, diff.tierPool, filters);
    } else if (c.type === "manager") {
      if (field === "budget") c.budget = pick(BUDGET_MODIFIERS);
      if (field === "objective") {
        const context = getCompetitiveContext(c.club, 'manager');
        c.objective = buildContextualObjective(context, 'manager', 0, state.difficulty);
      }
      if (field === "restriction") c.restriction = pick(TRANSFER_RESTRICTIONS);
      if (field === "specialRule") c.specialRule = pick(MANAGER_SPECIAL_RULES);
      if (field === "penalty") c.penalty = buildPenaltyText('manager');
      if (field === "contractRenewal") c.contractRenewal = buildContractRenewalRule();
      if (field === "missionWindow") c.missionWindow = buildMissionTimeframe('manager', getCompetitiveContext(c.club, 'manager'), 0);
    } else {
      if (field === "name") c.name = generatePlayerName(c.nationality, c.gender || 'M');
      if (field === "nationality") { c.nationality = pick(NATIONALITIES); c.name = generatePlayerName(c.nationality, c.gender || 'M'); }
      if (field === "age") {
        const p = pick(AGE_PROFILES);
        c.age = p.age; c.ageNote = p.note;
        c.missionWindow = buildMissionTimeframe('player', getCompetitiveContext(c.club, 'player'), c.age);
        if (c.careerPath) c.careerPath = rebuildCareerPathLabels(c.careerPath, c.age);
      }
      if (field === "ovr") c.ovr = Math.floor(Math.random() * (diff.ovrMax - diff.ovrMin + 1)) + diff.ovrMin;
      if (field === "position") c.position = pick(POSITIONS);
      if (field === "objective") {
        const context = getCompetitiveContext(c.club, 'player');
        c.objective = buildContextualObjective(context, 'player', c.age, state.difficulty);
      }
      if (field === "specialRule") c.specialRule = pick(PLAYER_SPECIAL_RULES);
      if (field === "penalty") c.penalty = buildPenaltyText('player');
      if (field === "contractRenewal") c.contractRenewal = buildContractRenewalRule();
      if (field === "missionWindow") c.missionWindow = buildMissionTimeframe('player', getCompetitiveContext(c.club, 'player'), c.age);
    }
    persistSessionState();
    renderCard(c);
    refreshChallengeViews();
  }

  function rerollCareerStage(index) {
    const c = state.current;
    if (!c || c.type !== "player" || !c.careerPath) return;
    c.careerPath[index] = rerollCareerPathStage(index, c.age);
    persistSessionState();
    renderCard(c);
    refreshChallengeViews();
  }

  // ---------- Marcare provocare completata ----------
  function markCompleted() {
    const c = state.current;
    if (!c || c.completed) return;
    c.completed = true;
    c.completedAt = new Date().toISOString();
    updateHistoryEntry(c);
    persistSessionState();
    renderCard(c);
    refreshChallengeViews();
  }

  // ---------- Text export ----------
  function challengeToText(c) {
    const isManager = c.type === "manager";
    const lines = [];
    lines.push(isManager ? "=== MANAGER CAREER CHALLENGE ===" : "=== PLAYER CAREER CHALLENGE ===");
    lines.push(`Dificultate: ${c.difficulty}`);
    if (c.duration) lines.push(`Durată: ${c.duration}`);
    if (isManager) {
      lines.push(`Echipă: ${c.club.name} (${c.club.league}, ${c.club.country})`);
      lines.push(`Buget: ${c.budget}`);
      lines.push(`Obiectiv sezon: ${c.objective}`);
      lines.push(`Fereastră realistă: ${c.missionWindow || '2 sezoane'}`);
      lines.push(`Transferuri: ${c.restriction}`);
      lines.push(`Regulă specială: ${c.specialRule}`);
      lines.push(`Pedeapsă la eșec: ${c.penalty || '—'}`);
      lines.push(`Reînnoire de contract: ${c.contractRenewal || '—'}`);
    } else {
      if (c.name) lines.push(`Nume jucător: ${c.name}`);
      lines.push(`Naționalitate: ${c.nationality}`);
      lines.push(`Vârstă start: ${c.age} ani (${c.ageNote})`);
      lines.push(`Echipă start: ${c.club.name} (${c.club.league}, ${c.club.country})`);
      lines.push(`OVR start: ${c.ovr}`);
      lines.push(`Post principal: ${c.position}`);
      lines.push(`Obiectiv final: ${c.objective}`);
      lines.push(`Fereastră realistă: ${c.missionWindow || '2-3 sezoane'}`);
      lines.push(`Regulă specială: ${c.specialRule}`);
      lines.push(`Pedeapsă la eșec: ${c.penalty || '—'}`);
      lines.push(`Reînnoire de contract: ${c.contractRenewal || '—'}`);
      if (c.careerPath && c.careerPath.length) {
        lines.push("");
        lines.push("--- Career Path ---");
        c.careerPath.forEach(s => lines.push(`${s.stage}: ${s.task}`));
      }
    }
    if (c.completed) lines.push(`\nStatus: COMPLETATĂ (${new Date(c.completedAt).toLocaleDateString("ro-RO")})`);
    return lines.join("\n");
  }

  function copyChallenge() {
    const text = challengeToText(state.current);
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("copyBtn");
      const original = btn.textContent;
      btn.textContent = "Copiat!";
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  }

  function downloadChallenge() {
    const text = challengeToText(state.current);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "career-challenge.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- History (localStorage) ----------
  function saveToHistory(challenge) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const nextEntry = { ...challenge, savedAt: new Date().toISOString() };
    const existingIndex = history.findIndex(item => String(item.id) === String(challenge.id));

    if (existingIndex !== -1) {
      history[existingIndex] = { ...history[existingIndex], ...nextEntry };
    } else {
      history.unshift(nextEntry);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    renderHistory();
    updateCompletedCount();
  }

  function updateHistoryEntry(challenge) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const idx = history.findIndex(h => h.id === challenge.id);
    if (idx !== -1) {
      history[idx] = { ...history[idx], ...challenge };
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      renderHistory();
      renderCareerDashboard();
    }
  }

  function updateCompletedCount() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const total = history.length;
    const done = history.filter(h => h.completed).length;
    completedCountEl.textContent = total ? `${done}/${total} completate` : "";
  }

  function refreshCareerDashboard() {
    renderCareerDashboard();
  }

  function refreshChallengeViews() {
    renderHistory();
    updateCompletedCount();
    renderCareerDashboard();
  }

  function openHistoryEntry(historyId) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const entry = history.find(item => String(item.id) === String(historyId));
    if (!entry) return;

    state.current = entry;
    state.mode = entry.type || state.mode;
    state.difficulty = entry.difficulty || state.difficulty;
    state.gender = entry.club?.gender || state.gender;
    renderCard(entry);
    persistSessionState();
    refreshChallengeViews();
  }

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    if (!history.length) {
      historyList.innerHTML = '<p class="history-empty">Nicio provocare salvată încă.</p>';
      return;
    }

    historyList.innerHTML = history.map(item => {
      const label = item.type === "manager" ? "Manager" : "Jucător";
      const club = item.club ? `${item.club.name} (${item.club.league})` : "—";
      const seasonInfo = item.contractSeasonData
        ? ` · Sezon trecut: ${item.contractSeasonData.position || item.contractSeasonData.ovr || "n/a"}`
        : "";
      return `
        <button type="button" class="history-item ${item.completed ? "is-completed" : ""}" data-history-id="${item.id || Math.random().toString(36).slice(2, 10)}">
          <div>
            <strong>${label}</strong> · ${club}${seasonInfo}
            <br>
            <span>${item.objective}</span>
          </div>
          <span>${item.completed ? "Completat" : "Activ"}</span>
        </button>
      `;
    }).join("");

    historyList.querySelectorAll(".history-item").forEach(item => {
      item.addEventListener("click", () => {
        openHistoryEntry(item.dataset.historyId);
      });
    });
  }

  function buildSeasonReview(challenge) {
    const data = challenge?.contractSeasonData || challenge?.lastSeasonSummary || {};
    const objectiveCount = Math.max(1, Number(data.completedObjectives || 0) + Number(data.failedObjectives || 0));
    const completionRate = Math.round(((Number(data.completedObjectives || 0) / objectiveCount) * 100) || 50);
    const difficultyBonus = { usor: 8, normal: 12, greu: 16, legendar: 20 };
    const diffValue = difficultyBonus[challenge?.difficulty?.toLowerCase?.() || "normal"] || 12;
    const boardSatisfaction = Math.min(100, Math.max(30, Math.round(completionRate + diffValue - (Number(data.failedObjectives || 0) * 8))));
    const performance = challenge?.type === "manager"
      ? `${data.position || "—"} loc + ${data.trophies || 0} trofee + ${data.transfers || 0} transferuri`
      : `${data.goals || 0} goluri + ${data.assists || 0} assist-uri + ${data.teamTrophies || 0} trofee`;

    return {
      title: `Sezon ${challenge?.seasonNumber || 1}`,
      objectiveCompleted: Number(data.completedObjectives || 0),
      objectiveFailed: Number(data.failedObjectives || 0),
      transferCount: Number(data.transfers || 0),
      scorer: challenge?.type === "manager" ? (data.keyPosition || "jucător cheie") : `${data.goals || 0} goluri / ${data.assists || 0} assist-uri`,
      boardSatisfaction,
      summary: performance,
      status: boardSatisfaction >= 75 ? "Pozitiv" : boardSatisfaction >= 50 ? "Echilibrat" : "Neclar"
    };
  }

  function generateRandomEvent(challenge) {
    if (!challenge) return null;
    const base = challenge.type === "manager"
      ? [
          { title: "Încrederea board-ului", text: "Board-ul îți aprobă planul de reconstrucție și îți oferă un bonus de moral pentru sezonul următor.", impact: "bonus", value: 6 },
          { title: "Panica pieței de transferuri", text: "Presiunea socială te obligă să cumperi rapid un jucător, iar asta îți afectează bugetul.", impact: "penalty", value: 8 },
          { title: "Obiectiv nou", text: "Clubul îți impune un nou obiectiv pentru sezon: să menții forma și să ai o medie mai bună până la finalul sezonului.", impact: "objective", value: 2 }
        ]
      : [
          { title: "Salt de formă", text: "Ai avut o lună foarte bună și primești un boost de formă la antrenamente.", impact: "bonus", value: 7 },
          { title: "Accidentare minoră", text: "O accidentare minoră te ține afară pentru câteva etape și îți costă minute de joc.", impact: "penalty", value: 5 },
          { title: "Întâlnire cu mentorul", text: "Antrenorul îți cere să iei mai multe responsabilități și să devii lider în vestiar.", impact: "objective", value: 2 }
        ];

    const event = base[Math.floor(Math.random() * base.length)];
    const diffBonus = challenge.difficulty?.toLowerCase?.() === "legendar" ? " plus dificilate crescută" : "";
    return {
      ...event,
      quote: `${event.title}${diffBonus}: ${event.text}`
    };
  }

  function calculateCareerRating(history) {
    if (!history.length) return { score: 0, label: "Fără date" };
    let total = 0;
    history.forEach(item => {
      let score = item.type === "manager" ? 55 : 50;
      if (item.completed) score += 18;
      score += (item.contractSeasonData?.completedObjectives || 0) * 6;
      score += (item.contractSeasonData?.trophies || 0) * 10;
      score += (item.contractSeasonData?.ovr || 0) * 0.25;
      score -= (item.contractSeasonData?.failedObjectives || 0) * 7;
      score -= item.penalty ? 5 : 0;
      if (item.difficulty === "Legendary" || item.difficulty === "Legendar") score += 6;
      total += score;
    });
    const avg = Math.max(20, Math.min(99, Math.round(total / history.length)));
    const label = avg >= 85 ? "Legendă" : avg >= 70 ? "Foarte bun" : avg >= 55 ? "Solid" : avg >= 40 ? "Mediu" : "În construcție";
    return { score: avg, label };
  }

  function calculateCareerProgress(history) {
    const items = history.map((item, index) => {
      const completedFromData = Number(item.contractSeasonData?.completedObjectives ?? 0);
      const completed = Number(item.completed ? 1 : completedFromData);
      const failed = Number(item.contractSeasonData?.failedObjectives ?? 0);
      const totalObjectives = Math.max(1, completed + failed);
      const pct = Math.min(100, Math.round((completed / totalObjectives) * 100));
      return {
        season: `Sezon ${index + 1}`,
        progress: pct,
        objectiveStatus: item.completed ? "Completat" : "Activ",
        type: item.type === "manager" ? "Manager" : "Jucător"
      };
    });
    return items;
  }

  function buildCareerAchievements(history) {
    const achievements = [];
    const first = history.length >= 1;
    const trophyTotal = history.reduce((sum, item) => sum + Number(item.contractSeasonData?.trophies || item.contractSeasonData?.teamTrophies || 0), 0);
    const failedTotal = history.reduce((sum, item) => sum + Number(item.contractSeasonData?.failedObjectives || 0), 0);
    const goalsTotal = history.reduce((sum, item) => sum + Number(item.contractSeasonData?.goals || 0), 0);
    const averageExperience = history.length >= 3 ? true : false;

    if (first) achievements.push({ icon: "🏁", name: "Debutul", text: "Ai început cariera" });
    if (trophyTotal >= 1) achievements.push({ icon: "🏆", name: "Câștigător", text: "Ai obținut cel puțin un trofeu" });
    if (goalsTotal >= 20) achievements.push({ icon: "⚽", name: "Goal Machine", text: "Ai trecut de 20 de goluri" });
    if (failedTotal === 0) achievements.push({ icon: "✅", name: "Clean sheet", text: "Nu ai ratat obiectivele principale" });
    if (averageExperience) achievements.push({ icon: "📈", name: "Progression", text: "Ai acumulat mai multe sezoane" });
    if (history.length >= 5) achievements.push({ icon: "👑", name: "Legend", text: "Carieră lungă și stabilă" });

    return achievements.slice(0, 6);
  }

  function buildCareerStreaks(history) {
    let current = 0;
    let best = 0;
    let running = 0;

    history.forEach(item => {
      const positive = item.completed || (Number(item.contractSeasonData?.completedObjectives || 0) >= (Number(item.contractSeasonData?.failedObjectives || 0) + 1));
      if (positive) {
        running += 1;
        if (running > best) best = running;
      } else {
        running = 0;
      }
    });

    current = running;
    return { current, best };
  }

  function careerSummaryText(history) {
    const rating = calculateCareerRating(history);
    const achievements = buildCareerAchievements(history);
    const streaks = buildCareerStreaks(history);
    const latest = history[0];
    const lines = [
      "Career Challenge Generator — Rezumat carieră",
      `Rating: ${rating.score}/100 (${rating.label})`,
      `Sezoane: ${history.length}`,
      `Achievement-uri: ${achievements.length}`,
      `Streak: ${streaks.current} sezon(e) consecutive`,
      latest ? `Ultimul sezon: ${latest.type === "manager" ? "Manager" : "Jucător"} · ${latest.objective}` : "Fără sezonuri",
      ""
    ];
    return lines.join("\n");
  }

  function downloadCareerCard() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const rating = calculateCareerRating(history);
    const achievements = buildCareerAchievements(history);
    const streaks = buildCareerStreaks(history);
    const latest = history[0];
    const careerLabel = latest ? (latest.type === "manager" ? "Manager" : "Jucător") : "Career";
    const difficultyLabel = latest?.difficulty ? latest.difficulty : "Normal";

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1500;
    const ctx = canvas.getContext("2d");

    const roundedRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const bg = ctx.createLinearGradient(0, 0, 1200, 1500);
    bg.addColorStop(0, "#081d14");
    bg.addColorStop(0.5, "#0e2f22");
    bg.addColorStop(1, "#143a2c");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1200, 1500);

    ctx.fillStyle = "rgba(212,165,55,0.12)";
    for (let i = 0; i < 8; i += 1) {
      ctx.fillRect(80 + i * 120, 100, 48, 1300);
    }

    roundedRect(70, 70, 1060, 1360, 32);
    ctx.fillStyle = "#0c261d";
    ctx.fill();

    roundedRect(110, 110, 980, 1280, 28);
    ctx.strokeStyle = "rgba(212,165,55,0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const badgeGradient = ctx.createLinearGradient(150, 150, 400, 220);
    badgeGradient.addColorStop(0, "#d4a537");
    badgeGradient.addColorStop(1, "#f0d88d");
    roundedRect(150, 150, 220, 54, 18);
    ctx.fillStyle = badgeGradient;
    ctx.fill();
    ctx.fillStyle = "#0c261d";
    ctx.font = "700 22px 'Inter', sans-serif";
    ctx.fillText("CCG", 190, 185);

    ctx.fillStyle = "#f2f5f0";
    ctx.font = "700 42px 'Inter', sans-serif";
    ctx.fillText("Career Challenge Generator", 410, 193);

    ctx.fillStyle = "#d4a537";
    ctx.font = "700 22px 'Inter', sans-serif";
    ctx.fillText(`${careerLabel} • ${difficultyLabel}`, 150, 255);

    ctx.fillStyle = "#b9c9bf";
    ctx.font = "500 18px 'Inter', sans-serif";
    ctx.fillText("Fișier partajabil • PNG", 150, 288);

    roundedRect(150, 330, 220, 180, 26);
    ctx.fillStyle = "rgba(212,165,55,0.18)";
    ctx.fill();
    ctx.fillStyle = "#f8d98a";
    ctx.font = "700 72px 'Inter', sans-serif";
    ctx.fillText(String(rating.score), 215, 432);
    ctx.fillStyle = "#b9c9bf";
    ctx.font = "700 28px 'Inter', sans-serif";
    ctx.fillText("/100", 330, 432);
    ctx.fillStyle = "#d4a537";
    ctx.font = "700 20px 'Inter', sans-serif";
    ctx.fillText(rating.label.toUpperCase(), 215, 470);

    const summaryY = 345;
    const summary = [
      `Sezoane: ${history.length}`,
      `Achievement-uri: ${achievements.length}`,
      `Streak: ${streaks.current}`,
      latest ? `Ultimul sezon: ${latest.objective}` : "Ultimul sezon: —"
    ];
    ctx.fillStyle = "#f2f5f0";
    ctx.font = "500 20px 'Inter', sans-serif";
    summary.forEach((line, index) => {
      ctx.fillText(line, 430, summaryY + index * 42);
    });

    roundedRect(150, 550, 900, 180, 24);
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.stroke();
    ctx.fillStyle = "#f2f5f0";
    ctx.font = "700 26px 'Inter', sans-serif";
    ctx.fillText("Obiectiv curent", 185, 595);
    ctx.font = "500 22px 'Inter', sans-serif";
    const objectiveText = (latest && latest.objective) || "Niciun obiectiv activ";
    wrapText(ctx, objectiveText, 185, 635, 840, 28, 3);

    const statY = 780;
    const statData = [
      { label: "Trofee", value: latest ? (latest.contractSeasonData?.trophies || latest.contractSeasonData?.teamTrophies || 0) : 0 },
      { label: "Goluri", value: latest ? (latest.contractSeasonData?.goals || 0) : 0 },
      { label: "Assist-uri", value: latest ? (latest.contractSeasonData?.assists || 0) : 0 },
      { label: "Board", value: `${latest ? (latest.seasonReview?.boardSatisfaction || 0) : 0}%` }
    ];

    statData.forEach((stat, index) => {
      const x = 150 + index * 220;
      roundedRect(x, statY, 180, 120, 20);
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.stroke();
      ctx.fillStyle = "#b9c9bf";
      ctx.font = "500 16px 'Inter', sans-serif";
      ctx.fillText(stat.label, x + 18, statY + 34);
      ctx.fillStyle = "#f2f5f0";
      ctx.font = "700 32px 'Inter', sans-serif";
      ctx.fillText(String(stat.value), x + 18, statY + 78);
    });

    ctx.fillStyle = "#f2f5f0";
    ctx.font = "700 28px 'Inter', sans-serif";
    ctx.fillText("Achievement-uri", 150, 985);
    ctx.font = "500 20px 'Inter', sans-serif";
    achievements.slice(0, 4).forEach((item, index) => {
      const y = 1028 + index * 46;
      ctx.fillText(`${item.icon} ${item.name}`, 150, y);
    });

    ctx.fillStyle = "#b9c9bf";
    ctx.font = "500 18px 'Inter', sans-serif";
    ctx.fillText("Generated by Career Challenge Generator", 150, 1228);
    ctx.fillText("Shareable career card • premium export", 150, 1262);

    const logoSize = 64;
    const logoX = 1005;
    const logoY = 1190;
    roundedRect(logoX, logoY, logoSize + 24, logoSize + 24, 16);
    ctx.fillStyle = "rgba(212,165,55,0.2)";
    ctx.fill();
    ctx.fillStyle = "#d4a537";
    ctx.font = "700 42px 'Inter', sans-serif";
    ctx.fillText("CCG", logoX + 18, logoY + 46);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${careerLabel.toLowerCase()}-career-card.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = text.split(/\s+/);
    let line = "";
    let lineCount = 0;

    for (let i = 0; i < words.length; i += 1) {
      const testLine = line ? `${line} ${words[i]}` : words[i];
      const metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        context.fillText(line, x, y + lineCount * lineHeight);
        line = words[i];
        lineCount += 1;
        if (lineCount >= maxLines) break;
      } else {
        line = testLine;
      }
    }

    if (lineCount < maxLines) {
      context.fillText(line, x, y + lineCount * lineHeight);
    }
  }

  async function shareCareerSummary() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const summary = careerSummaryText(history);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rezumat carieră",
          text: summary
        });
        return;
      } catch (error) {
        // fall back to clipboard
      }
    }

    await navigator.clipboard.writeText(summary);
    const shareBtn = document.getElementById("shareCareerBtn");
    if (shareBtn) {
      const original = shareBtn.textContent;
      shareBtn.textContent = "Copiat!";
      setTimeout(() => { shareBtn.textContent = original; }, 1200);
    }
  }

  function renderCareerDashboard() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const dashboard = document.getElementById("careerDashboard");
    if (!dashboard) return;

    const rating = calculateCareerRating(history);
    const progress = calculateCareerProgress(history);
    const achievements = buildCareerAchievements(history);
    const streaks = buildCareerStreaks(history);
    const latestConclusion = history[0] && history[0].randomEvent ? history[0].randomEvent : generateRandomEvent(history[0] || state.current);
    const latestSeason = history[0] ? buildSeasonReview(history[0]) : buildSeasonReview(state.current);

    dashboard.innerHTML = `
      <div class="career-dashboard-grid">
        <div class="career-panel career-panel-wide">
          <div class="career-panel-head">
            <h3>Review sezon</h3>
            <span class="pill ${latestSeason.status === 'Pozitiv' ? 'pill-good' : latestSeason.status === 'Echilibrat' ? 'pill-mid' : 'pill-bad'}">${latestSeason.status}</span>
          </div>
          <div class="season-review-grid">
            <div class="mini-stat"><span>Obiective îndeplinite</span><strong>${latestSeason.objectiveCompleted}</strong></div>
            <div class="mini-stat"><span>Obiective eșuate</span><strong>${latestSeason.objectiveFailed}</strong></div>
            <div class="mini-stat"><span>Transferuri</span><strong>${latestSeason.transferCount}</strong></div>
            <div class="mini-stat"><span>Satisfacția board-ului</span><strong>${latestSeason.boardSatisfaction}%</strong></div>
          </div>
          <p class="season-review-note">${latestSeason.summary}</p>
          <p class="season-review-note">Marcatori / impact: ${latestSeason.scorer}</p>
        </div>

        <div class="career-panel">
          <div class="career-panel-head">
            <h3>Rating carierei</h3>
          </div>
          <div class="rating-score">${rating.score}<small>/100</small></div>
          <p class="rating-label">${rating.label}</p>
        </div>

        <div class="career-panel">
          <div class="career-panel-head">
            <h3>Progresul carierei</h3>
          </div>
          <div class="progress-list">
            ${progress.map(item => `
              <div class="progress-item">
                <div class="progress-topline"><span>${item.season}</span><span>${item.progress}%</span></div>
                <div class="progress-bar"><span style="width:${item.progress}%"></span></div>
              </div>
            `).join("") || '<p class="muted">Niciun sezon încă.</p>'}
          </div>
        </div>

        <div class="career-panel">
          <div class="career-panel-head">
            <h3>Streak-uri</h3>
          </div>
          <div class="streak-box">
            <strong>${streaks.current}</strong>
            <span>sezoane consecutive</span>
          </div>
          <div class="streak-box">
            <strong>${streaks.best}</strong>
            <span>cel mai bun streak</span>
          </div>
        </div>

        <div class="career-panel career-panel-wide">
          <div class="career-panel-head">
            <h3>Realizări</h3>
          </div>
          <div class="achievement-list">
            ${achievements.map(item => `
              <div class="achievement-item">
                <span class="achievement-icon">${item.icon}</span>
                <div>
                  <strong>${item.name}</strong>
                  <p>${item.text}</p>
                </div>
              </div>
            `).join("") || '<p class="muted">Niciun achievement încă.</p>'}
          </div>
        </div>

        <div class="career-panel career-panel-wide">
          <div class="career-panel-head">
            <h3>Evenimente aleatorii</h3>
          </div>
          <div class="event-box">
            <strong>${(latestConclusion && latestConclusion.title) || "Niciun eveniment"}</strong>
            <p>${(latestConclusion && latestConclusion.quote) || "Niciun eveniment în acest moment."}</p>
          </div>
        </div>

        <div class="career-panel career-panel-wide">
          <div class="career-panel-head">
            <h3>Cardul carierei</h3>
          </div>
          <div class="career-card-box">
            <p><strong>Rating:</strong> ${rating.score}/100</p>
            <p><strong>Sezoane:</strong> ${history.length}</p>
            <p><strong>Achievement-uri:</strong> ${achievements.length}</p>
            <p><strong>Streak:</strong> ${streaks.current}</p>
            <div class="card-actions compact-actions">
              <button class="ghost-btn" id="downloadCareerCardBtn" type="button">Descarcă card</button>
              <button class="ghost-btn" id="shareCareerBtn" type="button">Distribuie cariera</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const shareBtn = document.getElementById("shareCareerBtn");
    if (shareBtn) shareBtn.addEventListener("click", shareCareerSummary);
    const downloadBtn = document.getElementById("downloadCareerCardBtn");
    if (downloadBtn) downloadBtn.addEventListener("click", downloadCareerCard);
  }

  function updateRenewalFormMode() {
    const isManager = (state.current && state.current.type === "manager") || state.mode === "manager";
    const managerFields = document.getElementById("renewalManagerFields");
    const playerFields = document.getElementById("renewalPlayerFields");
    if (managerFields) managerFields.classList.toggle("hidden", !isManager);
    if (playerFields) playerFields.classList.toggle("hidden", isManager);
  }

  function prefillRenewalForm() {
    const challenge = state.current;
    if (!challenge) return;

    const previous = challenge.contractSeasonData || {};
    const isManager = challenge.type === "manager";
    const defaultPosition = previous.position || (isManager ? 5 : 8);
    const defaultBudget = previous.budget || (isManager ? 1800000 : 0);
    const defaultOvr = previous.ovr || challenge.ovr || 72;
    const defaultGoals = previous.goals || 0;
    const defaultAssists = previous.assists || 0;
    const defaultTrophies = previous.trophies || 0;
    const defaultStatus = previous.status || "stabil";

    document.getElementById("renewalPosition").value = defaultPosition;
    document.getElementById("renewalTrophies").value = defaultTrophies;
    document.getElementById("renewalBudget").value = defaultBudget;
    document.getElementById("renewalTransfers").value = previous.transfers || 0;
    document.getElementById("renewalKeyPosition").value = previous.keyPosition || challenge.position || "CM";
    document.getElementById("renewalGoals").value = defaultGoals;
    document.getElementById("renewalAssists").value = defaultAssists;
    document.getElementById("renewalMatches").value = previous.matches || 0;
    document.getElementById("renewalMinutes").value = previous.minutes || 0;
    document.getElementById("renewalOvr").value = defaultOvr;
    document.getElementById("renewalTeamTrophies").value = previous.teamTrophies || defaultTrophies;
    document.getElementById("renewalStatus").value = defaultStatus;
    document.getElementById("renewalPlayerStatus").value = previous.playerStatus || "stabil";
    document.getElementById("renewalPlayerPosition").value = previous.keyPosition || challenge.position || "CM";
    document.getElementById("renewalIndividualTitles").value = previous.individualTitles || "0";
    document.getElementById("renewalCompletedObjectives").value = previous.completedObjectives || 0;
    document.getElementById("renewalFailedObjectives").value = previous.failedObjectives || 0;
    document.getElementById("renewalPlayerCompletedObjectives").value = previous.completedObjectives || 0;
    document.getElementById("renewalPlayerFailedObjectives").value = previous.failedObjectives || 0;
    updateRenewalFormMode();
  }

  function openRenewalModal() {
    const modal = document.getElementById("contractRenewalModal");
    if (!modal) return;
    prefillRenewalForm();
    state.renewalUnlocked = true;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeRenewalModal() {
    const modal = document.getElementById("contractRenewalModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function openSeasonReviewModal(challenge) {
    const modal = document.getElementById("seasonReviewModal");
    const content = document.getElementById("seasonReviewContent");
    if (!modal || !content) return;

    const data = buildSeasonResultCard(challenge);
    content.innerHTML = `
      <div class="season-review-card">
        <div class="season-review-top">
          <div>
            <span class="eyebrow">${data.title}</span>
          </div>
          <div class="season-review-score">${data.score}<small>/100</small></div>
        </div>
        <p class="season-review-summary">${data.summary}</p>

        <div class="season-stat-grid">
          <div class="season-stat-box">
            <span>Loc</span>
            <strong>${data.stats.placement}</strong>
          </div>
          <div class="season-stat-box">
            <span>Trofee</span>
            <strong>${data.stats.trophies}</strong>
          </div>
          <div class="season-stat-box">
            <span>Obiective</span>
            <strong>${data.stats.completedObjectives}</strong>
          </div>
          <div class="season-stat-box">
            <span>Board</span>
            <strong>${data.stats.boardSatisfaction}%</strong>
          </div>
        </div>

        <div class="season-review-actions">
          <button type="button" class="generate-btn small-btn" id="seasonReviewStartBtn">Începe sezonul nou</button>
          <button type="button" class="ghost-btn" id="seasonReviewDownloadBtn">Descarcă cardul</button>
        </div>
      </div>
    `;

    document.getElementById("seasonReviewStartBtn").addEventListener("click", () => {
      closeSeasonReviewModal();
      if (state.current) {
        renderCard(state.current);
      }
    });

    document.getElementById("seasonReviewDownloadBtn").addEventListener("click", () => {
      downloadChallenge();
    });

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeSeasonReviewModal() {
    const modal = document.getElementById("seasonReviewModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function getRenewalPulseData() {
    const challenge = state.current;
    const form = document.getElementById("contractRenewalForm");
    if (!challenge || !form) return null;

    if (challenge.type === "manager") {
      return {
        position: Number(document.getElementById("renewalPosition").value || 0),
        trophies: Number(document.getElementById("renewalTrophies").value || 0),
        budget: Number(document.getElementById("renewalBudget").value || 0),
        transfers: Number(document.getElementById("renewalTransfers").value || 0),
        keyPosition: document.getElementById("renewalKeyPosition").value || "CM",
        status: document.getElementById("renewalStatus").value || "niciuna",
        completedObjectives: Number(document.getElementById("renewalCompletedObjectives").value || 0),
        failedObjectives: Number(document.getElementById("renewalFailedObjectives").value || 0),
        challengeType: challenge.type,
        clubName: challenge.club?.name || "",
        clubLeague: challenge.club?.league || ""
      };
    }

    return {
      goals: Number(document.getElementById("renewalGoals").value || 0),
      assists: Number(document.getElementById("renewalAssists").value || 0),
      matches: Number(document.getElementById("renewalMatches").value || 0),
      minutes: Number(document.getElementById("renewalMinutes").value || 0),
      ovr: Number(document.getElementById("renewalOvr").value || 70),
      teamTrophies: Number(document.getElementById("renewalTeamTrophies").value || 0),
      individualTitles: Number(document.getElementById("renewalIndividualTitles").value || 0),
      keyPosition: document.getElementById("renewalPlayerPosition").value || challenge.position || "CM",
      status: document.getElementById("renewalPlayerStatus").value || "stabil",
      completedObjectives: Number(document.getElementById("renewalPlayerCompletedObjectives").value || 0),
      failedObjectives: Number(document.getElementById("renewalPlayerFailedObjectives").value || 0),
      challengeType: challenge.type,
      clubName: challenge.club?.name || "",
      clubLeague: challenge.club?.league || "",
      position: 0
    };
  }

  function generateRenewalObjective(data) {
    const isManager = data.challengeType === "manager";
    const statusText = data.status === "promovare"
      ? "promovezi"
      : data.status === "retrogradare"
        ? "eviti retrogradarea"
        : "te menții stabil";

    const penalized = data.failedObjectives > 0 ? `Eșecul a avut consecințe reale: ${data.failedObjectives} obiective ratate îți reduc credibilitatea și bugetul sezonului următor.` : "Ai rămas credibil și poți continua fără penalizare majoră.";

    if (!isManager) {
      const titles = data.teamTrophies > 0 ? `${data.teamTrophies} trofee câștigate cu echipa` : "fără trofee cu echipa";
      const individualLine = data.individualTitles > 0 ? `și ai ${data.individualTitles} distincție individuală` : "și nu ai distincții individuale";
      const pool = [
        `Rămâi la ${data.clubName || 'echipa ta'} și termini sezonul cu ${Math.max(10, data.goals + 4)} goluri, ${Math.max(8, data.assists + 3)} assist-uri și ${titles}. ${individualLine}. ${penalized}`,
        `Fii titular în ${data.keyPosition || 'poziția ta'} și ajungi la ${Math.max(78, data.ovr + 2)} OVR, cu ${Math.max(20, data.matches + 5)} meciuri jucate și ${Math.max(1200, data.minutes + 400)} minute. ${penalized}`,
        `Îți menții locul în lot și câștigi ${Math.max(1, data.teamTrophies + 1)} trofee cu echipa, păstrând o medie de ${Math.max(70, data.ovr)}. ${penalized}`,
        `Consolidezi poziția și închei sezonul cu ${Math.max(1, data.completedObjectives + 1)} obiective de carieră atinse, fără să ratezi prea multe repere. ${penalized}`,
        `Ești decisiv pentru echipa ta: ${Math.max(1, data.goals + 2)} goluri, ${Math.max(1, data.assists + 2)} pase decisive și un sezon fără victime de contract. ${penalized}`
      ];
      return pick(pool);
    }

    const pool = [
      `Termină sezonul în primele ${Math.min(4, Math.max(2, data.position))} și câștigă ${data.trophies > 0 ? 'un trofeu' : 'o performanță solidă'} rămânând la ${data.clubName || 'echipa ta'} . ${penalized}`,
      `Îmbunătățește bugetul la ${data.budget + 150000}€ și ajungi la ${Math.max(3, 8 - data.failedObjectives)} obiective de sezon asumate, fără să părăsești clubul. ${penalized}`,
      `Evită retrogradarea și construiește un lot stabil din ${Math.max(1, data.transfers)} transferuri, păstrând identitatea echipei tale. ${penalized}`,
      `${statusText} și structurezi un proiect cu ${Math.max(1, data.completedObjectives + 1)} obiective clare pentru sezonul următor. ${penalized}`,
      `Câștigă cel puțin ${Math.max(1, data.trophies + 1)} trofeu și menții un OVR mediu de ${Math.max(70, data.ovr || 70)} la același club. ${penalized}`
    ];

    return pick(pool).replace(/\s+\./g, '.');
  }

  function generateRenewalChallengeFromSeason() {
    const data = getRenewalPulseData();
    if (!data) return;

    const previousChallenge = state.current || generateManagerChallenge(allClubs, state.difficulty, currentFilters());
    const clubToKeep = previousChallenge.club
      ? { ...previousChallenge.club }
      : { name: data.clubName || "Echipa ta", league: data.clubLeague || "Liga locală", country: "" };
    const baseObjective = generateRenewalObjective(data);
    const penalty = data.failedObjectives > 0
      ? `Pedeapsă: ${data.failedObjectives} obiective ratate te costă bugetul sezonului următor și scad șansele de prelungire.`
      : "Pedeapsă: eșecul implică reducerea bugetului de transfer cu 10% și o evaluare mai strictă a contractului.";

    const next = {
      ...previousChallenge,
      type: data.challengeType,
      club: clubToKeep,
      difficulty: previousChallenge.difficulty,
      objective: baseObjective,
      penalty,
      contractRenewal: "Reînnoire de contract activată: noua provocare este generată din datele sezonului jucat și păstrează echipa actuală.",
      missionWindow: data.challengeType === "player" ? (data.ovr >= 80 ? "2 sezoane" : "2-3 sezoane") : "1-2 sezoane",
      completed: false,
      completedAt: null,
      lastSeasonSummary: data,
      contractSeasonData: data,
      clubKept: true
    };

    if (data.challengeType === "player") {
      next.position = data.keyPosition || previousChallenge.position || "CM";
      next.ovr = Math.max(previousChallenge.ovr || 70, data.ovr || 70);
      next.name = previousChallenge.name || next.name;
      next.nationality = previousChallenge.nationality || next.nationality;
    }

    state.current = next;
    renderCard(next);
    next.randomEvent = generateRandomEvent(next);
    next.seasonReview = buildSeasonReview(next);
    persistSessionState();
    closeRenewalModal();
    saveToHistory(next);
    refreshChallengeViews();
    openSeasonReviewModal(next);
  }

  document.getElementById("contractRenewalForm").addEventListener("submit", (e) => {
    e.preventDefault();
    generateRenewalChallengeFromSeason();
  });

  document.getElementById("renewalCancelBtn").addEventListener("click", closeRenewalModal);
  document.getElementById("renewalCloseBtn").addEventListener("click", closeRenewalModal);
  document.getElementById("seasonReviewCloseBtn").addEventListener("click", closeSeasonReviewModal);
  document.getElementById("reportIssueBtn").addEventListener("click", openReportModal);
  document.getElementById("reportIssueInlineBtn").addEventListener("click", openReportModal);
  document.getElementById("reportCancelBtn").addEventListener("click", closeReportModal);
  document.getElementById("reportCloseBtn").addEventListener("click", closeReportModal);
  document.getElementById("reportIssueForm").addEventListener("submit", submitReportIssue);

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", () => {
      const parentModal = backdrop.closest(".modal");
      if (!parentModal) return;
      if (parentModal.id === "contractRenewalModal") closeRenewalModal();
      if (parentModal.id === "reportProblemModal") closeReportModal();
      if (parentModal.id === "seasonReviewModal") closeSeasonReviewModal();
    });
  });

  renderHistory();
  updateCompletedCount();
  renderCareerDashboard();
})();
