// Copyright (c) 2021, Ana Carolina Arellano
'use strict';

import Game from './Game.js';

//Main appplication

//Game's click sound
var clickAudio = new buzz.sound('../sounds/mixkit-video-game-retro-click-237', {
    formats: ["wav"],
    preload: true,
    autoplay: false,
    loop: false,
});

//Application starts at level "easy" if no
//difficulty is chosen
$(".play").on(`click`, event => {
    let game = new Game(7, 5, "my-class-easy"); 
    game.run();
    $(".splash-screen").hide();
    $(".run-game").show();
    clickAudio.play();
});

//Took as reference: https://stackoverflow.com/questions/12260235/jquery-on-hover-not-functioning
//show levels of difficulty
$(".dif").on(`mouseenter`, event => {
    $(".my-options").show();
}).on(`mouseleave`, event =>{
    $(".my-options").hide();
});

//user clicks easy
$(".easy").on(`click`, event => {
    clickAudio.play();
    let game = new Game(7, 5, "my-class-easy");
    game.run();
    $(".splash-screen").hide();
    $(".run-game").show();
});

//user click medium
$(".medium").on(`click`, event => {
    clickAudio.play();
    let game = new Game(9, 30, "my-class-med"); 
    game.run();         
    $(".splash-screen").hide();
    $(".run-game").show();
});

//user clicks hard
$(".hard").on(`click`, event =>{
    clickAudio.play();
    let game = new Game(12, 90, "my-class-hard");
    game.run();      
    $(".splash-screen").hide();
    $(".run-game").show();
});


