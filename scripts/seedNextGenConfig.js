require("dotenv").config();
const mongoose = require("mongoose");
const NextGenConfig = require("../models/NextGenConfig");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const existing = await NextGenConfig.findOne({ key: "main" });
    if (existing) {
      console.log("⚠️  Config already exists. Skipping.");
      process.exit(0);
    }

    await NextGenConfig.create({
      key: "main",

      prizes: [
        { position: 1, amount: 500000, label: "1st Prize" },
        { position: 2, amount: 200000, label: "2nd Prize" },
        { position: 3, amount: 100000, label: "3rd Prize" },
      ],
      totalPrizePool: 1000000,

      depositAmount: 200,
      depositEnabled: true,
      depositInstructions:
        "আবেদন করার সময় ৳২০০ refundable deposit পরিশোধ করতে হবে। নির্বাচিত না হলে সম্পূর্ণ টাকা ৭-১৪ কর্মদিবসের মধ্যে ফেরত দেওয়া হবে।",

      heroBadge: "Nationwide Recruitment & Talent Discovery",
      heroTitle: "HISAB BAZZ NextGen Talent",
      heroSubtitle:
        "Talent is Everywhere. Opportunity Isn't. বাংলাদেশের বিভিন্ন জেলা, শহর ও গ্রামের সম্ভাবনাময় তরুণ-তরুণীদের জন্য একটি জাতীয় পর্যায়ের Talent Discovery Initiative।",

      philosophyTitle: "Degree নয়, Potential",
      philosophyText:
        "শুধু শিক্ষাগত যোগ্যতা নয়—একজন মানুষের Potential, Learning Mindset, Creativity, Discipline এবং বাস্তব কাজ করার ক্ষমতা মূল্যায়নের সুযোগ। You don't need to know everything. You need the willingness to learn.",

      eligibilityMinQualification: "SSC Pass",
      eligibilityTraits: [
        "Creativity ও নতুন আইডিয়া তৈরির ক্ষমতা",
        "Communication ও মানুষের সঙ্গে কাজ করার দক্ষতা",
        "Hard Work ও Discipline",
        "Learning Mindset",
        "Problem-solving ability",
        "Leadership ও দায়িত্ব নেওয়ার মানসিকতা",
        "বাস্তব কাজের মাধ্যমে নিজের যোগ্যতা প্রমাণ করার ক্ষমতা",
      ],

      marketingOfficerTitle: "Marketing Officer",
      marketingOfficerText:
        "সফল প্রার্থীরা Hisab Bazz-এর Marketing Officer হিসেবে কাজ করার সুযোগ পাবেন।",
      marketingOfficerDuties: [
        "Facebook, Instagram, YouTube ও অন্যান্য ডিজিটাল প্ল্যাটফর্মে Marketing",
        "Content Marketing ও Campaign Execution",
        "Customer Communication ও Lead Generation",
        "Brand Awareness ও Business Growth",
        "Market Research ও Competitor Analysis",
        "Sales Team এবং অন্যান্য বিভাগের সঙ্গে সমন্বয়",
        "নতুন Marketing Idea তৈরি ও বাস্তবায়ন",
      ],

      benefits: [
        {
          title: "Business ও Marketing শেখা",
          description:
            "Business fundamentals, marketing, sales, branding, digital marketing, leadership এবং বাস্তব ব্যবসা পরিচালনার ধারণা।",
        },
        {
          title: "Business Experts-এর সঙ্গে Networking",
          description:
            "অভিজ্ঞ উদ্যোক্তা ও ব্যবসায়ীদের কাছ থেকে শেখা, অভিজ্ঞতা বিনিময় ও networking।",
        },
        {
          title: "Grooming & Professional Development",
          description:
            "Communication, teamwork, presentation, problem-solving এবং workplace readiness-এর জন্য training ও feedback।",
        },
      ],

      applicationOpen: true,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      maxApplications: 2000000,

      selectionSteps: [
        { order: 1, title: "Application", description: "প্রার্থীর মৌলিক তথ্য, শিক্ষাগত যোগ্যতা, আগ্রহ এবং প্রয়োজনীয় consent সংগ্রহ।" },
        { order: 2, title: "Eligibility Screening", description: "ন্যূনতম যোগ্যতা ও আবেদনপত্রের তথ্য যাচাই।" },
        { order: 3, title: "Talent Assessment", description: "Communication, creativity, problem-solving, learning ability যাচাই।" },
        { order: 4, title: "Practical Challenge", description: "Marketing idea, content creation, campaign planning-এর মাধ্যমে দক্ষতা যাচাই।" },
        { order: 5, title: "Interview & Final Evaluation", description: "Attitude, দায়িত্বশীলতা ও পদের উপযোগিতা মূল্যায়ন।" },
        { order: 6, title: "Final Outcome", description: "নির্বাচিত প্রার্থী ও পুরস্কারপ্রাপ্ত talent-এর ফলাফল জানানো।" },
      ],

      faqs: [
        {
          question: "৳২০০ deposit কি চাকরি কেনার ফি?",
          answer:
            "না। এটি সম্পূর্ণ refundable। assessment-এ serious participation নিশ্চিত করার জন্যই এটি নেওয়া হয়।",
        },
        {
          question: "নির্বাচিত না হলে টাকা কি ফেরত পাবো?",
          answer:
            "হ্যাঁ। নির্বাচিত না হলে সম্পূর্ণ টাকা ৭-১৪ কর্মদিবসের মধ্যে আপনার বিকাশ/নগদ/রকেট নম্বরে ফেরত দেওয়া হবে।",
        },
        {
          question: "কোন ধরনের প্রার্থী নির্বাচিত হবে?",
          answer:
            "শুধু ডিগ্রি নয়, Potential, Learning Mindset, Creativity, Discipline ও বাস্তব কাজ করার ক্ষমতা মূল্যায়ন করা হবে।",
        },
        {
          question: "কতজন নির্বাচিত হবে?",
          answer:
            "Recruitment capacity অনুযায়ী নির্বাচিত হবেন। নির্দিষ্ট সংখ্যা campaign deadline-এর আগে ঘোষণা করা হবে।",
        },
        {
          question: "চাকরি কি রিমোট হবে?",
          answer:
            "Marketing Officer পদের কর্মস্থল, কর্মঘণ্টা ও ধরন সংক্রান্ত সব তথ্য official Job Description-এ উল্লেখ থাকবে।",
        },
      ],

      customQuestions: [
        {
          questionId: "q_why_marketing",
          question: "কেন আপনি Hisab Bazz-এ Marketing Officer হিসেবে কাজ করতে চান?",
          type: "textarea",
          required: true,
        },
        {
          questionId: "q_business_idea",
          question: "আপনার কোনো ব্যবসায়িক আইডিয়া থাকলে সংক্ষেপে লিখুন।",
          type: "textarea",
          required: false,
        },
      ],

      contactEmail: "careers@hisabbaz.com",
      contactPhone: "+880 1700-000000",
    });

    console.log("✅ Config seeded successfully");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seed();