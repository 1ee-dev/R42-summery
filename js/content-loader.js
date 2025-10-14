// set groups
const groups = [
  { end: 16, name: 'HTML & CSS' },
  { end: 17, name: 'GitHub' },
  { end: 24, name: 'HTML5 & CSS3' },
  { end: 27, name: 'JavaScript' },
];

// generate array of lectures
function generateLectures(numberOfLectures) {
  const lectures = [];
  for (let i = 1; i <= numberOfLectures; i++) {
    // Determine group based on lecture number
    let group;
    if (i <= groups[0].end) group = groups[0].name;
    else if (i <= groups[1].end) group = groups[1].name;
    else if (i <= groups[2].end) group = groups[2].name;
    else if (i <= groups[3].end) group = groups[3].name;
    else group = 'Not Assigned';

    lectures.push({
      id: `#lec${i}`,
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

appendListItems();

// Fetch content for each lecture
async function fetchLectureContent() {
  const mainElement = document.querySelector('main');
  const lectureContentPromises = lectures.map(async (lecture) => {
    const response = await fetch(`../content/${lecture.file}`);
    const content = await response.text();
    return `<article id="${lecture.id}">${content}</article>`;
  });

  const lectureContentHtml = await Promise.all(lectureContentPromises);
  mainElement.innerHTML = lectureContentHtml.join('');
}

fetchLectureContent();
