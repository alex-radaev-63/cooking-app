import { useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { useOutsidePopUpClose } from "../../hooks/useOutsidePopUpClose";

interface DeleteGroupPopUpProps {
  open: boolean;
  householdName: string;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

const DeleteGroupPopUp = ({
  open,
  householdName,
  onClose,
  onDelete,
}: DeleteGroupPopUpProps) => {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  useOutsidePopUpClose(
    popupRef as React.RefObject<HTMLDivElement>,
    onClose,
    open,
  );

  const handleDelete = async () => {
    setLoading(true);

    try {
      await onDelete();
    } catch (error) {
      console.error("Failed to delete group:", error);
    } finally {
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

        <h2 className="mb-5 text-2xl font-semibold">Delete Group</h2>

        <p className="mb-8 text-text-secondary leading-relaxed">
          Deleting{" "}
          <span className="font-semibold text-text-primary">
            {householdName}
          </span>{" "}
          will also permanently delete all grocery lists inside of it for you
          and other users. Do you still want to delete it?
        </p>

        <div className="flex  gap-3">
          <button onClick={onClose} className="btn-secondary w-full min-h-12">
            Keep Group
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn-destructive-primary w-full min-h-12 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGroupPopUp;
