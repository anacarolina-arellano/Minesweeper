// Copyright (c) 2021, Ana Carolina Arellano
'use strict';

import Game from './Game.js';
//Main appplication

//Application starts at level "easy" if no
//difficulty is chosen
$(".play").on(`click`, event => {
    let game = new Game(15, 30); 
    game.run();
    $(".splash-screen").hide();
    $(".run-game").show();
});

//Took as reference: https://stackoverflow.com/questions/12260235/jquery-on-hover-not-functioning
$(".dif").on(`mouseenter`, event => {
    $(".my-options").show();
}).on(`mouseleave`, event =>{
    $(".my-options").hide();
});

$(".easy").on(`click`, event => {
    let game = new Game(15, 30); 
    game.run();
    $(".splash-screen").hide();
    $(".run-game").show();
});

$(".medium").on(`click`, event => {
    let game = new Game(20, 20); 
    game.run();         
    $(".splash-screen").hide();
    $(".run-game").show();
});

$(".hard").on(`click`, event =>{   
    let game = new Game(25, ); 
    game.run();      
    $(".splash-screen").hide();
    $(".run-game").show();
});    
