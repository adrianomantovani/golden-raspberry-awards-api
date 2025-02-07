import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';

import db from './database.js';
import routes from './src/routes.js';

const app = express();
const PORT = 3333;

app.use(express.json());
app.use(routes);

const results = [];

fs.createReadStream('Movielist.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const insert = db.prepare(
      'INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)'
    );

    const rows = db.transaction((movies) => {
      for (const movie of movies) {
        insert.run(
          Number(movie.year),
          movie.title,
          movie.studios,
          movie.producers,
          movie.winner === 'yes' ? 1 : 0
        );
      }
    });

    rows(results);
  });

export default app;
