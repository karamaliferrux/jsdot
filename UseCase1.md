# Assumptions #

Let's say we have a string `dot` containing the DOT representation of a graph.

We use the `jsdot` library to produce a SVG image.


# M.O. #

```
var dot = "graph graphname { a -- b }";
graph = jsdot.newGraph("div");
graph.fromDOT(dot);
```