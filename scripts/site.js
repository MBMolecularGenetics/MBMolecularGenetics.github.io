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
  let offset = 0;

  const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const rotate = (input, shift) => {
    if (input.length === 0) {
      return [];
    }
    const normalized = ((shift % input.length) + input.length) % input.length;
    return input.slice(normalized).concat(input.slice(0, normalized));
  };

  const renderWords = () => {
    const ordered = rotate(words, offset);
    buzzwordGrid.innerHTML = ordered.map((word, index) => {
      const tone = tones[(index + cycle) % tones.length];
      return `<span class="buzzword-chip ${tone}">${escapeHtml(word)}</span>`;
    }).join("");
  };

  renderWords();

  window.setInterval(() => {
    buzzwordGrid.classList.add("is-fading");
    window.setTimeout(() => {
      cycle = (cycle + 1) % tones.length;
      offset = (offset + 3) % words.length;
      renderWords();
      buzzwordGrid.classList.remove("is-fading");
    }, 320);
  }, 2000);
})();
