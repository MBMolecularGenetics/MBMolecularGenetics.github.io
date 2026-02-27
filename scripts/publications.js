(() => {
  const list = document.getElementById("publication-list");
  const countNode = document.getElementById("pub-count");
  if (!list || !countNode) {
    return;
  }

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const renderEmpty = (message) => {
    countNode.innerHTML = `<p>${escapeHtml(message)}</p>`;
    list.innerHTML = "";
  };

  const doiLink = (doiValue) => {
    const doi = String(doiValue || "").trim();
    if (!doi || doi.toLowerCase().includes("replace-with-real-doi")) {
      return `<span class="pub-doi">DOI: ${escapeHtml(doi || "TBD")}</span>`;
    }

    const href = `https://doi.org/${encodeURIComponent(doi)}`;
    return `<a class="pub-doi" href="${href}" target="_blank" rel="noreferrer">DOI: ${escapeHtml(doi)}</a>`;
  };

  fetch("data/publications.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load publication data (${response.status})`);
      }
      return response.json();
    })
    .then((publications) => {
      if (!Array.isArray(publications) || publications.length === 0) {
        renderEmpty("No publications listed yet. Update data/publications.json.");
        return;
      }

      publications.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
      countNode.innerHTML = `<p><strong>${publications.length}</strong> publication records loaded from JSON metadata.</p>`;

      list.innerHTML = publications.map((item) => `
        <article class="card pub-card">
          <div class="pub-header">
            <h3>${escapeHtml(item.title || "Untitled publication")}</h3>
            <span class="pub-year">${escapeHtml(item.year || "Year N/A")}</span>
          </div>
          <p><strong>Publisher:</strong> ${escapeHtml(item.publisher || "Publisher N/A")}</p>
          <p>${doiLink(item.doi)}</p>
          <p class="pub-abstract">${escapeHtml(item.abstract || "Abstract not available.")}</p>
        </article>
      `).join("");
    })
    .catch((error) => {
      renderEmpty(`Could not load publication data: ${error.message}`);
    });
})();
