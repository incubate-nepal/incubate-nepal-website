(function () {
  "use strict";

  // Canonical base used for the share box links shown in each modal.
  var CANONICAL_BASE_URL = "https://incubatenepal.com";

  function normalizeSlug(value) {
    return String(value || "").toLowerCase().trim();
  }

  // Discover all cohort keys from data.
  // Convention: keys must be named cohortYYYY (example: cohort2026).
  function getCohortEntries() {
    var cohorts = window.INProjectsCohortsData || {};

    return Object.keys(cohorts)
      .filter(function (key) {
        return /^cohort\d{4}$/.test(key);
      })
      .sort()
      .map(function (key) {
        return {
          year: key.replace("cohort", ""),
          projects: Array.isArray(cohorts[key]) ? cohorts[key] : []
        };
      });
  }

  // Render each cohort into its matching container id (#cohort-YYYY-projects).
  // Returns one flattened list of all projects for deep links and share links.
  function renderCohorts(cohortEntries) {
    if (!window.INProjectsRenderer || !window.INProjectsRenderer.renderCohort) {
      return [];
    }

    var allProjects = [];

    cohortEntries.forEach(function (entry) {
      var containerId = "#cohort-" + entry.year + "-projects";
      if (!document.querySelector(containerId) || !entry.projects.length) {
        return;
      }

      window.INProjectsRenderer.renderCohort(containerId, entry.projects);
      entry.projects.forEach(function (project) {
        allProjects.push(project);
      });
    });

    return allProjects;
  }

  // Build fast lookup maps used by:
  // 1) Query deep links (?team=team-slug)
  // 2) Share links shown in each modal.
  function buildSlugMaps(projects) {
    var teamToModalId = {};
    var modalIdToTeamSlug = {};

    projects.forEach(function (project) {
      if (!project || !project.modalId || !project.slug) {
        return;
      }

      var canonicalSlug = normalizeSlug(project.slug);
      teamToModalId[canonicalSlug] = project.modalId;
      modalIdToTeamSlug[project.modalId] = canonicalSlug;

      if (Array.isArray(project.slugAliases)) {
        project.slugAliases.forEach(function (alias) {
          var normalizedAlias = normalizeSlug(alias);
          if (!normalizedAlias) {
            return;
          }
          teamToModalId[normalizedAlias] = project.modalId;
        });
      }
    });

    return {
      teamToModalId: teamToModalId,
      modalIdToTeamSlug: modalIdToTeamSlug
    };
  }

  // Inject "Share their work" section into every rendered modal.
  // It is safe to call repeatedly because we skip modals that already have this section.
  function appendShareSections(modalIdToTeamSlug) {
    var shareIndex = 0;

    Object.keys(modalIdToTeamSlug).forEach(function (modalId) {
      var shareSlug = modalIdToTeamSlug[modalId];
      var shareUrl = CANONICAL_BASE_URL + "/projects/" + shareSlug;
      var containers = document.querySelectorAll("#" + modalId + ".modal .modal-content-info");

      containers.forEach(function (container) {
        if (container.querySelector(".share-work-section")) {
          return;
        }

        shareIndex += 1;
        var inputId = "share-work-link-" + shareIndex;

        var section = document.createElement("div");
        section.className = "share-work-section";
        section.innerHTML =
          '<h6 class="share-work-title">Share their work</h6>' +
          '<div class="share-work-row">' +
          '<input id="' + inputId + '" class="share-work-link" type="text" readonly value="' + shareUrl + '" />' +
          '<button type="button" class="waves-effect waves-light share-work-copy share-link-copy-btn" data-input-id="' + inputId + '">Copy link</button>' +
          "</div>";

        container.appendChild(section);
      });
    });
  }

  // One delegated click handler for all copy buttons.
  function bindCopyHandler() {
    document.addEventListener("click", function (event) {
      var button = event.target.closest(".share-link-copy-btn");
      if (!button) {
        return;
      }

      var input = document.getElementById(button.getAttribute("data-input-id"));
      if (!input) {
        return;
      }

      var link = input.value;
      var originalText = button.textContent;

      var markCopied = function () {
        button.textContent = "Copied";
        window.setTimeout(function () {
          button.textContent = originalText;
        }, 1200);
      };

      var fallbackCopy = function () {
        input.focus();
        input.select();
        document.execCommand("copy");
        markCopied();
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(link).then(markCopied).catch(fallbackCopy);
        return;
      }

      fallbackCopy();
    });
  }

  // Open a modal automatically if URL has ?team=<slug>.
  // Accepts aliases via teamToModalId map.
  function openModalFromQuery(teamToModalId) {
    var teamParam = new URLSearchParams(window.location.search).get("team");
    if (!teamParam) {
      return;
    }

    var normalizedTeam = normalizeSlug(teamParam);
    var modalId = teamToModalId[normalizedTeam] || normalizedTeam;
    var modalEl = document.getElementById(modalId);
    if (!modalEl) {
      return;
    }

    var instance = M.Modal.getInstance(modalEl) || M.Modal.init(modalEl);
    instance.open();
  }

  // Startup order:
  // 1) Read cohorts from data
  // 2) Render cards/modals
  // 3) Initialize Materialize modals
  // 4) Build slug maps
  // 5) Add share sections + copy handler
  // 6) Open modal from query param if present
  function initialize() {
    var cohorts = getCohortEntries();
    var projects = renderCohorts(cohorts);

    $(".modal").modal();

    var slugMaps = buildSlugMaps(projects);
    appendShareSections(slugMaps.modalIdToTeamSlug);
    bindCopyHandler();
    openModalFromQuery(slugMaps.teamToModalId);
  }

  $(document).ready(initialize);
})();
