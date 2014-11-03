var d3 = require("d3");
var $ = require("jquery");
module.exports = draw;

function draw(treeData) {
  var svg,
      margin = {
        top: 40,
        right: 120,
        bottom: 20,
        left: 120
      },
      width = 1000,// - margin.right - margin.left,
      height = 1000;// - margin.top - margin.bottom;


  var tree = d3.layout.tree()
                .size([height, width]);

  var diagonal = d3.svg.diagonal()
                    .projection(function(d) {
                      return [d.x, d.y];
                    });


  if ($("body div.tree-container svg").length > 0) {
    root = treeData[0];
    svg = d3.select("body div.tree-container svg g");
    update(root, tree, svg, diagonal);
  } else {
    svg = d3.select("body div.tree-container").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    root = treeData[0];
    update(root, tree, svg, diagonal);
  }


}

function update(source, tree, svg, diagonal) {
  var i = 0;
  // Compute the new tree layout.
  var nodes = tree.nodes(source).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 100; });

  // Declare the nodes…
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

// D3 Enter stage
  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
                      .attr("class", "node")
                      .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                      });

  nodeEnter.append("circle")
            .attr("r", 10)
            .style("fill", "#fff");

  // Enter the text
  nodeEnter.append("text")
          .attr("y", function(d) {
            return d.children || d._children ? -18 : 18;
          })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1);

  // Declare the links…
  var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
              .attr("class", "link")
              .attr("d", diagonal);


  // D3 Update stage
  var nodeUpdate = node.transition()
      .duration(750)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  // Update node
  nodeUpdate.select("circle")
      .attr("r", 10)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  // Update Text
  nodeUpdate.select("text")
      .attr("y", function(d) {
        return d.children || d._children ? -18 : 18;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1);

  // Update Links
  link.transition()
      .duration(750)
      .attr("class", "link")
      .attr("d", diagonal);

  // D3 Exit stage
  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(750)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);


  link.exit().transition()
      .duration(650)
      .remove();


}
