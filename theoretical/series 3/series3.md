# Series 3: Theoretical

## Task 1:
>  What conditions should a function satisfy in order to regularly describe an implicit surface?

The following properties should be satisfied in order for a function of the form $f(x, y, z) = 0$ to regularly describe an implicit surface:
1. The function should be continuous.
   - This is required to ensure that the surface is a well-defined, connected set.
2. The function should be differentiable.
    - This is neede to be able to calculate the normal vector of points on the surface.
3. Non-degenerate
   - The function should not evaluate to zero everywhere,

## Task 2:
> Given two circles as conic section with arbitary midpoints and radii. What is the (algebraic) sum of the two functions whose zero level sets are the conic sections?

Two circles $C_1, C_2$ can be described by the following implicit equations:
$C_i(x,y) = (x - h_i)^2 + (y - k_i)^2 - r_i^2 = 0$, with $(h_i, k_i)$ being the midpoint and $r_i$ being the radius of the circle $C_i$.

The algebraic sum of these can be found in the following way:
$C_1(x,y) + C_2(x,y) = 0 \Leftrightarrow \\
(x - h_1)^2 + (y - k_1)^2 - r_1^2 + (x - h_2)^2 + (y - k_2)^2 - r_2^2 = 0 \Leftrightarrow\\
(x^2 - 2h_1  x+{h_1}^2 + y^2 - 2k_1  y+{k_1}^2 - {r_1}^2) + (x^2 - 2h_2  x+{h_2}^2 + y^2 - 2k_2  y+{k_2}^2 - {r_2}^2) = 0 \Leftrightarrow\\
2x^2 + 2y^2 - 2(h_1+h_2)x - 2(k_1+k_2)y + {h_1}^2 + {k_1}^2 + {h_2}^2 + {k_2}^2 - {r_1}^2 - {r_2}^2 = 0
$