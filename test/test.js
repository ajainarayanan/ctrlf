var mocha =  require("mocha");
var assert = require("should");
var mdata = require("./mississippidata.js");

var utility = require("../utility")();
var ctrlf = require("../ctrlf");
var testdata = require("./testdata.js");

var utiltest = require("./utiltest");
var suffixtree;

before(function() {
  suffixtree = new ctrlf();
});
describe("Tests related to Suffix Tree", function () {
  it("Preprocessing: Case 1 - Having same repeating characters", function (){
    suffixtree.setDomain("ppi");
    suffixtree.sftree.should.eql({
      i: {
        value: "i",
        children: {}
      },
      p: {
        value: "p",
        children: {
          p: {
            value: "pi",
            children: {}
          },
          i: {
            value: "i",
            children: {}
          }
        }
      }
    });
  });

  it("Preprocessing: Case 1.1 - Having same repeating characters version2", function (){
    suffixtree.reset();
    suffixtree.setDomain("ippi");
    suffixtree.sftree.should.eql({
      i: {
        value: "i",
        children: {
          p: {
            value: "ppi",
            children: {}
          }
        }
      },
      p: {
        value: "p",
        children: {
          p: {
            value: "pi",
            children: {}
          },
          i: {
            value: "i",
            children: {}
          }
        }
      }
    })

  });

  it("Preprocessing: Case 1.2 - Works on one full word", function() {
    suffixtree.reset();
    suffixtree.setDomain("mississippi");
    suffixtree.sftree.should.eql(mdata);
  });

});

describe("Tests for querying suffix tree", function() {
  it("Find one match", function() {
    suffixtree.reset();
    suffixtree.setDomain("mississippi");
    ["pi"].should.eql(suffixtree.find("pi"));
  });

  it("Find three matches", function() {
    ["ssi", "ssippi", "ssissippi"].should.eql(suffixtree.find("ssi"));
  });

  it("Find multiple matches", function() {
    ["s", "si", "sippi", "sissippi", "ssi", "ssippi", "ssissippi"].should.eql(suffixtree.find("s"));
  });
});

describe("Tests for querying from a sentence", function() {
  it("Should give me one word from a sentence", function() {
    suffixtree.reset();
    suffixtree.setDomain("this is a sentence that has multiple sentence");
    ["has"].should.eql(suffixtree.find("has"));
  });

  it("Should give me multiple words from a sentence", function() {
    ["t", "th", "this", "that", "tence", "tiple"].should.eql(suffixtree.find("t"));
  });

  it("Should handle duplicity properly", function() {
    suffixtree.reset();
    suffixtree.setDomain("duplicate duplicate duplicate duplicate duplicate");
    ["duplicate"].should.eql(suffixtree.find("duplicate"));
  });

  it("Should handle no match found properly", function() {
    [].should.eql(suffixtree.find("blah"));
  });

  it("Should handle multiple sentences", function() {
    suffixtree.reset();
    suffixtree.setDomain("The first line contains a single number T -- the number of test cases (no more than 10)." +
      " Each of the next T lines contains a single non-empty string of length no more than 100000 consisting " +
      "of lowercase Latin letters a..z. or nos");
    ["no", "non-empty", "nos" ].should.eql(suffixtree.find("no"));
  });

  it("Should hande bigger text", function() {
    suffixtree.reset();
    suffixtree.setDomain(testdata);
    ["well"].should.eql(suffixtree.find("wel"));
  });
});
