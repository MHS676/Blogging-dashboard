import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import Swal from 'sweetalert2';

const Posts = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  

  const { userAuth } = useContext(UserContext);
  const { access_token } = userAuth;

  console.log(blogs)

  // Fetch blogs from the server
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/admin-all-blogs`, { page });
        setBlogs(response.data.blogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to fetch blogs');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  // Handle deleting a blog
// Function to handle blog deletion
// const handleDelete = async (blogId) => {
//   setDeleting(true);

//   if (!access_token) {
//     alert('No access token found. Please log in.');
//     setDeleting(false);
//     return;
//   }

//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_SERVER_DOMAIN}/admin-delete-blog`,
//       { blog_id: blogId },  // Ensure you're passing the blog_id
//       {
//         headers: {
//           Authorization: `Bearer ${access_token}`, // Pass the JWT token in the header
//         },
//       }
//     );

//     if (response.data.status === 'Blog deleted successfully') {
//       setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.blog_id !== blogId));
//       console.log('Blog deleted successfully.');
//     } else {
//       alert('Failed to delete the blog.');
//     }
//   } catch (error) {
//     console.error('Error deleting blog:', error.response ? error.response.data : error.message);
//     alert('Failed to delete the blog.');
//   } finally {
//     setDeleting(false);
//   }
// };

const handleDelete = async (blogId) => {
  if (!blogId) {
    console.error('No blog ID provided!');
    return;
  }

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
      setDeleting(true); // Set deleting to true before making the request

      const token = localStorage.getItem('token'); // Ensure you get the token
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.message); // Blog deleted successfully message
      Swal.fire('Deleted!', 'The blog has been deleted.', 'success'); // Show success message

      // Update the state to remove the deleted blog without page refresh
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.blog_id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error.response?.data?.message || error.message);
      Swal.fire('Error!', 'There was a problem deleting the blog.', 'error'); // Show error message
    } finally {
      setDeleting(false); // Always reset deleting state
    }
  }
};




  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="overflow-x-auto mx-28 mt-10">
      <table className="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Blog Name</th>
            <th>Publishing Date</th>
            <th>Manage</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog.blog_id} className="bg-base-200">
              <th>{(page - 1) * 5 + index + 1}</th>
              <td>{blog.title}</td>
              <td>{new Date(blog.publishedAt).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-primary">Approve</button>
              </td>
              <td>
                <button
          className="btn btn-danger"
          disabled={deleting}
          onClick={() => handleDelete(blog.blog_id)} // Ensure _id is passed
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          className="btn btn-outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="btn btn-outline"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Posts;
