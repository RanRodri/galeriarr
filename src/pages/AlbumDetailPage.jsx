import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function AlbumDetailPage() {
  const { albumId } = useParams()
  const [selectedImage, setSelectedImage] = useState(null)

  // Datos simulados para las imágenes del álbum
  const albumImages = [
    {
      id: 1,
      title: "Sunset Over Mountains",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuUT7nh8U7op3z0Wrrx7vRwnQgFa49vu5N1szNAB_Ru8jYCN1y3CfieQFbs2PIN88bRJq4-W86rf2xv0aS-23yihqHHRZC5C12-kP2zg9sMKVxWnaL6esALUp_Icm3kBOqACvCQ1mxTEpQKHW2VLPIZ98ywED5iEDo_0gsNWKbdm-Tw5L75ZfS_3qlxSGWSoFdTD2CUs43XS5z6fX3HYZSNcCV7Z28YHbYLUGBj9YhBg_xiYyjD6bP7Gysx4-4SBU8nq5MTURrr7E",
      uploadedDate: "Uploaded 2 days ago",
      fileSize: "2.4 MB",
      dimensions: "1920x1080",
      camera: "Canon EOS R5"
    },
    {
      id: 2,
      title: "City Lights at Night",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCelihOKK3zl87_JGJf8zjoN0jtT-uqG7rq4mXytPHZzf2T44ulQs5rhSRA3qujKyzdKusFENQuYtxGTC9gy7Axy17UqFj7mV0VsaXzIyq6wI6J210UeOxRoyfTWxtqFTCx2fn2aci2pdvslguxrfzfAeG5XB3_3ldauZVKfKhIpsSFT2HHLWgOZ7xzLyGCMeF6aTorRWhFC7JmtHQ2tRfjlxF0sF-Gfm0OmnZRQYPPYDPmacecdou74OYdJQc1oVp670vXa3swThc",
      uploadedDate: "Uploaded 3 days ago",
      fileSize: "3.1 MB",
      dimensions: "2560x1440",
      camera: "Sony A7R IV"
    },
    {
      id: 3,
      title: "Beach Vacation",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwdq-lzACDoqdyyHCoxtb9XpYbGk8kvbSXhu9rMRn_Od-RZzltiqQIKELKAN-rlV3nWFWvrGJUfp4FkyQy49HeJGcKK0zQouD1gDy-7csQ2KjcskUwM6LhlD4Kxhs4oHsjnscJcDAX0_FbWZMQuLtl23VxzvlS83y-Jkx6-BKlJJmmv3v-wpHLEU4Ar_2lfF2vACN6ywtGxoV4ClgtZ8X_N3_L-e6QWVNoka09km_By93xfgfTB0c9jmuSOzEgHJKACNGGBRCI4aM",
      uploadedDate: "Uploaded 5 days ago",
      fileSize: "1.8 MB",
      dimensions: "1600x1200",
      camera: "iPhone 14 Pro"
    },
    {
      id: 4,
      title: "Forest Trail",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmbiK1YKpzgG1iZFHa9P5tqPtINKjwqBAchXQXRMsuQPaw2Ph6lVgXIPvr-uZE6pzpe_zoleGX9FNp5NpkaS_AMXhHzfatjYfmrQVH3haFxFuAOSq0cGK79xMEA1DDW4nwNNnOfF-0ehrwnzhHg6rDn4da5kUg8zc0HR3jbsSbZU34Fp4KlrTsarUyImXbMQ9zIKUevGWtuRFvOjeZZf-ELaa7TNjTGlK_0T4VG1YiianHB8Wm9Qjk1oIHTR5pOjr3pCcU6471TXU",
      uploadedDate: "Uploaded 1 week ago",
      fileSize: "2.7 MB",
      dimensions: "2048x1536",
      camera: "Nikon D850"
    },
    {
      id: 5,
      title: "Urban Exploration",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXAW6Bk968t4cWPORVv_m-FFU2X30MdfAluw5pCFo_KNfVl2CQoIj74ugoUp9WwfZrR5vXiQslZKW9Z9QDj1iZb1BIpQnYt__WAnXuqObGAekHAXyJzmqgEaQzB-dmPTl_6Mvxuh4OEB3MMMDdb5mzd1wM2grSBCEFu5CceGUJuRONylADaCYq6o_31Aqn-P7R0N5qO5Zyi2fsrZCV78Gfv3xTv8IQYpbpX11_H1s6byI9CHURURSaXfNw8ArqMDsnT4vXVJkX0JA",
      uploadedDate: "Uploaded 2 weeks ago",
      fileSize: "3.5 MB",
      dimensions: "3024x4032",
      camera: "Fujifilm X-T4"
    },
    {
      id: 6,
      title: "Wildlife Photography",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuArctKY5mfmHWcQ_iLsrAcsgJeDYzu4AVm5z9m7hwX4u4HZJM-JKi2vb54YJQYGhuOyyk_8BsLOKOvjZXDN5f06zWAC6znYOCxY588UW0S0GzEX4GribNdbPhFaz0GTcBrPo_iuabb6xp0v4FKtmSNrHXebRCLshrSfA9V9YLfam6RXKyYAhHRwgHesscx2X_ANhK0rgA-2qFtr_fRyccvublo8huVAmlNalqhbqgJoktfarYUQWX2p9slwSsQ5oNLaCYsXOrjFCb0",
      uploadedDate: "Uploaded 3 weeks ago",
      fileSize: "4.2 MB",
      dimensions: "4000x3000",
      camera: "Canon R6 Mark II"
    },
    {
      id: 7,
      title: "Abstract Art",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvRIrwvJGeytiBiuSiAQjZcio17JV_UGsgybG0u-WU5UFkhmeLDldJa4FYqIFUVbfDzASOKjqLLwCIjWNl-vtBUJzsQTn5t-O33umOqgNn3bkwPPKOMCmjZodDD0T-k3RL5hM73EdKifjWs84MelS141GDls3DJMVIgXdmXpXgl7Cn2vn3w1rI5iOSS9Ky939FvfMIokaVZcwwOc_dP0m2TWdnv8DM-WgUYbUom1iB-9QeCBk_15XTEaKgeXJJ_hMkV80A50LPfHA",
      uploadedDate: "Uploaded 1 month ago",
      fileSize: "1.5 MB",
      dimensions: "1440x1800",
      camera: "Olympus OM-1"
    },
    {
      id: 8,
      title: "Family Portrait",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAppPp1jf5epD9Sz9qc5dY-64QpyXo90S6ZndZ1TBt1a1zT5VE4QL5wMrSPaXH6Gs8-0JtfbKqJxVqT60LsgG__fA6nDk6ZfoUagvgNZ4e1Zr0x9Zp3r_6dyWqRqhrFqMndsr3kJwkhmN9YLLj_t7y2W7Gwdi1UxA56KX-1TwrwTXORcG8BX9KTOGkJMH2SknRWrcYeVSM0Pv7eKFzL6VF0ltlgBJHbim0Wu90lXoF4xUYa5ZV8ZnJC8F_39-Xtw89zxjbAyjbg0kg",
      uploadedDate: "Uploaded 2 months ago",
      fileSize: "2.9 MB",
      dimensions: "2400x1600",
      camera: "Sony A7 III"
    },
    {
      id: 9,
      title: "Travel Diary",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKOQLxboPJGYmKFSZ0vvVNKMAqbMljv4OojC-ByZ-kE1NFbdGtjqnJuKVgqscoWC8WeC8ybX-MYcw0R7loekJDyQXNCy0XUVNkJ2jLaJv6CLE1BvKObkH3RpWB0ADjKnJLjMZHQz-mjrGVlq8kchUO1QbYgwHC8vujHHPROGZhI-MgXPwHOQw3Vk0sYO4tWmmq1x_DSoiYcUeu6CEL_KuWIPTD-Tc7LLr8ZObKYwYqvQqMlbbaBPICqNtGpGQt9RILRM6LUPMseIM",
      uploadedDate: "Uploaded 3 months ago",
      fileSize: "3.3 MB",
      dimensions: "2880x1920",
      camera: "Canon EOS R"
    },
    {
      id: 10,
      title: "Nature's Beauty",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9PD4Xdu1P3KMkXvCENJPrIJeZaIL7krkvlV6iivdwOd3S9KovkaLCaSRVlvUr_zKYmmX3wHdYNoNJ3DGEkHN4buJK9xZbl3U4x7lk4F2mHpd-HCJqABVmCQvuaqHPzatI24NkPvZIS-vehklxFsKEVGpdxGPXqdwd2OKSnvX9BDBifTAMQcEvEc9GxlNRiDn-SRnQzWXPTyJzSZFlK7klpSPAwTp5pahSb82dx0iFV1IQ21FhyzZ0XxrdAFZnBG41cpvMiXHliss",
      uploadedDate: "Uploaded 4 months ago",
      fileSize: "2.1 MB",
      dimensions: "1920x1280",
      camera: "Panasonic GH5"
    },
    {
      id: 11,
      title: "Architectural Marvels",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF-e6SieVif3NPPA5xD2fV0aQpohY8awq4eQlDxBbftf9JYm5b_qPcA4lVcalUZxHEjX4EWRSr4OdIdk6JIIwEaz331cGErzUFoIk7EDlHgB9bb3u56UKU7k-2iNgxbC21wcZgTbNJC5jOln5U6HaNHY7rnBEN7v0ACh8qD0dfmniAgLpDrp-b-nv0a03I4UFxzMmlUNaEip4jldsH6ocQbTvjh9YXcb9vDZy4uB5dA_DGIsz94Fi__z-o8NrrhgNUXDMvBmNFru4",
      uploadedDate: "Uploaded 5 months ago",
      fileSize: "4.7 MB",
      dimensions: "3840x2160",
      camera: "Nikon Z9"
    },
    {
      id: 12,
      title: "Culinary Delights",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-ZtZZD-2_234BGz8f0P9QbRqaavIykVVGgfjvJFwZWYZP-1hX2EVZDS71zsRC509ZaT5maf749o7ntYmdToHLaq3yKSkIGsczMPv_crryb8akDQpVGSiwebpDIXVR68Y-9fyJ5-kwxD_tgg2FtRgPadSCrHkov22-Udysde6geQVeHO4bjRXkFQlr0RLWsXDqxBsuAJwG5ojsQ5u01a-Ri1SfYYsw7PgFgCuZNCaB-aAHklo_jQAeP2eJDDzEDU7z1DEe1dLkUgA",
      uploadedDate: "Uploaded 6 months ago",
      fileSize: "1.9 MB",
      dimensions: "1800x1200",
      camera: "Leica Q2"
    }
  ]

  // Función para manejar el clic en una imagen
  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  // Función para cerrar la vista maximizada
  const handleCloseMaximized = () => {
    setSelectedImage(null)
  }

  // Función para navegar entre imágenes en vista maximizada
  const handleNavigateImage = (direction) => {
    const currentIndex = albumImages.findIndex(img => img.id === selectedImage.id)
    let newIndex
    
    if (direction === 'next') {
      newIndex = currentIndex === albumImages.length - 1 ? 0 : currentIndex + 1
    } else {
      newIndex = currentIndex === 0 ? albumImages.length - 1 : currentIndex - 1
    }
    
    setSelectedImage(albumImages[newIndex])
  }

  // Simular datos del álbum basados en el ID
  const albumData = {
    title: albumId ? `Album ${albumId}` : "My Album",
    totalImages: albumImages.length
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-6 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header del álbum */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex items-center gap-4">
                <Link 
                  to="/" 
                  className="text-[#0e161b] hover:text-[#4e7a97] transition-colors"
                  aria-label="Volver a álbumes"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="currentColor" 
                    viewBox="0 0 256 256"
                  >
                    <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                  </svg>
                </Link>
                <div>
                  <p className="text-[#0e161b] tracking-light text-[32px] font-bold leading-tight min-w-72">
                    {albumData.title}
                  </p>
                  <p className="text-[#4e7a97] text-sm font-normal leading-normal">
                    {albumData.totalImages} fotos
                  </p>
                </div>
              </div>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#e7eef3] text-[#0e161b] text-sm font-medium leading-normal hover:bg-[#d1dde6] transition-colors"
                onClick={() => console.log('Upload image functionality')}
              >
                <span className="truncate">Upload Image</span>
              </button>
            </div>

            {/* Grid de imágenes */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {albumImages.map((image) => (
                <div key={image.id} className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundImage: `url("${image.url}")` }}
                    onClick={() => handleImageClick(image)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Ver imagen: ${image.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleImageClick(image)
                      }
                    }}
                  />
                  <div>
                    <p className="text-[#0e161b] text-base font-medium leading-normal">
                      {image.title}
                    </p>
                    <p className="text-[#4e7a97] text-sm font-normal leading-normal">
                      {image.uploadedDate}
                    </p>
                    <div className="text-[#4e7a97] text-xs font-normal leading-normal mt-1">
                      <p>{image.fileSize} • {image.dimensions}</p>
                      <p>{image.camera}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para vista maximizada */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseMaximized}
        >
          <div 
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
              onClick={handleCloseMaximized}
              aria-label="Cerrar vista maximizada"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                fill="currentColor" 
                viewBox="0 0 256 256"
              >
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>

            {/* Botones de navegación */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              onClick={() => handleNavigateImage('prev')}
              aria-label="Imagen anterior"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                fill="currentColor" 
                viewBox="0 0 256 256"
              >
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
              </svg>
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              onClick={() => handleNavigateImage('next')}
              aria-label="Siguiente imagen"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                fill="currentColor" 
                viewBox="0 0 256 256"
              >
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </button>

            {/* Imagen maximizada */}
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain"
            />

            {/* Información de la imagen */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{selectedImage.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Tamaño:</span> {selectedImage.fileSize}</p>
                  <p><span className="font-medium">Dimensiones:</span> {selectedImage.dimensions}</p>
                </div>
                <div>
                  <p><span className="font-medium">Cámara:</span> {selectedImage.camera}</p>
                  <p><span className="font-medium">Fecha:</span> {selectedImage.uploadedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
