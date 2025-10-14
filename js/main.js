document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  const hamburger = document.querySelector('.hamburger');

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) hideMenu();
  });

  // Sidebar menu toggle
  function openMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  }

  function hideMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }

  function toggleMenu() {
    if (sidebar.classList.contains('open') || overlay.classList.contains('show')) {
      hideMenu();
    } else {
      openMenu();
    }
  }

  // open menu on click
  hamburger.addEventListener('click', toggleMenu);

  // close menu on click outside
  overlay.addEventListener('click', hideMenu);

  // close menu with Escape key for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideMenu();
  });

  // toggle sidebar list
  const sidebarList = document.querySelectorAll('.sidebar nav > button');

  sidebarList.forEach((btn) => {
    btn.addEventListener('click', () => {
      activateList(btn);
    });
  });

  function activateList(btn) {
    const prev = document.querySelector('.active-ul');
    if (prev && prev !== btn) prev.classList.remove('active-ul');
    btn.classList.toggle('active-ul');
  }

  // toggle sidebar list item
  const sidebarListBtn = document.querySelectorAll('.sidebar ul > li > button');

  sidebarListBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
      activateListItem(btn);
    });
  });

  function activateListItem(btn) {
    const prev = document.querySelector('.active-li');
    if (prev && prev !== btn) prev.classList.remove('active-li');
    btn.classList.add('active-li');

    updateCurrentList();
    hideMenu();

    // scroll to selected lecture
    const id = btn.getAttribute('data-id');
    if (id) {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    }
  }

  // update current list to show which list is currently active
  function updateCurrentList() {
    sidebarList.forEach((btn) => {
      const prev = document.querySelector('.current-ul');
      const list = btn.nextElementSibling;
      if (prev && list.querySelector('.active-li')) prev.classList.remove('current-ul');
      if (list && list.querySelector('.active-li')) btn.classList.add('current-ul');
    });
  }

  // change active li depending on the current article in view
  const op = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const btn = document.querySelector(`[data-id="${id}"]`);
        if (btn) {
          activateListItem(btn);
        }
      });
    },
    { threshold: [0.5] }
  );

  document.querySelectorAll('article').forEach((article) => {
    op.observe(article);
  });
});
