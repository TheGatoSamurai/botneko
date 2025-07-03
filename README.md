# 🤖 botneko – Bot de Discord con IA, RSS y Estilo Kawaii-Cristiano

![GitHub Repo stars](https://img.shields.io/github/stars/TheGatoSamurai/botneko?style=social)
![GitHub forks](https://img.shields.io/github/forks/TheGatoSamurai/botneko?style=social)
![MIT License](https://img.shields.io/github/license/TheGatoSamurai/botneko)

Bienvenido a **botneko**, un bot de Discord hecho con Node.js que integra IA y RSS desde redes sociales como Instagram, TikTok y YouTube. Está diseñado para **compartir automáticamente nuevos contenidos** de dos cuentas principales:

- 🎭 [@damianruaj](https://instagram.com/damianruaj): literatura, ética, espiritualidad, poesía y reflexión.
- 💻 [@thegatosamurai](https://instagram.com/thegatosamurai): tecnología, desarrollo web, tutoriales y contenido creativo.

> 🐾 Nació para ayudar en comunidad, aprendiendo entre versos y líneas de código – Nyan~
---

## ⚙️ Características

- ✅ Lee feeds RSS desde una instancia personalizada de RSSHub
- 📡 Soporte para Instagram, TikTok y YouTube
- 🖼️ Muestra imágenes destacadas (si están disponibles en el feed)
- 💬 Comandos opcionales para consultar el último post según temática
- 🔔 Envía notificaciones automáticas a canales específicos
- 🧠 Incluye IA de OpenAI con memoria breve de conversación
- 🤖 IA con personalidad: estilo amigable, valores cristianos y tono kawaii
- 👋 Da la bienvenida y despide usuarios con eventos personalizados
- 🚪 Informa expulsiones e identifica al moderador responsable
- 🌐 Incluye servidor Express para mantener activo el bot vía Railway
- 🎧 Estado personalizado: “Escuchando ronroneando y ayudando a los humanos 🐾✨”
- 📖 Comando especial `!presentate` con introducción embebida y versículo

---

## 🚀 Comandos disponibles

| Comando                   | Descripción                                         |
|--------------------------|-----------------------------------------------------|
| `!hola`                  | Saludo básico del bot                               |
| `!ayuda`                 | Lista los comandos disponibles                      |
| `!fuentes`               | Muestra los feeds conectados                        |
| `!ultimo [tema] [red]`   | Muestra el último post de una red y temática        |
| `!presentate`            | Presenta el bot y sus funciones                     |

Ejemplo:

```
!ultimo literatura instagram
!ultimo tecnologia tiktok
```

---

## 🛠️ Requisitos

- Node.js >= 18
- Token de bot de Discord
- URL de una instancia activa de RSSHub (por ejemplo: `https://rsshub-thegatosamurai.onrender.com`)
- Archivo `feeds.json` con las configuraciones de tus canales

---

## 📁 Estructura del proyecto

```
botneko/
├── index.js # Archivo principal (comandos, IA, eventos)
├── feeds.json # Configuración de feeds RSS y canales de Discord
├── feedWatcher.js # Módulo para vigilar y publicar nuevos feeds
├── keepAlive.js # Servidor Express (ping para uptime)
├── lastPosts.json # Persistencia de últimos posts vistos
├── .env.example # Variables de entorno sugeridas
├── LICENSE # Licencia del proyecto (MIT)
└── README.md # Este documento
```

---

## 🌐 Ejemplo de `feeds.json`

```json
[
  {
    "tema": "literatura",
    "plataforma": "instagram",
    "usuario": "damianruaj",
    "url": "https://rsshub-thegatosamurai.onrender.com/instagram/user/damianruaj",
    "channelId": "📜mensajes-espirituales"
  },
  {
    "tema": "tecnologia",
    "plataforma": "tiktok",
    "usuario": "thegatosamurai",
    "url": "https://rsshub-thegatosamurai.onrender.com/tiktok/user/thegatosamurai",
    "channelId": "💡tecnología-y-novedades"
  }
]
```

---

## 🔒 Variables de entorno `.env`

```
DISCORD_TOKEN=TU_TOKEN_DE_DISCORD
OPENAI_API_KEY=TU_API_KEY_OPENAI
PORT=3000
```
> ⚠️ **No subas nunca este archivo a GitHub.**

---
## 💻 Despliegue

Este bot puede alojarse fácilmente en Railway:
- Crea una cuenta en railway.app
- Conecta tu repositorio de GitHub
- Agrega las variables .env necesarias
- Railway ejecutará automáticamente el bot con node index.js

---

## ✨ Autor

Creado con ❤️ por [@TheGatoSamurai](https://thegatosamurai.dev/)
Inspirado por el deseo de conectar lo literario y lo técnico en un solo espacio.

---

## 📌 Estado

🛠️ En desarrollo – se irán agregando nuevas funciones como:

- Soporte completo para imágenes destacadas
- Actualizaciones automáticas cada cierto intervalo
- Logs de actividad

---

## 🔧 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar **botneko**, reportar un bug o sugerir una nueva funcionalidad, puedes:

- 📥 Abrir un [issue](https://github.com/TuUsuario/botneko/issues)
- 🔀 Enviar un pull request

Tu participación ayuda a hacer crecer este proyecto. ¡Gracias por tu apoyo! 🐾
Por favor, sigue el estilo del proyecto: limpio, ordenado, sin lenguaje ofensivo y con respeto por la comunidad.

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**.

Puedes usarlo, modificarlo y distribuirlo libremente, siempre que incluyas el aviso de derechos de autor y la licencia original.
-Eres libre de usarlo, modificarlo y compartirlo. Solo recuerda dejar los créditos. 🐾
