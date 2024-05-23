const http = require('http');
const fs = require('fs');
const path = require('path');


const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';
const dbFilePath = path.join(__dirname, 'norrisDb.json');

const server = http.createServer((req, res) => {
    console.log(`${req.method} | ${req.url} effettuata`);
    
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fetch('https://api.chucknorris.io/jokes/random')
            .then(response => response.json())
            .then(norris => {
                const joke = norris.value;
                const fileHtml = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Chuck Norris Joke</title>
                    </head>
                    <body>
                        <h1>Chuck Norris Joke</h1>
                        <p>${joke}</p>
                    </body>
                    </html>
                `;
                res.end(fileHtml);
            });
});
 server.listen(port, host, () => {
    console.log(`Server avviato su http://${host}:${port}`)
 })