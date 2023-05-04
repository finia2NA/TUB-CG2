

# CG2: Sheet 1 


## Exercise 2: Theory

### a) Median of n numbers

...

### b) Max. depth of Octree

...


### c) K-nearest neighbor in linear runtime

In a worst-case scenario, the search performance of k-nearest neighbor search for all spatial data structures can lead to $O(n)$ runtime complexity. This is the case, when:

- *Grid* has highly uneven data distribution
- *Octree* is highly imbalanced 
- *KD-tree* is highly imbalanced 

For example all data points $p_i$ are arranged in a straight line, where the trees collapse into a linked list. Searching for the point $q$ at the end of the line will result in $O(n)$ complexity.








---
*Group 6: Chanyoung Kim, Jiyun Park, Duc Thinh Nguyen,   Richard Hanß*
