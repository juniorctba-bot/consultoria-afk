import { trpc } from "@/lib/trpc";
import { Link, useSearch } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowLeft, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() 
      ? <mark key={i} className="bg-afk-yellow/50 px-0.5 rounded">{part}</mark>
      : part
  );
}

export default function BlogSearch() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialQuery = params.get("q") || "";
  
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  
  const { data: posts, isLoading } = trpc.posts.search.useQuery(
    { query: activeQuery },
    { enabled: activeQuery.length > 0 }
  );

  useEffect(() => {
    setSearchInput(initialQuery);
    setActiveQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveQuery(searchInput.trim());
      // Update URL without navigation
      window.history.pushState({}, '', `/blog/busca?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-afk-gray to-gray-800">
        <div className="container">
          <Link href="/blog">
            <Button variant="ghost" className="text-white hover:text-afk-yellow mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
          <h1 className="font-bebas text-4xl md:text-5xl text-white mb-4">
            Busca no Blog
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Digite sua busca..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 bg-white border-0 h-12 text-lg"
                />
              </div>
              <Button type="submit" className="bg-afk-yellow text-afk-gray hover:bg-afk-yellow/90 h-12 px-6">
                Buscar
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 flex-1">
        <div className="container">
          {!activeQuery ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="font-bebas text-2xl text-afk-gray mb-2">
                Digite algo para buscar
              </h2>
              <p className="text-gray-600">
                Busque por palavras-chave no título, resumo ou conteúdo dos posts
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-afk-yellow" />
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              <p className="text-gray-600 mb-8">
                {posts.length} resultado{posts.length !== 1 ? 's' : ''} encontrado{posts.length !== 1 ? 's' : ''} para "<strong>{activeQuery}</strong>"
              </p>
              
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <article className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex gap-6">
                        {post.imageUrl && (
                          <div className="hidden md:block w-48 h-32 flex-shrink-0">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {post.category && (
                              <span className="text-xs font-medium text-afk-yellow bg-afk-yellow/10 px-2 py-1 rounded">
                                {post.category.name}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : 'Rascunho'}
                            </span>
                          </div>
                          
                          <h2 className="font-bebas text-xl md:text-2xl text-afk-gray mb-2 hover:text-afk-yellow transition-colors">
                            {highlightText(post.title, activeQuery)}
                          </h2>
                          
                          {post.excerpt && (
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {highlightText(post.excerpt, activeQuery)}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span>AFK Consultoria</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="font-bebas text-2xl text-afk-gray mb-2">
                Nenhum resultado encontrado
              </h2>
              <p className="text-gray-600 mb-6">
                Não encontramos posts com "<strong>{activeQuery}</strong>". Tente outras palavras-chave.
              </p>
              <Link href="/blog">
                <Button className="bg-afk-yellow text-afk-gray hover:bg-afk-yellow/90">
                  Ver todos os posts
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
