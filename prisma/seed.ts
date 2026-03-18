import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Create Tags
  const tagJS = await prisma.tag.create({ data: { name: "JavaScript" } });
  const tagTS = await prisma.tag.create({ data: { name: "TypeScript" } });
  const tagReact = await prisma.tag.create({ data: { name: "React" } });
  const tagNextJS = await prisma.tag.create({ data: { name: "Next.js" } });
  const tagNode = await prisma.tag.create({ data: { name: "Node.js" } });
  const tagDevOps = await prisma.tag.create({ data: { name: "DevOps" } });

  // Create Users
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "สมชาย ผู้ดูแล",
      email: "admin@devplatform.com",
      password: hashedPassword,
      role: "ADMIN",
      points: 500,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: "วิภาดา เรียนดี",
      email: "wipada@example.com",
      password: hashedPassword,
      role: "USER",
      points: 230,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Alan Walker",
      email: "alan@example.com",
      password: hashedPassword,
      role: "USER",
      points: 180,
    },
  });

  // Create Course 1: JavaScript Fundamentals
  const course1 = await prisma.course.create({
    data: {
      title: "JavaScript พื้นฐาน",
      slug: "javascript-fundamentals",
      description:
        "เริ่มต้นเรียนรู้ภาษา JavaScript ตั้งแต่พื้นฐาน ตัวแปร ฟังก์ชัน การจัดการ DOM และอื่นๆ เหมาะสำหรับผู้เริ่มต้น",
      level: "BEGINNER",
      published: true,
      tags: { connect: [{ id: tagJS.id }] },
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        courseId: course1.id,
        title: "แนะนำ JavaScript",
        content:
          "<h2>ยินดีต้อนรับสู่ JavaScript!</h2><p>JavaScript เป็นภาษาโปรแกรมที่ใช้กันอย่างแพร่หลายบนเว็บ เป็นหนึ่งในสามเทคโนโลยีหลักของ World Wide Web</p><h3>สิ่งที่จะได้เรียนรู้</h3><ul><li>ตัวแปรและประเภทข้อมูล</li><li>Function และ Scope</li><li>การจัดการ DOM</li></ul>",
        order: 1,
      },
      {
        courseId: course1.id,
        title: "ตัวแปรและประเภทข้อมูล",
        content:
          "<h2>ตัวแปรใน JavaScript</h2><p>ใน JavaScript เราสามารถประกาศตัวแปรด้วย <code>let</code>, <code>const</code>, หรือ <code>var</code></p><pre><code>let name = 'สมชาย';\nconst age = 25;\nvar isStudent = true;</code></pre><h3>ประเภทข้อมูล</h3><ul><li>String (ข้อความ)</li><li>Number (ตัวเลข)</li><li>Boolean (จริง/เท็จ)</li><li>null / undefined</li><li>Object</li><li>Array</li></ul>",
        order: 2,
      },
      {
        courseId: course1.id,
        title: "ฟังก์ชันและ Scope",
        content:
          "<h2>ฟังก์ชัน</h2><p>ฟังก์ชันคือบล็อกของโค้ดที่สามารถเรียกใช้ซ้ำได้</p><pre><code>function greet(name) {\n  return `สวัสดี ${name}!`;\n}\n\nconst greetArrow = (name) => `สวัสดี ${name}!`;</code></pre>",
        order: 3,
      },
    ],
  });

  // Create Course 2: React + Next.js
  const course2 = await prisma.course.create({
    data: {
      title: "React และ Next.js สำหรับมืออาชีพ",
      slug: "react-nextjs-pro",
      description:
        "เจาะลึกการสร้างเว็บแอปพลิเคชันด้วย React และ Next.js ครอบคลุม Server Components, App Router และ API Routes",
      level: "INTERMEDIATE",
      published: true,
      tags: { connect: [{ id: tagReact.id }, { id: tagNextJS.id }, { id: tagTS.id }] },
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        courseId: course2.id,
        title: "เริ่มต้นกับ React",
        content:
          "<h2>React คืออะไร?</h2><p>React เป็น JavaScript Library สำหรับสร้าง User Interface ที่พัฒนาโดย Facebook</p><h3>แนวคิดหลัก</h3><ul><li>Component-based architecture</li><li>Virtual DOM</li><li>Declarative UI</li></ul>",
        order: 1,
      },
      {
        courseId: course2.id,
        title: "Next.js App Router",
        content:
          "<h2>App Router ใน Next.js 14</h2><p>App Router เป็นระบบ routing ใหม่ใน Next.js ที่รองรับ React Server Components</p><pre><code>// app/page.tsx\nexport default function Home() {\n  return <h1>Hello!</h1>;\n}</code></pre>",
        order: 2,
      },
      {
        courseId: course2.id,
        title: "Server Components vs Client Components",
        content:
          "<h2>Server vs Client</h2><p>ใน Next.js 14 component ทั้งหมดเป็น Server Component โดยค่าเริ่มต้น หากต้องการใช้ useState หรือ useEffect ต้องเพิ่ม 'use client' ที่ด้านบน</p>",
        order: 3,
      },
    ],
  });

  // Create Enrollments
  await prisma.enrollment.create({
    data: { userId: user1.id, courseId: course1.id },
  });
  await prisma.enrollment.create({
    data: { userId: user2.id, courseId: course2.id },
  });

  // Create Blog Posts
  await prisma.post.create({
    data: {
      title: "เริ่มต้นเส้นทาง Frontend Developer ในปี 2024",
      slug: "frontend-developer-roadmap-2024",
      content:
        "<h2>Frontend Developer ต้องรู้อะไรบ้าง?</h2><p>การเป็น Frontend Developer ในปี 2024 ต้องมีทักษะหลายด้าน ตั้งแต่ HTML, CSS, JavaScript ไปจนถึง React และ Next.js</p><h3>ทักษะที่จำเป็น</h3><ol><li>HTML & CSS พื้นฐาน</li><li>JavaScript ES6+</li><li>React / Vue / Angular</li><li>TypeScript</li><li>Next.js / Nuxt.js</li></ol><p>การเรียนรู้อย่างเป็นระบบจะช่วยให้คุณก้าวหน้าได้เร็วขึ้น</p>",
      published: true,
      authorId: admin.id,
      tags: { connect: [{ id: tagJS.id }, { id: tagReact.id }] },
    },
  });

  await prisma.post.create({
    data: {
      title: "ทำไม TypeScript ถึงเป็นมาตรฐานใหม่ของ JavaScript",
      slug: "why-typescript-is-the-new-standard",
      content:
        "<h2>TypeScript คืออะไร?</h2><p>TypeScript เป็น superset ของ JavaScript ที่เพิ่ม type system เข้ามา ช่วยให้โค้ดมีความปลอดภัยและบำรุงรักษาง่ายขึ้น</p><h3>ข้อดีของ TypeScript</h3><ul><li>ตรวจจับ bug ก่อน runtime</li><li>IntelliSense ที่ดีกว่า</li><li>Refactor ได้ง่ายและปลอดภัย</li><li>เอกสารในตัว (self-documenting)</li></ul>",
      published: true,
      authorId: admin.id,
      tags: { connect: [{ id: tagTS.id }, { id: tagJS.id }] },
    },
  });

  console.log("✅ Seed data created successfully!");
  console.log(
    `  - Users: ${admin.name} (ADMIN), ${user1.name}, ${user2.name}`
  );
  console.log(`  - Courses: ${course1.title}, ${course2.title}`);
  console.log(`  - Tags: JavaScript, TypeScript, React, Next.js, Node.js, DevOps`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
