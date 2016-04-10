# Usage #

To include a JSDot graph into your page follow these simple steps. All the necessary files are included in distributed zip file.

Copy the files in a structure like the following one:
```
scripts/jquery-1.4.2.js
scripts/jquery-ui-1.8.2.custom.min.js
scripts/jsdot-min.js
style/ui-lightness/*
style/jsdot/editor.css
style/jsdot/shapes.css
shapes.svg
mygraph.html
```

Where `mygraph.html` is the document where you want to put the graph. Notice that, whereas you are free to change the directories of the script and css (provided you change accordingly the links below), the file `shapes.svg` must always be in the same directory as your html document! (see [Issue 9 ](.md))

And add to the heading of your html document the necessary links:
```
<head>
    <link type="text/css" rel="stylesheet" href="style/ui-lightness/jquery-ui-1.8.2.custom.css"/>
    <link type="text/css" rel="stylesheet" href="style/jsdot/shapes.css"/>
    <link type="text/css" rel="stylesheet" href="style/jsdot/editor.css"/>
    <script type="text/javascript" src="scripts/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="scripts/jquery-ui-1.8.2.custom.min.js"></script>
    <script type="text/javascript" src="scripts/jsdot.min.js"></script>
    ...
</head>
```

The `style/ui-lightness` directory contains a [JQuery theme](http://jqueryui.com), which can be substituted with your own just by changing the included css.

Now we need to define a place where the graph will be drawn, and draw it!
```
<html>
<head>
    ...
    <script type="text/javascript">
        function load() {
            JSDot("mygraph", {mode: "editor", json: '{"nodes":[{"name":"n1","position":[50,50]}],"edges":[]}'});
        }
    </script>
</head>
<body onload="load()">
    ...
    <div id="mygraph" style="height:10cm; width:10cm;"></div>
    ...
</body>
</html>
```

Both `mode` and `json` are optional parameters. By using just `JSDot("mygraph")` we get an empty static view, which can then be populated through the GraphAPI.
The allowed values of `mode` are described in the following table.
| view, static (default) | The graph is shown like a picture, the only possible interaction is through the API |
|:-----------------------|:------------------------------------------------------------------------------------|
| drag                   | The elements of the graph can be selected and dragged                               |
| editor                 | Shows the toolbar and allows to edit interactively the graph.                       |

## View-only ##
If you do not need the editor but only want to visualise the graphs, and you want to minimise dependencies, here is the minimal setup.
Here is the same example as above, including only the minimum requirements.
```
<html>
<head>
    <link type="text/css" rel="stylesheet" href="style/jsdot/shapes.css"/>
    <script type="text/javascript" src="scripts/jsdot.min.js"></script>
    <script type="text/javascript">
        function load() {
            JSDot("mygraph", {json: '{"nodes":[{"name":"n1","position":[50,50]}],"edges":[]}'});
        }
    </script>
</head>
<body onload="load()">
    <div id="mygraph" style="height:10cm; width:10cm;"></div>
</body>
</html>
```
The only valid values for `mode`, in this case, are `view` (`static`) and `drag`.

# Add a View #
You can create a new view of an existing JSDot instance. This allows to create a JSDot instance without binding it to a view and adding one later, and possibly to have multiple views of the same graph.
```
var j = new JSDot();
...
j.addView("mygraph", "view");
```
Where the first argument is the id of the div where the graph will be shown, and the second argument is the `mode` and is optional.

# Import / Export #
JSDot allows to import and export a [JSON](http://json.org/) representation of a graph.
```
var json_graph = '{"nodes":[{"name":"n1","position":[50,50]}],"edges":[]}';
var j = new JSDot();
j.importJSON(json_graph);
...
json_graph = j.exportJSON();
```
The easiest way to get the JSON representation of a graph, of course, is to use the JSDot Editor. The _Edit JSON_ button in the edit dialog allows to edit, copy and paste the JSON representation of a graph.

# Changing a Graph #
## Getting to the graph ##
```
var j = new JSDot();
var g = j.getGraph();
```
Through `g` we can now make changes to the graph.

## Nodes ##
```
var n = g.createNode(name);
```
`n` is now a new node inside the graph. `name` is optional, but if given it must be a string

## Edges ##