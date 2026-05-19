import React, { useState } from 'react';
import './App.css';

const TIME_FIELDS = [
  { key: 'years',   label: 'Años',     toHours: 8760 },
  { key: 'months',  label: 'Meses',    toHours: 730 },
  { key: 'weeks',   label: 'Semanas',  toHours: 168 },
  { key: 'days',    label: 'Días',     toHours: 24 },
  { key: 'hours',   label: 'Horas',    toHours: 1 },
  { key: 'minutes', label: 'Minutos',  toHours: 1 / 60 },
  { key: 'seconds', label: 'Segundos', toHours: 1 / 3600 },
];

const defaultTime = { years: '', months: '', weeks: '', days: '', hours: '', minutes: '', seconds: '' };

export default function App() {
  const [watts, setWatts]       = useState('');
  const [time, setTime]         = useState(defaultTime);
  const [costPerKwh, setCost]   = useState('');
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState('');
  const [animating, setAnimating] = useState(false);

  const handleTimeChange = (key, val) => {
    if (val === '' || (Number(val) >= 0)) {
      setTime(prev => ({ ...prev, [key]: val }));
    }
  };

  const calculate = () => {
    setError('');
    const w = parseFloat(watts);
    if (!watts || isNaN(w) || w <= 0) {
      setError('Ingresa un consumo en watts válido.');
      return;
    }
    const totalHours = TIME_FIELDS.reduce((acc, f) => {
      const v = parseFloat(time[f.key]) || 0;
      return acc + v * f.toHours;
    }, 0);
    if (totalHours <= 0) {
      setError('Ingresa al menos una unidad de tiempo.');
      return;
    }
    const kwh = (w * totalHours) / 1000;
    const cost = costPerKwh ? kwh * parseFloat(costPerKwh) : null;

    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
    setResult({ kwh, cost });
  };

  const reset = () => {
    setWatts('');
    setTime(defaultTime);
    setCost('');
    setResult(null);
    setError('');
  };

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="container">

        <header className="header">
          <div className="header-eyebrow">Calculadora de consumo</div>
          <h1 className="header-title">kWh<span className="accent">.</span></h1>
          <p className="header-sub">Calcula cuánta energía consume un aparato y cuánto te cuesta.</p>
        </header>

        <div className="card">
          {/* WATTS */}
          <section className="section">
            <label className="section-label">
              <span className="label-num">01</span>
              Consumo del aparato
            </label>
            <div className="input-row">
              <input
                className="input input-large"
                type="number"
                min="0"
                placeholder="ej. 100"
                value={watts}
                onChange={e => setWatts(e.target.value)}
              />
              <span className="unit-badge">W</span>
            </div>
          </section>

          <div className="divider" />

          {/* TIME */}
          <section className="section">
            <label className="section-label">
              <span className="label-num">02</span>
              Tiempo de uso
            </label>
            <div className="time-grid">
              {TIME_FIELDS.map(f => (
                <div className="time-field" key={f.key}>
                  <input
                    className="input input-time"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={time[f.key]}
                    onChange={e => handleTimeChange(f.key, e.target.value)}
                  />
                  <span className="time-label">{f.label}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="divider" />

          {/* COST */}
          <section className="section">
            <label className="section-label">
              <span className="label-num">03</span>
              Costo por kWh <span className="optional">(opcional)</span>
            </label>
            <div className="input-row">
              <span className="prefix-badge">$</span>
              <input
                className="input input-large"
                type="number"
                min="0"
                step="0.01"
                placeholder="ej. 1.20"
                value={costPerKwh}
                onChange={e => setCost(e.target.value)}
              />
              <span className="unit-badge">/ kWh</span>
            </div>
          </section>

          {error && <div className="error-msg">{error}</div>}

          <div className="btn-row">
            <button className="btn btn-primary" onClick={calculate}>Calcular</button>
            <button className="btn btn-ghost" onClick={reset}>Limpiar</button>
          </div>
        </div>

        {/* RESULTS */}
        {result && (
          <div className={`results-card ${animating ? 'pop-in' : ''}`}>
            <div className="results-header">Resultado</div>
            <div className="results-grid">
              <div className="result-block">
                <div className="result-value">
                  {result.kwh < 1
                    ? result.kwh.toFixed(4)
                    : result.kwh.toLocaleString('es-MX', { maximumFractionDigits: 4 })}
                </div>
                <div className="result-unit">kWh consumidos</div>
              </div>
              {result.cost !== null && (
                <div className="result-block accent-block">
                  <div className="result-value">
                    ${result.cost.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="result-unit">Costo total estimado</div>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="footer">Valores aproximados · Para referencia personal</footer>
      </div>
    </div>
  );
}
