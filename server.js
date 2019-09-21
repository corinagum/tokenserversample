const restify = require('restify');
const { join } = require('path');
const server = restify.createServer();

server.get(
  '**/*',
  restify.plugins.serveStaticFiles(
    join(__dirname, 'public')
  )
);

server.listen(process.env.PORT || 80, () => {
  console.log('tokenserversample server running');
})