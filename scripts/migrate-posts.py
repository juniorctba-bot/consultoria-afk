#!/usr/bin/env python3
"""
Script para migrar posts e categorias do banco de dados antigo para o novo sistema.
Este script lê o arquivo SQL e insere os dados diretamente no banco de dados.
"""

import re
import os
import mysql.connector
from urllib.parse import urlparse

# Ler a URL do banco de dados
DATABASE_URL = os.environ.get('DATABASE_URL', '')

if not DATABASE_URL:
    print("Erro: DATABASE_URL não definida")
    print("Execute: export DATABASE_URL='mysql://user:pass@host:port/database'")
    exit(1)

# Parse da URL
parsed = urlparse(DATABASE_URL)
db_config = {
    'host': parsed.hostname,
    'port': parsed.port or 3306,
    'user': parsed.username,
    'password': parsed.password,
    'database': parsed.path.lstrip('/'),
    'ssl_disabled': False,
}

# Categorias do blog antigo
categories_data = [
    {'id': 1, 'name': 'Processos Financeiros', 'slug': 'processos-financeiros', 'description': 'Conteúdos sobre processos financeiros para sua empresa de qualquer porte'},
    {'id': 2, 'name': 'Planejamento Financeiro', 'slug': 'planejamento-financeiro', 'description': 'Conteúdos sobre planejamento financeiro para sua empresa de qualquer porte'},
    {'id': 3, 'name': 'Fluxo de Caixa', 'slug': 'fluxo-de-caixa', 'description': 'Conteúdos sobre fluxo de caixa financeiro para sua empresa de qualquer porte'},
    {'id': 4, 'name': 'Gestão Financeira', 'slug': 'gestao-financeira', 'description': 'Conteúdos sobre gestão financeira para sua empresa de qualquer porte'},
    {'id': 5, 'name': 'FIDC', 'slug': 'fidc', 'description': 'Conteúdos sobre FIDC para estruturar em sua empresa'},
]

# Mapeamento de category_id antigo para novo
category_mapping = {
    0: 1,  # Processos Financeiros
    1: 2,  # Planejamento Financeiro
    2: 3,  # Fluxo de Caixa
    3: 4,  # Gestão Financeira
    5: 5,  # FIDC
}

# Posts do blog antigo (extraídos do SQL)
posts_data = [
    {
        'title': 'Tempo é Dinheiro: Por que Políticas Financeiras Eficientes Transformam Empresas',
        'slug': 'tempo-e-dinheiro-politicas-financeiras-eficientes',
        'excerpt': 'Como políticas financeiras bem definidas aumentam a eficiência, reduzem desperdícios e impulsionam o crescimento sustentável da sua empresa.',
        'content': '''<p>No mundo dos negócios, cada minuto conta.</p>
<p>E onde há desperdício de tempo, há perda de dinheiro — seja com retrabalho, erros operacionais ou decisões mal embasadas.</p>
<p><strong>Empresas que operam sem diretrizes claras na área financeira estão, na prática, abrindo mão da eficiência e da lucratividade.</strong></p>

<h2>Os Custos Ocultos de Uma Gestão Financeira Desorganizada</h2>
<p>Mesmo que não apareçam diretamente no balanço, os impactos de uma gestão ineficiente são sentidos no dia a dia.</p>
<p>Você pode estar pagando caro por:</p>
<ul>
<li><strong>Processos manuais</strong> e lentos que consomem tempo da equipe;</li>
<li><strong>Falta de padronização</strong> nas decisões financeiras e operacionais;</li>
<li><strong>Ausência de planejamento</strong>, com decisões reativas e inseguras;</li>
<li><strong>Execução baseada no improviso</strong> em vez de em dados concretos;</li>
<li><strong>Dificuldade em antecipar problemas</strong> de caixa ou gargalos operacionais.</li>
</ul>

<h2>O Que São Políticas Financeiras — e Por Que Sua Empresa Precisa Delas?</h2>
<p><strong>Políticas financeiras são diretrizes padronizadas, objetivas e replicáveis</strong> que orientam o funcionamento do setor financeiro.</p>
<p>Com elas, sua empresa ganha:</p>
<ul>
<li>✅ <strong>Controle</strong>: dados confiáveis e decisões seguras;</li>
<li>✅ <strong>Eficiência</strong>: menos retrabalho e mais produtividade;</li>
<li>✅ <strong>Planejamento</strong>: previsibilidade no fluxo de caixa e nas metas financeiras.</li>
</ul>

<h2>Pilares de Uma Estrutura Financeira Eficiente</h2>
<p>Empresas que constroem processos baseados em políticas claras colhem resultados sólidos.</p>

<h3>1. Automatização de tarefas rotineiras</h3>
<p>Ferramentas integradas e digitalização reduzem erros e liberam tempo da equipe para o que realmente importa: a análise estratégica.</p>

<h3>2. Diretrizes claras para decisões operacionais</h3>
<p>Por exemplo: Quando aprovar um investimento? Quando conceder um desconto? Como definir limites de crédito? Esses critérios evitam decisões arbitrárias e inconsistências.</p>

<h3>3. Monitoramento e melhoria contínua</h3>
<p>Até boas políticas precisam ser revisitadas. Avaliações periódicas mantêm os processos eficientes e adaptados ao crescimento da empresa.</p>

<h2>Resultados Reais: O Que Muda com Políticas Financeiras Bem Aplicadas?</h2>
<ul>
<li><strong>Redução dos custos operacionais</strong>;</li>
<li><strong>Melhor uso do capital de giro</strong> e dos recursos financeiros;</li>
<li><strong>Confiança e clareza</strong> entre gestores, sócios e equipes;</li>
<li><strong>Mais tempo e espaço para inovação</strong> e crescimento estratégico;</li>
<li><strong>Visibilidade total</strong> sobre o momento financeiro da empresa.</li>
</ul>

<p><strong>Se você deseja entender como aplicar essas soluções na sua empresa e garantir mais controle e segurança financeira, entre em contato com a Consultoria AFK.</strong></p>''',
        'category_id': 1,
        'published': True,
    },
    {
        'title': 'Trocar o Gestor Financeiro Sem Travar o Crescimento: É Possível?',
        'slug': 'trocar-gestor-financeiro-sem-travar-crescimento',
        'excerpt': 'Saiba como conduzir a troca do gestor financeiro sem prejudicar o crescimento da sua empresa, garantindo continuidade, controle e segurança na transição.',
        'content': '''<p>A maioria das pequenas e médias empresas só percebe o valor de uma estrutura financeira sólida quando algo começa a dar errado. Uma das situações mais críticas é a troca do gestor financeiro.</p>
<p>Essa decisão, que parece pontual, pode gerar efeitos colaterais em cadeia se não for conduzida com estratégia.</p>

<h2>Os Riscos de Uma Transição Mal Conduzida</h2>
<ul>
<li>❌ Processos paralisados ou desorganizados;</li>
<li>❌ Equipes inseguras e sem direcionamento;</li>
<li>❌ Perda de conhecimento acumulado;</li>
<li>❌ Falta de clareza nos dados e nos próximos passos.</li>
</ul>
<p>Esses impactos são ainda mais perigosos quando ocorrem em meio a um ciclo de crescimento acelerado, revelando fragilidades estruturais antes despercebidas.</p>

<h2>Como Manter o Ritmo Durante a Mudança?</h2>
<p>Na <strong>Consultoria AFK</strong>, já ajudamos dezenas de empresas a navegar por momentos de transição como este — sem perder o controle e a performance da operação financeira.</p>
<p><strong>Veja como fazemos isso na prática:</strong></p>
<ol>
<li>✅ <strong>Gestão terceirizada temporária:</strong> assumimos a gestão financeira como um "interino estratégico", garantindo continuidade e controle durante a transição.</li>
<li>✅ <strong>Estruturação de processos:</strong> criamos rotinas, indicadores e padrões que permanecem na empresa mesmo após nossa atuação.</li>
<li>✅ <strong>Transição com transferência de conhecimento:</strong> preservamos o histórico e o know-how, conduzindo uma passagem de bastão segura e sem ruídos.</li>
<li>✅ <strong>Capacitação da equipe interna:</strong> treinamos a equipe e entregamos visão clara e objetiva para os sócios.</li>
</ol>

<h2>Trocar o Gestor Financeiro Pode Ser Uma Evolução — Não Um Trauma</h2>
<p>Toda empresa passa por mudanças. A diferença está em como elas são conduzidas.</p>
<p>Com uma abordagem profissional, a transição deixa de ser uma ameaça e passa a ser uma oportunidade para reestruturar, fortalecer e modernizar a área financeira.</p>

<h2>Transforme o Caos da Transição em Clareza e Crescimento</h2>
<p>A <strong>Consultoria AFK</strong> atua justamente nesse momento crítico. Ajudamos empresas em fase de crescimento ou com mudanças na liderança financeira a manter o ritmo sem perder a visão estratégica.</p>
<p>Liderada por <strong>Ana Flávia Krisanovski</strong>, nossa equipe acumula mais de 25 anos de experiência em reestruturações financeiras de alto impacto.</p>

<p><strong>Receba um diagnóstico gratuito e descubra como estruturar uma transição sem trauma — com estratégia, segurança e continuidade.</strong></p>''',
        'category_id': 4,
        'published': True,
    },
    {
        'title': 'Revisão de Processos Financeiros: O Segredo para Mais Controle, Eficiência e Crescimento Sustentável',
        'slug': 'revisao-processos-financeiros-controle-eficiencia',
        'excerpt': 'Entenda por que revisar e documentar os processos financeiros da sua empresa é essencial para garantir controle, eficiência e crescimento sustentável.',
        'content': '''<p>Manter processos financeiros bem estruturados e atualizados é fundamental para a sustentabilidade e o crescimento contínuo de qualquer negócio.</p>
<p>No entanto, muitas empresas negligenciam a revisão periódica dessas rotinas, o que pode gerar ineficiências, desperdícios e até riscos graves para a operação.</p>
<p><strong>Revisar, documentar e otimizar processos financeiros é o caminho para reduzir erros, aumentar a previsibilidade e garantir uma gestão mais segura e eficaz.</strong></p>

<h2>Por Que Revisar os Processos Financeiros?</h2>
<p>Processos bem desenhados são a base da saúde financeira da empresa. Mas não basta criá-los uma vez — é necessário revê-los regularmente para garantir que continuem alinhados ao crescimento da empresa, às mudanças do mercado e à legislação vigente.</p>

<h2>Benefícios de Ter Processos Financeiros Documentados</h2>
<p>Um sistema financeiro bem estruturado proporciona:</p>
<ul>
<li><strong>Redução de erros e retrabalho</strong>, aumentando a eficiência da equipe;</li>
<li><strong>Mais clareza nas operações</strong> e transparência para os gestores;</li>
<li><strong>Facilidade no treinamento</strong> de novos colaboradores e transições de cargos;</li>
<li><strong>Maior controle sobre o fluxo de caixa</strong> e os custos operacionais.</li>
</ul>

<h2>Revisão Contínua: Um Diferencial Competitivo</h2>
<p>Negócios bem-sucedidos se adaptam rapidamente às mudanças. Isso exige uma <strong>revisão constante das rotinas financeiras</strong>, permitindo:</p>
<ul>
<li><strong>Identificar gargalos e falhas</strong> antes que virem problemas maiores;</li>
<li><strong>Implementar melhorias e inovações</strong> conforme a empresa cresce;</li>
<li><strong>Atualizar práticas</strong> com base nas novas tecnologias e exigências do mercado;</li>
<li><strong>Reduzir riscos operacionais</strong> e aumentar a previsibilidade.</li>
</ul>

<h2>O Perigo de Depender de Pessoas-Chave</h2>
<p>Concentrar o conhecimento financeiro em poucos colaboradores é um risco.</p>
<p>Quando uma dessas pessoas sai, leva consigo informações críticas e cria um vácuo na operação.</p>

<h2>Conclusão: Otimize Seus Processos, Fortaleça Seu Negócio</h2>
<p><strong>Revisar e documentar os processos financeiros não é uma tarefa opcional.</strong></p>
<p>É uma necessidade estratégica para empresas que desejam crescer com eficiência, segurança e sustentabilidade.</p>

<p><strong>Entre em contato com a Consultoria AFK e descubra como transformar sua gestão financeira com inteligência e controle.</strong></p>''',
        'category_id': 1,
        'published': True,
    },
    {
        'title': 'FIDC: Reduza Tributos e Amplie o Fluxo de Caixa da Sua Empresa',
        'slug': 'fidc-reduza-tributos-amplie-fluxo-caixa',
        'excerpt': 'Descubra como o FIDC pode ajudar sua empresa a reduzir impostos, antecipar recebíveis e melhorar o fluxo de caixa para crescer com segurança financeira.',
        'content': '''<p>Empresas que realizam <strong>vendas a prazo</strong> enfrentam desafios recorrentes com o <strong>fluxo de caixa</strong>, <strong>inadimplência</strong> e <strong>carga tributária elevada</strong>. Nesse cenário, o <strong>Fundo de Investimento em Direitos Creditórios (FIDC)</strong> surge como uma solução estratégica para transformar recebíveis em capital imediato, melhorar a previsibilidade financeira e reduzir impostos de forma legal e eficiente.</p>

<h2>Por que o FIDC é uma solução para empresas que vendem a prazo?</h2>
<p>Negócios que operam com prazos de pagamento sabem que o controle dos <strong>recebíveis</strong> impacta diretamente na <strong>saúde financeira</strong>. O FIDC funciona como uma ferramenta para antecipar receitas, reforçar o <strong>capital de giro</strong>, reduzir a dependência de crédito bancário e, principalmente, cortar custos com tributos.</p>

<h2>Quando considerar a criação de um FIDC?</h2>
<p>O FIDC é indicado para empresas que:</p>
<ul>
<li>Possuem alto volume de <strong>vendas a prazo</strong>;</li>
<li>Querem transformar <strong>recebíveis em capital imediato</strong> para reinvestimento;</li>
<li>Buscam <strong>previsibilidade e organização financeira</strong>;</li>
<li>Desejam <strong>reduzir a carga tributária</strong> sobre o lucro operacional;</li>
<li>Precisam de <strong>liquidez</strong> sem recorrer a <strong>empréstimos bancários caros</strong>.</li>
</ul>

<h2>Principais benefícios do FIDC para sua empresa</h2>
<h3>1. Redução de carga tributária (IRPJ e CSLL)</h3>
<p>Com o FIDC, os lucros deixam de ser tributados na estrutura tradicional (~34%) e passam a ser distribuídos com tributação reduzida (15%), gerando significativa economia tributária.</p>

<h3>2. Melhoria no fluxo de caixa e previsibilidade</h3>
<p>Antecipando os valores das vendas a prazo, o FIDC transforma créditos futuros em capital imediato, aumentando a liquidez e facilitando o <strong>planejamento financeiro</strong>.</p>

<h3>3. Gestão profissional dos recebíveis</h3>
<p>O FIDC traz consigo uma gestão especializada, que envolve análise de risco, cobrança eficiente e monitoramento contínuo, aumentando a eficiência na administração financeira.</p>

<h3>4. Acesso a capital com custo mais competitivo</h3>
<p>Com um FIDC bem estruturado, sua empresa pode captar recursos com taxas menores, elevando a margem de lucro e reduzindo a exposição a juros bancários altos.</p>

<h3>5. Redução do risco de inadimplência</h3>
<p>O fundo absorve parte do risco de inadimplência, protegendo o fluxo de caixa e trazendo mais estabilidade ao negócio.</p>

<h2>Como implementar um FIDC com sucesso?</h2>
<p>Implantar um FIDC exige conhecimento técnico e estratégico. A <strong>Consultoria AFK</strong> acompanha todo o processo para garantir uma estrutura eficiente e segura.</p>

<p><strong>Entre em contato com a Consultoria AFK</strong> e descubra como podemos estruturar um FIDC sob medida para o seu negócio.</p>''',
        'category_id': 5,
        'published': True,
    },
    {
        'title': 'Como uma Estrutura Financeira Sólida Garante a Sobrevivência da Sua Empresa em Tempos de Crise',
        'slug': 'estrutura-financeira-solida-sobrevivencia-crise',
        'excerpt': 'Por que uma estrutura financeira robusta é o que diferencia empresas que sobrevivem de outras que fecham as portas em tempos de crise. Veja como se preparar!',
        'content': '''<p>Crises econômicas, queda nas vendas, aumento inesperado de custos ou impactos externos como mudanças no mercado e eventos globais — todas as empresas, independentemente do porte, estão suscetíveis a enfrentar momentos desafiadores.</p>
<p>Mas o que diferencia aquelas que sobrevivem daquelas que acabam fechando as portas?</p>
<p><strong>A resposta está na qualidade da sua estrutura financeira.</strong></p>

<h2>O Que É uma Estrutura Financeira Sólida?</h2>
<p>Ter uma boa estrutura financeira vai muito além do controle do fluxo de caixa diário. Trata-se de construir uma base estratégica, capaz de sustentar a operação e garantir o crescimento da empresa — mesmo diante dos cenários mais adversos.</p>
<p>Essa estrutura inclui:</p>
<ul>
<li><strong>Processos claros e eficientes</strong> nos setores de contas a pagar e receber;</li>
<li><strong>Fluxo de caixa organizado</strong>, atualizado e com projeções realistas;</li>
<li><strong>Análise contínua de indicadores financeiros</strong> como margem de lucro, rentabilidade, endividamento e capital de giro;</li>
<li><strong>Planejamento financeiro e orçamentário</strong> com revisões periódicas;</li>
<li><strong>Políticas rigorosas de controle de inadimplência</strong>;</li>
<li><strong>Visão de médio e longo prazo</strong> sobre o negócio para antecipar riscos e oportunidades.</li>
</ul>

<h2>Empresas Estruturadas Respiram Melhor Durante Crises</h2>
<p>Negócios que possuem uma estrutura financeira robusta conseguem reagir com mais agilidade e segurança em tempos de instabilidade. Elas sabem:</p>
<ul>
<li>Onde cortar custos sem comprometer áreas vitais;</li>
<li>Quais investimentos devem ser priorizados;</li>
<li>Como proteger o capital de giro e manter a operação funcionando;</li>
<li>Como renegociar com fornecedores, bancos e parceiros com base em dados reais.</li>
</ul>

<h2>Conclusão: Crises Não Escolhem Empresa — Mas Você Pode Escolher Estar Preparado</h2>
<p>Investir em estrutura financeira é mais do que organizar números — é garantir a sobrevivência, a competitividade e o crescimento saudável da sua empresa mesmo nos momentos mais difíceis.</p>
<p><strong>Prepare sua empresa para o inesperado com estratégia, controle e planejamento financeiro.</strong></p>

<p><strong>Entre em contato com a Consultoria AFK e garanta mais controle e segurança financeira.</strong></p>''',
        'category_id': 2,
        'published': True,
    },
    {
        'title': 'Contas a Pagar e a Receber: Como Otimizar a Gestão e Melhorar o Resultado Operacional',
        'slug': 'contas-pagar-receber-otimizar-gestao',
        'excerpt': 'Aprenda a estruturar e automatizar a gestão de contas a pagar e a receber para aumentar a previsibilidade do caixa e melhorar os resultados operacionais da sua empresa.',
        'content': '''<p>A gestão eficiente das contas a pagar e a receber é um dos pilares mais importantes da saúde financeira de qualquer empresa. Quando bem organizada, essa área evita atrasos, melhora a previsibilidade do caixa e fortalece a capacidade de negociação com fornecedores e clientes.</p>

<h2>Por Que a Gestão de Contas a Pagar e a Receber é Tão Estratégica?</h2>
<p>Muitas empresas tratam essas rotinas apenas como tarefas operacionais, quando, na verdade, são processos estratégicos que influenciam diretamente:</p>
<ul>
<li>A liquidez da empresa;</li>
<li>A tomada de decisões gerenciais;</li>
<li>A capacidade de investimento e expansão;</li>
<li>O relacionamento com o mercado.</li>
</ul>

<h2>Melhores Práticas para Otimizar as Contas a Pagar</h2>
<ol>
<li><strong>Centralize as informações</strong> - Utilize um sistema integrado para acompanhar todos os compromissos financeiros em tempo real.</li>
<li><strong>Organize os vencimentos por prioridade e impacto</strong> - Classifique os pagamentos por urgência e valor, evitando atrasos em contas essenciais.</li>
<li><strong>Evite pagamentos manuais e recorrentes erros</strong> - Adote processos automatizados para reduzir falhas e ganhar eficiência operacional.</li>
<li><strong>Negocie prazos com fornecedores</strong> - Quanto maior o prazo de pagamento, mais fôlego no caixa.</li>
</ol>

<h2>Como Melhorar as Contas a Receber e Reduzir Inadimplência</h2>
<ol>
<li><strong>Crie uma política de crédito bem definida</strong> - Analise o histórico de clientes, defina limites e prazos adequados antes de conceder crédito.</li>
<li><strong>Acompanhe os recebíveis diariamente</strong> - Use dashboards ou relatórios para monitorar títulos em aberto e agir rapidamente em casos de atraso.</li>
<li><strong>Ofereça múltiplas formas de pagamento</strong> - Facilite a quitação para o cliente com opções via PIX, boleto, cartão e transferência bancária.</li>
<li><strong>Implemente lembretes automáticos de cobrança</strong> - Sistemas com notificações antes e após o vencimento aumentam a taxa de recuperação de crédito.</li>
</ol>

<h2>Benefícios Reais de uma Gestão Estruturada</h2>
<ul>
<li>Redução de juros e multas por atraso;</li>
<li>Aumento da margem operacional;</li>
<li>Mais segurança nas decisões financeiras;</li>
<li>Melhor relação com fornecedores e clientes;</li>
<li>Sustentabilidade no crescimento do negócio.</li>
</ul>

<p><strong>Conte com o suporte da Consultoria AFK para estruturar e otimizar seus processos de contas a pagar e a receber.</strong></p>''',
        'category_id': 1,
        'published': True,
    },
]

def main():
    print("=== Migração de Posts do Blog AFK ===\n")
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        print("✅ Conectado ao banco de dados\n")
        
        # Inserir categorias
        print("Inserindo categorias...")
        for cat in categories_data:
            try:
                cursor.execute("""
                    INSERT INTO categories (name, slug, description, createdAt)
                    VALUES (%s, %s, %s, NOW())
                    ON DUPLICATE KEY UPDATE name = VALUES(name)
                """, (cat['name'], cat['slug'], cat['description']))
                print(f"  ✅ {cat['name']}")
            except Exception as e:
                print(f"  ⚠️ {cat['name']}: {e}")
        
        conn.commit()
        print()
        
        # Buscar IDs das categorias inseridas
        cursor.execute("SELECT id, slug FROM categories")
        cat_rows = cursor.fetchall()
        category_id_map = {row[1]: row[0] for row in cat_rows}
        
        # Mapeamento de category_id do script para o banco
        slug_by_id = {
            1: 'processos-financeiros',
            2: 'planejamento-financeiro',
            3: 'fluxo-de-caixa',
            4: 'gestao-financeira',
            5: 'fidc',
        }
        
        # Inserir posts
        print("Inserindo posts...")
        for post in posts_data:
            try:
                cat_slug = slug_by_id.get(post['category_id'], 'gestao-financeira')
                cat_id = category_id_map.get(cat_slug)
                
                cursor.execute("""
                    INSERT INTO posts (title, slug, excerpt, content, categoryId, published, publishedAt, createdAt, updatedAt)
                    VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW(), NOW())
                    ON DUPLICATE KEY UPDATE title = VALUES(title)
                """, (
                    post['title'],
                    post['slug'],
                    post['excerpt'],
                    post['content'],
                    cat_id,
                    post['published'],
                ))
                print(f"  ✅ {post['title'][:50]}...")
            except Exception as e:
                print(f"  ⚠️ {post['title'][:30]}...: {e}")
        
        conn.commit()
        print()
        
        # Verificar resultados
        cursor.execute("SELECT COUNT(*) FROM categories")
        cat_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM posts")
        post_count = cursor.fetchone()[0]
        
        print(f"=== Migração Concluída ===")
        print(f"Categorias: {cat_count}")
        print(f"Posts: {post_count}")
        
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as e:
        print(f"❌ Erro de conexão: {e}")
        exit(1)

if __name__ == "__main__":
    main()
