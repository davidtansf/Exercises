var slaying = true;
// A bit of new math magic to calculate the odds
// of hitting the dragon. We'll cover this soon!
var diceRoll = Math.floor(Math.random() * 10);
var damageThisRound = Math.floor(Math.random() * 5 + 1);
var totalDamage = 0;
var round = 0;

while (slaying) {
  round ++;
  if (diceRoll) {
    console.log("Round **" + round + "**");
    console.log("Total damage so far: " + totalDamage);
    console.log("You gave the dragon " + damageThisRound + " damage!");
    totalDamage += damageThisRound;
    console.log("Total damage now: " + totalDamage);
      if (totalDamage >= 25) {
        console.log("You did it! You slew the dragon!");
        slaying = false;
      } 
      else {
        diceRoll = Math.floor(Math.random() * 10);
        damageThisRound = Math.floor(Math.random() * 5 + 1);
        console.log("\n");
      }
    } 
  else {
    console.log("Round **" + round + "**"); 
    console.log("Dice roll: " + diceRoll);
    console.log("The dragon burninates you! You're toast.");
    slaying = false;
  }
}