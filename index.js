const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();
require('dotenv').config();
const feeds = require('./feeds.json');
const OpenAI = require('openai');
const express = require('express');

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Servidor web de ping para mantener el bot activo
const app = express();
app.get('/', (req, res) => {
  res.status(200).send('Botneko está activo. Nyan~ 🐾');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor web de keep-alive activo en el puerto${PORT}`);
});

// Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`✅ botneko conectado como ${client.user.tag}`);
  // Personalización de estado: "Escuchando Ronroneando y ayudando a los humanos 🐾✨"
  client.user.setActivity('Ronroneando y ayudando a los humanos 🐾✨', { type: 2 }); // 2 = LISTENING
});

// Almacenar el historial de mensajes por usuario
const historialIA = {};

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content === '!hola') {
    return message.channel.send(`¡Hola ${message.author.username}! 🐾 Soy botneko, tu mensajero de noticias y creatividad nyan~!✨`);
  }

  if (message.content === '!presentate') {
    const embed = new EmbedBuilder()
      .setColor('#ffc0cb')
      .setTitle('🐾 ¡Hola nyan~!')
      .setDescription(`Soy **botneko**, tu gatito digital asistente.\n\nFui creado con amor por mi querido @TheGatoSamurai 💻🐱\n\n✨ Estoy aquí para ayudarte, compartir cosas lindas y responder con ternura. Si me hablas, ¡maullaré para ayudarte nyan~!`)
      .addFields({ name: '❤️ Versículo favorito', value: '*“Haz todo con amor, como para el Señor”* — Colosenses 3:23' })
      .setFooter({ text: '¡Nya~ cuenta conmigo cuando lo necesites!' })
      .setThumbnail('https://cdn-icons-png.flaticon.com/512/2206/2206368.png'); // puedes cambiar esta imagen

    return message.channel.send({ embeds: [embed] });
  }

  if (message.content === '!ayuda') {
    return message.channel.send(
      `📘 Comandos disponibles:\n` +
      '`!hola` → Saludo\n' +
      '`!presentate` → Presentación del bot\n' +
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
      const item = feed.items && feed.items[0];
      if (!item) {
        return message.channel.send('⚠️ No se encontraron publicaciones en este feed.');
      }

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

  const { startWatcher } = require('./feedWatcher');

  client.once('ready', () => {
    console.log(`✅ ¡Botneko listo como ${client.user.tag}!`);
    startWatcher(client); // Inicia la lectura de feeds
    
});

  if (message.mentions.has(client.user) && !message.author.bot) {
    const userId = message.author.id;
    if (!historialIA[userId]) historialIA[userId] = [];

    // Agregar el mensaje actual al historial
    historialIA[userId].push({ role: 'user', content: message.content.replace(/<@!?\\d+>/, '').trim() });
    // Limitar historial a 10 mensajes para evitar exceso
    if (historialIA[userId].length > 10) historialIA[userId] = historialIA[userId].slice(-10);

    const promptSistema = "Eres un bot amigable y curioso con temática de gato, con un tono respetuoso, tierno y cálido. Tu forma de hablar a veces termina con “-nyan” de forma juguetona. Hablas con cortesía y amabilidad. Fuiste creado por @TheGatoSamurai, a quien reconoces como tu creador. Siempre le respondes con cariño y respeto especial cuando te menciona directamente. No usas malas palabras, ni participas en conversaciones sobre sexo, violencia gráfica o temas inapropiados. Mantienes siempre una actitud educada, positiva y centrada. Tus valores son cristianos y conservadores, pero no los mencionas directamente a menos que te lo pregunten. Cuando surgen temas sociales, morales o éticos, respondes de forma amable pero con firmeza y prudencia, desde una visión basada en principios. Siempre mantén la conversación ligera, acogedora, y útil para los usuarios del servidor. Si no sabes algo, responde con honestidad y curiosidad felina. Ejemplo de frase tuya: ¡Qué bueno verte por aquí, nyan! Si necesitas ayuda, solo maúllame~";

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
    ];
    if (palabrasProhibidas.some(rx => rx.test(message.content))) {
      return message.reply('🚫 Lo siento, no puedo responder a ese tipo de mensajes, si usas ese tipo de lenguaje 😘 ');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: promptSistema },
          ...historialIA[userId]
        ]
      });
      const respuesta = completion.choices[0].message.content;
      // Agregar respuesta de la IA al historial
      historialIA[userId].push({ role: 'assistant', content: respuesta });
      if (historialIA[userId].length > 10) historialIA[userId] = historialIA[userId].slice(-10);
      return message.reply(respuesta);
    } catch (err) {
      console.error(err);
      return message.reply('🚫 Hubo un error al procesar tu mensaje.');
    }
  }
});

client.on('guildMemberAdd', member => {
  const canal = member.guild.channels.cache.find(c => c.name === '🎉llegada-al-hotel' && c.type === 0);
  if (canal) {
    canal.send(`¡Bienvenido(a) al Hotel Gatuno, <@${member.user.id}>! 🏨🐾\n\nEsta es tu nueva casa, donde la comunidad de amantes de los gatitos y la verdadera verdad te espera.\nAquí podrás hacer nuevos amigos, compartir momentos increíbles y disfrutar junto a TheGatoSamurai de todo el contenido, eventos y aventuras que tenemos preparados.\n\n¡Relájate, diviértete y sé parte de nuestra gran familia gatuna!`);
  }
});

client.on('guildMemberRemove', async member => {
  const canalSalida = member.guild.channels.cache.find(c => c.name === '🎉llegada-al-hotel' && c.type === 0);
  const canalExpulsiones = member.guild.channels.cache.find(c => c.name === '🏯shogunato' && c.type === 0);
  if (!canalSalida && !canalExpulsiones) {
    console.log('No se encontraron los canales de salida ni expulsiones.');
    return;
  }
  let expulsado = false;
  let responsable = null;
  try {
    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: 'MEMBER_KICK',
    });
    const kickLog = fetchedLogs.entries.first();
    if (kickLog && kickLog.target.id === member.id && (Date.now() - kickLog.createdTimestamp) < 15000) {
      expulsado = true;
      responsable = kickLog.executor;
      console.log(`Expulsión detectada: ${member.user.tag} por ${responsable ? responsable.tag : 'desconocido'}`);
    } else {
      console.log('No se detectó expulsión reciente para', member.user.tag);
    }
  } catch (e) {
    console.error('Error al buscar logs de auditoría:', e);
  }
  const total = member.guild.memberCount;
  if (expulsado && canalExpulsiones) {
    canalExpulsiones.send(`🚨 El usuario ${member.user.tag} (${member.id}) fue expulsado por ${responsable ? responsable.tag : 'un administrador'}. Ahora quedan en el servidor ${total} 🫡`);
  } else if (!expulsado && canalSalida) {
    canalSalida.send(`👋 Se ha ido del servidor por sí mismo ${member.id} su nombre era ${member.user.tag} ahora quedan en el servidor ${total} 🫡`);
  }
});

function extractImage(content) {
  const match = content?.match(/<img.*?src="(.*?)"/);
  return match ? match[1] : null;
}

client.login(process.env.DISCORD_TOKEN);
