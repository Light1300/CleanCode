import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

// Blog Interface
export interface Blog {
  id: number;
  title: string;
  content: string;
  authorName: string; 
}

// Hook: Fetch all blogs
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        // Safely extract blogs
        const data = response.data;
        const fetchedBlogs = Array.isArray(data)
          ? data
          : data.blogs ?? [];

        setBlogs(fetchedBlogs);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogs([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return { loading, blogs };
};

// Hook: Fetch a single blog
export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        // Safely extract single blog
        const data = response.data;
        setBlog(data.blog ?? null);
      } catch (err) {
        console.error(`Error fetching blog ${id}:`, err);
        setBlog(null); // fallback
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  return { loading, blog };
};
