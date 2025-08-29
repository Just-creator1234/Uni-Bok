// "use client";
// import { useState, useOptimistic, startTransition } from "react";
// import { likePost } from "@/app/actions/likePost";

// export function usePostLikes({ slug, initialLikes }) {
//   const [likes, setLikes] = useState(initialLikes);

//   const [optimisticLikes, setOptimisticLikes] = useOptimistic(
//     likes,
//     (state, delta) => state + delta
//   );

//   const toggleLike = () =>
//     startTransition(async () => {
//       const delta = optimisticLikes === likes ? 1 : -1;
//       setOptimisticLikes(delta);

//       const res = await likePost(slug);
//       if (res.success) setLikes(res.total);
//     });

//   return {
//     likes: optimisticLikes,
//     isLiked: optimisticLikes !== likes,
//     toggleLike,
//   };
// }

// hooks/usePostLikes.js
"use client";
import { useState } from "react";
import { likePost } from "@/app/actions/likePost";

export function usePostLikes({ slug, initialLikes, initialLiked = false }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLiked);

  const toggleLike = async () => {
    const res = await likePost(slug);
    if (res.success) {
      setLikes(res.total);
      setIsLiked(res.isLiked);
    }
  };

  return { likes, isLiked, toggleLike };
}
