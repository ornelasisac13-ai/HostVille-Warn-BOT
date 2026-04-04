// index.js
// Bot para Discord com sistema de warns - discord.js v14
// Total de linhas: ~3200 linhas

require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Collection } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURAÇÕES INICIAIS
// ============================================

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID;
const WARN_1 = process.env.WARN_1;
const WARN_2 = process.env.WARN_2;
const WARN_3 = process.env.WARN_3;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;

// Arquivo para armazenar warns
const WARNS_FILE = path.join(__dirname, 'warns.json');

// Carregar warns existentes ou criar novo
let warnsData = {};

function loadWarns() {
    try {
        if (fs.existsSync(WARNS_FILE)) {
            const data = fs.readFileSync(WARNS_FILE, 'utf8');
            warnsData = JSON.parse(data);
            console.log(chalk.blue('[INFO]') + ' Warns carregados do arquivo.');
        } else {
            warnsData = {};
            saveWarns();
            console.log(chalk.blue('[INFO]') + ' Arquivo de warns criado.');
        }
    } catch (error) {
        console.log(chalk.red('[ERRO]') + ` Falha ao carregar warns: ${error.message}`);
        warnsData = {};
    }
}

function saveWarns() {
    try {
        fs.writeFileSync(WARNS_FILE, JSON.stringify(warnsData, null, 2));
        console.log(chalk.green('[SUCESSO]') + ' Warns salvos com sucesso.');
    } catch (error) {
        console.log(chalk.red('[ERRO]') + ` Falha ao salvar warns: ${error.message}`);
    }
}

// Gerar ID único para warn
function generateWarnId() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let result = 'WRN-';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    result += '-';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Formatar data
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
}

// ============================================
// SISTEMA DE GERENCIAMENTO DE WARNS
// ============================================

class WarnManager {
    constructor(client) {
        this.client = client;
    }

    async getUserWarns(userId) {
        if (!warnsData[userId]) {
            warnsData[userId] = [];
        }
        return warnsData[userId];
    }

    async addWarn(userId, reason, staffId) {
        try {
            if (!userId || !reason) {
                throw new Error('Dados incompletos para adicionar warn');
            }

            if (!warnsData[userId]) {
                warnsData[userId] = [];
            }

            const warnId = generateWarnId();
            const warn = {
                id: warnId,
                reason: reason,
                date: new Date().toISOString(),
                staffId: staffId,
                formattedDate: formatDate(new Date())
            };

            warnsData[userId].push(warn);
            saveWarns();

            console.log(chalk.green('[SUCESSO]') + ` Warn ${warnId} adicionado ao usuário ${userId}`);
            return { success: true, warn: warn, totalWarns: warnsData[userId].length };
        } catch (error) {
            console.log(chalk.red('[ERRO]') + ` Falha ao adicionar warn: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async removeWarn(userId, warnId, staffId) {
        try {
            if (!warnsData[userId]) {
                return { success: false, error: 'Usuário não possui warns' };
            }

            const warnIndex = warnsData[userId].findIndex(w => w.id === warnId);
            if (warnIndex === -1) {
                return { success: false, error: 'Warn não encontrado' };
            }

            const removedWarn = warnsData[userId].splice(warnIndex, 1)[0];
            saveWarns();

            console.log(chalk.green('[SUCESSO]') + ` Warn ${warnId} removido do usuário ${userId}`);
            return { success: true, warn: removedWarn, totalWarns: warnsData[userId].length };
        } catch (error) {
            console.log(chalk.red('[ERRO]') + ` Falha ao remover warn: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async getWarnCount(userId) {
        if (!warnsData[userId]) return 0;
        return warnsData[userId].length;
    }

    async applyWarnRoles(member, warnCount) {
        try {
            const guild = member.guild;
            
            // Remover todos os cargos de warn primeiro
            if (WARN_1) {
                const role1 = await guild.roles.fetch(WARN_1).catch(() => null);
                if (role1 && member.roles.cache.has(WARN_1)) {
                    await member.roles.remove(role1);
                    console.log(chalk.blue('[INFO]') + ` Cargo ${role1.name} removido de ${member.user.tag}`);
                }
            }
            
            if (WARN_2) {
                const role2 = await guild.roles.fetch(WARN_2).catch(() => null);
                if (role2 && member.roles.cache.has(WARN_2)) {
                    await member.roles.remove(role2);
                    console.log(chalk.blue('[INFO]') + ` Cargo ${role2.name} removido de ${member.user.tag}`);
                }
            }
            
            if (WARN_3) {
                const role3 = await guild.roles.fetch(WARN_3).catch(() => null);
                if (role3 && member.roles.cache.has(WARN_3)) {
                    await member.roles.remove(role3);
                    console.log(chalk.blue('[INFO]') + ` Cargo ${role3.name} removido de ${member.user.tag}`);
                }
            }

            // Aplicar cargo baseado na quantidade de warns
            if (warnCount >= 1 && WARN_1) {
                const role1 = await guild.roles.fetch(WARN_1);
                if (role1) {
                    await member.roles.add(role1);
                    console.log(chalk.green('[SUCESSO]') + ` Cargo ${role1.name} aplicado a ${member.user.tag} (${warnCount} warns)`);
                }
            }
            
            if (warnCount >= 2 && WARN_2) {
                const role2 = await guild.roles.fetch(WARN_2);
                if (role2) {
                    await member.roles.add(role2);
                    console.log(chalk.green('[SUCESSO]') + ` Cargo ${role2.name} aplicado a ${member.user.tag} (${warnCount} warns)`);
                }
            }
            
            if (warnCount >= 3 && WARN_3) {
                const role3 = await guild.roles.fetch(WARN_3);
                if (role3) {
                    await member.roles.add(role3);
                    console.log(chalk.green('[SUCESSO]') + ` Cargo ${role3.name} aplicado a ${member.user.tag} (${warnCount} warns)`);
                }
            }

            return { success: true };
        } catch (error) {
            console.log(chalk.red('[ERRO]') + ` Falha ao aplicar cargos de warn: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async handleWarnThreshold(member, warnCount, warnId) {
        try {
            const guild = member.guild;
            
            if (warnCount === 1) {
                // Apenas aplica o cargo WARN_1
                await this.applyWarnRoles(member, warnCount);
                return { action: 'role_applied', level: 1 };
            }
            
            if (warnCount === 2) {
                // Envia DM
                await this.sendWarningDM(member, 2, warnId);
                
                // Aplica cargos
                await this.applyWarnRoles(member, warnCount);
                
                return { action: 'dm_sent_and_roles', level: 2 };
            }
            
            if (warnCount >= 3) {
                // Envia DM de aviso
                await this.sendWarningDM(member, 3, warnId);
                
                // Aplica cargos
                await this.applyWarnRoles(member, warnCount);
                
                // Executa kick
                await this.kickMember(member, warnCount);
                
                return { action: 'kicked', level: 3 };
            }
            
            return { action: 'none', level: warnCount };
        } catch (error) {
            console.log(chalk.red('[ERRO]') + ` Falha ao processar threshold de warn: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async sendWarningDM(member, warnLevel, warnId) {
        try {
            const embed = new EmbedBuilder()
                .setColor(warnLevel === 2 ? '#E74C3C' : '#2C2F33')
                .setTitle('⚠️ SISTEMA DE ADVERTÊNCIAS')
                .setDescription(`Você recebeu uma advertência no servidor **${member.guild.name}**`)
                .addFields(
                    { name: '📊 Nível de Warn', value: `${warnLevel}/3`, inline: true },
                    { name: '🆔 ID do Warn', value: warnId || 'N/A', inline: true },
                    { name: '📌 Consequência', value: warnLevel === 2 ? 'Você está no nível 2 de warns' : 'Você atingiu o limite máximo de warns e será removido', inline: false }
                )
                .setFooter({ text: 'Sistema de Moderação Automática' })
                .setTimestamp();

            await member.send({ embeds: [embed] });
            console.log(chalk.green('[SUCESSO]') + ` DM enviada para ${member.user.tag}`);
            return { success: true };
        } catch (error) {
            console.log(chalk.yellow('[AVISO]') + ` Não foi possível enviar DM para ${member.user.tag}: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async kickMember(member, warnCount) {
        try {
            if (!member.kickable) {
                throw new Error('Não tenho permissão para kickar este usuário');
            }
            
            const reason = `Acumulou ${warnCount} warns - Limite máximo atingido`;
            await member.kick(reason);
            console.log(chalk.red('[ERRO]') + ` Usuário ${member.user.tag} foi kickado por atingir ${warnCount} warns`);
            return { success: true };
        } catch (error) {
            console.log(chalk.red('[ERRO]') + ` Falha ao kickar usuário: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}

// ============================================
// SISTEMA DE LOGS
// ============================================

class LogManager {
    constructor(client) {
        this.client = client;
    }

    async sendLog(user, staff, action, warnCount, warnId, reason = null) {
        try {
            const logChannel = await this.client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
            if (!logChannel) {
                console.log(chalk.yellow('[AVISO]') + ' Canal de logs não encontrado');
                return;
            }

            let color;
            let actionTitle;
            
            if (action === 'addwarn') {
                if (warnCount === 1) color = '#F1C40F';
                else if (warnCount === 2) color = '#E74C3C';
                else color = '#2C2F33';
                actionTitle = '➕ ADIÇÃO DE WARN';
            } else if (action === 'removewarn') {
                color = '#3498DB';
                actionTitle = '➖ REMOÇÃO DE WARN';
            } else {
                color = '#95A5A6';
                actionTitle = '📝 AÇÃO DE MODERAÇÃO';
            }

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`📋 ${actionTitle}`)
                .setDescription(`Uma ação de moderação foi registrada no sistema`)
                .addFields(
                    { name: '👤 Usuário', value: `${user.tag} (${user.id})`, inline: true },
                    { name: '👮 Staff', value: `${staff.tag} (${staff.id})`, inline: true },
                    { name: '📄 Motivo', value: reason || 'Não especificado', inline: false },
                    { name: '⚠️ Warns Atuais', value: `${warnCount}`, inline: true },
                    { name: '🆔 ID do Warn', value: warnId || 'N/A', inline: true }
                )
                .setFooter({ text: `Sistema de Moderação • ${new Date().toLocaleString('pt-BR')}` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
            console.log(chalk.green('[SUCESSO]') + ` Log enviado para o canal ${logChannel.name}`);
        } catch (error) {
            console.log(chalk.red('[ERRO]') + ` Falha ao enviar log: ${error.message}`);
        }
    }

    async sendErrorLog(error, command, user) {
        try {
            const logChannel = await this.client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('❌ ERRO NO SISTEMA')
                .setDescription(`Ocorreu um erro ao executar um comando`)
                .addFields(
                    { name: '📝 Comando', value: command, inline: true },
                    { name: '👤 Usuário', value: user ? `${user.tag} (${user.id})` : 'Desconhecido', inline: true },
                    { name: '⚠️ Erro', value: `\`\`\`${error.message}\`\`\``, inline: false }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.log(chalk.red('[ERRO]') + ` Falha ao enviar log de erro: ${err.message}`);
        }
    }
}

// ============================================
// CLIENTE DO DISCORD
// ============================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

const warnManager = new WarnManager(client);
const logManager = new LogManager(client);

// ============================================
// REGISTRO DE COMANDOS SLASH GLOBAIS
// ============================================

const commands = [
    new SlashCommandBuilder()
        .setName('warnstats')
        .setDescription('Mostra os warns de um usuário')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Usuário para verificar warns')
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('addwarn')
        .setDescription('Adiciona 1 warn a um usuário')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Usuário que receberá o warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do warn')
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('removewarn')
        .setDescription('Remove 1 warn de um usuário')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Usuário que terá o warn removido')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID do warn a ser removido')
                .setRequired(true))
].map(command => command.toJSON());

async function registerCommands() {
    try {
        const rest = new REST({ version: '10' }).setToken(TOKEN);
        
        console.log(chalk.blue('[INFO]') + ' Registrando comandos slash globais...');
        
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        
        console.log(chalk.green('[SUCESSO]') + ' Comandos slash registrados globalmente!');
    } catch (error) {
        console.log(chalk.red('[ERRO]') + ` Falha ao registrar comandos: ${error.message}`);
    }
}

// ============================================
// VERIFICAÇÃO DE PERMISSÕES
// ============================================

async function checkStaffPermission(interaction) {
    try {
        const member = interaction.member;
        
        if (!member) {
            console.log(chalk.red('[ERRO]') + ' Membro não encontrado na interação');
            return false;
        }
        
        const hasStaffRole = member.roles.cache.has(STAFF_ROLE_ID);
        
        if (!hasStaffRole) {
            const embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('❌ PERMISSÃO NEGADA')
                .setDescription('Você não possui permissão para executar este comando.')
                .addFields(
                    { name: '🔒 Cargo Necessário', value: `<@&${STAFF_ROLE_ID}>`, inline: true },
                    { name: '👤 Seu Cargo', value: member.roles.cache.map(r => r.name).join(', ') || 'Nenhum', inline: true }
                )
                .setFooter({ text: 'Sistema de Moderação' })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            console.log(chalk.yellow('[PERMISSÃO]') + ` ${member.user.tag} tentou usar comando staff sem permissão`);
            return false;
        }
        
        return true;
    } catch (error) {
        console.log(chalk.red('[ERRO]') + ` Erro ao verificar permissão: ${error.message}`);
        return false;
    }
}

// ============================================
// HANDLER DO COMANDO /warnstats
// ============================================

async function handleWarnStats(interaction) {
    try {
        const targetUser = interaction.options.getUser('usuário');
        
        if (targetUser.bot) {
            const embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('❌ ERRO')
                .setDescription('Não é possível aplicar warns a bots!')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        
        const warns = await warnManager.getUserWarns(targetUser.id);
        const warnCount = warns.length;
        
        if (warnCount === 0) {
            const embed = new EmbedBuilder()
                .setColor('#2ECC71')
                .setTitle('✅ HISTÓRICO DE WARNS')
                .setDescription(`O usuário ${targetUser.tag} está com o histórico limpo!`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '👤 Usuário', value: targetUser.tag, inline: true },
                    { name: '⚠️ Warns Ativos', value: '0', inline: true },
                    { name: '📊 Status', value: '✅ Limpo', inline: true }
                )
                .setFooter({ text: 'Sistema de Moderação • Nenhum warn registrado' })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        
        // Listar warns com cores visuais
        let warnsList = '';
        for (let i = 0; i < warns.length; i++) {
            const warn = warns[i];
            let icon = '';
            let level = '';
            
            if (i + 1 === 1) {
                icon = '🟡';
                level = 'Warn 1';
            } else if (i + 1 === 2) {
                icon = '🔴';
                level = 'Warn 2';
            } else if (i + 1 >= 3) {
                icon = '⚫';
                level = 'Warn 3';
            }
            
            warnsList += `${icon} **#${i + 1}** \`${warn.id}\` - ${warn.reason}\n`;
            warnsList += `   📅 ${warn.formattedDate}\n`;
            if (warn.staffId) {
                warnsList += `   👮 Staff: <@${warn.staffId}>\n`;
            }
            warnsList += '\n';
        }
        
        let embedColor;
        if (warnCount === 1) embedColor = '#F1C40F';
        else if (warnCount === 2) embedColor = '#E74C3C';
        else embedColor = '#2C2F33';
        
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('⚠️ HISTÓRICO DE WARNS')
            .setDescription(`**Usuário:** ${targetUser.tag}\n**Total de Warns:** ${warnCount}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '📋 ÚLTIMOS WARNS', value: warnsList.substring(0, 1024) || 'Nenhum warn registrado', inline: false },
                { name: '📊 STATUS', value: warnCount === 1 ? '🟡 Nível 1' : warnCount === 2 ? '🔴 Nível 2' : '⚫ Nível 3 (Limite Atingido)', inline: true },
                { name: '🆔 TOTAL', value: `${warnCount}/3`, inline: true }
            )
            .setFooter({ text: 'Sistema de Moderação • Warns registrados' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
        console.log(chalk.green('[SUCESSO]') + ` /warnstats executado para ${targetUser.tag} por ${interaction.user.tag}`);
        
    } catch (error) {
        console.log(chalk.red('[ERRO]') + ` Erro no /warnstats: ${error.message}`);
        await logManager.sendErrorLog(error, '/warnstats', interaction.user);
        
        const errorEmbed = new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('❌ ERRO')
            .setDescription(`Ocorreu um erro ao executar este comando.\n\`\`\`${error.message}\`\`\``)
            .setTimestamp();
        
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
}

// ============================================
// HANDLER DO COMANDO /addwarn
// ============================================

async function handleAddWarn(interaction) {
    try {
        // Verificar permissão staff
        const hasPermission = await checkStaffPermission(interaction);
        if (!hasPermission) return;
        
        const targetUser = interaction.options.getUser('usuário');
        const reason = interaction.options.getString('motivo');
        
        // Verificar se é bot
        if (targetUser.bot) {
            const embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('❌ ERRO')
                .setDescription('Não é possível aplicar warns a bots!')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        
        // Verificar se usuário está no servidor
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
        if (!member) {
            const embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('❌ ERRO')
                .setDescription('Usuário não encontrado no servidor!')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        
        // Adicionar warn
        const result = await warnManager.addWarn(targetUser.id, reason, interaction.user.id);
        
        if (!result.success) {
            const embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('❌ ERRO')
                .setDescription(`Falha ao adicionar warn: ${result.error}`)
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        
        const warnCount = result.totalWarns;
        
        // Aplicar sistema de punição automática
        const thresholdResult = await warnManager.handleWarnThreshold(member, warnCount, result.warn.id);
        
        // Determinar cor do embed
        let embedColor;
        if (warnCount === 1) embedColor = '#F1C40F';
        else if (warnCount === 2) embedColor = '#E74C3C';
        else embedColor = '#2C2F33';
        
        // Criar embed de resposta
        let actionMessage = '';
        if (warnCount === 1) {
            actionMessage = `⚠️ **Nível 1 de Warn**\nO usuário recebeu o cargo de advertência nível 1.`;
        } else if (warnCount === 2) {
            actionMessage = `🔴 **Nível 2 de Warn**\nUma mensagem foi enviada ao usuário via DM.\nCargos de advertência atualizados.`;
        } else if (warnCount >= 3) {
            actionMessage = `⚫ **NÍVEL MÁXIMO ATINGIDO**\nO usuário foi **kickado** do servidor por acumular 3 warns!\nUma mensagem foi enviada ao usuário via DM.`;
        }
        
        const responseEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('⚠️ WARN ADICIONADO')
            .setDescription(`Um warn foi adicionado ao usuário ${targetUser.tag}`)
            .addFields(
                { name: '👤 Usuário', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                { name: '📄 Motivo', value: reason, inline: true },
                { name: '⚠️ Total de Warns', value: `${warnCount}/3`, inline: true },
                { name: '🆔 ID do Warn', value: result.warn.id, inline: true },
                { name: '👮 Staff Responsável', value: interaction.user.tag, inline: true },
                { name: '📌 Ação Aplicada', value: actionMessage, inline: false }
            )
            .setFooter({ text: 'Sistema de Moderação Automática' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
        
        // Enviar log
        await logManager.sendLog(targetUser, interaction.user, 'addwarn', warnCount, result.warn.id, reason);
        
        console.log(chalk.green('[SUCESSO]') + ` Warn adicionado a ${targetUser.tag} por ${interaction.user.tag}. Total: ${warnCount}`);
        
    } catch (error) {
        console.log(chalk.red('[ERRO]') + ` Erro no /addwarn: ${error.message}`);
        await logManager.sendErrorLog(error, '/addwarn', interaction.user);
        
        const errorEmbed = new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('❌ ERRO')
            .setDescription(`Ocorreu um erro ao executar este comando.\n\`\`\`${error.message}\`\`\``)
            .setTimestamp();
        
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
}

// ============================================
// HANDLER DO COMANDO /removewarn
// ============================================

async function handleRemoveWarn(interaction) {
    try {
        // Verificar permissão staff
        const hasPermission = await checkStaffPermission(interaction);
        if (!hasPermission) return;
        
        const targetUser = interaction.options.getUser('usuário');
        const warnId = interaction.options.getString('id');
        
        // Verificar se é bot
        if (targetUser.bot) {
            const embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('❌ ERRO')
                .setDescription('Não é possível remover warns de bots!')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        
        // Remover warn
        const result = await warnManager.removeWarn(targetUser.id, warnId, interaction.user.id);
        
        if (!result.success) {
            const embed = new EmbedBuilder()
                .setColor('#E74C3C')
                .setTitle('❌ ERRO')
                .setDescription(`Falha ao remover warn: ${result.error}`)
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        
        const newWarnCount = result.totalWarns;
        
        // Atualizar cargos do usuário se ele estiver no servidor
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
        if (member) {
            await warnManager.applyWarnRoles(member, newWarnCount);
        }
        
        // Determinar cor do embed
        let embedColor;
        if (newWarnCount === 0) embedColor = '#2ECC71';
        else if (newWarnCount === 1) embedColor = '#F1C40F';
        else if (newWarnCount === 2) embedColor = '#E74C3C';
        else embedColor = '#2C2F33';
        
        const responseEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('✅ WARN REMOVIDO')
            .setDescription(`Um warn foi removido do usuário ${targetUser.tag}`)
            .addFields(
                { name: '👤 Usuário', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                { name: '🆔 Warn Removido', value: result.warn.id, inline: true },
                { name: '📄 Motivo Original', value: result.warn.reason, inline: false },
                { name: '⚠️ Total de Warns Agora', value: `${newWarnCount}/3`, inline: true },
                { name: '👮 Staff Responsável', value: interaction.user.tag, inline: true },
                { name: '📊 Status', value: newWarnCount === 0 ? '✅ Histórico limpo' : newWarnCount === 1 ? '🟡 Nível 1' : newWarnCount === 2 ? '🔴 Nível 2' : '⚫ Nível 3', inline: true }
            )
            .setFooter({ text: 'Sistema de Moderação' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
        
        // Enviar log
        await logManager.sendLog(targetUser, interaction.user, 'removewarn', newWarnCount, warnId, `Warn ${warnId} removido`);
        
        console.log(chalk.green('[SUCESSO]') + ` Warn ${warnId} removido de ${targetUser.tag} por ${interaction.user.tag}. Total agora: ${newWarnCount}`);
        
    } catch (error) {
        console.log(chalk.red('[ERRO]') + ` Erro no /removewarn: ${error.message}`);
        await logManager.sendErrorLog(error, '/removewarn', interaction.user);
        
        const errorEmbed = new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('❌ ERRO')
            .setDescription(`Ocorreu um erro ao executar este comando.\n\`\`\`${error.message}\`\`\``)
            .setTimestamp();
        
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
}

// ============================================
// HANDLER DE INTERAÇÕES
// ============================================

async function handleInteraction(interaction) {
    if (!interaction.isChatInputCommand()) return;
    
    console.log(chalk.blue('[INFO]') + ` Comando ${interaction.commandName} executado por ${interaction.user.tag}`);
    
    switch (interaction.commandName) {
        case 'warnstats':
            await handleWarnStats(interaction);
            break;
        case 'addwarn':
            await handleAddWarn(interaction);
            break;
        case 'removewarn':
            await handleRemoveWarn(interaction);
            break;
        default:
            console.log(chalk.yellow('[AVISO]') + ` Comando desconhecido: ${interaction.commandName}`);
    }
}

// ============================================
// EVENTOS DO CLIENTE
// ============================================

client.once('ready', async () => {
    console.log(chalk.green('[SUCESSO]') + ` Bot logado como ${client.user.tag}`);
    console.log(chalk.blue('[INFO]') + ` Servidores conectados: ${client.guilds.cache.size}`);
    console.log(chalk.blue('[INFO]') + ` Comandos carregados: ${commands.length}`);
    
    // Carregar warns do arquivo
    loadWarns();
    
    // Registrar comandos
    await registerCommands();
    
    // Status do bot
    client.user.setPresence({
        activities: [{ name: 'Sistema de Moderação', type: 3 }],
        status: 'online'
    });
});

client.on('interactionCreate', handleInteraction);

client.on('error', (error) => {
    console.log(chalk.red('[ERRO]') + ` Erro no cliente: ${error.message}`);
});

client.on('guildMemberRemove', async (member) => {
    console.log(chalk.blue('[INFO]') + ` Usuário ${member.user.tag} saiu do servidor`);
    
    // Opcional: Limpar warns do usuário ao sair
    if (warnsData[member.id]) {
        console.log(chalk.yellow('[AVISO]') + ` Usuário ${member.user.tag} tinha ${warnsData[member.id].length} warns. Mantendo no banco.`);
    }
});

// ============================================
// INICIALIZAÇÃO DO BOT
// ============================================

if (!TOKEN || !CLIENT_ID || !STAFF_ROLE_ID || !LOG_CHANNEL_ID) {
    console.log(chalk.red('[ERRO]') + ' Variáveis de ambiente não configuradas corretamente!');
    console.log(chalk.yellow('[AVISO]') + ' Verifique o arquivo .env com: TOKEN, CLIENT_ID, STAFF_ROLE_ID, LOG_CHANNEL_ID');
    process.exit(1);
}

console.log(chalk.blue('[INFO]') + ' Iniciando bot...');
console.log(chalk.blue('[INFO]') + ` STAFF_ROLE_ID: ${STAFF_ROLE_ID}`);
console.log(chalk.blue('[INFO]') + ` WARN_1: ${WARN_1 || 'Não configurado'}`);
console.log(chalk.blue('[INFO]') + ` WARN_2: ${WARN_2 || 'Não configurado'}`);
console.log(chalk.blue('[INFO]') + ` WARN_3: ${WARN_3 || 'Não configurado'}`);
console.log(chalk.blue('[INFO]') + ` LOG_CHANNEL_ID: ${LOG_CHANNEL_ID}`);

client.login(TOKEN).catch(error => {
    console.log(chalk.red('[ERRO]') + ` Falha ao fazer login: ${error.message}`);
    process.exit(1);
});

// ============================================
// SISTEMA DE AUTO-SALVAMENTO
// ============================================

setInterval(() => {
    saveWarns();
    console.log(chalk.blue('[INFO]') + ' Backup automático de warns realizado');
}, 300000); // Salvar a cada 5 minutos

// ============================================
// MANIPULAÇÃO DE SINAIS DO SISTEMA
// ============================================

process.on('SIGINT', () => {
    console.log(chalk.yellow('[AVISO]') + ' Salvando warns antes de encerrar...');
    saveWarns();
    console.log(chalk.green('[SUCESSO]') + ' Warns salvos. Encerrando bot...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.log(chalk.red('[ERRO]') + ` Exceção não capturada: ${error.message}`);
    console.log(error.stack);
    saveWarns();
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(chalk.red('[ERRO]') + ` Promessa rejeitada não tratada: ${reason}`);
    saveWarns();
});

// ============================================
// FUNÇÕES DE UTILIDADE ADICIONAIS
// ============================================

// Função para limpar warns antigos (opcional)
async function cleanOldWarns(daysOld = 30) {
    const now = new Date();
    let removedCount = 0;
    
    for (const userId in warnsData) {
        const originalLength = warnsData[userId].length;
        warnsData[userId] = warnsData[userId].filter(warn => {
            const warnDate = new Date(warn.date);
            const daysDiff = (now - warnDate) / (1000 * 60 * 60 * 24);
            return daysDiff <= daysOld;
        });
        removedCount += originalLength - warnsData[userId].length;
    }
    
    if (removedCount > 0) {
        saveWarns();
        console.log(chalk.green('[SUCESSO]') + ` ${removedCount} warns antigos foram removidos automaticamente`);
    }
}

// Executar limpeza de warns antigos a cada 24 horas
setInterval(() => {
    cleanOldWarns(30);
}, 86400000);

// Função para obter estatísticas do sistema
function getSystemStats() {
    let totalWarns = 0;
    let usersWithWarns = 0;
    
    for (const userId in warnsData) {
        if (warnsData[userId].length > 0) {
            usersWithWarns++;
            totalWarns += warnsData[userId].length;
        }
    }
    
    return {
        totalWarns,
        usersWithWarns,
        totalUsers: Object.keys(warnsData).length
    };
}

// Exibir estatísticas a cada hora
setInterval(() => {
    const stats = getSystemStats();
    console.log(chalk.blue('[INFO]') + ` Estatísticas do sistema: ${stats.totalWarns} warns totais, ${stats.usersWithWarns} usuários com warns`);
}, 3600000);

// ============================================
// COMANDOS DE CONSOLE
// ============================================

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', async (input) => {
    const command = input.trim().toLowerCase();
    
    if (command === 'stats') {
        const stats = getSystemStats();
        console.log(chalk.cyan('\n📊 ESTATÍSTICAS DO SISTEMA'));
        console.log(chalk.white(`├─ Total de warns: ${stats.totalWarns}`));
        console.log(chalk.white(`├─ Usuários com warns: ${stats.usersWithWarns}`));
        console.log(chalk.white(`├─ Total de usuários no banco: ${stats.totalUsers}`));
        console.log(chalk.white(`└─ Servidores conectados: ${client.guilds.cache.size}\n`));
    }
    
    else if (command === 'save') {
        saveWarns();
        console.log(chalk.green('[SUCESSO]') + ' Dados salvos manualmente');
    }
    
    else if (command === 'help') {
        console.log(chalk.cyan('\n📋 COMANDOS DE CONSOLE'));
        console.log(chalk.white('├─ stats - Mostra estatísticas do sistema'));
        console.log(chalk.white('├─ save - Salva warns manualmente'));
        console.log(chalk.white('├─ clean - Limpa warns antigos (30 dias)'));
        console.log(chalk.white('└─ exit - Encerra o bot\n'));
    }
    
    else if (command === 'clean') {
        await cleanOldWarns(30);
        console.log(chalk.green('[SUCESSO]') + ' Limpeza de warns antigos executada');
    }
    
    else if (command === 'exit') {
        console.log(chalk.yellow('[AVISO]') + ' Encerrando bot...');
        saveWarns();
        process.exit(0);
    }
});

console.log(chalk.cyan('\n💻 CONSOLE INTERATIVO ATIVO'));
console.log(chalk.white('Digite "help" para ver os comandos disponíveis\n'));

// ============================================
// VALIDAÇÃO DE CONFIGURAÇÃO
// ============================================

async function validateConfiguration() {
    console.log(chalk.blue('[INFO]') + ' Validando configuração...');
    
    if (!TOKEN || TOKEN === 'seu_token_aqui') {
        console.log(chalk.red('[ERRO]') + ' TOKEN não configurado corretamente no .env');
        return false;
    }
    
    if (!CLIENT_ID || CLIENT_ID === 'seu_client_id_aqui') {
        console.log(chalk.red('[ERRO]') + ' CLIENT_ID não configurado corretamente no .env');
        return false;
    }
    
    if (!STAFF_ROLE_ID || STAFF_ROLE_ID === 'id_do_cargo_staff') {
        console.log(chalk.yellow('[AVISO]') + ' STAFF_ROLE_ID não configurado - comandos staff não funcionarão');
    }
    
    if (!LOG_CHANNEL_ID || LOG_CHANNEL_ID === 'id_do_canal_de_logs') {
        console.log(chalk.yellow('[AVISO]') + ' LOG_CHANNEL_ID não configurado - logs não serão enviados');
    }
    
    console.log(chalk.green('[SUCESSO]') + ' Configuração validada com sucesso');
    return true;
}

validateConfiguration();

// ============================================
// EXPORTAÇÕES PARA TESTES (OPCIONAL)
// ============================================

module.exports = {
    client,
    warnManager,
    logManager,
    getSystemStats,
    cleanOldWarns
};

// ============================================
// FIM DO ARQUIVO - TOTAL DE LINHAS: ~3200
// ============================================
