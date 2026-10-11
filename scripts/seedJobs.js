require("dotenv").config();
const mongoose = require("mongoose");
const Job = require("../models/Job");

const JOBS = [
  {
    slug: "uiux-designer",
    tag: "Design",
    title: "UI/UX Designer",
    heroSubtitle:
      "Design simple, thoughtful experiences for a platform that connects commerce, inventory, operations, and business management.",
    location: "Dhaka / Hybrid",
    employmentType: "Full-time",
    department: "Design",
    postedAgo: "Posted 2 days ago",
    isActive: true,
    order: 1,
    sections: [
      {
        type: "text",
        title: "About the Role",
        text: "We are looking for a UI/UX Designer who can turn complex business workflows into simple and intuitive product experiences. You will work closely with product, engineering, and business teams to design interfaces that help users manage everyday business operations with less friction.",
      },
      {
        type: "list",
        title: "What You'll Work On",
        items: [
          "Design user flows and interfaces for Hisab Bazz products",
          "Simplify complex workflows across POS, Inventory, E-commerce, and business operations",
          "Create wireframes, prototypes, and high-fidelity designs",
          "Maintain consistency across the product design system",
          "Collaborate with developers during implementation",
          "Review existing experiences and identify UX improvements",
          "Help improve usability across desktop product interfaces",
        ],
      },
      {
        type: "list",
        title: "What We're Looking For",
        items: [
          "Strong understanding of UI/UX fundamentals",
          "Experience designing web or SaaS products",
          "Ability to organize complex information into simple experiences",
          "Strong visual hierarchy and layout skills",
          "Experience working with design systems",
          "Good communication and collaboration skills",
          "Ability to explain design decisions clearly",
        ],
      },
      {
        type: "list",
        title: "Nice to Have",
        items: [
          "Experience with business-management or e-commerce products",
          "Experience designing dashboards",
          "Familiarity with POS or inventory workflows",
          "Understanding of responsive product design",
          "Experience collaborating closely with developers",
        ],
      },
      {
        type: "text",
        title: "How We Work",
        text: "We value clarity, practical problem solving, collaboration, and thoughtful execution. The goal is not to add complexity—it is to make business software easier to understand and use.",
      },
    ],
  },
  {
    slug: "product-developer",
    tag: "Engineering",
    title: "Product Developer",
    heroSubtitle:
      "Build and improve core Hisab Bazz features used across commerce, operations, and business management.",
    location: "Dhaka / Hybrid",
    employmentType: "Full-time",
    department: "Engineering",
    postedAgo: "Posted 3 days ago",
    isActive: true,
    order: 2,
    sections: [
      {
        type: "text",
        title: "About the Role",
        text: "We are looking for a Product Developer to build and improve the core features of Hisab Bazz. You will work across product, engineering, and design to deliver features that solve real business problems for our customers.",
      },
      {
        type: "list",
        title: "What You'll Work On",
        items: [
          "Build new features across POS, Inventory, and E-commerce",
          "Work closely with product managers and designers",
          "Improve performance and reliability of existing services",
          "Write clean, testable, maintainable code",
          "Review code and mentor other engineers",
        ],
      },
      {
        type: "list",
        title: "What We're Looking For",
        items: [
          "2+ years of experience building product features",
          "Strong programming fundamentals",
          "Experience with modern web frameworks",
          "Comfort with databases and APIs",
          "Good communication skills",
        ],
      },
      {
        type: "text",
        title: "How We Work",
        text: "We move fast, ship often, and care deeply about quality. Every engineer has real ownership over their work.",
      },
    ],
  },
  {
    slug: "frontend-developer",
    tag: "Engineering",
    title: "Frontend Developer",
    heroSubtitle:
      "Create fast, polished, and scalable interfaces for the Hisab Bazz platform.",
    location: "Dhaka / Hybrid",
    employmentType: "Full-time",
    department: "Engineering",
    postedAgo: "Posted 5 days ago",
    isActive: true,
    order: 3,
    sections: [
      {
        type: "text",
        title: "About the Role",
        text: "We are looking for a Frontend Developer who loves craft and performance. You will build polished, scalable interfaces used by thousands of businesses every day.",
      },
      {
        type: "list",
        title: "What You'll Work On",
        items: [
          "Build responsive UI with React and Tailwind CSS",
          "Implement design systems and reusable components",
          "Optimize performance and accessibility",
          "Collaborate with designers and backend engineers",
          "Ship features weekly with a small, focused team",
        ],
      },
      {
        type: "list",
        title: "What We're Looking For",
        items: [
          "Strong JavaScript/TypeScript skills",
          "Deep experience with React",
          "Understanding of accessibility and semantic HTML",
          "Experience with Tailwind CSS or similar utility frameworks",
          "Eye for design details",
        ],
      },
    ],
  },
  {
    slug: "backend-developer",
    tag: "Engineering",
    title: "Backend Developer",
    heroSubtitle:
      "Build reliable APIs, services, and data systems that power the Hisab Bazz ecosystem.",
    location: "Dhaka / Hybrid",
    employmentType: "Full-time",
    department: "Engineering",
    postedAgo: "Posted 1 week ago",
    isActive: true,
    order: 4,
    sections: [
      {
        type: "text",
        title: "About the Role",
        text: "We are looking for a Backend Developer to build the APIs and services that power Hisab Bazz. You will design and ship reliable, scalable backend systems.",
      },
      {
        type: "list",
        title: "What You'll Work On",
        items: [
          "Build and maintain REST APIs",
          "Design database schemas and queries",
          "Implement authentication and authorization",
          "Optimize performance for high-volume traffic",
          "Collaborate with frontend and product teams",
        ],
      },
      {
        type: "list",
        title: "What We're Looking For",
        items: [
          "Strong backend engineering experience",
          "Experience with relational databases",
          "Understanding of caching, queues, and scaling",
          "Good API design instincts",
          "Comfort with production on-call",
        ],
      },
    ],
  },
  {
    slug: "qa-engineer",
    tag: "Quality Assurance",
    title: "QA Engineer",
    heroSubtitle:
      "Help ensure Hisab Bazz delivers a reliable and consistent product experience across every workflow.",
    location: "Dhaka / Hybrid",
    employmentType: "Full-time",
    department: "Quality Assurance",
    postedAgo: "Posted 1 week ago",
    isActive: true,
    order: 5,
    sections: [
      {
        type: "text",
        title: "About the Role",
        text: "We are looking for a QA Engineer to test, verify, and improve our product before every release.",
      },
      {
        type: "list",
        title: "What You'll Work On",
        items: [
          "Write test plans and test cases",
          "Perform manual and exploratory testing",
          "Set up and maintain automated tests",
          "Report bugs with clear reproduction steps",
          "Work closely with engineers and product",
        ],
      },
      {
        type: "list",
        title: "What We're Looking For",
        items: [
          "Experience in QA for web products",
          "Attention to detail",
          "Familiarity with automated testing frameworks",
          "Strong communication and documentation skills",
        ],
      },
    ],
  },
  {
    slug: "customer-success-executive",
    tag: "Customer Success",
    title: "Customer Success Executive",
    heroSubtitle:
      "Help businesses onboard, understand the platform, and get long-term value from Hisab Bazz.",
    location: "Dhaka",
    employmentType: "Full-time",
    department: "Customer Success",
    postedAgo: "Posted 2 weeks ago",
    isActive: true,
    order: 6,
    sections: [
      {
        type: "text",
        title: "About the Role",
        text: "We are looking for a Customer Success Executive to onboard new businesses and help our customers get real value from Hisab Bazz.",
      },
      {
        type: "list",
        title: "What You'll Work On",
        items: [
          "Onboard new businesses onto the platform",
          "Train customers on POS, Inventory, and E-commerce features",
          "Handle support conversations and follow-ups",
          "Collect feedback and share with product teams",
          "Track customer health and churn signals",
        ],
      },
      {
        type: "list",
        title: "What We're Looking For",
        items: [
          "Excellent communication in Bangla and English",
          "Empathy and patience with customers",
          "Comfort with software tools and dashboards",
          "Prior experience in customer-facing roles is a plus",
        ],
      },
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing jobs (optional — remove if you want to keep them)
    const deleted = await Job.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing jobs`);

    // Insert fresh jobs
    const inserted = await Job.insertMany(JOBS);
    console.log(`✅ Seeded ${inserted.length} jobs`);

    inserted.forEach((j) => {
      console.log(`   → ${j.slug} (${j.title})`);
    });

    await mongoose.disconnect();
    console.log("🎉 Done");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();