const fs = require('fs');
const path = require('path');

// Set up the content directory path
const contentDir = path.join(__dirname, '..', 'content');

// Create content directory if it doesn't exist
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir);
  console.log('Created content directory');
}

// Generate lecture files
for (let i = 1; i <= 29; i++) {
  const filePath = path.join(contentDir, `lec${i}.html`);

  const content = `<h2>lecture ${i}</h2>
<div class="content">
  <h3>Summary</h3>
  <p>This is a placeholder for lecture ${i} summary.</p>

  <h3>Key Points</h3>
  <ul>
    <li data-order="1">Key point 1 for lecture ${i}</li>
    <li data-order="2">Key point 2 for lecture ${i}</li>
    <li data-order="3">Key point 3 for lecture ${i}</li>
  </ul>

  <h3>Notes</h3>
  <p>Additional notes and details for lecture ${i} will be added here.</p>
</div>
`;

  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Created ${filePath}`);
    } else {
      console.log(`Skipped ${filePath} (already exists)`);
    }
  } catch (error) {
    console.error(`Error creating ${filePath}:`, error);
  }
}
