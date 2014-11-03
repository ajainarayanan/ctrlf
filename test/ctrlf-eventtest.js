var mocha =  require("mocha");
var assert = require("should");

var ctrlf = require("./ctrlf");
var testdata = require("./testdata.js");
var mdata = require("./mississippidata.js");

before(function() {
  suffixtree = new ctrlf();

  suffixtree.on("Preprocessing", function () {
    console.log(" 'Preprocessing'");
  });
  suffixtree.on("PreProcessingWord", function (word) {
    console.log(" 'PreProcessingWord': ", word);
  });
  suffixtree.on("MatchAtTopLevel", function (match) {
    console.log(" 'MatchAtTopLevel'", match);
  });
  suffixtree.on("CommonPartContinues", function (commonpart) {
    console.log(" 'CommonPartContinues'", commonpart);
  });
  suffixtree.on("CommonPart", function (split) {
    console.log(" 'CommonPart'", split);
  });
  suffixtree.on("SplitInCurrentTreeValue", function(split) {
    console.log(" 'SplitInCurrentTreeValue'", split);
  })
  suffixtree.on("SplitInProcessingWord", function(split) {
    console.log(" 'SplitInProcessingWord'", split);
  })
  suffixtree.on("CommonStringInWordSecondSplit", function(split) {
    console.log(" 'CommonStringInWordSecondSplit'", split);
  })
  suffixtree.on("NoMatchAtTopLevel", function(word) {
    console.log(" 'NoMatchAtTopLevel'", word);
  })
});

describe("Should Emit proper events to understand how it works", function() {

  it("Initial Test for emitting any event", function() {
      suffixtree.setDomain("mississippi");
      ["pi"].should.eql(suffixtree.find("pi"));
  })
});
