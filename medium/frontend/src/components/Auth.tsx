import React, { useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupInputs } from "@light1300/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<signupInputs>({
    email: "",
    name: "",
    password: "",
  });

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      const jwt = response.data.token; // 🔹Assuming backend sends {token: "..."}
      localStorage.setItem("token", jwt);
      navigate("/blog");
    } catch (e: any) {
      alert(e.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="h-screen flex justify-center items-center flex-col bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
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

        {/* Inputs */}
        <div className="space-y-4">
       
            <LabelledInput
              label="Name"
              type="text"
              placeholder="Enter your full name"
              onChange={(e) =>
                setPostInputs((c) => ({
                  ...c,
                  name: e.target.value,
                }))
              }
            />
      
          <LabelledInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            onChange={(e) =>
              setPostInputs((c) => ({
                ...c,
                email: e.target.value,
              }))
            }
          />
          <LabelledInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            onChange={(e) =>
              setPostInputs((c) => ({
                ...c,
                password: e.target.value,
              }))
            }
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={sendRequest}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {type === "signup" ? "Sign Up" : "Sign In"}
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
