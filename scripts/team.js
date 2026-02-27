(() => {
  const container = document.getElementById("people-list");
  if (!container) {
    return;
  }

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const renderEmpty = (message) => {
    container.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
  };

  const groupByRole = (people) => {
    const map = new Map();
    people.forEach((person) => {
      const key = person.role || "Uncategorized";
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(person);
    });
    return map;
  };

  const imageMarkup = (person) => {
    const alt = `${person.name || "Team member"} portrait`;
    const src = person.image || "";
    if (!src) {
      return '<div class="person-image placeholder">Photo Placeholder</div>';
    }
    return `<img class="person-image" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'person-image placeholder',textContent:'Photo Placeholder'}));">`;
  };

  fetch("data/people.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load people data (${response.status})`);
      }
      return response.json();
    })
    .then((people) => {
      if (!Array.isArray(people) || people.length === 0) {
        renderEmpty("No people are listed yet. Update data/people.json.");
        return;
      }

      const grouped = groupByRole(people);
      const sections = [];
      grouped.forEach((members, role) => {
        const cards = members.map((person) => {
          const email = person.email
            ? `<p><a href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a></p>`
            : "";

          return `
            <article class="card person-card">
              ${imageMarkup(person)}
              <div class="person-meta">
                <h3>${escapeHtml(person.name || "Add Name")}</h3>
                <p class="person-role">${escapeHtml(person.role || "Role")}</p>
                <p><strong>Affiliation:</strong> ${escapeHtml(person.affiliation || "Affiliation")}</p>
                <p>${escapeHtml(person.bio || "Bio pending.")}</p>
                ${email}
              </div>
            </article>
          `;
        }).join("");

        sections.push(`
          <section class="card">
            <p class="kicker">${escapeHtml(role)}</p>
            <div class="data-layout" style="margin-top:10px;">
              ${cards}
            </div>
          </section>
        `);
      });

      container.innerHTML = sections.join("");
    })
    .catch((error) => {
      renderEmpty(`Could not load people data: ${error.message}`);
    });
})();
