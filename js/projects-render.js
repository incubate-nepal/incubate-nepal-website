// Generic renderer for all projects cohorts. It expects an array of project objects
// and renders cards + modals into a target container.
window.INProjectsRenderer = (function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderCard(project) {
    return (
      '<div class="col l6 s12">' +
      '<div class="project-card no-image modal-trigger" data-target="' + escapeHtml(project.modalId) + '">' +
      '<div class="project-card-img"></div>' +
      '<div class="project-card-info"><h4>' + escapeHtml(project.title) + '</h4></div>' +
      '</div>' +
      '</div>'
    );
  }

  function renderRows(projects) {
    var html = "";
    for (var i = 0; i < projects.length; i += 2) {
      html += '<div class="row">';
      html += renderCard(projects[i]);
      if (projects[i + 1]) {
        html += renderCard(projects[i + 1]);
      }
      html += '</div>';
    }
    return html;
  }

  function renderModalImage(project) {
    if (!project.image) {
      return '<div class="modal-img"><div class="close-btn modal-close"><i class="material-icons">close</i></div></div>';
    }

    return (
      '<div class="modal-img">' +
      '<img src="' + escapeHtml(project.image) + '" alt="" />' +
      '<div class="close-btn modal-close"><i class="material-icons">close</i></div>' +
      '</div>'
    );
  }

  function renderInfoBlock(project) {
    var peerLabel = project.peerMentorLabel || "Peer-Mentor";
    var peerLine = project.peerMentor
      ? '<span class="modal-mentor"><b>' + escapeHtml(peerLabel) + ':</b></span> ' + escapeHtml(project.peerMentor) + '<br />'
      : '';

    var mentorLine = project.mentorsLabel
      ? '<span class="modal-mentor"><b>Mentor:</b></span> ' + escapeHtml(project.mentorsLabel) + ' <br />'
      : '';

    var studentLine = project.students
      ? '<span class="modal-student"><b>Students:</b></span> ' + escapeHtml(project.students) + ' <br />'
      : '';

    if (!mentorLine && !peerLine && !studentLine) {
      return '';
    }

    return (
      '<p>' +
      mentorLine +
      peerLine +
      studentLine +
      '</p>'
    );
  }

  function renderFooterLinks(project) {
    if (!Array.isArray(project.links) || project.links.length === 0) {
      return '';
    }

    var linksHtml = project.links
      .filter(function (link) {
        return link && link.href && link.iconClass;
      })
      .map(function (link) {
        return (
          '<a href="' + escapeHtml(link.href) + '" target="_blank" rel="noopener noreferrer" class="waves-effect waves-light project-btn">' +
          '<i class="' + escapeHtml(link.iconClass) + '"></i>' +
          '</a>'
        );
      })
      .join('');

    if (!linksHtml) {
      return '';
    }

    return '<div class="modal-footer">' + linksHtml + '</div>';
  }

  function renderModal(project) {
    return (
      '<div id="' + escapeHtml(project.modalId) + '" class="modal">' +
      '<div class="modal-content">' +
      renderModalImage(project) +
      '<div class="modal-content-info">' +
      '<h6>' + escapeHtml(project.year + ' - ' + project.track) + '</h6>' +
      '<h4>' + escapeHtml(project.title) + '</h4>' +
      renderInfoBlock(project) +
      '<br />' +
      '<p>' + project.descriptionHtml + '</p>' +
      '</div>' +
      '</div>' +
      renderFooterLinks(project) +
      '</div>'
    );
  }

  function renderModals(projects) {
    return projects.map(renderModal).join('');
  }

  function renderCohort(containerSelector, projects) {
    var container = document.querySelector(containerSelector);
    if (!container || !Array.isArray(projects)) {
      return;
    }

    container.innerHTML = renderRows(projects) + renderModals(projects);
  }

  return {
    renderCohort: renderCohort
  };
})();
