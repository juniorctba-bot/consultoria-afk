import { Link, useParams } from "wouter";
import { 
  Calendar, 
  Tag, 
  ArrowLeft, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  Copy,
  CheckCircle,
  Hash
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { ImageGallery } from "@/components/ImageGallery";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const [copied, setCopied] = useState(false);

  const { data: post, isLoading } = trpc.posts.getBySlug.useQuery({ slug });
  
  // Fetch gallery images for this post
  const { data: galleryImages } = trpc.gallery.getByPost.useQuery(
    { postId: post?.id || 0 },
    { enabled: !!post?.id }
  );

  // Fetch tags for this post
  const { data: postTags } = trpc.tags.getPostTags.useQuery(
    { postId: post?.id || 0 },
    { enabled: !!post?.id }
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-20">
          <div className="container max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="aspect-video w-full mb-8 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-20">
          <div className="container text-center">
            <h1 className="text-4xl font-heading text-afk-gray-dark mb-4">
              Artigo não encontrado
            </h1>
            <p className="text-afk-gray mb-8">
              O artigo que você está procurando não existe ou foi removido.
            </p>
            <Link href="/blog">
              <Button className="btn-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <article className="container max-w-4xl">
          {/* Back Link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-afk-gray hover:text-afk-yellow-dark transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {post.category && (
                <Link 
                  href={`/blog?categoria=${post.category.slug}`}
                  className="text-sm font-medium text-afk-yellow-dark uppercase tracking-wide flex items-center gap-1 hover:underline"
                >
                  <Tag className="w-4 h-4" />
                  {post.category.name}
                </Link>
              )}
              {post.publishedAt && (
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading text-afk-gray-dark leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-afk-gray mt-4">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="aspect-video rounded-xl overflow-hidden mb-10">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12 prose-headings:font-heading prose-headings:text-afk-gray-dark prose-a:text-afk-yellow-dark prose-a:no-underline hover:prose-a:underline">
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* Image Gallery */}
          {galleryImages && galleryImages.length > 0 && (
            <ImageGallery images={galleryImages} className="mb-12" />
          )}

          {/* Tags */}
          {postTags && postTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-afk-gray font-medium flex items-center gap-1">
                <Hash className="w-4 h-4" />
                Tags:
              </span>
              {postTags.map((tag) => (
                <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:opacity-80"
                    style={{ backgroundColor: tag.color || "#FFCE00", color: "#333" }}
                  >
                    <Hash className="w-3 h-3" />
                    {tag.name}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="border-t border-b py-6 mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-afk-gray">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Compartilhar:</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
                  title="Compartilhar no Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-sky-500 hover:text-white transition-colors"
                  title="Compartilhar no Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition-colors"
                  title="Compartilhar no LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <button
                  onClick={handleCopyLink}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-afk-yellow hover:text-afk-gray-dark transition-colors"
                  title="Copiar link"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-heading text-afk-gray-dark mb-6">
                Artigos Relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {post.relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all"
                  >
                    {relatedPost.imageUrl ? (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={relatedPost.imageUrl} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-afk-yellow/20 to-afk-gray/10 flex items-center justify-center">
                        <img 
                          src="/images/logo-afk.png" 
                          alt="AFK Consultoria"
                          className="h-10 opacity-50"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-afk-gray-dark group-hover:text-afk-yellow-dark transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
