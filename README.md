Live Site: Access the live site at: [https://your-live-site-url.com](blogging-dashboard.vercel.app).

This is the admin panel for a blogging platform, where admins can manage user content, oversee community guidelines, and moderate platform activity. This README will guide you through the setup and usage of the application.

Table of Contents
Features
Tech Stack
Live Demo
Installation
Usage
Environment Variables
Admin Login
Features
User Management: View, edit, delete, and block/unblock user accounts.
Content Moderation: Oversee user blogs and delete posts that violate policies.
Analytics and Reporting: Monitor user engagement and site statistics (optional).
Authentication and Authorization: Secure login and role-based access control.
Tech Stack
Frontend: React, Tailwind CSS
Backend: Node.js, Express
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
File Storage: Cloudinary (for images and media uploads)
Live Demo
Live Admin Site

Installation
Clone the Repository

bash
Copy code
git clone https://github.com/your-username/blogging-platform-admin.git
cd blogging-platform-admin
Install Dependencies

bash
Copy code
npm install
Create Environment Variables Create a .env file in the root of the project with the following variables:

makefile
Copy code
VITE_SERVER_DOMAIN=http://localhost:3001
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
Start the Development Server

bash
Copy code
npm run dev
The admin panel should now be running on http://localhost:3000.

Usage
Once installed, you can use the following credentials to log in to the admin account:

Email: siam@gmail.com
Password: Aa@123456
Note: For security reasons, please update the credentials before deploying to production.

Environment Variables
Variable	Description
VITE_SERVER_DOMAIN	Backend server URL (e.g., http://localhost:3001 for development)
VITE_CLOUDINARY_CLOUD_NAME	Cloudinary cloud name for media uploads
VITE_CLOUDINARY_UPLOAD_PRESET	Cloudinary preset for uploading files
Admin Login
Login: Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin) in development.
Credentials: Use the default admin login details mentioned above, or update them in the database.
Reset Password: If deploying to a public environment, remember to change the admin password for security.
License
This project is licensed under the MIT License.
