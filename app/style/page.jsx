export default function StyleGuide() {
  return (
    <div className="section space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-primary">Style Guide</h1>
        <p className="text-muted">
          Preview of Uni-bok’s blue-themed design system
        </p>
      </div>

      {/* Colors */}
      <div>
        <h2 className="text-xl font-semibold text-heading mb-4">Colors</h2>
        <div className="grid grid-cols-3 gap-4">
          <ColorBox name="Primary" className="bg-primary" />
          <ColorBox name="Primary Light" className="bg-primary-light" />
          <ColorBox name="Primary Dark" className="bg-primary-dark" />
          <ColorBox name="Accent" className="bg-accent" />
          <ColorBox name="Accent Hover" className="bg-accent-hover" />
          <ColorBox name="Secondary" className="bg-secondary" />
          <ColorBox name="Muted" className="bg-muted" />
          <ColorBox name="Muted Dark" className="bg-muted-dark" />
        </div>
      </div>

      {/* Typography */}
      <div>
        <h2 className="text-xl font-semibold text-heading mb-4">Typography</h2>
        <div className="space-y-2">
          <h1 className="text-3xl font-heading">Heading 1 – 3xl</h1>
          <h2 className="text-2xl font-heading">Heading 2 – 2xl</h2>
          <h3 className="text-xl font-heading">Heading 3 – xl</h3>
          <p className="text-base text-muted">
            This is body text using muted color.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div>
        <h2 className="text-xl font-semibold text-heading mb-4">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="btn">Primary Button</button>
          <button className="btn bg-accent hover:bg-accent-hover">
            Accent Button
          </button>
        </div>
      </div>

      {/* Cards */}
      <div>
        <h2 className="text-xl font-semibold text-heading mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h4 className="text-lg font-semibold text-heading">Card Title</h4>
            <p className="text-muted">
              This is a card using base card styling.
            </p>
          </div>
        </div>
      </div>

      {/* Animation */}
      <div>
        <h2 className="text-xl font-semibold text-heading mb-4">Animations</h2>
        <p className="glow-text font-bold text-primary text-2xl">
          This text glows!
        </p>
      </div>
    </div>
  );
}

function ColorBox({ name, className }) {
  return (
    <div className="space-y-1">
      <div className={`h-16 rounded-lg shadow-md ${className}`} />
      <p className="text-sm text-muted">{name}</p>
    </div>
  );
}
