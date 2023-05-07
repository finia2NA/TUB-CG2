import { useEffect, useMemo } from "react";
import { KDTreePointDataStructure, kdTreeNode } from "../../model/pointDataStructures";
import Plane3D from "./Plane3D";




const KDVisualizer = (props) => {



  const nodes = useMemo(() => {
    if (!props.points.root) return;
    if (!(props.points instanceof KDTreePointDataStructure)) return;

    const treeRoot = props.points.root;

    const myNodes = [];

    const recursiveNodeFinder = (node, depthToGo) => {

      // guards: return if...
      //.. we have reachted the desired depth
      if (depthToGo === 0) return;
      //.. we have reached a leaf node that does no slice through space
      if (!node.leftChildren && !node.rightChildren) return;

      myNodes.push(node);

      recursiveNodeFinder(node.leftChildren, depthToGo - 1);
      recursiveNodeFinder(node.rightChildren, depthToGo - 1);

    }
    recursiveNodeFinder(treeRoot, props.displayDepth);
    return myNodes;

  }, [props.displayDepth, props.points])



  return (
    <>
      {nodes && nodes.map((node, index) => {
        return (
          console.log(node),
          <Plane3D axis={node.axis} position={node.point.position.toArray()} key={index} />
        )
      }
      )}
    </>

  )
}

export default KDVisualizer;