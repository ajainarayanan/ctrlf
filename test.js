var mocha =  require("mocha");
var assert = require("should");
var mdata = require("./mississippidata.js");

var utility = require("./utility")();
var ctrlf = require("./ctrlf");
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
    })
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
  })

});



describe("Tests related to utility", function() {
  it("Should give me correct common string", function() {
    var str1 = "solatidorimafa";
    var str2 = "solat";
    var commonpart = utility.commonsubstring(str1, str2);
    commonpart.should.have.properties({
      commonstring: "solat",
      index: 4
    });
  });

  it("Should give me empty string for no match", function() {
    var str1 = "solatidorimafa";
    var str2 = "gibberish";
    var commonpart = utility.commonsubstring(str1, str2);
    commonpart.should.have.properties({
      commonstring: ""
    });
  });

  it("Should handle empty strings properly", function() {
    var str1 = "";
    var str2 = "";
    var commonpart = utility.commonsubstring(str1, str2);
    commonpart.should.have.properties({
      index: 0,
      commonstring: ""
    });
  });

  it("Should handle null | undefined values", function() {
    var str1, str2 = undefined;
    var commonpart = utility.commonsubstring(str1, str2);
    commonpart.should.have.properties({
      index: 0,
      commonstring: ""
    });
  });


})
