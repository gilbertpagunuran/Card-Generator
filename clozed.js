var inquirer = require("inquirer");
var fs = require("fs");

var clozedArray = [];

// constructor for derived clozed card object
function ClozedCard(a, b, c) 
{   if (!(this instanceof ClozedCard)) 
     {return new ClozedCard(a, b, c)};
  this.clozed = a;
  this.partial = b;
  this.full = c;
}

// constructor for full-text and clozed-deleted inputs
function Clozed(fullText, clozedText) 
{
  if (!(this instanceof Clozed)) 
     {return new Clozed(fullText, clozedText)};

  this.fullText = fullText;
  this.clozedText = clozedText;

  this.oops = function() {
    var pos = this.fullText.search(this.clozedText);
    if (pos < 0) {
      console.log(this.clozedText + " does not work");
      return false};
    return true;
  };
  this.clozed = function(){
    console.log("Clozed      : " + this.clozedText);
  };
  this.full = function(){
    console.log("Full-Text   : " + this.fullText);
  };
  this.partial = function() {
    var xPart = this.fullText.replace(this.clozedText, "---");
    console.log("Partial-Text : " + xPart);
    return xPart;
  };
} // constructor for full-text and clozed-deleted inputs ends

var askClozed = function() {  

  inquirer.prompt([
  { name: "full",
    message: "Full text    :"
  }, 
  { name: "ans",
    message: "Text to hide :",
  }
  ]).then(function(answers) {

    newCard = new Clozed(answers.full, answers.ans);

    var valid = newCard.oops();

    if (valid) {

      newCard.clozed();
      var builtPartial = newCard.partial();
      newCard.full();

      newClozed = new ClozedCard(answers.ans, builtPartial, answers.full);

      clozedArray.push(newClozed);

      inquirer.prompt
      ([
        { name: "more",
        message: "Continue 1-Yes, 0-No?"
      }
      ]).then(function(again) {
        if (again.more == '1') {
          askClozed();
        }

        var myJ = JSON.stringify(clozedArray);

        fs.writeFile("clozedflash.txt", myJ, function(err) 
          {if (err) {return console.log(err);}
        }); 

      }); // continue prompt ends

    }

    else {
      askClozed();
    }

  }); // clozed card prompt ends
}; // function askClozed ends


fs.readFile("clozedflash.txt", "utf8", function(err, data){
    clozedArray = JSON.parse(data);

    for (var x = 0; x < clozedArray.length; x++) {
      console.log(`Clozed:    ${clozedArray[x].clozed}`);
      console.log(`Partial:   ${clozedArray[x].partial}`);
      console.log(`Full:      ${clozedArray[x].full}`);
    }
    askClozed();
});