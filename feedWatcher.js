const fs = require('fs');
const fetch = require('node-fetch');
const { XMLParser } = require('xml2js');
const { EmbedBuilder } = require('discord.js');

const lastPostsFile = './lastPosts.json';

let lastItems = {};
if (fs.existsSync(lastPostsFile)) {
  lastItems = JSON.parse(fs.readFileSync(lastPostsFile, 'utf8'));
}

function saveLastPosts() {
  fs.writeFileSync(lastPostsFile, JSON.stringify(lastItems, null, 2));
}


async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url);
    const xml = await res.text();
    const parser = new XMLParser({ explicitArray: false });
    const result = await parser.parseStringPromise(xml);

    const items = result.rss?.channel?.item || [];
    const entries = Array.isArray(items) ? items : [items];

    const latest = entries[0];
    const uniqueKey = `${feed.plataforma}_${feed.usuario}`;

    if (latest && lastItems[uniqueKey] !== latest.link) {
      lastItems[uniqueKey] = latest.link;
      saveLastPosts();

      return {
        title: latest.title,
        link: latest.link,
        pubDate: latest.pubDate,
        description: latest.description?.slice(0, 200) || '',
        enclosure: latest.enclosure?.url || null,
        feed
      };
    }
  } catch (error) {
    console.error(`❌ Error en el feed de ${feed.usuario}:`, error.message);
  }
  return null;
}

async function checkFeeds(client) {
  function getPlatformIcon(platform) {
    switch (platform.toLowerCase()) {
      case 'youtube': return '📺 YouTube';
      case 'instagram': return '📸 Instagram';
      case 'tiktok': return '🎵 TikTok';
      default: return '🌐 Red Social';
    }
  }
  const feeds = JSON.parse(fs.readFileSync('./feeds.json', 'utf8'));

  for (const feed of feeds) {
    const update = await fetchFeed(feed);
    if (update) {
      const channel = client.channels.cache.find(
        c => c.name === feed.channelId.replace(/^#|📜|💡/, '').trim()
      );

      if (channel) {
        const embed = new EmbedBuilder()
          .setColor(feed.tema === 'tecnologia' ? '#00bfff' : '#ff69b4')
          .setTitle(update.title)
          .setURL(update.link)
          .setDescription(update.description || '*Sin descripción*')
          .setFooter({
            text: `${getPlatformIcon(feed.plataforma)} @${feed.usuario}`
          })
          .setTimestamp(new Date(update.pubDate));

        if (update.enclosure) {
          embed.setImage(update.enclosure);
        }

        await channel.send({ embeds: [embed] });
      } else {
        console.warn(`⚠️ Canal no encontrado: ${feed.channelId}`);
      }
    }
  }
}

function startWatcher(client, interval = 5 * 60 * 1000) {
  console.log('🔁 Feed watcher iniciado...');
  setInterval(() => checkFeeds(client), interval);
  checkFeeds(client); // Primera verificación al inicio
}

module.exports = { startWatcher };