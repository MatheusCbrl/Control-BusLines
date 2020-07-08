import React from 'react';

export default function Spinner() {
  return (
    <div style={styles.flexRow}>
      <div className="preloader-wrapper small active">
        <div className="spinner-layer spinner-red-only">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>

      <span style={styles.texto}>Buscando dados...</span>
    </div>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto:{
    marginLeft: '10px', 
    fontSize: '1.2rem'
  },
};
