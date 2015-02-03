// splitting
// aces

var main = function() {
	$('.money').text(me.money);
	$('.bet').text(me.bet);
	$('.hit').hide();
	$('.stand').hide();
	$('.ddown').hide();
	$('.split').hide();
	$('.insy').hide();
	$('.insn').hide();
	$('.even').hide();
	$('.again').hide();
	
	shuffleDeck();
	
	$('.betup').click(function() {
		increaseBet();
	});
	$('.betdown').click(function() {
		decreaseBet();
	});
	$('.deal2').click(function() {
		dealCards();
	});
	$('.hit').click(function() {
		hit();
	});
	$('.stand').click(function() {
		stand();
	});	
	$('.ddown').click(function() {
		doubleDown();
	});
	$('.insn').click(function() {
		noInsurance();
	});
	$('.insy').click(function() {
		insuranceYes();
	});
	$('.even').click(function() {
		dealerReveals();
		$('.pvalue').append(" [WINNER: YOU TOOK EVEN MONEY]");
		return iWon();
	});
	$('.again').click(function() {
		playAgain();
	});	
};

$(document).ready(main);

// ---------------------------------------------------------//

var fullDeck = [];
var usedDeck = [];

function shuffleDeck() {
	fullDeck = [];
	usedDeck = [];
	while (fullDeck.length < 52) {
		getFull();
	}
}

function getFull() {
	var card = Math.floor(Math.random() * 52) + 1;
	for (var i = 0; i < fullDeck.length; i++) {
		if (fullDeck[i] === card)
			return getFull();
	}	
	fullDeck.push(card);	
}

function dealCards() {
	if (me.bet == 0)
		return $('.pcards').text("PLEASE PLACE BET");
	else {
		$('.betup').fadeOut("fast");
		$('.betdown').fadeOut("fast");
		
		me.card1 = fullDeck.shift();
		dealer.card1 = fullDeck.shift();
		me.card2 = fullDeck.shift();
		dealer.card2 = fullDeck.shift();
		
		usedDeck.unshift(me.card1);
		usedDeck.unshift(dealer.card1);
		usedDeck.unshift(me.card2);
		usedDeck.unshift(dealer.card2);
		
		$('.pcards').text(lookup[me.card1].name + ", " + lookup[me.card2].name);
		$('.dealerup').text(lookup[dealer.card2].name);	
		$('.deal2').fadeOut("medium", function() {
			me.pvalue = lookup[me.card1].value + lookup[me.card2].value;
			$('.pvalue').text(me.pvalue);
			dealer.pvalue = lookup[dealer.card1].value + lookup[dealer.card2].value;
			if (dealer.card2 >= 1 && dealer.card2 <= 4)
				insuranceReveal();
			else
				noInsurance();
		});
	}	
}

function increaseBet() {
	if (me.money >= 10) {
		me.bet += 10;
		me.money -= 10;
		$('.bet').text(me.bet);
		$('.money').text(me.money);
	}
	else if (me.bet == 0) {
		$('.bet1').hide();
		$('.bet').text("TOO POOR");
	}	
}

function decreaseBet() {
	if (me.bet >= 10) {
		me.bet -= 10;
		me.money += 10;
		$('.bet').text(me.bet);
		$('.money').text(me.money);
	}	
}

function insuranceReveal() {
	$('.insy').show();
	$('.insn').show();
	if (me.pvalue == 21)
		$('.even').show();
}

function insuranceYes() {
	if (dealer.pvalue == 21) {
		me.money += me.bet;
		me.bet = 0;
		dealerReveals();
		$('.pvalue').append(" [INSURED: NO MONEY LOST]");
		return iWon();
	}
	else {
		dealer.money += me.bet / 2;
		me.money -= me.bet / 2;
		$('.money').text(me.money);
		$('.dealerup').append(" [PLAYER LOST INSURANCE]");
		return noInsurance();
	}
}

function noInsurance() {
	$('.insn').fadeOut("medium");
	$('.even').fadeOut("medium");
	$('.insy').fadeOut("medium", function() {
		$('.hit').show().prop('disabled', false);
		$('.stand').show().prop('disabled', false);
		if (me.money >= me.bet)
			$('.ddown').show().prop('disabled', false);
		if (me.pvalue == 21 && dealer.pvalue == 21) {
			dealerReveals();
			return iPush();
		}	
		if (me.pvalue == 21) {
			dealerReveals();
			return iWonBJ();
		}	
		if (dealer.pvalue == 21) {
			dealerReveals();
			$('.pvalue').append(" [LOST: DEALER HAS 21]");
			return iLost();
		}	
		if (lookup[me.card1].value == lookup[me.card2].value && me.money >= me.bet)
			$('.split').show().prop('disabled', false);
	});
}

function dealerReveals() {
	$('.dealerup').text(lookup[dealer.card1].name + ", " + lookup[dealer.card2].name);
	$('.dvalue').text(dealer.pvalue);	
}

function hit() {
	$('.ddown').hide();
	$('.split').hide();
	var newCard = fullDeck.shift();
	$('.pcards').append(", " + lookup[newCard].name);
	
	me.pvalue += lookup[newCard].value;
	$('.pvalue').text(me.pvalue);
	
	if (me.pvalue > 21) {
		dealerReveals();
		iLost();
		$('.pvalue').append(" [BUSTED: YOU LOSE]");
	}
}

function stand() {
	dealerReveals();
	dealerTurn();
}

function doubleDown() {
	me.money -= me.bet;
	me.bet += me.bet;
	hit();
	if (me.pvalue <= 21) {
		dealerReveals();
		dealerTurn();
	}
}

function dealerTurn() {
	if (dealer.pvalue >= 17 && dealer.pvalue <= 21) {
		if (dealer.pvalue > me.pvalue) {
			$('.pvalue').append(" [LOST: DEALER HAD A HIGHER HAND]");
			return iLost();
		}	
		else if (dealer.pvalue < me.pvalue) {
			$('.pvalue').append(" [WON: YOU HAD A HIGHER HAND]");
			return iWon();
		}	
		else
			return iPush();
	}
	if (dealer.pvalue > 21) {
		$('.pvalue').append(" [WINNER: DEALER BUSTED]");
		return iWon();
	}
	if (dealer.pvalue < 17) {
		var dealerCard = fullDeck.shift();
		usedDeck.unshift(dealerCard);	
		$('.dealerup').append(", " + lookup[dealerCard].name);
		dealer.pvalue += lookup[dealerCard].value;
		return dealerTurn();
	}
}

function iWonBJ() {
	me.money += me.bet * 2.5;
	dealer.money -= me.bet * 1.5;
	disableButtons();
	$('.money').text(me.money);
	me.bet = 0;
	$('.bet').text(me.bet);
	$('.pvalue').append(" [WINNER: 21!!]");
}

function iWon() {
	me.money += me.bet * 2;
	dealer.money -= me.bet;
	disableButtons();
	$('.dvalue').text(dealer.pvalue);
	$('.money').text(me.money);
	me.bet = 0;
	$('.bet').text(me.bet);
}

function iLost() {
	dealer.money += me.bet;
	disableButtons();
	$('.dvalue').text(dealer.pvalue);
	$('.money').text(me.money);
	me.bet = 0;
	$('.bet').text(me.bet);
}

function iPush() {
	me.money += me.bet;
	disableButtons();
	$('.dvalue').text(dealer.pvalue);
	$('.money').text(me.money);
	me.bet = 0;
	$('.bet').text(me.bet);
	$('.pvalue').append(" [PUSH: NO WINNER]");
}

function disableButtons() {
	$('.betup').fadeOut("fast");;
	$('.betdown').fadeOut("fast");;
	
	$('.reveal').fadeOut("fast");
	$('.shuffle').fadeOut("fast");
	
	$('.deal2').fadeOut("fast");
	
	$('.hit').fadeOut("fast");
	$('.stand').fadeOut("fast");
	$('.ddown').fadeOut("fast");
	$('.split').fadeOut("fast");
	
	$('.insy').hide();
	$('.insn').hide();
	$('.even').hide();
	
	$('.again').show().prop('disabled', false);
	
}

function playAgain () {
	shuffleDeck();
	
	$('.betup').show().prop('disabled', false);
	$('.betdown').show().prop('disabled', false);
	$('.deal2').show().prop('disabled', false);
	$('.reveal').show().prop('disabled', true);
	$('.shuffle').show().prop('disabled', true);
	
	$('.hit').hide();
	$('.stand').hide();
	$('.ddown').hide();
	$('.split').hide();
	
	$('.pcards').text("");
	$('.pvalue').text("");
	$('.dealerup').text("");
	$('.dvalue').text("");
	
	$('.again').hide();
	
	me.pvalue = 0;
	dealer.pvalue = 0;
	
	me.card1 = 0;
	me.card2 = 0;
	dealer.card1 = 0;
	dealer.card2 = 0;
}

var me = {
	money: 200,
	bet: 0,
	pvalue: 0,
	card1: 0,
	card2: 0
}

var dealer = {
	money: 10000,
	pvalue: 0,
	card1: 0,
	card2: 0
}

var lookup = {
	1: {
		value: 11,
		name: "Ace Diamonds"
	},
	2: {
		value: 11,
		name: "Ace Clubs"
	},
	3: {
		value: 11,
		name: "Ace Hearts"
	},
	4: {
		value: 11,
		name: "Ace Spades"
	},
	5: {
		value: 2,
		name: "2 Diamonds"
	},
	6: {
		value: 2,
		name: "2 Clubs"
	},
	7: {
		value: 2,
		name: "2 Hearts"
	},
	8: {
		value: 2,
		name: "2 Spades"
	},
	9: {
		value: 3,
		name: "3 Diamonds"
	},
	10: {
		value: 3,
		name: "3 Clubs"
	},
	11: {
		value: 3,
		name: "3 Hearts"
	},
	12: {
		value: 3,
		name: "3 Spades"
	},
	13: {
		value: 4,
		name: "4 Diamonds"
	},
	14: {
		value: 4,
		name: "4 Clubs"
	},
	15: {
		value: 4,
		name: "4 Hearts"
	},
	16: {
		value: 4,
		name: "4 Spades"
	},
	17: {
		value: 5,
		name: "5 Diamonds"
	},
	18: {
		value: 5,
		name: "5 Clubs"
	},
	19: {
		value: 5,
		name: "5 Hearts"
	},
	20: {
		value: 5,
		name: "5 Spades"
	},
	21: {
		value: 6,
		name: "6 Diamonds"
	},
	22: {
		value: 6,
		name: "6 Clubs"
	},
	23: {
		value: 6,
		name: "6 Hearts"
	},
	24: {
		value: 6,
		name: "6 Spades"
	},
	25: {
		value: 7,
		name: "7 Diamonds"
	},
	26: {
		value: 7,
		name: "7 Clubs"
	},
	27: {
		value: 7,
		name: "7 Hearts"
	},
	28: {
		value: 7,
		name: "7 Spades"
	},
	29: {
		value: 8,
		name: "8 Diamonds"
	},
	30: {
		value: 8,
		name: "8 Clubs"
	},
	31: {
		value: 8,
		name: "8 Hearts"
	},
	32: {
		value: 8,
		name: "8 Spades"
	},
	33: {
		value: 9,
		name: "9 Diamonds"
	},
	34: {
		value: 9,
		name: "9 Clubs"
	},
	35: {
		value: 9,
		name: "9 Hearts"
	},
	36: {
		value: 9,
		name: "9 Spades"
	},
	37: {
		value: 10,
		name: "10 Diamonds"
	},
	38: {
		value: 10,
		name: "10 Clubs"
	},
	39: {
		value: 10,
		name: "10 Hearts"
	},
	40: {
		value: 10,
		name: "10 Spades"
	},
	41: {
		value: 10,
		name: "J Diamonds"
	},
	42: {
		value: 10,
		name: "J Clubs"
	},
	43: {
		value: 10,
		name: "J Hearts"
	},
	44: {
		value: 10,
		name: "J Spades"
	},
	45: {
		value: 10,
		name: "Q Diamonds"
	},
	46: {
		value: 10,
		name: "Q Clubs"
	},
	47: {
		value: 10,
		name: "Q Hearts"
	},
	48: {
		value: 10,
		name: "Q Spades"
	},
	49: {
		value: 10,
		name: "K Diamonds"
	},
	50: {
		value: 10,
		name: "K Clubs"
	},
	51: {
		value: 10,
		name: "K Hearts"
	},
	52: {
		value: 10,
		name: "K Spades"
	}
};	

// ---------------------------------------------------------//

/*

// Deal cards one at a time: 	

$('.reveal').show().prop('disabled', true);
$('.shuffle').show().prop('disabled', true);

	$('.deal').click(function() {
		dealOne();
	});
	$('.shuffle').click(function() {
		shuffleDeck();
	});
	$('.reveal').click(function() {
		revealCards();
	});

var usedCards = [];

function dealOne() {
	if (usedCards.length == 52)
		return $('.card').text("NO MORE CARDS IN DECK");
	else {
		getCard();	
	}	
}

function getCard() {
	var card = Math.floor(Math.random() * 52) + 1;
	for (var i = 0; i < usedCards.length; i++) {
		if (usedCards[i] === card)
			return getCard();
	}	
	usedCards.push(card);
	return $('.card').text(lookup[card].name);		
}

function revealCards() {
	console.log("----REMAINING IN DECK----");
	for (var i =0; i < fullDeck.length; i++) {
		console.log(fullDeck[i], lookup[fullDeck[i]].name);
	}
}

*/
