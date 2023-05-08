import { useMemo } from "react";
import { KDTreePointDataStructure } from "../../model/pointDataStructures";
import Plane3D from "./Plane3D";

export class LimitedNode {
  constructor(node, limits) {
    this.node = node;
    this.limits = limits;
  }
}

const KDVisualizer = (props) => {

  const nodes = useMemo(() => {
    if (!props.points.root) return;
    if (!(props.points instanceof KDTreePointDataStructure)) return;

    const treeRoot = props.points.root;
    console.log(treeRoot)

    const result = [];

    const recursiveNodeFinder = (node, depthToGo, limits) => {
      // guards: return if...
      //.. we have reachted the desired depth
      if (depthToGo === 0) return;
      //.. we have reached a leaf node that does no slice through space
      if (!node.leftChildren && !node.rightChildren) return;

      result.push(new LimitedNode(node, limits));

      const leftLimits = limits.map(a => a.slice())
      leftLimits[node.axis][0] = node.point.position.toArray()[node.axis];

      const rightLimits = limits.map(a => a.slice())
      rightLimits[node.axis][1] = node.point.position.toArray()[node.axis];

      recursiveNodeFinder(node.leftChildren, depthToGo - 1, leftLimits);
      recursiveNodeFinder(node.rightChildren, depthToGo - 1, rightLimits);

    }


    const limits = [[-100, 100], [-100, 100], [-100, 100]]

    recursiveNodeFinder(treeRoot, props.displayDepth, limits);
    console.log(result)
    return result.map(node => node.node)

  }, [props.displayDepth, props.points])



  return (
    <>
      {nodes && nodes.map((node, index) => {
        return (
          <Plane3D axis={node.axis} position={node.point.position.toArray()} key={index} />
        )
      }
      )}
    </>

  )
}

export default KDVisualizer;