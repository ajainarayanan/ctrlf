var ctrlf = require("../ctrlf.js"),
    data = require("./ctrlf-data.js"),
    $ = require("jquery"),
    util = require("../utility.js")(),
    draw = require("./draw.js"),
    eventsArray = [],
    processedEventsArray = [],
    objCache = {};

module.exports = demo();

function demo() {
  var c1 = new ctrlf();
  setEventListeners(c1);
  c1.setDomain("Mississippi");
  $("button[data-domain-submit='crunchButton']").on("click", function() {
    c1.reset();
    eventsArray = [];
    c1.setDomain($("textarea[data-text-area='inputDomain']").val());
  });

}

function setEventListeners(suffixtree) {

  suffixtree.on("Preprocessing", function () {
    $(".message-board .message-wrapper").html("<div>Starting to process the text</div>");
  });
  suffixtree.on("PreProcessingWord", function (word, obj) {
    pushEvent("Processing word: " + word, word, obj);
  });
  suffixtree.on("MatchAtTopLevel", function (match, obj) {
    pushEvent("Match for the character: " + match, match, obj);
  });
  suffixtree.on("CommonPart", function (split) {
    pushEvent("Common character(s) between current input and existing tree: " + split, split);
  });
  suffixtree.on("SplitInCurrentTreeValue", function(split) {
    pushEvent("Split in the current tree value: " + split, split);
  })
  suffixtree.on("SplitInProcessingWord", function(split, obj) {
    pushEvent("Split in the current processing word: " + split, split);
  })

  suffixtree.on("NoMatchAtTopLevel", function(word, obj) {
    pushEvent("No Match for the character: " + word, word, obj);
  });

  $("[data-button-id='play-button']").on("click", playButtonClickHandler);
  $("[data-button-id='prev-button']").on("click", prevButtonClickHandler);
}

function pushEvent(message, word, obj) {
  eventsArray.push({
    data: {
      treeObj: obj || null,
      word: word
    },
    message: message
  });
}

function scrollToBottomOfMessageBoard() {
  $(".message-board .message-wrapper")[0].scrollTop = $(".message-board .message-wrapper")[0].scrollHeight;
}

function playButtonClickHandler(e) {
  var eventObj;
  eventObj = eventsArray[0];
  if (eventsArray.length <= 0) {
    return;
  }
  objCache = eventObj.data.treeObj || objCache;
  processedEventsArray.push(eventsArray.shift());
  if (eventObj.data) {
    processAndDraw(util.objClone(eventObj.data.treeObj || objCache));
  }
  $(".message-board .message-wrapper").append($("<div></div>", {
    text: eventObj.message
  }));
  scrollToBottomOfMessageBoard();
}

function prevButtonClickHandler(e) {
  var eventObj;
  eventObj = processedEventsArray[processedEventsArray.length -1]
  if (processedEventsArray.length <= 0) {
    return;
  }
  objCache = eventObj.data.treeObj || objCache;
  eventsArray.unshift(processedEventsArray.pop());
  if (eventObj.data) {
    processAndDraw(util.objClone(eventObj.data.treeObj || objCache));
  }
  $(".message-board .message-wrapper div:last").fadeOut(300, function() {
    $(this).remove();
    scrollToBottomOfMessageBoard();
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
  if (!obj) {
    return retArr;
  }
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
