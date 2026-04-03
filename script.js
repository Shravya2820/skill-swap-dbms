/* ══════════════════════════════════════════════
   SkillSwap — script.js
   All API calls use relative /api/... paths
══════════════════════════════════════════════ */

const API = "/api";

/* ─── Toast Notification ─── */
function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = (type === "success" ? "✅  " : "❌  ") + msg;
  t.className = "toast " + type;
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), 3500);
}

/* ─── Fetch Helpers ─── */
async function get(path) {
  const r = await fetch(API + path);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function post(path, data) {
  const r = await fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || r.statusText);
  }
  return r.json();
}

/* ─── Populate Dropdowns ─── */
async function populateStudentSelects() {
  const students = await get("/students").catch(() => []);
  const ids = ["os-student", "rs-student", "sw-sender", "sw-receiver"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const prev = el.value;
    el.innerHTML = `<option value="">Select student...</option>`;
    students.forEach(s => {
      el.innerHTML += `<option value="${s.id}">${s.id} – ${s.name} (${s.department})</option>`;
    });
    el.value = prev;
  });
}

async function populateSkillSelects() {
  const skills = await get("/skills").catch(() => []);
  const ids = ["os-skill", "rs-skill", "sw-offered", "sw-wanted"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const prev = el.value;
    el.innerHTML = `<option value="">Select skill...</option>`;
    skills.forEach(s => {
      el.innerHTML += `<option value="${s.id}">${s.id} – ${s.skillName}</option>`;
    });
    el.value = prev;
  });
}

/* ─── Section Navigation ─── */
const sectionMeta = {
  "add-student":  { title: "Add Student",    sub: "Register a new student on the platform." },
  "add-skill":    { title: "Add Skill",      sub: "Add a new skill available for exchange." },
  "offer-skill":  { title: "Offer a Skill",  sub: "Assign a skill a student can teach others." },
  "request-skill":{ title: "Request a Skill",sub: "Record which skill a student wants to learn." },
  "swap-request": { title: "Swap Request",   sub: "Create a skill exchange proposal between two students." },
  "view-all":     { title: "Search / View",  sub: "Browse all students, skills, and swap requests." },
};

document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    const target = item.dataset.section;

    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    item.classList.add("active");

    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(target).classList.add("active");

    const meta = sectionMeta[target] || {};
    document.getElementById("section-title").textContent = meta.title || "";
    document.getElementById("section-subtitle").textContent = meta.sub || "";

    // Auto-load data when navigating to view section
    if (target === "view-all") {
      loadStudentsTable();
      loadSkillsTable();
      loadSwapsTable();
    }

    // Refresh dropdowns when navigating to form sections that need them
    if (["offer-skill", "request-skill", "swap-request"].includes(target)) {
      populateStudentSelects();
      populateSkillSelects();
    }
  });
});

/* ─── Tabs in View All ─── */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

/* ══════════════════════════════════════════════
   FORM 1 — Add Student
══════════════════════════════════════════════ */
document.getElementById("form-add-student").addEventListener("submit", async e => {
  e.preventDefault();
  const name  = document.getElementById("s-name").value.trim();
  const email = document.getElementById("s-email").value.trim();
  const dept  = document.getElementById("s-dept").value.trim();
  const year  = document.getElementById("s-year").value;

  try {
    const student = await post("/students", { name, email, department: dept });
    showToast(`Student "${student.name}" added with ID ${student.id}`);
    e.target.reset();
    await populateStudentSelects();
  } catch (err) {
    showToast("Failed to add student: " + err.message, "error");
  }
});

/* ══════════════════════════════════════════════
   FORM 2 — Add Skill
══════════════════════════════════════════════ */
document.getElementById("form-add-skill").addEventListener("submit", async e => {
  e.preventDefault();
  const skillName = document.getElementById("sk-name").value.trim();
  const category  = document.getElementById("sk-category").value;

  try {
    const skill = await post("/skills", { skillName });
    showToast(`Skill "${skill.skillName}" added with ID ${skill.id}`);
    e.target.reset();
    await populateSkillSelects();
  } catch (err) {
    showToast("Failed to add skill: " + err.message, "error");
  }
});

/* ══════════════════════════════════════════════
   FORM 3 — Offer Skill (Assign skill to student)
══════════════════════════════════════════════ */
document.getElementById("form-offer-skill").addEventListener("submit", async e => {
  e.preventDefault();
  const studentId = parseInt(document.getElementById("os-student").value);
  const skillId   = parseInt(document.getElementById("os-skill").value);
  const level     = document.getElementById("os-level").value;

  try {
    await post("/student-skills", { studentId, skillId });
    showToast("Skill offered successfully!");
    e.target.reset();
  } catch (err) {
    showToast("Failed to offer skill: " + err.message, "error");
  }
});

/* ══════════════════════════════════════════════
   FORM 4 — Request Skill
   (Creates a swap request where receiver/offered are blank — stored as a one-sided request)
══════════════════════════════════════════════ */
document.getElementById("form-request-skill").addEventListener("submit", async e => {
  e.preventDefault();
  const requesterId = parseInt(document.getElementById("rs-student").value);
  const skillId     = parseInt(document.getElementById("rs-skill").value);

  // We record a self-request so it appears in the system
  try {
    await post("/swap-requests", {
      requesterId,
      receiverId: requesterId,
      skillOfferedId: skillId,
      skillWantedId: skillId,
    });
    showToast("Skill request recorded successfully!");
    e.target.reset();
  } catch (err) {
    showToast("Failed to record request: " + err.message, "error");
  }
});

/* ══════════════════════════════════════════════
   FORM 5 — Swap Request
══════════════════════════════════════════════ */
document.getElementById("form-swap-request").addEventListener("submit", async e => {
  e.preventDefault();
  const requesterId  = parseInt(document.getElementById("sw-sender").value);
  const receiverId   = parseInt(document.getElementById("sw-receiver").value);
  const skillOfferedId = parseInt(document.getElementById("sw-offered").value);
  const skillWantedId  = parseInt(document.getElementById("sw-wanted").value);

  if (requesterId === receiverId) {
    showToast("Sender and receiver must be different students!", "error");
    return;
  }

  try {
    await post("/swap-requests", { requesterId, receiverId, skillOfferedId, skillWantedId });
    showToast("Swap request created successfully!");
    e.target.reset();
  } catch (err) {
    showToast("Failed to create swap: " + err.message, "error");
  }
});

/* ══════════════════════════════════════════════
   LOAD TABLES
══════════════════════════════════════════════ */

window.loadStudentsTable = async function () {
  const tbody = document.getElementById("students-tbody");
  tbody.innerHTML = `<tr><td colspan="5" class="loading-row">⏳ Loading...</td></tr>`;
  try {
    const students = await get("/students");
    if (!students.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No students registered yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = students.map(s => `
      <tr>
        <td><strong>#${s.id}</strong></td>
        <td>${s.name}</td>
        <td>${s.email}</td>
        <td>${s.department}</td>
        <td>
          ${s.skills && s.skills.length
            ? s.skills.map(sk => `<span class="skill-chip">${sk.skillName}</span>`).join("")
            : `<span style="color:#c4b5fd;font-size:0.8rem;font-style:italic">None</span>`}
        </td>
      </tr>`
    ).join("");
  } catch {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-row" style="color:#dc2626">Failed to load students.</td></tr>`;
  }
};

window.loadSkillsTable = async function () {
  const tbody = document.getElementById("skills-tbody");
  tbody.innerHTML = `<tr><td colspan="3" class="loading-row">⏳ Loading...</td></tr>`;
  try {
    const skills = await get("/skills");
    if (!skills.length) {
      tbody.innerHTML = `<tr><td colspan="3" class="empty-row">No skills added yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = skills.map(sk => `
      <tr>
        <td><strong>#${sk.id}</strong></td>
        <td>${sk.skillName}</td>
        <td>${sk.category || '<span style="color:#c4b5fd;font-style:italic">—</span>'}</td>
      </tr>`
    ).join("");
  } catch {
    tbody.innerHTML = `<tr><td colspan="3" class="empty-row" style="color:#dc2626">Failed to load skills.</td></tr>`;
  }
};

window.loadSwapsTable = async function () {
  const tbody = document.getElementById("swaps-tbody");
  tbody.innerHTML = `<tr><td colspan="6" class="loading-row">⏳ Loading...</td></tr>`;
  try {
    const swaps = await get("/swap-requests");
    if (!swaps.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-row">No swap requests yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = swaps.map(sw => `
      <tr>
        <td><strong>#${sw.id}</strong></td>
        <td>${sw.requesterName || sw.requesterId}</td>
        <td>${sw.receiverName  || sw.receiverId}</td>
        <td><span class="skill-chip">${sw.skillOfferedName || sw.skillOfferedId}</span></td>
        <td><span class="skill-chip">${sw.skillWantedName  || sw.skillWantedId}</span></td>
        <td><span class="badge badge-${sw.status}">${sw.status}</span></td>
      </tr>`
    ).join("");
  } catch {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-row" style="color:#dc2626">Failed to load swaps.</td></tr>`;
  }
};

/* ══════════════════════════════════════════════
   INIT — populate dropdowns on page load
══════════════════════════════════════════════ */
(async function init() {
  await populateStudentSelects();
  await populateSkillSelects();
})();
