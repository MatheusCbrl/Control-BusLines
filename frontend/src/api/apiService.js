import axios from 'axios';

const API_URL = 'http://localhost:3001/line/';
/**
 * Array com regras para
 * cada tipo de avaliação
 */
async function getAllLines() {
  const res = await axios.get(API_URL);

  const lines = res.data.lines.map((line) => {
    const { linha, latitude, longitude, hora, prestadora } = line;
    return {
      ...line,
      isDeleted: false,
    };
  });

  let alllinhas = new Set();
  lines.forEach((line) => alllinhas.add(line.linha));
  alllinhas = Array.from(alllinhas);

 
  let maxId = -1;

  lines.forEach(({ id }) => {
    if (id > maxId) {
      maxId = id;
    }
  });

  let nextId = maxId + 1;
  const allCombinations = [];
  alllinhas.forEach((linha) => {
        allCombinations.push({
          linha
        });
  });

  allCombinations.forEach(({ linha, latitude, longitude, hora, prestadora }) => {
    const hasItem = lines.find((line) => {
      return (
        line.linha === linha
      );
    });

    if (!hasItem) {
      lines.push({
        id: nextId++,
        linha,
        latitude,
        longitude,
        hora,
        prestadora,
        isDeleted: true,
      });
    }
  });

  lines.sort((a, b) => a.linha.localeCompare(b.linha));

  return lines;
}

async function insertLine(line) {
  const response = await axios.post(API_URL, line);
  return response.data.id;
}

async function updateLine(line) {
  const response = await axios.put(API_URL, line);
  return response.data;
}

async function deleteLine(line) {
  const response = await axios.delete(`${API_URL}/${line.id}`);
  return response.data;
}
/**
 * Tornando todas as funções
 * abaixo disponíveis para
 * serem utilizadas por outros
 * arquivos
 */

export {
  getAllLines,
  insertLine,
  updateLine,
  deleteLine
};
