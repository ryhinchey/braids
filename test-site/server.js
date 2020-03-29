const httpServer = require('http-server');

const server = httpServer.createServer({
  root: 'test-site'
});

server.listen(3001);