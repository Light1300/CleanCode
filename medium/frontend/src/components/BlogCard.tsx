import { Link } from "react-router-dom";

interface BlogCardProp {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  readTime?: string;
  tag?: string;
  imageUrl?: string;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
  readTime = "3 min read",
  tag,
  imageUrl,
}: BlogCardProp) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="max-w-3xl mx-auto border-b border-gray-200 py-6 flex justify-between items-start gap-4 hover:bg-gray-50 transition-colors duration-200">
        {/* Left: Text Content */}
        <div className="flex-1">
          {/* Author Section */}
          <div className="flex items-center space-x-2 mb-2">
            <Avatar name={authorName} />
            <span className="text-sm font-medium text-gray-800">{authorName}</span>
            <span className="text-sm text-gray-500">· {publishedDate}</span>
          </div>

          {/* Title */}
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1 leading-snug">
            {title}
          </h2>

          {/* Content Preview */}
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-2">
            {content.slice(0, 140) + (content.length > 140 ? "..." : "")}
          </p>

          {/* Tags & Read time */}
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            {tag && (
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                {tag}
              </span>
            )}
            <span>{readTime}</span>
          </div>
        </div>

        {/* Right: Image */}
        {imageUrl && (
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export function Avatar({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center w-7 h-7 bg-gray-300 rounded-full text-gray-700 text-sm font-semibold">
      {name ? name[0].toUpperCase() : "?"}
    </div>
  );
}
