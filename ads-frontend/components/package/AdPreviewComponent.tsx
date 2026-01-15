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
}

interface AdPreviewComponentProps {
  id: string | number
  type: string
}

function AdPreviewComponent({ id, type }: AdPreviewComponentProps) {
  const [adData, setAdData] = useState<AdResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isRewardOpen, setIsRewardOpen] = useState(false)
  const [rewardTimer, setRewardTimer] = useState(15)
  const [canCloseReward, setCanCloseReward] = useState(false)

  useEffect(() => {
    async function fetchAd() {
      try {
        setLoading(true)
        setError(false)
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publisher/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type })
        })

        if (response.ok) {
          const data: AdResponse = await response.json()
          
          if (data && typeof data === 'object' && 'display' in data && data.display === false) {
            setError(true)
            setAdData(null)
            return
          }
          
          setAdData(data)
          
          // Popup type için otomatik açılma
          if (data.variant?.type === 'popup') {
            setIsPopupOpen(true)
          }
          
          // Reward type için otomatik açılma
          if (data.variant?.type === 'reward') {
            setIsRewardOpen(true)
            setRewardTimer(15)
            setCanCloseReward(false)
          }
        } else {
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
  }, [id, type])

  // Reward timer
  useEffect(() => {
    if (isRewardOpen && rewardTimer > 0) {
      const timer = setTimeout(() => {
        setRewardTimer(prev => prev - 1)
        if (rewardTimer === 1) {
          setCanCloseReward(true)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isRewardOpen, rewardTimer])

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isPopupOpen) setIsPopupOpen(false)
        if (isRewardOpen) setIsRewardOpen(false)
      }
    }

    if (isPopupOpen || isRewardOpen) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [isPopupOpen, isRewardOpen])

  // Loading durumu
  if (loading) {
    return (
      <div className="w-[200px] h-[200px] bg-slate-800 border border-slate-600 rounded flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    )
  }

  // Hata durumu
  if (error) {
    return (
      <div className="w-[200px] h-[200px] bg-slate-800 border border-slate-600 rounded flex items-center justify-center">
        <div className="text-slate-400 text-sm">Ad not available</div>
      </div>
    )
  }

  // Veri yoksa
  if (!adData || !adData.variant) {
    return (
      <div className="w-[200px] h-[200px] bg-slate-800 border border-slate-600 rounded flex items-center justify-center">
        <div className="text-slate-400 text-sm">No ad data</div>
      </div>
    )
  }

  // Reward popup - en yüksek z-index
  if (adData.variant.type === 'reward' && isRewardOpen) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black bg-opacity-80" />
        
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] p-6 overflow-hidden">
          {/* Timer ve kapatma */}
          <div className="absolute -top-3 -right-3 flex flex-col items-center gap-2">
            {!canCloseReward && (
              <div className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {rewardTimer}s
              </div>
            )}
            
            <button
              onClick={() => setIsRewardOpen(false)}
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
          
          {/* Reklam resmi */}
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
                />
                
                {/* Title/Subtitle overlay */}
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
                <p>Reward ad could not be loaded</p>
              </div>
            )}
          </div>
          
          {/* Info etiketi */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>web3 ads</span>
          </div>
          
          {/* Progress bar */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((15 - rewardTimer) / 15) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1 text-center bg-white">
              {canCloseReward ? 'Click X to get reward!' : `Reward available in ${rewardTimer} seconds...`}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Popup - en yüksek z-index
  if (adData.variant.type === 'popup' && isPopupOpen) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsPopupOpen(false)} />
        
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] p-4 md:p-6 overflow-hidden">
          {/* Kapatma butonu */}
          <button
            onClick={() => setIsPopupOpen(false)}
            className="absolute top-2 right-2 md:-top-3 md:-right-3 w-8 h-8 md:w-10 md:h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 shadow-lg"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Reklam resmi */}
          <div className="flex items-center justify-center min-h-[200px] md:min-h-[300px] relative mt-4">
            {adData.variant.url ? (
              <div className="relative group cursor-pointer w-full h-full flex items-center justify-center" onClick={() => {
                if (adData.variant.redirectLink) {
                  window.open(adData.variant.redirectLink, '_blank')
                }
              }}>
                <img 
                  src={adData.variant.url}
                  alt="Web3 Advertisement"
                  className="max-w-full max-h-[60vh] md:max-h-[75vh] object-contain rounded-lg shadow-md transition-transform hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                
                {/* Title/Subtitle overlay */}
                {(adData.variant.title || adData.variant.subtitle) && (
                  <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-black bg-opacity-80 text-white p-2 md:p-3 rounded-lg max-w-[250px] md:max-w-[300px]">
                    {adData.variant.title && (
                      <h3 className="font-bold text-sm md:text-lg mb-1 leading-tight">{adData.variant.title}</h3>
                    )}
                    {adData.variant.subtitle && (
                      <p className="text-xs md:text-sm text-gray-200 leading-tight">{adData.variant.subtitle}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[200px] md:min-h-[300px] text-gray-500">
                <p className="text-sm md:text-base">Ad could not be loaded</p>
              </div>
            )}
          </div>
          
          {/* Info etiketi */}
          <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>web3 ads</span>
          </div>
        </div>
      </div>
    )
  }

  // Normal ad preview (square, rectangle) - bunlar eski component'te kalsın
  if (adData.variant.type === 'square' || adData.variant.type === 'rectangle') {
    return null
  }

  // Diğer tipler için de null
  return null
}

export default AdPreviewComponent
