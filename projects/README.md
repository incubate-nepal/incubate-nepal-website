# Projects Section Maintenance Guide

This page is data-driven. You do not need to write modal HTML manually.

## Files and Responsibilities

- `projects/index.html`
  - Timeline layout (year labels and containers)
  - Includes scripts used by the page
- `js/projects-cohorts-data.js`
  - Single source of truth for all project/team data
  - Keys must be in format `cohortYYYY` (example: `cohort2026`)
- `js/projects-render.js`
  - Renders cards and modals from project objects
- `js/projects-page.js`
  - Page controller: renders cohorts, builds deep-link maps, injects share links, opens query modals
- `projects/team-<slug>/index.html`
  - Redirect routes for canonical public links (`/projects/team-...`)

## Project Object Schema

Each team entry in `js/projects-cohorts-data.js` should follow this shape:

```js
{
  modalId: "example-modal-id",
  slug: "team-example",
  slugAliases: ["team-example-old"], // optional
  title: "Team Example",
  track: "Computer Science",
  year: 2026,
  image: "/assets/img/incubate_logo.png", // empty string allowed
  mentorsLabel: "Mentor Name",
  peerMentorLabel: "Peer-Mentor", // optional, defaults to Peer-Mentor
  peerMentor: "Peer Mentor Name", // optional
  students: "Student A, Student B", // optional
  descriptionHtml: "Project description. HTML is allowed here.",
  links: [
    { href: "https://example.com", iconClass: "las la-link" }
  ] // optional
}
```

## Update Existing Team

1. Open `js/projects-cohorts-data.js`.
2. Find the team object by `modalId` or `slug`.
3. Update fields (title, description, links, members, etc.).
4. Save and test:
   - open `/projects/`
   - open modal and verify content
   - test direct link `/projects/?team=team-...`

## Add New Team in Existing Cohort

1. Open `js/projects-cohorts-data.js`.
2. Add a new object inside the target cohort array (for example `cohort2025`).
3. Choose unique `modalId` and unique canonical `slug`.
4. Add route redirect file:
   - create folder `projects/team-<slug>/`
   - create `projects/team-<slug>/index.html` redirecting to `/projects/?team=team-<slug>`
5. Save and test `/projects/team-<slug>` and `/projects/?team=team-<slug>`.

## Add New Cohort Year

1. In `projects/index.html`, add a new timeline `<li>` block.
   - Use container id: `cohort-YYYY-projects`.
2. In `js/projects-cohorts-data.js`, add key `cohortYYYY` with an array of teams.
3. Add team route redirect files for each new team slug.
4. Save and test `/projects/`.

Notes:
- `js/projects-page.js` auto-discovers cohorts using key pattern `cohortYYYY`.
- If you follow naming conventions, no JavaScript changes are required.

## Deep Link and Share Link Rules

- Canonical slug is `slug`.
- Backward-compatible slugs go in `slugAliases`.
- Share links are generated as:
  - `https://incubatenepal.com/projects/<slug>`

## Common Mistakes to Avoid

- Reusing an existing `modalId`.
- Adding a cohort key that does not match `cohortYYYY`.
- Forgetting to add route file under `projects/team-<slug>/index.html`.
- Using a relative share URL instead of canonical slug in data.
