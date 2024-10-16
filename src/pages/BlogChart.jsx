import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const BlogChart = () => {
    const [stats, setStats] = useState({
        likes: 0,
        comments: 0,
        users: 0,
        blogs: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token'); // Ensure you have the token stored in localStorage

                // Fetch the counts from your backend
                const [likesResponse, commentsResponse, usersResponse, blogsResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-likes`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-comments`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-users-count`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/all-blog-count`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                // Set the counts in state
                setStats({
                    likes: likesResponse.data.length, // Assuming likes are returned as an array
                    comments: commentsResponse.data.length, // Assuming comments are returned as an array
                    users: usersResponse.data.totalUsers, // Assuming the user count is returned as an object
                    blogs: blogsResponse.data.totalBlogs, // Assuming the blog count is returned as an object
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    // Data for the chart
    const data = [
        {
            name: 'Likes',
            count: stats.likes,
        },
        {
            name: 'Comments',
            count: stats.comments,
        },
        {
            name: 'Users',
            count: stats.users,
        },
        {
            name: 'Blogs',
            count: stats.blogs,
        },
    ];

    return (
        <div className='p-6 bg-bgPrimary rounded-lg'>
            <h2 className='text-xl font-semibold  mb-10'>Statistics Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default BlogChart;
