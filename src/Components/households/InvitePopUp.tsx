import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { useOutsidePopUpClose } from "../../hooks/useOutsidePopUpClose";

interface InvitePopUpProps {
  open: boolean;
  householdId: string;
  onClose: () => void;
  onSend: (householdId: string, email: string[]) => Promise<void>;
}

const InvitePopUp = ({
  open,
  householdId,
  onClose,
  onSend,
}: InvitePopUpProps) => {
  const [email, setEmail] = useState("");
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
      setEmail("");
      setLoading(false);
      setMessage("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter at least one email.");
      return;
    }

    setLoading(true);

    try {
      const emails = email
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      await onSend(householdId, emails);

      setMessage("Invitation sent!");
      setEmail("");
    } catch {
      setMessage("Failed to send invitation.");
    }

    setLoading(false);
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

        <h2 className="mb-8 text-2xl font-semibold">Invite to Household</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-input">Email address</label>

            <input
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage("");
              }}
              className="input-default input-focus"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="btn-secondary w-full min-h-12"
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>

          {message && (
            <p className="text-center text text-primary">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default InvitePopUp;
