const http = require('http');
const fs = require('fs');
const split2 = require('split2');
const through2 = require('through2');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {

        const results = [];
        let headers = [];

        fs.createReadStream('data.csv')
            .pipe(split2())
            .pipe(through2.obj(function (line, enc, callback) {

                if (!line) return callback();

                if (headers.length === 0) {
                    headers = line.split(',');
                } else {
                    const values = line.split(',');
                    const obj = {};

                    headers.forEach((header, index) => {
                        obj[header] = values[index];
                    });

                    results.push(obj);
                }

                callback();
            }))
            .on('finish', () => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            })
            .on('error', (err) => {
                res.writeHead(500);
                res.end('Error reading file');
            });

    } else {
        res.writeHead(405);
        res.end('Only GET allowed');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});