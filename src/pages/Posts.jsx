import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import Swal from 'sweetalert2';
import { FaCheck } from 'react-icons/fa'; // Import the FaCheck icon

const Posts = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [approving, setApproving] = useState(false); // To track if approval is in progress
  const [selectedBlog, setSelectedBlog] = useState(null);

  const modalRef = useRef(null); // Ref for modal

  const { userAuth } = useContext(UserContext);
  const { access_token } = userAuth;

  console.log(blogs);

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

  const handleDelete = async (blogId) => {
    if (!blogId) {
      console.error('No blog ID provided!');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        setDeleting(true);
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/${blogId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data.message);
        Swal.fire('Deleted!', 'The blog has been deleted.', 'success');

        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.blog_id !== blogId));
      } catch (error) {
        console.error('Error deleting blog:', error.response?.data?.message || error.message);
        Swal.fire('Error!', 'There was a problem deleting the blog.', 'error');
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleApprove = async (blogId) => {
    if (!blogId) {
      console.error('No blog ID provided!');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to approve this blog!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
    });

    if (result.isConfirmed) {
      try {
        setApproving(true); // Start approving state
        const token = localStorage.getItem('token');
        const response = await axios.put(`${import.meta.env.VITE_SERVER_DOMAIN}/blog/approve/${blogId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data.message);
        Swal.fire('Approved!', 'The blog has been approved.', 'success');

        // Update the blog status to 'approved' immediately in the UI
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.blog_id === blogId ? { ...blog, status: 'approved' } : blog
          )
        );
      } catch (error) {
        console.error('Error approving blog:', error.response?.data?.message || error.message);
        Swal.fire('Error!', 'There was a problem approving the blog.', 'error');
      } finally {
        setApproving(false); // Stop approving state
      }
    }
  };

  const openModal = (blog) => {
    setSelectedBlog(blog);
    if (modalRef.current) {
      modalRef.current.showModal(); // Properly show the modal using ref
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close(); // Close the modal using ref
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
            <th>Author</th>
            <th>Blog Title</th>
            <th>Publishing Date</th>
            <th>Details</th>
            <th>Manage</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
  {blogs.map((blog, index) => (
    <tr key={blog.blog_id} className="bg-base-200">
      <th>{(page - 1) * 5 + index + 1}</th>
      <td>{blog.author.personal_info.username}</td>
      <td>
        {blog.title}
        {blog.is_approved && <FaCheck className="ml-2 text-green-500" />} {/* Show checkmark if approved */}
      </td>
      <td>{new Date(blog.publishedAt).toLocaleDateString()}</td>
      <td>
        <button className="btn" onClick={() => openModal(blog)}>Show</button>
      </td>
      <td>
        {!blog.is_approved && (
          <button className="btn btn-primary" onClick={() => handleApprove(blog.blog_id)}>Approve</button>
        )}
        {blog.is_approved && <FaCheck className="ml-2 text-green-500" />} 
        
      </td>
      <td>
        <button
          className="btn btn-danger"
          disabled={deleting}
          onClick={() => handleDelete(blog.blog_id)}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* Modal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box w-3/4 max-w-5xl">
          {selectedBlog && (
            <>
              <img src={selectedBlog.banner} alt="" />
              <h3 className="font-bold text-lg">{selectedBlog.title}</h3>
              <div className='flex gap-4'>
                <img className='w-7 rounded-full' src={selectedBlog.author.personal_info.profile_img} alt="" />
                <p>Name: {selectedBlog.author.personal_info.username}</p>
                {selectedBlog.status === 'approved' && (
                  <FaCheck className="ml-2 text-green-500" /> // Show FaCheck when blog is approved
                )}
              </div>
              <p>{selectedBlog.des}</p>
            </>
          )}
          <div className="modal-action">
            <button className="btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Posts;
