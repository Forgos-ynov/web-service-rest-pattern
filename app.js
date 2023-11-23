const express = require('express');
const app = express();
const port = 3000;
const userSynchro = require('./Entity/User');
const usersRouter = require('./Controller/usersController');
const globalRouter = require('./Controller/globalController');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

const yamlContent = fs.readFileSync("./config/swagger.yaml", "utf8");
const yamlData = yaml.load(yamlContent);
app.use(express.json())


app.use('/api/users', usersRouter);
app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(yamlData));
app.use("/api", globalRouter);

userSynchro.sync().then(() => {
    console.log('Table user synchronisée avec succès');
});

app.listen(port, () => {
    console.log(`L'API REST écoute sur le port ${port}`);
});
