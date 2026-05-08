# 🏃‍♂️ PLAN RUN (antigo PLANE BSB)

O **PLAN RUN** é um Progressive Web App (PWA) avançado, criado para organizar, gerar e acompanhar planos de treino de corrida. Utilizando Inteligência Artificial (Google Gemini), o aplicativo gera planilhas de treinamento totalmente personalizadas para diferentes níveis de atletas e distâncias, desde os 5km até a Ultramaratona.

## ✨ Novidades e Principais Funcionalidades

- **🧠 IA Coach Integrado:** Geração de planilhas de treinamento do zero usando a API do Google Gemini. A IA analisa idade, peso, nível de experiência, dias disponíveis e resultados do Teste de 3km para prescrever paces, volumes e estratégias precisas.
- **🍎 Nutrição Inteligente:** Prescrição dinâmica de hidratação e suplementação (Pré, Intra e Pós-treino) humanizada e adaptada ao tipo e distância de cada treino.
- **🔐 Sistema de Login e Segurança:** Proteção de acesso com múltiplos usuários. A chave da API do Gemini e as senhas ficam ocultas em um arquivo local (`config.js`), não exposto no repositório.
- **📊 Estatísticas e Acompanhamento:** Contagem regressiva precisa para o dia da prova (corrigindo bugs de fuso horário), barra de progresso de quilometragem e controle de treinos realizados (streak).
- **✏️ Customização:** Capacidade de editar treinos, alterar descrições e paces manualmente.
- **📱 PWA Responsivo:** Tema escuro inspirado no Strava, otimizado para celular, podendo ser instalado na tela inicial e funcionando offline.

## 🚀 Como Executar Localmente

Como o sistema conta com integração de IA, é necessário configurar sua própria chave de API.

1. Clone o repositório:
```bash
git clone https://github.com/Kevinlucs/planeBsb.git
cd planeBsb
```

2. Configure suas credenciais:
- Copie o arquivo de exemplo: `cp config.js.example config.js`
- Edite o `config.js` e insira sua **API Key do Google Gemini** e configure as senhas dos usuários desejados.

3. Execute um servidor local na pasta do projeto:
```bash
npx serve .
# ou
python -m http.server 8000
```

4. Acesse no navegador em `http://localhost:3000` ou `http://localhost:8000`.

## 🛠️ Tecnologias Utilizadas
- **Frontend:** Vanilla JavaScript, HTML5, CSS3.
- **Armazenamento:** `localStorage` (persistência completa de treinos e planos sem necessidade de banco de dados externo).
- **Inteligência Artificial:** Google Gemini API (`gemini-2.5-flash`).

## 🔜 Próximos Passos
- Transformar o sistema PWA em um aplicativo mobile nativo (Android/iOS) para publicação na Play Store e App Store.
