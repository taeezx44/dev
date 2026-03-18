export const content = {
  global: {
    siteName: "DevAcademy",
    tagline: { th: "แพลตฟอร์มเรียนรู้การเขียนโปรแกรม", en: "Learn to Code Platform" },
  },
  navbar: {
    links: [
      { href: "/courses", label: { th: "หลักสูตร", en: "Courses" } },
      { href: "/blog", label: { th: "บทความ", en: "Blog" } },
      { href: "/roadmap", label: { th: "เส้นทางการเรียนรู้", en: "Roadmap" } },
      { href: "/playground", label: { th: "Playground", en: "Playground" } },
      { href: "/leaderboard", label: { th: "ลีดเดอร์บอร์ด", en: "Leaderboard" } },
    ],
  },
  home: {
    hero: {
      title: { th: "เรียนเขียนโปรแกรมฟรี\nจากศูนย์สู่มืออาชีพ", en: "Learn to Code for Free — From Zero to Pro" },
      subtitle: {
        th: "หลักสูตรออนไลน์คุณภาพสูง พร้อม Playground สำหรับฝึกเขียนโค้ด และเส้นทางการเรียนรู้ที่ชัดเจน",
        en: "High-quality courses, hands-on coding playground, and clear learning roadmaps.",
      },
      primaryCta: { th: "เริ่มเรียนเลย", en: "Start Learning" },
      secondaryCta: { th: "ดูหลักสูตร", en: "Browse Courses" },
    },
    featuredCourses: { th: "หลักสูตรแนะนำ", en: "Featured Courses" },
    latestPosts: { th: "บทความล่าสุด", en: "Latest Posts" },
    topLearners: { th: "นักเรียนยอดเยี่ยม", en: "Top Learners" },
    roadmapTeaser: {
      title: { th: "ไม่รู้จะเริ่มต้นจากตรงไหน?", en: "Not sure where to start?" },
      subtitle: { th: "ดูเส้นทางการเรียนรู้ที่เราจัดเตรียมไว้ให้", en: "Check out our prepared learning roadmaps" },
      cta: { th: "ดู Roadmap", en: "View Roadmap" },
    },
  },
  courses: {
    heading: { th: "หลักสูตรทั้งหมด", en: "All Courses" },
    search: { th: "ค้นหาหลักสูตร...", en: "Search courses..." },
    levels: {
      BEGINNER: { th: "เริ่มต้น", en: "Beginner" },
      INTERMEDIATE: { th: "ปานกลาง", en: "Intermediate" },
      ADVANCED: { th: "ขั้นสูง", en: "Advanced" },
    },
    enrollBtn: { th: "ลงทะเบียนเรียน", en: "Enroll Now" },
    continueBtn: { th: "เรียนต่อ", en: "Continue" },
    lessons: { th: "บทเรียน", en: "Lessons" },
  },
  lesson: {
    markComplete: { th: "ทำเสร็จแล้ว", en: "Mark as Complete" },
    completed: { th: "เสร็จสิ้นแล้ว", en: "Completed" },
    next: { th: "บทเรียนถัดไป", en: "Next Lesson" },
    prev: { th: "บทเรียนก่อนหน้า", en: "Previous Lesson" },
  },
  blog: {
    heading: { th: "บทความ", en: "Blog" },
    readMore: { th: "อ่านเพิ่มเติม", en: "Read More" },
    comments: { th: "ความคิดเห็น", en: "Comments" },
    addComment: { th: "เพิ่มความคิดเห็น", en: "Add Comment" },
  },
  playground: {
    heading: { th: "Playground", en: "Code Playground" },
    run: { th: "รันโค้ด", en: "Run" },
    output: { th: "ผลลัพธ์", en: "Output" },
    languages: ["JavaScript", "Python", "Go", "C#", "C++", "HTML"],
  },
  roadmap: {
    heading: { th: "เส้นทางการเรียนรู้", en: "Learning Roadmap" },
    paths: {
      frontend: { th: "Frontend Developer", en: "Frontend" },
      backend: { th: "Backend Developer", en: "Backend" },
      devops: { th: "DevOps Engineer", en: "DevOps" },
    },
  },
  leaderboard: {
    heading: { th: "ลีดเดอร์บอร์ด", en: "Leaderboard" },
    rank: { th: "อันดับ", en: "Rank" },
    name: { th: "ชื่อ", en: "Name" },
    points: { th: "คะแนน", en: "Points" },
  },
  dashboard: {
    heading: { th: "แดชบอร์ดของฉัน", en: "My Dashboard" },
    myCourses: { th: "หลักสูตรของฉัน", en: "My Courses" },
    myPoints: { th: "คะแนนของฉัน", en: "My Points" },
    myRank: { th: "อันดับของฉัน", en: "My Rank" },
  },
  admin: {
    heading: { th: "แผงควบคุม", en: "Admin Panel" },
    stats: {
      users: { th: "ผู้ใช้ทั้งหมด", en: "Total Users" },
      courses: { th: "หลักสูตรทั้งหมด", en: "Total Courses" },
      posts: { th: "บทความทั้งหมด", en: "Total Posts" },
      enrollments: { th: "การลงทะเบียนทั้งหมด", en: "Total Enrollments" },
    },
  },
  auth: {
    login: {
      title: { th: "เข้าสู่ระบบ", en: "Login" },
      email: { th: "อีเมล", en: "Email" },
      password: { th: "รหัสผ่าน", en: "Password" },
      submit: { th: "เข้าสู่ระบบ", en: "Sign In" },
      noAccount: { th: "ยังไม่มีบัญชี?", en: "Don't have an account?" },
      register: { th: "สมัครสมาชิก", en: "Register" },
    },
    register: {
      title: { th: "สมัครสมาชิก", en: "Register" },
      name: { th: "ชื่อ", en: "Name" },
      email: { th: "อีเมล", en: "Email" },
      password: { th: "รหัสผ่าน", en: "Password" },
      confirmPassword: { th: "ยืนยันรหัสผ่าน", en: "Confirm Password" },
      submit: { th: "สมัครสมาชิก", en: "Sign Up" },
      hasAccount: { th: "มีบัญชีอยู่แล้ว?", en: "Already have an account?" },
      login: { th: "เข้าสู่ระบบ", en: "Login" },
    },
  },
  footer: {
    description: { th: "แพลตฟอร์มเรียนรู้การเขียนโปรแกรมออนไลน์ฟรี สำหรับนักพัฒนาทุกระดับ", en: "Free online coding education for developers at every level." },
    productLinks: [
      { label: "Courses", href: "/courses" },
      { label: "Blog", href: "/blog" },
      { label: "Playground", href: "/playground" },
      { label: "Roadmap", href: "/roadmap" },
    ],
    companyLinks: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
    supportLinks: [
      { label: "Help Center", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
    copyright: "© 2024 DevAcademy. All rights reserved.",
  },
};
