import { useState, useEffect } from "react";
// import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";


const AdminUserListScreen = () => {
    // const { id: userId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const navigate = useNavigate();
    const userToken = localStorage.getItem('userToken')

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`http://localhost:5000/api/v1/admin/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Failed to fetch Users");
            }
            else {
                setUsers(data.users);
            }
            setLoading(false);

        } catch (error) {
            setError(error.message || 'Server Error. Please try again later');
            setLoading(false);
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        if (userToken) { fetchUsers() }
        else {
            setError('Not authourized. Please login as admin');
            setLoading(false);
            navigate('/login');
        }
    }, [userToken]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action can't be undone")) {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`http://localhost:5000/api/v1/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    },
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.message || "Failed to fetch Users");
                }
                setUsers(users.filter((user) => user._id !== userId)); // Optimistically update UI
                alert('User deleted successfully!');
            } catch (error) {
                setError(error.message || 'Server Error. Please try again later');
                console.error("Failed to delete user:", error);
            }
            finally {
                setLoading(false); // Reset loading state after operation
            }
        }
    };

    const handleCreateUser = () => {
        navigate('/admin/users/create')  //navigate to the create user form
    };

    const handleEditUser = (userId) => {
        navigate(`/admin/users/${userId}/edit`)
    };
    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">User Management</h2>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleCreateUser}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                    Create New User
                </button>
            </div>

            {loading ? (
                <div className="text-center text-lg">Loading users...</div>
            ) : error ? (
                <div className="text-center text-red-500 text-lg">Error: {error}</div>
            ) : users.length === 0 ? (
                <div className="text-center text-lg text-gray-600">No users found.</div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 overflow-hidden text-ellipsis">{user._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditUser(user._id)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

}
export default AdminUserListScreen;