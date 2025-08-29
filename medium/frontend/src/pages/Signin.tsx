import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";

export const Signin = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left Side - Sign In Form */}
      <div className="flex items-center justify-center p-6">
        
        <Auth  />
      </div>

      {/* Right Side - Quote (Hidden on Mobile) */}
      <div className="hidden lg:flex items-center justify-center bg-slate-200">
        <Quote />
      </div>
    </div>
  );
};
