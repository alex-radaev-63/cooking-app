import { supabase } from "../supabase-client";

export const householdManageDB = {

  async getOrCreateHousehold(userId: string) {
    
    // Check existing household membership
    const { data: membership, error: membershipError } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (membershipError) {
      throw membershipError;
    }

    // Already has household
    if (membership?.household_id) {
      return membership.household_id;
    }


    // Get user profile info from Supabase Auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }


    const firstName =
      user?.user_metadata?.first_name ||
      user?.user_metadata?.full_name?.split(" ")[0] ||
      "My";

    const householdName = firstName
        ? `${firstName}'s Household`
        : "My Household";


    // Create household
    const { data: household, error: householdError } = await supabase
      .from("households")
      .upsert(
        {
          created_by: userId,
          name: householdName,
        },
        {
          onConflict: "created_by",
        }
      )
      .select()
      .single();
      
    if (householdError) {
      throw householdError;
    }


    // Add user as owner
    const { error: memberError } = await supabase
      .from("household_members")
      .insert({
        household_id: household.id,
        user_id: userId,
        role: "owner",
      });

    if (memberError) {
      throw memberError;
    }
    return household.id;
  },

  async getUserHouseholds(userId: string) {
    const { data, error } = await supabase
      .from("household_members")
      .select(
        `
          role,
          household:households (
            id,
            name,
            created_at
          )
        `,
      )
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return data.map((row) => ({
      ...row.household,
      role: row.role,
    }));
  },

  async renameHousehold (householdId: string, name: string) {
      const trimmedName = name.trim();
  
      if (!trimmedName) {
        throw new Error("Household name cannot be empty.");
      }
  
      const { data, error } = await supabase
        .from("households")
        .update({ name: trimmedName })
        .eq("id", householdId)
        .select()
        .single();
  
      if (error) throw error;
  
      return data;
  },

};