/**
 * Script para migrar dados do banco de dados antigo do blog AFK
 * para o novo sistema.
 * 
 * Uso: node scripts/migrate-data.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ler o arquivo SQL
const sqlPath = path.join(__dirname, '../../upload/anafl452_blog_afk(1).sql');

if (!fs.existsSync(sqlPath)) {
  console.log('Arquivo SQL não encontrado:', sqlPath);
  console.log('Por favor, copie o arquivo anafl452_blog_afk(1).sql para a pasta upload');
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

// Extrair categorias
const categoriesRegex = /INSERT INTO `categorias`.*?VALUES\s*\((.*?)\);/gs;
const categoriesMatch = sqlContent.match(categoriesRegex);

// Extrair posts
const postsRegex = /INSERT INTO `posts`.*?VALUES\s*\(([\s\S]*?)\);/g;
const postsMatch = sqlContent.match(postsRegex);

console.log('=== Dados extraídos do SQL ===\n');

// Categorias padrão do blog AFK
const defaultCategories = [
  { name: 'Planejamento Financeiro', slug: 'planejamento-financeiro' },
  { name: 'Gestão Financeira', slug: 'gestao-financeira' },
  { name: 'Fluxo de Caixa', slug: 'fluxo-de-caixa' },
  { name: 'FIDC', slug: 'fidc' },
  { name: 'Processos Financeiros', slug: 'processos-financeiros' },
];

console.log('Categorias a serem criadas:');
defaultCategories.forEach(cat => {
  console.log(`  - ${cat.name} (${cat.slug})`);
});

console.log('\n=== SQL para inserir categorias ===\n');

defaultCategories.forEach(cat => {
  console.log(`INSERT INTO categories (name, slug, createdAt) VALUES ('${cat.name}', '${cat.slug}', NOW()) ON DUPLICATE KEY UPDATE name=name;`);
});

console.log('\n=== Instruções ===\n');
console.log('1. Acesse o painel administrativo em /admin');
console.log('2. Faça login com sua conta');
console.log('3. Crie as categorias manualmente ou execute o SQL acima no banco de dados');
console.log('4. Crie os posts manualmente através do painel administrativo');
console.log('\nOs posts do blog antigo podem ser copiados manualmente para o novo sistema.');
console.log('O painel administrativo suporta Markdown para formatação do conteúdo.');
