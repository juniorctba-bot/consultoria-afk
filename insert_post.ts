import { db } from "./server/db";

const postData = {
  title: "Estratégias de Gestão Financeira para Pequenas e Médias Empresas",
  slug: "estrategias-gestao-financeira-pmes",
  excerpt: "Descubra as principais estratégias e ferramentas para otimizar a gestão financeira da sua PME e garantir crescimento sustentável.",
  content: `# Estratégias de Gestão Financeira para Pequenas e Médias Empresas

A gestão financeira eficiente é um dos pilares fundamentais para o sucesso e crescimento sustentável de pequenas e médias empresas (PMEs).

## 1. Gestão de Fluxo de Caixa: O Coração da Empresa

![Gestão de Fluxo de Caixa](https://files.manuscdn.com/user_upload_by_module/session_file/310419663029753860/nNrPYNanZpwwmwCF.png)

## 2. Planejamento Financeiro Anual: Os 5 Pilares

![Planejamento Financeiro Anual](https://files.manuscdn.com/user_upload_by_module/session_file/310419663029753860/MGFREjbXkOLVeAzT.png)

## 3. Indicadores Financeiros Essenciais (KPIs)

![Indicadores Financeiros](https://files.manuscdn.com/user_upload_by_module/session_file/310419663029753860/ddVukPEIYsSXAXup.png)

## Conclusão

A gestão financeira eficiente não é um luxo, é uma necessidade para PMEs que desejam crescer de forma sustentável.`,
  categoryId: 1,
  featured: true,
  published: true,
};

async function main() {
  try {
    const post = await db.createPost(postData);
    console.log("✅ Post criado com sucesso!");
    console.log("ID:", post.id);
  } catch (error) {
    console.error("❌ Erro:", error);
  }
}

main();
