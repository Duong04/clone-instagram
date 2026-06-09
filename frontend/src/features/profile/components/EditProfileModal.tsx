import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useAuthStore } from "~/features/auth/store/useAuthStore";
import type { UpdateProfileRequest } from "~/shared/types/auth";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const isSaving = useAuthStore((s) => s.isLoading);
  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    website: "",
    is_private: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isOpen) return;
    setForm({
      name: user.name ?? "",
      username: user.username ?? "",
      bio: user.bio ?? "",
      website: user.website ?? "",
      is_private: user.is_private,
    });
    setError(null);
  }, [isOpen, user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const payload: UpdateProfileRequest = {
      name: form.name.trim(),
      username: form.username.trim(),
      bio: form.bio.trim() || null,
      website: form.website.trim() || null,
      is_private: form.is_private,
    };

    try {
      await updateProfile(payload);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />
          <motion.form
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <h2 className="font-semibold">Edit profile</h2>
              <button type="button" onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  maxLength={100}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Username</span>
                <input
                  value={form.username}
                  onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
                  className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  maxLength={30}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Website</span>
                <input
                  value={form.website}
                  onChange={(e) => setForm((s) => ({ ...s, website: e.target.value }))}
                  className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  placeholder="https://example.com"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Bio</span>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))}
                  className="mt-1 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400 resize-none"
                  rows={4}
                  maxLength={150}
                />
              </label>

              <label className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold">Private account</span>
                <input
                  type="checkbox"
                  checked={form.is_private}
                  onChange={(e) => setForm((s) => ({ ...s, is_private: e.target.checked }))}
                  className="w-4 h-4"
                />
              </label>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="flex justify-end gap-2 px-5 py-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#0095f6] text-white disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
};
