'use client';
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const RoleColors = {
    admin: 'bg-sky-500 text-white',       // Softer blue for admin
    manager: 'bg-amber-400 text-gray-900', // Muted yellow/amber with dark text
    user: '',                             // No background for regular users
  };
  
  const CurrentUserHighlight = 'bg-indigo-500 text-white'; // Indigo for the current user

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/all");
        setUsers(response.data);
      } catch (error) {
        setError(error.message);
        toast.error("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center text-xl text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">Error: {error}</div>;

  const getRoleColor = (role) => RoleColors[role] || '';

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-gray-200 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6 text-white">Our Team</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 shadow-md rounded-lg">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Joined Date</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {users
              .sort((a, b) => {
                if (a.role === 'admin') return -1;
                if (b.role === 'admin') return 1;
                if (a.role === 'manager') return -1;
                if (b.role === 'manager') return 1;
                return 0;
              })
              .map((user) => (
                <tr
                  key={user._id}
                  className={`${
                    user._id === loggedInUser?._id ? CurrentUserHighlight : 'hover:bg-gray-800'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}