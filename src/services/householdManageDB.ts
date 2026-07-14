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
      ...(row.household as unknown as {
        id: string;
        name: string;
        created_at: string;
      }),
      role: row.role,
    }));
  },

  async createHousehold(userId: string, name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new Error("Household name cannot be empty.");
    }
    
    // Creating new household entry
    const { data: household, error: householdError } = await supabase
      .from("households")
      .insert({
        created_by: userId,
        name: trimmedName,
      })
      .select()
      .single();

    if (householdError) {
      throw householdError;
    }

    // Assigning creator as owner
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

      return household;
  },

  async deleteHousehold(householdId: string) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("You must be signed in.");
    }

    // Check ownership
    const { data: membership, error: membershipError } = await supabase
      .from("household_members")
      .select("role")
      .eq("household_id", householdId)
      .eq("user_id", user.id)
      .single();

    if (membershipError) {
      throw membershipError;
    }

    if (membership.role !== "owner") {
      throw new Error("Only owners can delete a group.");
    }

    // Delete household (Cascade is configured in Supabase)
    const { error: deleteError } = await supabase
      .from("households")
      .delete()
      .eq("id", householdId);

    if (deleteError) {
      throw deleteError;
    }
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