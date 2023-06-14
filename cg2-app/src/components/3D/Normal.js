import React, {useMemo} from 'react'
import Line3D from './Line3D'

const Normal = (props) => {
    const point = props.points

    const nVector = useMemo(() => {
        const nVector = []
        for (let i = 0; i < point.normals.length; i++) {
            const start = point.normals[i][0].position;
            const end = point.normals[i][0].position.clone().add(point.normals[i][1].position.clone());
            nVector.push({ start, end })
        }
        return nVector;
      }, [point])
    
    return (
        <>
        {nVector.map((p, idx) => (
            <Line3D key={idx} start={p.start} end={p.end} color='red' />
        ))}
        </>
    )

}

export default Normal