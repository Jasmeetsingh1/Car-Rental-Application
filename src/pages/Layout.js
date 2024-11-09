
import React from "react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  SignInButton,
  SignedIn,
  SignOutButton,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";

const Layout = () => {
  const user = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex h-20 sticky justify-between top-0 w-full  bg-black">
      <div className="flex justify-start items-center px-4 py-2 shadow-md">
        <img src="https://www.zoomcar.com/build/98e56e8b0b91e8806885a22ac2bf69a7.png" alt="" className="h-10 w-[180px]" />
      </div>
      <div className="flex items-center justify-end mr-10 w-full h-full text-white text-lg font-semibold space-x-2">
        <Button variant="ghost">
          <Link to="/">Home</Link>
        </Button>
        <SignedOut>
          <Button variant="ghost">
            <SignInButton />
          </Button>
        </SignedOut>{" "}
        <Button variant="ghost">
          <button
            onClick={() => {
              if (!user.userId) {
                alert("Please sign in to continue.");
              } else {
                navigate("/intermediate");
              }
            }}
          >
            Host
          </button>
          
        </Button>
        <Button variant="ghost">
          <button
            onClick={() => {
              
                navigate("/zoomcarteam");
            
            }}
          >
            ZoomCarTeam
          </button>
          
        </Button>
        <SignedIn>
          <Button variant="ghost">
            <SignOutButton signOutCallback={() => navigate("/")} />
          </Button>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Layout;
