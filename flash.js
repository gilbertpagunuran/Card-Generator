var inquirer = require("inquirer");
var fs = require("fs");

var flashArray = [];

fs.readFile("basicflash.txt", "utf8", function(err, data){
  flashArray = JSON.parse(data);
});

// constructor for basic flash card
function Flash(front, back) {
  this.front = front;
  this.back = back;
}

Flash.prototype.printInfo = function() {
  console.log("Question: " + this.front + " Answer: " + this.back);
};

var askFlash = function() {
  
  console.log("New Question");

  inquirer.prompt([
  { name: "question",
    message: "What is the question?"
  }, 
  { name: "ans",
    message: "What is the answer?"
  },
  { name: "more",
    message: "Continue 1-Yes, 0-No?"
  } 
  ]).then(function(answers) {
    newCard = new Flash(answers.question, answers.ans);

    flashArray.push(newCard);

    if (answers.more == '1') 
    {
      askFlash();
    }
    else 
    {
      var myJ = JSON.stringify(flashArray);
      fs.writeFile("basicflash.txt", myJ, function(err) {
        if (err) {return console.log(err);};

       console.log("basicflash.txt was updated...")

       fs.readFile("basicflash.txt", "utf8", function(err, data)
        {
          var myA = JSON.parse(data);

          for (var x = 0; x < myA.length; x++) 
          {
            newPrint = new Flash(myA[x].front, myA[x].back);
            newPrint.printInfo();
          }
          
        });  // readFile ends
      });  // writeFile ends      
    }  // continue? ends
  }); // prompts ends
}; // askFlash ends


askFlash();