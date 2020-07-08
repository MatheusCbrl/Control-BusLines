import React, { useState, useEffect } from 'react';

/**
 * Utilização de 'react-modal'
 */
import Modal from 'react-modal';
/**
 * Exigido pelo componente Modal
 */
Modal.setAppElement('#root');

/**
 * Componente ModalLine
 */
export default function ModalLine({ onSave, onClose, selectedLine }) {
  /**
   * Desestruturando selectedLine
  */

  const { id, latitude, longitude, hora, prestadora } = selectedLine;

  // Valor referencia
  const [latitudeValue, setLatitudeValue] = useState(latitude);
  const [longitudeValue, setLongitudeValue] = useState(longitude);
  const [horaValue, setHoraValue] = useState(hora);
  const [prestadoraValue, setPrestadoraValue] = useState(prestadora);
  
  // Objeto de validação da nota

 /**
   * Efeito para verificar se a nota informada
   * pelo usuário é válida, monitorando gradeValue
   * e gradeValidation
   */
  /**
   * Evento para monitorar a tecla Esc, através de keydown
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    // Eliminando evento
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  /**
   * Cercando a tecla "Esc"
   * e fechando a modal caso
   * seja digitada
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose(null);
    }
  };

  /**
   * Função para lidar com o envio
   * de dados do formulário. Devemos
   * prevenir o envio e tratar manualmente
   */
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = {
      id,
      newLatitude: latitudeValue,
      newLongitude: longitudeValue,
      newHora: horaValue,
      newPrestadora: prestadoraValue,
    };

    onSave(formData);
    console.log("valores salvos: ",formData);
  };

  /**
   * Lidando com o fechamento da modal
   */
  const handleModalClose = () => {
    onClose(null);
  };

  /**
   * Lidando com a mudança da nota
   * no input
   */
  const handleLatitudeChange = (event) => {
    setLatitudeValue(event.target.value);
  };
  const handleLongitudeChange = (event) => {
    setLongitudeValue(event.target.value);
  };
  const handleHoraChange = (event) => {
    setHoraValue(event.target.value);
  };
  const handlePrestadoraChange = (event) => {
    setPrestadoraValue(event.target.value);
  };
  /**
   * JSX
   */
  return (
    <div>
      <Modal isOpen={true}>
        <div style={styles.flexRow}>
          <span style={styles.title}>Manutenção</span>
          <button
            className="waves-effect waves-lights btn red dark-4"
            onClick={handleModalClose}
          >
            X
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="input-field">
            <input id="inputLatitude" type="text" autoFocus value={latitudeValue} onChange={handleLatitudeChange}/>
            <label className="active" htmlFor="inputLatitude">
             Latitude:
            </label>
          </div>

          <div className="input-field">
            <input id="inputLongitude" type="text" value={longitudeValue} onChange={handleLongitudeChange}/>
            <label className="active" htmlFor="inputLongitude">
              Longitude:
            </label>
          </div>
          <div className="input-field">
          <input id="inputHora" type="text" value={horaValue} onChange={handleHoraChange}/>
            <label className="active" htmlFor="inputHora">
              Hora:
            </label>
          </div>

          <div className="input-field">
            <input id="inputPrestadora" type="text" value={prestadoraValue} onChange={handlePrestadoraChange}/>
            <label className="active" htmlFor="inputPrestadora">
              prestadora:
            </label>
          </div>

          <div style={styles.flexRow}>
            <button
              className="waves-effect waves-light btn"
            >
              Salvar
            </button>
            <span style={styles.errorMessage}>Atente, está fazendo mudanças importantes</span>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },

  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },

  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
};
