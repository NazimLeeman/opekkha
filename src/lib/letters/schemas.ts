import { z } from "zod";

export const draftLetterSchema = z.object({
  title: z.string().trim().min(1).max(200),
  prompt: z.string().trim().max(200).optional().nullable(),
  body: z.string().max(20000).default(""),
  recipientName: z.string().trim().max(120).optional().nullable(),
  senderLabel: z.string().trim().max(120).optional().nullable(),
  themeId: z.string().trim().max(64).optional().nullable(),
  allowAcknowledgement: z.boolean().optional().default(false),
});

export const scheduleLetterSchema = draftLetterSchema.extend({
  openingRule: z.enum([
    "immediate",
    "at_datetime",
    "after_interval",
    "recipient_confirmation",
  ]),
  opensAtLocal: z.string().optional().nullable(),
  intervalDays: z.coerce.number().int().positive().optional().nullable(),
  senderTimezone: z.string().default("Asia/Dhaka"),
});

export type DraftLetterInput = z.infer<typeof draftLetterSchema>;
export type ScheduleLetterInput = z.infer<typeof scheduleLetterSchema>;

export const LETTER_PROMPTS = [
  "Open when you miss me",
  "Open when you feel sad",
  "Open when you need courage",
  "Open when you cannot sleep",
  "Open on your birthday",
  "Open on our anniversary",
  "Open after your exam",
  "Open when we meet again",
  "Open one year from today",
] as const;

export const LETTER_PROMPTS_BN = [
  "যখন তোমার মনে পড়ে আমাকে",
  "যখন তুমি দুঃখ পাও",
  "যখন তোমার সাহস দরকার",
  "যখন ঘুম আসে না",
  "তোমার জন্মদিনে",
  "আমাদের বার্ষিকীতে",
  "পরীক্ষার পরে",
  "যখন আমরা আবার দেখা করব",
  "আজ থেকে এক বছর পর",
] as const;
