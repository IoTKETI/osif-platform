var UUIDV4 = {

  init: function() {
    if (window.uuidv4)
      return;

    window.uuidv4 = this.uuidv4;
  },

  //  ellipsis string s by given length n
  uuidv4 : function() {
    var hexDigits = "0123456789abcdef";
    var uuid = '';
    for (var i=1; i<=36; i++) {
      if (i===9 || i===14 || i===19 || i===24) {
        uuid += '-';
      } else if (i===15) {
        uuid += 4;
      } else if (i===20) {
        uuid += hexDigits[(Math.random()*4|0 + 8)];
      } else {
        uuid += hexDigits[(Math.random()*16|0)];
      }
    }
    return uuid;
  }
};

UUIDV4.init();
