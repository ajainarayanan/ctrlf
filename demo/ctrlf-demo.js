var ctrlf = require("../ctrlf.js"),
    data = require("./ctrlf-data.js"),
    $ = require("jquery"),
    draw = require("./draw.js");

module.exports = demo();

function demo() {
  var c1 = new ctrlf();
  setEventListeners(c1);
  c1.setDomain("Mississippi");
  $("button[data-domain-submit='crunchButton']").on("click", function() {
    c1.reset();
    c1.setDomain($("textarea[data-text-area='inputDomain']").val());
  });

}

function setEventListeners(suffixtree) {
  var eventsArray = [],
      processedEventsArray = [];

  suffixtree.on("Preprocessing", function () {
    $(".message-board").html("<div>Starting to process the text</div>");
  });
  suffixtree.on("PreProcessingWord", function (word, obj) {
    eventsArray.push({
      data: obj,
      message: "<div>Processing word: " + word + "</div>"
    });
  });
  suffixtree.on("MatchAtTopLevel", function (match, obj) {
    eventsArray.push({
      data: obj,
      message: "<div> Match for the character: " + match + "</div>"
    });
  });
  suffixtree.on("CommonPart", function (split, obj) {
    eventsArray.push({
      data: obj,
      message: "<div>Common character(s) between current input and existing tree: "
                + split
                + "</div>"
    });
  });
  suffixtree.on("SplitInCurrentTreeValue", function(split, obj) {
    eventsArray.push({
      data: obj,
      message: "<div>Split in the current tree value: " + split + "</div>"
    });
  })
  suffixtree.on("SplitInProcessingWord", function(split) {
    eventsArray.push({
      data: null,
      message: "<div>Split in the current processing word: " + split + "</div>"
    })
  })

  suffixtree.on("NoMatchAtTopLevel", function(word, obj) {
    eventsArray.push({
      data: obj,
      message: "<div> No Match for the character: " + word + "</div>"
    });
  });

  $("[data-button-id='play-button']").on("click", function(e) {
    var eventObj = (eventsArray.length > 0 ? eventsArray[0] : {});
    processedEventsArray.push(eventsArray.shift());
    if (eventObj.data) {
      processAndDraw(eventObj.data);
    }
    $(".message-board").append(eventObj.message);
  });
  $("[data-button-id='prev-button']").on("click", function(e) {
    var eventObj = (processedEventsArray.length > 0 ? processedEventsArray[processedEventsArray.length -1] : {});
    eventsArray.unshift(processedEventsArray.pop());
    if (eventObj.data) {
      processAndDraw(eventObj.data);
    }
    $(".message-board:last").fadeOut();
  });
}

function processAndDraw(sftree) {
  var treeData = massage(sftree, null);
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
        children: massage(obj[item].children || {}, obj[item].name)
     });
     retArr.push(mobj);
  }.bind(this));
  return retArr;
}
