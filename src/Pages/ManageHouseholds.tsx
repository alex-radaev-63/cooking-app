import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../Components/context/AuthContext";
import InvitePopUp from "../Components/Invites/InvitePopUp";
import { inviteManageDB } from "../services/inviteManageDB";

const ManageHouseholds = () => {
  const { user } = useAuth();
  const [households, setHouseholds] = useState<any[]>([]);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchHouseholds = async () => {
      if (!user) return;

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
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        return;
      }

      const formatted = data.map((row) => ({
        ...row.household,
        role: row.role,
      }));

      setHouseholds(formatted);
    };

    fetchHouseholds();
  }, [user]);

  return (
    <>
      <div className="flex flex-col max-w-[840px] mx-auto p-4 mt-6 gap-4">
        <h1 className="text-[28px] font-medium text-white">All Households</h1>
        {households.map((h) => (
          <div
            key={h.id}
            className="flex flex-col sm:flex-row gap-2 rounded-xl border justify-between border-slate-700 bg-slate-800 px-6 py-5 text-white"
          >
            <div className="flex flex-col gap-1">
              <h2 className="mb-4 text-xl font-semibold capitalize">
                {h.name}
              </h2>
              <p>
                <span className="text-gray-400">Role:</span> {h.role}
              </p>
              <p>
                <span className="text-gray-400">Created:</span>{" "}
                {new Date(h.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                setSelectedHouseholdId(h.id);
                setInviteOpen(true);
              }}
            >
              + Invite
            </button>
          </div>
        ))}
      </div>

      {selectedHouseholdId && (
        <InvitePopUp
          open={isInviteOpen}
          householdId={selectedHouseholdId}
          onClose={() => {
            setInviteOpen(false);
            setSelectedHouseholdId(null);
          }}
          onSend={inviteManageDB.sendInvite}
        />
      )}
    </>
  );
};

export default ManageHouseholds;
