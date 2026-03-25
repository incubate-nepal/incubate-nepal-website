(function () {
  "use strict";

  // Homepage highlighted teams, sourced from projects-cohorts-data.js by modalId.
  var HIGHLIGHTED_MODAL_IDS = [
    "dristhi",
    "arthub",
    "arthasashtra",
    "samsara",
    "bureaucrazyco",
    "devtrack",
  ];

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getAllProjects() {
    var cohorts = window.INProjectsCohortsData || {};
    return Object.keys(cohorts)
      .filter(function (key) {
        return /^cohort\d{4}$/.test(key) && Array.isArray(cohorts[key]);
      })
      .sort()
      .reduce(function (acc, key) {
        return acc.concat(cohorts[key]);
      }, []);
  }

  function getHighlightedProjects() {
    var byModalId = {};

    getAllProjects().forEach(function (project) {
      if (project && project.modalId) {
        byModalId[project.modalId] = project;
      }
    });

    return HIGHLIGHTED_MODAL_IDS
      .map(function (modalId) {
        return byModalId[modalId] || null;
      })
      .filter(Boolean);
  }

  function renderCard(project) {
    return (
      '<div class="col l6 s12">' +
      '<div class="project-card modal-trigger" data-target="' + escapeHtml(project.modalId) + '">' +
      '<div class="project-card-img">' +
      '<img src="' + escapeHtml(project.image || "/assets/img/incubate_logo.png") + '" alt="' + escapeHtml(project.title || "Project") + '" />' +
      "</div>" +
      '<div class="project-card-info">' +
      '<h6>' + "<br><br><br>" + "</h6>" +
      '<h4>' + escapeHtml(project.title) + "</h4>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderCards(projects) {
    var html = "";
    for (var i = 0; i < projects.length; i += 2) {
      html += '<div class="row">';
      html += renderCard(projects[i]);
      if (projects[i + 1]) {
        html += renderCard(projects[i + 1]);
      }
      html += "</div>";
    }
    return html;
  }

  function renderInfo(project) {
    var mentorLine = project.mentorsLabel
      ? '<span class="modal-mentor"><b>Mentor:</b></span> ' + escapeHtml(project.mentorsLabel) + " <br />"
      : "";

    var peerLabel = project.peerMentorLabel || "Peer-Mentor";
    var peerLine = project.peerMentor
      ? '<span class="modal-mentor"><b>' + escapeHtml(peerLabel) + ':</b></span> ' + escapeHtml(project.peerMentor) + " <br />"
      : "";

    var studentLine = project.students
      ? '<span class="modal-student"><b>Students:</b></span> ' + escapeHtml(project.students) + " <br />"
      : "";

    if (!mentorLine && !peerLine && !studentLine) {
      return "";
    }

    return "<p>" + mentorLine + peerLine + studentLine + "</p><br />";
  }

  function renderLinks(project) {
    if (!Array.isArray(project.links) || project.links.length === 0) {
      return "";
    }

    var linksHtml = project.links
      .filter(function (link) {
        return link && link.href && link.iconClass;
      })
      .map(function (link) {
        return (
          '<a href="' + escapeHtml(link.href) + '" target="_blank" rel="noopener noreferrer" class="waves-effect waves-light project-btn">' +
          '<i class="' + escapeHtml(link.iconClass) + '"></i>' +
          "</a>"
        );
      })
      .join("");

    return linksHtml ? '<div class="modal-footer">' + linksHtml + "</div>" : "";
  }

  function renderModal(project) {
    return (
      '<div id="' + escapeHtml(project.modalId) + '" class="modal">' +
      '<div class="modal-content">' +
      '<div class="modal-img">' +
      '<img src="' + escapeHtml(project.image || "/assets/img/incubate_logo.png") + '" alt="" />' +
      '<div class="close-btn modal-close"><i class="material-icons">close</i></div>' +
      "</div>" +
      '<div class="modal-content-info">' +
      '<h6>' + escapeHtml(project.year + " - " + project.track) + "</h6>" +
      '<h4>' + escapeHtml(project.title) + "</h4>" +
      renderInfo(project) +
      "<p>" + (project.descriptionHtml || "") + "</p>" +
      "</div>" +
      "</div>" +
      renderLinks(project) +
      "</div>"
    );
  }

  function renderHomeHighlights() {
    var mount = document.getElementById("highlighted-projects-container");
    if (!mount) {
      return;
    }

    var projects = getHighlightedProjects();
    if (!projects.length) {
      return;
    }

    mount.innerHTML = renderCards(projects) + projects.map(renderModal).join("");

    // Initialize modals after dynamic insertion.
    $(".modal").modal();
  }

  $(document).ready(renderHomeHighlights);
})();
