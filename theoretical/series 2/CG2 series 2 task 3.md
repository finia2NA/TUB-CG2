## Task 3
The order in which the casteljau algorithm is evaluated does matter for the performance of getting the desired point.

Casteljau can be defined by the following pseudocode:
```python
def deCasteljau(points, t):
    n = len(points) - 1
    b = points.copy()
    for step in range(n):
        for i in range(n - step):
            b[i] = (1 - t) \cdot b[i] + t \cdot b[i + 1]
    return b[0]
```
As can be seen, for every iteration of the outer loop, 2 multiplications and one addition is performed for every point in the inner loop. The outer loop is run `n=length(points)-1` times. Thus, in total
$n\cdot(n-0)\cdot(n-1)\cdot(n-2)\dots = \frac{n\cdot(n-1)}{2}$ additions and $2 \cdot \frac{n\cdot(n-1)}{2}$ multiplications are performed in one execution of deCasteljau. This is both $O(n^2)$.

When faced with a grid of dimensions $n \times m$, a point can be computed by choosing a first axis $a$ and a second axis $b$. Then, deCasteljau needs to be computed $a$ times on a curve of $b$ points first, and then deCasteljau is computed once again on the $a$ resulting control points. In total,
$a \cdot \frac{b\cdot(b-1)}{2} + \frac{a\cdot(a-1)}{2}$ additions and $2 \cdot (a \cdot \frac{b\cdot(b-1)}{2} + \frac{a\cdot(a-1)}{2})$ multiplications are performed in this process.

As can be seen, the deCasteljau algorithm gets executed more often on points on the $b$ axis. It is thus adviseable to choose the $b$ axis as the axis with less points when using a non-square control grid.

Additionally, since the final step of the deCasteljau algorithm can be used to compute a normal value, if only the normal value in one dimension is to be computed, the algorithm should be used so that axis is chosen as $a$.