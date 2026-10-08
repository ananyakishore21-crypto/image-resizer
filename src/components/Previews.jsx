import { formatBytes } from '../utils/image.js';

function Panel({ title, src, dims, size, alt, children }) {
  return (
    <figure className="card panel">
      <figcaption>
        <h3>{title}</h3>
        <span className="dims">{dims}</span>
      </figcaption>
      <div className="frame">
        {src ? <img src={src} alt={alt} /> : <p className="placeholder">{children}</p>}
      </div>
      {size != null && <p className="size">{formatBytes(size)}</p>}
    </figure>
  );
}

export default function Previews({ original, result, originalSize }) {
  return (
    <div className="previews">
      <Panel title="Original" src={original.url} alt="Original uploaded image"
        dims={`${original.width} × ${original.height} px`} size={originalSize} />
      <Panel title="Resized" src={result?.url} alt="Resized image preview"
        dims={result ? `${result.width} × ${result.height} px` : '—'}
        size={result?.blob.size}>
        Choose dimensions and click “Resize Image” to see the result.
      </Panel>
    </div>
  );
}
