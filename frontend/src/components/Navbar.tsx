import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, type RefObject } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useClickOutside<HTMLElement>(dropdownRef as RefObject<HTMLElement>, () => {
    setOpenProfile(false);
  });

  return (
    <>
      <nav className="w-full h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white">
        {/* Left section */}
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-gray-900">ticktock</span>

          <Link
            to="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Time Sheets
          </Link>
        </div>

        {/* Right section */}
        <div className="relative" ref={dropdownRef}>
          {/* Profile trigger */}
          <button
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-1 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
          >
            <span>{user?.name || "User"}</span>

            {/* Down arrow */}
           <ChevronDown className="w-4 h-4" />
          </button>

          {/* Dropdown */}
          {openProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-md z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@email.com"}
                </p>
              </div>

              <button
                onClick={() => {
                  setOpenProfile(false);
                  setShowLogoutModal(true);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout confirmation */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonColor="red"
      />
    </>
  );
}
