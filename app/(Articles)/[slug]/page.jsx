// app/(Articles)/[slug]/page.jsx
import { getArticlePage } from "@/app/actions/article";
import ArticlePageClient from "./ArticlePageClient";

export default async function ArticlePage({ params }) {
  const { slug } = await params;   // ← await here
  const data = await getArticlePage(slug);
  return <ArticlePageClient article={data.post} relatedArticles={data.relatedArticles} />;
}