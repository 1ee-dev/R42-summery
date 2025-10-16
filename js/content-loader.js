// set groups (use simple { end, name } entries)
const groups = [
  { end: 14, name: 'HTML & CSS' },
  { end: 17, name: 'GitHub' },
  { end: 24, name: 'HTML5 & CSS3' },
  { end: 28, name: 'JavaScript' },
];

// generate array of lectures
function generateLectures(numberOfLectures) {
  const lectures = [];
  for (let i = 1; i <= numberOfLectures; i++) {
    // Determine group by checking the first group whose end >= i
    const matched = groups.find((g) => i <= g.end);
    const group = matched ? matched.name : 'Not Assigned';

    // Use plain id (no leading '#') so getElementById works and data-id matches
    lectures.push({
      id: `lec${i}`,
      title: `Lecture ${i}`,
      group: group,
      file: `lec${i}.html`,
    });
  }
  return lectures;
}

const lectures = generateLectures(groups[groups.length - 1].end);

// get all lectures by group
function getLecturesByGroup(group) {
  return lectures.filter((lec) => lec.group === group);
}

// get all lectures for sidebar inner list
function sidebarInnerList(group) {
  let listHTML = '';
  getLecturesByGroup(group.name).forEach((lec) => {
    listHTML += `<li><button data-id="${lec.id}">${lec.title}</button></li>`;
  });
  return listHTML;
}

// append list items to sidebar
function appendListItems() {
  let navHTML = '';
  groups.forEach((group) => {
    navHTML += `<button>${group.name} <i class="fa-solid fa-angle-right"></i></button>
        <div>
          <ul>
            ${sidebarInnerList(group)}
          </ul>
        </div>`;
  });
  document.querySelector('.sidebar nav').innerHTML = navHTML;
}

// Fetch content for each lecture
async function fetchLectureContent() {
  const main = document.querySelector('main');
  const lectureContentPromises = lectures.map(async (lec) => {
    // fetch relative to the site root (index.html), not relative to this JS file
    const response = await fetch(`content/${lec.file}`);
    const content = await response.text();
    // If the fetched file already contains an <article> element, prefer to reuse it
    // and ensure it has the expected id. Otherwise wrap the content in an article.
    const hasArticle = /<article\b/i.test(content);
    if (hasArticle) {
      // try to inject or replace the id attribute on the first <article>
      return content.replace(/<article(.*?)>/i, `<article$1 id="${lec.id}">`);
    }
    return `<article id="${lec.id}">${content}</article>`;
  });

  const lectureContentHtml = await Promise.all(lectureContentPromises);
  main.innerHTML = lectureContentHtml.join('');
}

// Initialize content loading
async function initializeContent() {
  // First append the sidebar structure
  appendListItems();
  // Then load all lecture content
  await fetchLectureContent();
  // Dispatch event when everything is loaded
  document.dispatchEvent(new CustomEvent('contentLoaded'));
}

initializeContent();
