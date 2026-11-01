// Re-mounts on every navigation, so each page settles in as the ground turns.
// Plain CSS keeps the page visible even before scripts load.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
