const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send(
    `Hello <a href="/world">World!</a>
    <h1>this is a title</h1>
    And another <a href="/links">link</a>
    `);
  console.log("got a request for /");
})

app.get('/world', (req, res) => {
  res.send('You FOUND me' + '\n<a href="/">back</a>');
  console.log("got a request for /world");
});

app.get('/links', (req, res) => {
  res.send(`You FOUND a link <p>
  <a href=\"https://www.google.com\">link 1</a><p>
  <a href="https://www.netflix.com">link 2</a><p>
  <a href="/">home</a>`);
  console.log("got a request for /link");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
