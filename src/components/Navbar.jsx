import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

const Navbar = () => {
  const navigate = useNavigate();
  const { userAuth, setUserAuth } = useContext(UserContext);  // Accessing UserContext to manage auth

  const handleLogout = () => {
    setUserAuth(null);
    localStorage.removeItem("user"); // Clear user session
    navigate("/signin");
  };

  return (
    <>
      <div className="navbar bg-gray-100 border-0">
        <div className="flex-1">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User Profile"
                  src={
                    userAuth?.personal_info?.profile_img || 
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"  // Fallback image if user has no profile image
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a to="/admin/settings" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
