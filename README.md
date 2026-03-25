**Incubate Nepal Website**

## Projects Maintenance (Single Source)

`projects/index.html` is now JS-driven for all cohorts using one renderer:

- 2020-2024 data: `js/projects-cohorts-data.js`
- 2025 data: `js/projects-cohorts-data.js`
- renderer for all years: `js/projects-render.js`
- page behavior (render/init/deep-link/share): `js/projects-page.js`

### Structured Data Shape (All Cohorts)

- Data file: `js/projects-cohorts-data.js`
- Renderer: `js/projects-render.js`

To add or edit projects:

- Update a project object in `js/projects-cohorts-data.js` (all years)

To add a new cohort year:

- Add a timeline block in `projects/index.html` with container id: `cohort-YYYY-projects`
- Add a new key in `js/projects-cohorts-data.js`: `cohortYYYY: [ ... ]`
- Add per-team route files under `projects/team-<slug>/index.html` redirecting to `/projects/?team=team-<slug>`

Each project object supports:

- `modalId`: Modal DOM id used for cards + deep linking
- `slug`: Canonical public URL slug (for example `team-pyari`)
- `slugAliases`: Optional alternate slugs for backward-compatible links
- `title`, `track`, `year`
- `image` (empty string keeps modal header image area without an image)
- `mentorsLabel`, `peerMentorLabel`, `peerMentor`, `students`
- `descriptionHtml`
- `links`: Optional modal footer links (`href`, `iconClass`)

Deep links and share links use canonical URLs like:

- `https://incubatenepal.com/projects/team-xxx`

These routes are handled by the per-team redirect folders under `projects/team-.../`.
