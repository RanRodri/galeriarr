export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-6 flex items-center justify-between text-sm">
        <p className="opacity-80">© Rances Rodriguez - 2025 Photo Album</p>
        <div className="flex items-center gap-4 opacity-80">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-100">Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-100">Terms</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-100">Help</a>
        </div>
      </div>
    </footer>
  )
}


