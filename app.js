// EcoSphere - Enterprise ESG Management Platform
// Main Application Script

(function() {
  const currentLanguageCode = localStorage.getItem("selectedLanguageCode") || "en";
  document.cookie = "googtrans=/en/" + currentLanguageCode + "; path=/;";
  document.cookie = "googtrans=/en/" + currentLanguageCode + "; path=/; domain=" + window.location.hostname + ";";
})();

// State Management
const appState = {
  // Configs
  config: {
    autoEmission: true,
    evidenceRequired: true,
    badgeAutoAward: true,
    weights: {
      environmental: 40,
      social: 30,
      governance: 30
    },
    notifications: {
      compliance: true,
      approvals: true,
      policy: true,
      badges: true
    }
  },

  // Active user data
  isLoggedIn: false,
  currentUser: null,

  // Master Data
  departments: [
    { code: "MFG", name: "Manufacturing", head: "Priya Sharma", parent: "Corporate", employees: 48, status: "Active" },
    { code: "LOG", name: "Logistics", head: "Rajiv Nair", parent: "Corporate", employees: 32, status: "Active" },
    { code: "MKT", name: "Sales & Marketing", head: "Sarah Jenkins", parent: "Corporate", employees: 25, status: "Active" },
    { code: "RND", name: "R&D", head: "Amit Mehta", parent: "Corporate", employees: 18, status: "Active" },
    { code: "CORP", name: "Corporate", head: "Elena Rostova", parent: null, employees: 12, status: "Active" }
  ],

  categories: [
    { id: "cat1", name: "CSR Clean Energy", type: "CSR Activity", status: "Active" },
    { id: "cat2", name: "CSR Recycling", type: "CSR Activity", status: "Active" },
    { id: "cat3", name: "Zero Waste Challenge", type: "Challenge", status: "Active" },
    { id: "cat4", name: "Carbon Offsetting", type: "Challenge", status: "Active" }
  ],

  emissionFactors: [
    { source: "Fleet - Diesel", category: "Fleet", factor: 2.68, unit: "kg CO2e per Liter" },
    { source: "Fleet - Gasoline", category: "Fleet", factor: 2.31, unit: "kg CO2e per Liter" },
    { source: "Electricity - Grid", category: "Manufacturing", factor: 0.85, unit: "kg CO2e per kWh" },
    { source: "Purchase - Raw Iron", category: "Purchase", factor: 1.85, unit: "kg CO2e per kg" },
    { source: "Expense - Business Flight", category: "Expense", factor: 0.12, unit: "kg CO2e per km" }
  ],

  products: [
    { code: "ECO-B1", name: "Bio-Polymer Packaging", esgProfile: "High Recyclability", carbon: 0.42 },
    { code: "STD-P2", name: "Standard Pack Foil", esgProfile: "Medium Impact", carbon: 1.85 },
    { code: "SOL-C3", name: "EcoSphere Solar Case", esgProfile: "Low Impact / Carbon Negative", carbon: -0.15 }
  ],

  goals: [
    { id: "g1", name: "Reduce Scope 1 & 2 Fleet Carbon", target: 20000, current: 24500, unit: "kg CO2e", deadline: "2026-12-31", status: "Active" },
    { id: "g2", name: "CSR Participation Rate", target: 80, current: 65, unit: "%", deadline: "2026-10-31", status: "Active" },
    { id: "g3", name: "Policy Acknowledgement Completion", target: 100, current: 92, unit: "%", deadline: "2026-08-31", status: "Active" }
  ],

  policies: [
    { code: "POL-01", name: "Anti-Corruption & Fair Trade Policy", version: "v2.1", date: "2026-01-15", status: "Active", link: "#" },
    { code: "POL-02", name: "Zero Waste & Single-Use Plastic Ban", version: "v1.4", date: "2026-03-01", status: "Active", link: "#" },
    { code: "POL-03", name: "Supplier Code of Conduct & ESG Standards", version: "v3.0", date: "2026-05-10", status: "Active", link: "#" }
  ],

  badges: [
    { name: "Green Beginner", desc: "Awarded upon logging the first CSR activity.", icon: "leaf", color: "#2EEBC8", rule: "First CSR Activity", unlocked: true },
    { name: "Carbon Saver", desc: "Achieve carbon transactions reduction below goal.", icon: "zap", color: "#3DBBFF", rule: "XP >= 500", unlocked: true },
    { name: "Sustainability Champion", desc: "Complete 3 environmental challenges.", icon: "award", color: "#FDB339", rule: "Challenges >= 3", unlocked: false },
    { name: "Team Player", desc: "Log 5 CSR contributions.", icon: "users", color: "#B47DFF", rule: "CSRs >= 5", unlocked: false }
  ],

  rewards: [
    { id: "r1", name: "Biodegradable Coffee Mug", desc: "Made from bamboo fibers, branded with EcoSphere logo.", points: 300, stock: 12, status: "Active" },
    { id: "r2", name: "Carbon Offset Certificate (1 Ton)", desc: "Offered via verified Gold Standard carbon sinks.", points: 800, stock: 50, status: "Active" },
    { id: "r3", name: "Sustainable Odoo Hoodie", desc: "100% organic cotton, customized with employee initials.", points: 1200, stock: 4, status: "Active" }
  ],

  // Transactional Data
  carbonTransactions: [
    { date: "2026-07-02", department: "Logistics", category: "Fleet", desc: "Fleet Diesel refuel: 1200 Liters", value: 3216 },
    { date: "2026-07-05", department: "Manufacturing", category: "Manufacturing", desc: "Electricity consumption: 8500 kWh", value: 7225 },
    { date: "2026-07-08", department: "Sales", category: "Expense", desc: "Client visit domestic flight: 1500 km", value: 180 },
    { date: "2026-07-10", department: "Manufacturing", category: "Purchase", desc: "Raw material procurement: 2000 kg", value: 3700 }
  ],

  csrActivities: [
    { id: "csr1", title: "Reforestation Drive 2026", category: "CSR Clean Energy", desc: "Planting saplings in the northern forest reserve.", target: 30, date: "2026-07-15", xp: 150, status: "Active" },
    { id: "csr2", title: "Electronic Waste Roundup", category: "CSR Recycling", desc: "Recycle unused personal and company electronics safely.", target: 15, date: "2026-07-20", xp: 100, status: "Active" }
  ],

  employeeParticipation: [
    { employee: "Priya Sharma", activity: "Reforestation Drive 2026", proof: "reforestation_pic.jpg", status: "Completed", points: 150, date: "2026-07-05" },
    { employee: "Rajiv Nair", activity: "Electronic Waste Roundup", proof: "ewaste_receipt.pdf", status: "Under Review", points: 100, date: "2026-07-11" },
    { employee: "Amit Mehta", activity: "Reforestation Drive 2026", proof: "sapling_photo.png", status: "Completed", points: 150, date: "2026-07-06" }
  ],

  challenges: [
    { id: "ch1", title: "Zero Waste Sprint", category: "Zero Waste Challenge", desc: "Reduce personal office trash to below 1kg per week.", xp: 200, difficulty: "Medium", evidence: "Trash log photo", deadline: "2026-07-20", status: "Active" },
    { id: "ch2", title: "Commute Green Challenge", category: "Carbon Offsetting", desc: "Use public transport or bicycle for 5 consecutive days.", xp: 120, difficulty: "Easy", evidence: "Bus pass / Strava tracking", deadline: "2026-07-25", status: "Active" },
    { id: "ch3", title: "Office Energy Saver Drive", category: "Zero Waste Challenge", desc: "Ensure all testing monitors in department are off after hours.", xp: 300, difficulty: "Hard", evidence: "Monitor check list", deadline: "2026-08-05", status: "Draft" }
  ],

  challengeParticipation: [
    { challenge: "Zero Waste Sprint", employee: "Amit Mehta", progress: 100, proof: "weighing_receipt.jpg", status: "Completed", xp: 200, date: "2026-07-09" },
    { challenge: "Commute Green Challenge", employee: "Priya Sharma", progress: 60, proof: "strava_commute.jpg", status: "Active", xp: 120, date: "" },
    { challenge: "Zero Waste Sprint", employee: "Rajiv Nair", progress: 40, proof: "", status: "Active", xp: 200, date: "" }
  ],

  policyAcknowledgements: [
    { employee: "Amit Mehta", policy: "POL-01", date: "2026-06-12", status: "Completed" },
    { employee: "Amit Mehta", policy: "POL-02", date: "2026-07-01", status: "Completed" },
    { employee: "Amit Mehta", policy: "POL-03", date: "", status: "Pending" },
    { employee: "Priya Sharma", policy: "POL-01", date: "2026-06-15", status: "Completed" },
    { employee: "Rajiv Nair", policy: "POL-02", date: "2026-07-03", status: "Completed" }
  ],

  audits: [
    { id: "aud1", title: "Q2 Operations Audit", auditor: "S. Nair", department: "Manufacturing", date: "2026-06-12", findings: "3 minor chemical storage issues.", status: "Completed" },
    { id: "aud2", title: "Logistics Carbon Compliance Audit", auditor: "R. Iyer", department: "Logistics", date: "2026-07-01", findings: "1 vehicle fuel log mismatch.", status: "Under Review" }
  ],

  complianceIssues: [
    { id: "ci1", desc: "Missing MSDS safety sheets in Chem lab", severity: "High", department: "Manufacturing", owner: "Priya Sharma", dueDate: "2026-07-10", status: "Open", audit: "Q2 Operations Audit" },
    { id: "ci2", desc: "Odometer calibration required on logistics truck 4", severity: "Medium", department: "Logistics", owner: "Rajiv Nair", dueDate: "2026-07-28", status: "Resolved", audit: "Logistics Carbon Compliance Audit" },
    { id: "ci3", desc: "Scope 3 supplier certification pending review", severity: "Low", department: "Corporate", owner: "Elena Rostova", dueDate: "2026-07-05", status: "Open", audit: "Manual Log" }
  ],

  notifications: [
    { id: "n1", text: "New Compliance Issue raised in Manufacturing", type: "compliance", time: "2 hours ago", unread: true },
    { id: "n2", text: "Amit Mehta unlocked the 'Carbon Saver' Badge", type: "badge", time: "5 hours ago", unread: true },
    { id: "n3", text: "Anti-Corruption Policy acknowledgement reminder sent", type: "policy", time: "1 day ago", unread: false }
  ],

  // In-memory score caches
  scores: {
    departments: {
      MFG: { environmental: 82, social: 75, governance: 88 },
      LOG: { environmental: 68, social: 60, governance: 72 },
      MKT: { environmental: 89, social: 70, governance: 90 },
      RND: { environmental: 94, social: 90, governance: 95 },
      CORP: { environmental: 80, social: 85, governance: 86 }
    }
  }
};

// ================= ENVIRONMENTAL DASHBOARD STATE =================
const envPageState = {
  page: 1,
  pageSize: 5,
  sortBy: 'date',
  sortDesc: true,
  chartRange: 'month',
  analyticsView: 'dept',
  selectedTransactions: [],
  selectedLocationKey: 'DL'
};

const mapLocations = {
  DL: { name: "Delhi Factory Hub", x: 180, y: 120, aqi: 145, predAqi: 152, emissions: 3520, risk: "High", status: "Warning", type: "Factory" },
  BOM: { name: "Mumbai Headquarters", x: 110, y: 220, aqi: 52, predAqi: 48, emissions: 1250, risk: "Low", status: "Active", type: "Office" },
  MAA: { name: "Chennai Manufacturing Plant", x: 180, y: 320, aqi: 98, predAqi: 92, emissions: 4180, risk: "Medium", status: "Active", type: "Plant" },
  BLR: { name: "Bengaluru R&D Center", x: 160, y: 300, aqi: 45, predAqi: 41, emissions: 640, risk: "Low", status: "Active", type: "Office" },
  CCU: { name: "Kolkata Warehouse Depot", x: 260, y: 180, aqi: 115, predAqi: 124, emissions: 2090, risk: "Medium", status: "Active", type: "Warehouse" }
};

// ================= SOCIAL DASHBOARD STATE =================
const socPageState = {
  page: 1,
  pageSize: 5,
  sortBy: 'date',
  sortDesc: true,
  chartRange: 'month',
  sentimentView: 'radar',
  selectedParticipation: [],
  joinedActivities: []
};

// ================= GOVERNANCE DASHBOARD STATE =================
const govPageState = {
  page: 1,
  pageSize: 5,
  sortBy: 'date',
  sortDesc: true,
  chartRange: 'month',
  selectedIssues: [],
  activeAudits: [],
  riskGridDetails: null
};

// ================= APPSTATE PERSISTENCE ENGINE =================
(function() {
  const persistedState = localStorage.getItem("appStateTransactional");
  if (persistedState) {
    try {
      const parsed = JSON.parse(persistedState);
      if (parsed.carbonTransactions) appState.carbonTransactions = parsed.carbonTransactions;
      if (parsed.employeeParticipation) appState.employeeParticipation = parsed.employeeParticipation;
      if (parsed.challenges) appState.challenges = parsed.challenges;
      if (parsed.challengeParticipation) appState.challengeParticipation = parsed.challengeParticipation;
      if (parsed.audits) appState.audits = parsed.audits;
      if (parsed.complianceIssues) appState.complianceIssues = parsed.complianceIssues;
      if (parsed.policyAcknowledgements) appState.policyAcknowledgements = parsed.policyAcknowledgements;
      if (parsed.notifications) appState.notifications = parsed.notifications;
      if (parsed.scores) appState.scores = parsed.scores;
    } catch (e) {
      console.error("Failed to restore persisted appState", e);
    }
  }
})();

function saveAppStateTransactional() {
  const stateToSave = {
    carbonTransactions: appState.carbonTransactions,
    employeeParticipation: appState.employeeParticipation,
    challenges: appState.challenges,
    challengeParticipation: appState.challengeParticipation,
    audits: appState.audits,
    complianceIssues: appState.complianceIssues,
    policyAcknowledgements: appState.policyAcknowledgements,
    notifications: appState.notifications,
    scores: appState.scores
  };
  localStorage.setItem("appStateTransactional", JSON.stringify(stateToSave));
  
  if (appState.isLoggedIn && appState.currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(appState.currentUser));
  }

  // Save to Django Backend REST API
  fetch("/api/state/save/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(stateToSave)
  })
  .then(res => res.json())
  .then(updatedState => {
    if (updatedState && updatedState.scores) {
      appState.scores = updatedState.scores;
      // Re-render dashboard and charts to display updated ML scores
      if (document.querySelector(".nav-item.active")?.getAttribute("data-target") === "dashboard") {
        renderDashboard();
      } else if (document.querySelector(".nav-item.active")?.getAttribute("data-target") === "environmental") {
        renderEnvironmental();
      }
    }
  })
  .catch(err => console.error("Error saving state to backend", err));
}

// SVG Chart Generation Helpers
function drawSparkline(svgId, dataPoints) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  
  // Clear old contents
  svg.innerHTML = "";
  
  const width = svg.clientWidth || 300;
  const height = svg.clientHeight || 150;
  const padding = 24;

  const minVal = Math.min(...dataPoints) * 0.9;
  const maxVal = Math.max(...dataPoints) * 1.1;
  const range = maxVal - minVal;
  
  const points = dataPoints.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (dataPoints.length - 1);
    const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
    return { x, y };
  });

  // Draw Grid Lines (Horizontal)
  for (let i = 0; i <= 3; i++) {
    const y = padding + (i * (height - padding * 2)) / 3;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", padding);
    line.setAttribute("y1", y);
    line.setAttribute("x2", width - padding);
    line.setAttribute("y2", y);
    line.setAttribute("class", "grid-line");
    svg.appendChild(line);
  }

  // Draw Line
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    // Smooth cubic bezier curves
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  path.setAttribute("class", "chart-line");
  path.setAttribute("stroke", "#875A7B");
  svg.appendChild(path);

  // Add Dots and Tooltips
  points.forEach((pt, idx) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", pt.x);
    circle.setAttribute("cy", pt.y);
    circle.setAttribute("r", "4");
    circle.setAttribute("fill", "#121214");
    circle.setAttribute("stroke", "#875A7B");
    circle.setAttribute("class", "chart-dot");
    
    // Simple tooltip behavior
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = `Emissions: ${dataPoints[idx]} kg CO2e`;
    circle.appendChild(title);
    
    svg.appendChild(circle);
  });
}

function drawDepartmentRankings(svgId) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  svg.innerHTML = "";

  const width = svg.clientWidth || 300;
  const height = svg.clientHeight || 150;
  const padding = 20;
  
  // Calculate aggregated total score for each department based on active weights
  const deptScores = appState.departments.map(dept => {
    const rawScores = appState.scores.departments[dept.code] || { environmental: 50, social: 50, governance: 50 };
    const w = appState.config.weights;
    const total = Math.round(
      (rawScores.environmental * w.environmental +
       rawScores.social * w.social +
       rawScores.governance * w.governance) / 100
    );
    return { name: dept.name, code: dept.code, total };
  }).sort((a, b) => b.total - a.total);

  const barHeight = (height - padding * 2) / deptScores.length - 8;
  const maxScore = 100;
  const labelWidth = 50;
  const valueWidth = 60;
  const maxBarWidth = width - padding * 2 - labelWidth - valueWidth;

  const savedAccent = localStorage.getItem("themeAccentColor") || "#875A7B";

  deptScores.forEach((dept, idx) => {
    const y = padding + idx * (barHeight + 8);
    const barWidth = (maxBarWidth * dept.total) / maxScore;

    // Label
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", padding);
    text.setAttribute("y", y + barHeight / 2 + 5);
    text.setAttribute("fill", "var(--white)");
    text.setAttribute("font-size", "11px");
    text.setAttribute("font-weight", "600");
    text.textContent = dept.code;
    svg.appendChild(text);

    // Bar Background
    const rectBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectBg.setAttribute("x", padding + labelWidth);
    rectBg.setAttribute("y", y);
    rectBg.setAttribute("width", maxBarWidth);
    rectBg.setAttribute("height", barHeight);
    rectBg.setAttribute("rx", "4");
    rectBg.setAttribute("fill", "var(--gray)");
    svg.appendChild(rectBg);

    // Bar Foreground
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", padding + labelWidth);
    rect.setAttribute("y", y);
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("rx", "4");
    
    // Monochromatic scale of chosen Accent color, warning red for last
    let color = savedAccent;
    if (idx === deptScores.length - 1) {
      color = "#FF7B7B"; // soft warning red
    } else if (idx === 1) {
      color = savedAccent + "CC"; // 80% opacity
    } else if (idx === 2) {
      color = savedAccent + "99"; // 60% opacity
    } else if (idx > 2) {
      color = savedAccent + "66"; // 40% opacity
    }
    
    rect.setAttribute("fill", color);
    svg.appendChild(rect);

    // Score Value (aligned to the right)
    const textVal = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textVal.setAttribute("x", width - padding);
    textVal.setAttribute("y", y + barHeight / 2 + 5);
    textVal.setAttribute("text-anchor", "end");
    textVal.setAttribute("fill", "var(--white)");
    textVal.setAttribute("font-size", "11px");
    textVal.setAttribute("font-weight", "600");
    textVal.textContent = `${dept.total}/100`;
    svg.appendChild(textVal);
  });
}

// Router & Nav
function initNavigation() {
  const sidebarItems = document.querySelectorAll(".nav-item[data-target]");
  sidebarItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.getAttribute("data-target");
      if (target === "settings") {
        window.location.href = "settings.html";
        return;
      }
      switchTab(target);
    });
  });
}

function switchTab(targetId) {
  // Save active tab state
  localStorage.setItem("activeTab", targetId);

  // Update nav menu active states
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  const activeNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
  if (activeNav) activeNav.classList.add("active");

  // Show active view panel
  document.querySelectorAll(".view-panel").forEach(el => el.classList.remove("active"));
  const activePanel = document.getElementById(`${targetId}-panel`);
  if (activePanel) {
    activePanel.classList.add("active");
  }

  // Update dynamic content triggers
  if (targetId === "dashboard") {
    renderDashboard();
  } else if (targetId === "environmental") {
    renderEnvironmental();
  } else if (targetId === "social") {
    renderSocial();
  } else if (targetId === "governance") {
    renderGovernance();
  } else if (targetId === "gamification") {
    renderGamification();
  } else if (targetId === "reports") {
    renderReports();
  } else if (targetId === "settings") {
    renderSettings();
  }
}

// Main Scoring Engine
function calculateESGOverview() {
  const depts = appState.departments;
  const w = appState.config.weights;
  let totalWeightedScore = 0;
  let totalEmployees = 0;

  let sumEnv = 0;
  let sumSoc = 0;
  let sumGov = 0;

  depts.forEach(d => {
    const scores = appState.scores.departments[d.code] || { environmental: 50, social: 50, governance: 50 };
    sumEnv += scores.environmental * d.employees;
    sumSoc += scores.social * d.employees;
    sumGov += scores.governance * d.employees;
    totalEmployees += d.employees;
  });

  const avgEnv = Math.round(sumEnv / totalEmployees);
  const avgSoc = Math.round(sumSoc / totalEmployees);
  const avgGov = Math.round(sumGov / totalEmployees);

  const overall = Math.round(
    (avgEnv * w.environmental +
     avgSoc * w.social +
     avgGov * w.governance) / 100
  );

  return {
    environmental: avgEnv,
    social: avgSoc,
    governance: avgGov,
    overall: overall
  };
}

// Render Dashboard
function renderDashboard() {
  const overview = calculateESGOverview();
  
  // Update Top stats cards
  document.getElementById("db-kpi-environmental").textContent = `${overview.environmental}/100`;
  document.getElementById("db-kpi-social").textContent = `${overview.social}/100`;
  document.getElementById("db-kpi-governance").textContent = `${overview.governance}/100`;
  document.getElementById("db-kpi-overall").textContent = `${overview.overall}/100`;

  // Draw Charts
  drawSparkline("db-emissions-chart", [3850, 4200, 3950, 3100, 2800, 3400, 4100, 4300, 4500, 4100, 3900, 3200]);
  drawDepartmentRankings("db-dept-ranking-chart");

  // Render recent activity list
  const activityList = document.getElementById("db-recent-activity");
  activityList.innerHTML = "";
  
  // Mix and match recent events
  const activities = [
    { icon: "check-circle", color: "var(--primary-green)", text: "Priya Sharma completed 'Zero Waste Sprint' challenge", time: "2 hours ago" },
    { icon: "alert-triangle", color: "var(--red)", text: "Overdue Compliance issue: 'Scope 3 supplier certification pending review'", time: "5 hours ago" },
    { icon: "zap", color: "var(--blue)", text: "10 new Carbon Transactions aggregated from Manufacturing ERP logs", time: "Yesterday" },
    { icon: "file-text", color: "var(--purple)", text: "Amit Mehta acknowledged anti-corruption policy POL-02", time: "Yesterday" }
  ];

  activities.forEach(act => {
    const item = document.createElement("div");
    item.className = "leaderboard-row";
    item.style.padding = "12px";
    item.style.backgroundColor = "rgba(255,255,255,0.01)";
    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="color:${act.color}; display:flex;"><i data-lucide="${act.icon}"></i></span>
        <div>
          <div style="font-size:13px; font-weight:500;">${act.text}</div>
          <div style="font-size:11px; color:var(--text-muted);">${act.time}</div>
        </div>
      </div>
    `;
    activityList.appendChild(item);
  });
  
  if (window.lucide) window.lucide.createIcons();
}

// Render Environmental Page
function renderSparkline(containerId, dataPoints, color = "var(--primary-green)") {
  const container = document.getElementById(containerId);
  if (!container) return;
  const width = container.clientWidth || 100;
  const height = 25;
  if (dataPoints.length < 2) return;
  
  const maxVal = Math.max(...dataPoints, 1);
  const minVal = Math.min(...dataPoints, 0);
  const range = maxVal - minVal;
  
  const points = dataPoints.map((val, idx) => {
    const x = (idx / (dataPoints.length - 1)) * width;
    const y = height - ((val - minVal) / (range || 1)) * height;
    return `${x},${y}`;
  }).join(" ");
  
  container.innerHTML = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
      <polyline fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
    </svg>
  `;
}

function renderEnvironmental() {
  const filteredTrans = getFilteredTransactions();
  const totalCarbon = filteredTrans.reduce((sum, item) => sum + parseFloat(item.value || 0), 0);
  
  // KPI 1: Total Carbon
  document.getElementById("kpi-total-carbon").textContent = `${totalCarbon.toLocaleString()} kg`;
  renderSparkline("sparkline-carbon", [2400, 3100, 2900, 3500, 4200, 3700, totalCarbon]);

  // KPI 2: Reduction
  const targetEmissions = 20000;
  const reduction = Math.max(0, targetEmissions - totalCarbon);
  document.getElementById("kpi-carbon-reduction").textContent = `${reduction.toLocaleString()} kg`;
  renderSparkline("sparkline-reduction", [1200, 1500, 1800, 1400, 2100, 2300, reduction], "#2ECC71");

  // KPI 3: Environmental Score
  const depts = Object.keys(appState.scores.departments);
  const avgScore = Math.round(depts.reduce((sum, key) => sum + appState.scores.departments[key].environmental, 0) / depts.length);
  document.getElementById("kpi-env-score").textContent = `${avgScore}/100`;
  renderSparkline("sparkline-score", [78, 80, 81, 79, 83, 84, avgScore]);

  // KPI 4: Goals Completed
  const completedGoals = appState.goals ? appState.goals.filter(g => g.current >= g.target).length : 2;
  const totalGoals = appState.goals ? appState.goals.length : 3;
  document.getElementById("kpi-goals-completed").textContent = `${completedGoals}/${totalGoals}`;
  renderSparkline("sparkline-goals", [1, 1, 2, 2, 2, 2, completedGoals], "#00A09D");

  // KPI 5: Active Emission Sources
  const sourcesCount = appState.emissionFactors.length;
  document.getElementById("kpi-active-sources").textContent = `${sourcesCount} Sources`;
  renderSparkline("sparkline-sources", [3, 3, 4, 4, 4, 4, sourcesCount], "#3DBBFF");

  // KPI 6: AQI Prediction
  // Estimate AQI tomorrow based on ML logic (predicted AQI scales with total carbon)
  const simulatedAqi = Math.round(55 + (totalCarbon / 25000) * 15);
  document.getElementById("kpi-aqi-prediction").textContent = simulatedAqi;
  let aqiStatus = "Good Air Quality";
  let aqiColor = "#2ECC71";
  if (simulatedAqi > 100) {
    aqiStatus = "Unhealthy AQI Forecast";
    aqiColor = "#DC3545";
  } else if (simulatedAqi > 75) {
    aqiStatus = "Moderate AQI Forecast";
    aqiColor = "#E9A130";
  }
  document.getElementById("kpi-aqi-status").innerHTML = `<span style="color:${aqiColor}; font-weight:600;">${aqiStatus}</span>`;
  renderSparkline("sparkline-aqi", [150, 140, 130, 145, 138, 145, simulatedAqi], aqiColor);

  // ROW 2: AI Intelligence Recommendation Panel
  const aiTextEl = document.getElementById("ai-recommendation-text");
  const aiPredCarbon = document.getElementById("ai-pred-carbon");
  const aiPredAqi = document.getElementById("ai-pred-aqi");
  const aiPredSource = document.getElementById("ai-pred-source");
  const aiPredSavings = document.getElementById("ai-pred-savings");
  
  if (totalCarbon > 12000) {
    aiTextEl.textContent = `"Manufacturing emissions are expected to increase by 12% over the next week based on resource consumption logs. Switching 20% of diesel-powered logistics to EVs could reduce monthly emissions by approximately 2,400 kg of CO₂."`;
    aiPredCarbon.textContent = `${Math.round(totalCarbon * 1.05).toLocaleString()} kg`;
    aiPredAqi.textContent = `${simulatedAqi + 4} (Moderate)`;
    aiPredSource.textContent = "Logistics (Fleet)";
    aiPredSavings.textContent = `${Math.round(totalCarbon * 0.15).toLocaleString()} kg`;
  } else {
    aiTextEl.textContent = `"Emissions are currently within standard baseline targets. To further optimize ESG compliance, transition corporate workspace cooling schedules to off-peak hours to yield an estimated 480 kg CO₂ savings this month."`;
    aiPredCarbon.textContent = `${Math.round(totalCarbon * 0.98).toLocaleString()} kg`;
    aiPredAqi.textContent = `${simulatedAqi - 3} (Good)`;
    aiPredSource.textContent = "Office Energy";
    aiPredSavings.textContent = `480 kg`;
  }

  // ROW 3: Monthly Emissions Line Chart & Department Bar Chart
  renderEmissionsLineChart();
  renderDeptBarChart();

  // ROW 4: Donut breakdown & Heatmap Grid
  renderDonutBreakdown();
  renderHeatmapGrid();

  // ROW 5: India Map coordinates
  renderIndiaMap();

  // ROW 6: Environmental goals list
  renderDetailedGoals();

  // ROW 7: paginated recent transaction ledger
  renderRecentTransactionsLedger();

  // ROW 8: factors cards library
  renderFactorsLibrary();

  // ROW 10: top pollutants index
  renderPollutantLevels();

  // ROW 11 & 12: Alerts stack and timeline log
  renderAlertsStack();
  renderActivityTimeline();

  // ROW 13: Achievements milestones
  renderAchievementsMilestones();

  // ROW 14: Analytics Deep Dive
  renderAnalyticsDeepDive();
}

// ---------------- ROW 3 LINE CHART RENDERER ----------------
function renderEmissionsLineChart() {
  const container = document.getElementById("chart-monthly-emissions");
  if (!container) return;
  
  const width = container.clientWidth || 600;
  const height = 260;
  
  // Historical data points
  let dataPoints = [3100, 2800, 3500, 3900, 4200, 3700, 3100, 3400, 3200, 3600, 3800, 4000];
  let labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  if (envPageState.chartRange === 'week') {
    dataPoints = [600, 450, 700, 520, 800, 650, 550];
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  } else if (envPageState.chartRange === 'quarter') {
    dataPoints = [9200, 11400, 12500, 10200];
    labels = ["Q1", "Q2", "Q3", "Q4"];
  }
  
  const maxVal = Math.max(...dataPoints) * 1.15;
  const padding = 40;
  
  let polylinePoints = "";
  let gridLines = "";
  let labelsHtml = "";
  let fillPoints = `40,${height - padding} `;
  
  // Draw horizontal Y gridlines
  for (let i = 0; i <= 4; i++) {
    const yVal = Math.round((maxVal / 4) * i);
    const y = height - padding - ((yVal / maxVal) * (height - 2 * padding));
    gridLines += `
      <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3,3" />
      <text x="${padding - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${yVal.toLocaleString()}</text>
    `;
  }
  
  dataPoints.forEach((val, idx) => {
    const x = padding + (idx / (dataPoints.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val / maxVal) * (height - 2 * padding));
    polylinePoints += `${x},${y} `;
    fillPoints += `${x},${y} `;
    
    // X label
    labelsHtml += `
      <text x="${x}" y="${height - padding + 16}" fill="var(--text-muted)" font-size="10" text-anchor="middle">${labels[idx]}</text>
      <circle cx="${x}" cy="${y}" r="3.5" fill="var(--primary-green)" stroke="var(--bg-dark)" stroke-width="1.5" class="map-node" onclick="alert('Value: ${val} kg CO2e')" />
    `;
  });
  fillPoints += `${width - padding},${height - padding}`;
  
  container.innerHTML = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
      <defs>
        <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary-green)" stop-opacity="0.15" />
          <stop offset="100%" stop-color="var(--primary-green)" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${gridLines}
      <polygon points="${fillPoints}" fill="url(#area-gradient)" />
      <polyline points="${polylinePoints}" fill="none" stroke="var(--primary-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      ${labelsHtml}
    </svg>
  `;
}

function toggleChartRange(range) {
  envPageState.chartRange = range;
  document.querySelectorAll("#btn-chart-week, #btn-chart-month, #btn-chart-quarter, #btn-chart-year").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById(`btn-chart-${range}`).classList.add("active");
  renderEmissionsLineChart();
}

// ---------------- ROW 3 DEPARTMENT COMPARISON BAR CHART ----------------
function renderDeptBarChart() {
  const container = document.getElementById("chart-dept-comparison");
  if (!container) return;
  container.innerHTML = "";
  
  const deptsData = [
    { name: "Manufacturing", actual: 7225, target: 6000, trend: "+8.2%" },
    { name: "Logistics", actual: 3216, target: 3500, trend: "-4.5%" },
    { name: "Sales & Marketing", actual: 180, target: 500, trend: "-12%" },
    { name: "R&D", actual: 0, target: 800, trend: "-100%" },
    { name: "Corporate", actual: 3700, target: 3000, trend: "+12.4%" }
  ];
  
  deptsData.forEach(dept => {
    const maxVal = 8000;
    const actualWidth = Math.min(100, (dept.actual / maxVal) * 100);
    const targetWidth = Math.min(100, (dept.target / maxVal) * 100);
    const isExceeded = dept.actual > dept.target;
    
    const block = document.createElement("div");
    block.style.margin = "8px 0";
    block.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
        <span style="font-weight:600; color:var(--white);">${dept.name}</span>
        <span style="font-size:11px; color:${isExceeded ? '#FF7B7B' : 'var(--text-muted)'};">
          ${dept.actual.toLocaleString()} / ${dept.target.toLocaleString()} kg
        </span>
      </div>
      <div style="position:relative; height:8px; background:rgba(255,255,255,0.04); border-radius:4px; overflow:visible;">
        <!-- Target Line marker -->
        <div style="position:absolute; left:${targetWidth}%; top:-4px; width:2px; height:16px; background:#E9A130; z-index:2; border-radius:1px;" title="Target Limit"></div>
        <!-- Actual Fill bar -->
        <div style="width:${actualWidth}%; height:100%; background-color:${isExceeded ? '#FF7B7B' : 'var(--primary-green)'}; border-radius:4px; transition: width 0.4s ease;"></div>
      </div>
    `;
    container.appendChild(block);
  });
}

// ---------------- ROW 4 DONUT BREAKDOWN ----------------
function renderDonutBreakdown() {
  const container = document.getElementById("chart-donut-categories");
  const legend = document.getElementById("donut-legend");
  if (!container || !legend) return;
  
  const data = [
    { name: "Fleet Diesel", value: 3216, color: "#875A7B" },
    { name: "Electricity", value: 7225, color: "#00A09D" },
    { name: "Manufacturing", value: 3700, color: "#E9A130" },
    { name: "Travel Flights", value: 180, color: "#3DBBFF" },
    { name: "Office Waste", value: 200, color: "#2ECC71" }
  ];
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulatedPercent = 0;
  let circlesHtml = "";
  legend.innerHTML = "";
  
  data.forEach(item => {
    const percent = total > 0 ? (item.value / total) * 100 : 0;
    
    // We draw segment rings using stroke-dasharray and stroke-dashoffset
    const radius = 50;
    const circumference = 2 * Math.PI * radius; // ~314.15
    const strokeDash = (percent / 100) * circumference;
    const strokeOffset = circumference - ((accumulatedPercent / 100) * circumference);
    
    circlesHtml += `
      <circle cx="80" cy="80" r="${radius}" fill="none" stroke="${item.color}" 
              stroke-width="14" stroke-dasharray="${strokeDash} ${circumference - strokeDash}" 
              stroke-dashoffset="${strokeOffset}" transform="rotate(-90 80 80)" />
    `;
    accumulatedPercent += percent;
    
    // Add Legend block
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "space-between";
    div.style.fontSize = "11px";
    div.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="width:8px; height:8px; border-radius:50%; background-color:${item.color};"></span>
        <span style="color:var(--white);">${item.name}</span>
      </div>
      <span style="color:var(--text-muted); font-weight:600;">${Math.round(percent)}%</span>
    `;
    legend.appendChild(div);
  });
  
  container.innerHTML = `
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r="50" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="14" />
      ${circlesHtml}
      <circle cx="80" cy="80" r="40" fill="var(--bg-dark)" />
      <text x="80" y="84" fill="var(--white)" font-size="10" font-weight="700" text-anchor="middle">Scope Emissions</text>
    </svg>
  `;
}

// ---------------- ROW 4 CARBON HEATMAP MATRIX ----------------
function renderHeatmapGrid() {
  const container = document.getElementById("grid-carbon-heatmap");
  if (!container) return;
  container.innerHTML = "";
  
  const heatmapData = [
    { dept: "Manufacturing", level: "High", value: "7,225 kg", cssClass: "heatmap-high" },
    { dept: "Logistics", level: "Medium", value: "3,216 kg", cssClass: "heatmap-med" },
    { dept: "Sales & Mktg", level: "Low", value: "180 kg", cssClass: "heatmap-low" },
    { dept: "Corporate", level: "Medium", value: "3,700 kg", cssClass: "heatmap-med" },
    { dept: "Research & Dev", level: "Low", value: "0 kg", cssClass: "heatmap-low" },
    { dept: "Human Resources", level: "Low", value: "0 kg", cssClass: "heatmap-low" }
  ];
  
  heatmapData.forEach(item => {
    const card = document.createElement("div");
    card.className = `heatmap-card ${item.cssClass}`;
    card.innerHTML = `
      <div style="font-size:10px; text-transform:uppercase; opacity:0.7;">${item.dept}</div>
      <div style="font-size:14px; font-weight:700; margin-top:4px;">${item.value}</div>
      <div style="font-size:9px; font-weight:600; opacity:0.8; margin-top:2px;">Risk: ${item.level}</div>
    `;
    container.appendChild(card);
  });
}

// ---------------- ROW 5 INDIA OPERATIONS MAP ----------------
function renderIndiaMap() {
  const container = document.getElementById("map-india-container");
  if (!container) return;
  
  // Render stylized background path outline of India
  const indiaOutline = `M 170 30 L 195 45 L 205 60 L 220 70 L 210 100 L 230 110 L 245 130 L 265 145 L 285 140 L 310 170 L 305 190 L 280 205 L 270 230 L 230 250 L 220 280 L 210 320 L 190 350 L 180 320 L 175 295 L 160 270 L 140 250 L 115 235 L 110 215 L 125 195 L 130 175 L 160 160 Z`;
  
  let nodesHtml = "";
  for (const [key, node] of Object.entries(mapLocations)) {
    const isActive = envPageState.selectedLocationKey === key;
    const nodeColor = node.status === "Warning" ? "#FF7B7B" : "var(--primary-green)";
    
    nodesHtml += `
      <g>
        <!-- Pulsing radial beacon background -->
        <circle cx="${node.x}" cy="${node.y}" r="${isActive ? 12 : 7}" fill="${nodeColor}" opacity="0.18" style="animation: pulse 2s infinite;" />
        <!-- Main node point -->
        <circle cx="${node.x}" cy="${node.y}" r="${isActive ? 6 : 4.5}" fill="${nodeColor}" stroke="var(--bg-dark)" stroke-width="1.5" 
                class="map-node" onclick="selectMapLocation('${key}')" />
      </g>
    `;
  }
  
  container.innerHTML = `
    <svg width="100%" height="340" viewBox="0 0 360 400" style="overflow:visible;">
      <!-- Gridlines -->
      <g stroke="rgba(255,255,255,0.03)" stroke-width="0.5">
        <line x1="0" y1="100" x2="360" y2="100" />
        <line x1="0" y1="200" x2="360" y2="200" />
        <line x1="0" y1="300" x2="360" y2="300" />
        <line x1="100" y1="0" x2="100" y2="400" />
        <line x1="200" y1="0" x2="200" y2="400" />
        <line x1="300" y1="0" x2="300" y2="400" />
      </g>
      <!-- Stylized Outline Polygon representing India map contours -->
      <path d="${indiaOutline}" class="map-india-path" />
      ${nodesHtml}
    </svg>
  `;
  
  // Redraw detail card next to map
  updateMapDetailCard();
}

function selectMapLocation(key) {
  envPageState.selectedLocationKey = key;
  renderIndiaMap();
}

function updateMapDetailCard() {
  const container = document.getElementById("map-detail-card");
  if (!container) return;
  
  const key = envPageState.selectedLocationKey;
  if (!key || !mapLocations[key]) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 0; color:var(--text-muted);">
        <i data-lucide="map-pin" style="width:36px; height:36px; color:var(--text-muted); margin-bottom:12px;"></i>
        <p style="font-size:13px;">Click a location node on the map to review real-time Environmental parameters</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }
  
  const loc = mapLocations[key];
  const severityColor = loc.risk === "High" ? "#FF7B7B" : (loc.risk === "Medium" ? "#E9A130" : "#2ECC71");
  
  container.innerHTML = `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; border-bottom:1px solid var(--border-subtle); padding-bottom:10px;">
        <div>
          <strong style="font-size:15px; color:var(--white); display:block;">${loc.name}</strong>
          <span style="font-size:11px; color:var(--text-muted);">${loc.type} Node | Active Station</span>
        </div>
        <span class="pill" style="border-color:${severityColor}; color:${severityColor}; font-size:11px; padding:2px 8px;">
          Risk: ${loc.risk}
        </span>
      </div>
      <div class="grid-12" style="gap:10px; font-size:13px;">
        <div class="col-6" style="margin-bottom:8px;">
          <span style="font-size:11px; color:var(--text-muted); display:block;">Current AQI Index</span>
          <strong style="color:${loc.aqi > 100 ? '#FF7B7B' : 'var(--primary-green)'};">${loc.aqi}</strong>
        </div>
        <div class="col-6" style="margin-bottom:8px;">
          <span style="font-size:11px; color:var(--text-muted); display:block;">Tomorrow Forecast</span>
          <strong style="color:var(--white);">${loc.predAqi} AQI</strong>
        </div>
        <div class="col-12" style="margin-bottom:8px;">
          <span style="font-size:11px; color:var(--text-muted); display:block;">Aggregated Scope Emissions</span>
          <strong style="color:var(--white); font-size:15px;">${loc.emissions.toLocaleString()} kg CO2e</strong>
        </div>
      </div>
    </div>
    
    <div style="border-top:1px solid var(--border-subtle); padding-top:10px; margin-top:12px; display:flex; justify-content:space-between;">
      <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="alert('Initiating ERP telemetry pull from ${loc.name}...')">
        <i data-lucide="refresh-cw" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:3px;"></i> Sync Logs
      </button>
      <button class="btn btn-primary" style="padding:4px 10px; font-size:11px; background:var(--primary-green); color:var(--bg-dark); border:none;" onclick="openModal('log-carbon-modal')">
        Log Data
      </button>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

// ---------------- ROW 6 SUSTAINABILITY GOALS DETAILS ----------------
function renderDetailedGoals() {
  const container = document.getElementById("goals-detailed-grid");
  if (!container) return;
  container.innerHTML = "";
  
  if (!appState.goals) {
    appState.goals = [
      { name: "Reduce Scope 1 & 2 Fleet Carbon", current: 24500, target: 20000, unit: "kg CO2e", deadline: "2026-12-31", owner: "Environmental Manager", priority: "High", compEst: "Dec 2026", status: "Active" }
    ];
  }
  
  appState.goals.forEach(goal => {
    const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
    const priColor = goal.priority === "High" ? "#FF7B7B" : (goal.priority === "Medium" ? "#E9A130" : "#3DBBFF");
    
    const card = document.createElement("div");
    card.className = "card col-6 hover-elevated";
    card.style.padding = "16px";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
        <div>
          <strong style="font-size:14px; color:var(--white);">${goal.name}</strong>
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Owner: <strong>${goal.owner}</strong></div>
        </div>
        <span class="pill" style="border-color:${priColor}; color:${priColor}; font-size:10px; padding:1px 6px;">${goal.priority}</span>
      </div>
      <div style="font-size:16px; font-weight:700; color:var(--white); margin-bottom:6px;">
        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()} <span style="font-size:11px; color:var(--text-muted);">${goal.unit}</span>
      </div>
      <div style="margin: 8px 0;">
        <div style="background-color: var(--gray); height: 6px; border-radius: 3px; position: relative;">
          <div style="background-color: var(--primary-green); width: ${percentage}%; height: 100%; border-radius: 3px; transition: width 0.4s ease;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:6px;">
          <span>Progress: <strong>${percentage}%</strong></span>
          <span>Target Deadline: <strong>${goal.deadline}</strong></span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ---------------- ROW 7 PAGINATED RECENT TRANSACTIONS LEDGER ----------------
function getFilteredTransactions() {
  let trans = [...appState.carbonTransactions];
  
  // Date filter
  const dateFilter = document.getElementById("env-filter-date")?.value || "all";
  if (dateFilter === "this-month") {
    // Current month is July 2026 in mockup logs
    trans = trans.filter(tr => tr.date.startsWith("2026-07"));
  } else if (dateFilter === "last-30") {
    trans = trans.filter(tr => {
      const diffTime = Math.abs(new Date("2026-07-12") - new Date(tr.date));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    });
  } else if (dateFilter === "q2") {
    trans = trans.filter(tr => {
      const m = new Date(tr.date).getMonth(); // 0-indexed: April(3) to June(5)
      return m >= 3 && m <= 5;
    });
  }
  
  // Dept filter
  const deptFilter = document.getElementById("env-filter-dept")?.value || "all";
  if (deptFilter !== "all") {
    const mapping = {
      MFG: "Manufacturing",
      LOG: "Logistics",
      MKT: "Sales",
      RND: "Research",
      CORP: "Corporate"
    };
    const deptName = mapping[deptFilter];
    if (deptName) {
      trans = trans.filter(tr => tr.department.toLowerCase().includes(deptName.toLowerCase()));
    }
  }
  
  // Search filter
  const searchInput = document.getElementById("env-search-input")?.value || "";
  if (searchInput.trim()) {
    const q = searchInput.toLowerCase();
    trans = trans.filter(tr => 
      tr.department.toLowerCase().includes(q) || 
      tr.category.toLowerCase().includes(q) || 
      tr.desc.toLowerCase().includes(q)
    );
  }
  
  // Sorting
  trans.sort((a, b) => {
    let valA = a[envPageState.sortBy];
    let valB = b[envPageState.sortBy];
    
    if (envPageState.sortBy === 'date') {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    
    if (valA < valB) return envPageState.sortDesc ? 1 : -1;
    if (valA > valB) return envPageState.sortDesc ? -1 : 1;
    return 0;
  });
  
  return trans;
}

function handleEnvFilterChange() {
  envPageState.page = 1; // Reset to page 1 on filter trigger
  renderEnvironmental();
}

function sortTransactions(field) {
  if (envPageState.sortBy === field) {
    envPageState.sortDesc = !envPageState.sortDesc;
  } else {
    envPageState.sortBy = field;
    envPageState.sortDesc = true;
  }
  renderEnvironmental();
}

function toggleSelectAllTransactions(chkAll) {
  const isChecked = chkAll.checked;
  const filtered = getFilteredTransactions();
  
  if (isChecked) {
    envPageState.selectedTransactions = filtered.map((_, idx) => idx);
  } else {
    envPageState.selectedTransactions = [];
  }
  
  document.getElementById("btn-bulk-delete").disabled = envPageState.selectedTransactions.length === 0;
  renderRecentTransactionsLedger();
}

function handleSelectRow(idx, chk) {
  if (chk.checked) {
    if (!envPageState.selectedTransactions.includes(idx)) envPageState.selectedTransactions.push(idx);
  } else {
    envPageState.selectedTransactions = envPageState.selectedTransactions.filter(item => item !== idx);
  }
  document.getElementById("btn-bulk-delete").disabled = envPageState.selectedTransactions.length === 0;
}

function handleBulkDelete() {
  const filtered = getFilteredTransactions();
  // Get transaction items matching the selected indexes
  const itemsToDelete = envPageState.selectedTransactions.map(idx => filtered[idx]);
  
  appState.carbonTransactions = appState.carbonTransactions.filter(tr => !itemsToDelete.includes(tr));
  
  envPageState.selectedTransactions = [];
  document.getElementById("btn-bulk-delete").disabled = true;
  
  addSystemNotification("Selected carbon log items deleted successfully.", "approvals");
  renderEnvironmental();
  saveAppStateTransactional();
}

function renderRecentTransactionsLedger() {
  const tbody = document.getElementById("env-transactions-tbody-detailed");
  const summary = document.getElementById("env-table-summary");
  const pagination = document.getElementById("env-table-pagination");
  if (!tbody || !summary || !pagination) return;
  
  tbody.innerHTML = "";
  
  const filtered = getFilteredTransactions();
  const totalLogs = filtered.length;
  
  const totalPages = Math.ceil(totalLogs / envPageState.pageSize) || 1;
  const startIdx = (envPageState.page - 1) * envPageState.pageSize;
  const endIdx = Math.min(startIdx + envPageState.pageSize, totalLogs);
  
  const pageLogs = filtered.slice(startIdx, endIdx);
  
  pageLogs.forEach((tr, index) => {
    const rawIdx = startIdx + index;
    const isChecked = envPageState.selectedTransactions.includes(rawIdx);
    
    // Scopes mapping
    let scopeBadge = "Scope 1";
    let scopeClass = "pill-low";
    if (tr.category === "Manufacturing" || tr.category === "Electricity") {
      scopeBadge = "Scope 2";
      scopeClass = "pill-medium";
    } else if (tr.category === "Purchase" || tr.category === "Expense") {
      scopeBadge = "Scope 3";
      scopeClass = "pill-under-review";
    }
    
    const row = document.createElement("tr");
    row.style.cursor = "pointer";
    row.innerHTML = `
      <td onclick="event.stopPropagation();"><input type="checkbox" ${isChecked ? 'checked' : ''} onchange="handleSelectRow(${rawIdx}, this)"></td>
      <td style="font-weight:500;">${tr.date}</td>
      <td>${tr.department}</td>
      <td>${tr.category}</td>
      <td>${tr.desc}</td>
      <td><span class="pill ${scopeClass}" style="font-size:10px; padding:2px 6px;">${scopeBadge}</span></td>
      <td style="font-family:monospace; font-size:12px;">Factor: 2.68</td>
      <td style="font-weight:700; color:var(--red); text-align:right;">${tr.value.toLocaleString()} kg CO2e</td>
      <td><span class="pill pill-completed" style="font-size:10px; padding:2px 8px;">Synchronized</span></td>
      <td onclick="event.stopPropagation();">
        <button class="btn btn-secondary" style="padding:4px 8px; font-size:10px;" onclick="deleteSingleTransaction(${rawIdx})">Delete</button>
      </td>
    `;
    row.onclick = () => alert(`Carbon Ledger Entry Details:\nDate: ${tr.date}\nDepartment: ${tr.department}\nCategory: ${tr.category}\nImpact: ${tr.value} kg CO2e\nDescription: ${tr.desc}`);
    tbody.appendChild(row);
  });
  
  summary.textContent = totalLogs > 0 ? `Showing ${startIdx + 1}-${endIdx} of ${totalLogs} logs` : "Showing 0-0 of 0 logs";
  
  // Render pagination buttons
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `btn btn-secondary ${i === envPageState.page ? 'active' : ''}`;
    btn.style.padding = "4px 8px";
    btn.style.fontSize = "11px";
    btn.textContent = i;
    btn.onclick = () => {
      envPageState.page = i;
      renderRecentTransactionsLedger();
    };
    pagination.appendChild(btn);
  }
  if (window.lucide) window.lucide.createIcons();
}

function deleteSingleTransaction(rawIdx) {
  const filtered = getFilteredTransactions();
  const tr = filtered[rawIdx];
  appState.carbonTransactions = appState.carbonTransactions.filter(item => item !== tr);
  
  addSystemNotification("Log item deleted.", "approvals");
  renderEnvironmental();
  saveAppStateTransactional();
}

// ---------------- ROW 8 EMISSION FACTORS CATALOG ----------------
function renderFactorsLibrary() {
  const container = document.getElementById("factors-grid-detailed");
  if (!container) return;
  container.innerHTML = "";
  
  let factors = [...appState.emissionFactors];
  
  // Category Filter
  const cat = document.getElementById("filter-factor-cat")?.value || "all";
  if (cat !== "all") {
    factors = factors.filter(f => f.category.toLowerCase().includes(cat.toLowerCase()));
  }
  
  // Search input
  const q = document.getElementById("search-factor-input")?.value || "";
  if (q.trim()) {
    factors = factors.filter(f => f.source.toLowerCase().includes(q.toLowerCase()) || f.category.toLowerCase().includes(q.toLowerCase()));
  }
  
  factors.forEach(f => {
    const card = document.createElement("div");
    card.className = "card col-3 hover-elevated";
    card.style.padding = "16px";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <span style="font-size:10px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">${f.category}</span>
        <i data-lucide="tag" style="width:12px; height:12px; color:var(--text-muted);"></i>
      </div>
      <h5 style="font-size:14px; font-weight:700; color:var(--white); margin-bottom:4px; line-height:1.2;">${f.source}</h5>
      <div style="font-size:18px; font-weight:800; color:var(--primary-green); margin: 6px 0;">
        ${f.factor} <span style="font-size:11px; color:var(--text-muted); font-weight:normal;">kg CO2e / ${f.unit}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:8px; margin-top:8px; font-size:10px; color:var(--text-muted);">
        <span>Source: IPCC 2026</span>
        <button class="btn btn-secondary" style="padding:2px 6px; font-size:9px;" onclick="alert('Edit Emission Factor logic is gated to Administrator profiles')">Edit</button>
      </div>
    `;
    container.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
}

// ---------------- ROW 10 POLLUTANTS MATRIX PROGRESS BARS ----------------
function renderPollutantLevels() {
  const container = document.getElementById("pollutant-levels-container");
  if (!container) return;
  container.innerHTML = "";
  
  const pollutants = [
    { name: "PM2.5", value: 34, limit: 60, unit: "µg/m³", trend: "Stable" },
    { name: "PM10", value: 85, limit: 100, unit: "µg/m³", trend: "Worsening" },
    { name: "NO2", value: 24, limit: 80, unit: "ppb", trend: "Improving" },
    { name: "SO2", value: 12, limit: 40, unit: "ppb", trend: "Stable" },
    { name: "CO", value: 0.8, limit: 2.0, unit: "ppm", trend: "Stable" },
    { name: "O3", value: 38, limit: 100, unit: "ppb", trend: "Worsening" }
  ];
  
  pollutants.forEach(pol => {
    const percent = Math.min(100, (pol.value / pol.limit) * 100);
    const isCritical = percent > 80;
    const progressColor = isCritical ? "#FF7B7B" : (percent > 50 ? "#E9A130" : "var(--primary-green)");
    
    const block = document.createElement("div");
    block.style.margin = "6px 0";
    block.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:2px;">
        <span style="font-weight:600; color:var(--white);">${pol.name}</span>
        <span style="color:var(--text-muted);">${pol.value} / ${pol.limit} ${pol.unit} (${pol.trend})</span>
      </div>
      <div style="height:5px; background:rgba(255,255,255,0.03); border-radius:3px; overflow:hidden;">
        <div style="width:${percent}%; height:100%; background-color:${progressColor}; border-radius:3px;"></div>
      </div>
    `;
    container.appendChild(block);
  });
}

// ---------------- ROW 11 SMART ALERTS LIST ----------------
function renderAlertsStack() {
  const container = document.getElementById("env-alerts-list");
  if (!container) return;
  container.innerHTML = "";
  
  const alerts = [
    { text: "Manufacturing exceeded daily emission threshold (7,225 kg registered).", pri: "High", color: "#FF7B7B" },
    { text: "AQI predicted to worsen in Delhi Factory Hub due to particulates.", pri: "Medium", color: "#E9A130" },
    { text: "Carbon reduction target (Scope 1 reduction) is behind schedule.", pri: "Medium", color: "#E9A130" },
    { text: "Scope 3 supplier compliance certificates checklist is pending review.", pri: "Low", color: "#3DBBFF" }
  ];
  
  alerts.forEach(al => {
    const alertDiv = document.createElement("div");
    alertDiv.style.padding = "10px 14px";
    alertDiv.style.borderRadius = "6px";
    alertDiv.style.border = `1px solid rgba(255,255,255,0.06)`;
    alertDiv.style.borderLeft = `3px solid ${al.color}`;
    alertDiv.style.backgroundColor = "rgba(0,0,0,0.1)";
    alertDiv.style.fontSize = "12px";
    alertDiv.style.display = "flex";
    alertDiv.style.alignItems = "center";
    alertDiv.style.justifyContent = "space-between";
    alertDiv.innerHTML = `
      <span style="color:#E0E0E0; line-height:1.4;">${al.text}</span>
      <span style="color:${al.color}; font-weight:700; font-size:10px; text-transform:uppercase; margin-left:12px;">${al.pri}</span>
    `;
    container.appendChild(alertDiv);
  });
}

// ---------------- ROW 12 HISTORY ACTIVITY TIMELINE ----------------
function renderActivityTimeline() {
  const container = document.getElementById("env-timeline-container");
  if (!container) return;
  container.innerHTML = "";
  
  const timeline = [
    { time: "10:24 AM", desc: "Carbon transaction logged for Fleet diesel fuel refill", icon: "plus", color: "var(--primary-green)" },
    { time: "Yesterday", desc: "Anti-corruption corporate policy signed by Amit Mehta", icon: "file-signature", color: "#00A09D" },
    { time: "3 days ago", desc: "Emission factor updated for Manufacturing Grid Electricity", icon: "refresh-cw", color: "#3DBBFF" },
    { time: "4 days ago", desc: "Weekly ERP database telemetry sync complete", icon: "database", color: "#2ECC71" },
    { time: "Last week", desc: "Jupyter linear regression score prediction model calibrated", icon: "sparkles", color: "#875A7B" }
  ];
  
  timeline.forEach(item => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.gap = "12px";
    div.style.marginBottom = "14px";
    div.style.position = "relative";
    div.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center;">
        <span style="width:20px; height:20px; border-radius:50%; background-color:rgba(0,0,0,0.2); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; z-index:2;">
          <i data-lucide="${item.icon}" style="width:10px; height:10px; color:${item.color};"></i>
        </span>
        <div style="width:1px; flex:1; background:var(--border-subtle); margin-top:4px;"></div>
      </div>
      <div>
        <div style="font-size:12px; font-weight:600; color:var(--white);">${item.desc}</div>
        <span style="font-size:10px; color:var(--text-muted);">${item.time}</span>
      </div>
    `;
    container.appendChild(div);
  });
  if (window.lucide) window.lucide.createIcons();
}

// ---------------- ROW 13 IMPACT ACHIEVEMENTS METRICS ----------------
function renderAchievementsMilestones() {
  const container = document.getElementById("env-achievements-grid");
  if (!container) return;
  container.innerHTML = "";
  
  const achievements = [
    { title: "Carbon Saved", value: "8,450 kg", desc: "Offset via solar grid conversion", icon: "leaf", color: "var(--primary-green)" },
    { title: "Trees Equivalent", value: "422 Trees", desc: "Equivalent absorption value", icon: "trees", color: "#2ECC71" },
    { title: "Energy Conserved", value: "18,400 kWh", desc: "Reduced monitor idle hours", icon: "zap", color: "#E9A130" },
    { title: "Renewable Usage", value: "48.2 %", desc: "Solar grid total component", icon: "sun", color: "#3DBBFF" },
    { title: "Waste Recycled", value: "1,240 kg", desc: "Recycled office waste roundups", icon: "trash-2", color: "#875A7B" }
  ];
  
  achievements.forEach(item => {
    const card = document.createElement("div");
    card.className = "card col-2 hover-elevated";
    card.style.padding = "16px";
    card.style.flex = "1";
    card.style.minWidth = "160px";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <span style="font-size:11px; color:var(--text-muted); font-weight:600;">${item.title}</span>
        <i data-lucide="${item.icon}" style="width:14px; height:14px; color:${item.color};"></i>
      </div>
      <strong style="font-size:18px; color:var(--white); display:block; margin: 4px 0;">${item.value}</strong>
      <span style="font-size:10px; color:var(--text-muted); line-height:1.2; display:block;">${item.desc}</span>
    `;
    container.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
}

// ---------------- ROW 14 ANALYTICS DEEP DIVE STATION ----------------
function renderAnalyticsDeepDive() {
  const container = document.getElementById("analytics-deepdive-chart");
  if (!container) return;
  
  const width = container.clientWidth || 600;
  const height = 200;
  
  let barsHtml = "";
  let labelsHtml = "";
  
  if (envPageState.analyticsView === "dept") {
    const data = [
      { label: "MFG", val: 7225, color: "#875A7B" },
      { label: "LOG", val: 3216, color: "#00A09D" },
      { label: "MKT", val: 180, color: "#E9A130" },
      { label: "RND", val: 0, color: "#3DBBFF" },
      { label: "CORP", val: 3700, color: "#2ECC71" }
    ];
    const maxVal = 8000;
    
    data.forEach((item, idx) => {
      const barWidth = 32;
      const x = 50 + idx * ((width - 100) / (data.length - 1 || 1));
      const barHeight = ((item.val / maxVal) * (height - 60)) || 2;
      const y = height - 40 - barHeight;
      
      barsHtml += `
        <rect x="${x - barWidth/2}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${item.color}" rx="3" class="map-node" onclick="alert('${item.label}: ${item.val} kg')" />
      `;
      labelsHtml += `
        <text x="${x}" y="${height - 20}" fill="var(--text-muted)" font-size="10" text-anchor="middle">${item.label}</text>
      `;
    });
  } else if (envPageState.analyticsView === "month") {
    const data = [
      { label: "May", val: 4200 }, { label: "Jun", val: 3700 }, { label: "Jul", val: 3100 }
    ];
    const maxVal = 5000;
    
    data.forEach((item, idx) => {
      const barWidth = 40;
      const x = 100 + idx * ((width - 200) / (data.length - 1 || 1));
      const barHeight = ((item.val / maxVal) * (height - 60));
      const y = height - 40 - barHeight;
      
      barsHtml += `
        <rect x="${x - barWidth/2}" y="${y}" width="${barWidth}" height="${barHeight}" fill="var(--primary-green)" rx="4" class="map-node" onclick="alert('${item.label}: ${item.val} kg')" />
      `;
      labelsHtml += `
        <text x="${x}" y="${height - 20}" fill="var(--text-muted)" font-size="10" text-anchor="middle">${item.label}</text>
      `;
    });
  } else {
    // By Source
    const data = [
      { label: "Fleet", val: 3216 }, { label: "Electric", val: 7225 }, { label: "Material", val: 3700 }
    ];
    const maxVal = 8000;
    
    data.forEach((item, idx) => {
      const barWidth = 40;
      const x = 100 + idx * ((width - 200) / (data.length - 1 || 1));
      const barHeight = ((item.val / maxVal) * (height - 60));
      const y = height - 40 - barHeight;
      
      barsHtml += `
        <rect x="${x - barWidth/2}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#3DBBFF" rx="4" class="map-node" onclick="alert('${item.label}: ${item.val} kg')" />
      `;
      labelsHtml += `
        <text x="${x}" y="${height - 20}" fill="var(--text-muted)" font-size="10" text-anchor="middle">${item.label}</text>
      `;
    });
  }
  
  container.innerHTML = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
      <line x1="${40}" y1="${height - 40}" x2="${width - 40}" y2="${height - 40}" stroke="var(--border-subtle)" />
      ${barsHtml}
      ${labelsHtml}
    </svg>
  `;
}

function toggleAnalyticsView(view) {
  envPageState.analyticsView = view;
  document.querySelectorAll("#btn-ana-dept, #btn-ana-month, #btn-ana-source").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById(`btn-ana-${view}`).classList.add("active");
  renderAnalyticsDeepDive();
}

// ---------------- BUSINESS LOGIC SIMULATORS ----------------
function calculateEmissions() {
  alert("Initiating python ML model coefficients grid scan...\nRecalculating pollutant impacts for active Scope 1 & 2 items...");
  // Re-run backend sync saving logic to update scores
  saveAppStateTransactional();
  addSystemNotification("Recalculation complete. Env scores successfully refreshed.", "compliance");
}

function syncERPData() {
  alert("Initiating ERP system synchronization...\nImporting log entries from Manufacturing ledger...");
  addSystemNotification("ERP telemetry synchronization complete. 4 logs synchronized.", "compliance");
  renderEnvironmental();
}


function renderMiniDonut(containerId, percentage, color = "var(--primary-green)", labelText = "") {
  const container = document.getElementById(containerId);
  if (!container) return;
  const radius = 32;
  const circumference = 2 * Math.PI * radius; // ~201
  const strokeDash = (percentage / 100) * circumference;
  
  container.innerHTML = `
    <svg width="84" height="84" viewBox="0 0 84 84">
      <circle cx="42" cy="42" r="${radius}" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="7" />
      <circle cx="42" cy="42" r="${radius}" fill="none" stroke="${color}" 
              stroke-width="7" stroke-dasharray="${strokeDash} ${circumference - strokeDash}" 
              stroke-dashoffset="${circumference}" transform="rotate(-90 42 42)" style="transition: stroke-dasharray 0.4s ease;" />
      <text x="42" y="46" fill="var(--white)" font-size="11" font-weight="700" text-anchor="middle">${percentage}%</text>
    </svg>
  `;
}

function drawRadarChart(containerId, dataValues, labels) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const width = container.clientWidth || 300;
  const height = 240;
  const centerX = width / 2;
  const centerY = height / 2 - 10;
  const maxRadius = Math.min(centerX, centerY) - 30;
  const numAxes = dataValues.length;
  
  let gridHtml = "";
  let axesHtml = "";
  
  // Draw concentric polygon rings for grid (20%, 40%, 60%, 80%, 100%)
  for (let r = 1; r <= 5; r++) {
    const currentRadius = maxRadius * (r / 5);
    const ringPoints = [];
    for (let i = 0; i < numAxes; i++) {
      const angle = i * (2 * Math.PI / numAxes) - Math.PI / 2;
      const x = centerX + Math.cos(angle) * currentRadius;
      const y = centerY + Math.sin(angle) * currentRadius;
      ringPoints.push(`${x},${y}`);
    }
    gridHtml += `<polygon points="${ringPoints.join(" ")}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.8" />`;
  }
  
  // Draw axes lines and labels
  const dataPoints = [];
  for (let i = 0; i < numAxes; i++) {
    const angle = i * (2 * Math.PI / numAxes) - Math.PI / 2;
    const endX = centerX + Math.cos(angle) * maxRadius;
    const endY = centerY + Math.sin(angle) * maxRadius;
    axesHtml += `<line x1="${centerX}" y1="${centerY}" x2="${endX}" y2="${endY}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />`;
    
    // Label placement
    const textDist = maxRadius + 18;
    const textX = centerX + Math.cos(angle) * textDist;
    const textY = centerY + Math.sin(angle) * textDist + 3;
    const anchor = Math.abs(Math.cos(angle)) < 0.1 ? "middle" : (Math.cos(angle) > 0 ? "start" : "end");
    axesHtml += `<text x="${textX}" y="${textY}" fill="var(--text-muted)" font-size="9" text-anchor="${anchor}">${labels[i]}</text>`;
    
    // Data point
    const valueRadius = maxRadius * (dataValues[i] / 100);
    const px = centerX + Math.cos(angle) * valueRadius;
    const py = centerY + Math.sin(angle) * valueRadius;
    dataPoints.push(`${px},${py}`);
    
    // Tiny dot marker
    axesHtml += `<circle cx="${px}" cy="${py}" r="3" fill="#00A09D" />`;
  }
  
  container.innerHTML = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
      ${gridHtml}
      ${axesHtml}
      <polygon points="${dataPoints.join(" ")}" fill="rgba(0, 160, 157, 0.18)" stroke="#00A09D" stroke-width="2" class="radar-poly" />
    </svg>
  `;
}

function getEmployeeDept(name) {
  if (name.includes("Priya")) return "Manufacturing";
  if (name.includes("Rajiv")) return "Logistics";
  if (name.includes("Amit")) return "R&D";
  if (name.includes("Elena")) return "Corporate";
  if (name.includes("Sarah")) return "Sales & Marketing";
  return "Corporate";
}

function renderSocial() {
  const filteredPart = getFilteredSocParticipation();
  
  // KPI Calculations
  const totalActivities = appState.csrActivities.length;
  document.getElementById("kpi-soc-activities").textContent = totalActivities;
  renderSparkline("sparkline-soc-activities", [4, 5, 5, 6, 7, 7, totalActivities], "#E9A130");

  const completedPart = appState.employeeParticipation.filter(p => p.status === "Completed").length;
  const participationRate = Math.round((completedPart / 6) * 100); // 6 baseline slots
  document.getElementById("kpi-soc-participation").textContent = `${participationRate}%`;
  renderSparkline("sparkline-soc-participation", [58, 62, 65, 68, 73, 76, participationRate], "var(--primary-green)");

  const volunteerHours = appState.employeeParticipation
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + (Math.round(p.points / 25) || 4), 0);
  document.getElementById("kpi-soc-hours").textContent = `${volunteerHours} hrs`;
  renderSparkline("sparkline-soc-hours", [12, 18, 24, 28, 36, 42, volunteerHours], "#3DBBFF");

  document.getElementById("kpi-soc-training").textContent = "92%";
  renderSparkline("sparkline-soc-training", [85, 87, 88, 87, 90, 91, 92], "#00A09D");

  document.getElementById("kpi-soc-engagement").textContent = "83/100";
  renderSparkline("sparkline-soc-engagement", [78, 79, 81, 80, 82, 83, 83], "#2ECC71");

  const depts = Object.keys(appState.scores.departments);
  const avgSocScore = Math.round(depts.reduce((sum, key) => sum + appState.scores.departments[key].social, 0) / depts.length);
  document.getElementById("kpi-soc-esg").textContent = `${avgSocScore}/100`;
  renderSparkline("sparkline-soc-esg", [71, 73, 75, 74, 75, 76, avgSocScore], "#FF7B7B");

  // ROW 2: AI Recommendation text
  const aiText = document.getElementById("ai-soc-recommendation-text");
  const aiBurnout = document.getElementById("ai-soc-burnout");
  const aiForecast = document.getElementById("ai-soc-forecast");
  const aiLowest = document.getElementById("ai-soc-lowest-dept");
  const aiRec = document.getElementById("ai-soc-recommended-campaign");
  
  if (volunteerHours < 25) {
    aiText.textContent = `"Engineering and Manufacturing CSR participation has dropped by 14% this quarter. Launching a localized carbon-offsetting challenge could increase overall volunteer output by 24 hours."`;
    aiBurnout.textContent = "Moderate (28%)";
    aiForecast.textContent = "65% participation";
    aiLowest.textContent = "Manufacturing";
    aiRec.textContent = "Tree Planting";
  } else {
    aiText.textContent = `"Employee satisfaction ratings are healthy. R&D division engagement shows an improvement of 4.2% following the Reforestation milestone completion. Recommended action: schedule quarterly checkins."`;
    aiBurnout.textContent = "Low (14%)";
    aiForecast.textContent = "88% participation";
    aiLowest.textContent = "Logistics";
    aiRec.textContent = "Waste Roundup";
  }

  // ROW 3: Monthly trend chart & Department horizontal bars
  renderSocTrendChart();
  renderSocDeptBarChart();

  // ROW 4: Diversity donuts & Heatmap
  renderMiniDonut("chart-soc-donut-gender", 44, "var(--primary-green)");
  renderMiniDonut("chart-soc-donut-age", 58, "#00A09D");
  renderMiniDonut("chart-soc-donut-experience", 72, "#E9A130");
  renderMiniDonut("chart-soc-donut-location", 85, "#3DBBFF");
  renderEngagementHeatmap();

  // ROW 5: CSR activity explorer
  renderCSRActivityExplorer();

  // ROW 6: Community impact counters
  renderCommunityImpactCounters();

  // ROW 7: Training panels
  renderTrainingPanels();

  // ROW 8: Peer Recognition horizontal scroll list
  renderRecognitionWall();

  // ROW 9: Leaderboards podium & rankings
  renderLeaderboards();

  // ROW 10: paginated recent participation ledger
  renderRecentParticipationLedger();

  // ROW 11: Pending approvals verification desk
  renderApprovalsDesk();

  // ROW 12: Sentiment Radar chart
  drawRadarChart("chart-soc-sentiment-radar", [85, 78, 82, 88, 80], ["Satisfaction", "Work-Life", "Wellbeing", "Happiness", "Engagement"]);
  renderSentimentSummaryList();

  // ROW 13: Social goals progress
  renderSocialGoals();

  // ROW 14: Alerts stack
  renderSocialAlertsStack();

  // ROW 15: Timeline log
  renderSocialTimeline();

  if (window.lucide) window.lucide.createIcons();
}

// ---------------- ROW 3 RENDERERS ----------------
function renderSocTrendChart() {
  const container = document.getElementById("chart-soc-monthly-emissions");
  if (!container) return;
  const width = container.clientWidth || 600;
  const height = 260;
  
  let dataPoints = [42, 38, 55, 68, 72, 80, 85, 92, 88, 95, 105, 110];
  let labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  if (socPageState.chartRange === 'week') {
    dataPoints = [12, 18, 15, 22, 28, 25, 30];
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  } else if (socPageState.chartRange === 'quarter') {
    dataPoints = [135, 220, 265, 310];
    labels = ["Q1", "Q2", "Q3", "Q4"];
  }
  
  const maxVal = Math.max(...dataPoints) * 1.15;
  const padding = 40;
  
  let polylinePoints = "";
  let gridLines = "";
  let labelsHtml = "";
  let fillPoints = `40,${height - padding} `;
  
  // Draw horizontal Y gridlines
  for (let i = 0; i <= 4; i++) {
    const yVal = Math.round((maxVal / 4) * i);
    const y = height - padding - ((yVal / maxVal) * (height - 2 * padding));
    gridLines += `
      <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3,3" />
      <text x="${padding - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${yVal}</text>
    `;
  }
  
  dataPoints.forEach((val, idx) => {
    const x = padding + (idx / (dataPoints.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val / maxVal) * (height - 2 * padding));
    polylinePoints += `${x},${y} `;
    fillPoints += `${x},${y} `;
    
    labelsHtml += `
      <text x="${x}" y="${height - padding + 16}" fill="var(--text-muted)" font-size="10" text-anchor="middle">${labels[idx]}</text>
      <circle cx="${x}" cy="${y}" r="3.5" fill="var(--primary-green)" stroke="var(--bg-dark)" stroke-width="1.5" class="map-node" onclick="alert('Participants logged: ${val}')" />
    `;
  });
  fillPoints += `${width - padding},${height - padding}`;
  
  container.innerHTML = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
      <defs>
        <linearGradient id="area-grad-soc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary-green)" stop-opacity="0.15" />
          <stop offset="100%" stop-color="var(--primary-green)" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${gridLines}
      <polygon points="${fillPoints}" fill="url(#area-grad-soc)" />
      <polyline points="${polylinePoints}" fill="none" stroke="var(--primary-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      ${labelsHtml}
    </svg>
  `;
}

function toggleSocChartRange(range) {
  socPageState.chartRange = range;
  document.querySelectorAll("#btn-soc-chart-week, #btn-soc-chart-month, #btn-soc-chart-quarter, #btn-soc-chart-year").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById(`btn-soc-chart-${range}`).classList.add("active");
  renderSocTrendChart();
}

function renderSocDeptBarChart() {
  const container = document.getElementById("chart-soc-dept-comparison");
  if (!container) return;
  container.innerHTML = "";
  
  const deptsData = [
    { name: "Engineering", participants: 18, hours: 72, score: "94%" },
    { name: "Manufacturing", participants: 25, hours: 100, score: "82%" },
    { name: "Sales & Marketing", participants: 12, hours: 48, score: "89%" },
    { name: "Logistics", participants: 8, hours: 32, score: "68%" },
    { name: "Corporate", participants: 10, hours: 40, score: "80%" }
  ];
  
  deptsData.forEach(dept => {
    const maxVal = 120;
    const actualWidth = Math.min(100, (dept.hours / maxVal) * 100);
    
    const block = document.createElement("div");
    block.style.margin = "8px 0";
    block.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
        <span style="font-weight:600; color:var(--white);">${dept.name}</span>
        <span style="font-size:11px; color:var(--text-muted);">
          ${dept.participants} joined | <strong>${dept.hours} hrs</strong> (${dept.score})
        </span>
      </div>
      <div style="height:6px; background:rgba(255,255,255,0.03); border-radius:3px; overflow:hidden;">
        <div style="width:${actualWidth}%; height:100%; background-color:var(--primary-green); border-radius:3px; transition: width 0.4s ease;"></div>
      </div>
    `;
    container.appendChild(block);
  });
}

// ---------------- ROW 4 RENDERERS ----------------
function renderEngagementHeatmap() {
  const container = document.getElementById("grid-soc-engagement-heatmap");
  if (!container) return;
  container.innerHTML = "";
  
  const heatmapData = [
    { dept: "Engineering", rating: "Healthy", score: "90%", cssClass: "heatmap-low" },
    { dept: "Manufacturing", rating: "Moderate", score: "78%", cssClass: "heatmap-med" },
    { dept: "Sales & Mktg", rating: "Healthy", score: "88%", cssClass: "heatmap-low" },
    { dept: "Logistics", rating: "Needs Attention", score: "62%", cssClass: "heatmap-high" },
    { dept: "Corporate", rating: "Moderate", score: "79%", cssClass: "heatmap-med" },
    { dept: "R&D Division", rating: "Healthy", score: "94%", cssClass: "heatmap-low" }
  ];
  
  heatmapData.forEach(item => {
    const card = document.createElement("div");
    card.className = `heatmap-card ${item.cssClass}`;
    card.innerHTML = `
      <div style="font-size:10px; text-transform:uppercase; opacity:0.7;">${item.dept}</div>
      <div style="font-size:14px; font-weight:700; margin-top:4px;">${item.score}</div>
      <div style="font-size:9px; font-weight:600; opacity:0.8; margin-top:2px;">${item.rating}</div>
    `;
    container.appendChild(card);
  });
}

// ---------------- ROW 5 RENDERERS ----------------
function renderCSRActivityExplorer() {
  const container = document.getElementById("soc-csr-explorer-grid");
  if (!container) return;
  container.innerHTML = "";
  
  appState.csrActivities.forEach(csr => {
    const isJoined = socPageState.joinedActivities.includes(csr.id);
    const currentPart = isJoined ? (csr.target - 2) : (csr.target - 3);
    const percent = Math.min(100, Math.round((currentPart / csr.target) * 100));
    
    // Simulate placeholder banner drawing
    const bannerColor = csr.id === "csr1" ? "rgba(0,160,157,0.12)" : "rgba(135,90,123,0.12)";
    
    const card = document.createElement("div");
    card.className = "card col-6 explorer-card";
    card.style.padding = "16px";
    card.innerHTML = `
      <div style="height:110px; background:${bannerColor}; border-radius:8px; border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; margin-bottom:12px; position:relative; overflow:hidden;">
        <span style="font-size:24px; color:var(--white); font-weight:700; opacity:0.25;">CSR CAMPAIGN</span>
        <span class="pill pill-active" style="position:absolute; top:8px; right:8px;">Active</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
        <h5 style="font-size:15px; font-weight:700; color:var(--white);">${csr.title}</h5>
        <span style="font-size:12px; color:var(--primary-green); font-weight:700;">+${csr.xp} XP</span>
      </div>
      <p style="font-size:12px; color:var(--text-muted); line-height:1.4; margin-bottom:12px; min-height:34px;">${csr.desc}</p>
      
      <div style="margin-bottom:12px;">
        <div style="background-color: var(--gray); height: 5px; border-radius: 3px; position: relative;">
          <div style="background-color: var(--primary-green); width: ${percent}%; height: 100%; border-radius: 3px;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:4px;">
          <span>Participants: <strong>${currentPart} / ${csr.target}</strong></span>
          <span>Fill Ratio: <strong>${percent}%</strong></span>
        </div>
      </div>
      
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted); border-top:1px solid var(--border-subtle); padding-top:10px; margin-top:8px;">
        <span>Deadline: <strong>${csr.date}</strong></span>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-secondary" style="padding:4px 8px; font-size:10px;" onclick="favoriteCSR('${csr.id}')">
            <i data-lucide="star" style="width:10px; height:10px; fill:${isJoined ? 'var(--primary-green)' : 'none'};"></i>
          </button>
          <button class="${isJoined ? 'btn btn-secondary' : 'btn btn-primary'}" style="padding:4px 12px; font-size:10px;" onclick="joinCSRActivity('${csr.id}')">
            ${isJoined ? 'Joined ✓' : 'Join Activity'}
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
}

function joinCSRActivity(id) {
  if (!appState.isLoggedIn) {
    alert("Please sign in to join sustainability activities.");
    window.location.href = "login.html";
    return;
  }
  const idx = socPageState.joinedActivities.indexOf(id);
  if (idx > -1) {
    socPageState.joinedActivities.splice(idx, 1);
    addSystemNotification("Left CSR campaign registry.", "approvals");
  } else {
    socPageState.joinedActivities.push(id);
    addSystemNotification("Registered as participant in CSR campaign successfully.", "approvals");
  }
  renderSocial();
  saveAppStateTransactional();
}

function favoriteCSR(id) {
  alert("Initiated favorite sync for CSR ID " + id);
}

// ---------------- ROW 6 IMPACT STAT COUNTERS ----------------
function renderCommunityImpactCounters() {
  const container = document.getElementById("soc-community-impact-grid");
  if (!container) return;
  container.innerHTML = "";
  
  const stats = [
    { title: "Trees Planted", value: "245 Saplings", icon: "leaf", color: "var(--primary-green)" },
    { title: "Meals Distributed", value: "1,200 Meals", icon: "sandwich", color: "#E9A130" },
    { title: "Waste Collected", value: "850 kg Recycled", icon: "trash-2", color: "#3DBBFF" },
    { title: "CO2 Offset from CSR", value: "4,820 kg CO2e", icon: "zap", color: "#FF7B7B" }
  ];
  
  stats.forEach(st => {
    const card = document.createElement("div");
    card.className = "card col-3 hover-elevated";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <span style="font-size:11px; color:var(--text-muted); font-weight:600;">${st.title}</span>
        <i data-lucide="${st.icon}" style="width:14px; height:14px; color:${st.color};"></i>
      </div>
      <strong style="font-size:18px; color:var(--white); display:block; margin: 4px 0;">${st.value}</strong>
      <span style="font-size:9px; color:var(--text-muted);">Cumulative Corporate Impact</span>
    `;
    container.appendChild(card);
  });
}

// ---------------- ROW 7 TRAINING MODULES RENDERER ----------------
function renderTrainingPanels() {
  const pendingContainer = document.getElementById("soc-pending-training-list");
  if (!pendingContainer) return;
  pendingContainer.innerHTML = "";
  
  const courses = [
    { name: "Environmental MSDS Code Safety", hours: "1.5h remaining", type: "Required" },
    { name: "EcoSphere Operations Walkthrough", hours: "Completed", type: "Optional" }
  ];
  
  courses.forEach(c => {
    const isCompleted = c.hours === "Completed";
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.borderRadius = "6px";
    div.style.border = `1px solid var(--border-subtle)`;
    div.style.backgroundColor = "rgba(0,0,0,0.1)";
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.fontSize = "12px";
    div.innerHTML = `
      <div>
        <strong style="color:var(--white); font-size:12px; display:block;">${c.name}</strong>
        <span style="font-size:10px; color:var(--text-muted);">${c.hours}</span>
      </div>
      <span class="pill ${isCompleted ? 'pill-completed' : 'pill-medium'}" style="font-size:9px; padding:1px 6px;">${c.type}</span>
    `;
    pendingContainer.appendChild(div);
  });
  
  // Render dummy SVG bar chart for training completion by department
  const chartContainer = document.getElementById("chart-soc-training-depts");
  if (!chartContainer) return;
  chartContainer.innerHTML = `
    <svg width="100%" height="90" viewBox="0 0 400 90">
      <line x1="20" y1="70" x2="380" y2="70" stroke="var(--border-subtle)" />
      <!-- MFG -->
      <rect x="50" y="20" width="28" height="50" fill="var(--primary-green)" rx="2" />
      <text x="64" y="85" fill="var(--text-muted)" font-size="9" text-anchor="middle">MFG</text>
      <!-- LOG -->
      <rect x="130" y="35" width="28" height="35" fill="#00A09D" rx="2" />
      <text x="144" y="85" fill="var(--text-muted)" font-size="9" text-anchor="middle">LOG</text>
      <!-- RND -->
      <rect x="210" y="10" width="28" height="60" fill="#E9A130" rx="2" />
      <text x="224" y="85" fill="var(--text-muted)" font-size="9" text-anchor="middle">RND</text>
      <!-- CORP -->
      <rect x="290" y="15" width="28" height="55" fill="#3DBBFF" rx="2" />
      <text x="304" y="85" fill="var(--text-muted)" font-size="9" text-anchor="middle">CORP</text>
    </svg>
  `;
}

// ---------------- ROW 8 PEER RECOGNITION WALL ----------------
function renderRecognitionWall() {
  const container = document.getElementById("soc-recognition-scroll");
  if (!container) return;
  container.innerHTML = "";
  
  const peerCards = [
    { employee: "Priya Sharma", achievement: "Reforestation Drive Lead", badge: "Carbon Saver", xp: 150, hours: 6, date: "2026-07-05", dept: "Mfg" },
    { employee: "Amit Mehta", achievement: "Recycled Office Waste", badge: "Zero Waste Hero", xp: 200, hours: 8, date: "2026-07-09", dept: "R&D" },
    { employee: "Rajiv Nair", achievement: "Safe E-Waste Disposal", badge: "Green Shield", xp: 100, hours: 4, date: "2026-07-11", dept: "Logistics" }
  ];
  
  peerCards.forEach(card => {
    const div = document.createElement("div");
    div.className = "recognition-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:24px; height:24px; border-radius:50%; background:var(--primary-green); color:var(--white); font-weight:700; font-size:10px; display:flex; align-items:center; justify-content:center;">
            ${card.employee[0]}
          </div>
          <div>
            <strong style="font-size:12px; color:var(--white); display:block;">${card.employee}</strong>
            <span style="font-size:9px; color:var(--text-muted);">${card.dept} Department</span>
          </div>
        </div>
        <span class="pill pill-completed" style="font-size:9px; padding:1px 6px;">${card.badge}</span>
      </div>
      <p style="font-size:11px; color:#E0E0E0; line-height:1.3; min-height:28px;">"${card.achievement}"</p>
      <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); border-top:1px solid var(--border-subtle); padding-top:6px; margin-top:6px;">
        <span>Hours logged: <strong>${card.hours} hrs</strong></span>
        <span style="color:var(--primary-green);">+${card.xp} XP</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// ---------------- ROW 9 LEADERBOARDS PODIUM RENDERER ----------------
function renderLeaderboards() {
  const container = document.getElementById("soc-leaderboard-podium");
  if (!container) return;
  
  // Top 3 employees mock rankings
  container.innerHTML = `
    <div class="podium-container">
      <!-- 2nd Step -->
      <div class="podium-step podium-second">
        <div class="podium-avatar">AM</div>
        <span style="font-size:11px;">Amit Mehta</span>
        <span style="font-size:10px; font-weight:normal; opacity:0.8;">350 XP</span>
        <span class="podium-label">2nd Place</span>
      </div>
      <!-- 1st Step -->
      <div class="podium-step podium-first">
        <div class="podium-avatar" style="border-color:#FDB339;">PS</div>
        <span style="font-size:11px;">Priya Sharma</span>
        <span style="font-size:10px; font-weight:normal; opacity:0.9;">450 XP</span>
        <span class="podium-label">1st Place</span>
      </div>
      <!-- 3rd Step -->
      <div class="podium-step podium-third">
        <div class="podium-avatar">RN</div>
        <span style="font-size:11px;">Rajiv Nair</span>
        <span style="font-size:10px; font-weight:normal; opacity:0.8;">250 XP</span>
        <span class="podium-label">3rd Place</span>
      </div>
    </div>
  `;
  
  const deptsContainer = document.getElementById("soc-leaderboard-depts");
  if (!deptsContainer) return;
  deptsContainer.innerHTML = "";
  
  const topDepts = [
    { name: "Manufacturing", score: "8,400 CSR XP", status: "Active" },
    { name: "R&D", score: "6,200 CSR XP", status: "Active" },
    { name: "Logistics", score: "4,150 CSR XP", status: "Active" }
  ];
  
  topDepts.forEach((d, idx) => {
    const item = document.createElement("div");
    item.style.display = "flex";
    item.style.justifyContent = "space-between";
    item.style.alignItems = "center";
    item.style.padding = "8px 0";
    item.style.borderBottom = "1px solid var(--border-subtle)";
    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-weight:700; color:var(--text-muted); width:15px;">#${idx + 1}</span>
        <strong style="font-size:13px; color:var(--white);">${d.name}</strong>
      </div>
      <span style="font-size:12px; color:var(--primary-green); font-weight:600;">${d.score}</span>
    `;
    deptsContainer.appendChild(item);
  });
}

// ---------------- ROW 10 RECENT PARTICIPATION LEDGER ----------------
function getFilteredSocParticipation() {
  let list = [...appState.employeeParticipation];
  
  // Date filter
  const dateFilter = document.getElementById("soc-filter-date")?.value || "all";
  if (dateFilter === "this-month") {
    list = list.filter(p => p.date && p.date.startsWith("2026-07"));
  } else if (dateFilter === "last-30") {
    list = list.filter(p => {
      if (!p.date) return false;
      const diffTime = Math.abs(new Date("2026-07-12") - new Date(p.date));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    });
  } else if (dateFilter === "q2") {
    list = list.filter(p => {
      if (!p.date) return false;
      const m = new Date(p.date).getMonth(); // April to June
      return m >= 3 && m <= 5;
    });
  }
  
  // Department filter
  const deptFilter = document.getElementById("soc-filter-dept")?.value || "all";
  if (deptFilter !== "all") {
    const mapping = {
      MFG: "Manufacturing",
      LOG: "Logistics",
      MKT: "Sales",
      RND: "Research",
      CORP: "Corporate"
    };
    const deptName = mapping[deptFilter];
    if (deptName) {
      list = list.filter(p => getEmployeeDept(p.employee).toLowerCase().includes(deptName.toLowerCase()));
    }
  }
  
  // Search filter
  const searchInput = document.getElementById("soc-search-input")?.value || "";
  if (searchInput.trim()) {
    const q = searchInput.toLowerCase();
    list = list.filter(p => 
      p.employee.toLowerCase().includes(q) || 
      p.activity.toLowerCase().includes(q) || 
      (p.proof && p.proof.toLowerCase().includes(q))
    );
  }
  
  // Sorting
  list.sort((a, b) => {
    let valA = a[socPageState.sortBy];
    let valB = b[socPageState.sortBy];
    
    if (socPageState.sortBy === 'date') {
      valA = a.date ? new Date(a.date) : new Date(0);
      valB = b.date ? new Date(b.date) : new Date(0);
    }
    
    if (valA < valB) return socPageState.sortDesc ? 1 : -1;
    if (valA > valB) return socPageState.sortDesc ? -1 : 1;
    return 0;
  });
  
  return list;
}

function handleSocFilterChange() {
  socPageState.page = 1;
  renderSocial();
}

function sortSocLedger(field) {
  if (socPageState.sortBy === field) {
    socPageState.sortDesc = !socPageState.sortDesc;
  } else {
    socPageState.sortBy = field;
    socPageState.sortDesc = true;
  }
  renderSocial();
}

function toggleSelectAllSocParticipation(chkAll) {
  const isChecked = chkAll.checked;
  const filtered = getFilteredSocParticipation();
  
  if (isChecked) {
    socPageState.selectedParticipation = filtered.map((_, idx) => idx);
  } else {
    socPageState.selectedParticipation = [];
  }
  
  document.getElementById("btn-soc-bulk-delete").disabled = socPageState.selectedParticipation.length === 0;
  renderRecentParticipationLedger();
}

function handleSelectSocRow(idx, chk) {
  if (chk.checked) {
    if (!socPageState.selectedParticipation.includes(idx)) socPageState.selectedParticipation.push(idx);
  } else {
    socPageState.selectedParticipation = socPageState.selectedParticipation.filter(item => item !== idx);
  }
  document.getElementById("btn-soc-bulk-delete").disabled = socPageState.selectedParticipation.length === 0;
}

function handleSocBulkDelete() {
  const filtered = getFilteredSocParticipation();
  const itemsToDelete = socPageState.selectedParticipation.map(idx => filtered[idx]);
  
  appState.employeeParticipation = appState.employeeParticipation.filter(item => !itemsToDelete.includes(item));
  
  socPageState.selectedParticipation = [];
  document.getElementById("btn-soc-bulk-delete").disabled = true;
  
  addSystemNotification("CSR ledger items deleted successfully.", "approvals");
  renderSocial();
  saveAppStateTransactional();
}

function renderRecentParticipationLedger() {
  const tbody = document.getElementById("soc-ledger-tbody-detailed");
  const summary = document.getElementById("soc-table-summary");
  const pagination = document.getElementById("soc-table-pagination");
  if (!tbody || !summary || !pagination) return;
  
  tbody.innerHTML = "";
  
  const filtered = getFilteredSocParticipation();
  const totalLogs = filtered.length;
  
  const totalPages = Math.ceil(totalLogs / socPageState.pageSize) || 1;
  const startIdx = (socPageState.page - 1) * socPageState.pageSize;
  const endIdx = Math.min(startIdx + socPageState.pageSize, totalLogs);
  
  const pageLogs = filtered.slice(startIdx, endIdx);
  
  pageLogs.forEach((p, index) => {
    const rawIdx = startIdx + index;
    const isChecked = socPageState.selectedParticipation.includes(rawIdx);
    
    let statusClass = "pill-draft";
    if (p.status === "Completed") statusClass = "pill-completed";
    if (p.status === "Under Review") statusClass = "pill-under-review";
    if (p.status === "Rejected") statusClass = "pill-under-review"; // Reuse css color
    
    const calculatedHours = Math.round(p.points / 25) || 4;
    const dept = getEmployeeDept(p.employee);
    
    const row = document.createElement("tr");
    row.style.cursor = "pointer";
    row.innerHTML = `
      <td onclick="event.stopPropagation();"><input type="checkbox" ${isChecked ? 'checked' : ''} onchange="handleSelectSocRow(${rawIdx}, this)"></td>
      <td style="font-weight:600;">${p.employee}</td>
      <td>${dept}</td>
      <td>${p.activity}</td>
      <td style="text-align:right; font-family:monospace;">${calculatedHours} hrs</td>
      <td><span style="font-family:monospace; font-size:12px; color:var(--text-muted);">${p.proof || 'None'}</span></td>
      <td><span class="pill ${statusClass}">${p.status}</span></td>
      <td style="font-weight:700; color:var(--primary-green); text-align:right;">+${p.points} XP</td>
      <td>System Auditor</td>
      <td>${p.date || 'Pending'}</td>
      <td onclick="event.stopPropagation();">
        <button class="btn btn-secondary" style="padding:4px 8px; font-size:10px;" onclick="deleteSingleSocParticipation(${rawIdx})">Delete</button>
      </td>
    `;
    row.onclick = () => alert(`Participation Ledger Entry Details:\nEmployee: ${p.employee}\nActivity: ${p.activity}\nDate: ${p.date}\nProof: ${p.proof}\nPoints: ${p.points} XP`);
    tbody.appendChild(row);
  });
  
  summary.textContent = totalLogs > 0 ? `Showing ${startIdx + 1}-${endIdx} of ${totalLogs} logs` : "Showing 0-0 of 0 logs";
  
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `btn btn-secondary ${i === socPageState.page ? 'active' : ''}`;
    btn.style.padding = "4px 8px";
    btn.style.fontSize = "11px";
    btn.textContent = i;
    btn.onclick = () => {
      socPageState.page = i;
      renderRecentParticipationLedger();
    };
    pagination.appendChild(btn);
  }
}

function deleteSingleSocParticipation(rawIdx) {
  const filtered = getFilteredSocParticipation();
  const tr = filtered[rawIdx];
  appState.employeeParticipation = appState.employeeParticipation.filter(item => item !== tr);
  
  addSystemNotification("Participation ledger log item deleted.", "approvals");
  renderSocial();
  saveAppStateTransactional();
}

function exportSocialLedger() {
  alert("Initiating CSR Ledger export. CSV stream created successfully.");
  exportReport('csv');
}

// ---------------- ROW 11 PENDING APPROVALS DESK ----------------
function renderApprovalsDesk() {
  const container = document.getElementById("soc-approvals-cards-grid");
  if (!container) return;
  container.innerHTML = "";
  
  const pending = appState.employeeParticipation.filter(p => p.status === "Under Review");
  
  if (pending.length === 0) {
    container.innerHTML = `
      <div class="col-12" style="text-align:center; padding:30px; color:var(--text-muted); background:rgba(0,0,0,0.1); border-radius:8px; border:1px solid var(--border-subtle);">
        <i data-lucide="shield-alert" style="width:30px; height:30px; margin-bottom:8px;"></i>
        <p style="font-size:13px;">No CSR activities awaiting approval at this time</p>
      </div>
    `;
    return;
  }
  
  pending.forEach(item => {
    const card = document.createElement("div");
    card.className = "card col-4 hover-elevated";
    card.style.padding = "16px";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div>
          <strong style="font-size:13px; color:var(--white); display:block;">${item.employee}</strong>
          <span style="font-size:10px; color:var(--text-muted);">${getEmployeeDept(item.employee)}</span>
        </div>
        <span class="pill pill-under-review" style="font-size:9px; padding:1px 6px;">Awaiting Review</span>
      </div>
      <h5 style="font-size:14px; font-weight:700; color:var(--white); margin: 6px 0;">${item.activity}</h5>
      <p style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">Evidence: <strong style="font-family:monospace; color:var(--white);">${item.proof || 'None'}</strong></p>
      
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:10px; margin-top:8px;">
        <button class="btn btn-ghost" style="padding:4px 8px; font-size:10px; color:#FF7B7B;" onclick="rejectParticipation('${item.employee}', '${item.activity}')">Reject</button>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-secondary" style="padding:4px 8px; font-size:10px;" onclick="alert('Attached evidence: ${item.proof || 'None'} has been verified as compliant.')">Preview</button>
          <button class="btn btn-primary" style="padding:4px 12px; font-size:10px; background:var(--primary-green); color:var(--bg-dark); border:none;" onclick="approveParticipation('${item.employee}', '${item.activity}')">Approve</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function rejectParticipation(employee, activityTitle) {
  const part = appState.employeeParticipation.find(p => p.employee === employee && p.activity === activityTitle);
  if (!part) return;
  part.status = "Rejected";
  addSystemNotification(`CSR Activity rejected: '${activityTitle}' for employee ${employee}.`, "approvals");
  renderSocial();
  saveAppStateTransactional();
}

// ---------------- ROW 12 SENTIMENT DETAILS LIST ----------------
function renderSentimentSummaryList() {
  const container = document.getElementById("soc-sentiment-metrics-list");
  if (!container) return;
  container.innerHTML = "";
  
  const stats = [
    { title: "Wellbeing Index", value: "82 / 100", trend: "+4% vs baseline" },
    { title: "Work-Life Balance", value: "78 / 100", trend: "+1% stable" },
    { title: "Happiness Index", value: "85 / 100", trend: "+2.4% improved" },
    { title: "Organizational Trust", value: "88 / 100", trend: "+6% spike" }
  ];
  
  stats.forEach(item => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.fontSize = "12px";
    div.style.padding = "8px 0";
    div.style.borderBottom = "1px solid var(--border-subtle)";
    div.innerHTML = `
      <div>
        <strong style="color:var(--white); display:block;">${item.title}</strong>
        <span style="font-size:10px; color:#2ECC71;">${item.trend}</span>
      </div>
      <strong style="font-size:14px; color:var(--white);">${item.value}</strong>
    `;
    container.appendChild(div);
  });
}

// ---------------- ROW 13 SOCIAL GOALS ----------------
function renderSocialGoals() {
  const container = document.getElementById("goals-social-grid");
  if (!container) return;
  container.innerHTML = "";
  
  const goals = [
    { name: "Increase Volunteer Hours", current: 72, target: 100, unit: "hours", deadline: "2026-12-31", owner: "HR Director", priority: "High" },
    { name: "Corporate Diversity Index", current: 85, target: 90, unit: "%", deadline: "2026-09-30", owner: "Chief People Officer", priority: "Medium" }
  ];
  
  goals.forEach(goal => {
    const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
    const priColor = goal.priority === "High" ? "#FF7B7B" : "#E9A130";
    
    const card = document.createElement("div");
    card.className = "card col-6 hover-elevated";
    card.style.padding = "16px";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div>
          <strong style="font-size:13px; color:var(--white);">${goal.name}</strong>
          <span style="font-size:9px; color:var(--text-muted); display:block; margin-top:2px;">Owner: ${goal.owner}</span>
        </div>
        <span class="pill" style="border-color:${priColor}; color:${priColor}; font-size:10px; padding:1px 6px;">${goal.priority}</span>
      </div>
      <div style="font-size:16px; font-weight:700; color:var(--white); margin: 6px 0;">
        ${goal.current} / ${goal.target} <span style="font-size:11px; color:var(--text-muted); font-weight:normal;">${goal.unit}</span>
      </div>
      <div>
        <div style="background-color: var(--gray); height: 5px; border-radius: 3px; position: relative;">
          <div style="background-color: var(--primary-green); width: ${percentage}%; height: 100%; border-radius: 3px;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-top:6px;">
          <span>Progress: <strong>${percentage}%</strong></span>
          <span>Target Date: <strong>${goal.deadline}</strong></span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ---------------- ROW 14 SMART ALERTS STACK ----------------
function renderSocialAlertsStack() {
  const container = document.getElementById("soc-alerts-stack");
  if (!container) return;
  container.innerHTML = "";
  
  const alerts = [
    { text: "Logistics department CSR participation drops below critical warning threshold (32 hrs vs 50 hrs target).", pri: "High", color: "#FF7B7B" },
    { text: "Pending CSR approvals awaiting review from System Auditors exceeds 2 days.", pri: "Medium", color: "#E9A130" },
    { text: "Wellbeing checkup survey participation rate is below 50% in Manufacturing.", pri: "Medium", color: "#E9A130" }
  ];
  
  alerts.forEach(al => {
    const div = document.createElement("div");
    div.style.padding = "10px 14px";
    div.style.borderRadius = "6px";
    div.style.border = `1px solid rgba(255,255,255,0.06)`;
    div.style.borderLeft = `3px solid ${al.color}`;
    div.style.backgroundColor = "rgba(0,0,0,0.1)";
    div.style.fontSize = "12px";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "space-between";
    div.innerHTML = `
      <span style="color:#E0E0E0; line-height:1.4;">${al.text}</span>
      <span style="color:${al.color}; font-weight:700; font-size:10px; text-transform:uppercase; margin-left:12px;">${al.pri}</span>
    `;
    container.appendChild(div);
  });
}

// ---------------- ROW 15 TIMELINE LOGGER ----------------
function renderSocialTimeline() {
  const container = document.getElementById("soc-timeline-container");
  if (!container) return;
  container.innerHTML = "";
  
  const timeline = [
    { time: "02:14 PM", desc: "Employee Amit Mehta uploaded evidence for Zero Waste Sprint challenge", icon: "upload", color: "var(--primary-green)" },
    { time: "Yesterday", desc: "System Auditor approved 'Reforestation Drive 2026' participation for Priya Sharma", icon: "shield-check", color: "#2ECC71" },
    { time: "2 days ago", desc: "New Course 'Environmental MSDS Code Safety' scheduled for R&D division", icon: "book-open", color: "#3DBBFF" },
    { time: "4 days ago", desc: "Quarterly employee satisfaction wellbeing checkup survey published", icon: "mail", color: "#E9A130" }
  ];
  
  timeline.forEach(item => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.gap = "12px";
    div.style.marginBottom = "14px";
    div.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center;">
        <span style="width:20px; height:20px; border-radius:50%; background-color:rgba(0,0,0,0.2); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; z-index:2;">
          <i data-lucide="${item.icon}" style="width:10px; height:10px; color:${item.color};"></i>
        </span>
        <div style="width:1px; flex:1; background:var(--border-subtle); margin-top:4px;"></div>
      </div>
      <div>
        <div style="font-size:12px; font-weight:600; color:var(--white);">${item.desc}</div>
        <span style="font-size:10px; color:var(--text-muted);">${item.time}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// ---------------- ROW 16 QUICK ACTIONS TRIGGERS ----------------
function runAISocialInsights() {
  alert("Running AI Social Engagement insights prediction...\nAnalyzing training records and satisfaction surveys indices...");
  addSystemNotification("AI Social Insights summary generated. Participation expected to rise by 6%.", "compliance");
}

// Render Governance Page
function drawRiskMatrix(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let gridHtml = `
    <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
      <div style="display:flex; align-items:center; gap:8px;">
        <div style="writing-mode: vertical-lr; transform: rotate(180deg); font-size:10px; color:var(--text-muted); text-align:center; padding-right:8px; font-weight:700; letter-spacing:0.5px;">PROBABILITY →</div>
        <table class="risk-matrix-table">
  `;
  
  // Matrix cells (Y: 5 down to 1)
  for (let p = 5; p >= 1; p--) {
    gridHtml += "<tr>";
    for (let i = 1; i <= 5; i++) {
      let riskClass = "risk-low";
      const score = p * i;
      if (score >= 15) riskClass = "risk-critical";
      else if (score >= 9) riskClass = "risk-high";
      else if (score >= 4) riskClass = "risk-medium";
      
      gridHtml += `
        <td class="risk-matrix-cell ${riskClass}" onclick="handleRiskCellClick(${p}, ${i})" title="Probability: ${p} | Impact: ${i} (Score: ${score})">
          ${score}
        </td>
      `;
    }
    gridHtml += "</tr>";
  }
  
  gridHtml += `
        </table>
      </div>
      <div style="font-size:10px; color:var(--text-muted); font-weight:700; margin-top:8px; text-transform:uppercase; letter-spacing:0.5px;">IMPACT →</div>
      <div id="risk-matrix-details-panel" style="font-size:11px; color:#E0E0E0; text-align:center; margin-top:12px; min-height:24px; padding:8px 12px; background:rgba(0,0,0,0.15); border-radius:6px; border:1px solid var(--border-subtle); width:100%; line-height:1.4;">
        ${govPageState.riskGridDetails || 'Click on any matrix cell to audit specific risk mitigation logs.'}
      </div>
    </div>
  `;
  
  container.innerHTML = gridHtml;
}

function handleRiskCellClick(prob, imp) {
  const score = prob * imp;
  let text = `Risk Coordinate: <strong>P:${prob} I:${imp}</strong> (Severity Score: <strong>${score}</strong>). `;
  if (score >= 15) {
    text += "Critical Warning: Overdue corrective actions in safety MSDS compliance logs.";
  } else if (score >= 9) {
    text += "High Threat: Air emission limits testing scheduled next week in Manufacturing.";
  } else if (score >= 4) {
    text += "Medium Threat: Minor discrepancy in logistics truck odometer calibration logs.";
  } else {
    text += "Low Threat: Governance standard operating protocols verified compliant.";
  }
  govPageState.riskGridDetails = text;
  drawRiskMatrix("gov-risk-matrix-grid-container");
}

function drawGovDonut(containerId) {
  const container = document.getElementById(containerId);
  const legend = document.getElementById("gov-donut-legend");
  if (!container || !legend) return;
  
  const width = 120;
  const height = 120;
  const radius = 40;
  const cx = width / 2;
  const cy = height / 2;
  const circumference = 2 * Math.PI * radius; // ~251.3
  
  const sectors = [
    { label: "Compliant", percent: 60, color: "#2ECC71" },
    { label: "Pending", percent: 20, color: "#E9A130" },
    { label: "Overdue", percent: 10, color: "#FF7B7B" },
    { label: "Critical", percent: 5, color: "#DC3545" },
    { label: "Resolved", percent: 5, color: "#00A09D" }
  ];
  
  let currentOffset = 0;
  let circlesHtml = "";
  let legendHtml = "";
  
  sectors.forEach(sec => {
    const strokeDash = (sec.percent / 100) * circumference;
    const strokeOffset = circumference - strokeDash + currentOffset;
    circlesHtml += `
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${sec.color}" 
              stroke-width="10" stroke-dasharray="${strokeDash} ${circumference - strokeDash}" 
              stroke-dashoffset="${strokeOffset}" transform="rotate(-90 ${cx} ${cy})" style="transition: stroke-dasharray 0.4s ease;" />
    `;
    currentOffset -= strokeDash;
    
    legendHtml += `
      <div style="display:flex; align-items:center; gap:4px; font-size:10px;">
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:${sec.color};"></span>
        <span style="color:var(--text-muted);">${sec.label} (${sec.percent}%)</span>
      </div>
    `;
  });
  
  container.innerHTML = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="10" />
      ${circlesHtml}
      <text x="${cx}" y="${cy + 4}" fill="var(--white)" font-size="9" font-weight="700" text-anchor="middle">GRC status</text>
    </svg>
  `;
  
  legend.innerHTML = legendHtml;
}

function renderGovernance() {
  const filteredIssues = getFilteredGovIssues();
  
  // KPI Calculations
  document.getElementById("kpi-gov-score").textContent = "86/100";
  renderSparkline("sparkline-gov-score", [82, 84, 85, 84, 85, 86, 86], "#2ECC71");

  const complPercent = Math.round((appState.policies.length / 4) * 100); // 4 baseline policies
  document.getElementById("kpi-gov-policy-compliance").textContent = `${complPercent}%`;
  renderSparkline("sparkline-gov-policy", [68, 70, 72, 70, 75, 75, complPercent], "var(--primary-green)");

  const openIssues = appState.complianceIssues.filter(i => i.status === "Open").length;
  document.getElementById("kpi-gov-open-issues").textContent = openIssues;
  renderSparkline("sparkline-gov-issues", [5, 4, 4, 3, 3, 2, openIssues], "#FF7B7B");

  const pendingSigs = appState.policyAcknowledgements.filter(a => a.status === "Pending").length;
  document.getElementById("kpi-gov-pending-ack").textContent = pendingSigs;
  renderSparkline("sparkline-gov-pending-ack", [4, 3, 3, 2, 2, 1, pendingSigs], "#E9A130");

  const activeAudits = appState.audits.filter(a => a.status === "Under Review").length;
  document.getElementById("kpi-gov-active-audits").textContent = activeAudits;
  renderSparkline("sparkline-gov-audits", [1, 2, 2, 1, 1, 2, activeAudits], "#3DBBFF");

  document.getElementById("kpi-gov-risk-level").textContent = "12%";
  renderSparkline("sparkline-gov-risk", [18, 16, 15, 14, 13, 12, 12], "#FF7B7B");

  // ROW 2: AI Governance details
  const aiText = document.getElementById("ai-gov-recommendation-text");
  const aiFail = document.getElementById("ai-gov-audit-fail");
  const aiDept = document.getElementById("ai-gov-risk-dept");
  const aiOverdue = document.getElementById("ai-gov-overdue-count");
  const aiRegs = document.getElementById("ai-gov-regulatory-deadline");
  
  if (openIssues > 1) {
    aiText.textContent = `"The Manufacturing department has an 82% probability of failing its next compliance audit due to unresolved safety documentation and overdue corrective actions. Resolving the current issues before the next audit is expected to improve the Governance Score by 7 points."`;
    aiFail.textContent = "High (82%)";
    aiDept.textContent = "Manufacturing";
    aiOverdue.textContent = "1 Overdue Alert";
    aiRegs.textContent = "SEC reporting 07-20";
  } else {
    aiText.textContent = `"Compliance metrics are currently stable. Risk projection suggests minor data backup warnings in Logistics. Corrective action recommended: upload e-waste logs."`;
    aiFail.textContent = "Low (12%)";
    aiDept.textContent = "Logistics";
    aiOverdue.textContent = "None";
    aiRegs.textContent = "ISO audits 08-15";
  }

  // ROW 3: Trends Line & Department Bars
  renderGovTrendChart();
  renderGovDeptBarChart();

  // ROW 4: Risk Matrix & Donut
  drawRiskMatrix("gov-risk-matrix-grid-container");
  drawGovDonut("chart-gov-compliance-donut");

  // ROW 5: Policy cards
  renderGovPolicyManagement();

  // ROW 6: GRC Audit Cards
  renderGovAuditsExplorer();

  // ROW 7: Compliance issues paginated details table
  renderRecentComplianceIssues();

  // ROW 8: Regulatory calendar roadmap
  renderRegulatoryCalendar();

  // ROW 9: Document repository vaults
  renderGRCDocumentVault();

  // ROW 10: Governance analytics detail charts
  renderGovAnalyticsDetails();

  // ROW 11: Alerts
  renderGRCAlerts();

  // ROW 12: Vertical GRC timeline logs
  renderGRCTimeline();

  // ROW 13: GRC goals
  renderGRCGoals();

  // ROW 14: Heatmap grid
  renderGRCHeatmap();

  // ROW 15: Executive Insights
  renderGRCExecutiveInsights();

  if (window.lucide) window.lucide.createIcons();
}

// ---------------- ROW 3 RENDERERS ----------------
function renderGovTrendChart() {
  const container = document.getElementById("chart-gov-monthly-trend");
  if (!container) return;
  const width = container.clientWidth || 600;
  const height = 260;
  
  let dataPoints = [72, 75, 78, 80, 83, 85, 86, 88, 85, 89, 91, 92];
  let labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  if (govPageState.chartRange === 'week') {
    dataPoints = [84, 85, 85, 86, 86, 86, 86];
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  } else if (govPageState.chartRange === 'quarter') {
    dataPoints = [78, 83, 88, 92];
    labels = ["Q1", "Q2", "Q3", "Q4"];
  }
  
  const maxVal = 100;
  const padding = 40;
  
  let polylinePoints = "";
  let gridLines = "";
  let labelsHtml = "";
  let fillPoints = `40,${height - padding} `;
  
  // Draw horizontal Y gridlines
  for (let i = 0; i <= 4; i++) {
    const yVal = Math.round((maxVal / 4) * i);
    const y = height - padding - ((yVal / maxVal) * (height - 2 * padding));
    gridLines += `
      <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3,3" />
      <text x="${padding - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${yVal}</text>
    `;
  }
  
  dataPoints.forEach((val, idx) => {
    const x = padding + (idx / (dataPoints.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val / maxVal) * (height - 2 * padding));
    polylinePoints += `${x},${y} `;
    fillPoints += `${x},${y} `;
    
    labelsHtml += `
      <text x="${x}" y="${height - padding + 16}" fill="var(--text-muted)" font-size="10" text-anchor="middle">${labels[idx]}</text>
      <circle cx="${x}" cy="${y}" r="3.5" fill="var(--primary-green)" stroke="var(--bg-dark)" stroke-width="1.5" class="map-node" onclick="alert('Governance Score: ${val}')" />
    `;
  });
  fillPoints += `${width - padding},${height - padding}`;
  
  container.innerHTML = `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
      <defs>
        <linearGradient id="area-grad-gov" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary-green)" stop-opacity="0.15" />
          <stop offset="100%" stop-color="var(--primary-green)" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${gridLines}
      <polygon points="${fillPoints}" fill="url(#area-grad-gov)" />
      <polyline points="${polylinePoints}" fill="none" stroke="var(--primary-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      ${labelsHtml}
    </svg>
  `;
}

function toggleGovChartRange(range) {
  govPageState.chartRange = range;
  document.querySelectorAll("#btn-gov-chart-week, #btn-gov-chart-month, #btn-gov-chart-quarter, #btn-gov-chart-year").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById(`btn-gov-chart-${range}`).classList.add("active");
  renderGovTrendChart();
}

function renderGovDeptBarChart() {
  const container = document.getElementById("chart-gov-dept-comparison");
  if (!container) return;
  container.innerHTML = "";
  
  const deptsData = [
    { name: "Engineering", score: 94, issues: 0, audits: 4 },
    { name: "Corporate", score: 86, issues: 0, audits: 3 },
    { name: "Sales & Marketing", score: 90, issues: 0, audits: 2 },
    { name: "Manufacturing", score: 80, issues: 1, audits: 5 },
    { name: "Logistics", score: 68, issues: 1, audits: 3 }
  ];
  
  deptsData.forEach(dept => {
    const maxVal = 100;
    const actualWidth = Math.min(100, (dept.score / maxVal) * 100);
    
    const block = document.createElement("div");
    block.style.margin = "8px 0";
    block.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
        <span style="font-weight:600; color:var(--white);">${dept.name}</span>
        <span style="font-size:11px; color:var(--text-muted);">
          Score: <strong>${dept.score}/100</strong> | Audits: ${dept.audits} (${dept.issues} open issue)
        </span>
      </div>
      <div style="height:6px; background:rgba(255,255,255,0.03); border-radius:3px; overflow:hidden;">
        <div style="width:${actualWidth}%; height:100%; background-color:var(--primary-green); border-radius:3px; transition: width 0.4s ease;"></div>
      </div>
    `;
    container.appendChild(block);
  });
}

// ---------------- ROW 5 POLICY MANAGEMENT ----------------
function renderGovPolicyManagement() {
  const container = document.getElementById("gov-policy-management-grid");
  if (!container) return;
  container.innerHTML = "";
  
  appState.policies.forEach(pol => {
    const ackList = appState.policyAcknowledgements.filter(a => a.policy === pol.code);
    const completed = ackList.filter(a => a.status === "Completed").length;
    const totalAck = ackList.length || 1;
    const rate = Math.round((completed / totalAck) * 100);
    
    const isSigned = appState.currentUser ? appState.policyAcknowledgements.some(a => a.employee === appState.currentUser.name && a.policy === pol.code && a.status === "Completed") : false;
    
    const card = document.createElement("div");
    card.className = "card col-4 vault-card";
    card.style.padding = "16px";
    card.style.borderLeft = isSigned ? "4px solid #2ECC71" : "4px solid #E9A130";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
        <span style="font-size:11px; color:var(--text-muted); font-weight:700;">${pol.code} | v${pol.version}</span>
        <span class="pill ${isSigned ? 'pill-completed' : 'pill-open'}" style="font-size:9px;">
          ${isSigned ? 'Acknowledged' : 'Needs Signature'}
        </span>
      </div>
      <h5 style="font-size:14px; font-weight:700; color:var(--white); margin: 4px 0 10px 0; min-height:36px; line-height:1.3;">${pol.name}</h5>
      
      <div style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-bottom:4px;">
          <span>Acknowledgment Rate</span>
          <strong style="color:var(--white);">${rate}%</strong>
        </div>
        <div style="height:4px; background:var(--gray); border-radius:2px; overflow:hidden;">
          <div style="width:${rate}%; height:100%; background:var(--primary-green); border-radius:2px;"></div>
        </div>
      </div>
      
      <div style="display:flex; gap:6px; border-top:1px solid var(--border-subtle); padding-top:10px; margin-top:8px;">
        <button class="btn btn-secondary" style="padding:4px 8px; font-size:10px; flex:1;" onclick="alert('Viewing policy details for ${pol.code}...')">View</button>
        <button class="btn btn-secondary" style="padding:4px 8px; font-size:10px;" onclick="alert('Edit policy rules...')">Edit</button>
        <button class="btn btn-secondary" style="padding:4px 8px; font-size:10px;" onclick="alert('Downloading Policy PDF document...')">
          <i data-lucide="download" style="width:10px; height:10px;"></i>
        </button>
        ${isSigned ? 
          `<button class="btn btn-secondary" style="padding:4px 10px; font-size:10px; opacity:0.6;" disabled>Signed</button>` : 
          `<button class="btn btn-primary" style="padding:4px 12px; font-size:10px;" onclick="acknowledgePolicy('${pol.code}')">Sign</button>`
        }
      </div>
    `;
    container.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
}

function acknowledgePolicy(code) {
  if (!appState.currentUser) {
    alert("Please sign in to acknowledge compliance policies.");
    return;
  }
  const ack = appState.policyAcknowledgements.find(a => a.employee === appState.currentUser.name && a.policy === code);
  if (ack) {
    ack.status = "Completed";
    ack.date = new Date().toISOString().split("T")[0];
    addSystemNotification(`Signed policy acknowledgement: '${code}' successfully.`, "compliance");
  } else {
    appState.policyAcknowledgements.push({
      employee: appState.currentUser.name,
      policy: code,
      date: new Date().toISOString().split("T")[0],
      status: "Completed"
    });
    addSystemNotification(`Signed policy acknowledgement: '${code}' registered.`, "compliance");
  }
  renderGovernance();
  saveAppStateTransactional();
}

// ---------------- ROW 6 AUDIT CENTER ----------------
function renderGovAuditsExplorer() {
  const container = document.getElementById("gov-audit-explorer-grid");
  if (!container) return;
  container.innerHTML = "";
  
  appState.audits.forEach(aud => {
    const isCompleted = aud.status === "Completed";
    const percent = isCompleted ? 100 : 75;
    
    const card = document.createElement("div");
    card.className = "card col-6 hover-elevated";
    card.style.padding = "16px";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div>
          <strong style="font-size:13px; color:var(--white);">${aud.title}</strong>
          <span style="font-size:9px; color:var(--text-muted); display:block; margin-top:2px;">Auditor: ${aud.auditor} | Department: ${aud.department}</span>
        </div>
        <span class="pill ${isCompleted ? 'pill-completed' : 'pill-under-review'}" style="font-size:9px;">
          ${aud.status}
        </span>
      </div>
      <p style="font-size:12px; color:var(--text-muted); line-height:1.4; margin: 8px 0 12px 0; min-height:28px;">Findings: "${aud.findings}"</p>
      
      <div style="margin-bottom:12px;">
        <div style="background-color: var(--gray); height: 5px; border-radius: 3px; position: relative;">
          <div style="background-color: var(--primary-green); width: ${percent}%; height: 100%; border-radius: 3px;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:4px;">
          <span>Checklist: <strong>${isCompleted ? '4/4' : '3/4'} completed</strong></span>
          <span>Due Date: <strong>${aud.date}</strong></span>
        </div>
      </div>
      
      <div style="display:flex; gap:8px; border-top:1px solid var(--border-subtle); padding-top:10px; margin-top:8px;">
        <button class="btn btn-secondary" style="padding:4px 12px; font-size:10px;" onclick="alert('Detailed findings view opened.')">View Findings</button>
        <button class="btn btn-secondary" style="padding:4px 12px; font-size:10px;" onclick="alert('Downloading audit verification report PDF...')">Download Report</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function triggerStartAudit() {
  const code = "AUD-" + Math.floor(100 + Math.random() * 900);
  appState.audits.unshift({
    title: `Scheduled ESG Verification ${code}`,
    department: "Manufacturing",
    auditor: appState.currentUser ? appState.currentUser.name : "System Auditor",
    date: new Date().toISOString().split("T")[0],
    findings: "Preliminary file review under progress.",
    status: "Under Review"
  });
  addSystemNotification("Started new ESG Verification audit stream successfully.", "compliance");
  renderGovernance();
  saveAppStateTransactional();
}

// ---------------- ROW 7 COMPLIANCE LEDGER TABLE ----------------
function getFilteredGovIssues() {
  let list = [...appState.complianceIssues];
  
  // Date filter
  const dateFilter = document.getElementById("gov-filter-date")?.value || "all";
  if (dateFilter === "this-month") {
    list = list.filter(i => i.dueDate && i.dueDate.startsWith("2026-07"));
  } else if (dateFilter === "last-30") {
    list = list.filter(i => {
      if (!i.dueDate) return false;
      const diffTime = Math.abs(new Date("2026-07-12") - new Date(i.dueDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    });
  } else if (dateFilter === "q2") {
    list = list.filter(i => {
      if (!i.dueDate) return false;
      const m = new Date(i.dueDate).getMonth();
      return m >= 3 && m <= 5;
    });
  }
  
  // Department filter
  const deptFilter = document.getElementById("gov-filter-dept")?.value || "all";
  if (deptFilter !== "all") {
    const mapping = {
      MFG: "Manufacturing",
      LOG: "Logistics",
      MKT: "Sales",
      RND: "Research",
      CORP: "Corporate"
    };
    const deptName = mapping[deptFilter];
    if (deptName) {
      list = list.filter(i => i.department.toLowerCase().includes(deptName.toLowerCase()));
    }
  }
  
  // Search filter
  const searchInput = document.getElementById("gov-search-input")?.value || "";
  if (searchInput.trim()) {
    const q = searchInput.toLowerCase();
    list = list.filter(i => 
      i.desc.toLowerCase().includes(q) || 
      i.department.toLowerCase().includes(q) || 
      i.owner.toLowerCase().includes(q)
    );
  }
  
  // Sorting
  list.sort((a, b) => {
    let valA = a[govPageState.sortBy];
    let valB = b[govPageState.sortBy];
    
    if (govPageState.sortBy === 'date') {
      valA = a.dueDate ? new Date(a.dueDate) : new Date(0);
      valB = b.dueDate ? new Date(b.dueDate) : new Date(0);
    }
    
    if (valA < valB) return govPageState.sortDesc ? 1 : -1;
    if (valA > valB) return govPageState.sortDesc ? -1 : 1;
    return 0;
  });
  
  return list;
}

function handleGovFilterChange() {
  govPageState.page = 1;
  renderGovernance();
}

function sortGovLedger(field) {
  if (govPageState.sortBy === field) {
    govPageState.sortDesc = !govPageState.sortDesc;
  } else {
    govPageState.sortBy = field;
    govPageState.sortDesc = true;
  }
  renderGovernance();
}

function toggleSelectAllGovIssues(chkAll) {
  const isChecked = chkAll.checked;
  const filtered = getFilteredGovIssues();
  
  if (isChecked) {
    govPageState.selectedIssues = filtered.map((_, idx) => idx);
  } else {
    govPageState.selectedIssues = [];
  }
  
  document.getElementById("btn-gov-bulk-delete").disabled = govPageState.selectedIssues.length === 0;
  renderRecentComplianceIssues();
}

function handleSelectGovRow(idx, chk) {
  if (chk.checked) {
    if (!govPageState.selectedIssues.includes(idx)) govPageState.selectedIssues.push(idx);
  } else {
    govPageState.selectedIssues = govPageState.selectedIssues.filter(item => item !== idx);
  }
  document.getElementById("btn-gov-bulk-delete").disabled = govPageState.selectedIssues.length === 0;
}

function handleGovBulkDelete() {
  const filtered = getFilteredGovIssues();
  const itemsToDelete = govPageState.selectedIssues.map(idx => filtered[idx]);
  
  appState.complianceIssues = appState.complianceIssues.filter(item => !itemsToDelete.includes(item));
  
  govPageState.selectedIssues = [];
  document.getElementById("btn-gov-bulk-delete").disabled = true;
  
  addSystemNotification("GRC compliance violations deleted.", "compliance");
  renderGovernance();
  saveAppStateTransactional();
}

function renderRecentComplianceIssues() {
  const tbody = document.getElementById("gov-ledger-tbody-detailed");
  const summary = document.getElementById("gov-table-summary");
  const pagination = document.getElementById("gov-table-pagination");
  if (!tbody || !summary || !pagination) return;
  
  tbody.innerHTML = "";
  
  const filtered = getFilteredGovIssues();
  const totalIssues = filtered.length;
  
  const totalPages = Math.ceil(totalIssues / govPageState.pageSize) || 1;
  const startIdx = (govPageState.page - 1) * govPageState.pageSize;
  const endIdx = Math.min(startIdx + govPageState.pageSize, totalIssues);
  
  const pageIssues = filtered.slice(startIdx, endIdx);
  
  pageIssues.forEach((ci, index) => {
    const rawIdx = startIdx + index;
    const isChecked = govPageState.selectedIssues.includes(rawIdx);
    
    let statusClass = "pill-open";
    let statusDot = "#FF7B7B";
    if (ci.status === "Resolved") {
      statusClass = "pill-resolved";
      statusDot = "#2ECC71";
    }
    
    let sevClass = "pill-low";
    let sevColor = "#3DBBFF";
    let sevBg = "rgba(61,187,255,0.12)";
    if (ci.severity === "High") {
      sevClass = "pill-high";
      sevColor = "#DC3545";
      sevBg = "rgba(220,53,69,0.12)";
    } else if (ci.severity === "Medium") {
      sevClass = "pill-medium";
      sevColor = "#E9A130";
      sevBg = "rgba(233,161,48,0.12)";
    }
    
    const isOverdue = ci.status === "Open" && new Date(ci.dueDate) < new Date();
    const overdueLabel = isOverdue ? `<span class="pill pill-high" style="font-size:9px; padding:1px 4px; background:rgba(220,53,69,0.15); border-color:#DC3545; color:#DC3545; margin-left:4px;">Overdue</span>` : "";
    
    const row = document.createElement("tr");
    row.style.cursor = "pointer";
    row.innerHTML = `
      <td onclick="event.stopPropagation();"><input type="checkbox" ${isChecked ? 'checked' : ''} onchange="handleSelectGovRow(${rawIdx}, this)"></td>
      <td style="font-family:monospace; font-size:11px;">#${ci.id || 'N/A'}</td>
      <td style="font-weight:600;">${ci.desc}</td>
      <td>${ci.department}</td>
      <td>
        <span class="pill ${sevClass}" style="background-color:${sevBg}; border-color:${sevColor}; color:${sevColor}; font-weight:700; padding:2px 8px; font-size:11px;">
          ${ci.severity}
        </span>
      </td>
      <td>${ci.owner}</td>
      <td>2026-07-01</td>
      <td style="${isOverdue ? 'color:var(--red); font-weight:700;' : 'color:var(--text-muted);'}">
        ${ci.dueDate} ${overdueLabel}
      </td>
      <td>
        <span class="pill ${statusClass}" style="padding:3px 8px; font-size:11px; display:inline-flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:5px; height:5px; border-radius:50%; background-color:${statusDot};"></span>
          ${ci.status}
        </span>
      </td>
      <td>Lack of MSDS sheets</td>
      <td>Upload MSDS binder</td>
      <td>
        <div style="display:flex; align-items:center; gap:6px;">
          <div style="width:50px; background:var(--gray); height:4px; border-radius:2px; overflow:hidden;">
            <div style="width:${ci.status === 'Resolved' ? '100%' : '20%'}; background:var(--primary-green); height:100%;"></div>
          </div>
          <span style="font-size:10px;">${ci.status === 'Resolved' ? '100%' : '20%'}</span>
        </div>
      </td>
      <td onclick="event.stopPropagation();">
        ${ci.status === "Open" ? 
          `<button class="btn btn-primary" style="padding:4px 8px; font-size:10px; font-weight:700; background:var(--primary-green); color:var(--bg-dark); border:none;" onclick="resolveComplianceIssue('${ci.id}')">Resolve</button>` : 
          `<span style="color:#2ECC71; font-size:11px; font-weight:600; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="check-circle" style="width:11px; height:11px;"></i> Closed</span>`
        }
      </td>
    `;
    row.onclick = () => alert(`GRC compliance details:\nDesc: ${ci.desc}\nSeverity: ${ci.severity}\nOwner: ${ci.owner}\nDue: ${ci.dueDate}`);
    tbody.appendChild(row);
  });
  
  summary.textContent = totalIssues > 0 ? `Showing ${startIdx + 1}-${endIdx} of ${totalIssues} issues` : "Showing 0-0 of 0 issues";
  
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `btn btn-secondary ${i === govPageState.page ? 'active' : ''}`;
    btn.style.padding = "4px 8px";
    btn.style.fontSize = "11px";
    btn.textContent = i;
    btn.onclick = () => {
      govPageState.page = i;
      renderRecentComplianceIssues();
    };
    pagination.appendChild(btn);
  }
}

function resolveComplianceIssue(id) {
  const ci = appState.complianceIssues.find(item => item.id === id);
  if (!ci) return;
  ci.status = "Resolved";
  addSystemNotification(`GRC compliance issue resolved successfully: '${ci.desc}'`, "compliance");
  renderGovernance();
  saveAppStateTransactional();
}

function exportGovernanceLedger() {
  alert("Initiating GRC compliance ledger export. CSV stream generated.");
  exportReport('csv');
}

// ---------------- ROW 8 REGULATORY TIMELINE CALENDAR ----------------
function renderRegulatoryCalendar() {
  const container = document.getElementById("gov-regulatory-calendar-container");
  if (!container) return;
  container.innerHTML = "";
  
  const milestones = [
    { title: "Upcoming SEC GRC Reporting", date: "2026-07-20", type: "Critical Report", color: "#FF7B7B" },
    { title: "ISO 14001 Audit Dates", date: "2026-08-15", type: "Audit Review", color: "#E9A130" },
    { title: "ESG License Renewal Deadline", date: "2026-09-01", type: "License Renewal", color: "#3DBBFF" },
    { title: "Corporate OSHA safety code certification expiry", date: "Expired yesterday", type: "Critical Deficit", color: "#DC3545" }
  ];
  
  milestones.forEach(m => {
    const div = document.createElement("div");
    div.className = "calendar-timeline-row";
    div.innerHTML = `
      <div style="width:140px; font-weight:700; color:var(--white); font-size:12px;">${m.date}</div>
      <div style="flex:1;">
        <strong style="color:var(--white); font-size:12px; display:block;">${m.title}</strong>
        <span style="font-size:10px; color:var(--text-muted);">${m.type}</span>
      </div>
      <span class="pill" style="border-color:${m.color}; color:${m.color}; font-size:10px; padding:1px 6px;">Active</span>
    `;
    container.appendChild(div);
  });
}

// ---------------- ROW 9 SECURE DOCUMENT REPOSITORY ----------------
function renderGRCDocumentVault() {
  const container = document.getElementById("gov-document-vault-grid");
  if (!container) return;
  container.innerHTML = "";
  
  const files = [
    { name: "Safety MSDS Binder.pdf", cat: "Safety Documents", size: "4.8 MB" },
    { name: "Supplier Code Conduct.pdf", cat: "Policies", size: "1.2 MB" },
    { name: "Q2 Operations Audit Report.pdf", cat: "Audit Reports", size: "3.5 MB" }
  ];
  
  files.forEach(f => {
    const card = document.createElement("div");
    card.className = "card col-4 vault-card";
    card.style.padding = "14px";
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
        <i data-lucide="file-text" style="width:20px; height:20px; color:var(--primary-green);"></i>
        <div>
          <strong style="font-size:12px; color:var(--white); display:block;">${f.name}</strong>
          <span style="font-size:9px; color:var(--text-muted);">${f.cat} | ${f.size}</span>
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; border-top:1px solid var(--border-subtle); padding-top:6px; margin-top:6px;">
        <button class="btn btn-ghost" style="padding:2px 8px; font-size:10px; color:var(--primary-green);" onclick="alert('Downloading ${f.name} secure attachment...')">Download</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ---------------- ROW 10 GOVERNANCE ANALYTICS CHARTS ----------------
function renderGovAnalyticsDetails() {
  const left = document.getElementById("chart-gov-ack-progress");
  const right = document.getElementById("chart-gov-resolution-times");
  if (!left || !right) return;
  
  left.innerHTML = `
    <svg width="100%" height="150" viewBox="0 0 300 150">
      <rect x="20" y="20" width="30" height="100" fill="var(--primary-green)" rx="2" />
      <text x="35" y="135" fill="var(--text-muted)" font-size="9" text-anchor="middle">POL-01</text>
      <rect x="90" y="40" width="30" height="80" fill="#00A09D" rx="2" />
      <text x="105" y="135" fill="var(--text-muted)" font-size="9" text-anchor="middle">POL-02</text>
      <rect x="160" y="60" width="30" height="60" fill="#E9A130" rx="2" />
      <text x="175" y="135" fill="var(--text-muted)" font-size="9" text-anchor="middle">POL-03</text>
      <line x1="10" y1="120" x2="280" y2="120" stroke="var(--border-subtle)" />
    </svg>
  `;
  
  right.innerHTML = `
    <svg width="100%" height="150" viewBox="0 0 300 150">
      <!-- Resolution times trend line -->
      <polyline points="20,100 80,80 140,50 200,30 260,20" fill="none" stroke="#FF7B7B" stroke-width="2" />
      <circle cx="260" cy="20" r="3.5" fill="#FF7B7B" />
      <line x1="10" y1="120" x2="280" y2="120" stroke="var(--border-subtle)" />
      <text x="20" y="135" fill="var(--text-muted)" font-size="9">Jan</text>
      <text x="140" y="135" fill="var(--text-muted)" font-size="9">Jun</text>
      <text x="260" y="135" fill="var(--text-muted)" font-size="9">Dec</text>
    </svg>
  `;
}

// ---------------- ROW 11 GRC ALERTS ----------------
function renderGRCAlerts() {
  const container = document.getElementById("gov-alerts-stack");
  if (!container) return;
  container.innerHTML = "";
  
  const alerts = [
    { text: "OSHA Safety Code Certification expired yesterday. Critical compliance breach warning.", pri: "Critical", color: "#DC3545" },
    { text: "Corporate code signature review audit overdue by 4 days.", pri: "High", color: "#FF7B7B" }
  ];
  
  alerts.forEach(al => {
    const div = document.createElement("div");
    div.style.padding = "10px 14px";
    div.style.borderRadius = "6px";
    div.style.border = `1px solid rgba(255,255,255,0.06)`;
    div.style.borderLeft = `3px solid ${al.color}`;
    div.style.backgroundColor = "rgba(0,0,0,0.12)";
    div.style.fontSize = "12px";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "space-between";
    div.innerHTML = `
      <span style="color:#E0E0E0; line-height:1.4;">${al.text}</span>
      <span style="color:${al.color}; font-weight:700; font-size:10px; text-transform:uppercase; margin-left:12px;">${al.pri}</span>
    `;
    container.appendChild(div);
  });
}

// ---------------- ROW 12 GOVERNANCE TIMELINE ----------------
function renderGRCTimeline() {
  const container = document.getElementById("gov-timeline-container");
  if (!container) return;
  container.innerHTML = "";
  
  const timeline = [
    { time: "10:12 AM", desc: "Governance code POL-03 signed and acknowledged by Rajiv Nair", icon: "check", color: "var(--primary-green)" },
    { time: "Yesterday", desc: "Started Scheduled Audit ESG Verification AUD-842", icon: "play", color: "#3DBBFF" },
    { time: "3 days ago", desc: "New Compliance issue raised in manufacturing department", icon: "alert-triangle", color: "#FF7B7B" }
  ];
  
  timeline.forEach(item => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.gap = "12px";
    div.style.marginBottom = "14px";
    div.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center;">
        <span style="width:20px; height:20px; border-radius:50%; background-color:rgba(0,0,0,0.2); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; z-index:2;">
          <i data-lucide="${item.icon}" style="width:10px; height:10px; color:${item.color};"></i>
        </span>
        <div style="width:1px; flex:1; background:var(--border-subtle); margin-top:4px;"></div>
      </div>
      <div>
        <div style="font-size:12px; font-weight:600; color:var(--white);">${item.desc}</div>
        <span style="font-size:10px; color:var(--text-muted);">${item.time}</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// ---------------- ROW 13 GOVERNANCE GOALS ----------------
function renderGRCGoals() {
  const container = document.getElementById("goals-gov-grid");
  if (!container) return;
  container.innerHTML = "";
  
  const goals = [
    { name: "Increase Policy Compliance", current: 75, target: 95, unit: "%", deadline: "2026-12-31", owner: "Chief Compliance Officer" },
    { name: "Reduce Open GRC Issues", current: 2, target: 0, unit: "issues", deadline: "2026-08-30", owner: "Manufacturing GRC Manager" }
  ];
  
  goals.forEach(goal => {
    const percentage = goal.target === 0 ? 50 : Math.min(100, Math.round((goal.current / goal.target) * 100));
    
    const card = document.createElement("div");
    card.className = "card col-6 hover-elevated";
    card.style.padding = "16px";
    card.innerHTML = `
      <strong style="font-size:13px; color:var(--white); display:block; margin-bottom:8px;">${goal.name}</strong>
      <div style="font-size:16px; font-weight:700; color:var(--white); margin-bottom:8px;">
        ${goal.current} / ${goal.target} <span style="font-size:11px; color:var(--text-muted); font-weight:normal;">${goal.unit}</span>
      </div>
      <div>
        <div style="background-color: var(--gray); height: 5px; border-radius: 3px;">
          <div style="background-color: var(--primary-green); width: ${percentage}%; height: 100%; border-radius: 3px;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-top:6px;">
          <span>Progress: <strong>${percentage}%</strong></span>
          <span>Target Date: <strong>${goal.deadline}</strong></span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ---------------- ROW 14 GRC HEATMAP ----------------
function renderGRCHeatmap() {
  const container = document.getElementById("gov-compliance-heatmap-grid");
  if (!container) return;
  container.innerHTML = "";
  
  const heatmap = [
    { name: "Corporate", status: "Compliant", color: "#2ECC71", score: "94%" },
    { name: "Sales & Marketing", status: "Compliant", color: "#2ECC71", score: "89%" },
    { name: "Logistics", status: "Needs Attention", color: "#E9A130", score: "68%" },
    { name: "Manufacturing", status: "Critical Alert", color: "#DC3545", score: "82%" }
  ];
  
  heatmap.forEach(h => {
    const card = document.createElement("div");
    card.className = "card col-3 hover-elevated";
    card.style.padding = "14px";
    card.style.borderLeft = `4px solid ${h.color}`;
    card.innerHTML = `
      <strong style="font-size:12px; color:var(--white); display:block;">${h.name}</strong>
      <div style="font-size:16px; font-weight:700; color:var(--white); margin: 4px 0;">${h.score}</div>
      <span style="font-size:10px; color:${h.color}; font-weight:700;">${h.status}</span>
    `;
    container.appendChild(card);
  });
}

// ---------------- ROW 15 EXECUTIVE INSIGHTS ----------------
function renderGRCExecutiveInsights() {
  const container = document.getElementById("gov-executive-insights-grid");
  if (!container) return;
  container.innerHTML = "";
  
  const insights = [
    { title: "Top Compliant Department", value: "Engineering (94%)" },
    { title: "Highest Risk Department", value: "Logistics (High risk index)" },
    { title: "Average Resolution Time", value: "14.5 Days" }
  ];
  
  insights.forEach(ins => {
    const card = document.createElement("div");
    card.className = "card col-4 hover-elevated";
    card.style.padding = "14px";
    card.innerHTML = `
      <span style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:4px;">${ins.title}</span>
      <strong style="font-size:16px; color:var(--white);">${ins.value}</strong>
    `;
    container.appendChild(card);
  });
}

// ---------------- ROW 16 QUICK ACTIONS TRIGGERS ----------------
function runAIGovernanceInsights() {
  alert("Running AI GRC forecast audit simulation...\nPredicting manufacturing safety verification checklists...");
  addSystemNotification("AI Governance check complete. Unresolved compliance issues mapped to corrective action plans.", "compliance");
}

function triggerCreatePolicyModal() {
  const title = prompt("Enter new corporate ESG Compliance policy title:");
  if (!title) return;
  
  const code = "POL-0" + (appState.policies.length + 1);
  appState.policies.push({
    code: code,
    name: title,
    version: "v1.0",
    date: new Date().toISOString().split("T")[0]
  });
  
  addSystemNotification(`Created new compliance policy: '${code}' successfully.`, "compliance");
  renderGovernance();
  saveAppStateTransactional();
}

// Render Gamification Page
function renderGamification() {
  // ── KPI Cards ───────────────────────────────────────────────────────────────
  const user = appState.currentUser;
  const xp   = user ? user.xp : 0;

  // Level thresholds
  const levels = [
    { name: "Eco Starter",   min: 0    },
    { name: "Eco Aware",     min: 500  },
    { name: "Eco Warrior",   min: 1500 },
    { name: "Green Champion",min: 3000 },
    { name: "ESG Legend",    min: 6000 },
  ];
  let levelIdx = 0;
  for (let i = 0; i < levels.length; i++) { if (xp >= levels[i].min) levelIdx = i; }
  const currentLevel = levels[levelIdx];
  const nextLevel    = levels[levelIdx + 1];
  const levelPct     = nextLevel ? Math.min(100, ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100) : 100;

  // Completed challenges for current user
  const completedChallenges = user
    ? appState.challengeParticipation.filter(p => p.employee === user.name && p.status === "Completed").length
    : 0;

  // Global rank (sorted by XP)
  const allUsers = [
    { name: "Manufacturing Dept", xp: 4820 },
    { name: "Aditi Rao",          xp: 3910 },
    { name: "Corporate Dept",     xp: 3505 },
    { name: "Logistics Team",     xp: 3100 },
    { name: user ? user.name : "Amit Mehta", xp: xp },
    { name: "John Chen",          xp: 1200 },
    { name: "Sarah Jenkins",      xp: 950  },
    { name: "Ravi Patel",         xp: 800  },
  ].sort((a, b) => b.xp - a.xp);
  const globalRank = allUsers.findIndex(u => u.xp === xp) + 1 || 5;
  const deptRank   = 3; // simulated

  // Streak (days the user has been active — simulated)
  const streak = 4;

  // Set values
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl("kpi-gam-xp",          xp > 0 ? `${xp.toLocaleString()} XP` : "0 XP");
  setEl("kpi-gam-level",       `Lv.${levelIdx + 1}`);
  setEl("kpi-gam-global-rank", `#${globalRank}`);
  setEl("kpi-gam-dept-rank",   `#${deptRank}`);
  setEl("kpi-gam-completed",   completedChallenges || "0");
  setEl("kpi-gam-streak",      `${streak} Days`);

  // Level label update (the "Eco Warrior" text under the level)
  const levelLabelEl = document.querySelector("#kpi-gam-level + div");
  if (levelLabelEl) levelLabelEl.textContent = currentLevel.name;

  // Level progress bar
  const bar = document.getElementById("kpi-gam-level-bar");
  if (bar) setTimeout(() => { bar.style.width = `${levelPct}%`; }, 100);

  // Sparklines
  renderSparkline("sparkline-gam-xp",        [200, 400, 600, 800, 1000, 1200, xp || 1420], "#E9A130");
  renderSparkline("sparkline-gam-global",     [8, 7, 7, 6, 6, 5, globalRank], "#A06AB4");
  renderSparkline("sparkline-gam-dept",       [6, 5, 5, 4, 4, 3, deptRank], "#FF7B7B");
  renderSparkline("sparkline-gam-completed",  [0, 0, 1, 1, 2, completedChallenges || 2, completedChallenges || 2], "#2ECC71");

  // Update user score widget
  const xpWidget = document.getElementById("gam-user-xp");
  if (xpWidget) xpWidget.textContent = user ? `${xp.toLocaleString()} XP` : "0 XP";

  // ── XP Progress Journey Chart ──────────────────────────────────────────────
  const chartEl = document.getElementById("chart-gam-xp-progress");
  if (chartEl) {
    const W = chartEl.clientWidth || 560;
    const H = 220;
    const pad = { top: 20, right: 16, bottom: 36, left: 48 };
    const days  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const daily = [120, 80, 200, 150, 180, 320, 250];
    const goal  = 150;

    const maxV = Math.max(...daily, goal) + 50;
    const xS = i => pad.left + (i / (days.length - 1)) * (W - pad.left - pad.right);
    const yS = v => pad.top + (1 - v / maxV) * (H - pad.top - pad.bottom);

    const barW = (W - pad.left - pad.right) / days.length - 8;
    const bars = daily.map((v, i) => {
      const x = xS(i) - barW / 2;
      const bH = yS(0) - yS(v);
      const color = v >= goal ? "#2ECC71" : "#E9A130";
      return `<rect x="${x.toFixed(1)}" y="${yS(v).toFixed(1)}" width="${barW.toFixed(1)}" height="${bH.toFixed(1)}" rx="4" fill="${color}" opacity="0.85"/>
              <text x="${(x + barW/2).toFixed(1)}" y="${(yS(v) - 5).toFixed(1)}" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="9">${v}</text>`;
    }).join("");

    const goalY = yS(goal);
    const gridLines = [0.25, 0.5, 0.75, 1].map(t => {
      const y = pad.top + t * (H - pad.top - pad.bottom);
      const val = Math.round(maxV * (1 - t));
      return `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
              <text x="${pad.left - 6}" y="${y + 4}" fill="rgba(255,255,255,0.3)" font-size="9" text-anchor="end">${val}</text>`;
    }).join("");

    const xLabels = days.map((d, i) =>
      `<text x="${xS(i).toFixed(1)}" y="${H - 6}" fill="rgba(255,255,255,0.4)" font-size="10" text-anchor="middle">${d}</text>`
    ).join("");

    chartEl.innerHTML = `
      <svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}">
        ${gridLines}
        ${xLabels}
        ${bars}
        <!-- Goal line -->
        <line x1="${pad.left}" y1="${goalY.toFixed(1)}" x2="${W - pad.right}" y2="${goalY.toFixed(1)}" stroke="#3DBBFF" stroke-width="1.5" stroke-dasharray="6 4"/>
        <text x="${W - pad.right + 4}" y="${(goalY + 4).toFixed(1)}" fill="#3DBBFF" font-size="9">Goal</text>
      </svg>
      <div style="display:flex; gap:16px; margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.05);">
        <span style="font-size:11px; color:var(--text-muted);"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#2ECC71;margin-right:4px;"></span>Above Goal</span>
        <span style="font-size:11px; color:var(--text-muted);"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#E9A130;margin-right:4px;"></span>Below Goal</span>
        <span style="font-size:11px; color:var(--text-muted);">--- Daily Goal: ${goal} XP</span>
        <span style="font-size:11px; color:var(--white); margin-left:auto;">Weekly Total: <strong style="color:#E9A130;">${daily.reduce((a,b)=>a+b,0).toLocaleString()} XP</strong></span>
      </div>`;
  }

  // ── Leaderboard Analytics (Department bar chart) ───────────────────────────
  const deptChartEl = document.getElementById("chart-gam-dept-comparison");
  if (deptChartEl) {
    const depts = [
      { name: "Manufacturing", xp: 4820, color: "#2ECC71" },
      { name: "Corporate",     xp: 3505, color: "#3DBBFF" },
      { name: "Logistics",     xp: 3100, color: "#E9A130" },
      { name: "IT",            xp: 2450, color: "#A06AB4" },
      { name: "HR",            xp: 1890, color: "#FF7B7B" },
    ];
    const maxXP = depts[0].xp;
    deptChartEl.innerHTML = depts.map((d, i) => `
      <div style="margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
          <span style="color:var(--text-muted); display:flex; align-items:center; gap:6px;">
            <span style="font-weight:700; color:rgba(255,255,255,0.4); width:14px;">${i+1}</span>
            ${d.name}
          </span>
          <span style="font-weight:700; color:var(--white);">${d.xp.toLocaleString()} XP</span>
        </div>
        <div style="height:8px; background:rgba(255,255,255,0.06); border-radius:4px; overflow:hidden;">
          <div style="height:100%; width:${((d.xp/maxXP)*100).toFixed(1)}%; background:${d.color}; border-radius:4px; transition:width 1s;"></div>
        </div>
      </div>
    `).join("");
  }

  // ── Leaderboards & other sections ─────────────────────────────────────────
  renderLeaderboard();

  // Active Challenges
  const chalGrid = document.getElementById("gam-challenges-grid");
  chalGrid.innerHTML = "";
  appState.challenges.forEach(ch => {
    if (ch.status === "Archived") return;

    let difficultyClass = "pill-low";
    if (ch.difficulty === "Medium") difficultyClass = "pill-medium";
    if (ch.difficulty === "Hard") difficultyClass = "pill-high";

    let statusPillClass = "pill-active";
    if (ch.status === "Draft") statusPillClass = "pill-draft";
    if (ch.status === "Completed") statusPillClass = "pill-completed";
    if (ch.status === "Under Review") statusPillClass = "pill-under-review";

    // Participation Status check for Current User
    const part = appState.currentUser ? appState.challengeParticipation.find(p => p.challenge === ch.title && p.employee === appState.currentUser.name) : null;
    
    let actionHtml = "";
    if (ch.status === "Draft") {
      actionHtml = `<button class="btn btn-secondary" onclick="activateChallenge('${ch.id}')" style="flex:1;">Publish & Activate</button>`;
    } else if (part) {
      if (part.status === "Completed") {
        actionHtml = `<button class="btn btn-secondary" style="flex:1;" disabled><i data-lucide="check"></i> Completed</button>`;
      } else if (part.status === "Under Review") {
        actionHtml = `<button class="btn btn-secondary" style="flex:1;" disabled>Under Review</button>`;
      } else {
        actionHtml = `<button class="btn btn-orange" onclick="openSubmitEvidenceModal('${ch.title}')" style="flex:1;">Submit Evidence</button>`;
      }
    } else {
      actionHtml = `<button class="btn btn-primary" onclick="joinChallenge('${ch.title}')" style="flex:1;">Join Challenge</button>`;
    }

    const card = document.createElement("div");
    card.className = "card col-4 challenge-card";
    card.innerHTML = `
      <div>
        <div class="challenge-header">
          <div class="challenge-title-group">
            <h4 style="font-size:15px; font-weight:600;">${ch.title}</h4>
            <span style="font-size:11px; color:var(--text-muted);">${ch.category}</span>
          </div>
          <span class="pill ${statusPillClass}">${ch.status}</span>
        </div>
        <p style="font-size:12px; color:var(--text-muted); margin: 10px 0;">${ch.desc}</p>
        <div class="challenge-meta-row">
          <div class="challenge-meta-item"><span style="color:var(--orange)">★</span> ${ch.xp} XP</div>
          <div class="challenge-meta-item"><span class="pill ${difficultyClass}">${ch.difficulty}</span></div>
          <div class="challenge-meta-item">Due: ${ch.deadline}</div>
        </div>
      </div>
      <div style="display:flex; gap:12px; margin-top:12px;">
        ${actionHtml}
        <button class="btn btn-ghost" style="padding: 8px;" onclick="archiveChallenge('${ch.id}')" title="Archive"><i data-lucide="trash-2"></i></button>
      </div>
    `;
    chalGrid.appendChild(card);
  });

  // Badge Gallery
  const badgeContainer = document.getElementById("gam-badges-grid");
  badgeContainer.innerHTML = "";
  appState.badges.forEach(badge => {
    const card = document.createElement("div");
    card.className = `badge-card ${badge.unlocked ? '' : 'locked'}`;
    
    // Select icon shape
    let iconHTML = `<i data-lucide="${badge.icon}"></i>`;

    card.innerHTML = `
      <div class="badge-icon" style="background-color: rgba(255,255,255,0.05); color: ${badge.color};">
        ${iconHTML}
      </div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-desc">${badge.desc}</div>
      <div style="font-size: 9px; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top:4px; width:100%;">
        ${badge.unlocked ? 'Unlocked' : `Requires: ${badge.rule}`}
      </div>
    `;
    badgeContainer.appendChild(card);
  });

  // Rewards catalog
  const rewardsContainer = document.getElementById("gam-rewards-grid");
  rewardsContainer.innerHTML = "";
  appState.rewards.forEach(rew => {
    const card = document.createElement("div");
    card.className = "reward-card";
    card.innerHTML = `
      <div class="reward-info">
        <h4>${rew.name}</h4>
        <p>${rew.desc}</p>
        <div class="reward-price">${rew.points} Points</div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:12px; margin-top:8px;">
        <span class="reward-stock">${rew.stock} remaining</span>
        <button class="btn btn-primary" style="padding:6px 12px; font-size:12px;" onclick="redeemReward('${rew.id}')" ${rew.stock <= 0 ? 'disabled' : ''}>Redeem</button>
      </div>
    `;
    rewardsContainer.appendChild(card);
  });

  // ── Activity Timeline ───────────────────────────────────────────────────────
  const timeline = document.getElementById("gam-activity-timeline");
  if (timeline) {
    const events = [
      { time: "Today 10:42", title: "Completed 'Zero Waste Day'", icon: "check-circle", color: "#2ECC71", xp: "+120 XP" },
      { time: "Yesterday 4:15", title: "Joined 'Cycle to Work Challenge'", icon: "bicycle", color: "#3DBBFF", xp: "+0 XP" },
      { time: "Jul 10", title: "Badge Unlocked: Eco Warrior", icon: "award", color: "#E9A130", xp: "🏅" },
      { time: "Jul 9", title: "Submitted Recycling Evidence", icon: "upload", color: "#A06AB4", xp: "+80 XP" },
      { time: "Jul 7", title: "Streak Milestone: 7 Days 🔥", icon: "flame", color: "#FF5A5A", xp: "+50 XP" },
    ];
    timeline.innerHTML = events.map(e => `
      <div style="display:flex; gap:14px; align-items:flex-start; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.04);">
        <div style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <i data-lucide="${e.icon}" style="width:14px; height:14px; color:${e.color};"></i>
        </div>
        <div style="flex:1;">
          <div style="font-size:12px; font-weight:600; color:var(--white);">${e.title}</div>
          <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${e.time}</div>
        </div>
        <span style="font-size:11px; font-weight:700; color:${e.color};">${e.xp}</span>
      </div>`).join("");
  }

  // ── Personal Achievements ───────────────────────────────────────────────────
  const achievGrid = document.getElementById("gam-achievements-grid");
  if (achievGrid) {
    const achieved = [
      { icon: "leaf", color: "#2ECC71", name: "Green Pioneer", desc: "First carbon log" },
      { icon: "award", color: "#E9A130", name: "Eco Warrior", desc: "Lv.3 reached" },
      { icon: "flame", color: "#FF5A5A", name: "7-Day Streak", desc: "Active 7 days" },
      { icon: "users", color: "#3DBBFF", name: "Team Player", desc: "Joined 5 challenges" },
    ];
    achievGrid.innerHTML = achieved.map(a => `
      <div class="col-6" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:12px; display:flex; align-items:center; gap:10px;">
        <div style="width:36px; height:36px; border-radius:8px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <i data-lucide="${a.icon}" style="width:16px; height:16px; color:${a.color};"></i>
        </div>
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--white);">${a.name}</div>
          <div style="font-size:10px; color:var(--text-muted);">${a.desc}</div>
        </div>
      </div>`).join("");
  }

  // ── Weekly Missions ─────────────────────────────────────────────────────────
  const missionsList = document.getElementById("gam-weekly-missions-list");
  if (missionsList) {
    const missions = [
      { title: "Log carbon data 3 times", progress: 3, total: 3, done: true },
      { title: "Join 1 new challenge", progress: 1, total: 1, done: true },
      { title: "Submit evidence for active challenge", progress: 0, total: 1, done: false },
      { title: "Invite 2 colleagues", progress: 1, total: 2, done: false },
    ];
    missionsList.innerHTML = missions.map(m => `
      <div style="display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
        <div style="width:18px; height:18px; border-radius:50%; border:2px solid ${m.done ? '#2ECC71' : 'rgba(255,255,255,0.2)'}; background:${m.done ? '#2ECC71' : 'transparent'}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          ${m.done ? `<i data-lucide="check" style="width:10px; height:10px; color:#000;"></i>` : ''}
        </div>
        <div style="flex:1;">
          <div style="font-size:12px; color:${m.done ? 'var(--text-muted)' : 'var(--white)'}; ${m.done ? 'text-decoration:line-through;' : ''}">${m.title}</div>
          <div style="height:4px; background:rgba(255,255,255,0.06); border-radius:2px; margin-top:4px; overflow:hidden;">
            <div style="height:100%; width:${((m.progress/m.total)*100).toFixed(0)}%; background:${m.done ? '#2ECC71' : '#E9A130'}; border-radius:2px;"></div>
          </div>
        </div>
        <span style="font-size:10px; color:var(--text-muted);">${m.progress}/${m.total}</span>
      </div>`).join("");
  }

  // ── Dept Competition Podium ─────────────────────────────────────────────────
  const podium = document.getElementById("gam-dept-podium-container");
  if (podium) {
    const top3 = [
      { rank: 2, name: "Corporate", xp: 3505, color: "#C0C0C0", h: 130 },
      { rank: 1, name: "Manufacturing", xp: 4820, color: "#FFD700", h: 170 },
      { rank: 3, name: "Logistics", xp: 3100, color: "#CD7F32", h: 100 },
    ];
    podium.innerHTML = top3.map(d => `
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <div style="font-size:11px; font-weight:700; color:${d.color};">${d.rank === 1 ? '👑 ' : ''}${d.name}</div>
        <div style="font-size:10px; color:var(--text-muted);">${d.xp.toLocaleString()} XP</div>
        <div style="width:80px; height:${d.h}px; background:linear-gradient(to top, ${d.color}22, ${d.color}44); border-radius:6px 6px 0 0; border:1px solid ${d.color}55; display:flex; align-items:flex-start; justify-content:center; padding-top:8px;">
          <span style="font-size:22px; font-weight:900; color:${d.color};">${d.rank}</span>
        </div>
      </div>`).join("");
  }

  // ── Dept Competition Table ──────────────────────────────────────────────────
  const deptTable = document.getElementById("gam-dept-competition-table");
  if (deptTable) {
    const depts = [
      { rank: 1, name: "Manufacturing", xp: 4820, carbon: "12,450 kg", challenges: 18, participation: "94%" },
      { rank: 2, name: "Corporate",     xp: 3505, carbon: "8,200 kg",  challenges: 12, participation: "78%" },
      { rank: 3, name: "Logistics",     xp: 3100, carbon: "7,800 kg",  challenges: 11, participation: "71%" },
      { rank: 4, name: "IT",            xp: 2450, carbon: "5,100 kg",  challenges: 8,  participation: "65%" },
      { rank: 5, name: "HR",            xp: 1890, carbon: "3,900 kg",  challenges: 6,  participation: "58%" },
    ];
    const medals = ["🥇", "🥈", "🥉", "", ""];
    deptTable.innerHTML = depts.map((d, i) => `
      <tr style="${i < 3 ? 'background:rgba(255,255,255,0.02);' : ''}">
        <td style="font-weight:700;">${medals[i]} ${d.rank}</td>
        <td style="font-weight:600; color:var(--white);">${d.name}</td>
        <td style="color:#E9A130;">${d.xp.toLocaleString()}</td>
        <td style="color:#2ECC71;">${d.carbon}</td>
        <td>${d.challenges}</td>
        <td><span style="color:${parseInt(d.participation) >= 80 ? '#2ECC71' : '#E9A130'};">${d.participation}</span></td>
      </tr>`).join("");
  }

  // ── Environmental Impact Counters ───────────────────────────────────────────
  const impactGrid = document.getElementById("gam-impact-counters-grid");
  if (impactGrid) {
    const impacts = [
      { icon: "cloud-off", color: "#2ECC71", value: "2,450 kg", label: "CO2 Avoided" },
      { icon: "droplets",  color: "#3DBBFF", value: "12,000 L", label: "Water Saved" },
      { icon: "trash-2",   color: "#E9A130", value: "180 kg",   label: "Waste Diverted" },
      { icon: "zap",       color: "#A06AB4", value: "340 kWh",  label: "Energy Saved" },
      { icon: "tree-pine", color: "#2ECC71", value: "4 Trees",  label: "Equivalent Planted" },
    ];
    impactGrid.innerHTML = impacts.map(im => `
      <div class="col-2 card hover-elevated" style="padding:16px; text-align:center;">
        <div style="width:40px; height:40px; border-radius:50%; background:${im.color}22; display:flex; align-items:center; justify-content:center; margin:0 auto 10px;">
          <i data-lucide="${im.icon}" style="width:18px; height:18px; color:${im.color};"></i>
        </div>
        <div style="font-size:18px; font-weight:800; color:var(--white);">${im.value}</div>
        <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">${im.label}</div>
      </div>`).join("");
  }

  // ── Personal Statistics (radar-style bar chart) ─────────────────────────────
  const statsEl = document.getElementById("chart-gam-personal-stats");
  if (statsEl) {
    const stats = [
      { label: "Carbon Logging",    pct: 88, color: "#2ECC71" },
      { label: "Challenge Completion", pct: 60, color: "#3DBBFF" },
      { label: "Social Engagement", pct: 75, color: "#A06AB4" },
      { label: "Governance Score",  pct: 92, color: "#E9A130" },
      { label: "Streak Consistency",pct: 57, color: "#FF7B7B" },
    ];
    statsEl.innerHTML = `<div style="display:flex; flex-direction:column; gap:10px;">` +
      stats.map(s => `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
            <span style="color:var(--text-muted);">${s.label}</span>
            <span style="font-weight:700; color:${s.color};">${s.pct}%</span>
          </div>
          <div style="height:8px; background:rgba(255,255,255,0.06); border-radius:4px; overflow:hidden;">
            <div style="height:100%; width:${s.pct}%; background:${s.color}; border-radius:4px; transition:width 1s;"></div>
          </div>
        </div>`).join("") + `</div>`;
  }

  // ── Activity Feed ───────────────────────────────────────────────────────────
  const feed = document.getElementById("gam-social-feed");
  if (feed) {
    const feedItems = [
      { name: "Aditi Rao",      action: "completed 'Zero Waste Week'",  time: "2h ago",   avatar: "A", color: "#2ECC71" },
      { name: "Raj Patel",      action: "unlocked badge 'Energy Saver'",time: "5h ago",   avatar: "R", color: "#E9A130" },
      { name: "Sarah Jenkins",  action: "joined 'EV Commute Challenge'",time: "Yesterday", avatar: "S", color: "#3DBBFF" },
      { name: "John Chen",      action: "climbed to Rank #6 globally",  time: "2 days ago",avatar: "J", color: "#A06AB4" },
    ];
    feed.innerHTML = feedItems.map(f => `
      <div style="display:flex; gap:12px; align-items:flex-start; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.04);">
        <div style="width:32px; height:32px; border-radius:50%; background:${f.color}33; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:${f.color}; flex-shrink:0;">${f.avatar}</div>
        <div style="flex:1;">
          <span style="font-size:12px; font-weight:700; color:var(--white);">${f.name}</span>
          <span style="font-size:12px; color:var(--text-muted);"> ${f.action}</span>
          <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${f.time}</div>
        </div>
      </div>`).join("");
  }

  // ── Smart Notifications ─────────────────────────────────────────────────────
  const notifStack = document.getElementById("gam-notifications-stack");
  if (notifStack) {
    const notifs = [
      { type: "success", icon: "check-circle", color: "#2ECC71", title: "Challenge Completed!", desc: "'Zero Waste Day' verified." },
      { type: "warn",    icon: "alert-triangle", color: "#E9A130", title: "Deadline Tomorrow",   desc: "Cycle to Work ends Jul 13." },
      { type: "info",    icon: "star",           color: "#3DBBFF", title: "New Badge Available!", desc: "Reach 2000 XP for Carbon Hero." },
      { type: "error",   icon: "clock",          color: "#FF5A5A", title: "Streak at Risk",      desc: "Log activity today to maintain 4-day streak." },
    ];
    notifStack.innerHTML = notifs.map(n => `
      <div style="display:flex; gap:10px; padding:10px; border-radius:8px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04);">
        <i data-lucide="${n.icon}" style="width:16px; height:16px; color:${n.color}; flex-shrink:0; margin-top:1px;"></i>
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--white);">${n.title}</div>
          <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${n.desc}</div>
        </div>
      </div>`).join("");
  }

  if (window.lucide) window.lucide.createIcons();
}

function renderLeaderboard() {
  const container = document.getElementById("gam-leaderboard");
  if (!container) return;
  container.innerHTML = "";

  // Combine real scores & dummy employees for leaderboard ranking
  const board = [
    { name: "Manufacturing Dept", type: "Dept", xp: 4820 },
    { name: "Aditi Rao", type: "User", xp: 3910 },
    { name: "Corporate Dept", type: "Dept", xp: 3505 },
    { name: "Logistics Team", type: "Dept", xp: 3100 },
    { name: appState.currentUser ? `${appState.currentUser.name} (You)` : "Amit Mehta", type: "User", xp: appState.currentUser ? appState.currentUser.xp : 1420, isMe: appState.isLoggedIn },
    { name: "John Chen", type: "User", xp: 1200 },
    { name: "Sarah Jenkins", type: "User", xp: 950 }
  ].sort((a,b) => b.xp - a.xp);

  board.forEach((row, idx) => {
    const rank = idx + 1;
    let rankClass = "rank-other";
    if (rank === 1) rankClass = "rank-1";
    if (rank === 2) rankClass = "rank-2";
    if (rank === 3) rankClass = "rank-3";

    const el = document.createElement("div");
    el.className = `leaderboard-row ${row.isMe ? 'my-row' : ''}`;
    el.innerHTML = `
      <div class="leaderboard-rank-name">
        <span class="leaderboard-rank ${rankClass}">${rank}</span>
        <div>
          <span style="font-weight:600;">${row.name}</span>
          <span style="font-size:10px; color:var(--text-muted); margin-left:8px; border: 1px solid var(--border-subtle); padding: 1px 4px; border-radius: 4px;">${row.type}</span>
        </div>
      </div>
      <span class="leaderboard-xp">${row.xp.toLocaleString()} XP</span>
    `;
    container.appendChild(el);
  });
}

// Render Reports & Analytics Center
function renderReports() {
  // Pre-fill Custom Report Builder Dropdowns
  const selectDept = document.getElementById("rep-build-dept");
  const selectCat = document.getElementById("rep-build-cat");

  if (selectDept && selectDept.children.length <= 1) {
    appState.departments.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.code;
      opt.textContent = d.name;
      selectDept.appendChild(opt);
    });
  }

  if (selectCat && selectCat.children.length <= 1) {
    appState.categories.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      selectCat.appendChild(opt);
    });
  }

  // Render Sparklines
  if (typeof renderSparkline === "function") {
    renderSparkline("sparkline-rep-env", [10, 20, 15, 30, 45, 60, 50, 70], "#2ECC71");
    renderSparkline("sparkline-rep-soc", [5, 10, 12, 8, 15, 20, 25, 30], "#3DBBFF");
    renderSparkline("sparkline-rep-gov", [40, 38, 35, 36, 30, 28, 25, 22], "#FF5A5A");
    renderSparkline("sparkline-rep-cus", [100, 120, 115, 140, 160, 180, 200, 215], "#E9A130");
    renderSparkline("sparkline-rep-sch", [5, 5, 6, 6, 8, 8, 10, 12], "#FF7B7B");
    renderSparkline("sparkline-rep-dl", [500, 600, 550, 700, 850, 1000, 1200, 1402], "#00E5FF");
  }

  // Render Templates Grid
  const templatesGrid = document.getElementById("rep-templates-grid");
  if (templatesGrid) {
    const templates = [
      { title: "Quarterly Carbon Emissions", icon: "cloud", color: "#2ECC71", desc: "Scope 1, 2, 3 footprint aggregation." },
      { title: "Supplier Code of Conduct", icon: "shield", color: "#FF5A5A", desc: "Pending compliance violations list." },
      { title: "Diversity & Inclusion Stats", icon: "users", color: "#3DBBFF", desc: "Demographics and hiring trends." },
      { title: "Waste Management Audit", icon: "trash-2", color: "#E9A130", desc: "Landfill vs recycled waste ratio." },
    ];
    templatesGrid.innerHTML = templates.map(t => `
      <div class="card col-3 hover-elevated" style="cursor:pointer;" onclick="alert('Opening Template: ${t.title}')">
        <div class="card-header">
          <span style="font-size:14px; font-weight:700; color:var(--white);">${t.title}</span>
          <i data-lucide="${t.icon}" style="width:16px; height:16px; color:${t.color};"></i>
        </div>
        <p style="font-size:11px; color:var(--text-muted); margin-top:8px;">${t.desc}</p>
        <button class="btn btn-secondary" style="margin-top:12px; width:100%; font-size:11px;">Generate</button>
      </div>
    `).join("");
  }

  // Render Heatmap
  const heatmapGrid = document.getElementById("rep-heatmap-grid");
  if (heatmapGrid) {
    const depts = ["Manufacturing", "Logistics", "IT", "HR"];
    const cats = ["Carbon", "Waste", "Water", "Diversity", "Training", "Compliance"];
    let html = `<div class="rep-heatmap-cell empty"></div>`;
    cats.forEach(c => html += `<div class="rep-heatmap-cell empty" style="color:var(--text-muted);">${c.substring(0,3)}</div>`);
    depts.forEach(d => {
      html += `<div class="rep-heatmap-cell empty" style="color:var(--text-muted); justify-content:flex-start;">${d}</div>`;
      cats.forEach(c => {
        const val = Math.random();
        const cls = val > 0.7 ? 'good' : (val > 0.3 ? 'fair' : 'poor');
        const score = Math.floor(Math.random() * 100);
        html += `<div class="rep-heatmap-cell ${cls}" title="${d} - ${c}: ${score}">${score}</div>`;
      });
    });
    heatmapGrid.style.gridTemplateColumns = `120px repeat(${cats.length}, 1fr)`;
    heatmapGrid.innerHTML = html;
  }

  // Render Recent Reports
  const recentGrid = document.getElementById("rep-recent-grid");
  if (recentGrid) {
    const recent = [
      { name: "Monthly ESG Executive Summary", date: "2 Hours Ago", user: "Amit Mehta", type: "PDF" },
      { name: "Logistics Carbon Footprint Q2", date: "Yesterday", user: "Sarah Jenkins", type: "Excel" },
      { name: "Compliance Audit Pending Fixes", date: "3 Days Ago", user: "Raj Patel", type: "CSV" },
    ];
    recentGrid.innerHTML = recent.map(r => `
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:36px; height:36px; border-radius:6px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center;">
            <i data-lucide="${r.type === 'PDF' ? 'file-text' : (r.type === 'Excel' ? 'table' : 'file')}" style="width:16px; height:16px; color:var(--primary-green);"></i>
          </div>
          <div>
            <div style="font-size:13px; font-weight:600; color:var(--white);">${r.name}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Generated by ${r.user} • ${r.date}</div>
          </div>
        </div>
        <button class="btn btn-ghost" style="padding:4px 8px;"><i data-lucide="download" style="width:14px; height:14px;"></i></button>
      </div>
    `).join("");
  }

  // Render Scheduled & Saved
  const schedList = document.getElementById("rep-scheduled-list");
  if (schedList) {
    schedList.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
        <div>Weekly Carbon Sync</div>
        <span style="color:var(--text-muted);">Every Mon</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
        <div>Monthly Exec ESG</div>
        <span style="color:var(--text-muted);">1st of Month</span>
      </div>
    `;
  }

  const savedList = document.getElementById("rep-saved-templates");
  if (savedList) {
    savedList.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; font-size:12px; padding:6px 0;">
        <i data-lucide="bookmark" style="width:12px; color:#3DBBFF;"></i> Q3 Manufacturing Audit
      </div>
      <div style="display:flex; align-items:center; gap:8px; font-size:12px; padding:6px 0;">
        <i data-lucide="bookmark" style="width:12px; color:#3DBBFF;"></i> IT Hardware Recycling
      </div>
    `;
  }

  // Render Timeline
  const timeline = document.getElementById("rep-timeline");
  if (timeline) {
    timeline.innerHTML = `
      <div style="border-left:2px solid var(--border-subtle); padding-left:16px; position:relative; margin-bottom:16px;">
        <div style="position:absolute; left:-6px; top:0; width:10px; height:10px; border-radius:50%; background:#2ECC71;"></div>
        <div style="font-size:10px; color:var(--text-muted);">Today, 10:42 AM</div>
        <div style="font-size:12px; font-weight:600; color:var(--white); margin-top:4px;">Annual Report Generated</div>
      </div>
      <div style="border-left:2px solid var(--border-subtle); padding-left:16px; position:relative; margin-bottom:16px;">
        <div style="position:absolute; left:-6px; top:0; width:10px; height:10px; border-radius:50%; background:#3DBBFF;"></div>
        <div style="font-size:10px; color:var(--text-muted);">Yesterday, 4:15 PM</div>
        <div style="font-size:12px; font-weight:600; color:var(--white); margin-top:4px;">New Template 'Supply Chain' created</div>
      </div>
      <div style="border-left:2px solid var(--border-subtle); padding-left:16px; position:relative;">
        <div style="position:absolute; left:-6px; top:0; width:10px; height:10px; border-radius:50%; background:var(--border-subtle);"></div>
        <div style="font-size:10px; color:var(--text-muted);">July 10, 2026</div>
        <div style="font-size:12px; font-weight:600; color:var(--white); margin-top:4px;">Automated Monthly Sync Completed</div>
      </div>
    `;
  }

  // Render AI Insights Grid
  const aiInsights = document.getElementById("rep-ai-insights-grid");
  if (aiInsights) {
    aiInsights.innerHTML = `
      <div class="col-4" style="background:rgba(255,255,255,0.02); padding:16px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <i data-lucide="trending-down" style="color:#2ECC71; margin-bottom:8px;"></i>
        <div style="font-size:11px; color:var(--text-muted);">Energy Efficiency</div>
        <div style="font-size:13px; font-weight:600; color:var(--white); margin-top:4px;">Facility B reduced energy usage by 14% this week.</div>
      </div>
      <div class="col-4" style="background:rgba(255,255,255,0.02); padding:16px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <i data-lucide="alert-circle" style="color:#FF5A5A; margin-bottom:8px;"></i>
        <div style="font-size:11px; color:var(--text-muted);">Compliance Risk</div>
        <div style="font-size:13px; font-weight:600; color:var(--white); margin-top:4px;">2 vendors missing updated Code of Conduct signatures.</div>
      </div>
      <div class="col-4" style="background:rgba(255,255,255,0.02); padding:16px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <i data-lucide="award" style="color:#E9A130; margin-bottom:8px;"></i>
        <div style="font-size:11px; color:var(--text-muted);">Social Goal</div>
        <div style="font-size:13px; font-weight:600; color:var(--white); margin-top:4px;">On track to hit 10,000 volunteer hours by Q4.</div>
      </div>
    `;
  }

  // Notifications Stack
  const notifStack = document.getElementById("rep-notifications-stack");
  if (notifStack) {
    notifStack.innerHTML = `
      <div style="display:flex; gap:10px; align-items:flex-start; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.05);">
        <div style="width:8px; height:8px; border-radius:50%; background:#2ECC71; margin-top:4px;"></div>
        <div>
          <div style="font-size:12px; font-weight:600; color:var(--white);">Q2 Report Approved</div>
          <div style="font-size:10px; color:var(--text-muted);">Approved by Board • 1h ago</div>
        </div>
      </div>
      <div style="display:flex; gap:10px; align-items:flex-start;">
        <div style="width:8px; height:8px; border-radius:50%; background:#FF5A5A; margin-top:4px;"></div>
        <div>
          <div style="font-size:12px; font-weight:600; color:var(--white);">Data Import Failed</div>
          <div style="font-size:10px; color:var(--text-muted);">ERP Integration error • 3h ago</div>
        </div>
      </div>
    `;
  }

  lucide.createIcons();
  
  if (typeof renderMockChart === "function") {
    renderMockChart("chart-rep-trends");
    renderMockChart("chart-rep-esg-donut");
    renderMockChart("chart-rep-comp-donut");
  }

  runReportPreview();
}

function renderMockChart(id) {
  const el = document.getElementById(id);
  if (!el) return;

  if (id === "chart-rep-trends") {
    // Multi-line SVG: Environmental vs Social Trends (6 months)
    const W = el.clientWidth || 500;
    const H = 240;
    const pad = { top: 20, right: 20, bottom: 36, left: 44 };
    const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const env   = [72, 68, 74, 70, 65, 61];   // lower = better (emissions)
    const soc   = [60, 65, 68, 72, 76, 80];   // higher = better (engagement)

    const allVals = [...env, ...soc];
    const minV = Math.min(...allVals) - 5;
    const maxV = Math.max(...allVals) + 5;
    const xScale = i => pad.left + (i / (months.length - 1)) * (W - pad.left - pad.right);
    const yScale = v => pad.top + (1 - (v - minV) / (maxV - minV)) * (H - pad.top - pad.bottom);

    const envPts = env.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
    const socPts = soc.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");

    // Fill areas
    const envArea = `${xScale(0)},${yScale(minV)} ` + env.map((v,i) => `${xScale(i)},${yScale(v)}`).join(" ") + ` ${xScale(env.length-1)},${yScale(minV)}`;
    const socArea = `${xScale(0)},${yScale(minV)} ` + soc.map((v,i) => `${xScale(i)},${yScale(v)}`).join(" ") + ` ${xScale(soc.length-1)},${yScale(minV)}`;

    const gridLines = [0.25, 0.5, 0.75, 1].map(t => {
      const y = pad.top + t * (H - pad.top - pad.bottom);
      const val = Math.round(maxV - t * (maxV - minV));
      return `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
              <text x="${pad.left - 6}" y="${y + 4}" fill="rgba(255,255,255,0.3)" font-size="9" text-anchor="end">${val}</text>`;
    }).join("");

    const xLabels = months.map((m, i) =>
      `<text x="${xScale(i)}" y="${H - 6}" fill="rgba(255,255,255,0.4)" font-size="10" text-anchor="middle">${m}</text>`
    ).join("");

    const envDots = env.map((v, i) =>
      `<circle cx="${xScale(i)}" cy="${yScale(v)}" r="3.5" fill="#2ECC71" stroke="#1a1a2e" stroke-width="2"/>`
    ).join("");
    const socDots = soc.map((v, i) =>
      `<circle cx="${xScale(i)}" cy="${yScale(v)}" r="3.5" fill="#3DBBFF" stroke="#1a1a2e" stroke-width="2"/>`
    ).join("");

    el.innerHTML = `
      <svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" style="overflow:visible;">
        <defs>
          <linearGradient id="envGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2ECC71" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#2ECC71" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3DBBFF" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#3DBBFF" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${gridLines}
        ${xLabels}
        <polygon points="${envArea}" fill="url(#envGrad)"/>
        <polygon points="${socArea}" fill="url(#socGrad)"/>
        <polyline points="${envPts}" fill="none" stroke="#2ECC71" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="${socPts}" fill="none" stroke="#3DBBFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${envDots}${socDots}
        <!-- Legend -->
        <circle cx="${W - 130}" cy="${pad.top + 4}" r="5" fill="#2ECC71"/>
        <text x="${W - 120}" y="${pad.top + 8}" fill="rgba(255,255,255,0.6)" font-size="10">Environmental</text>
        <circle cx="${W - 45}" cy="${pad.top + 4}" r="5" fill="#3DBBFF"/>
        <text x="${W - 35}" y="${pad.top + 8}" fill="rgba(255,255,255,0.6)" font-size="10">Social</text>
      </svg>`;
    return;
  }

  if (id === "chart-rep-esg-donut") {
    const W = el.clientWidth || 200;
    const H = 150;
    const cx = W / 2, cy = H / 2 - 5, r = 55, sw = 16;
    const circ = 2 * Math.PI * r;
    const segments = [
      { pct: 0.48, color: "#2ECC71", label: "Environmental" },
      { pct: 0.28, color: "#3DBBFF", label: "Social" },
      { pct: 0.24, color: "#A06AB4", label: "Governance" }
    ];
    let offset = 0;
    const arcs = segments.map(s => {
      const dash = s.pct * circ;
      const gap  = circ - dash;
      const svg  = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}" stroke-dashoffset="${(-offset * circ).toFixed(2)}" stroke-linecap="butt" transform="rotate(-90 ${cx} ${cy})"/>`;
      offset += s.pct;
      return svg;
    }).join("");

    el.innerHTML = `
      <svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"/>
        ${arcs}
        <text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="white" font-size="18" font-weight="800">86</text>
        <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="10">/ 100</text>
      </svg>`;
    return;
  }

  if (id === "chart-rep-comp-donut") {
    const W = el.clientWidth || 200;
    const H = 150;
    const cx = W / 2, cy = H / 2 - 5, r = 55, sw = 16;
    const circ = 2 * Math.PI * r;
    const pct = 0.942;
    const dash = pct * circ;
    const gap  = circ - dash;

    el.innerHTML = `
      <svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3DBBFF" stroke-width="${sw}"
          stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}" stroke-dashoffset="0"
          stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#FF5A5A" stroke-width="${sw}"
          stroke-dasharray="${(gap - 4).toFixed(2)} ${(dash + 4).toFixed(2)}" stroke-dashoffset="${(-(dash)).toFixed(2)}"
          stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
        <text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="white" font-size="17" font-weight="800">94.2%</text>
        <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="10">Compliant</text>
      </svg>`;
    return;
  }

  // Generic fallback
  el.innerHTML = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.15); border-radius:8px; color:var(--text-muted); font-size:12px;">Chart</div>`;
}

function runReportPreview() {
  const moduleFocus = document.getElementById("rep-build-module") ? document.getElementById("rep-build-module").value : "All";
  const tbody = document.getElementById("rep-preview-tbody");
  if (!tbody) return;
  
  tbody.innerHTML = "";

  // Aggregate items
  let filteredItems = [];

  if (moduleFocus === "All Modules" || moduleFocus === "Environmental") {
    appState.carbonTransactions.forEach(c => {
      filteredItems.push({
        module: "Environmental",
        date: c.date,
        details: `Carbon logged - Category: ${c.category} - ${c.desc}`,
        impact: `${c.value} kg CO2e`
      });
    });
  }

  if (moduleFocus === "All Modules" || moduleFocus === "Social") {
    appState.employeeParticipation.forEach(p => {
      filteredItems.push({
        module: "Social",
        date: p.date || "2026-07-06",
        details: `CSR activity completed by ${p.employee} : ${p.activity}`,
        impact: `+${p.points} XP earned`
      });
    });
  }

  if (moduleFocus === "All Modules" || moduleFocus === "Governance") {
    appState.complianceIssues.forEach(ci => {
      filteredItems.push({
        module: "Governance",
        date: ci.dueDate,
        details: `Compliance issue raised - Owner: ${ci.owner} - ${ci.desc}`,
        impact: `Severity: ${ci.severity} / Status: ${ci.status}`
      });
    });
  }

  if (filteredItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No records match the selected filters.</td></tr>`;
    return;
  }

  filteredItems.slice(0, 5).forEach(item => {
    const row = document.createElement("tr");
    const moduleColor = item.module === 'Environmental' ? 'low' : item.module === 'Social' ? 'completed' : 'high';
    const shortDesc = item.details.length > 60 ? item.details.substring(0, 60) + '…' : item.details;
    row.innerHTML = `
      <td style="white-space:nowrap;"><span class="pill pill-${moduleColor}" style="font-size:10px;">${item.module}</span></td>
      <td style="white-space:nowrap; color:var(--text-muted);">${item.date}</td>
      <td style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:0;" title="${item.details}">${shortDesc}</td>
      <td style="font-weight:600; text-align:right; white-space:nowrap;">${item.impact}</td>
    `;
    tbody.appendChild(row);
  });
}

function exportReport(format) {
  let data = "EcoSphere ESG Report Export\n";
  data += `Date Generated: ${new Date().toISOString().split('T')[0]}\n\n`;
  data += "Module,Date,Details,Impact\n";

  const rows = document.querySelectorAll("#rep-preview-tbody tr");
  rows.forEach(row => {
    const cols = row.querySelectorAll("td");
    if (cols.length >= 4) {
      const module = cols[0].innerText;
      const date = cols[1].innerText;
      const details = cols[2].innerText.replace(/,/g, ";");
      const impact = cols[3].innerText;
      data += `${module},${date},${details},${impact}\n`;
    }
  });

  const blob = new Blob([data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", `ecosphere_esg_report.${format === 'excel' ? 'csv' : format}`);
  a.click();
  
  addSystemNotification(`Report exported successfully as ${format.toUpperCase()}`, "approvals");
}

function generateReportPDF(type) {
  addSystemNotification(`Generating ${type.toUpperCase()} Report PDF...`, "approvals");
  setTimeout(() => {
    addSystemNotification(`Report generation completed.`, "success");
  }, 1500);
}

// Render Settings Page
function renderSettings() {
  document.getElementById("set-toggle-auto").checked = appState.config.autoEmission;
  document.getElementById("set-toggle-evidence").checked = appState.config.evidenceRequired;
  document.getElementById("set-toggle-badge").checked = appState.config.badgeAutoAward;

  // Render weights inputs
  document.getElementById("set-weight-env").value = appState.config.weights.environmental;
  document.getElementById("set-weight-env-val").textContent = `${appState.config.weights.environmental}%`;
  
  document.getElementById("set-weight-soc").value = appState.config.weights.social;
  document.getElementById("set-weight-soc-val").textContent = `${appState.config.weights.social}%`;

  document.getElementById("set-weight-gov").value = appState.config.weights.governance;
  document.getElementById("set-weight-gov-val").textContent = `${appState.config.weights.governance}%`;

  // Notification toggles
  document.getElementById("set-notif-comp").checked = appState.config.notifications.compliance;
  document.getElementById("set-notif-app").checked = appState.config.notifications.approvals;
  document.getElementById("set-notif-policy").checked = appState.config.notifications.policy;
  document.getElementById("set-notif-badge").checked = appState.config.notifications.badges;
}

function updateWeights() {
  if (!appState.isLoggedIn || appState.currentUser.name !== "Amit Mehta") {
    alert("Unauthorized. Only the Admin (Amit Mehta) can modify configurations.");
    return;
  }
  const env = parseInt(document.getElementById("set-weight-env").value);
  const soc = parseInt(document.getElementById("set-weight-soc").value);
  const gov = parseInt(document.getElementById("set-weight-gov").value);

  // Normalize to 100
  const total = env + soc + gov;
  
  appState.config.weights.environmental = env;
  appState.config.weights.social = soc;
  appState.config.weights.governance = gov;

  localStorage.setItem("appStateConfig", JSON.stringify(appState.config));

  document.getElementById("set-weight-env-val").textContent = `${env}%`;
  document.getElementById("set-weight-soc-val").textContent = `${soc}%`;
  document.getElementById("set-weight-gov-val").textContent = `${gov}%`;

  // Visual warning if weight doesn't sum to exactly 100
  const warningEl = document.getElementById("weight-total-warning");
  if (total !== 100) {
    warningEl.style.display = "block";
    warningEl.textContent = `Current Total: ${total}% (Weights must sum to 100% for correct scoring aggregation).`;
  } else {
    warningEl.style.display = "none";
  }
}

function saveSettings() {
  if (!appState.isLoggedIn || appState.currentUser.name !== "Amit Mehta") {
    alert("Unauthorized. Only the Admin (Amit Mehta) can modify configurations.");
    return;
  }
  appState.config.autoEmission = document.getElementById("set-toggle-auto").checked;
  appState.config.evidenceRequired = document.getElementById("set-toggle-evidence").checked;
  appState.config.badgeAutoAward = document.getElementById("set-toggle-badge").checked;

  appState.config.notifications.compliance = document.getElementById("set-notif-comp").checked;
  appState.config.notifications.approvals = document.getElementById("set-notif-app").checked;
  appState.config.notifications.policy = document.getElementById("set-notif-policy").checked;
  appState.config.notifications.badges = document.getElementById("set-notif-badge").checked;

  localStorage.setItem("appStateConfig", JSON.stringify(appState.config));

  // Sync quick profile checkboxes
  const notifsOn = appState.config.notifications.compliance || appState.config.notifications.approvals;
  const toggles = document.querySelectorAll("#quick-toggle-notif, #guest-toggle-notif");
  toggles.forEach(t => t.checked = notifsOn);

  renderNotificationIcon();
  addSystemNotification("Configuration saved successfully", "approvals");
  alert("Settings saved successfully.");
}

// Business Rules Engine & Workflows

// 1. Reward Redemption
function redeemReward(rewardId) {
  const rew = appState.rewards.find(r => r.id === rewardId);
  if (!rew) return;

  if (appState.currentUser.xp < rew.points) {
    alert(`Insufficient XP. You need ${rew.points} XP, but you only have ${appState.currentUser.xp} XP.`);
    return;
  }

  if (rew.stock <= 0) {
    alert("Out of stock! This reward cannot be redeemed at the moment.");
    return;
  }

  // Deduct point, update stock
  appState.currentUser.xp -= rew.points;
  rew.stock -= 1;

  // Trigger Notification
  addSystemNotification(`Successfully redeemed reward: ${rew.name}! Deducted ${rew.points} Points.`, "approvals");
  
  // Re-render
  renderGamification();
}

// 2. Notification System
function addSystemNotification(text, type) {
  // Check settings if notification is enabled for this type
  if (type === "compliance" && !appState.config.notifications.compliance) return;
  if (type === "approvals" && !appState.config.notifications.approvals) return;
  if (type === "policy" && !appState.config.notifications.policy) return;
  if (type === "badge" && !appState.config.notifications.badges) return;

  const newNotif = {
    id: "n" + (appState.notifications.length + 1),
    text: text,
    type: type,
    time: "Just now",
    unread: true
  };
  
  appState.notifications.unshift(newNotif);
  renderNotificationIcon();
  renderNotificationDrawer();
}

function renderNotificationIcon() {
  const bellBtn = document.getElementById("bell-btn");
  if (!bellBtn) return;

  const notifsOn = appState.config.notifications.compliance || appState.config.notifications.approvals;
  const unreadCount = appState.notifications.filter(n => n.unread).length;

  if (notifsOn) {
    bellBtn.innerHTML = `
      <i data-lucide="bell"></i>
      <span class="bell-badge" id="bell-badge" style="display: ${unreadCount > 0 ? 'block' : 'none'};"></span>
    `;
    const badge = document.getElementById("bell-badge");
    if (badge && unreadCount > 0) {
      badge.textContent = unreadCount;
    }
  } else {
    bellBtn.innerHTML = `
      <i data-lucide="bell-off" style="color: var(--text-muted);"></i>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
}

function renderNotificationDrawer() {
  const container = document.getElementById("drawer-notifications-list");
  if (!container) return;
  container.innerHTML = "";

  appState.notifications.forEach(n => {
    const el = document.createElement("div");
    el.className = `notification-item ${n.unread ? 'unread' : ''}`;
    el.innerHTML = `
      <div style="font-weight:600; text-transform:capitalize; font-size:11px; margin-bottom:2px; color:var(--primary-green);">${n.type}</div>
      <div>${n.text}</div>
      <div class="notification-time">${n.time}</div>
    `;
    
    // Clear unread on click
    el.addEventListener("click", () => {
      n.unread = false;
      el.classList.remove("unread");
      renderNotificationIcon();
    });

    container.appendChild(el);
  });
}

function toggleNotificationDrawer() {
  const drawer = document.getElementById("notif-drawer");
  drawer.classList.toggle("active");
}

// 3. Auto Emission Calculation Simulator
function handleCarbonTransactionSubmit(event) {
  event.preventDefault();
  const date = document.getElementById("carb-form-date").value;
  const deptCode = document.getElementById("carb-form-dept").value;
  const sourceFactor = document.getElementById("carb-form-source").value;
  const quantityInput = parseFloat(document.getElementById("carb-form-qty").value);
  const manualCarbonInput = parseFloat(document.getElementById("carb-form-manual").value);

  const deptName = appState.departments.find(d => d.code === deptCode)?.name || "Corporate";
  const factorObj = appState.emissionFactors.find(f => f.source === sourceFactor);

  let calculatedCarbon = 0;
  let finalDesc = "";

  if (appState.config.autoEmission && factorObj) {
    // Auto calculate
    calculatedCarbon = Math.round(quantityInput * factorObj.factor);
    finalDesc = `Auto Carbon Log - ${factorObj.source} : ${quantityInput} units`;
  } else {
    // Manual entry
    calculatedCarbon = Math.round(manualCarbonInput);
    finalDesc = `Manual Carbon Log - Custom source / direct transaction entry`;
  }

  // Push transaction
  appState.carbonTransactions.unshift({
    date: date,
    department: deptName,
    category: factorObj ? factorObj.category : "Custom",
    desc: finalDesc,
    value: calculatedCarbon
  });

  // Dynamically update carbon emission score for department
  // (Decrease score values slightly as carbon transactions increase, simulating true compliance scoring)
  if (appState.scores.departments[deptCode]) {
    const dec = Math.round(calculatedCarbon / 1000);
    appState.scores.departments[deptCode].environmental = Math.max(20, appState.scores.departments[deptCode].environmental - dec);
  }

  // Clear modal and re-render environmental tab
  closeModal("log-carbon-modal");
  switchTab("environmental");
  addSystemNotification(`Aggregated carbon footprint logged for ${deptName}: ${calculatedCarbon.toLocaleString()} kg CO2e`, "compliance");
  saveAppStateTransactional();
}

// 4. Evidence Requirement for CSR Approvals
function approveParticipation(employee, activityTitle) {
  const part = appState.employeeParticipation.find(p => p.employee === employee && p.activity === activityTitle);
  if (!part) return;

  // Check toggle config
  if (appState.config.evidenceRequired && (!part.proof || part.proof.trim() === "")) {
    alert(`Cannot approve CSR participation. Evidence/proof file is mandatory under current system settings.`);
    return;
  }

  part.status = "Completed";
  
  // Award points/XP to current user if matches
  if (employee === appState.currentUser.name) {
    appState.currentUser.xp += part.points;
    // Auto badge award check
    checkBadgeAwards();
  }

  addSystemNotification(`CSR Activity approved: '${activityTitle}' for employee ${employee}.`, "approvals");
  renderSocial();
  saveAppStateTransactional();
}

function handleLogParticipationSubmit(event) {
  event.preventDefault();
  const activityTitle = document.getElementById("part-activity-title").value;
  
  let employee = "Guest User";
  if (appState.isLoggedIn && appState.currentUser) {
    employee = appState.currentUser.name;
  } else {
    const nameInput = document.getElementById("part-employee-name");
    if (nameInput && nameInput.value.trim()) {
      employee = nameInput.value.trim();
    }
  }

  const proof = document.getElementById("part-proof").value;

  const activity = appState.csrActivities.find(c => c.title === activityTitle);
  const xp = activity ? activity.xp : 100;

  appState.employeeParticipation.unshift({
    employee: employee,
    activity: activityTitle,
    proof: proof,
    status: "Under Review",
    points: xp,
    date: new Date().toISOString().split('T')[0]
  });

  closeModal("log-participation-modal");
  renderSocial();
  addSystemNotification(`Logged participation in '${activityTitle}'. Waiting for admin review.`, "approvals");
  saveAppStateTransactional();
}

// 5. Badge Auto-Award Engine
function checkBadgeAwards() {
  if (!appState.config.badgeAutoAward) return;

  const xpVal = appState.currentUser.xp;
  const completedChallenges = appState.challengeParticipation.filter(p => p.employee === appState.currentUser.name && p.status === "Completed").length;

  appState.badges.forEach(badge => {
    if (badge.unlocked) return; // Already unlocked

    let shouldUnlock = false;
    if (badge.rule.includes("XP") && xpVal >= parseInt(badge.rule.split(">=")[1])) {
      shouldUnlock = true;
    } else if (badge.rule.includes("Challenges") && completedChallenges >= parseInt(badge.rule.split(">=")[1])) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      badge.unlocked = true;
      appState.currentUser.badges.push(badge.name);
      addSystemNotification(`🏆 Congratulations! You unlocked the '${badge.name}' Badge!`, "badge");
    }
  });
}

// 6. Policy Acknowledgment
function acknowledgePolicy(policyCode) {
  if (!appState.isLoggedIn || !appState.currentUser) {
    alert("Please sign in to acknowledge official corporate compliance policies.");
    window.location.href = "login.html";
    return;
  }
  const ack = appState.policyAcknowledgements.find(a => a.employee === appState.currentUser.name && a.policy === policyCode);
  
  if (ack) {
    ack.status = "Completed";
    ack.date = new Date().toISOString().split('T')[0];
  } else {
    appState.policyAcknowledgements.push({
      employee: appState.currentUser.name,
      policy: policyCode,
      date: new Date().toISOString().split('T')[0],
      status: "Completed"
    });
  }

  // Award XP for policy acknowledgement
  appState.currentUser.xp += 50;
  checkBadgeAwards();

  addSystemNotification(`Policy ${policyCode} Acknowledged (+50 XP)`, "policy");
  renderGovernance();
  saveAppStateTransactional();
}

// 7. Compliance Issues & Audits
function handleAuditSubmit(event) {
  event.preventDefault();
  const title = document.getElementById("aud-title").value;
  const auditor = document.getElementById("aud-auditor").value;
  const deptCode = document.getElementById("aud-dept").value;
  const findings = document.getElementById("aud-findings").value;
  const date = document.getElementById("aud-date").value;

  const deptName = appState.departments.find(d => d.code === deptCode)?.name || "Corporate";

  // Create Audit
  appState.audits.unshift({
    id: "aud" + (appState.audits.length + 1),
    title: title,
    auditor: auditor,
    department: deptName,
    date: date,
    findings: findings,
    status: "Completed"
  });

  // Raise immediate Compliance Issue if findings checkmark is enabled
  const raiseIssue = document.getElementById("aud-raise-issue").checked;
  if (raiseIssue) {
    const severity = document.getElementById("aud-issue-sev").value;
    const owner = document.getElementById("aud-issue-owner").value;
    const dueDate = document.getElementById("aud-issue-due").value;

    appState.complianceIssues.unshift({
      id: "ci" + (appState.complianceIssues.length + 1),
      desc: `Audit issue: ${findings}`,
      severity: severity,
      department: deptName,
      owner: owner,
      dueDate: dueDate,
      status: "Open",
      audit: title
    });

    addSystemNotification(`New compliance issue raised in ${deptName} owned by ${owner}.`, "compliance");
  }

  closeModal("log-audit-modal");
  renderGovernance();
  saveAppStateTransactional();
}

function resolveComplianceIssue(issueId) {
  const issue = appState.complianceIssues.find(i => i.id === issueId);
  if (!issue) return;

  issue.status = "Resolved";
  addSystemNotification(`Compliance issue successfully resolved: '${issue.desc}'`, "compliance");
  renderGovernance();
  saveAppStateTransactional();
}

// 8. Challenge lifecycle methods
function activateChallenge(id) {
  const ch = appState.challenges.find(c => c.id === id);
  if (ch) {
    ch.status = "Active";
    addSystemNotification(`New Sustainability Challenge published: '${ch.title}'`, "approvals");
    renderGamification();
    saveAppStateTransactional();
  }
}

function archiveChallenge(id) {
  const ch = appState.challenges.find(c => c.id === id);
  if (ch) {
    ch.status = "Archived";
    addSystemNotification(`Challenge '${ch.title}' has been archived`, "approvals");
    renderGamification();
    saveAppStateTransactional();
  }
}

function joinChallenge(title) {
  if (!appState.isLoggedIn || !appState.currentUser) {
    alert("Please sign in to participate in sustainability challenges.");
    window.location.href = "login.html";
    return;
  }
  appState.challengeParticipation.push({
    challenge: title,
    employee: appState.currentUser.name,
    progress: 0,
    proof: "",
    status: "Active",
    xp: appState.challenges.find(c => c.title === title)?.xp || 100,
    date: ""
  });
  renderGamification();
  saveAppStateTransactional();
}

function openSubmitEvidenceModal(title) {
  if (!appState.isLoggedIn || !appState.currentUser) {
    alert("Please sign in to submit challenge evidence.");
    window.location.href = "login.html";
    return;
  }
  document.getElementById("submit-ev-title").value = title;
  openModal("submit-evidence-modal");
}

function handleChallengeEvidenceSubmit(event) {
  event.preventDefault();
  const title = document.getElementById("submit-ev-title").value;
  const proof = document.getElementById("submit-ev-proof").value;

  const part = appState.challengeParticipation.find(p => p.challenge === title && p.employee === appState.currentUser.name);
  if (part) {
    part.proof = proof;
    part.progress = 100;
    part.status = "Completed"; // Auto completion for hackathon convenience
    part.date = new Date().toISOString().split('T')[0];

    appState.currentUser.xp += part.xp;
    checkBadgeAwards();

    addSystemNotification(`Challenge completed: '${title}'! +${part.xp} XP awarded.`, "badge");
  }

  closeModal("submit-evidence-modal");
  renderGamification();
  saveAppStateTransactional();
}

function openLogParticipationModal(activityTitle) {
  const selectEl = document.getElementById("part-activity-title");
  if (selectEl) {
    selectEl.innerHTML = "";
    appState.csrActivities.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.title;
      opt.textContent = c.title;
      selectEl.appendChild(opt);
    });
    if (activityTitle) {
      selectEl.value = activityTitle;
    }
  }

  const nameGroup = document.getElementById("part-employee-name-group");
  const nameInput = document.getElementById("part-employee-name");
  if (nameGroup && nameInput) {
    if (appState.isLoggedIn && appState.currentUser) {
      nameInput.value = appState.currentUser.name;
      nameGroup.style.display = "none";
      nameInput.removeAttribute("required");
    } else {
      nameInput.value = "";
      nameGroup.style.display = "block";
      nameInput.setAttribute("required", "required");
    }
  }
  openModal("log-participation-modal");
}

function handleNewChallengeSubmit(event) {
  event.preventDefault();
  const title = document.getElementById("new-ch-title").value;
  const categoryName = document.getElementById("new-ch-cat").value;
  const desc = document.getElementById("new-ch-desc").value;
  const xp = parseInt(document.getElementById("new-ch-xp").value);
  const difficulty = document.getElementById("new-ch-diff").value;
  const evidence = document.getElementById("new-ch-ev").value;
  const deadline = document.getElementById("new-ch-due").value;
  const status = document.getElementById("new-ch-status").value;

  appState.challenges.unshift({
    id: "ch" + (appState.challenges.length + 1),
    title: title,
    category: categoryName,
    desc: desc,
    xp: xp,
    difficulty: difficulty,
    evidence: evidence,
    deadline: deadline,
    status: status
  });

  if (status === "Active") {
    addSystemNotification(`New Sustainability Challenge published: '${title}'`, "approvals");
  } else {
    addSystemNotification(`Created challenge draft: '${title}'`, "approvals");
  }

  closeModal("new-challenge-modal");
  renderGamification();
  saveAppStateTransactional();
}

function handleNewGoalSubmit(event) {
  event.preventDefault();
  if (!appState.isLoggedIn || !appState.currentUser) {
    alert("Please sign in to create sustainability goals.");
    window.location.href = "login.html";
    return;
  }
  const name = document.getElementById("new-goal-name").value;
  const target = parseFloat(document.getElementById("new-goal-target").value);
  const unit = document.getElementById("new-goal-unit").value;
  const current = parseFloat(document.getElementById("new-goal-progress").value);
  const owner = document.getElementById("new-goal-owner").value;
  const priority = document.getElementById("new-goal-priority").value;
  const deadline = document.getElementById("new-goal-due").value;
  
  if (!appState.goals) appState.goals = [];
  
  appState.goals.push({
    name: name,
    target: target,
    unit: unit,
    current: current,
    owner: owner,
    priority: priority,
    deadline: deadline,
    status: "Active"
  });
  
  closeModal("new-goal-modal");
  renderEnvironmental();
  addSystemNotification(`Sustainability target created: '${name}'`, "approvals");
  saveAppStateTransactional();
}

// Modal Helpers
function openModal(id) {
  const backdrop = document.getElementById(id);
  if (backdrop) backdrop.classList.add("active");
}

function closeModal(id) {
  const backdrop = document.getElementById(id);
  if (backdrop) backdrop.classList.remove("active");
}

// Dynamic Toggling of Inputs on Modal
function handleAutoEmissionToggleInForm() {
  const checked = appState.config.autoEmission;
  const qtyGroup = document.getElementById("form-group-quantity");
  const manualGroup = document.getElementById("form-group-manual");

  if (checked) {
    qtyGroup.style.display = "block";
    manualGroup.style.display = "none";
  } else {
    qtyGroup.style.display = "none";
    manualGroup.style.display = "block";
  }
}

// Login Management
function checkAuth() {
  if (!appState.isLoggedIn) {
    openModal("login-modal");
    return false;
  }
  return true;
}

function triggerLogCarbon() {
  if (!checkAuth()) return;
  openModal('log-carbon-modal');
}

function triggerNewChallenge() {
  if (!checkAuth()) return;
  openModal('new-challenge-modal');
}

function triggerLogParticipation() {
  if (!checkAuth()) return;
  openModal('log-participation-modal');
}

function triggerLogAudit() {
  if (!checkAuth()) return;
  openModal('log-audit-modal');
}

function handleProfileWidgetClick() {
  if (!appState.isLoggedIn) {
    window.location.href = "login.html";
  }
}

function handleSidebarAuthAction(event) {
  if (event) event.preventDefault();
  if (appState.isLoggedIn) {
    handleLogout();
  } else {
    window.location.href = "login.html";
  }
}
function renderAuthWidgets() {
  const profileWidget = document.getElementById("user-profile-widget");
  const sidebarAuthBtn = document.getElementById("sidebar-auth-btn");

  if (!profileWidget || !sidebarAuthBtn) return;

  if (appState.isLoggedIn && appState.currentUser) {
    let avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
    if (appState.currentUser.name === "Priya Sharma") {
      avatarUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80";
    } else if (appState.currentUser.name === "Rajiv Nair") {
      avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80";
    } else if (appState.currentUser.avatar) {
      avatarUrl = appState.currentUser.avatar;
    }

    profileWidget.innerHTML = `
      <img src="${avatarUrl}" alt="Profile" class="profile-pic">
      <div>
        <div class="username">${appState.currentUser.name}</div>
        <div style="font-size:10px; color:var(--text-muted);">${appState.currentUser.role}</div>
      </div>
    `;
    sidebarAuthBtn.innerHTML = `<i data-lucide="log-out"></i> Sign Out`;
  } else {
    profileWidget.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <div style="width:32px; height:32px; border-radius:50%; background-color:var(--gray); display:flex; align-items:center; justify-content:center; color:var(--text-muted);"><i data-lucide="user"></i></div>
        <div>
          <div class="username" style="font-size:12px; font-weight:600; color:var(--primary-green);">Guest User</div>
          <div style="font-size:10px; color:var(--text-muted);">Click to Sign In</div>
        </div>
      </div>
    `;
    sidebarAuthBtn.innerHTML = `<i data-lucide="log-in"></i> Sign In`;
  }

  // Handle sidebar Settings item visibility based on admin privileges (Amit Mehta is Admin)
  const settingsLink = document.getElementById("sidebar-settings-link");
  if (settingsLink) {
    if (appState.isLoggedIn && appState.currentUser && appState.currentUser.name === "Amit Mehta") {
      settingsLink.style.display = "flex";
    } else {
      settingsLink.style.display = "none";
    }
  }

  // Draw the hover card content dynamically
  renderQuickProfileCard();

  if (window.lucide) window.lucide.createIcons();
}

function renderQuickProfileCard() {
  const card = document.getElementById("quick-profile-card");
  if (!card) return;

  if (appState.isLoggedIn && appState.currentUser) {
    const user = appState.currentUser;
    let avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
    let empId = "EMP-1024";
    let scoreEnv = 82;
    let scoreSoc = 91;
    let scoreGov = 79;
    let rank = "#12";
    let trees = 3;
    let carbon = 48;
    let goalProgress = 78;
    let timeline = [
      { text: "✔ Completed Recycling Challenge", time: "2 hours ago" },
      { text: "🏆 Earned Green Hero Badge", time: "Yesterday" },
      { text: "📄 Accepted New ESG Policy", time: "2 days ago" },
      { text: "🤝 Joined CSR Activity", time: "3 days ago" }
    ];
    let coachInsight = "Your environmental score increased by 6% this month. Completing one more challenge will move you into the Top 10 leaderboard. Reducing paper consumption by 10% could increase your ESG score by 3 points.";

    // Match hackathon specific user profile statistics dynamically
    if (user.name === "Amit Mehta") {
      avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
      empId = "EMP-1012";
      scoreEnv = 94;
      scoreSoc = 90;
      scoreGov = 95;
      rank = "#5";
      trees = 12;
      carbon = 180;
      goalProgress = 85;
      timeline = [
        { text: "✔ Completed recycling challenge", time: "2 hours ago" },
        { text: "🏆 Earned Carbon Saver badge", time: "Yesterday" },
        { text: "📄 Signed Zero Waste & Plastic Ban policy", time: "2 days ago" },
        { text: "🤝 Joined reforestation CSR drive", time: "3 days ago" }
      ];
      coachInsight = "Your environmental score increased by 6% this month. Completing one more challenge will move you into the Top 5 leaderboard. Reducing paper consumption by 10% could increase your ESG score by 3 points.";
    } else if (user.name === "Priya Sharma") {
      avatarUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80";
      empId = "EMP-1018";
      scoreEnv = 82;
      scoreSoc = 75;
      scoreGov = 88;
      rank = "#8";
      trees = 7;
      carbon = 95;
      goalProgress = 72;
      timeline = [
        { text: "✔ Approved manufacturing carbon checklist", time: "3 hours ago" },
        { text: "🏆 Earned Green Leader badge", time: "2 days ago" },
        { text: "📄 Acknowledged supplier codes compliance", time: "4 days ago" },
        { text: "🤝 Commenced electronic waste recycling", time: "1 week ago" }
      ];
      coachInsight = "Manufacturing score is up 4% due to waste management improvements. Standardizing chemical logs will push Governance score above 90. Commuting green will save 12kg of CO2 this week.";
    } else if (user.name === "Rajiv Nair") {
      avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80";
      empId = "EMP-1020";
      scoreEnv = 68;
      scoreSoc = 60;
      scoreGov = 72;
      rank = "#12";
      trees = 4;
      carbon = 48;
      goalProgress = 58;
      timeline = [
        { text: "✔ Logged 1200L fleet diesel refuel", time: "Yesterday" },
        { text: "🤝 Commenced green commute trial", time: "Yesterday" },
        { text: "📄 Signed anti-corruption code POL-01", time: "3 days ago" },
        { text: "🏆 Registered green commute profile", time: "5 days ago" }
      ];
      coachInsight = "Logistics carbon footprint is high this period. Calibration of fleet truck odometers will save 2% fuel. Complete the 'Commute Green Challenge' to earn 120 XP.";
    }

    const w = appState.config.weights;
    const overallScore = Math.round((scoreEnv * w.environmental + scoreSoc * w.social + scoreGov * w.governance) / 100);

    card.innerHTML = `
      <!-- Header -->
      <div class="quick-profile-header">
        <div class="quick-profile-avatar-container">
          <img src="${avatarUrl}" alt="${user.name}" class="quick-profile-avatar">
          <span class="quick-profile-online-indicator"></span>
        </div>
        <div class="quick-profile-meta">
          <div class="quick-profile-name">${user.name}</div>
          <div class="quick-profile-role">${user.role}</div>
          <div class="quick-profile-dept">${user.department} Department</div>
          <div class="quick-profile-empid">Employee ID: ${empId}</div>
        </div>
        <div class="quick-profile-score-pill">
          <div style="font-size: 8px; text-transform: uppercase; color: var(--text-muted);">ESG Score</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--primary-green);">${overallScore} <span style="font-size:10px; font-weight:normal; color:var(--text-muted);">/ 100</span></div>
        </div>
      </div>

      <!-- Second Section: 2x2 Stats Grid -->
      <div class="quick-profile-section">
        <div class="quick-profile-stats-grid">
          <div class="quick-profile-stat-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2px;">
              <span class="quick-profile-stat-icon" style="color:var(--primary-green);"><i data-lucide="leaf"></i></span>
              <span style="font-size: 10px; color: var(--primary-green); font-weight:600; display:flex; align-items:center;"><i data-lucide="trending-up" style="width:12px; height:12px;"></i></span>
            </div>
            <div class="quick-profile-stat-value">${scoreEnv}</div>
            <div class="quick-profile-stat-label">Environmental</div>
          </div>

          <div class="quick-profile-stat-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2px;">
              <span class="quick-profile-stat-icon" style="color:var(--blue);"><i data-lucide="users"></i></span>
              <span style="font-size: 10px; color: var(--blue); font-weight:600; display:flex; align-items:center;"><i data-lucide="trending-up" style="width:12px; height:12px;"></i></span>
            </div>
            <div class="quick-profile-stat-value">${scoreSoc}</div>
            <div class="quick-profile-stat-label">Social Score</div>
          </div>

          <div class="quick-profile-stat-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2px;">
              <span class="quick-profile-stat-icon" style="color:var(--purple);"><i data-lucide="scale"></i></span>
              <span style="font-size: 10px; color: var(--text-muted); font-weight:600; display:flex; align-items:center;"><i data-lucide="minus" style="width:12px; height:12px;"></i></span>
            </div>
            <div class="quick-profile-stat-value">${scoreGov}</div>
            <div class="quick-profile-stat-label">Governance</div>
          </div>

          <div class="quick-profile-stat-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2px;">
              <span class="quick-profile-stat-icon" style="color:var(--orange);"><i data-lucide="medal"></i></span>
              <span style="font-size: 10px; color: var(--orange); font-weight:600; display:flex; align-items:center;"><i data-lucide="trending-up" style="width:12px; height:12px;"></i></span>
            </div>
            <div class="quick-profile-stat-value">${rank}</div>
            <div class="quick-profile-stat-label">Current Rank</div>
          </div>
        </div>
      </div>

      <!-- Third Section: Progress & Stats -->
      <div class="quick-profile-section" style="display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; justify-content:space-between; font-size:12px;">
          <span style="color:var(--text-muted);">XP Earned</span>
          <span style="font-weight:600; color:var(--white);">${user.xp} XP</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12px;">
          <span style="color:var(--text-muted);">Current Badge</span>
          <span style="font-weight:600; color:var(--orange);">🌱 ${user.badges[user.badges.length - 1]}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12px;">
          <span style="color:var(--text-muted);">Carbon Saved</span>
          <span style="font-weight:600; color:var(--primary-green);">${carbon} kg CO₂ (${trees} Trees)</span>
        </div>
        
        <div style="margin-top:4px;">
          <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-bottom:4px;">
            <span>Monthly Goal Progress</span>
            <span>${goalProgress}%</span>
          </div>
          <div style="background-color: var(--gray); height: 6px; border-radius: 3px; position: relative;">
            <div style="background-color: var(--primary-green); width: ${goalProgress}%; height: 100%; border-radius: 3px;"></div>
          </div>
        </div>
      </div>

      <!-- Fourth Section: Recent Activity Timeline -->
      <div class="quick-profile-section">
        <div class="quick-profile-section-title">Recent Activity Timeline</div>
        <div class="quick-profile-timeline">
          ${timeline.map(item => `
            <div class="quick-profile-timeline-item">
              <div class="quick-profile-timeline-badge"></div>
              <div class="quick-profile-timeline-content">
                <div class="quick-profile-timeline-text">${item.text}</div>
                <div class="quick-profile-timeline-time">${item.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Fifth Section: AI Coach Insight -->
      <div class="quick-profile-section">
        <div class="quick-profile-coach-card">
          <div class="quick-profile-coach-header">
            <span class="quick-profile-coach-icon"><i data-lucide="sparkles" style="width:14px; height:14px;"></i></span>
            <span class="quick-profile-coach-title">AI Sustainability Coach</span>
          </div>
          <div class="quick-profile-coach-body">
            ${coachInsight}
          </div>
        </div>
      </div>      <!-- Actions Menu -->
      <div class="quick-profile-actions">
        <div class="quick-profile-action-row" onclick="window.location.href='profile.html'">
          <span class="quick-profile-action-left"><i data-lucide="user"></i> View Full Profile</span>
          <i data-lucide="chevron-right" style="width:14px; height:14px;"></i>
        </div>
        <div class="quick-profile-action-row" onclick="window.location.href='challenges.html'">
          <span class="quick-profile-action-left"><i data-lucide="trophy"></i> My Challenges</span>
          <i data-lucide="chevron-right" style="width:14px; height:14px;"></i>
        </div>
        <div class="quick-profile-action-row" onclick="window.location.href='rewards.html'">
          <span class="quick-profile-action-left"><i data-lucide="gift"></i> Rewards Store</span>
          <i data-lucide="chevron-right" style="width:14px; height:14px;"></i>
        </div>
        ${user.name === "Amit Mehta" ? `
        <div class="quick-profile-action-row" onclick="window.location.href='settings.html'">
          <span class="quick-profile-action-left"><i data-lucide="settings"></i> Settings</span>
          <i data-lucide="chevron-right" style="width:14px; height:14px;"></i>
        </div>
        ` : ''}
      </div>

      <!-- Footer controls -->
      <div class="quick-profile-footer">
        <div class="quick-profile-footer-row">
          <span>Notifications</span>
          <label class="switch" style="transform: scale(0.85);">
            <input type="checkbox" id="quick-toggle-notif" onchange="toggleQuickNotifications(this.checked)" ${appState.config.notifications.compliance ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
        <div class="quick-profile-footer-row">
          <span>Dark Mode</span>
          <label class="switch" style="transform: scale(0.85);">
            <input type="checkbox" id="quick-toggle-dark-mode" onchange="toggleQuickDarkMode(this.checked)" ${!document.body.classList.contains("light-theme") ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
        <div style="border-top:1px solid var(--border-subtle); padding-top:12px; margin-top:8px;">
          <button class="btn btn-secondary" onclick="handleLogout(event)" style="width:100%; border-color:var(--red); color:var(--red); font-size:12px; height:34px;">
            <i data-lucide="log-out" style="width:14px; height:14px; margin-right:4px;"></i> Sign Out
          </button>
        </div>
      </div>
    `;
  } else {
    // Guest Quick Card
    const notifsOn = appState.config.notifications.compliance || appState.config.notifications.approvals;
    const isDark = !document.body.classList.contains("light-theme");
    
    card.innerHTML = `
      <div style="padding: 24px; text-align: center; display:flex; flex-direction:column; gap:16px;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--gray); display:flex; align-items:center; justify-content:center; color:var(--text-muted); margin: 0 auto;">
          <i data-lucide="user" style="width:28px; height:28px;"></i>
        </div>
        <div>
          <h4 style="font-size:15px; font-weight:600; color:var(--white);">Guest Profile</h4>
          <p style="font-size:12px; color:var(--text-muted); margin-top:6px; line-height:1.4;">Sign in to access your personal sustainability indicators, join active department challenges, earn experience points (XP), and unlock premium achievements.</p>
        </div>
        <button class="btn btn-primary" onclick="window.location.href='login.html'" style="width:100%; height:38px;">
          Sign In Now
        </button>
        
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 8px; text-align: left; display:flex; flex-direction:column; gap:8px;">
          <div class="quick-profile-footer-row" style="padding:0;">
            <span style="font-size:12px; color:var(--text-muted);">Notifications</span>
            <label class="switch" style="transform: scale(0.85);">
              <input type="checkbox" id="guest-toggle-notif" onchange="toggleQuickNotifications(this.checked)" ${notifsOn ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
          <div class="quick-profile-footer-row" style="padding:0;">
            <span style="font-size:12px; color:var(--text-muted);">Dark Mode</span>
            <label class="switch" style="transform: scale(0.85);">
              <input type="checkbox" id="guest-toggle-dark-mode" onchange="toggleQuickDarkMode(this.checked)" ${isDark ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
}

function handleLoginSubmit(event) {
  event.preventDefault();
  let username = document.getElementById("login-email").value.trim();
  const selectedCards = document.querySelectorAll(".quick-role-card.selected");
  
  let selectedUser = "Amit Mehta";
  let selectedRole = "Sustainability Director & R&D Lead";
  let selectedDept = "R&D";
  let selectedXP = 1420;
  let selectedAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";

  if (selectedCards.length > 0) {
    const card = selectedCards[0];
    selectedUser = card.getAttribute("data-user");
    selectedRole = card.getAttribute("data-role");
    selectedXP = parseInt(card.getAttribute("data-xp")) || 100;
    selectedAvatar = card.getAttribute("data-avatar");
    if (selectedUser === "Priya Sharma") selectedDept = "Manufacturing";
    else if (selectedUser === "Rajiv Nair") selectedDept = "Logistics";
    else selectedDept = "R&D";
  }

  if (username && username !== "") {
    if (username.toLowerCase().includes("priya")) {
      selectedUser = "Priya Sharma";
      selectedRole = "Manufacturing Head";
      selectedDept = "Manufacturing";
      selectedXP = 820;
      selectedAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80";
    } else if (username.toLowerCase().includes("rajiv")) {
      selectedUser = "Rajiv Nair";
      selectedRole = "Logistics Head";
      selectedDept = "Logistics";
      selectedXP = 640;
      selectedAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80";
    } else if (username.toLowerCase().includes("amit") || username.toLowerCase().includes("mehta")) {
      selectedUser = "Amit Mehta";
      selectedRole = "Sustainability Director & R&D Lead";
      selectedDept = "R&D";
      selectedXP = 1420;
      selectedAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
    } else {
      selectedUser = username;
      selectedRole = "ESG Officer";
      selectedDept = "Corporate";
      selectedXP = 100;
      selectedAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80";
    }
  }

  appState.isLoggedIn = true;
  appState.currentUser = {
    name: selectedUser,
    role: selectedRole,
    department: selectedDept,
    xp: selectedXP,
    badges: selectedXP >= 1000 ? ["Green Beginner", "Carbon Saver"] : ["Green Beginner"],
    avatar: selectedAvatar
  };

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", JSON.stringify(appState.currentUser));

  renderAuthWidgets();
  closeModal("login-modal");

  // Re-run active screen renders so values update
  const currentTabId = document.querySelector(".nav-item.active")?.getAttribute("data-target") || "dashboard";
  switchTab(currentTabId);
  renderNotificationIcon();
  renderNotificationDrawer();
  
  addSystemNotification(`User ${selectedUser} logged in successfully`, "approvals");
}

function handleLogout(event) {
  if (event) event.preventDefault();
  
  appState.isLoggedIn = false;
  appState.currentUser = null;
  const loginEmailEl = document.getElementById("login-email");
  if (loginEmailEl) loginEmailEl.value = "";
  
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userDept");
  localStorage.removeItem("userAvatar");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userPhone");
  localStorage.removeItem("userLoc");
  localStorage.removeItem("userEid");
  localStorage.removeItem("userBio");
  
  window.location.href = "index.html";
}

// Main Window Onload Initializer
window.onload = function() {

  // Restore saved theme mode
  const savedTheme = localStorage.getItem("themeMode");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }

  // Restore saved visual settings
  const savedAccent = localStorage.getItem("themeAccentColor");
  if (savedAccent) {
    document.documentElement.style.setProperty('--primary-green', savedAccent);
    document.documentElement.style.setProperty('--pa', savedAccent);
    document.documentElement.style.setProperty('--ch-purple', savedAccent);
    document.documentElement.style.setProperty('--rg', savedAccent);
    document.documentElement.style.setProperty('--se-purple', savedAccent);
  }
  const savedFS = localStorage.getItem("themeFontSize");
  if (savedFS) {
    document.body.style.fontSize = savedFS + "px";
  }
  const savedCompact = localStorage.getItem("themeCompactMode") === "true";
  document.body.classList.toggle("compact-mode", savedCompact);
  const savedMotion = localStorage.getItem("themeAnimations") === "false";
  document.body.classList.toggle("no-animations", savedMotion);

  // Restore saved user info to appState
  const savedName = localStorage.getItem("userName");
  const savedRole = localStorage.getItem("userRole");
  const savedAv = localStorage.getItem("userAvatar");
  
  if (appState.currentUser) {
    if (savedName) appState.currentUser.name = savedName;
    if (savedRole) appState.currentUser.role = savedRole;
    if (savedAv) appState.currentUser.avatar = savedAv;
  }

  // Pre-fill select dropdowns in modals
  const carbDeptSelect = document.getElementById("carb-form-dept");
  const carbSourceSelect = document.getElementById("carb-form-source");

  if (carbDeptSelect && carbSourceSelect) {
    appState.departments.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.code;
      opt.textContent = d.name;
      carbDeptSelect.appendChild(opt);
    });

    appState.emissionFactors.forEach(f => {
      const opt = document.createElement("option");
      opt.value = f.source;
      opt.textContent = `${f.source} (${f.factor} ${f.unit})`;
      carbSourceSelect.appendChild(opt);
    });
  }

  const partActivitySelect = document.getElementById("part-activity-title");
  if (partActivitySelect) {
    partActivitySelect.innerHTML = "";
    appState.csrActivities.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.title;
      opt.textContent = c.title;
      partActivitySelect.appendChild(opt);
    });
  }

  // Bind Form Submissions
  const logCarbonForm = document.getElementById("form-log-carbon");
  if (logCarbonForm) logCarbonForm.addEventListener("submit", handleCarbonTransactionSubmit);
  
  const logPartForm = document.getElementById("form-log-participation");
  if (logPartForm) logPartForm.addEventListener("submit", handleLogParticipationSubmit);
  
  const subEvForm = document.getElementById("form-submit-evidence");
  if (subEvForm) subEvForm.addEventListener("submit", handleChallengeEvidenceSubmit);
  
  const logAuditForm = document.getElementById("form-log-audit");
  if (logAuditForm) logAuditForm.addEventListener("submit", handleAuditSubmit);
  
  const newChalForm = document.getElementById("form-new-challenge");
  if (newChalForm) newChalForm.addEventListener("submit", handleNewChallengeSubmit);
  
  const loginForm = document.getElementById("form-login");
  if (loginForm) loginForm.addEventListener("submit", handleLoginSubmit);

  const newGoalForm = document.getElementById("form-new-goal");
  if (newGoalForm) newGoalForm.addEventListener("submit", handleNewGoalSubmit);

  // Quick roles card select logic
  document.querySelectorAll(".quick-role-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".quick-role-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      const emailInput = document.getElementById("login-email");
      if (emailInput) emailInput.value = card.getAttribute("data-user");
    });
  });

  // Settings logic binding
  const setWeightEnv = document.getElementById("set-weight-env");
  const setWeightSoc = document.getElementById("set-weight-soc");
  const setWeightGov = document.getElementById("set-weight-gov");
  if (setWeightEnv && setWeightSoc && setWeightGov) {
    setWeightEnv.addEventListener("input", updateWeights);
    setWeightSoc.addEventListener("input", updateWeights);
    setWeightGov.addEventListener("input", updateWeights);
  }

  // Notification close/toggle binds
  const bellBtn = document.getElementById("bell-btn");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  if (bellBtn) bellBtn.addEventListener("click", toggleNotificationDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", toggleNotificationDrawer);

  // Trigger modal visibility controls
  if (typeof handleAutoEmissionToggleInForm === 'function' && document.getElementById("carb-form-auto")) {
    handleAutoEmissionToggleInForm();
  }

  // Load session storage if it exists
  const storedLogin = localStorage.getItem("isLoggedIn");
  if (storedLogin === "true") {
    appState.isLoggedIn = true;
    appState.currentUser = JSON.parse(localStorage.getItem("currentUser"));
  }

  // Load weights if persisted
  const storedConfig = localStorage.getItem("appStateConfig");
  if (storedConfig) {
    appState.config = JSON.parse(storedConfig);
  }

  // Run initial navigation bind & load dashboard in persistent mode
  if (document.getElementById("dashboard-panel")) {
    initNavigation();
    initLanguageSelector();
    
    fetch("/api/state/")
      .then(response => response.json())
      .then(data => {
        if (data) {
          if (data.carbonTransactions) appState.carbonTransactions = data.carbonTransactions;
          if (data.employeeParticipation) appState.employeeParticipation = data.employeeParticipation;
          if (data.challenges) appState.challenges = data.challenges;
          if (data.challengeParticipation) appState.challengeParticipation = data.challengeParticipation;
          if (data.audits) appState.audits = data.audits;
          if (data.complianceIssues) appState.complianceIssues = data.complianceIssues;
          if (data.policyAcknowledgements) appState.policyAcknowledgements = data.policyAcknowledgements;
          if (data.notifications) appState.notifications = data.notifications;
          if (data.scores) appState.scores = data.scores;
        }
        
        renderAuthWidgets();
        const activeTab = localStorage.getItem("activeTab") || "dashboard";
        switchTab(activeTab);
        renderNotificationIcon();
        renderNotificationDrawer();
      })
      .catch(err => {
        console.error("Failed to load state from backend, falling back", err);
        renderAuthWidgets();
        const activeTab = localStorage.getItem("activeTab") || "dashboard";
        switchTab(activeTab);
        renderNotificationIcon();
        renderNotificationDrawer();
      });
  }
};

// ================= LANGUAGE SELECTOR ENGINE =================
const indianLanguages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "ma", name: "Maithili", native: "मैथिली" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्" },
  { code: "ks", name: "Kashmiri", native: "کٲशুর" },
  { code: "sd", name: "Sindhi", native: "सिन्धी" },
  { code: "ko", name: "Konkani", native: "कोंकणी" },
  { code: "dg", name: "Dogri", native: "डोगरी" },
  { code: "mn", name: "Manipuri", native: "মৈতৈলোন" },
  { code: "bo", name: "Bodo", native: "बर'" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "sl", name: "Santali", native: "संताली" }
];

const menuTranslations = {
  en: ["Dashboard", "Environmental", "Social", "Governance", "Gamification", "Reports", "Settings"],
  hi: ["डैशबोर्ड", "पर्यावरण", "सामाजिक", "शासन", "गेमीफिकेशन", "रिपोर्ट्स", "सेटिंग्स"],
  bn: ["ড্যাশবোর্ড", "পরিবেশগত", "সামাজিক", "শাসন", "গেমিফিকেশন", "রিপোর্ট", "সেটিংস"],
  te: ["డాష్‌బోర్డ్", "పర్యావరణం", "సామాజిక", "పాలన", "గేమిఫికేషన్", "నివేదికలు", "సెట్టింగులు"],
  mr: ["डॅशबोर्ड", "पर्यावरण", "सामाजिक", "प्रशासन", "गेमिफिकेशन", "अहवाल", "सेटिंग्ज"],
  ta: ["டாஷ்போர்டு", "சுற்றுச்சூழல்", "சமூகம்", "ஆளுகை", "விளையாட்டு", "அறிக்கைகள்", "அமைப்புகள்"],
  ur: ["ڈیش بورڈ", "ماحولیاتی", "سماجی", "گورننس", "گیمفیکیشن", "رپورٹس", "ترتیبات"],
  gu: ["ડેશબોર્ડ", "પર્યાવરણ", "સામાજિક", "ગવર્નન્સ", "ગેમિફિકેશન", "અહેવાલો", "સેટિંગ્સ"],
  kn: ["ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "ಪರಿಸರ", "ಸಾಮಾಜಿಕ", "ಆಡಳಿತ", "ಗೇಮಿಫಿಕೇಶನ್", "ವರದಿಗಳು", "ಸೆಟ್ಟಿಂಗ್‌ಗಳು"],
  ml: ["ಡാഷ്ബോർഡ്", "പരിസ്ഥിതി", "സാമൂഹികം", "ഭരണം", "ഗെയിമിഫിക്കേഷൻ", "റിപ്പോർട്ടുകൾ", "ക്രമീകരണങ്ങൾ"],
  or: ["ଡ୍ୟାସବୋର୍ଡ", "ପରିବେଶ", "ସାମାଜిక", "ଶାସନ", "ଗେମିଫିକେସନ", "ରିପୋର୍ଟ", "ସେଟିଂସ"],
  pa: ["ਡੈਸ਼ਬੋਰਡ", "ਵਾਤਾਵਰਣ", "ਸਮਾਜಿಕ", "ਸ਼ਾਸਨ", "ਗੇਮੀਫਿਕੇਸ਼ਨ", "ਰਿਪੋਰਟਾਂ", "ਸੈਟਿੰਗਾਂ"],
  as: ["ড্যাশবোর্ড", "পৰিৱেশ", "সামাজিক", "শাসন", "গেমিফিকেচন", "প্ৰতিবেদন", "ছেটিংছ"],
  ma: ["ड्यासबोर्ड", "पर्यावरण", "सामाजिक", "शासन", "गेमीफिकेशन", "रिपोर्ट्स", "सेटिंग्स"],
  sa: ["फलकम्", "पर्यावरणम्", "सामाजिकम्", "प्रशासनम्", "क्रीडाकरणम्", "वृत्तान्तः", "सज्जीकरणम्"],
  ks: ["ڈیش بورڈ", "ماحولیاتی", "سماجی", "گورننس", "گیمفیکیشن", "رپورٹس", "ترتیبات"],
  sd: ["ڈیش بورڈ", "ماحولیاتی", "سماجی", "گورننس", "گیمفیکیشن", "رپورٹس", "ترتیبات"],
  ko: ["डॅशबोर्ड", "पर्यावरण", "सामाजिक", "प्रशासन", "गेमिफिकेशन", "अहवाल", "सेटिंग्ज"],
  dg: ["डैशबोर्ड", "पर्यावरण", "सामाजिक", "शासन", "गेमीफिकेशन", "रिपोर्ट्स", "सेटिंग्स"],
  mn: ["ড্যাশবোর্ড", "পরিবেশগত", "সামাজিক", "শাসন", "গেमीফিকেশন", "রিপোর্ট", "সেটিংস"],
  bo: ["डैशबोर्ड", "पर्यावरण", "सामाजिक", "शासन", "गेमीफिकेशन", "रिपोर्ट्स", "सेटिंग्स"],
  ne: ["ड्यासबोर्ड", "पर्यावरण", "सामाजिक", "सुशासन", "गेमिफिकेसन", "रिपोर्टहरू", "सेटिङहरू"],
  sl: ["ड्यासबोर्ड", "पर्यावरण", "सामाजिक", "सुशासन", "गेमिफिकेसन", "रिपोर्टहरू", "सेटिङहरू"]
};

let currentLanguageCode = localStorage.getItem("selectedLanguageCode") || "en";

function initLanguageSelector() {
  const dropdown = document.getElementById("lang-dropdown");
  if (!dropdown) return;

  dropdown.innerHTML = "";
  indianLanguages.forEach(lang => {
    const opt = document.createElement("div");
    opt.className = `lang-option notranslate ${lang.code === currentLanguageCode ? 'selected' : ''}`;
    opt.setAttribute("translate", "no");
    opt.innerHTML = `
      <span class="notranslate" translate="no">${lang.native}</span>
      <span class="notranslate" translate="no" style="font-size: 10px; color: var(--text-muted); margin-left: 8px;">${lang.name}</span>
    `;
    opt.addEventListener("click", () => {
      selectLanguage(lang.code);
    });
    dropdown.appendChild(opt);
  });

  // Update button label on initialization
  const activeLangLabel = document.getElementById("active-lang");
  if (activeLangLabel) activeLangLabel.textContent = currentLanguageCode.toUpperCase();

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-selector-wrapper")) {
      dropdown.classList.remove("active");
    }
  });
}

function toggleLangDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById("lang-dropdown");
  if (dropdown) dropdown.classList.toggle("active");
}

function selectLanguage(code) {
  currentLanguageCode = code;
  localStorage.setItem("selectedLanguageCode", code);

  // Set Translate cookies
  document.cookie = "googtrans=/en/" + code + "; path=/;";
  document.cookie = "googtrans=/en/" + code + "; path=/; domain=" + window.location.hostname + ";";

  // Reload page to force Google Translate initialization with the new language
  window.location.reload();
}

function applyLanguageTranslations(code) {
  const trans = menuTranslations[code] || menuTranslations.en;
  
  // Update sidebar menu items
  const sidebarLinks = document.querySelectorAll(".sidebar .nav-menu .nav-item");
  sidebarLinks.forEach((link, index) => {
    if (trans[index]) {
      const icon = link.querySelector("i");
      link.innerHTML = "";
      if (icon) link.appendChild(icon);
      link.appendChild(document.createTextNode(" " + trans[index]));
    }
  });

  // Re-run Lucide icons since we replaced innerHTML
  if (window.lucide) window.lucide.createIcons();
}

// Quick toggles event handlers
function toggleQuickNotifications(checked) {
  appState.config.notifications.compliance = checked;
  appState.config.notifications.approvals = checked;
  appState.config.notifications.policy = checked;
  appState.config.notifications.badges = checked;

  // Sync all checkbox components in widgets
  const toggles = document.querySelectorAll("#quick-toggle-notif, #guest-toggle-notif");
  toggles.forEach(t => t.checked = checked);

  // Sync to settings page controls
  const elComp = document.getElementById("set-notif-comp");
  const elApp = document.getElementById("set-notif-app");
  const elPolicy = document.getElementById("set-notif-policy");
  const elBadge = document.getElementById("set-notif-badge");
  if (elComp) elComp.checked = checked;
  if (elApp) elApp.checked = checked;
  if (elPolicy) elPolicy.checked = checked;
  if (elBadge) elBadge.checked = checked;

  renderNotificationIcon();
  addSystemNotification(`System notifications turned ${checked ? 'ON' : 'OFF'}`, "approvals");
}

function toggleQuickDarkMode(checked) {
  if (checked) {
    document.body.classList.remove("light-theme");
    localStorage.setItem("themeMode", "dark");
  } else {
    document.body.classList.add("light-theme");
    localStorage.setItem("themeMode", "light");
  }

  // Sync all checkbox components in widgets
  const toggles = document.querySelectorAll("#quick-toggle-dark-mode, #guest-toggle-dark-mode");
  toggles.forEach(t => t.checked = checked);

  // Sync settings page dark mode toggle if present
  const settingsDark = document.getElementById("set-toggle-dark");
  if (settingsDark) settingsDark.checked = checked;

  addSystemNotification(`Theme set to ${checked ? 'Dark' : 'Light'} Mode`, "approvals");
}


