
var LSystem = Class.extend({

    init: function(axiom, rules) {
        this.sentence = axiom;
        this.rules = rules;
        this.generation = 0;
    },

    generate: function() {
        var next = "";
        for(var i = 0; i < this.sentence.length; i++) {
            var char = this.sentence[i];
            next += this.rules[char];
        }

        this.sentence = next;
        this.generation++;
    }
});

var Turtle = Class.extend({

    init: function() {

    }
});