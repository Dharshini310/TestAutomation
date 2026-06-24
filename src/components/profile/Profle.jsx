import React from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
  const email =
  localStorage.getItem("email") || "";

const name =
  localStorage.getItem("name") || "";

const designation =
  localStorage.getItem("designation") || "";

const team =
  localStorage.getItem("team") || "";

const userName =
  name || email.split("@")[0];

  return (
    <div className="profile-page">
        <div
      className="back-btn"
      onClick={() => navigate("/user-login")}
    >
      ← Back
    </div>


      <div className="profile-card">

        <div className="profile-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>

        <h2>{userName.toUpperCase()}</h2>

        <div className="profile-info">

          <div className="info-row">
            <label>Name</label>
            <span>{userName.toUpperCase()}</span>
          </div>

          <div className="info-row">
            <label>Email</label>
            <span>{email}</span>
          </div>

          <div className="info-row">
            <label>Designation</label>
            <span>{designation}</span>
          </div>

          <div className="info-row">
            <label>Team</label>
            <span>{team}</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;