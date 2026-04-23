import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const STORAGE_KEY = 'decisor_opciones';

export default function App() {
  const [opciones, setOpciones] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputValue, setInputValue] = useState('');
  const [resultado, setResultado] = useState(null);
  const [winnerIndex, setWinnerIndex] = useState(-1);
  const [rolling, setRolling] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const inputRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(opciones));
  }, [opciones]);

  const mostrarToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2000);
  };

  const agregarOpcion = () => {
    const texto = inputValue.trim();
    if (!texto) {
      mostrarToast('Escribe algo primero');
      return;
    }
    setOpciones(prev => [...prev, texto]);
    setInputValue('');
    setWinnerIndex(-1);
    setResultado(null);
    inputRef.current?.focus();
  };

  const eliminarOpcion = (index) => {
    setOpciones(prev => prev.filter((_, i) => i !== index));
    if (winnerIndex === index) {
      setWinnerIndex(-1);
      setResultado(null);
    } else if (winnerIndex > index) {
      setWinnerIndex(prev => prev - 1);
    }
  };

  const decidir = () => {
    if (opciones.length === 0 || rolling) return;

    setRolling(true);
    setWinnerIndex(-1);
    setResultado(null);

    let count = 0;
    const totalTicks = 20;

    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * opciones.length);
      setDisplayText(opciones[random].toUpperCase());
      count++;

      if (count >= totalTicks) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * opciones.length);
        const finalResult = opciones[finalIndex].toUpperCase();
        setDisplayText(finalResult);
        setResultado(finalResult);
        setWinnerIndex(finalIndex);
        setRolling(false);
      }
    }, 80);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') agregarOpcion();
  };

  const resultState = rolling ? 'rolling' : resultado ? 'revealed' : 'empty';

  return (
    <div className="app">
      <div className="header">
        <span className="header-emoji">🎲</span>
        <h1>¿Qué hacemos hoy?</h1>
        <p>Agrega tus opciones y deja que el destino decida</p>
      </div>

      <div className={`result-card ${resultState}`}>
        <div className="result-label">la decisión es...</div>
        {resultState === 'empty' && (
          <div className="result-value empty">
            {opciones.length === 0 ? 'Aún no hay opciones' : 'Presiona el botón para decidir'}
          </div>
        )}
        {resultState === 'rolling' && (
          <div className="result-value rolling">{displayText}</div>
        )}
        {resultState === 'revealed' && (
          <div className="result-value revealed">{resultado}</div>
        )}
      </div>

      <button
        className={`btn-decide ${rolling ? 'rolling-anim' : ''}`}
        onClick={decidir}
        disabled={opciones.length === 0 || rolling}
      >
        ¡Decidir por mí! 🎲
      </button>

      <div className="section-header">
        <span className="section-title">Mis opciones</span>
        <span className="count-badge">{opciones.length}</span>
      </div>

      <div className="options-list">
        {opciones.length === 0 ? (
          <div className="empty-state">Agrega opciones para comenzar</div>
        ) : (
          opciones.map((op, i) => (
            <div key={i} className={`option-item ${i === winnerIndex ? 'winner' : ''}`}>
              <span className="option-number">{i + 1}</span>
              <span className="option-text">
                {op}
                {i === winnerIndex && <span className="winner-check"> ✓</span>}
              </span>
              <button
                className="btn-delete"
                onClick={() => eliminarOpcion(i)}
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="add-row">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe una opción..."
          maxLength={60}
        />
        <button className="btn-add" onClick={agregarOpcion}>
          + Agregar
        </button>
      </div>

      <div className={`toast ${toastVisible ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}
