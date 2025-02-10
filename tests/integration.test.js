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

  test('Expect the file to have the correct set of columns', () => {
    const csvColumns = csvData.slice(0, 35).split(';');

    expect(Array.isArray(csvColumns)).toBe(true);

    expect(csvColumns).toEqual([
      'year',
      'title',
      'studios',
      'producers',
      'winner',
    ]);
  });

  test('Expect each line to have 4 separators', () => {
    csvData
      .trim()
      .split('\n')
      .forEach((row) => {
        const current = row.replace(/[^;]/g, '').split('').length;
        expect(current).toBe(4);
      });
  });

  test('Expect each line to have valid content', () => {
    csvData
      .trim()
      .split('\n')
      .forEach((row, i) => {
        if (i > 0) {
          const current = row.split(';');
          expect(current[0].length).toBeGreaterThan(0);
          expect(current[1].length).toBeGreaterThan(1);
          expect(current[2].length).toBeGreaterThan(2);
          expect(current[3].length).toBeGreaterThan(3);
          expect(['', 'yes']).toContain(current[4]);
        }
      });
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

    test('should return the expected JSON structure', async () => {
      const response = await request(app).get('/intervals').send();
      expect(response.body).toHaveProperty('min');
      expect(response.body).toHaveProperty('max');
      expect(Array.isArray(response.body.min)).toBe(true);
      expect(Array.isArray(response.body.max)).toBe(true);
    });

    test('should return objects with correct properties when non-empty', async () => {
      const response = await request(app).get('/intervals').send();

      const validateItem = (item) => {
        expect(item).toHaveProperty('producer');
        expect(typeof item.producer).toBe('string');
        expect(item).toHaveProperty('interval');
        expect(typeof item.interval).toBe('number');
        expect(item).toHaveProperty('previousWin');
        expect(typeof item.previousWin).toBe('number');
        expect(item).toHaveProperty('followingWin');
        expect(typeof item.followingWin).toBe('number');
      };

      response.body.min.forEach(validateItem);
      response.body.max.forEach(validateItem);
    });
  });

  test('GET /intervals should contain producers that appear at least twice in /winners', async () => {
    const winnersResponse = await request(app).get('/winners');
    const winners = winnersResponse.body;

    const producerWins = {};
    winners.forEach(({ producer }) => {
      producerWins[producer] = (producerWins[producer] || 0) + 1;
    });

    const intervalsResponse = await request(app).get('/intervals');
    const { min, max } = intervalsResponse.body;

    const validateProducers = (intervals) => {
      intervals.forEach(({ producer }) => {
        expect(producerWins[producer]).toBeGreaterThanOrEqual(2);
      });
    };

    if (min.length > 0) validateProducers(min);
    if (max.length > 0) validateProducers(max);
  });
});
