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
      invited_by_name: user.user_metadata.full_name,
      status: "pending",
    }));

    // 5. insert into DB
    const { error } = await supabase
      .from("household_invites")
      .insert(invites);

    if (error) {
      throw error;
    }
  },

  async acceptInvite(inviteId: string) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Get household from invite
    const { data: invite, error: inviteError } = await supabase
      .from("household_invites")
      .select("household_id, status")
      .eq("id", inviteId)
      .single();

    if (inviteError || !invite) {
      throw inviteError;
    }

    if (invite.status !== "pending") {
      throw new Error("This invite has already been responded to.");
    }

    // Check for existing member in DB
    const { data: existingMember, error: existingMemberError } = await supabase
      .from("household_members")
      .select("id")
      .eq("household_id", invite.household_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingMemberError) {
      throw existingMemberError;
    }

    // Add to the household

    if (!existingMember) {
      const { error: memberError } = await supabase
        .from("household_members")
        .insert({
          household_id: invite.household_id,
          user_id: user.id,
          role: "editor",
        });

      if (memberError && memberError.code !== "23505") {
        throw memberError;
      }
    }

    // Mark invite accepted
    const { error: inviteUpdateError } = await supabase
      .from("household_invites")
      .update({
        status: "accepted",
        responded_at: new Date().toISOString(),
      })
      .eq("id", inviteId);

    if (inviteUpdateError) {
      console.error("Invite update failed:", inviteUpdateError);
      throw inviteUpdateError;
    }
  },

  async declineInvite(inviteId: string) {
    // Optional: make sure the invite is still pending
    const { data: invite, error: inviteError } = await supabase
      .from("household_invites")
      .select("status")
      .eq("id", inviteId)
      .single();

    if (inviteError || !invite) {
      throw inviteError;
    }

    if (invite.status !== "pending") {
      throw new Error("This invite has already been responded to.");
    }

    const { error } = await supabase
      .from("household_invites")
      .update({
        status: "declined",
        responded_at: new Date().toISOString(),
      })
      .eq("id", inviteId);

    if (error) {
      throw error;
    }
  }
};