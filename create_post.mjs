import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.DATABASE_URL,
});

const postData = {
  title: "Estratégias de Gestão Financeira para Pequenas e Médias Empresas",
  slug: "estrategias-gestao-financeira-pmes",
  excerpt: "Descubra as principais estratégias e ferramentas para otimizar a gestão financeira da sua PME e garantir crescimento sustentável.",
  content: `# Estratégias de Gestão Financeira para Pequenas e Médias Empresas\n\nA gestão financeira eficiente é um dos pilares fundamentais para o sucesso e crescimento sustentável de pequenas e médias empresas (PMEs). Neste artigo, exploraremos as principais estratégias e práticas que podem transformar a saúde financeira do seu negócio.\n\n## Por Que a Gestão Financeira é Crítica para PMEs?\n\nPara uma PME, cada centavo conta. Diferentemente de grandes corporações com departamentos financeiros robustos, pequenas e médias empresas precisam ser ágeis e eficientes na gestão de seus recursos.\n\n## 1. Gestão de Fluxo de Caixa: O Coração da Empresa\n\nO fluxo de caixa é o indicador mais importante para qualquer PME. Diferentemente do lucro contábil, o fluxo de caixa mostra a realidade do dinheiro que entra e sai do negócio.\n\n![Gestão de Fluxo de Caixa](https://files.manuscdn.com/user_upload_by_module/session_file/310419663029753860/nNrPYNanZpwwmwCF.png)\n\n## 2. Planejamento Financeiro Anual: Os 5 Pilares\n\nUm planejamento financeiro sólido é a base para decisões estratégicas. Integre estes 5 pilares no seu plano anual.\n\n![Planejamento Financeiro Anual](https://files.manuscdn.com/user_upload_by_module/session_file/310419663029753860/MGFREjbXkOLVeAzT.png)\n\n## 3. Indicadores Financeiros Essenciais (KPIs)\n\nAcompanhe estes 4 indicadores-chave para entender a saúde financeira da sua PME.\n\n![Indicadores Financeiros](https://files.manuscdn.com/user_upload_by_module/session_file/310419663029753860/ddVukPEIYsSXAXup.png)\n\n## Conclusão\n\nA gestão financeira eficiente não é um luxo, é uma necessidade para PMEs que desejam crescer de forma sustentável.`,
  categoryId: 1,
  featured: true,
  published: true,
};

try {
  const result = await db.execute({
    sql: `INSERT INTO posts (title, slug, excerpt, content, categoryId, featured, published, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    args: [
      postData.title,
      postData.slug,
      postData.excerpt,
      postData.content,
      postData.categoryId,
      postData.featured ? 1 : 0,
      postData.published ? 1 : 0,
    ],
  });

  console.log("✅ Post criado com sucesso!");
  console.log("ID:", result.lastInsertRowid);
  process.exit(0);
} catch (error) {
  console.error("❌ Erro ao criar post:", error);
  process.exit(1);
}
