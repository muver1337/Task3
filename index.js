const app = require('./app')
const port = process.env.PORT || 5000
const DB_URL = "mongodb+srv://admin:admin@project3.nu6leea.mongodb.net/?retryWrites=true&w=majority";

app.listen(port, () => console.log(`Порт запущенного сервера: ${port}`))