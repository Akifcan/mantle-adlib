import { useEffect, useState } from "react"

interface AdResponse {
    campaign: {
      id: number
    }
    variant: {
      id: number
      type: string
      url: string
      title?: string
      subtitle?: string
      redirectLink?: string
    }
    tx: string
  }
  
  interface Web3AdComponentProps {
    apiKey: string
    type: string
    category?: string
    onReward?: () => void
  }
  

function Web3AdComponent({ apiKey, type, category, onReward }: Web3AdComponentProps) {
    const [adData, setAdData] = useState<AdResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isRewardOpen, setIsRewardOpen] = useState(false)
    const [rewardTimer, setRewardTimer] = useState(5)
    const [canCloseReward, setCanCloseReward] = useState(false)
    const [adRendered, setAdRendered] = useState(false)

    // Reklam tamamlandığında /publisher/complete API'sine istek at
    const sendCompleteRequest = async (tx: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publisher/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apiKey': apiKey
          },
          body: JSON.stringify({ tx })
        })
        
        if (response.ok) {
          console.log('Ad completion recorded successfully')
        } else {
          console.error('Failed to record ad completion')
        }
      } catch (error) {
        console.error('Error sending completion request:', error)
      }
    }

    useEffect(() => {
      async function fetchAd() {
        try {
          setLoading(true)
          setError(false)
          
          // Category varsa URL'de kullan, yoksa sadece base URL
          const url = category 
                    ? `${process.env.NEXT_PUBLIC_API_URL}/publisher/display/${category}`
        : `${process.env.NEXT_PUBLIC_API_URL}/publisher/display`
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apiKey': apiKey
            },
            body: JSON.stringify({ type })
          })
  
          if (response.ok) {
            const data: AdResponse = await response.json()
            
            // {"display":false} kontrolü
            if (data && typeof data === 'object' && 'display' in data && data.display === false) {
              setError(true)
              setAdData(null)
              return
            }
            
            setAdData(data)
            
            // Eğer popup tipindeyse popup'ı aç
            if (data.variant?.type === 'popup') {
              setIsPopupOpen(true)
            }
            
            // Eğer reward tipindeyse reward popup'ı aç
            if (data.variant?.type === 'reward') {
              setIsRewardOpen(true)
              setRewardTimer(5)
              setCanCloseReward(false)
            }

            // Reward olmayan reklamlar için reklam render edildikten sonra complete API'sine istek at
            if (data.variant?.type !== 'reward' && data.tx) {
              // Resim yüklendiğinde complete API'sine istek at
              const img = new Image()
              img.onload = () => {
                sendCompleteRequest(data.tx)
              }
              img.src = data.variant.url
            }
          } else {
            // API response başarısız ise hata durumu
            setError(true)
            setAdData(null)
          }
        } catch (error) {
          console.error('Ad fetch error:', error)
          setError(true)
          setAdData(null)
        } finally {
          setLoading(false)
        }
      }
  
      fetchAd()
    }, [apiKey, type, category])
  
    // ESC tuşuyla popup'ı kapatma
    useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isPopupOpen) {
          setIsPopupOpen(false)
        }
      }
  
      if (isPopupOpen) {
        document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
      }
    }, [isPopupOpen])
  
    // Reward timer - 5 saniye geri sayım
    useEffect(() => {
      let interval: NodeJS.Timeout
  
      if (isRewardOpen && rewardTimer > 0) {
        interval = setInterval(() => {
          setRewardTimer((prev) => {
            if (prev <= 1) {
              setCanCloseReward(true)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
  
      return () => {
        if (interval) clearInterval(interval)
      }
    }, [isRewardOpen, rewardTimer])
  
    // Modal açıkken body scroll'unu engelle
    useEffect(() => {
      if (isRewardOpen || isPopupOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
  
      // Cleanup function - component unmount olduğunda scroll'u geri aç
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isRewardOpen, isPopupOpen])
  
    // Loading durumu
    if (loading) {
      return (
        <div className="w-[200px] h-[200px] bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      )
    }
  
    // Hata durumu - error icon göster
    if (error) {
      return (
        <div className="relative w-[200px] h-[200px] bg-red-50 border border-red-200 rounded flex items-center justify-center">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          
          {/* Sağ üst köşe - Web3 ads etiketi */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            <svg 
              className="w-3 h-3" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>web3 ads</span>
          </div>
        </div>
      )
    }
  
    // Eğer veri yoksa veya variant yoksa null return et
    if (!adData || !adData.variant) {
      return null
    }
  
    // Reward tipi için full screen modal - 5 saniye timer ile
    if (adData.variant.type === 'reward' && isRewardOpen) {
      const handleRewardClose = () => {
        if (canCloseReward) {
          // Reward reklamı kapatıldığında complete API'sine istek at
          if (adData?.tx) {
            sendCompleteRequest(adData.tx)
          }
          
          onReward?.() // Reward event'ini tetikle
          setIsRewardOpen(false)
        }
      }
  
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Siyah opak arkaplan */}
          <div className="absolute inset-0 bg-black bg-opacity-60" />
          
          {/* Reward popup içeriği */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] p-6">
            {/* Timer ve kapatma butonu */}
            <div className="absolute -top-3 -right-3 flex flex-col items-center gap-2">
              {/* Timer göstergesi */}
              {!canCloseReward && (
                <div className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {rewardTimer}s
                </div>
              )}
              
              {/* Kapatma butonu */}
              <button
                onClick={handleRewardClose}
                disabled={!canCloseReward}
                className={`w-10 h-10 text-white rounded-full flex items-center justify-center transition-colors shadow-lg ${
                  canCloseReward 
                    ? 'bg-green-500 hover:bg-green-600 cursor-pointer' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Reward Badge */}
            <div className="absolute top-4 left-4 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              REWARD
            </div>
            
            {/* Reklam resmi - img tag ile */}
            <div className="flex items-center justify-center min-h-[300px] mt-8 relative">
              {adData.variant.url ? (
                <div className="relative group cursor-pointer" onClick={() => {
                  if (adData.variant.redirectLink) {
                    window.open(adData.variant.redirectLink, '_blank')
                  }
                }}>
                  <img 
                    src={adData.variant.url}
                    alt="Reward Advertisement"
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md transition-transform hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    onLoad={(e) => {
                      console.log('Reward ad image loaded:', adData.variant.url)
                    }}
                  />
                  
                  {/* Title/Subtitle overlay - sol alt */}
                  {(adData.variant.title || adData.variant.subtitle) && (
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg max-w-[300px]">
                      {adData.variant.title && (
                        <h3 className="font-bold text-lg mb-1">{adData.variant.title}</h3>
                      )}
                      {adData.variant.subtitle && (
                        <p className="text-sm text-gray-200">{adData.variant.subtitle}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[300px] text-gray-500">
                  <p>Reward reklamı yüklenemedi</p>
                </div>
              )}
            </div>
            
            {/* Info etiketi - sağ alt */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              <svg 
                className="w-3 h-3" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>web3 ads</span>
            </div>
            
            {/* Progress bar */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-gray-200 rounded-full h-2">
                              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - rewardTimer) / 5) * 100}%` }}
              />
              </div>
              <p className="text-xs text-gray-600 mt-1 text-center bg-white">
                {canCloseReward ? 'Tap X to get the reward' : `You can earn reward after ${rewardTimer} sec...`}
              </p>
            </div>
          </div>
        </div>
      )
    }
  
    // Popup tipi için full screen modal
    if (adData.variant.type === 'popup' && isPopupOpen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Siyah opak arkaplan */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsPopupOpen(false)}
          />
          
          {/* Popup içeriği */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] p-6">
            {/* Kapatma butonu - sağ üst */}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Reklam resmi - img tag ile */}
            <div className="flex items-center justify-center min-h-[300px] relative">
              {adData.variant.url ? (
                <div className="relative group cursor-pointer" onClick={() => {
                  if (adData.variant.redirectLink) {
                    window.open(adData.variant.redirectLink, '_blank')
                  }
                }}>
                  <img 
                    src={adData.variant.url}
                    alt="Web3 Advertisement"
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md transition-transform hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    onLoad={(e) => {
                      console.log('Popup ad image loaded:', adData.variant.url)
                    }}
                  />
                  
                  {/* Title/Subtitle overlay - sol alt */}
                  {(adData.variant.title || adData.variant.subtitle) && (
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg max-w-[300px]">
                      {adData.variant.title && (
                        <h3 className="font-bold text-lg mb-1">{adData.variant.title}</h3>
                      )}
                      {adData.variant.subtitle && (
                        <p className="text-sm text-gray-200">{adData.variant.subtitle}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[300px] text-gray-500">
                  <p>Reklam yüklenemedi</p>
                </div>
              )}
            </div>
            
            {/* Info etiketi - sağ alt */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              <svg 
                className="w-3 h-3" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>web3 ads</span>
            </div>
          </div>
        </div>
      )
    }
  
    // Square tipi için 200x200 reklam
    if (adData.variant.type === 'square') {
      return (
        <div 
          className="relative w-[200px] h-[200px] bg-white border border-gray-300 rounded shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            if (adData.variant.redirectLink) {
              window.open(adData.variant.redirectLink, '_blank')
            }
          }}
        >
          {/* Reklam içeriği */}
          {adData.variant.url && (
            <img 
              src={adData.variant.url}
              alt="Advertisement"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          
          {/* Title/Subtitle overlay - sol alt */}
          {(adData.variant.title || adData.variant.subtitle) && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 text-white p-2 rounded text-xs max-w-[180px]">
              {adData.variant.title && (
                <h3 className="font-bold mb-1 text-sm leading-tight">{adData.variant.title}</h3>
              )}
              {adData.variant.subtitle && (
                <p className="text-xs text-gray-200 leading-tight">{adData.variant.subtitle}</p>
              )}
            </div>
          )}
          
          {/* Sağ üst köşe - Reklam etiketi */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            <svg 
              className="w-3 h-3" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>web3 ads</span>
          </div>
  
          {/* Hover durumunda görünecek overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )
    }
  
    // Rectangle tipi için 320x180 reklam
    if (adData.variant.type === 'rectangle') {
      return (
        <div 
          className="relative w-[320px] h-[180px] bg-white border border-gray-300 rounded shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            if (adData.variant.redirectLink) {
              window.open(adData.variant.redirectLink, '_blank')
            }
          }}
        >
          {/* Reklam içeriği */}
          {adData.variant.url && (
            <img 
              src={adData.variant.url}
              alt="Advertisement"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          
          {/* Title/Subtitle overlay - sol alt */}
          {(adData.variant.title || adData.variant.subtitle) && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 text-white p-2 rounded text-xs max-w-[280px]">
              {adData.variant.title && (
                <h3 className="font-bold mb-1 text-sm leading-tight">{adData.variant.title}</h3>
              )}
              {adData.variant.subtitle && (
                <p className="text-xs text-gray-200 leading-tight">{adData.variant.subtitle}</p>
              )}
            </div>
          )}
          
          {/* Sağ üst köşe - Reklam etiketi */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            <svg 
              className="w-3 h-3" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>web3 ads</span>
          </div>
  
          {/* Hover durumunda görünecek overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )
    }
  
    // Diğer tipler için (şimdilik boş)
    return null
  }

  export default Web3AdComponent