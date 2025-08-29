interface BlogCardProp {
  id: string;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

export const BlogCard = ({ authorName, title, content, publishedDate }: BlogCardProp) => {
  return (
    <div className="border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors duration-200">
      {/* Author info */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar name={authorName} />
        <span className="font-medium text-gray-800">{authorName}</span>
        <span className="text-sm text-gray-500">· {publishedDate}</span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>

      {/* Content preview */}
      <p className="text-gray-700 text-sm mb-2">
        {content.slice(0, 140) + (content.length > 140 ? "..." : "")}
      </p>

      {/* Read time */}
      <div className="text-sm text-gray-500">
        {Math.ceil(content.length / 100)} min read
      </div>
    </div>
  );
};

export function Avatar({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-gray-700 font-semibold">
      {name ? name[0].toUpperCase() : "?"}
    </div>
  );
}
