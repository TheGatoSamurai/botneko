const { Client, GatewayIntentBits } = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();
require('dotenv').config();
const feeds = require('./feeds.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`✅ botneko conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content === '!hola') {
    return message.channel.send(`¡Hola ${message.author.username}! 🐾 Soy botneko, tu mensajero de noticias y creatividad ✨`);
  }

  if (message.content === '!ayuda') {
    return message.channel.send(
      `📘 Comandos disponibles:\n` +
      '`!hola` → Saludo\n' +
      '`!ayuda` → Lista de comandos\n' +
      '`!fuentes` → Muestra los feeds conectados\n' +
      '`!ultimo [tema] [plataforma]` → Último post. Ej: `!ultimo literatura instagram`'
    );
  }

  if (message.content === '!fuentes') {
    const lista = feeds.map(f => `• ${f.tema} - ${f.plataforma} (${f.usuario})`).join('\n');
    return message.channel.send(`📡 Fuentes conectadas:\n${lista}`);
  }

  if (message.content.startsWith('!ultimo')) {
    const args = message.content.split(' ');
    const tema = args[1]?.toLowerCase();
    const plataforma = args[2]?.toLowerCase();
    if (!tema || !plataforma) {
      return message.channel.send('❌ Uso correcto: `!ultimo [tema] [plataforma]`');
    }

    const match = feeds.find(f => f.tema === tema && f.plataforma === plataforma);
    if (!match) {
      return message.channel.send('⚠️ Fuente no encontrada. Usa `!fuentes` para ver opciones.');
    }

    try {
      const feed = await parser.parseURL(match.url);
      const item = feed.items[0];

      const embed = {
        title: item.title || 'Nueva publicación',
        url: item.link,
        description: item.contentSnippet || '',
        image: {
          url: item.enclosure?.url || extractImage(item.content)
        },
        footer: { text: `${match.usuario} en ${match.plataforma}` }
      };

      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return message.channel.send('🚫 Hubo un problema al obtener el feed.');
    }
  }
});

client.on('guildMemberAdd', member => {
  // Buscar el canal por nombre
  const canal = member.guild.channels.cache.find(c => c.name === '🎉llegada-al-hotel' && c.type === 0);
  if (canal) {
    canal.send(`¡Bienvenido(a) al Hotel Gatuno, <@${member.user.id}>! 🏨🐾\n\nEsta es tu nueva casa, donde la comunidad de amantes de los gatitos y la verdadera verdad te espera.\nAquí podrás hacer nuevos amigos, compartir momentos increíbles y disfrutar junto a TheGatoSamurai de todo el contenido, eventos y aventuras que tenemos preparados.\n\n¡Relájate, diviértete y sé parte de nuestra gran familia gatuna!`);
  }
});

function extractImage(content) {
  const match = content?.match(/<img.*?src="(.*?)"/);
  return match ? match[1] : null;
}

client.login(process.env.DISCORD_TOKEN);
