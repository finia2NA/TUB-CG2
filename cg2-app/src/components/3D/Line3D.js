import * as THREE from 'three'
import React, { useLayoutEffect, useRef, useState } from 'react'

function Line3D({ start, end }) {
    const ref = useRef()
    useLayoutEffect(() => {
      ref.current.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)))
    }, [start, end])
    return (
      <line ref={ref}>
        <bufferGeometry />
        <lineBasicMaterial color="skyblue" />
      </line>
    )
  }

export default Line3D

