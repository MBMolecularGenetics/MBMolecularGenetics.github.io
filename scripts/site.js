(() => {
  const yearNodes = document.querySelectorAll("[data-year]");
  const year = new Date().getFullYear();
  yearNodes.forEach((node) => {
    node.textContent = String(year);
  });

  const buzzwordGrid = document.getElementById("buzzword-grid");
  if (!buzzwordGrid) {
    return;
  }

  const rawWords = buzzwordGrid.getAttribute("data-buzzwords") || "";
  const words = rawWords.split(",").map((word) => word.trim()).filter(Boolean);
  if (words.length === 0) {
    return;
  }

  const tones = ["tone-a", "tone-b", "tone-c", "tone-d", "tone-e"];
  let cycle = 0;

  const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const shuffle = (input) => {
    const clone = [...input];
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  };

  const renderWords = () => {
    const ordered = shuffle(words);
    buzzwordGrid.innerHTML = ordered.map((word, index) => {
      const tone = tones[(index + cycle) % tones.length];
      return `<span class="buzzword-chip ${tone}">${escapeHtml(word)}</span>`;
    }).join("");
  };

  renderWords();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  window.setInterval(() => {
    buzzwordGrid.classList.add("is-fading");
    window.setTimeout(() => {
      cycle = (cycle + 1) % tones.length;
      renderWords();
      buzzwordGrid.classList.remove("is-fading");
    }, 260);
  }, 2000);
})();
