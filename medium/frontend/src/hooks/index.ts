import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

// Blog Interface
export interface Blog {
  id: number;
  title: string;
  content: string;
  authorName: string; // Fixed typo from "autherName"
}

// Hook: Fetch all blogs
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlogs(response.data.blogs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { loading, blogs };
};

// Hook: Fetch a single blog
export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlog(response.data.blog);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return { loading, blog };
};
