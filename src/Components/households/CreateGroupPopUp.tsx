import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { useOutsidePopUpClose } from "../../hooks/useOutsidePopUpClose";

interface CreateGroupPopUpProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, emails: string[]) => Promise<void>;
}

const CreateGroupPopUp = ({
  open,
  onClose,
  onCreate,
}: CreateGroupPopUpProps) => {
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const popupRef = useRef<HTMLDivElement | null>(null);

  useOutsidePopUpClose(
    popupRef as React.RefObject<HTMLDivElement>,
    onClose,
    open,
  );

  useEffect(() => {
    if (!open) {
      setGroupName("");
      setEmails("");
      setLoading(false);
      setMessage("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setMessage("Please enter a group name.");
      return;
    }

    setLoading(true);

    try {
      const parsedEmails = emails
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

      await onCreate(groupName.trim(), parsedEmails);

      onClose();
    } catch {
      setMessage("Failed to create group.");
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div
        ref={popupRef}
        className="relative w-full max-w-sm rounded-xl bg-[var(--color-card-bg)] p-6 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-text-primary"
        >
          <FiX size={22} />
        </button>

        <h2 className="mb-8 text-2xl font-semibold">Create new group</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-input">Group name</label>

            <input
              autoFocus
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setMessage("");
              }}
              className="input-default input-focus"
            />
          </div>

          <div>
            <label className="label-input">Add members (optional)</label>

            <input
              placeholder="member@email.com"
              value={emails}
              onChange={(e) => {
                setEmails(e.target.value);
                setMessage("");
              }}
              className="input-default input-focus"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !groupName.trim()}
            className="btn-secondary w-full min-h-12"
          >
            {loading ? "Creating..." : "Create group"}
          </button>

          {message && (
            <p className="text-center text text-primary">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPopUp;
