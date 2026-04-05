<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1481730240236752906/1490186146557202542/2caafef3b98fb7ca780403088149bce9.png?ex=69d3237f&is=69d1d1ff&hm=325cab5741420b06e38c8860feac3aa9699d1a89271f44e94d68998535a63f5a&" alt="Warn Bot Banner" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/node-16.9%2B-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/discord.js-v14.14.0-blue.svg" alt="Discord.js">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/status-online-brightgreen.svg" alt="Status">
</p>

<h1 align="center">🛡️ 𝙷𝚘𝚜𝚝𝚅𝚒𝚕𝚕𝚎 𝚆𝚊𝚛𝚗 • 𝙱𝙾𝚃</h1>

<p align="center">
Bot de moderação avançado para Discord com sistema completo de warns, punições automáticas e logs de staff.
</p>

---

## 📋 Sobre o Projeto

O **𝙷𝚘𝚜𝚝𝚅𝚒𝚕𝚕𝚎 𝚆𝚊𝚛𝚗 • 𝙱𝙾𝚃** é um sistema completo de moderação desenvolvido em **Node.js** com **discord.js v14**, focado no gerenciamento de advertências (warns) dentro de servidores Discord.

Ele automatiza todo o processo de moderação, reduzindo trabalho manual da staff e garantindo organização, consistência e segurança.

---

## ✨ Funcionalidades

<p align="center">Sistema moderno, automático e altamente configurável</p>

| ⚠️ Sistema de Warns | 🛡️ Punições Automáticas | 📜 Logs de Staff |
|---------------------|--------------------------|------------------|
| Histórico completo de advertências por usuário | Cargos automáticos por nível de warn | Registro de todas ações da staff |

| 📩 DM Automática | 👮 Controle de Staff | 💾 Banco de Dados |
|-----------------|------------------------|------------------|
| Notificações automáticas para usuários punidos | Sistema de permissões por cargos | Armazenamento em JSON com persistência |

---

## ⚙️ Sistema de Punições

O bot utiliza um sistema progressivo de punições:

```txt
1 Warn  → Cargo WARN_1
2 Warns → Cargo WARN_2 + DM automática
3 Warns → Cargo WARN_3 + Expulsão do servidor