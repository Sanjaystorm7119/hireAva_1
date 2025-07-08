"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import { useState } from "react";

const UserManagement = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>

      {/* When user is signed out */}
      <SignedOut>
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            Please sign in to access your account
          </p>
          <SignInButton mode="modal">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* When user is signed in */}
      <SignedIn>
        <div className="space-y-4">
          {/* User Info */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">
              User Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {user?.fullName || "Not provided"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              {/* <p>
                <span className="font-medium">User ID:</span> {user?.id}
              </p> */}
              <p>
                <span className="font-medium">Last Sign In:</span>{" "}
                {user?.lastSignInAt
                  ? new Date(user.lastSignInAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* User Actions */}
          <div className="space-y-3">
            {/* Clerk's built-in UserButton with profile management */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-700">
                Account Settings
              </span>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </div>

            {/* Custom logout button */}
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing Out...
                </>
              ) : (
                "Sign Out"
              )}
            </button>
          </div>

          {/* Account Status */}
          <div className="bg-green-50 border border-green-200 p-3 rounded-md">
            <p className="text-sm text-green-800">
              <span className="font-medium">Status:</span> Signed in as{" "}
              {user?.firstName || "User"}
            </p>
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default UserManagement;
