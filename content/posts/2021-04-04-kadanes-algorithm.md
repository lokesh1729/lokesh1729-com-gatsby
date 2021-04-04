---
template: post
title: Kadane's algorithm
slug: kadane-algorithm
socialImage: /media/kadane-s-algorithm.png
draft: true
date: 2021-04-04T06:26:11.924Z
description: kadane's algorithm aims to find maximum sub-array sum
category: coding
tags:
  - algorithms
  - coding interviews
---
## Kadane's algorithm



Hello everyone! in this post, we'll discuss about kadane's algorithm. I'll try to keep it as simple as possible. The goal of this algorithm is to find a maximum value of sub-array sum. Let's take an example to understand.

`arr = [7,2,-1,-3,9]`

the maximum sub array sum is = 7+2-1-3+9 = 14

How do we find this ? well, the naive approach is to get all sub-array sum and find the maxmium.

Let's say we have an array \[a1, a2, a3, a4]

We'll start with a1 and find all the different sub-arrays

 **a1                                 a2                            a3**

a1+a2                      a2+a3                     a3+a4

a1+a2+a3                a2+a3+a4

a1+a2+a3+a4

Now, we get maximum of all i.e. max(a1+a2, a1+a2+a3, a1+a2+a3+a4, a2+a3, a2+a3+a3, a3+a4)

Well, this works but let's analyze the time complexity. The pseudo code looks like this

```
result = -infinity
for i 0...n
    for j in i+1...n
       result = max(result, a[i] + a[j])
return result
```

This will give O(n^2) time complexity.

Let's see how we can optimize this

![overlapping sub-problems](/media/overlapping_subproblems.png "overlapping sub-problems")

From the above image, we see that there are repeated computations i.e. **overlapping sub-problems**. If we find the maximum of a1+a2 and a1+a2+a3 gives solution for a sub-problem. We can prove the fact by induction that when combining solutions of all sub-problems will give the overall solution i.e. **optimal sub-structure**. 

From these two facts, we can say that we're using dynamic programming approach.

The idea is find maximum of all nested sub-problems eventually we'll reach the solution.

![image showing finding optimal solution by finding maximum of all sub-problems](/media/optimal_solution.png "find maximum of sub-problem recursively to reach optimized solution")

As depicted in the above image it is very clearer that `max(a1+a2, a1+a2+a3)` gives local maximum when we do this for all sub-problems we'll get the global maximum.

Let's write code

```python
def find_max_sub_array_sum(arr):
  local_max = arr[0]
  global_max = float('-inf')
  for i in range(1,n):
    local_max = max(local_max, arr[i] + local_max)
    global_max = max(local_max, global_max)
  return global_max
```