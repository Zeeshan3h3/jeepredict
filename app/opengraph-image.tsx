import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'JEEPredict 2026 — Free JEE Advanced Rank Predictor'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:           '100%',
          height:          '100%',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          backgroundColor: '#0F1B4C',
          padding:         '60px',
          fontFamily:      'sans-serif'
        }}
      >
        {/* Top badge */}
        <div style={{
          backgroundColor: 'rgba(255,107,53,0.2)',
          border:          '1px solid rgba(255,107,53,0.4)',
          borderRadius:    '100px',
          padding:         '8px 20px',
          color:           '#FF6B35',
          fontSize:        '18px',
          fontWeight:      600,
          marginBottom:    '24px',
          display:         'flex',
        }}>
          🎓 JEE Advanced 2026 — Free Tool
        </div>

        {/* Main headline */}
        <div style={{
          fontSize:    '72px',
          fontWeight:  900,
          color:       'white',
          textAlign:   'center',
          lineHeight:  1.1,
          marginBottom: '20px',
          display: 'flex',
          gap: '16px'
        }}>
          Predict Your
          <span style={{ color: '#FF6B35' }}>IIT Rank</span>
          Instantly
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize:    '28px',
          color:       'rgba(255,255,255,0.6)',
          textAlign:   'center',
          maxWidth:    '800px',
          lineHeight:  1.4,
          marginBottom: '40px',
          display:     'flex'
        }}>
          Enter your marks → Get your rank + IIT, NIT & IIIT 
          college matches. Based on 2025 JoSAA data.
        </div>

        {/* Three stat pills */}
        <div style={{
          display:    'flex',
          gap:        '16px'
        }}>
          {['✓ 100% Free', '✓ No Login', '✓ 2025 JoSAA Data'].map(
            text => (
              <div
                key={text}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border:          '1px solid rgba(255,255,255,0.2)',
                  borderRadius:    '100px',
                  padding:         '10px 24px',
                  color:           'rgba(255,255,255,0.8)',
                  fontSize:        '20px',
                  display:         'flex'
                }}
              >
                {text}
              </div>
            )
          )}
        </div>

        {/* Bottom URL */}
        <div style={{
          position:  'absolute',
          bottom:    '40px',
          color:     'rgba(255,255,255,0.3)',
          fontSize:  '18px',
          display:   'flex'
        }}>
          jeepredict.in
        </div>
      </div>
    ),
    { ...size }
  )
}
