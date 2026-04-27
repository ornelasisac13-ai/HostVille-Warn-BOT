
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1481730240236752906/1490186146557202542/2caafef3b98fb7ca780403088149bce9.png?ex=69d3237f&is=69d1d1ff&hm=325cab5741420b06e38c8860feac3aa9699d1a89271f44e94d68998535a63f5a&" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-4f46e5?style=for-the-badge">
  <img src="https://img.shields.io/badge/node-16.9%2B-22c55e?style=for-the-badge">
  <img src="https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge">
  <img src="https://img.shields.io/badge/license-MIT-10b981?style=for-the-badge">
  <img src="https://img.shields.io/badge/status-online-22c55e?style=for-the-badge">
</p>

<br>

<h1 align="center">𝙷𝚘𝚜𝚝𝚅𝚒𝚕𝚕𝚎 𝚆𝚊𝚛𝚗 • 𝙱𝙾𝚃</h1>

<p align="center">
  Sistema avançado de moderação com warns automáticos, punições inteligentes e logs completos para Discord.
</p>

<p align="center">
  <b>𝙼𝚊𝚍𝚎 𝙱𝚢 𝚈𝟸𝚔_𝙽𝚊𝚝</b>
</p>

---

## ✦ 𝙰𝙱𝙾𝚄𝚃

> O **HostVille Warn • BOT** é um sistema de moderação moderno criado em **Node.js + discord.js v14**, focado em automação total de warns e controle de staff.

Ele elimina o trabalho manual e transforma a moderação em algo rápido, organizado e automático.

---

## ✦ 𝙵𝙴𝙰𝚃𝚄𝚁𝙴𝚂

<p align="center"><b>⚡ Sistema completo de moderação ⚡</b></p>

```txt
⚠ WARN SYSTEM      → Histórico completo por usuário
🛡 AUTO PUNISH     → Cargos e kick automático
📜 LOG SYSTEM      → Registro de todas ações
📩 DM SYSTEM       → Notificações automáticas
👮 STAFF CONTROL   → Permissões por cargos
💾 DATABASE        → JSON persistente


---

✦ 𝙿𝚄𝙽𝙸𝚂𝙷𝙼𝙴𝙽𝚃 𝚂𝚈𝚂𝚃𝙴𝙼

╭────────────────────╮
│  1 WARN  → WARN_1  │
│  2 WARNS → WARN_2  │ + DM
│  3 WARNS → WARN_3  │ + KICK
╰────────────────────╯


---

✦ 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂

/warnstats

📊 Histórico completo do usuário
• Total de warns
• Lista detalhada
• Status atual


---

/addwarn

➕ Adiciona advertência
• Motivo
• ID único
• Punição automática
• Log staff


---

/removewarn

➖ Remove último warn
• Atualiza histórico
• Recalcula punições
• Remove cargos
• Registra log


---

✦ 𝚂𝚃𝙰𝙵𝙵 𝙿𝙴𝚁𝙼𝙸𝚂𝚂𝙸𝙾𝙽𝚂

---

✦ 𝙵𝙻𝙾𝚆 𝚂𝚈𝚂𝚃𝙴𝙼
```
flowchart TD
A[Warn aplicado] --> B[Salvo no JSON]
B --> C[Atualiza contagem]
C --> D{Level}
D -->|1| E[WARN_1]
D -->|2| F[WARN_2 + DM]
D -->|3| G[WARN_3 + KICK]
```

---

✦ 𝙳𝙰𝚃𝙰𝙱𝙰𝚂𝙴

📁 warns.json
• Leve
• Rápido
• Persistente
• Fácil manutenção


---

✦ 𝙾𝙱𝙹𝙴𝙲𝚃𝙸𝚅𝙴

✔ Automação de moderação
✔ Organização da staff
✔ Redução de trabalho manual
✔ Punições consistentes


---

📌 Status

🟢 Online • ⚡ Estável • 🔒 Seguro 

𝙼𝚊𝚍𝚎 𝙱𝚢 𝚈𝟸𝚔_𝙽𝚊𝚝 
```
