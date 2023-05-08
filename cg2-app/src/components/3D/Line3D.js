import React, { useLayoutEffect, useRef } from 'react'

function Line3D({ start, end, color = "skyblue" }) {
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints([start, end])
  }, [start, end])
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </line>
  )
}

export default Line3D

