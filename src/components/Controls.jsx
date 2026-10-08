import { FORMATS } from '../utils/image.js';

const PRESETS = [
  [100, 100],
  [300, 300],
  [500, 500],
  [1080, 1080],
  [1920, 1080],
];

export default function Controls({
  width, height, lock, format, quality, busy,
  onWidth, onHeight, onLock, onPreset, onFormat, onQuality, onResize,
}) {
  return (
    <section className="card controls" aria-label="Resize controls">
      <h2>Resize settings</h2>

      <div className="row two">
        <label className="field">
          <span>Width (px)</span>
          <input type="number" inputMode="numeric" min="1" value={width}
            onChange={(e) => onWidth(e.target.value)} />
        </label>
        <label className="field">
          <span>Height (px)</span>
          <input type="number" inputMode="numeric" min="1" value={height}
            onChange={(e) => onHeight(e.target.value)} />
        </label>
      </div>

      <label className="switch">
        <input type="checkbox" role="switch" checked={lock}
          onChange={(e) => onLock(e.target.checked)} />
        <span className="track" aria-hidden="true"><span className="thumb" /></span>
        <span>Lock aspect ratio</span>
      </label>

      <div className="field">
        <span>Presets</span>
        <div className="chips" role="group" aria-label="Preset sizes">
          {PRESETS.map(([w, h]) => (
            <button type="button" key={`${w}x${h}`}
              className={`chip ${+width === w && +height === h ? 'active' : ''}`}
              onClick={() => onPreset(w, h)}>
              {w} × {h}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span id="fmt-label">Output format</span>
        <div className="segmented" role="radiogroup" aria-labelledby="fmt-label">
          {Object.entries(FORMATS).map(([key, f]) => (
            <button type="button" key={key} role="radio" aria-checked={format === key}
              className={format === key ? 'active' : ''} onClick={() => onFormat(key)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span className="between">
          <span>Quality</span><strong>{quality}%</strong>
        </span>
        <input type="range" min="10" max="100" step="1" value={quality}
          disabled={format === 'png'} onChange={(e) => onQuality(+e.target.value)} />
        {format === 'png' && <small>PNG is lossless, so the quality slider doesn't apply.</small>}
      </label>

      <button type="button" className="btn primary large" onClick={onResize} disabled={busy}>
        {busy ? 'Resizing…' : 'Resize Image'}
      </button>
    </section>
  );
}
