import React from "react";
import { getCurrentUser } from "../services/auth.service";
import jwt_decode from "jwt-decode";

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();

  const decoded: any = jwt_decode(currentUser.token);
 
  console.log('------------------ profile ----------------',decoded);
  //console.log('Profile', JSON.parse(currentUser.username));
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{decoded.username}</strong> Profile
        </h3>
      </header>
      
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {decoded.roles &&
          decoded.roles.map((role: string, index: number) => <li key={index}>{role}</li>)}
      </ul>
    </div>
  );
};

export default Profile;
