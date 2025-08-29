import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";

export const Appbar = () => {
  return (
    <div className="border-b flex justify-between items-center px-10 py-4">
      {/* Left: Brand now links to /blogs */}
      <Link
        to="/blogs"
        className="text-xl font-semibold cursor-pointer"
      >
        Medium
      </Link>

      {/* Right: Avatar */}
      <Avatar name="Sarvesh" />
    </div>
  );
};
