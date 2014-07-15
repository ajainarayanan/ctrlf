var util = require("./utility")();
var emit = require("emit");
module.exports = ctrlf;

function ctrlf(searchDomain) {
  this.searchDomain = searchDomain || "";
  this.sftree = {};
  if (!this.searchDomain) {
    this.preprocessDomain();
  }
  return this;
}

ctrlf.prototype.setDomain = function(searchDomain) {
  this.searchDomain = searchDomain;
  this.preprocessDomain();
}

ctrlf.prototype.reset = function() {
  this.sftree = {};
  this.searchDomain = "";
}

ctrlf.prototype.find = function find(query) {

}

ctrlf.prototype.preprocessDomain = function preProcess() {
  if (this.searchDomain.length === 0) {
    return;
  }
  var words = this.searchDomain.split(" ");
  if (words.length > 0) {
    words.forEach(function (word) {
      for (var i=word.length-1; i>=0; i-=1) {
          this.addToSFTree(word.substring(i, word.length), this.sftree);
      }
    }.bind(this));
  }
}

/*
  - Check if the word's first character is already indexed in the top
  level of the this.sftree.
    - If it is then go inside that entry.
    - else create a new entry for the word in the top level
*/
ctrlf.prototype.addToSFTree = function addToSuffixTree(word, sftree) {
  var fch,
      currentvalue,
      commonpart,
      split1,
      split2,
      wordsplit2;
  fch = word[0];

  if (typeof sftree[fch] === "object") {
    // fch already at the top root level
    currenttreevalue = sftree[fch].value;
    commonpart = util.commonsubstring(currenttreevalue, word);
    if (commonpart.commonstring === currenttreevalue) {
      if (commonpart.index !== word.length-1) {
        this.addToSFTree(word.substring(commonpart.index+1, word.length), sftree[fch].children);
      } else {
        word = word.substring(commonpart.index+1, str2.length);
        sftree[fch].children[word[0]] = {
          value: str2,
          children: {}
        };
      }

    } else if(commonpart.commonstring.length < currenttreevalue.length) {
      var split1 = currenttreevalue.substring(0, commonpart.index+1);
      var split2 =  currenttreevalue.substring(commonpart.index +1, currenttreevalue.length);
      sftree[fch].value = split1;
      sftree[fch].children[split2[0]] = {
        value: split2,
        children: {}
      };

      wordsplit2 = word.substring(commonpart.index+1, word.length);
      sftree[fch].children[wordsplit2[0]] = {
        value: wordsplit2,
        children: {}
      };

    }
  }else {
    // Add the word if the first characters don't match at the root level.
    // This says this is the new substring that the tree is encountering.
    sftree[fch] = {
      "value": word,
      "children": {}
    };

  }
}
