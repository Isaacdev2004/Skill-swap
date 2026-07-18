export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <button onClick={() => window.history.back()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
          Go Back
        </button>
      </div>
    </div>
  )
}