# 🤖 botneko

Bienvenido a **botneko**, un bot de Discord hecho con Node.js que integra RSS de redes sociales como Instagram, TikTok y YouTube. Está pensado para **compartir automáticamente nuevos contenidos** de dos cuentas principales:

- 🎭 [@damianruaj](https://instagram.com/damianruaj): literatura, ética, espiritualidad, poesía y reflexión.
- 💻 [@thegatosamurai](https://instagram.com/thegatosamurai): tecnología, desarrollo web, tutoriales y contenido creativo.

---

## ⚙️ Características

- ✅ Lee feeds RSS desde una instancia personalizada de RSSHub
- 📡 Soporte para Instagram, TikTok y YouTube
- 💬 Comandos opcionales en Discord para consultar el último post por temática
- 🖼️ Muestra imágenes de referencia (si están disponibles en el feed)
- 🔔 Envía notificaciones automáticas a canales específicos

---

## 🚀 Comandos disponibles

| Comando                   | Descripción                                         |
|--------------------------|-----------------------------------------------------|
| `!hola`                  | Saludo básico del bot                               |
| `!ayuda`                 | Lista los comandos disponibles                      |
| `!fuentes`               | Muestra los feeds conectados                        |
| `!ultimo [tema] [red]`   | Muestra el último post de una red y temática        |

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
├── index.js
├── feeds.json
├── .env
├── .gitignore
└── README.md
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
```
> ⚠️ **No subas nunca este archivo a GitHub.**

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

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**.

Puedes usarlo, modificarlo y distribuirlo libremente, siempre que incluyas el aviso de derechos de autor y la licencia original.










