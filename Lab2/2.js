const http = require('http');

const server = http.createServer((req, res) => {

  const baseURL = `http://${req.headers.host}`;
  const parsedUrl = new URL(req.url, baseURL);

  const nameValue = parsedUrl.searchParams.get('name');

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (nameValue) {
    res.statusCode = 200;
    res.end(`Hello ${nameValue}`);
  } else {
    res.statusCode = 400;
    res.end('You should provide name parameter');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущено. Перейдіть за адресою: http://localhost:${PORT}`);
});