import React from 'react';
import Action from './Action';

/**
 * Componente para montar tabelas
 * de notas em tela, agrupando por
 * aluno e disciplina
 */
export default function linesControl({ lines, onDelete, onPersist }) {
  /**
   * Lógica de agrupamento, isolando
   * student e subject
   */
  const tableLines = [];

  let currentLinha = lines[0].linha;
  let currentLines = [];
  let id = 1;

  lines.forEach((line) => {
    if (line.linha !== currentLinha) {
      tableLines.push({
        id: id++,
        linha: currentLinha,
        lines: currentLines,
      });

      currentLinha = line.linha;
      currentLines = [];
    }
    currentLines.push(line);
  });

  // Após o loop, devemos inserir
  // o último elemento
  tableLines.push({
    id: id++,
    linha: currentLinha,
    lines: currentLines,
  });

  const handleActionClick = (id, type) => {
    const line = lines.find((line) => line.id === id);
    if (type === 'delete') {
      onDelete(line);
      return;
    }
    onPersist(line);
  };

  /**
   * JSX
   */
  return (
    <div className="container center">
      {tableLines.map(({ id, lines }) => {
        return (
          <table style={styles.table} className="striped" key={id}>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Linha</th>
                <th style={{ width: '20%' }}>Latitude</th>
                <th style={{ width: '20%' }}>Longitude</th>
                <th style={{ width: '20%' }}>Hora</th>
                <th style={{ width: '20%' }}>Prestadora</th>
                <th style={{ width: '20%' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lines.map(
                ({ id, latitude, longitude, linha, isDeleted, hora, prestadora }) => {
                  return (
                    <tr key={id}>
                      <td>{isDeleted ? '-' :linha}</td>
                      <td>{isDeleted ? '-' :latitude}</td>
                      <td>{isDeleted ? '-' :longitude}</td>
                      <td>{isDeleted ? '-' :hora}</td>
                      <td>{isDeleted ? '-' :prestadora}</td>
                  
                      <td>
                        <div>
                          <Action
                            onActionClick={handleActionClick}
                            id={id}
                            type={isDeleted ? 'add' : 'edit'}
                          />
                          {!isDeleted && (
                            <Action
                              onActionClick={handleActionClick}
                              id={id}
                              type="delete"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
            <tfoot>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td style={{ textAlign: 'right' }}>
                &nbsp;
                  {/* <strong>Quantidade de Pontos: </strong> */}
                </td>
                <td>
                &nbsp;
                  {/* <span style={lineStyle}>{finalLine}</span> */}
                </td>
              </tr>
            </tfoot>
          </table>
        );
      })}
    </div>
  );
}

const styles = {
  goodLine: {
    fontWeight: 'bold',
    color: 'green',
  },

  badLine: {
    fontWeight: 'bold',
    color: 'red',
  },

  table: {
    margin: '20px',
    padding: '10px',
  },
};
