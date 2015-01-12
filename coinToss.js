var toss = Math.floor(Math.random() * 2);
  
function headsTails(number) {
  var headsCount = 0; 
  var tailsCount = 0;
  for (var i = 0; i < number; i++) {
    if (toss == 1) {
      headsCount++;
      toss = Math.floor(Math.random() * 2);
    }
    else {
      tailsCount++;
      toss = Math.floor(Math.random() * 2);
    }
  }
  var totalHeads = (headsCount / number) * 100;
  totalHeads = totalHeads.toFixed(3);
  var totalTails = (tailsCount / number) * 100;
  totalTails = totalTails.toFixed(3);
  console.log("Heads: " + headsCount + " (" + totalHeads + "%) --- " + "Tails: " + tailsCount + " (" + totalTails + "%)");
}

headsTails(10);
headsTails(100);
headsTails(1000);
headsTails(10000);
headsTails(100000);