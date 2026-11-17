import type { Locale } from "./config";

const bn = {
  brand: "অপেক্ষা",
  brandLatin: "Opekkha",
  tagline: "আজ লিখুন। যখন দরকার, তখন খুলুক।",
  heroSupport:
    "প্রিয়জনের জন্য একটি চিঠি তৈরি করুন—দুঃখের সময়, জন্মদিনে, পরীক্ষার পরে, বা এক বছর পরে।",
  ctaWrite: "একটি চিঠি লিখুন",
  ctaHow: "কীভাবে কাজ করে",
  navLogin: "প্রবেশ",
  navSignup: "শুরু করুন",
  navDashboard: "ড্যাশবোর্ড",
  howTitle: "কীভাবে কাজ করে",
  howSteps: [
    { title: "লিখুন", body: "বাংলা, ইংরেজি বা মিশ্র ভাষায় আপনার কথা লিখুন।" },
    { title: "সময় বেছে নিন", body: "এখনই, একটি তারিখে, বা ‘যখন মনে পড়ে’—আপনিই ঠিক করুন।" },
    { title: "শেয়ার করুন", body: "একটি ব্যক্তিগত লিংক বা স্টোরি কার্ড পাঠান—চিঠির ভিতরের কথা গোপন থাকে।" },
    { title: "খুলুন", body: "প্রাপক একটি শান্ত, উষ্ণ অভিজ্ঞতায় চিঠিটি খুলেন।" },
  ],
  useCasesTitle: "এমন মুহূর্তের জন্য",
  useCasesSupport: "প্রতিটি চিঠি একটি নির্দিষ্ট অনুভূতির জন্য—খোলার সময় তুমিই বেছে নাও।",
  useCases: [
    {
      id: "miss",
      title: "যখন তোমার মনে পড়ে আমাকে",
      body: "দূরত্বের রাতেও যেন আমার কথা কাছে থাকে।",
      emoji: "🌙",
    },
    {
      id: "sad",
      title: "যখন তুমি দুঃখ পাও",
      body: "কাঁদার জায়গা নয়—একটু উষ্ণ সান্ত্বনা।",
      emoji: "🌧️",
    },
    {
      id: "birthday",
      title: "তোমার জন্মদিনে",
      body: "মোমবাতি জ্বালার আগেই একটা চুপি চুপি শুভেচ্ছা।",
      emoji: "🎂",
    },
    {
      id: "exam",
      title: "পরীক্ষার পরে",
      body: "ফলাফল যাই হোক—আমি তোমার পাশে আছি।",
      emoji: "📝",
    },
    {
      id: "meet",
      title: "যখন আমরা আবার দেখা করব",
      body: "পুনর্মিলনের দরজায় একটা নরম চিঠি অপেক্ষা করুক।",
      emoji: "🚪",
    },
    {
      id: "year",
      title: "আজ থেকে এক বছর পর",
      body: "সময়ের কাছে রেখে যাওয়া একটা প্রতিশ্রুতি।",
      emoji: "⏳",
    },
  ],
  privacyTitle: "গোপনীয়তাই মূল নীতি",
  privacyBody:
    "চিঠি ডিফল্টে ব্যক্তিগত। শেয়ার প্রিভিউতে পূর্ণ বার্তা দেখা যায় না। খোলার নিয়ম সার্ভারে প্রয়োগ হয়।",
  footerPrivacy: "গোপনীয়তা",
  footerTerms: "শর্তাবলী",
  footerContact: "যোগাযোগ",
  loginTitle: "আবার স্বাগতম",
  loginSupport: "আপনার অ্যাকাউন্টে প্রবেশ করুন।",
  signupTitle: "অপেক্ষা শুরু করুন",
  signupSupport: "শুধু প্রয়োজনীয় তথ্য—কোনো কন্টাক্ট ইমপোর্ট নয়।",
  emailLabel: "ইমেইল",
  passwordLabel: "পাসওয়ার্ড",
  displayNameLabel: "প্রদর্শন নাম",
  submitLogin: "প্রবেশ করুন",
  submitSignup: "অ্যাকাউন্ট তৈরি",
  authNote: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে। আপনার তথ্য ব্যক্তিগত থাকে।",
  dashboardTitle: "আপনার চিঠিসমূহ",
  dashboardEmpty:
    "এখনো কোনো চিঠি নেই। শীঘ্রই এখানে খসড়া, পাঠানো ও নির্ধারিত চিঠি দেখা যাবে।",
  language: "ভাষা",
  theme: "থিম",
  themeDark: "ডার্ক",
  themeLight: "লাইট",
};

const en = {
  brand: "Opekkha",
  brandLatin: "অপেক্ষা",
  tagline: "Write something today. Let someone open it when it matters.",
  heroSupport:
    "Create a personal letter for someone you care about—when they’re sad, on a birthday, after an exam, or a year from now.",
  ctaWrite: "Write a letter",
  ctaHow: "How it works",
  navLogin: "Sign in",
  navSignup: "Get started",
  navDashboard: "Dashboard",
  howTitle: "How it works",
  howSteps: [
    { title: "Write", body: "Write in Bangla, English, or mixed—whatever feels natural." },
    { title: "Choose when", body: "Open now, on a date, or with an ‘open when…’ prompt." },
    { title: "Share", body: "Send a private link or Story card—letter content stays private." },
    { title: "Open", body: "Your recipient opens a calm, warm letter experience." },
  ],
  useCasesTitle: "Made for moments like",
  useCasesSupport: "Each letter waits for a feeling—you choose when it should open.",
  useCases: [
    {
      id: "miss",
      title: "Open when you miss me",
      body: "A soft presence for the nights that feel far away.",
      emoji: "🌙",
    },
    {
      id: "sad",
      title: "Open when you feel sad",
      body: "Not advice—just warmth when the day is heavy.",
      emoji: "🌧️",
    },
    {
      id: "birthday",
      title: "Open on your birthday",
      body: "A quiet wish before the candles go out.",
      emoji: "🎂",
    },
    {
      id: "exam",
      title: "Open after your exam",
      body: "Whatever the result, I’m still with you.",
      emoji: "📝",
    },
    {
      id: "meet",
      title: "Open when we meet again",
      body: "A letter waiting at the door of reunion.",
      emoji: "🚪",
    },
    {
      id: "year",
      title: "Open one year from today",
      body: "A promise left in time’s care.",
      emoji: "⏳",
    },
  ],
  privacyTitle: "Private by default",
  privacyBody:
    "Letters stay private. Share previews never expose the full message. Opening rules are enforced on the server.",
  footerPrivacy: "Privacy",
  footerTerms: "Terms",
  footerContact: "Contact",
  loginTitle: "Welcome back",
  loginSupport: "Sign in to your account.",
  signupTitle: "Start with Opekkha",
  signupSupport: "Only essentials—no contact imports.",
  emailLabel: "Email",
  passwordLabel: "Password",
  displayNameLabel: "Display name",
  submitLogin: "Sign in",
  submitSignup: "Create account",
  authNote: "Password must be at least 8 characters. Your details stay private.",
  dashboardTitle: "Your letters",
  dashboardEmpty:
    "No letters yet. Drafts, sent, and scheduled letters will live here.",
  language: "Language",
  theme: "Theme",
  themeDark: "Dark",
  themeLight: "Light",
};

export type Dictionary = typeof bn;

export const dictionaries: Record<Locale, Dictionary> = {
  bn,
  en,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
