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
    return JSON.parse(fileData);
}

const writeJSONData = (nomeFile, newData) => {
    const filePath = path.join(__dirname, nomeFile + '.json');
    const fileString = JSON.stringify(newData);
    fs.writeFileSync(filePath, fileString);
}

const isJokeInDatabase = (jokes, joke) => {
    return jokes.includes(joke);
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} | ${req.url} effettuata`);
    
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fetch('https://api.chucknorris.io/jokes/random')
        .then(response => response.json())
        .then(norris => {
            const joke = norris.value;
            
            // Leggi le battute esistenti
            let jokes = readJSONData('norrisDb');
            
            // Verifica se la battuta è già presente
            if (isJokeInDatabase(jokes, joke)) {
                // Se è già presente, genera una nuova battuta e riprova

                fetch('https://api.chucknorris.io/jokes/random')
                    .then(response => response.json())
                    .then(newNorris => {
                        const newJoke = newNorris.value;
                        
                        // Aggiungi la nuova battuta solo se non è già presente
                        if (!isJokeInDatabase(jokes, newJoke)) {
                            jokes.push(newJoke);
                        }
                        
                        // Scrivi nuovamente il file con la nuova battuta
                        writeJSONData('norrisDb', jokes);
                        
                        res.end(`<h1>${newJoke}</h1>`);
                    });
            } else {

                // Se non è presente, aggiungi la battuta corrente
                jokes.push(joke);
                
                // Scrivi nuovamente il file con la nuova battuta
                writeJSONData('norrisDb', jokes);
                
                res.end(`<h1>${joke}</h1>`);
            }
        });
});

server.listen(port, host, () => {
    console.log(`Server avviato su http://${host}:${port}`);
});
