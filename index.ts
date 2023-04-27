require('dotenv').config();

if (process.argv[2] === '--telegram') {
  require('./src-server-telegram')
} else {
  require('./src-server')
}