interface BlogCardProp {
    authorName: string;
    title: string;
    content: string;
    publishedDate?: string;
}

export const BlogCard = ({ 
    authorName,
    title,
    content,
    publishedDate = "Unknown Date"
}: BlogCardProp) => {
    return (
        <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                <Avatar name={authorName} /> 
                <span>{authorName}</span> · <span>{publishedDate}</span>
            </div>
            <div className="text-lg font-bold mb-1">{title}</div>
            <div className="text-gray-700 mb-2">{content.slice(0, 140) + (content.length > 140 ? "..." : "")}</div>
            <div className="text-sm text-gray-500 mb-2">{Math.ceil(content.length / 100)} min read</div>
            <div className="bg-slate-200 h-1 w-full rounded"></div>
        </div>
    );
};

export function Avatar({ name }: { name: string }) {
    return (
        <div className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full text-gray-700 font-semibold">
            {name ? name[0].toUpperCase() : "?"}
        </div>
    );
}
