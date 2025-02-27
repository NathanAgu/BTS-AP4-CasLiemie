const app = require('./src/app');
const config = require('./src/config.json');

const PORT = config.server.port || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});