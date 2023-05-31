We define a curve as $p(t)$ with $p_i$ as Control points and $B_i^n(t)$ as a set of basis functions.


$$p(t)=\sum_{i=0}^n p_i B_i^n(t)$$

If we apply an affine transformation $T$

$$T(p(t))=T\left(\sum_{i=0}^n p_i B_i^n(t)\right)$$

we can use the linearity property of affine combinations

$$=\sum_{i=0}^n T(p_i) B_i^n(t)$$


which is again an affine combination of transformed control points $T(p_i)$. As the weights still sum up to 1 (Partition of unity), the curve is invariant under affine transformations.
