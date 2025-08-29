import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center mt-8">
          <BlogSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center mt-8 px-4">
        <div className="grid gap-6 w-full max-w-4xl">
          {(blogs || []).map((blog) => (
            <BlogCard
              key={blog.id}
              authorName={blog.authorName || "Anonymous"}
              title={blog.title}
              content={blog.content}
              publishedDate={blog.published ? "Published" : "Draft"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
