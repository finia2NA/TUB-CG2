import React, { useMemo } from "react";
import { KDTreePointDataStructure } from "../../model/pointDataStructures";
import Plane3D from "./Plane3D";

export class LimitedNode {
  constructor(node, limits) {
    this.node = node;
    this.limits = limits;
  }
}

const logging = false;

const KDVisualizer = (props) => {

  const nodes = useMemo(() => {
    if (!props.points.root) return;
    if (!(props.points instanceof KDTreePointDataStructure)) return;

    const treeRoot = props.points.root;

    const result = [];

    const recursiveNodeFinder = (node, depthToGo, limits) => {
      // guards: return if...
      //.. we have reachted the desired depth
      if (depthToGo === 0) return;

      result.push(new LimitedNode(node, limits));

      const rightLimits = limits.map(a => a.slice()) // this is a deep copy of the array
      rightLimits[node.axis][0] = node.point.position.toArray()[node.axis];

      const leftLimits = limits.map(a => a.slice()) // this is a deep copy of the array
      leftLimits[node.axis][1] = node.point.position.toArray()[node.axis];

      if (node.leftChildren)
        recursiveNodeFinder(node.leftChildren, depthToGo - 1, leftLimits);
      if (node.rightChildren)
        recursiveNodeFinder(node.rightChildren, depthToGo - 1, rightLimits);

    }

    const limits = new Array(3).fill([-7, 7])

    recursiveNodeFinder(treeRoot, props.displayDepth, limits);
    if (logging) console.log(result)
    return result

  }, [props.displayDepth, props.points])

  return (
    <>
      {nodes && nodes.map((node, index) => {
        return (
          <Plane3D axis={node.node.axis} position={node.node.point.position.toArray()} limits={node.limits} key={index} />
        )
      }
      )}
    </>

  )
}

export default KDVisualizer;