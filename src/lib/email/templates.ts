type LetterAvailableArgs = {
  locale: "bn" | "en";
  appUrl: string;
  openUrl?: string | null;
  recipientName?: string | null;
};

/** Letter-available email — no letter body or private title. */
export function letterAvailableEmail(args: LetterAvailableArgs) {
  const home = args.appUrl.replace(/\/$/, "");
  const ctaUrl = args.openUrl || `${home}/dashboard`;
  const name = args.recipientName?.trim();

  if (args.locale === "bn") {
    const greeting = name ? `প্রিয় ${name},` : "হ্যালো,";
    const subject = "অপেক্ষা — একটি চিঠি খোলার জন্য প্রস্তুত";
    const text = [
      greeting,
      "",
      "কেউ আপনার জন্য একটি চিঠি রেখে গেছেন। এখন খোলা যায়।",
      "",
      `খুলুন: ${ctaUrl}`,
      "",
      "চিঠির বিষয়বস্তু ইমেইলে পাঠানো হয় না — শুধু নিরাপদ লিংক।",
      "",
      `অপেক্ষা · ${home}`,
    ].join("\n");
    const html = `
      <p>${escapeHtml(greeting)}</p>
      <p>কেউ আপনার জন্য একটি চিঠি রেখে গেছেন। এখন খোলা যায়।</p>
      <p><a href="${escapeAttr(ctaUrl)}">চিঠি খুলুন</a></p>
      <p style="color:#666;font-size:13px">চিঠির বিষয়বস্তু ইমেইলে পাঠানো হয় না।</p>
      <p style="color:#666;font-size:12px">অপেক্ষা</p>
    `;
    return { subject, text, html };
  }

  const greeting = name ? `Dear ${name},` : "Hello,";
  const subject = "Opekkha — a letter is ready to open";
  const text = [
    greeting,
    "",
    "Someone left you a letter. It’s ready to open now.",
    "",
    `Open: ${ctaUrl}`,
    "",
    "The letter contents are never included in email — only a private link.",
    "",
    `Opekkha · ${home}`,
  ].join("\n");
  const html = `
    <p>${escapeHtml(greeting)}</p>
    <p>Someone left you a letter. It’s ready to open now.</p>
    <p><a href="${escapeAttr(ctaUrl)}">Open the letter</a></p>
    <p style="color:#666;font-size:13px">Letter contents are never included in email.</p>
    <p style="color:#666;font-size:12px">Opekkha</p>
  `;
  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
