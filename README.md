ctrlf
=====

A tiny library for (Nodejs/Browser) searching strings. Loose implementation of suffix trees.

API
====

```javascript
var ctrlf = require("ctrlf");

var sftree = new ctrlf();
sftree.setDomain("Sample Text string to search for");

/*
  Or the above two statements could be reset as
  var sftree = new ctrlf("Sample Text string to search for");
*/

sftree.find("search");
//Should return ["search"]

sftree.reset();

sftree.setDomain("The first line contains a single number T -- " +
  "the number of test cases (no more than 10)." +
  " Each of the next T lines contains a single non-empty string of " +
  "length no more than 100000 consisting " +
  "of lowercase Latin letters a..z. or nos");

sftree.find("no");
//Should return ["no", "non-empty", "nos"]
```

ctrlf.setDomain()
-----------------
Sets the string domain to search for. The total sample space to search for.

ctrlf.reset()
-------------
Resets the current set domain for further reuse.

ctrlf.find()
-------------
Find substring in the current search domain.
