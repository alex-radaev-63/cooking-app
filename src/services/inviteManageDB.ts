import { supabase } from "../supabase-client";

export const inviteManageDB = {
  async sendInvite(householdId: string, emails: string[]) {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("You must be signed in.");
    }

    // 1. normalize (trim + lowercase)
    const normalized = emails
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    // 2. validate emails (regex)
    const validEmails = normalized.filter((email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );

    if (validEmails.length === 0) {
      throw new Error("Please provide at least one valid email.");
    }

    // 3. remove duplicates
    const uniqueEmails = [...new Set(validEmails)];

    // 4. build payload
    const invites = uniqueEmails.map((email) => ({
      household_id: householdId,
      invited_email: email,
      invited_by: user.id,
    }));

    // 5. insert into DB
    const { error } = await supabase
      .from("household_invites")
      .insert(invites);

    if (error) {
      throw error;
    }
  },
};