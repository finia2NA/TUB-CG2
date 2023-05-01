# Exercise Sheet 1

## Theoretical Tasks

### Task 1
It is possible to find the median of a set in linear time for the average case using the *quickselect* with $k=n/2$

0. Suppose we have a list of length $n$, and are looking for the $k$-th element
1. If the length of the list is 1, return the list element as the median.
2. Pick an index from the list at random. The element at this position is called the **pivot**
3. Create 2 lists, *lesser_piv* and *greater_piv*.  
  - Elements less than or equal to the pivot go in *lesser_piv*
  - Elements strictly greater than the pivot go in *great_piv*
4. Distinguish between the following cases
 - If **lesser_piv** contains more than $k$ elements, go to line 1, with $list = lesser\_piv$ and $k=k$.
 - if **greater_piv** contains more than $k$ elements, go to line 1, with $list = greater\_piv$ and $k=k-len(lesser\_piv)$

This algorithm executes in $O(n)$ in the average case. The reason for this is that, assuming the average randomly chosen pivot halves the size of the list that is being searched each iteration, each recursion operates on a list takes half as long as the previous one. Thus, the runtime is

$$C = n + \frac{1}{2}n + \frac{1}{4}n +\frac{1}{8}n + \dots$$

However, in the *extremely* unlucky worst case that the pivot point is chosen in a way that $len(lesser\_piv)=1, len(greater\_piv)=n-1$, the algorithm woult take $n+n-1+n-2\dots = O(n^2)$
<!-- TODO: check this -->