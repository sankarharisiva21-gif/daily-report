const API = "https://daily-report-worker.workers.dev";

async function refresh() {
  await fetch(`${API}/refresh`);
  load();
}

async function load() {
  const res = await fetch(`${API}/data`);
  const data = await res.json();

  renderBugs(data.jira || []);
  renderCycles(data.zephyr || {});
}

function renderBugs(issues) {
  const table = document.getElementById("bugs");
  table.innerHTML = `
    <tr>
      <th>ID</th><th>Summary</th><th>Priority</th>
      <th>Status</th><th>Component</th><th>Regression</th>
    </tr>
  `;

  issues.forEach(i => {
    table.innerHTML += `
      <tr>
        <td>${i.key}</td>
        <td>${i.fields.summary}</td>
        <td>${i.fields.priority?.name || ""}</td>
        <td>${i.fields.status.name}</td>
        <td>${i.fields.components.map(c=>c.name).join(",")}</td>
        <td>${i.fields.customfield_XXXXX ? "YES" : "NO"}</td>
      </tr>
    `;
  });
}

function renderCycles(cycles) {
  const table = document.getElementById("cycles");
  table.innerHTML = `<tr><th>Cycle</th><th>Pass</th><th>Fail</th></tr>`;

  Object.values(cycles).forEach(c => {
    table.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.stats?.PASS || 0}</td>
        <td>${c.stats?.FAIL || 0}</td>
      </tr>
    `;
  });
}

load();
