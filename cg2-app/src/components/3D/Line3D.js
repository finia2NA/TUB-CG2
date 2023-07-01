import React, { useLayoutEffect, useRef } from 'react'

function Line3D({ start, end, color = "skyblue", opacity = 1 }) {
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints([start, end])
  }, [start, end])
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} opacity={opacity} />
    </line>
  )
}

export default Line3D

