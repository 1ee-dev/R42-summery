const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const lectures = document.querySelectorAll('.lecture');
const lectureBtn = document.querySelectorAll('.lecture-item');
const toggleList = document.querySelectorAll('.toggle-list');

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) hideMenu();
});

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

hamburger.addEventListener('click', (e) => {
  toggleMenu();
});

overlay.addEventListener('click', (e) => {
  hideMenu();
});

// close menu with Escape key for accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideMenu();
});

// toggle lectures list
toggleList.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    // remove previous active list button if any
    const prev = document.querySelector('.active-list');
    if (prev && prev !== btn) prev.classList.remove('active-list');
    btn.classList.toggle('active-list');
  });
});

// scroll to selected lecture on click
lectureBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');
    if (id) document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    // open parent list (if collapsed) and position the button at the top
    openParentListForButton(btn);
    // delay slightly to allow any CSS open animation then scroll
    setTimeout(() => scrollSidebarButtonToTop(btn), 160);
    hideMenu();
  });
});

// Open the parent lecture-list for a button (if any) and mark its toggle active.
function openParentListForButton(btn) {
  if (!btn) return false;
  // lecture list wrapper is .lecture-list
  const list = btn.closest('.lecture-list');
  if (!list) return false;
  // remove active-list from other lists
  document.querySelectorAll('.lecture-list').forEach((l) => l.classList.remove('active-list'));
  list.classList.add('active-list');
  // also mark the toggle control just before the list (if present)
  const toggle = list.previousElementSibling;
  if (toggle && toggle.classList.contains('toggle-list')) {
    document.querySelectorAll('.toggle-list').forEach((t) => t.classList.remove('active-list'));
    toggle.classList.add('active-list');
  }
  return true;
}

// Scroll the sidebar so the button sits near the top of the sidebar view.
function scrollSidebarButtonToTop(btn) {
  if (!btn || !sidebar) return;
  const sidebarRect = sidebar.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  // calculate desired scrollTop to put btn at top with small padding
  const offsetWithinSidebar = btnRect.top - sidebarRect.top + sidebar.scrollTop;
  const target = Math.max(0, offsetWithinSidebar - 8);
  sidebar.scrollTo({ top: target, behavior: 'smooth' });
}

function scrollSidebarToTop() {
  if (!sidebar) return;
  sidebar.scrollTo({ top: 0, behavior: 'smooth' });
}

// Observe all main articles (lecture sections + welcome). When scrolling, pick the
// most visible section and activate its corresponding list button. If 'welcome' is
// most visible, clear any active buttons.
const sections = document.querySelectorAll('article');
if (sections && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      // pick only entries that are intersecting
      const visible = entries.filter((e) => e.isIntersecting);
      if (!visible.length) return;
      // choose the entry with the largest intersectionRatio
      const top = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
      const id = top.target.id;

      const prev = document.querySelector('.lecture-item.active');

      if (!id || id === 'welcome') {
        if (prev) prev.classList.remove('active');
        // scroll the sidebar to its top when welcome is the active section
        scrollSidebarToTop();
      }

      const btn = document.querySelector(`.lecture-item[data-id="${id}"]`);
      if (prev && prev !== btn) prev.classList.remove('active');
      if (btn) {
        btn.classList.add('active');
        // ensure parent list is open and the button is positioned at the top
        openParentListForButton(btn);
        setTimeout(() => scrollSidebarButtonToTop(btn), 120);
      }
    },
    { threshold: [0.5] }
  );

  sections.forEach((section) => observer.observe(section));
}