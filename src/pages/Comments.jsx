import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [commentError, setCommentError] = useState({});
  const [replies, setReplies] = useState({}); // State to manage replies for comments

  // Fetch the list of blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-blogs-comment`);
        setBlogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to fetch blogs');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Fetch comments for a specific blog
  const fetchComments = async (blogId) => {
    try {
      setCommentLoading((prev) => ({ ...prev, [blogId]: true }));
      setCommentError((prev) => ({ ...prev, [blogId]: null }));

      const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/admin-show-comments`, {
        blog_id: blogId,
        skip: 0, // For pagination (if needed)
      });

      setComments((prev) => ({ ...prev, [blogId]: response.data }));
      setCommentLoading((prev) => ({ ...prev, [blogId]: false }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      setCommentError((prev) => ({ ...prev, [blogId]: 'Failed to fetch comments' }));
      setCommentLoading((prev) => ({ ...prev, [blogId]: false }));
    }
  };

  // Fetch replies for a specific comment
  const fetchReplies = (commentId, blogId) => {
    setReplies((prev) => ({
      ...prev,
      [commentId]: prev[commentId] ? !prev[commentId] : true, // Toggle replies
    }));
  };

  // Toggle comments for each blog
  const toggleAccordion = (blogId) => {
    if (comments[blogId]) {
      setComments((prev) => {
        const newComments = { ...prev };
        delete newComments[blogId]; // Hide the comments by removing them from the state
        return newComments;
      });
    } else {
      fetchComments(blogId); // Show the comments by fetching them if not already loaded
    }
  };

  if (loading) {
    return <p>Loading blogs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mx-28 mt-10">
      {blogs.map((blog) => (
        <div key={blog._id} className="mb-4 border border-gray-300 rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="mask mask-squircle h-12 w-12">
                  <img
                    src={blog.author?.personal_info?.profile_img || 'default-img.png'}
                    alt={`${blog.author?.personal_info?.fullname || 'Unknown'}'s profile`} 
                  />
                </div>
              </div>
              <div>
                <div className="font-bold text-lg">{blog.author?.personal_info?.fullname || 'Unknown'}</div>
                <div className="text-gray-500">{blog.title}</div>
              </div>
              <button
                className="ml-auto btn btn-primary btn-sm"
                onClick={() => toggleAccordion(blog._id)}
              >
                {comments[blog._id] ? 'Hide Comments' : 'Show Comments'}
              </button>
            </div>

            {/* Accordion Content (Comments Section) */}
            {comments[blog._id] && (
              <div className="mt-4 p-4 border-t border-gray-200">
                {commentLoading[blog._id] ? (
                  <p>Loading comments...</p>
                ) : commentError[blog._id] ? (
                  <p>{commentError[blog._id]}</p>
                ) : comments[blog._id].length > 0 ? (
                  <ul>
                    {comments[blog._id].map((comment) => (
                      <li key={comment._id} className="my-2">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-8 w-8">
                              <img
                                src={comment.commented_by?.personal_info?.profile_img || 'default-img.png'}
                                alt={`${comment.commented_by?.personal_info?.fullname || 'Unknown'}'s profile`}
                              />
                            </div>
                          </div>
                          <div>
                            <span className="font-bold">{comment.commented_by?.personal_info?.fullname || 'Unknown'}</span>
                            <p>{comment.comment}</p>
                            <span className="text-sm text-gray-500">Commented at: {new Date(comment.commentedAt).toLocaleString()}</span>
                            <button
                              className="btn btn-link btn-xs"
                              onClick={() => fetchReplies(comment._id, blog._id)}
                            >
                              {replies[comment._id] ? 'Hide Replies' : 'Show Replies'}
                            </button>
                          </div>
                        </div>

                        {/* Replies Accordion */}
                        {replies[comment._id] && (
                          <div className="ml-8 mt-2 border-l border-gray-300 pl-4">
                            {comment.children && comment.children.length > 0 ? (
                              <ul>
                                {comment.children.map((reply) => (
                                  <li key={reply._id} className="my-2">
                                    <div className="flex items-center gap-3">
                                      <div className="avatar">
                                        <div className="mask mask-squircle h-6 w-6">
                                          <img
                                            src={reply.commented_by?.personal_info?.profile_img || 'default-img.png'}
                                            alt={`${reply.commented_by?.personal_info?.fullname || 'Unknown'}'s profile`}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <span className="font-bold">{reply.commented_by?.personal_info?.fullname || 'Unknown'}</span>
                                        <p>{reply.comment}</p>
                                        <span className="text-sm text-gray-500">Replied at: {new Date(reply.commentedAt).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No replies yet.</p>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
