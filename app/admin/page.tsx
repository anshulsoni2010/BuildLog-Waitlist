"use client";

import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { signOut, useSession } from "next-auth/react";
import EditUserModal from "@/components/EditUserModal";
import AddUserModal from "@/components/AddUserModal";
import toast from "react-hot-toast";

interface User {
  _id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  verifiedAt?: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      if (action === "delete" && !confirm("Are you sure you want to remove this user from the waitlist?")) {
        return;
      }

      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please sign in again.");
          signOut({ callbackUrl: "/auth/signin" });
          return;
        }
        throw new Error(data.error || "Failed to perform action");
      }

      toast.success(action === "verify" ? "User verified successfully" : "User removed from waitlist");
      fetchUsers();
    } catch (error) {
      console.error("Error managing user:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const exportToExcel = () => {
    // Prepare data for export
    const exportData = users.map(user => ({
      Email: user.email,
      Status: user.isVerified ? "Verified" : "Pending",
      "Join Date": new Date(user.createdAt).toLocaleString(),
      "Verification Date": user.verifiedAt ? new Date(user.verifiedAt).toLocaleString() : "Not Verified",
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Waitlist Users");

    // Generate Excel file
    XLSX.writeFile(wb, `waitlist-users-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleRefresh = () => {
    toast.promise(
      fetchUsers(),
      {
        loading: 'Refreshing...',
        success: 'Data refreshed successfully',
        error: 'Failed to refresh data'
      }
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "verified" && user.isVerified) ||
      (statusFilter === "unverified" && !user.isVerified);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-zinc-950 text-zinc-200">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Waitlist Management</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Logged in as {session?.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-400">
              Total Users: {users.length} | Verified: {users.filter(u => u.isVerified).length}
            </div>
            <button
              onClick={() => setIsAddingUser(true)}
              className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Add User
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Export to Excel
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800 focus:outline-none focus:border-zinc-700"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800 focus:outline-none focus:border-zinc-700"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-green-600/40 transition-colors"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-4">Email</th>
                <th className="text-left py-4">Status</th>
                <th className="text-left py-4">Joined</th>
                <th className="text-left py-4">Verified At</th>
                <th className="text-left py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-zinc-800">
                  <td className="py-4">{user.email}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isVerified ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {user.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="py-4">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="py-4">
                    {user.verifiedAt ? new Date(user.verifiedAt).toLocaleString() : "-"}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="px-2 py-1 bg-zinc-800 text-zinc-200 rounded hover:bg-zinc-700"
                      >
                        Edit
                      </button>
                      {!user.isVerified && (
                        <button
                          onClick={() => handleUserAction(user._id, "verify")}
                          className="px-2 py-1 bg-zinc-800 text-zinc-200 rounded hover:bg-zinc-700"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleUserAction(user._id, "delete")}
                        className="px-2 py-1 bg-zinc-800 text-zinc-200 rounded hover:bg-zinc-700"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-zinc-400">
            No users found
          </div>
        )}
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={fetchUsers}
        />
      )}

      {isAddingUser && (
        <AddUserModal
          onClose={() => setIsAddingUser(false)}
          onSuccess={fetchUsers}
        />
      )}
    </main>
  );
}
