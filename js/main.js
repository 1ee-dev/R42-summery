// Simple menu and lecture switching script
document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.getElementById('menu-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const article = document.getElementById('article');

  function openMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    overlay.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    setTimeout(() => (overlay.hidden = true), 220);
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.focus();
  }

  menuBtn.addEventListener('click', function () {
    if (sidebar.classList.contains('open')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Lecture switching
  const lectureButtons = document.querySelectorAll('.lecture-item');
  const lectures = {
    lec1: {
      title: 'Lecture 1 — Introduction',
      body: '<p>This lecture introduces the course and the main objectives. Core concepts and outcomes are explained. Takeaways: understand scope and expectations.</p>',
    },
    lec2: {
      title: 'Lecture 2 — Key Concepts',
      body: '<p>We cover the foundational terminology and models. Pay attention to examples and definitions which will be used in later lectures.</p>',
    },
    lec3: {
      title: 'Lecture 3 — Examples',
      body: '<p>Practical examples and walkthroughs. This session demonstrates applying concepts to solve real problems.</p>',
    },
    lec4: {
      title: 'Lecture 4 — Advanced Topics',
      body: '<p>Deeper exploration of specialized topics. Expect longer exercises and readings.</p>',
    },
    lec5: {
      title: 'Lecture 5 — Summary & Next Steps',
      body: '<p>Summary of the course so far with suggested next readings and project ideas.</p>',
    },
  };

  lectureButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const id = btn.dataset.id;
      if (!id || !lectures[id]) return;
      const data = lectures[id];
      article.innerHTML = `<h2>${data.title}</h2>${data.body}`;
      // on small screens, close the menu
      if (window.matchMedia('(max-width: 800px)').matches) closeMenu();
      // move focus to content for accessibility
      document.getElementById('content').focus();
    });
  });
});
