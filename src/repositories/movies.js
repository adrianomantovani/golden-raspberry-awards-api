import db from '../../database.js';

export function getAllMovies() {
  const rows = db
    .prepare(
      `
    SELECT * FROM movies
    ORDER BY year asc
  `
    )
    .all();

  return rows;
}

export function getWinners() {
  const rows = db
    .prepare(
      `
    SELECT year, producers FROM movies
    WHERE winner > 0
    ORDER BY year asc
  `
    )
    .all();

  const winners = [];

  for (let i = 0; i < rows.length; i += 1) {
    const str = rows[i].producers;
    const masters = str.split(',');
    for (const master of masters) {
      const producers = master.split(' and ');
      for (const producer of producers) {
        if (producer.trim()) {
          winners.push({
            year: rows[i].year,
            producer: producer.trim(),
          });
        }
      }
    }
  }

  return winners;
}
