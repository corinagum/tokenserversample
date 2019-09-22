require('dotenv/config');
const restify = require('restify');
const { join } = require('path');
const fetch = require('node-fetch');
const server = restify.createServer();

server.get(
  '**/*',
  restify.plugins.serveStaticFiles(
    join(__dirname, 'public')
  )
);

server.listen(process.env.PORT || 80, () => {
  console.log('Token Server Sample server running');
});

server.get(
  '/api/token',
  async (req, res) => {
    const cres = await fetch(
      'https://directline.botframework.com/v3/directline/tokens/generate',
      {
        headers: {
          accept: 'text/javascript',
          authorization: `Bearer ${ process.env.DIRECT_LINE_SECRET }`
        },
        method: 'POST'
      }
    )
    if (cres.ok) {
      const json = await cres.json();
      res.json(json);
    } else {
      res.send(500);
      console.log(await cres.text());
    }
  }
);