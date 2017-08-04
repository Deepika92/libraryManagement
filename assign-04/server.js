const Hapi = require('hapi');
const mongojs = require('mongojs'); 


const server = new Hapi.Server();  
server.connection({  
    host: 'localhost',
    port: 27017
});


server.app.db = mongojs('assign-04', ['index']); 

server.register([  
  require('./routes/index')
], (err) => {

  if (err) {
    throw err;
  }


server.start((err) => {

        console.log('Server is running:', server.info.uri);
  });
});