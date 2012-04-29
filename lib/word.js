// Word object, useful for bruteforcing.
// var a = new Word('a'); a.inc(); a.disp()  -> 'b'

// sha0@badchecksum.net
// @sha0coder

var Word = function(word) {
    if (typeof word == 'number') {
        this.word = word.toString();
    }
    this.word = word;
    this.dbg = false;
}

Word.prototype = {
    
    setDebug: function(dbg) {
        this.dbg = dbg;
    },
    
    set: function(w) {
        if (typeof w == 'number')
            w = w.toString(); 
            
        this.word = w;
    },
    
    get: function() {
        if (typeof this.word == 'number')
            return this.word.toString();
            
        return this.word;
    },
    
    disp: function() {
        console.log(this.word);
    },

    thousands: function() {
        var pnum = [];
        
        if (this.word.length <= 3)
            return;
           
            
        var num = this.get();
        num = num.split('').reverse();
        var i=0;
        while (i < num.length) {
            pnum.push('.');
            pnum.push(num[i++]);
            pnum.push(num[i++]);
            pnum.push(num[i++]);
        }
        
        pnum.shift();
        this.word = pnum.reverse().join('');
    },
    
    
    getCodes: function() {
        var codes = [];
        for (var i=0; i<this.word.length; i++) {
                codes.push(this.word.charCodeAt(i));
        }

        return codes;
    },
    
    setCodes: function(wordcodes) {
        var w = '';
        if (!wordcodes)	
                return '';
                
        wordcodes.forEach(function (c) {
                w += String.fromCharCode(c);
        });
        
        this.word = w;
    },
    
    
    inc: function(p) {
        var pos;
        var a = 97, z = 122;
        if (p == undefined) 
            pos = 0;
        else
           pos = p;
        
        var codes = this.getCodes();

        if (pos == codes.length) 
                codes.push(a);
        

        codes[pos]++;
        if (codes[pos] > z) {
                codes[pos] = a;
                this.setCodes(codes);
                this.inc(++pos);
        } else
            this.setCodes(codes);
    },
}

exports.Word = Word;
