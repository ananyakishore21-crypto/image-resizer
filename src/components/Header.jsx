export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="logo" aria-hidden="true">⤢</div>
        <div>
          <h1>Image Resizer</h1>
          <p>Resize JPG, PNG and WEBP images — privately, right in your browser.</p>
        </div>
        <span className="badge">No uploads · 100% local</span>
      </div>
    </header>
  );
}
