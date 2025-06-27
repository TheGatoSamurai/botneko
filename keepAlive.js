module.exports = function keepAlive() {
  const express = require('express');
  const app = express();

  app.get('/', (req, res) => {
    res.send('Botneko está ronroneando~ 😺');
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🟢 Servidor web de keep-alive activo en el puerto ${port}`);
  });
};
