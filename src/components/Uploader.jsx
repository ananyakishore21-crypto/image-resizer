import { useRef, useState } from 'react';

export default function Uploader({ onFile, compact }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <section
      className={`dropzone ${over ? 'over' : ''} ${compact ? 'compact' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      aria-label="Image upload area"
    >
      <div className="drop-icon" aria-hidden="true">🖼️</div>
      <h2>{compact ? 'Use a different image' : 'Drag & drop your image here'}</h2>
      <p>JPG, JPEG, PNG or WEBP · up to 50 MB</p>
      <button type="button" className="btn primary" onClick={() => inputRef.current?.click()}>
        Choose Image
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        aria-label="Choose an image file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />
    </section>
  );
}
