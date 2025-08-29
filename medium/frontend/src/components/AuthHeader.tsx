import React from "react";
import { Link } from "react-router-dom";

interface AuthHeaderProps {
  type: "signup" | "signin";
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ type }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="text-xl font-semibold">
        {type === "signup" ? "Create an Account" : "Sign In"}
      </div>
      <div className="text-slate-400 text-sm mt-1">
        {type === "signup"
          ? "Already have an account?"
          : "Don't have an account?"}
        <Link
          className="pl-2 underline text-blue-600"
          to={type === "signup" ? "/signin" : "/signup"}
        >
          {type === "signup" ? "Login" : "Sign Up"}
        </Link>
      </div>
    </div>
  );
};
