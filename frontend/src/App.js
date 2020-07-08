import React, { useState, useEffect } from 'react';
import * as api from './api/apiService';
import Spinner from './components/Spinner';
import LinesControl from './components/LinesControl';
import ModalLine from './components/ModalLine';

export default function App() {
  const [allLines, setAllLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const getLines = async () => {
      const lines = await api.getAllLines();
      setTimeout(() => {
        setAllLines(lines);
      }, 2000);
    };

    // api.getAlLines().then((lines) => {
    //   setTimeout(() => {
    //     setAllLines(lines);
    //   }, 2000);
    // });

    getLines();
  }, []);

  const handleDelete = async (lineToDelete) => {
    const isDeleted = await api.deleteLine(lineToDelete);

    if (isDeleted) {
      const deletedLineIndex = allLines.findIndex(
        (line) => line.id === lineToDelete.id
      );

      const newLines = Object.assign([], allLines);
      newLines[deletedLineIndex].isDeleted = true;
      newLines[deletedLineIndex].value = 0;

      setAllLines(newLines);
    }
  };

  const handlePersist = (line) => {
    setSelectedLine(line);
    setIsModalOpen(true);
  };

  const handlePersistData = async (formData) => {
    const { id,newLatitude,newLongitude,newHora,newPrestadora } = formData;

    const newLines = Object.assign([], allLines);

    const lineToPersist = newLines.find((line) => line.id === id);
    lineToPersist.latitude = newLatitude;
    lineToPersist.longitude = newLongitude;
    lineToPersist.hora = newHora;
    lineToPersist.prestadora = newPrestadora;

    if (lineToPersist.isDeleted) {
      lineToPersist.isDeleted = false;
      await api.insertLine(lineToPersist);
    } else {
      await api.updateLine(lineToPersist);
    }

    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };


  return (
    <div>
      <h1 className="center" style={styles.color}>Controle de Paradas</h1>

      {allLines.length === 0 && <Spinner />}
      {allLines.length > 0 && (

        <LinesControl
          lines={allLines}
          onDelete={handleDelete}
          onPersist={handlePersist}
        />
      )}

      {isModalOpen && (
        <ModalLine
          onSave={handlePersistData}
          onClose={handleClose}
          selectedLine={selectedLine}
        />
      )}
    </div>
  );
}

const styles = {
  color: {
    color: "#ff6600",
  },
};
