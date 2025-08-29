"use client";
import { likePost } from "@/app/actions/likePost";

export default function LikeButton({ slug, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = async () => {
    const res = await likePost(slug);
    if (res.success) setLikes(res.total);
  };

  return (
    <button onClick={handleLike} className="...">
      ❤️ {likes}
    </button>
  );
}