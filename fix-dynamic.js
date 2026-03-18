const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "app/page.tsx",
  "app/courses/page.tsx",
  "app/courses/[slug]/page.tsx",
  "app/courses/[slug]/[lessonId]/page.tsx",
  "app/blog/page.tsx",
  "app/blog/[slug]/page.tsx",
  "app/dashboard/page.tsx",
  "app/leaderboard/page.tsx",
  "app/admin/page.tsx",
  "app/admin/users/page.tsx",
  "app/admin/courses/page.tsx",
  "app/admin/posts/page.tsx"
];

const exportLine = 'export const dynamic = "force-dynamic";\n';

for (const file of filesToUpdate) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('export const dynamic')) {
      // Find the first import statement and add the export after all imports,
      // or just prepend it after any "use client" if it exists, but these are server components
      // so we can just prepend it at the very top.
      if (content.startsWith('"use client";') || content.startsWith("'use client';")) {
        content = content.replace(/["']use client["'];?\n/, '"use client";\n' + exportLine);
      } else {
        content = exportLine + content;
      }
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
}
