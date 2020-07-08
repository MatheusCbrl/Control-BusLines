import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { promisify } from 'util';
import winston from 'winston';
import linesRouter from './routes/lines.js';
import { postLine } from './routes/lines.js';

const app = express();
app.use(cors());
const exists = promisify(fs.exists);                        
const readFile = promisify(fs.readFile);
const deleteFile = promisify(fs.unlink);

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.fileName = 'lines.json';

app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('public'));
app.use('/line', linesRouter);

/**
 * Função para simular algumas
 * notas e já ter algo pronto
 * na API
 */
function simulateLines() {
  const linha = ['L001', 'L002'];
  const latitude = ['-29.2485989', '-29.2390088'];
  const longitude = ['-51.1260841', '-51.1550028'];
  const hora = ['16:00', '16:30'];
  const prestadora = ['Caxiense', 'Caxiense'];
  const lines = [];

  linha.forEach((linha) => {
    latitude.forEach((latitude) => {
      longitude.forEach((longitude) => {
        hora.forEach((hora) => {
          prestadora.forEach((prestadora) => {
            const line = {
              linha,
              latitude,
              longitude,
              hora,
              prestadora,
              
            };
         lines.push(line);
        });
       });
      });
    });
  });

  const postAllLines = async () => {
    for (let i = 0; i < lines.length; i++) {
      await postLine(lines[i]);
    }
  };

  postAllLines();
}

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'lines-control-api.log' }),
  ],
  format: combine(
    label({ label: 'lines-control-api' }),
    timestamp(),
    myFormat
  ),
});

app.listen(3001, async () => {
  /**
   * Reiniciando o arquivo com os dados
   * simulados. Comente a linha abaixo
   * se quiser preservar os dados
   */
 /** await deleteFile(global.fileName);*/

  try {
    const fileExists = await exists(global.fileName);
    if (!fileExists) {
      const initialJson = {
        nextId: 1,
        lines: [],
      };
      await readFile(global.fileName, JSON.stringify(initialJson));
      // simulateLines()
    }
  } catch (err) {
    logger.error(err);
  }
  logger.info('API started!');
});
