import { useState } from "react";
import toast from "react-hot-toast";

interface AddUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({ onClose, onSuccess }: AddUserModalProps) {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          isVerified,
          fromAdmin: true,
        }),
      });

      if (response.ok) {
        toast.success("User added successfully");
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        if (data.error === "User already exists") {
          toast.error("Email already exists in the waitlist");
        } else {
          toast.error("Failed to add user");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600"
              placeholder="user@example.com"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVerified"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-zinc-200 focus:ring-0"
            />
            <label htmlFor="isVerified" className="text-sm">
              Add as verified user
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-zinc-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
