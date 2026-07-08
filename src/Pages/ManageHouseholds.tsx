import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../Components/context/AuthContext";
import InvitePopUp from "../Components/Invites/InvitePopUp";
import { inviteManageDB } from "../services/inviteManageDB";
import type { Invite } from "../types/household";
import { TbDoorExit } from "react-icons/tb";
import { rolesManageDB } from "../services/rolesManageDB";
import { FaPencil } from "react-icons/fa6";
import { householdManageDB } from "../services/householdManageDB";

const ManageHouseholds = () => {
  const { user } = useAuth();
  const [households, setHouseholds] = useState<any[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null,
  );
  const [editingHouseholdId, setEditingHouseholdId] = useState<string | null>(
    null,
  );
  const [editedName, setEditedName] = useState("");

  const startEditing = (id: string, currentName: string) => {
    setEditingHouseholdId(id);
    setEditedName(currentName);
  };

  const cancelEditing = () => {
    setEditingHouseholdId(null);
    setEditedName("");
  };

  const saveHouseholdName = async (
    householdId: string,
    currentName: string,
  ) => {
    const trimmed = editedName.trim();

    if (!trimmed || trimmed === currentName) {
      setEditingHouseholdId(null);
      setEditedName("");
      return;
    }

    try {
      await householdManageDB.renameHousehold(householdId, trimmed);
      await fetchHouseholds();
    } catch (error) {
      console.error(error);
    }

    setEditingHouseholdId(null);
    setEditedName("");
  };

  const fetchHouseholds = async () => {
    if (!user) return;

    try {
      const data = await householdManageDB.getUserHouseholds(user.id);
      setHouseholds(data);
    } catch (error) {
      console.error(error);
    }
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
        <h1 className="text-[28px] font-medium text-white">All Groups</h1>

        {households.map((h) => (
          <div
            key={h.id}
            className="flex flex-row flex-wrap items-end sm:items-start gap-0 sm:gap-4 rounded-xl border justify-end sm:justify-between border-slate-700 bg-slate-800 px-6 py-5 text-white"
          >
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                {editingHouseholdId === h.id ? (
                  <>
                    <input
                      className="input-default min-h-10 mb-2"
                      value={editedName}
                      autoFocus
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveHouseholdName(h.id, h.name);
                        }

                        if (e.key === "Escape") {
                          cancelEditing();
                        }
                      }}
                      onBlur={cancelEditing}
                    />

                    <button
                      className="btn-primary h-full mb-2"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => saveHouseholdName(h.id, h.name)}
                    >
                      Change
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="mt-1.5 mb-4 text-xl font-semibold capitalize">
                      {h.name}
                    </h2>

                    {h.role === "owner" && (
                      <button
                        className="flex w-6 h-6 items-center justify-center mb-1.5 text-slate-400 hover:text-white"
                        onClick={() => startEditing(h.id, h.name)}
                      >
                        <FaPencil size="14" className="" />
                      </button>
                    )}
                  </>
                )}
              </div>

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
                className="btn-primary w-fit"
                onClick={() => {
                  setSelectedHouseholdId(h.id);
                  setInviteOpen(true);
                }}
              >
                + Invite
              </button>
            )}

            {h.role === "editor" && (
              <button
                className="btn-secondary gap-2 w-fit"
                onClick={async () => {
                  const confirmed = window.confirm(
                    `Leave "${h.name}"? You will lose access to all shared grocery lists.`,
                  );

                  if (!confirmed) return;

                  try {
                    await rolesManageDB.leaveHousehold(h.id);
                    await fetchHouseholds();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <TbDoorExit className="mt-0.5" />
                Leave Group
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
