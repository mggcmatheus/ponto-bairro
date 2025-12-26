"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

interface MapaEditorProps {
  latitude: number
  longitude: number
  onLocationChange: (lat: number, lng: number) => void
}

function LocationMarker({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      onLocationChange(lat, lng)
    },
  })

  return null
}

export function MapaEditor({ latitude, longitude, onLocationChange }: MapaEditorProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[latitude, longitude]}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target
            const position = marker.getLatLng()
            onLocationChange(position.lat, position.lng)
          },
        }}
      />
      <LocationMarker onLocationChange={onLocationChange} />
    </MapContainer>
  )
}

