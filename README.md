# Infectious Disease Genomics and Bioinformatics Initiative Website

Static GitHub Pages website for a research-focused initiative centered on infectious disease genomics, metagenomics, and bioinformatics collaboration.

## Pages

- `index.html`: Home and positioning
- `capabilities.html`: Technical scope and research services
- `team.html`: Team members loaded from JSON
- `publications.html`: Publication records loaded from JSON

## Structured Data

- `data/people.json`
  - fields: `id`, `name`, `role`, `affiliation`, `bio`, `image`, `email`
- `data/publications.json`
  - fields: `id`, `doi`, `year`, `title`, `abstract`, `publisher`

## Images

Add team photos to `assets/images/people/` and keep filenames aligned with each `image` value in `data/people.json`.

## Deploy to GitHub Pages

1. Push to GitHub.
2. Open `Settings > Pages`.
3. Source: `Deploy from a branch`.
4. Branch: `main`, folder: `/ (root)`.
5. Wait for deployment to complete.

## Notes

- The site is designed as a research collaboration portal, not a clinical diagnostics advertising page.
- Update placeholders (emails, names, DOI values) before final public release.
