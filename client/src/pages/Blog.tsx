import { useState } from "react";
import { Link, useSearch } from "wouter";
import { Search, Calendar, ArrowRight, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

export default function Blog() {
  const searchParams = new URLSearchParams(window.location.search);
  const categorySlug = searchParams.get("categoria");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: posts, isLoading: postsLoading } = trpc.posts.list.useQuery(
    categorySlug ? { categorySlug } : undefined
  );
  const { data: categories } = trpc.categories.list.useQuery();

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-afk-gray-dark to-afk-gray">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Conteúdo sobre gestão financeira, planejamento e estratégias 
              para o crescimento da sua empresa.
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container">
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <Link href="/blog">
              <Button 
                variant={!categorySlug ? "default" : "outline"}
                size="sm"
                className={!categorySlug ? "bg-afk-yellow text-afk-gray-dark hover:bg-afk-yellow-dark" : ""}
              >
                Todos
              </Button>
            </Link>
            {categories?.map((category) => (
              <Link key={category.id} href={`/blog?categoria=${category.slug}`}>
                <Button 
                  variant={categorySlug === category.slug ? "default" : "outline"}
                  size="sm"
                  className={categorySlug === category.slug ? "bg-afk-yellow text-afk-gray-dark hover:bg-afk-yellow-dark" : ""}
                >
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container">
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <Skeleton className="aspect-video" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  {post.imageUrl ? (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-afk-yellow/20 to-afk-gray/10 flex items-center justify-center">
                      <img 
                        src="/images/logo-afk.png" 
                        alt="AFK Consultoria"
                        className="h-16 opacity-50"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      {post.category && (
                        <span className="text-xs font-medium text-afk-yellow-dark uppercase tracking-wide flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {post.category.name}
                        </span>
                      )}
                      {post.publishedAt && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-afk-gray-dark mb-3 group-hover:text-afk-yellow-dark transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-afk-gray text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="text-afk-yellow-dark font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ler mais <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-heading text-afk-gray-dark mb-2">
                Nenhum artigo encontrado
              </h3>
              <p className="text-afk-gray mb-6">
                {searchTerm 
                  ? "Tente buscar por outros termos."
                  : categorySlug 
                    ? "Não há artigos nesta categoria ainda."
                    : "Ainda não há artigos publicados."
                }
              </p>
              {(searchTerm || categorySlug) && (
                <Link href="/blog">
                  <Button variant="outline">Ver Todos os Artigos</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-afk-yellow">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-heading text-afk-gray-dark mb-4">
              Quer receber conteúdo exclusivo?
            </h2>
            <p className="text-afk-gray mb-6">
              Siga-nos no Instagram e LinkedIn para receber dicas e insights 
              sobre gestão financeira.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://instagram.com/consultoriaafk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Seguir no Instagram
              </a>
              <a 
                href="https://linkedin.com/company/consultoria-afk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Seguir no LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
