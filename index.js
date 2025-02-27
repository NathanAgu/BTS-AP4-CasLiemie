const app = require('./src/app');
const config = require('./config/config.json');

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});