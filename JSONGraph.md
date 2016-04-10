# Introduction #

This shall be able to include any DOT representation.

DOT is powerful enough to describe anything we may ever want to represent.
Still we want to attach event handlers to nodes and edges, **should they be part of the graph?**


# Details #
```
graph = {
  name,      // string
  nodes,     // array(node)
  edges,     // array(edge)
  directed,  // bool
  attributes // object(attribute)
};

node: {
  name,      // string
  attributes // object(attribute)
};

edge: {
  src,       // string
  dst,       // string
  attributes // object(attribute)
};

attribute: {
  label,     // string
  color,     // string
  style,     // string (dotted, dashed, solid)
  pos        // string "x,y"
};
```

# See also #
  * [DOT references](Bibliography#DOT.md)
    * in particular [attributes](http://www.graphviz.org/doc/info/attrs.html)