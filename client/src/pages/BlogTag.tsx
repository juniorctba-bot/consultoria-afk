import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { Loader2, Calendar, ArrowRight, Tag, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogTag() {
  const params = useParams();
  const tagSlug = params.slug;

  const { data: tag, isLoading: tagLoading } = trpc.tags.getBySlug.useQuery(
    { slug: tagSlug || "" },
    { enabled: !!tagSlug }
  );

  const { data: posts, isLoading: postsLoading } = trpc.tags.getPostsByTag.useQuery(
    { tagId: tag?.id || 0 },
    { enabled: !!tag?.id }
  );

  const { data: allTags } = trpc.tags.listWithCount.useQuery();

  const isLoading = tagLoading || postsLoading;

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-afk-gray-dark to-afk-gray pt-32 pb-16">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-8 h-8 text-afk-yellow" />
              <span className="text-afk-yellow font-medium">Tag</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading text-white mb-4">
              {tag?.name || "Carregando..."}
            </h1>
            {tag && (
              <p className="text-xl text-gray-300">
                {posts?.length || 0} {posts?.length === 1 ? "post encontrado" : "posts encontrados"} com esta tag
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gray-50 flex-1">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Posts */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-afk-yellow" />
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    >
                      {post.imageUrl && (
                        <Link href={`/blog/${post.slug}`}>
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                      )}
                      <div className="p-6">
                        {post.category && (
                          <Link href={`/blog?categoria=${post.category.slug}`}>
                            <span className="inline-block px-3 py-1 bg-afk-yellow/10 text-afk-yellow-dark text-sm font-medium rounded-full mb-3 hover:bg-afk-yellow/20 transition-colors">
                              {post.category.name}
                            </span>
                          </Link>
                        )}
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="text-xl font-heading text-afk-gray-dark mb-3 group-hover:text-afk-yellow transition-colors">
                            {post.title}
                          </h2>
                        </Link>
                        {post.excerpt && (
                          <p className="text-afk-gray mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-afk-gray">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="ghost" size="sm" className="text-afk-yellow hover:text-afk-yellow-dark">
                              Ler mais
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-afk-gray-dark mb-2">
                    Nenhum post encontrado
                  </h3>
                  <p className="text-afk-gray mb-4">
                    Ainda não há posts com esta tag.
                  </p>
                  <Link href="/blog">
                    <Button className="btn-primary">Ver todos os posts</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* All Tags */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-heading text-lg text-afk-gray-dark mb-4">
                  Todas as Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags?.map((t) => (
                    <Link key={t.id} href={`/blog/tag/${t.slug}`}>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          t.slug === tagSlug
                            ? "text-white"
                            : "bg-gray-100 text-afk-gray hover:bg-gray-200"
                        }`}
                        style={t.slug === tagSlug ? { backgroundColor: t.color || "#FFCE00" } : {}}
                      >
                        <Hash className="w-3 h-3" />
                        {t.name}
                        <span className="text-xs opacity-70">({t.postCount})</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Back to Blog */}
              <div className="bg-afk-yellow/10 rounded-xl p-6">
                <h3 className="font-heading text-lg text-afk-gray-dark mb-2">
                  Explorar mais
                </h3>
                <p className="text-afk-gray text-sm mb-4">
                  Veja todos os artigos do nosso blog sobre gestão financeira.
                </p>
                <Link href="/blog">
                  <Button className="btn-primary w-full">
                    Ver todos os posts
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
