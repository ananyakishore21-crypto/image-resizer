import { formatBytes } from '../utils/image.js';

export default function Download({ originalSize, result, filename }) {
  const diff = ((result.blob.size - originalSize) / originalSize) * 100;
  const smaller = diff < 0;
  return (
    <section className="card download" aria-live="polite">
      <div className="stats">
        <div><span>Original size</span><strong>{formatBytes(originalSize)}</strong></div>
        <div><span>New size</span><strong data-testid="new-size">{formatBytes(result.blob.size)}</strong></div>
        <div>
          <span>{smaller ? 'Reduction' : 'Increase'}</span>
          <strong className={smaller ? 'good' : 'bad'} data-testid="size-change">
            {smaller ? '−' : '+'}{Math.abs(diff).toFixed(1)}%
          </strong>
        </div>
      </div>
      <a className="btn success large" href={result.url} download={filename}>
        Download Image
      </a>
    </section>
  );
}
