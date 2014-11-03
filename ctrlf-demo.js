var ctrlf = require("../ctrlf.js"),
    data = require("./ctrlf-data.js"),
    $ = require("jquery"),
    draw = require("./draw.js");

module.exports = demo();

function demo() {
  var c1 = new ctrlf();
  c1.setDomain("Mississippi");


  $("button[data-domain-submit='crunchButton']").on("click", function() {
    c1.reset();
    c1.setDomain($("textarea[data-text-area='inputDomain']").val());
    processAndDraw(c1);
  });

  processAndDraw(c1);
}

function processAndDraw(c1) {
  var treeData = massage(c1.sftree, null);
  treeData = [{
      name: "root",
      value: "root",
      children: treeData
  }];
  draw(treeData);
}

function massage(obj, root) {
  var retArr = [];
  Object.keys(obj).forEach(function(item) {
    var mobj = $.extend( obj[item], {
        name: obj[item].value,
        parent: root,
        children: massage(obj[item].children, obj[item].name)
     });
     retArr.push(mobj);
  }.bind(this));
  return retArr;
}
