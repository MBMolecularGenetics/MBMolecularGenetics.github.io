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
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let toneCycle = 0;
  let lastOrderKey = "";

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

  const nextOrder = () => {
    let ordered = shuffle(words);
    if (ordered.length > 1) {
      const key = ordered.join("|");
      if (key === lastOrderKey) {
        ordered = ordered.slice(1).concat(ordered[0]);
      }
    }
    lastOrderKey = ordered.join("|");
    return ordered;
  };

  const renderWords = (ordered, hidden) => {
    buzzwordGrid.innerHTML = ordered.map((word, index) => {
      const tone = tones[(index + toneCycle) % tones.length];
      const hiddenClass = hidden ? " is-hidden" : "";
      return `<span class="buzzword-chip ${tone}${hiddenClass}">${escapeHtml(word)}</span>`;
    }).join("");
  };

  const revealOneByOne = (chips, done) => {
    const stepMs = 125;
    chips.forEach((chip, index) => {
      window.setTimeout(() => {
        chip.classList.remove("is-hidden");
        chip.classList.add("is-visible");
      }, index * stepMs);
    });

    const totalMs = chips.length * stepMs + 360;
    window.setTimeout(done, totalMs);
  };

  const hideAll = (chips, done) => {
    chips.forEach((chip) => {
      chip.classList.add("is-hidden");
      chip.classList.remove("is-visible");
    });
    window.setTimeout(done, 420);
  };

  const runCycle = () => {
    const ordered = nextOrder();
    renderWords(ordered, !prefersReducedMotion);
    const chips = Array.from(buzzwordGrid.querySelectorAll(".buzzword-chip"));

    if (prefersReducedMotion) {
      chips.forEach((chip) => chip.classList.add("is-visible"));
      return;
    }

    revealOneByOne(chips, () => {
      window.setTimeout(() => {
        hideAll(chips, () => {
          toneCycle = (toneCycle + 1) % tones.length;
          runCycle();
        });
      }, 1000);
    });
  };

  runCycle();

  // Keep existing chips from flashing if script is cached and reloaded.
  window.addEventListener("beforeunload", () => {
    const chips = buzzwordGrid.querySelectorAll(".buzzword-chip");
    chips.forEach((chip) => {
      chip.classList.remove("is-hidden");
      chip.classList.remove("is-visible");
    });
  });
})();
