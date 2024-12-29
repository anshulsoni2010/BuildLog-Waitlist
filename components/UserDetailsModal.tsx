"use client";

import { useState } from "react";
import { format } from "date-fns";

interface UserActivity {
  type: string;
  metadata: any;
  ipAddress: string;
  userAgent: string;
  geolocation: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  } | null;
  timestamp: string;
}

interface UserNote {
  _id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
  onAddNote: (content: string) => Promise<void>;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

export default function UserDetailsModal({
  user,
  onClose,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "notes" | "tags">("activity");
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<{
    id: string;
    content: string;
  } | null>(null);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await onAddNote(newNote);
    setNewNote("");
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editingNote || !editingNote.content.trim()) return;
    await onUpdateNote(noteId, editingNote.content);
    setEditingNote(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-zinc-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{user.email}</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="border-b border-zinc-800">
          <div className="flex">
            {["activity", "notes", "tags"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "activity" && (
            <div className="space-y-4">
              {user.activities?.map((activity: UserActivity, index: number) => (
                <div
                  key={index}
                  className="bg-zinc-800/50 rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {activity.type.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {format(new Date(activity.timestamp), "PPpp")}
                    </span>
                  </div>
                  {activity.geolocation && (
                    <div className="text-sm text-zinc-400">
                      📍 {activity.geolocation.city}, {activity.geolocation.country}
                    </div>
                  )}
                  <div className="text-sm text-zinc-500">
                    {activity.ipAddress} • {activity.userAgent}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 bg-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>

              <div className="space-y-4">
                {user.notes?.map((note: UserNote) => (
                  <div
                    key={note._id}
                    className="bg-zinc-800/50 rounded-lg p-4 space-y-2"
                  >
                    {editingNote?.id === note._id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingNote.content}
                          onChange={(e) =>
                            setEditingNote({
                              ...editingNote,
                              content: e.target.value,
                            })
                          }
                          className="flex-1 bg-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleUpdateNote(note._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            {note.createdBy}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setEditingNote({
                                  id: note._id,
                                  content: note.content,
                                })
                              }
                              className="text-blue-500 hover:text-blue-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteNote(note._id)}
                              className="text-red-500 hover:text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-zinc-300">{note.content}</p>
                        <div className="text-sm text-zinc-500">
                          {format(new Date(note.createdAt), "PPpp")}
                          {note.updatedAt !== note.createdAt &&
                            ` (edited ${format(
                              new Date(note.updatedAt),
                              "PPpp"
                            )})`}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tags" && (
            <div className="space-y-4">
              {/* TODO: Implement tags functionality */}
              <p className="text-zinc-400">Tags coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
