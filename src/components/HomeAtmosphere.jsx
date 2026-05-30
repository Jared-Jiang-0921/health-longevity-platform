import { useScrollParallax } from '../hooks/useScrollParallax'
import './HomeAtmosphere.css'

const LAYERS = [
  {
    id: 'dna',
    src: '/images/atmosphere/dna-helix.svg',
    className: 'home-atmo home-atmo--dna',
    rate: 0.035,
    floatClass: 'home-atmo-float--slow',
  },
  {
    id: 'cells',
    src: '/images/atmosphere/cell-network.svg',
    className: 'home-atmo home-atmo--cells',
    rate: 0.045,
    floatClass: 'home-atmo-float--medium',
  },
  {
    id: 'neurons',
    src: '/images/atmosphere/neuron-network.svg',
    className: 'home-atmo home-atmo--neurons',
    rate: 0.04,
    floatClass: 'home-atmo-float--fast',
  },
]

function AtmoLayer({ layer }) {
  const parallaxRef = useScrollParallax(layer.rate)

  return (
    <div ref={parallaxRef} className={layer.className} aria-hidden="true">
      <div className={layer.floatClass}>
        <img src={layer.src} alt="" decoding="async" draggable={false} />
      </div>
    </div>
  )
}

export default function HomeAtmosphere() {
  return (
    <div className="home-atmosphere" aria-hidden="true">
      {LAYERS.map((layer) => (
        <AtmoLayer key={layer.id} layer={layer} />
      ))}
    </div>
  )
}
