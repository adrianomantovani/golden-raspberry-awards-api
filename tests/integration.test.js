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

  const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf-8');

  test('Expect to have the correct set of columns', async () => {
    const csvColumns = csvData.slice(0, 35).split(';');

    expect(csvColumns).toEqual(
      expect.arrayContaining([
        'year',
        'title',
        'studios',
        'producers',
        'winner',
      ])
    );
  });

  test('Expect the databese to have the same number of rows', async () => {
    await request(server).get('/');
    const csvLines = csvData.split('\n').filter((line) => line.trim() !== '');
    const csvCount = csvLines.length - 1;

    const rowCount = db
      .prepare('SELECT COUNT(*) AS count FROM movies')
      .get().count;

    expect(rowCount).toBe(csvCount);
  });
});

describe('When calling routes', () => {
  describe('GET /movies', () => {
    test('should respond with a 200 status code', async () => {
      const response = await request(app).get('/movies').send();

      expect(response.statusCode).toBe(200);
    });
  });

  describe('GET /winners', () => {
    test('should respond with a 200 status code', async () => {
      const response = await request(app).get('/winners').send();

      expect(response.statusCode).toBe(200);
    });
  });

  describe('GET /intervals', () => {
    test('should respond with a 200 status code', async () => {
      const response = await request(app).get('/intervals').send();

      expect(response.statusCode).toBe(200);
    });
  });
});
