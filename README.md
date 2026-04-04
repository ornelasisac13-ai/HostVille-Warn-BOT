🛡️ HostVille Bot - Sistema Avançado de Moderação

"Node.js" (https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
"discord.js" (https://img.shields.io/badge/discord.js-v14-blue?style=flat-square&logo=discord)
"Status" (https://img.shields.io/badge/status-online-brightgreen?style=flat-square)
"License" (https://img.shields.io/badge/license-MIT-yellow?style=flat-square)
"Version" (https://img.shields.io/badge/version-2.0.0-orange?style=flat-square)

«⚡ Bot de moderação profissional para Discord com sistema de warns, punições automáticas, logs completos e interface moderna.»

---

📌 Sobre o Projeto

O HostVille Bot é um sistema completo de moderação desenvolvido em Node.js com discord.js v14, focado em desempenho, organização e controle total da staff.

🔥 O que ele oferece:

- ⚠️ Sistema avançado de warns com ID único
- 🎯 Punições automáticas configuradas
- 🎨 Embeds profissionais e padronizados
- 📩 Avisos automáticos via DM
- 📜 Sistema de logs em canal
- 🖥️ Console colorido com debug avançado
- 🔒 Controle de permissões por cargo

---

🚀 Funcionalidades Principais

🛡️ Moderação| ⚠️ Warn System| 📊 Logs
Sistema automatizado| IDs únicos| Canal dedicado
Controle por staff| Punições automáticas| Embeds organizados

🎨 Interface| 🖥️ Console| 🔐 Segurança
Embeds profissionais| Logs coloridos| Controle por cargo
Cores dinâmicas| Debug detalhado| Anti-abuso básico

---

⚙️ Sistema de Warns

📊 Regras

Warns| Ação
🟡 1 Warn| Cargo "WARN_1"
🔴 2 Warns| Remove "WARN_1" + aplica "WARN_2" + DM
⚫ 3 Warns| Remove cargos + KICK imediato

---

🎨 Sistema Visual

Estado| Cor
🟢 Sem warns| Verde
🟡 1 warn| "#F1C40F"
🔴 2 warns| "#E74C3C"
⚫ 3 warns| "#2C2F33"

✔ Embeds sempre organizados
✔ Avatar do usuário incluído
✔ "/warnstats" privado (ephemeral)

---

📜 Comandos

/warnstats   → Ver warns (privado)
/addwarn     → Adicionar warn (staff)
/removewarn  → Remover warn (staff)

---

📁 Configuração (.env)

TOKEN=seu_token
CLIENT_ID=seu_client_id

STAFF_ROLE_ID=id_staff

WARN_1=id_warn1
WARN_2=id_warn2
WARN_3=id_warn3

LOG_CHANNEL_ID=id_logs

---

📦 Instalação

npm init -y
npm install discord.js dotenv chalk

---

🚀 Execução

node index.js

---

📊 Sistema de Logs

Todos os eventos são enviados para o canal:

LOG_CHANNEL_ID

Inclui:

- 👤 Usuário
- 🛡️ Staff
- ⚙️ Ação
- ⚠️ Warns
- 🆔 ID do warn

---

🖥️ Console (Debug)

Tipo| Cor
🔵 INFO| Informações
🟢 SUCESSO| Ações concluídas
🟡 AVISO| Alertas
🔴 ERRO| Falhas
⚠️ PERMISSÃO| Problemas de permissão

---

⚠️ Regras do Sistema

- ❌ Não permite warns negativos
- 🤖 Não permite warn em bots
- 🔁 Atualização automática de cargos
- 🚫 Nunca acumula múltiplos cargos

---

🧠 Tecnologias Utilizadas

Tecnologia| Uso
Node.js| Runtime
discord.js v14| API do Discord
dotenv| Variáveis de ambiente
chalk| Console colorido

---

🚧 Roadmap

- 💾 Banco de dados (MongoDB)
- 📜 Histórico completo
- 📊 Dashboard web
- 🔄 Backup automático
- ⏱️ Expiração de warns

---

👑 Autor

Projeto desenvolvido para sistemas profissionais de moderação no Discord.

---

📌 Observação

«Comandos globais podem demorar alguns minutos para aparecer.»

---

🔥 Sistema pronto para servidores grandes e organizados
