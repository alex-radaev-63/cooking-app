import { supabase } from "../supabase-client";


export const rolesManageDB = {
  async leaveHousehold(householdId: string) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("household_members")
      .delete()
      .eq("household_id", householdId)
      .eq("user_id", user.id);

    if (error) throw error;
  },
};