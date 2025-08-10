import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import AlbumsPage from './pages/AlbumsPage.jsx'
import AlbumDetailPage from './pages/AlbumDetailPage.jsx'
import AuthCallbackPage from './pages/AuthCallbackPage.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import FormPage from './pages/FormPage.jsx'


export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<AlbumsPage />} />
          <Route path="/album/:albumId" element={<AlbumDetailPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  )
}
