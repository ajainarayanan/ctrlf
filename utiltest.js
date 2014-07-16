var utility = require("./utility")();
module.exports = describe("Tests related to utility", function() {
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

  it("Should handle properly for same string", function() {
    var str1 = str2 = "tence";
    var cp = utility.commonsubstring(str1, str2);
    cp.should.have.properties({
      index: 4,
      commonstring: "tence"
    });
  })

});
