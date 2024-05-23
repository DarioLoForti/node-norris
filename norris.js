const http = require('http');
const fs = require('fs');
const path = require('path');


const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';

const readJSONData = (nomeFile) => {
    const filePath = path.join(__dirname, nomeFile + '.json');
    if (!fs.existsSync(filePath)) {
        return []; // Se il file non esiste, ritorna un array vuoto
    }
    const fileData = fs.readFileSync(filePath, "utf-8");
    if (fileData.trim() === "") {
        return []; // Se il file è vuoto, ritorna un array vuoto
    }
    return JSON.parse(fileData);
}

const writeJSONData = (nomeFile, newData) => {
    const filePath = path.join(__dirname, nomeFile + '.json');
    const fileString = JSON.stringify(newData);
    fs.writeFileSync(filePath, fileString);
}

const server = http.createServer((req, res) => {
    console.log(`${req.method} | ${req.url} effettuata`);
    
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fetch('https://api.chucknorris.io/jokes/random')
        .then(response => response.json())
        .then(norris => {
            const joke = norris.value;
            
            // Leggi le battute esistenti
            const jokes = readJSONData('norrisDb');
            
            // Aggiungi la nuova battuta
            jokes.push(joke);
            
            // Scrivi nuovamente il file con la nuova battuta
            writeJSONData('norrisDb', jokes);
            
            res.end(`<h1>${joke}</h1>`);
        })
        
});

server.listen(port, host, () => {
    console.log(`Server avviato su http://${host}:${port}`);
});
