export type ProfileVisibility = "private" | "link" | "public";

export type LetterStatus =
  | "draft"
  | "scheduled"
  | "available"
  | "opened"
  | "revoked"
  | "expired";

export type LetterAccessMode = "account" | "private_link";

export type OpeningRule =
  | "immediate"
  | "at_datetime"
  | "after_interval"
  | "recipient_confirmation";

export type Profile = {
  id: string;
  display_name: string;
  username: string | null;
  avatar_path: string | null;
  bio: string | null;
  preferred_locale: string;
  timezone: string;
  profile_visibility: ProfileVisibility;
  allow_incoming_notes: boolean;
  public_slug: string;
  created_at: string;
  updated_at: string;
};

export type Letter = {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  recipient_name: string | null;
  title: string;
  prompt: string | null;
  body: string;
  status: LetterStatus;
  access_mode: LetterAccessMode;
  opening_rule: OpeningRule;
  opens_at: string | null;
  sender_timezone: string;
  scheduled_send_at: string | null;
  theme_id: string | null;
  sender_label: string | null;
  allow_acknowledgement: boolean;
  opened_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
