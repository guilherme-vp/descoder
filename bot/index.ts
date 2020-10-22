import discord, { Message, TextChannel } from 'discord.js'
import dotenv from 'dotenv'
import helpCommand from './src/commands/help'
import chooseCategoryCommand from './src/commands/categorias'
import askMentoryCommand from './src/commands/mentoria'
import chooseMentorCommand from './src/commands/mentor'
import deleteAllCommand from './src/commands/delete'
import findTerm from './src/utils/findTerm'
import isParticipatingCommand from './src/commands/participando'
import findRepositoryCommand from './src/commands/repositorio'
import askChannelCommand from './src/commands/canal'
import findChannelCommand from './src/commands/equipes'
import enterChannelCommand from './src/commands/entrar'
import acessoCommand from './src/commands/acess'
import createTeamCommand from './src/admin/commands/createTeam'
dotenv.config()

export const bot = new discord.Client()

const token = process.env.TOKEN
const channelId = `${process.env.CHANNEL_ID}`

bot.login(token)

bot.on('guildMemberAdd', async member => {
	const logChannel = member.guild.channels.cache.find(
		ch => ch.id === '766740926437392407'
	)

	const channel = bot.guilds.cache.get(channelId)!

	const role = channel.roles.guild.roles.cache.find(
		role => role.name === 'Membro'
	)!

	const addRole = await member.roles.add(role)

	if (!logChannel || !addRole) return

	if (
		!((logChannel): logChannel is TextChannel => logChannel.type === 'text')(
			logChannel
		)
	)
		return

	await logChannel.send(
		`Olá ${member}, bem-vindo ao canal da Prensa, aceita um cafézinho? :coffee:`
	)
})

bot.on('guildMemberRemove', member => {
	const exitChannel = member.guild.channels.cache.find(
		ch => ch.id === '766740926437392407'
	)

	if (!exitChannel) return

	if (
		!((exitChannel): exitChannel is TextChannel => exitChannel.type === 'text')(
			exitChannel
		)
	)
		return

	exitChannel.send(`Adeus ${member}, sentiremos sua falta aqui :pensive:`)
})

bot.on('message', async (message: Message) => {
	const channel = bot.guilds.cache.get(channelId)!

	const { content } = message

	if (message.channel.id === '768598126373634109') {
		const contentPrivate = content
		switch (contentPrivate) {
			case findTerm(contentPrivate, '!newteam'):
				return createTeamCommand(message, channel)
			case '!deleteCommands':
				return deleteAllCommand(message)
			case '!help':
				helpCommand(message)
				break
			default:
				return
		}
	}

	if (
		message.channel.type === 'text' &&
		message.channel.id !== '768598126373634109'
	) {
		if (!content.startsWith('!')) return
		switch (content) {
			case '!mentoria':
				await message.reply(
					'se você deseja marcar uma mentoria, me chame por aqui <@' +
						process.env.BOT_ID +
						'> e execute o comando `Agendar mentoria` :wink:'
				)
				break
			case '!acesso':
				acessoCommand(message)
				break
			case '!deleteAll':
				deleteAllCommand(message)
				break

			case '!help':
				helpCommand(message)
				break
			default:
				return message.reply(
					'Não entendi o quê você disse :frowning2: \nUtilize o comando `!help` para ver todos os comandos :warning:'
				)
		}
	}

	if (message.channel.type === 'dm' && !message.author.bot) {
		switch (content) {
			case findTerm(content, 'mentoria'):
				return askMentoryCommand(message)

			case findTerm(content, 'escolher categoria '):
				await message.author.send(
					'Procurando mentores nessa categoria :face_with_monocle:'
				)
				return chooseCategoryCommand(message)

			case findTerm(content, 'escolher mentor'):
				return chooseMentorCommand(message)

			case findTerm(content, 'participando'):
				return isParticipatingCommand(message)

			case findTerm(content, 'buscar repositório'):
				await message.author.send(
					'Hmmmm, estou procurando seu repositório :mag_right:'
				)
				return findRepositoryCommand(message)

			case findTerm(content, 'estou na equipe'):
				await message.author.send(
					'Hmmmm, estou procurando sua equipe :mag_right:'
				)
				return findChannelCommand(message)

			case findTerm(content, 'entrar no canal'):
				return enterChannelCommand(message, channel)

			case findTerm(content, 'obrigado') || findTerm(content, 'obrigada'):
				return message.reply('Assim você me deixa sem jeito :blush: \nPor nada')
			case findTerm(content, 'quem é guilherme'):
				await message.reply(
					'Meu criador, o dono da minha vida, para alguns um ponto de luz, para outros algo irreal, para o faminto comida, para o rico a felicidade, para a criança o pai, para o ingênuo a sabedoria. :heart_eyes:'
				)
				return setTimeout(async () => {
					await message.reply(
						'Na verdade é só o cara que criou esse bot mesmo :sweat_smile:\n' +
							'Se você descobriu esse comando, mande uma mensagem pra ele dizendo: "Socorram-me, subi no ônibus em marrocos".'
					)
				}, 7000)

			case findTerm(content, 'help') ||
				findTerm(content, 'comandos') ||
				findTerm(content, 'ajuda') ||
				findTerm(content, 'socorro'):
				return helpCommand(message)
			default:
				return message.reply(
					'Não entendi o quê você disse :frowning2: \nUtilize o comando `ajuda` para ver todos meus comandos :warning:'
				)
		}
	}
})

bot.on('error', err => {
	console.warn(err)
})

console.log('Bot funcionando!')
