import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../Components/context/AuthContext";
import InvitePopUp from "../Components/Invites/InvitePopUp";
import { inviteManageDB } from "../services/inviteManageDB";
import type { Invite } from "../types/household";

const ManageHouseholds = () => {
  const { user } = useAuth();
  const [households, setHouseholds] = useState<any[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null,
  );

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

  const fetchInvites = async () => {
    if (!user?.email) return;

    const { data, error } = await supabase
      .from("household_invites")
      .select(
        `
          id,
          invited_email,
          invited_by_name,
          status,
          created_at,
          household:households (
            id,
            name
          )
        `,
      )
      .eq("invited_email", user.email)
      .eq("status", "pending");

    if (error) {
      console.error(error);
      return;
    }

    const invitesData = data as unknown as Invite[];

    const formatted = invitesData.map((invite) => ({
      id: invite.id,
      household: {
        id: invite.household.id,
        name: invite.household.name,
      },
      invited_by_name: invite.invited_by_name,
      invited_email: invite.invited_email,
      status: invite.status,
      created_at: invite.created_at,
    }));

    setInvites(formatted);
  };

  useEffect(() => {
    fetchHouseholds();
    fetchInvites();
  }, [user]);

  return (
    <>
      <div className="flex flex-col max-w-[840px] mx-auto p-4 mt-6 gap-4">
        <h1 className="text-[28px] font-medium text-white">All Households</h1>
        {households.map((h) => (
          <div
            key={h.id}
            className="flex flex-col sm:flex-row gap-4 rounded-xl border justify-between border-slate-700 bg-slate-800 px-6 py-5 text-white"
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
            {h.role === "owner" && (
              <button
                className="btn-primary mt-4 sm:mt-0"
                onClick={() => {
                  setSelectedHouseholdId(h.id);
                  setInviteOpen(true);
                }}
              >
                + Invite
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col max-w-[840px] mx-auto p-4 mt-6 gap-4">
        <h1 className="text-[28px] font-medium text-white">My Invites</h1>

        {invites.length === 0 ? (
          <div className="text-slate-500">You have no pending invites.</div>
        ) : (
          invites.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col sm:flex-row gap-4 rounded-xl border border-slate-700 bg-slate-800 px-6 py-5 text-white sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold capitalize mb-4">
                  {inv.household.name}
                </h2>

                <p>
                  <span className="text-slate-400">Invited by:</span>{" "}
                  {inv.invited_by_name}
                </p>

                <p>
                  <span className="text-slate-400">Sent:</span>{" "}
                  {new Date(inv.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-row-reverse sm:flex-row h-full gap-3">
                <button
                  className="btn-primary w-full sm:w-auto"
                  onClick={async () => {
                    try {
                      await inviteManageDB.acceptInvite(inv.id);
                      setInvites((prev) => prev.filter((i) => i.id !== inv.id));
                      fetchHouseholds();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  Accept
                </button>

                <button
                  className="btn-destructive-primary w-full sm:w-auto"
                  onClick={async () => {
                    try {
                      await inviteManageDB.declineInvite(inv.id);
                      await fetchInvites();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
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
