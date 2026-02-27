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
  const linePatterns = [
    [
      { count: 1, indent: 0 },
      { count: 2, indent: 1 },
      { count: 3, indent: 2 },
      { count: 2, indent: 3 },
      { count: 3, indent: 2 },
      { count: 2, indent: 1 },
    ],
    [
      { count: 1, indent: 0 },
      { count: 2, indent: 1 },
      { count: 2, indent: 2 },
      { count: 3, indent: 1 },
      { count: 1, indent: 3 },
      { count: 3, indent: 2 },
      { count: 2, indent: 1 },
    ],
    [
      { count: 1, indent: 0 },
      { count: 1, indent: 1 },
      { count: 2, indent: 2 },
      { count: 3, indent: 3 },
      { count: 2, indent: 2 },
      { count: 3, indent: 1 },
      { count: 2, indent: 2 },
      { count: 1, indent: 1 },
    ],
  ];
  const revealStepMs = 375;
  const holdMs = 3000;
  const hideMs = 1260;
  let toneCycle = 0;
  let patternCycle = 0;
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

  const pickWords = (count) => {
    if (words.length >= count) {
      return shuffle(words).slice(0, count);
    }

    let picked = [];
    while (picked.length < count) {
      picked = picked.concat(shuffle(words));
    }
    return picked.slice(0, count);
  };

  const nextLayout = () => {
    const activePattern = linePatterns[patternCycle % linePatterns.length];
    const wordsInPattern = activePattern.reduce((sum, line) => sum + line.count, 0);
    let selected = pickWords(wordsInPattern);
    let key = selected.join("|");
    if (key === lastOrderKey && selected.length > 1) {
      selected = selected.slice(1).concat(selected[0]);
      key = selected.join("|");
    }
    lastOrderKey = key;

    let cursor = 0;
    return activePattern.map((line) => {
      const chunk = selected.slice(cursor, cursor + line.count);
      cursor += line.count;
      return { indent: line.indent, words: chunk };
    });
  };

  const renderWords = (lines, hidden) => {
    let globalIndex = 0;
    buzzwordGrid.innerHTML = lines.map((line) => {
      const chips = line.words.map((word) => {
        const tone = tones[(globalIndex + toneCycle) % tones.length];
        const hiddenClass = hidden ? " is-hidden" : "";
        globalIndex += 1;
        return `<span class="buzzword-chip ${tone}${hiddenClass}">${escapeHtml(word)}</span>`;
      }).join("");
      return `<div class="buzz-line tab-${line.indent}">${chips}</div>`;
    }).join("");
  };

  const revealOneByOne = (chips, done) => {
    chips.forEach((chip, index) => {
      window.setTimeout(() => {
        chip.classList.remove("is-hidden");
        chip.classList.add("is-visible");
      }, index * revealStepMs);
    });

    const totalMs = chips.length * revealStepMs + 540;
    window.setTimeout(done, totalMs);
  };

  const hideAll = (chips, done) => {
    chips.forEach((chip) => {
      chip.classList.add("is-hidden");
      chip.classList.remove("is-visible");
    });
    window.setTimeout(done, hideMs);
  };

  const runCycle = () => {
    const lines = nextLayout();
    renderWords(lines, !prefersReducedMotion);
    const chips = Array.from(buzzwordGrid.querySelectorAll(".buzzword-chip"));

    if (prefersReducedMotion) {
      chips.forEach((chip) => chip.classList.add("is-visible"));
      return;
    }

    revealOneByOne(chips, () => {
      window.setTimeout(() => {
        hideAll(chips, () => {
          toneCycle = (toneCycle + 1) % tones.length;
          patternCycle = (patternCycle + 1) % linePatterns.length;
          runCycle();
        });
      }, holdMs);
    });
  };

  runCycle();

  const storyPanels = Array.from(document.querySelectorAll("[data-story-panel]"));
  if (storyPanels.length > 0) {
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    let ticking = false;

    const updateStories = () => {
      storyPanels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const travel = rect.height + window.innerHeight;
        const progress = clamp((window.innerHeight - rect.top) / travel, 0, 1);
        const visibility = clamp(1 - Math.abs(progress - 0.5) * 2, 0, 1);

        panel.style.setProperty("--story-progress", progress.toFixed(4));
        panel.style.setProperty("--story-visibility", visibility.toFixed(4));
      });
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(() => {
        updateStories();
        ticking = false;
      });
    };

    updateStories();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }
})();
