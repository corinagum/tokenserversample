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

const trustedOrigin = (url) => {
  return (
    /^https?:\/\/localhost([\/:]|$)/.test(url)
  );
}

const generateDirectLineToken = async () => {
  const { DIRECT_LINE_SECRET } = process.env;

  console.log(`Generating Direct Line token using secret "${ DIRECT_LINE_SECRET.substr(0, 3) }...${ DIRECT_LINE_SECRET.substr(-3) }"`);

  let cres;

  cres = await fetch(`https://directline.botframework.com/v3/directline/tokens/generate`, {
    headers: {
      authorization: `Bearer ${ DIRECT_LINE_SECRET }`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  if (cres.status === 200) {
    const json = await cres.json();

    if ('error' in json) {
      throw new Error(`Direct Line service responded ${ JSON.stringify(json.error) } while generating new token`);
    } else {
      return json;
    }
  } else {
    throw new Error(`Direct Line service returned ${ cres.status } while generating new token`);
  }
}


server.post('/directline/token', async (req, res) => {
  const origin = req.header('origin');

  if(!trustedOrigin(origin)) {
    return res.send(403, 'Origin not trusted');
  }

  try {
    res.send(await generateDirectLineToken(), { 'Access-Control-Allow-Origin': '*'});
  } catch (error) {
    res.send(500, error.message, { 'Access-Control-Allow-Origin': '*'});
  }

  const { DIRECT_LINE_SECRET } = process.env;


  console.log(`Requesting Direct Line token for ${ origin } using secret "${ DIRECT_LINE_SECRET.substr(0, 3) }...${ DIRECT_LINE_SECRET.substr(-3) }"`);
});