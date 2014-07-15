module.exports = utility;

function utility() {
  return {
    commonsubstring: commonsubstring
  };
}

/*
  Irony is that this utility could be a suffix tree. But I am doing it manually
  since it is going to be a comparison between relatively small strings.
*/
function commonsubstring(str1, str2) {
  if (!str1 || !str2) {
    return {
      index: 0,
      commonstring: ""
    };
  }
  var i,
    length = str1.length > str2.length ? str1.length: str2.length,
    commonstring = "",
    index = 0;

  for (i=0; i<length; i+=1) {
    if (str1[i] === str2[i]) {
      continue;
    } else {
      index = i-1;
      commonstring = str1.substring(0, i);
      break;
    }
  }
  return {
    index: index,
    commonstring: commonstring
  };
}
