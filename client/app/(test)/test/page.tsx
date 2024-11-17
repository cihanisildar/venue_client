"use client"

import useUserProfile from "@/hooks/useProfile";
import React from "react";

const TesPage = () => {
  const { userProfile, loading, error } = useUserProfile();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {userProfile ? (
        <div>
          <p>Name: {userProfile.username}</p>
          <p>Email: {userProfile.email}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>No user profile available.</p>
      )}
    </div>
  );
};

export default TesPage;
