import express from 'express';
import fs from 'fs';
import { promisify } from 'util';

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

async function postLine(lineToPost) {
  const data = JSON.parse(await readFile(global.fileName, 'utf8'));
  let line = Object.assign({}, lineToPost);
  line = { id: data.nextId++, ...line, timestamp: new Date() };
  data.lines.push(line);
  await writeFile(global.fileName, JSON.stringify(data));
  logger.info(`POST /line - ${JSON.stringify(line)}`);

  return line;
}

router.post('/', async (req, res) => {
  try {
    const line = await postLine(req.body);
    res.send({ id: line.id });
    res.end();
    logger.info(`POST /line - ${JSON.stringify(line)}`);
  } catch (err) {
    console.log(err.message);
    res.status(400).send({ error: err.message });
  }
});

router.get('/', async (_, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    delete data.nextId;

    res.send(data);

    logger.info('GET /line');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    const line = data.lines.find(
      (line) => line.id === parseInt(req.params.id, 10)
    );
    if (line) {
      res.send(line);
    } else {
      res.end();
    }
    logger.info(`GET /line - " ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));

    data.lines = data.lines.filter(
      (line) => line.id !== parseInt(req.params.id, 10)
    );
    await writeFile(global.fileName, JSON.stringify(data));

    res.send(true);

    logger.info(`DELETE /line - " ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const newLine = req.body;
    const data = JSON.parse(await readFile(global.fileName, 'utf8'));
    let oldLineIndex = data.lines.findIndex(
      (grade) => grade.id === newLine.id
    );
    newLine.timestamp = new Date();
    data.lines[oldLineIndex] = newLine;
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`PUT /grade - " ${JSON.stringify(newLine)}`);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});

export default router;
export { postLine };
