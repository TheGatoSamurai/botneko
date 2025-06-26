const { Client, GatewayIntentBits } = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();
require('dotenv').config();
const feeds = require('./feeds.json');
const { Configuration, OpenAIApi } = require('openai');

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

  if (message.mentions.has(client.user) && !message.author.bot) {
    const prompt = `Responde como una inteligencia artificial cristiana, conservadora y de derecha; tambien que enseñe de cristo a las nuevas generaciones. No uses malas palabras, ni hables de sexo, ni temas inapropiados. Mensaje del usuario: "${message.content.replace(/<@!?\\d+>/, '').trim()}"`;

    // Filtro básico de palabras prohibidas
    const palabrasProhibidas = [
      // Español (Latinoamérica y España)
      /sexo/i, /porn/i, /porno/i, /pornografía/i, /pornografia/i, /puto/i, /puta/i, /putita/i, /putitas/i, /putote/i, /putotes/i,
      /mierda/i, /mierdón/i, /mierdona/i, /mierdones/i, /mierdonas/i, /mierdero/i, /mierdera/i, /mierdoso/i, /mierdosa/i,
      /verga/i, /vergazo/i, /verguda/i, /vergudo/i, /verguero/i, /verguenza/i, /vergas/i, /verguitas/i, /verguita/i,
      /pene/i, /pito/i, /pitote/i, /pituda/i, /pitudo/i,
      /vagina/i, /coño/i, /cojones/i, /cojonudo/i, /cojonuda/i, /cojuda/i, /cojudo/i,
      /gay/i, /lesb/i, /lgbt/i, /hentai/i,
      /estupido/i, /imbecil/i, /idiota/i, /tetas/i, /chichis/i, /pico/i, /polla/i, /pollón/i, /pollona/i,
      /cabron/i, /cabrona/i, /cabrones/i, /cabronas/i,
      /chingar/i, /chingada/i, /chingado/i, /chingón/i, /chingona/i, /chingones/i, /chingonas/i, /chingadera/i, /chingaderas/i,
      /cojer/i, /cojerte/i, /cojida/i, /cojido/i, /coger/i, /cogida/i, /cogido/i, /coges/i, /cogeme/i, /cogete/i, /cogieron/i, /cogimos/i,
      /putear/i, /putearte/i, /putiza/i, /marica/i, /maricon/i, /culero/i, /culera/i, /culito/i, /culote/i, /culazo/i, /culona/i, /culon/i,
      /culitos/i, /culotes/i, /culonas/i, /culones/i, /culo/i, /culillo/i, /culillos/i, /culi/i, /culis/i, /culiando/i, /culiado/i, /culiada/i, /culiadas/i, /culiados/i,
      /zorra/i, /zorrillo/i, /perra/i, /perro/i, /mamón/i, /mamona/i, /mamon/i,
      /joto/i, /jota/i, /pinche/i, /pinches/i, /chinga/i, /chingas/i, /chingados/i, /chingadas/i,
      /choto/i, /chota/i, /chotos/i, /chotas/i, /garcha/i, /garchas/i, /garchando/i, /garchada/i, /garchado/i,
      /pija/i, /pijas/i, /pijudo/i, /pijuda/i, /pijudos/i, /pijudas/i,
      /concha/i, /conchas/i, /conchuda/i, /conchudo/i, /conchudos/i, /conchudas/i,
      /orto/i, /ortos/i,
      /verguísima/i, /verguísimas/i,
      // Palabrotas de España
      /gilipollas/i, /hostia/i, /joder/i, /cojones/i, /cojonudo/i, /cojonuda/i, /cojonudos/i, /cojonudas/i,
      /mierd*/i, /capullo/i, /capulla/i, /capullos/i, /capullas/i, /huevón/i, /huevona/i, /huevones/i, /huevonas/i,
      /carajo/i, /cabrón/i, /cabrona/i, /cabróns/i, /cabronas/i, /pajero/i, /pajera/i, /pajeros/i, /pajeras/i,
      /follar/i, /follando/i, /follada/i, /follado/i, /follador/i, /folladora/i, /folladores/i, /folladoras/i,
      /chupa/i, /chupamela/i, /chupapollas/i, /chupapolla/i, /lamer/i, /lametón/i, /lametona/i, /lametones/i, /lametonas/i,
      /putón/i, /putona/i, /putones/i, /putonas/i, /zorrón/i, /zorrona/i, /zorróns/i, /zorronas/i,
      // Inglés
      /fuck/i, /fucking/i, /fucker/i, /motherfucker/i, /shit/i, /bitch/i, /bastard/i, /asshole/i, /dick/i, /pussy/i,
      /cock/i, /cum/i, /slut/i, /whore/i, /fag/i, /faggot/i, /cunt/i, /blow/i
    ]
    if (palabrasProhibidas.some(rx => rx.test(message.content))) {
      return message.reply('🚫 Lo siento, no puedo responder a ese tipo de mensajes, si usas ese tipo de lenguaje 😘 ');
    }

    try {
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      });
      const respuesta = completion.data.choices[0].message.content;
      return message.reply(respuesta);
    } catch (err) {
      console.error(err);
      return message.reply('🚫 Hubo un error al procesar tu mensaje.');
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

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

client.login(process.env.DISCORD_TOKEN);
