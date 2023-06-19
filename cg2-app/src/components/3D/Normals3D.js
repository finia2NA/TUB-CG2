import React, { useMemo } from 'react'
import Line3D from './Line3D'

const Normals3D = ({ points, normalize = true }) => {
    const normals = useMemo(() => {
        const normals = []
        for (const point of points) {
            const start = point.position;
            const end = point.position.clone().add(point.normal.clone().multiplyScalar(20))
            normals.push({ start, end })
        }
        return normals;
    }, [points])

    return (
        <>
            {normals.map((p, id) => (
                <Line3D key={id} start={p.start} end={p.end} color='red' />
            ))}
        </>
    )
}

export default Normals3D