import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import app from '../app.js';
import db from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_FILE_PATH = path.join(__dirname, '../Movielist.csv');

describe('Given a csv file', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(3333, () => done());
  });

  afterAll((done) => {
    server.close(() => done());
  });

  test('Expect the databese to have the same number of rows', async () => {
    await request(server).get('/');

    const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const csvLines = csvData.split('\n').filter((line) => line.trim() !== '');
    const csvCount = csvLines.length - 1;

    const rowCount = db
      .prepare('SELECT COUNT(*) AS count FROM movies')
      .get().count;

    expect(rowCount).toBe(csvCount);
  });
});
