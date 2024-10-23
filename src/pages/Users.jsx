import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDeleteOutline } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import Swal from 'sweetalert2';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState(''); // New state for role selection

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_SERVER_DOMAIN}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user._id !== userId));
        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
      }
    }
  };

  const handleRoleUpdate = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_SERVER_DOMAIN}/users/${userId}/role`, {
        role: newRole, // The new role selected
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update the role in the users state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, personal_info: { ...user.personal_info, role: newRole } } : user
        )
      );

      Swal.fire('Updated!', 'User role has been updated.', 'success');
      setSelectedUser(null); // Close the modal
    } catch (error) {
      console.error('Error updating user role:', error);
      Swal.fire('Error!', 'There was a problem updating the user role.', 'error');
    }
  };

  return (
    <div className="overflow-x-auto mx-28 mt-10">
      <table className="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>User Email</th>
            <th>User Role</th>
            <th>Username</th>
            <th>Edit/Manage</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.personal_info.email}</td>
              <td>{user.personal_info.role || 'User'}</td>
              <td>{user.personal_info.username}</td>
              <td>
                <button
                  className="btn"
                  onClick={() => {
                    setSelectedUser(user); // Set the user to be edited
                    document.getElementById('role_modal').showModal(); // Open the modal
                  }}
                >
                  <FaUserEdit />
                </button>

                {/* Modal for role editing */}
                {selectedUser && selectedUser._id === user._id && (
                  <dialog id="role_modal" className="modal">
                    <div className="modal-box">
                      <h3 className="text-lg font-bold">Update Role for {selectedUser.personal_info.username}</h3>
                      <select
                        className="select select-bordered w-full max-w-xs mt-4"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)} // Update the selected role
                      >
                        <option disabled value="">Select a role</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                      </select>
                      <div className="modal-action">
                        <button className="btn" onClick={() => handleRoleUpdate(selectedUser._id)}>
                          Save
                        </button>
                        <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </dialog>
                )}
              </td>
              <td>
                <button className="btn btn-ghost" onClick={() => handleDelete(user._id)}>
                  <MdDeleteOutline />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
