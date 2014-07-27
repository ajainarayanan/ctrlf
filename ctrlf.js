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

ctrlf.prototype.find = function find(querystring) {
  var sftree = JSON.parse(JSON.stringify(this.sftree)),
      query = querystring,
      path = [],
      movingPivot = 0,
      i,
      currentNode,
      subquery,
      commonpart;

  for (i=0; i<query.length; i++) {
    currentNode = util.query(sftree, query[i]);
    if (currentNode && currentNode.value.length > 0) {
      subquery = query.substring(movingPivot, query.length);
      commonpart = util.commonsubstring(subquery, currentNode.value);

      if (commonpart.index < subquery.length) {
        sftree = currentNode.children;
        movingPivot = i + commonpart.index;
      } else if(commonpart.index === subquery.length) {
        break;
      }
      path.push(query[i]);
    } else {
      break;
    }
  }
  if (path.length > 0) {
    return this.flattensftree(JSON.parse(JSON.stringify(this.sftree)), path);
  }
  return [];
}

ctrlf.prototype.flattensftree = function (sftree, path) {
  var matchingarray = [];
  var len = path.length,
      mobj,
      returnarr = [],
      i,
      prefix;
  for (i =0; i<len; i++) {
    mobj = util.query(sftree, path[i]);
    matchingarray.push(mobj.value);
    sftree = mobj.children;
  }
  if (Object.keys(mobj.children).length > 0) {
    matchingarray.splice(matchingarray.length-1, matchingarray.length)
    prefix =matchingarray.join("");
    returnarr = this.traverseEntireTree(prefix, mobj, returnarr);
  } else {
    prefix =matchingarray.join("");
    returnarr.push(prefix);
  }
  return returnarr;
}

ctrlf.prototype.traverseEntireTree = function traverse(prefix, mobj, returnarr) {
  var keys = Object.keys(mobj.children),
      i;
  returnarr.push(prefix + mobj.value);
  if (keys.length > 0) {
    for (i =0; i<keys.length; i++) {
      this.traverseEntireTree(prefix + mobj.value, mobj.children[keys[i]], returnarr);
    }
  }
  return returnarr;
}

ctrlf.prototype.preprocessDomain = function preProcess() {
  if (this.searchDomain.length === 0) {
    return;
  }
  var words = this.searchDomain.split(" "),
      i,
      replaceFilter = /[&\/\\#,+()$~%.'":*?<>{}!]/g;
  if (words.length > 0) {
    words.forEach(function (word) {
      word = word.toLowerCase();
      word = word.replace(replaceFilter, "");
      for (i=word.length-1; i>=0; i-=1) {
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
      }

    } else if(commonpart.commonstring.length < currenttreevalue.length) {
      split1 = currenttreevalue.substring(0, commonpart.index+1);
      split2 =  currenttreevalue.substring(commonpart.index +1, currenttreevalue.length);
      sftree[fch].value = split1;
      if (split2[0]) {
        sftree[fch].children[split2[0]] = {
          value: split2,
          children: {}
        };
      }

      wordsplit2 = word.substring(commonpart.index+1, word.length);
      if (wordsplit2[0]){
        sftree[fch].children[wordsplit2[0]] = {
          value: wordsplit2,
          children: {}
        };
      }

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
