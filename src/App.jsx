import { useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Uploader from './components/Uploader.jsx';
import Controls from './components/Controls.jsx';
import Previews from './components/Previews.jsx';
import Download from './components/Download.jsx';
import {
  FORMATS, baseName, loadImage, resizeImage, validateDimensions, validateFile,
} from './utils/image.js';

export default function App() {
  const [file, setFile] = useState(null);
  const [source, setSource] = useState(null); // { url, element, width, height }
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const urls = useRef({ source: null, result: null });

  useEffect(() => () => {
    Object.values(urls.current).forEach((u) => u && URL.revokeObjectURL(u));
  }, []);

  const clearResult = () => {
    if (urls.current.result) URL.revokeObjectURL(urls.current.result);
    urls.current.result = null;
    setResult(null);
  };

  // Any settings change makes the previous result stale, so hide it.
  useEffect(() => {
    clearResult();
  }, [width, height, format, quality]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFile = async (f) => {
    setError('');
    const problem = validateFile(f);
    if (problem) return setError(problem);
    try {
      const loaded = await loadImage(f);
      if (urls.current.source) URL.revokeObjectURL(urls.current.source);
      urls.current.source = loaded.url;
      clearResult();
      setFile(f);
      setSource(loaded);
      setWidth(String(loaded.width));
      setHeight(String(loaded.height));
      // Keep the same format as the upload by default
      setFormat(f.type === 'image/png' ? 'png' : f.type === 'image/webp' ? 'webp' : 'jpeg');
    } catch (err) {
      setError(err.message);
    }
  };

  const ratio = source ? source.width / source.height : 1;
  const toNum = (v) => (v === '' ? NaN : Number(v));

  const changeWidth = (v) => {
    setWidth(v);
    const n = toNum(v);
    if (lock && Number.isFinite(n) && n > 0) setHeight(String(Math.max(1, Math.round(n / ratio))));
    if (lock && v === '') setHeight('');
  };
  const changeHeight = (v) => {
    setHeight(v);
    const n = toNum(v);
    if (lock && Number.isFinite(n) && n > 0) setWidth(String(Math.max(1, Math.round(n * ratio))));
    if (lock && v === '') setWidth('');
  };
  const applyPreset = (w, h) => {
    setLock(false); // presets are exact sizes
    setWidth(String(w));
    setHeight(String(h));
  };

  const handleResize = async () => {
    setError('');
    const w = toNum(width);
    const h = toNum(height);
    const problem = validateDimensions(w, h);
    if (problem) return setError(problem);
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 30)); // let the button state paint
      const blob = await resizeImage(source.element, w, h, format, quality);
      clearResult();
      const url = URL.createObjectURL(blob);
      urls.current.result = url;
      setResult({ blob, url, width: w, height: h, format });
    } catch (err) {
      setError(err.message || 'Processing failed.');
    } finally {
      setBusy(false);
    }
  };

  const filename = result
    ? `${baseName(file.name)}-${result.width}x${result.height}.${FORMATS[result.format].ext}`
    : '';

  return (
    <>
      <Header />
      <main className="container">
        {error && (
          <div className="alert" role="alert">
            <span>⚠️ {error}</span>
            <button type="button" aria-label="Dismiss error" onClick={() => setError('')}>✕</button>
          </div>
        )}

        <Uploader onFile={handleFile} compact={!!source} />

        {source && (
          <div className="workspace">
            <Controls
              width={width} height={height} lock={lock} format={format} quality={quality} busy={busy}
              onWidth={changeWidth} onHeight={changeHeight} onLock={setLock}
              onPreset={applyPreset} onFormat={(f) => { setFormat(f); }}
              onQuality={setQuality} onResize={handleResize}
            />
            <div className="output">
              <Previews original={source} result={result} originalSize={file.size} />
              {result && <Download originalSize={file.size} result={result} filename={filename} />}
            </div>
          </div>
        )}
      </main>
      <footer className="footer">Your images never leave your device.</footer>
    </>
  );
}
