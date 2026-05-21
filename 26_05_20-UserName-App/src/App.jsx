import { useState, useMemo } from 'react'
import styles from './App.module.css'

const COUNTRIES = [
  { value: '', label: '— selecciona —' },
  { value: 'ar', label: 'Argentina (AR)' },
  { value: 'bo', label: 'Bolivia (BO)' },
  { value: 'br', label: 'Brasil (BR)' },
  { value: 'cl', label: 'Chile (CL)' },
  { value: 'co', label: 'Colombia (CO)' },
  { value: 'cr', label: 'Costa Rica (CR)' },
  { value: 'cu', label: 'Cuba (CU)' },
  { value: 'do', label: 'Rep. Dominicana (DO)' },
  { value: 'ec', label: 'Ecuador (EC)' },
  { value: 'sv', label: 'El Salvador (SV)' },
  { value: 'es', label: 'España (ES)' },
  { value: 'gt', label: 'Guatemala (GT)' },
  { value: 'hn', label: 'Honduras (HN)' },
  { value: 'mx', label: 'México (MX)' },
  { value: 'ni', label: 'Nicaragua (NI)' },
  { value: 'pa', label: 'Panamá (PA)' },
  { value: 'py', label: 'Paraguay (PY)' },
  { value: 'pe', label: 'Perú (PE)' },
  { value: 'pr', label: 'Puerto Rico (PR)' },
  { value: 'uy', label: 'Uruguay (UY)' },
  { value: 've', label: 'Venezuela (VE)' },
  { value: 'us', label: 'USA (US)' },
  { value: 'ca', label: 'Canadá (CA)' },
  { value: 'de', label: 'Alemania (DE)' },
  { value: 'fr', label: 'Francia (FR)' },
  { value: 'gb', label: 'Reino Unido (GB)' },
  { value: 'it', label: 'Italia (IT)' },
  { value: 'jp', label: 'Japón (JP)' },
  { value: 'cn', label: 'China (CN)' },
  { value: 'in', label: 'India (IN)' },
  { value: 'au', label: 'Australia (AU)' },
]

function norm(s) {
  return s.trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function initial(s) {
  return norm(s).charAt(0)
}

function generateVariants({ n1, n2, a1, a2, year, country }) {
  const i1 = initial(n1)
  const i2 = initial(n2)
  const i3 = initial(a1)
  const i4 = initial(a2)
  const yearFull = norm(year)
  const year2 = yearFull.slice(-2)
  const cc = country.toLowerCase()
  const initials = [i1, i2, i3, i4].filter(Boolean).join('')

  const results = []

  if (initials && yearFull && cc) {
    results.push(initials + yearFull + cc)
    results.push(initials + year2 + cc)
    results.push(initials + cc + yearFull)
    results.push([i1, i3].filter(Boolean).join('') + yearFull + cc)
  } else if (initials && yearFull) {
    results.push(initials + yearFull)
    results.push(initials + year2)
  } else if (initials && cc) {
    results.push(initials + cc)
  } else if (initials) {
    results.push(initials)
  }

  if (norm(n1) && yearFull) {
    results.push(norm(n1).slice(0, 3) + i3 + yearFull + cc)
  }
  if (norm(a1) && yearFull) {
    results.push(i1 + norm(a1).slice(0, 4) + yearFull + cc)
  }

  return [...new Set(results.filter(v => v.length > 1))]
}

function Field({ label, id, type = 'text', placeholder, value, onChange, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      {children || (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={styles.input}
          autoComplete="off"
          spellCheck="false"
        />
      )}
    </div>
  )
}

export default function App() {
  const [n1, setN1] = useState('')
  const [n2, setN2] = useState('')
  const [a1, setA1] = useState('')
  const [a2, setA2] = useState('')
  const [year, setYear] = useState('')
  const [country, setCountry] = useState('')
  const [selected, setSelected] = useState(null)
  const [copied, setCopied] = useState(false)

  const variants = useMemo(() => {
    if (!n1 && !a1) return []
    return generateVariants({ n1, n2, a1, a2, year, country })
  }, [n1, n2, a1, a2, year, country])

  const mainUser = selected && variants.includes(selected) ? selected : variants[0] || null

  const handleSelect = (v) => setSelected(v)

  const handleCopy = () => {
    if (!mainUser) return
    navigator.clipboard.writeText(mainUser).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const initials = [initial(n1), initial(n2), initial(a1), initial(a2)].filter(Boolean).join('')
  const yearNorm = norm(year)
  const cc = country.toLowerCase()

  const hasResult = variants.length > 0

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Generador de usuario</h1>
        <p className={styles.subtitle}>
          Tus iniciales, año y país — un nombre de usuario único y fácil de recordar.
        </p>
      </header>

      <div className={styles.card}>
        <div className={styles.grid2}>
          <Field label="Primer nombre" id="n1" placeholder="Francisco" value={n1} onChange={v => { setN1(v); setSelected(null) }} />
          <Field label="Segundo nombre" id="n2" placeholder="Javier" value={n2} onChange={v => { setN2(v); setSelected(null) }} />
        </div>
        <div className={styles.grid2}>
          <Field label="Primer apellido" id="a1" placeholder="Martínez" value={a1} onChange={v => { setA1(v); setSelected(null) }} />
          <Field label="Segundo apellido" id="a2" placeholder="Durán" value={a2} onChange={v => { setA2(v); setSelected(null) }} />
        </div>
        <div className={styles.grid2}>
          <Field label="Año de nacimiento" id="yr" type="number" placeholder="1987" value={year} onChange={v => { setYear(v); setSelected(null) }}>
            <input
              id="yr"
              type="number"
              placeholder="1987"
              value={year}
              onChange={e => { setYear(e.target.value); setSelected(null) }}
              className={styles.input}
              min="1900"
              max="2025"
            />
          </Field>
          <Field label="País de nacimiento" id="country">
            <select
              id="country"
              value={country}
              onChange={e => { setCountry(e.target.value); setSelected(null) }}
              className={styles.input}
            >
              {COUNTRIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className={styles.resultCard}>
        <div className={styles.resultLabel}>Nombre de usuario sugerido</div>
        <div className={`${styles.resultUser} ${!hasResult ? styles.placeholder : ''}`}>
          {hasResult ? mainUser : 'completa los campos…'}
        </div>

        {hasResult && (
          <>
            {variants.length > 1 && (
              <div className={styles.variantsSection}>
                <div className={styles.variantsLabel}>Variantes</div>
                <div className={styles.chips}>
                  {variants.slice(1).map(v => (
                    <button
                      key={v}
                      className={`${styles.chip} ${mainUser === v ? styles.chipActive : ''}`}
                      onClick={() => handleSelect(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.copyRow}>
              <div className={styles.breakdown}>
                {initials && (
                  <span className={styles.segment}>
                    <span className={`${styles.segVal} ${styles.segName}`}>{initials}</span>
                    <span className={styles.segDesc}>iniciales</span>
                  </span>
                )}
                {yearNorm && (
                  <span className={styles.segment}>
                    <span className={`${styles.segVal} ${styles.segYear}`}>{yearNorm}</span>
                    <span className={styles.segDesc}>año</span>
                  </span>
                )}
                {cc && (
                  <span className={styles.segment}>
                    <span className={`${styles.segVal} ${styles.segCountry}`}>{cc}</span>
                    <span className={styles.segDesc}>país</span>
                  </span>
                )}
              </div>
              <button className={styles.copyBtn} onClick={handleCopy}>
                {copied ? '✓ Copiado' : '⎘ Copiar'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
