// utils.js or similar
export const formatData = (blogs = [], users = [], comments = []) => {
  // Example logic: Adjust based on actual requirements
  // Here we assume blogs, users, comments are arrays with counts over time
  const length = Math.max(blogs.length, users.length, comments.length);
  const data = [];

  for (let i = 0; i < length; i++) {
    data.push({
      name: `Period ${i + 1}`,
      posts: blogs[i]?.count || 0,
      users: users[i]?.count || 0,
      comments: comments[i]?.count || 0,
    });
  }

  return data;
};
