import { Routes, Route } from 'react-router-dom'
import AlbumsPage from './pages/AlbumsPage.jsx'
import Header from './component/Header.jsx'
import Footer from './component/Footer.jsx'
import FormPage from './pages/FormPage.jsx'


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<AlbumsPage />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
      <Footer />
    </div>
  )
}
