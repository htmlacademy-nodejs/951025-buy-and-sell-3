const express = require(`express`);

const app = express();
const DEFAULT_PORT = 8080;

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const offersRoutes = require(`./routes/offers-routes`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.listen(DEFAULT_PORT);
