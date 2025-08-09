import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] px-6 md:px-10 py-3 bg-white/80 backdrop-blur">
      <Link to="/" className="flex items-center gap-3 text-[#111518]">
        <div className="size-6">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em]">Photo Album</h2>
      </Link>

      <div className="flex flex-1 justify-end gap-6 md:gap-8">
        <nav className="hidden md:flex items-center gap-6 md:gap-9">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `text-sm font-medium leading-normal ${isActive ? 'text-[#19a2e6]' : 'text-[#111518]'}`}
          >
            Albums
          </NavLink>
        </nav>
        <Link
          to="/form"
          className="hidden md:flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#19a2e6] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#148ac0] transition-colors"
        >
          <span className="truncate">Create Album</span>
        </Link>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBd9yyYo-LbwtF9gZ4I_5GvXr4BTWzm-WlcUTGd3VFSe_WeRxnep1wulBIDyjvrNRcZqfVfPB5JBdQ3hC5cU30LMcS9UD6aHet3KKj5BskwusE8giNnZXJHNgMvS9143c9BdJZ1YbC5Va4AX2uZzhItea3cgLGPMv96emYYM7FFTdPGMhgOGfvRtKX8_kON3nNsWFNEopQhzZ_cIiRisExt_9MRaDPmV6vPaAa_HayNyi70CtIVXKbHLT6d-ktkaZe81kdoL_HJszCU")' }}
        />
      </div>
    </header>
  )
}


