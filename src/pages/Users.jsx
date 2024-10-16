import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDeleteOutline } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import Swal from 'sweetalert2';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-users`, {
          headers: {
            Authorization: `Bearer ${token}`, // If token-based authentication is required
          },
        });
        setUsers(response.data); // Set the user data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    // If the user confirms the deletion
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token'); // Ensure you get the token
        await axios.delete(`${import.meta.env.VITE_SERVER_DOMAIN}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user._id !== userId)); // Remove deleted user from state
        Swal.fire('Deleted!', 'The user has been deleted.', 'success'); // Show success message
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire('Error!', 'There was a problem deleting the user.', 'error'); // Show error message
      }
    }
  };

  return (
    <div className="overflow-x-auto mx-28 mt-10">
      <table className="table">
        {/* Table header */}
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
          {/* Mapping through the users array */}
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.personal_info.email}</td>
              <td>{user.personal_info.role || 'User'}</td>
              <td>{user.personal_info.username}</td>
              <td>
                <button className="btn btn-ghost"><FaUserEdit /></button>
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
