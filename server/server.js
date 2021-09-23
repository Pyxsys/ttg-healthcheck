const app = require('./app');

// start server
const {PORT} = process.env;
app.listen(PORT, () => console.log('Server started'));
