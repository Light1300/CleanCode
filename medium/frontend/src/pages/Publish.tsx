import { Appbar } from "../components/Appbar"
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { ChangeEvent, useState } from "react";
import axios from "axios";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handlePublish = async () => {
        // 🔹 Validation
        if (!title.trim() || !description.trim()) {
            setError("Title and content cannot be empty.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You are not logged in. Please sign in.");
            navigate("/signin");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/blog`,
                { title, content: description },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Blog Published!");
            setTitle("");
            setDescription("");

            // Optional: If you want instant UI update, trigger a re-fetch of blogs here
            // E.g., if using React Query -> queryClient.invalidateQueries("blogs");

            navigate(`/blog/${response.data.id}`);
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError("Session expired. Please sign in again.");
                navigate("/signin");
            } else {
                setError(err.response?.data?.message || "Failed to publish blog.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Appbar />
            <div className="flex justify-center w-full pt-8">
                <div className="max-w-screen-lg w-full">
                    {error && (
                        <div className="mb-4 text-red-500 font-medium">{error}</div>
                    )}
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        type="text"
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        placeholder="Title"
                    />
                    <TextEditor
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />
                    <button
                        onClick={handlePublish}
                        disabled={loading}
                        type="submit"
                        className={`mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white ${
                            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
                        } rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900`}
                    >
                        {loading ? "Publishing..." : "Publish post"}
                    </button>
                </div>
            </div>
        </div>
    );
};

function TextEditor({
    onChange,
    value,
}: {
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
}) {
    return (
        <div className="mt-2">
            <div className="w-full mb-4">
                <div className="flex items-center justify-between border">
                    <div className="my-2 bg-white rounded-b-lg w-full">
                        <label className="sr-only">Publish post</label>
                        <textarea
                            onChange={onChange}
                            value={value}   
                            id="editor"
                            rows={8}
                            className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2"
                            placeholder="Write an article..."
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
