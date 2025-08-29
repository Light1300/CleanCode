//@ts-ignore
import { useState, ChangeEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
//@ts-ignore
import { signupInputs } from "@light1300/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this is signup or signin based on the route
  const isSignup = location.pathname === "/signup";
//@ts-ignore
  const [postInputs, setPostInputs] = useState<signupInputs>({
    email: "",
    name: "",
    password: "",
  });

  async function sendRequest() {
    try {
      const endpoint = isSignup ? "signup" : "signin";
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${endpoint}`,
        postInputs
      );

      // Backend returns { jwt: "..." }
      const jwt = response.data.jwt;
      localStorage.setItem("token", jwt);

      navigate("/blogs");
    } catch (e: any) {
      alert(e.response?.data?.message || "Authentication failed. Try again.");
    }
  }

  return (
    <div className="h-screen flex justify-center items-center flex-col bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="text-xl font-semibold">
            {isSignup ? "Create an Account" : "Sign In"}
          </div>
          <div className="text-slate-400 text-sm mt-1">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <Link
              className="pl-2 underline text-blue-600"
              to={isSignup ? "/signin" : "/signup"}
            >
              {isSignup ? "Login" : "Sign Up"}
            </Link>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {isSignup && (
            <LabelledInput
              label="Name"
              type="text"
              placeholder="Enter your full name"
              onChange={(e) => //@ts-ignore
                setPostInputs((c) => ({ ...c, name: e.target.value }))
              }
            />
          )}
          <LabelledInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => //@ts-ignore
              setPostInputs((c) => ({ ...c, email: e.target.value }))
            }
          />
          <LabelledInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => //@ts-ignore
              setPostInputs((c) => ({ ...c, password: e.target.value }))
            }
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={sendRequest}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {isSignup ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </div>
  );
};

interface LabelledInputProps {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
