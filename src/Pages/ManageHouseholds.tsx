import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../Components/context/AuthContext";
import InvitePopUp from "../Components/households/InvitePopUp";
import { inviteManageDB } from "../services/inviteManageDB";
import type { Household, Invite } from "../types/household";
import { TbDoorExit } from "react-icons/tb";
import { rolesManageDB } from "../services/rolesManageDB";
import {
  FaPencil,
  FaPlus,
  FaEllipsisVertical,
  FaTrashCan,
} from "react-icons/fa6";
import { householdManageDB } from "../services/householdManageDB";
import CreateGroupPopUp from "../Components/households/CreateGroupPopUp";
import DeleteGroupPopUp from "../Components/households/DeleteGroupPopUp";

const ManageHouseholds = () => {
  const { user, selectHousehold } = useAuth();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);

  const [isInviteOpen, setInviteOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(
    null,
  );
  const [editingHouseholdId, setEditingHouseholdId] = useState<string | null>(
    null,
  );
  const [deleteHouseholdId, setDeleteHouseholdId] = useState<string | null>(
    null,
  );
  const [deleteHouseholdName, setDeleteHouseholdName] = useState("");

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

  const fetchHouseholds = async (): Promise<Household[]> => {
    if (!user) return [];

    try {
      const data = await householdManageDB.getUserHouseholds(user.id);

      const rolePriority: Record<string, number> = {
        owner: 1,
        editor: 2,
      };

      const sorted = [...data].sort((a, b) => {
        const rolePriority: Record<string, number> = {
          owner: 1,
          editor: 2,
        };

        const roleA = rolePriority[a.role] ?? 3;
        const roleB = rolePriority[b.role] ?? 3;

        if (roleA !== roleB) {
          return roleA - roleB;
        }

        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      setHouseholds(sorted);

      return sorted;
    } catch (error) {
      console.error(error);
      return [];
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

  const handleCreateGroup = async (name: string, emails: string[]) => {
    if (!user) return;

    try {
      // Create household
      const household = await householdManageDB.createHousehold(user.id, name);

      // Send invites if members were added
      if (emails.length > 0) {
        await inviteManageDB.sendInvite(household.id, emails);
      }

      // 3. Refresh household list
      await fetchHouseholds();

      // 4. Switch to newly created household
      selectHousehold(household.id);
    } catch (error) {
      console.error("Failed to create household:", error);
      throw error;
    }
  };

  const handleLeaveGroup = async (householdId: string, name: string) => {
    const confirmed = window.confirm(
      `Leave "${name}"? You will lose access to all shared grocery lists.`,
    );

    if (!confirmed) return;

    try {
      await rolesManageDB.leaveHousehold(householdId);
      await fetchHouseholds();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!deleteHouseholdId) return;

    try {
      await householdManageDB.deleteHousehold(deleteHouseholdId);

      const remainingHouseholds = await fetchHouseholds();

      // Select next available group
      if (remainingHouseholds.length > 0) {
        selectHousehold(remainingHouseholds[0].id);
      }

      setDeleteHouseholdId(null);
      setDeleteHouseholdName("");
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  useEffect(() => {
    fetchHouseholds();
    fetchInvites();
  }, [user]);

  return (
    <>
      <div className="flex flex-col max-w-[600px] mx-auto p-4 mt-6 gap-4">
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl font-semibold text-text-primary">
            All Groups
          </h1>
          <button
            onClick={() => setCreateGroupOpen(true)}
            className="flex items-center min-h-10 gap-1 rounded-xl
                          bg-[var(--color-primary)] text-white px-5 py-2 text-sm
                          hover:bg-[var(--color-primary-dark)] hover:cursor-pointer transition-all ease-out duration-300"
          >
            <FaPlus size={14} className="mr-1.5 mt-0.5" />
            New Group
          </button>
        </div>

        {households.map((h) => (
          <div
            key={h.id}
            className="flex flex-row flex-wrap items-end gap-0 sm:gap-4 rounded-xl justify-end sm:justify-between bg-[var(--color-card-bg)] shadow-card px-6 py-5"
          >
            <div className="flex flex-col gap-1 w-full">
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
                      Save Changes
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-3 items-center">
                      <h2 className="mt-1.5 mb-4 text-xl font-semibold capitalize">
                        {h.name}
                      </h2>
                      {h.role === "owner" && (
                        <button
                          className="flex w-6 h-6 items-center justify-center mb-2 
                        text-slate-400 hover:text-text-primary transition"
                          onClick={() => startEditing(h.id, h.name)}
                        >
                          <FaPencil size={14} />
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpenId((prev) => (prev === h.id ? null : h.id))
                        }
                        className="flex h-9 w-9 mb-2 items-center justify-center rounded-lg
                      text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                      >
                        <FaEllipsisVertical size={16} />
                      </button>

                      {menuOpenId === h.id && (
                        <div
                          className="absolute right-0 mt-1 w-44 rounded-lg
                        bg-white shadow-lg border border-gray-200
                          overflow-hidden z-50"
                        >
                          {h.role === "editor" && (
                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                handleLeaveGroup(h.id, h.name);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3
            hover:bg-gray-100 cursor-pointer"
                            >
                              <TbDoorExit size={14} />
                              Leave Group
                            </button>
                          )}

                          {h.role === "owner" && (
                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                setDeleteHouseholdId(h.id);
                                setDeleteHouseholdName(h.name);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3
            text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <FaTrashCan size={13} />
                              Delete Group
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Second row */}
              <div className="flex flex-row flex-wrap w-full justify-between items-end">
                <div className="flex flex-col gap-1 mb-2">
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
                    className="flex font-medium items-center gap-2 px-4 h-11 rounded-lg
                  text-[var(--color-primary)]
                  hover:bg-[var(--color-primary-light)]
                  transition"
                    onClick={() => {
                      setSelectedHouseholdId(h.id);
                      setInviteOpen(true);
                    }}
                  >
                    + Invite Members
                  </button>
                )}

                {/* {h.role === "editor" && (
                  <button
                    className="flex items-center gap-2 px-4 h-11 rounded-lg
                text-[var(--color-text-secondary)]
                hover:bg-gray-100
                hover:text-[var(--color-text)]
                transition cursor-pointer"
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
                    <TbDoorExit size={18} />
                    Leave Group
                  </button>
                )} */}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col max-w-[600px] mx-auto p-4 mt-6 gap-4">
        <h1 className="text-[28px] font-semibold text-text-primary">
          My Invites
        </h1>

        {invites.length === 0 ? (
          <div className="text-slate-500">You have no pending invites.</div>
        ) : (
          invites.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-row flex-wrap items-end gap-0 sm:gap-4 rounded-xl justify-end sm:justify-between bg-[var(--color-card-bg)] shadow-card px-6 py-5"
            >
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <h2 className="mt-1.5 mb-4 text-xl font-semibold capitalize">
                  {inv.household.name}
                </h2>

                <div className="flex flex-col gap-1 mb-2">
                  <p>
                    <span className="text-gray-400">Invited by:</span>{" "}
                    {inv.invited_by_name}
                  </p>

                  <p>
                    <span className="text-gray-400">Sent:</span>{" "}
                    {new Date(inv.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div
                className={`flex flex-row-reverse 
                sm:flex-row items-end gap-3 w-full sm:w-auto
                mt-4 sm:mt-0`}
              >
                <button
                  className="btn-secondary w-full sm:w-auto"
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

      <CreateGroupPopUp
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onCreate={handleCreateGroup}
      />

      {deleteHouseholdId && (
        <DeleteGroupPopUp
          open={true}
          householdName={deleteHouseholdName}
          onClose={() => {
            setDeleteHouseholdId(null);
            setDeleteHouseholdName("");
          }}
          onDelete={handleDeleteGroup}
        />
      )}
    </>
  );
};

export default ManageHouseholds;
