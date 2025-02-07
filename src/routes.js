import express from 'express';
import { getAllMovies, getWinners } from './repositories/movies.js';

const routes = express.Router({
  mergeParams: true,
  caseSensitive: true,
  strict: true,
});

routes.get('/movies', (req, res) => {
  const rows = getAllMovies();
  return res.json(rows);
});

routes.get('/winners', (req, res) => {
  const rows = getWinners();
  return res.json(rows);
});

routes.get('/intervals', (req, res) => {
  const winners = getWinners();

  let minCount = 0;
  let maxCount = 0;
  let prevTable = [];
  const masterTable = [];

  winners.map((winner) => {
    const foundOne = prevTable.find((f) => f.producer === winner.producer);

    if (!foundOne) {
      prevTable.push({
        year: winner.year,
        producer: winner.producer,
      });

      masterTable.push({
        producer: winner.producer,
        interval: 0,
        previousWin: 0,
        followingWin: winner.year,
      });
    } else {
      const interval = winner.year - foundOne.year;
      console.log(' ---- Achou ----');
      console.log({ producer: winner.producer });
      console.log({ interval });

      masterTable.push({
        producer: winner.producer,
        interval,
        previousWin: foundOne.year,
        followingWin: winner.year,
      });

      prevTable.map((prev) => {
        if (prev.producer === winner.producer) {
          prev.year = winner.year;
        }
      });

      if (minCount === 0) minCount = interval;
      if (interval < minCount) minCount = interval;
      if (interval > maxCount) maxCount = interval;
    }
  });

  console.log({ minCount, maxCount });

  const min = masterTable.filter((row) => row.interval === minCount);

  const max = masterTable.filter((row) => row.interval === maxCount);

  return res.json({ min, max });
});

export default routes;
