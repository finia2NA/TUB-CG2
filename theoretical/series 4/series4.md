# Series 4
Group 6

## Tasks 1:
> Describe two methods to approximate vertex normals of triangle meshes and discuss their advantages and disadvantages.

Vertex normals in a triangle mesh can be approximated a number of ways. Two common ones are:
### Flat shading normals
In this method, the normal of each vertex is the same as the normal of the triangle it belongs to. After computing the normal of a triangle by taking the normalized cross product of two of its edges, this can then be applied to the vertices of the triangle.

Advantages
- The fastest method of computing normals
  
Disadvantages
- When used in shading, the resulting mesh will look faceted, as the normals are constant across each triangle
- Vertices that are shared by multiple triangles will have different normals depending on the context of the triangle they are in.

### Smooth shading normals
In this method, the normals of faces are still calculated as in flat shading, but vertex normals are calculated by averaging the normals of the faces that share that vertex. This may be done in combination with weighing, for example by size of the triangles or their angle incident to the vertex.

Advantages
  - In display, the resulting mesh will look smooth, as the normals are interpolated across each triangle
  - One normal per vertex, regardless of the number of triangles that share it

Disadvantages
  - Slower than flat shading, as it requires averaging and weighting.

We have implemented this method in practical part 1.

## Task 3:
![Alt text](<Task 3.jpg>)