// Copyright (c) 2021 Ana Carolina Arellano
'use strict';

import Minefield from "./Minefield.js"

    //Game's music
    const config = {
        formats: ["wav"],
        preload: true,
        autoplay: false,
        loop: false,
    };

    //Music played on background
    var backgroundAudio = new buzz.sound('../sounds/mixkit-game-level-music-689', {
        formats: ["wav"],
        preload: true,
        autoplay: true,
        loop: true });

    //Music played on click
    var clickAudio = new buzz.sound('../sounds/mixkit-video-game-retro-click-237', config);

    //Music played when user loses
    var loseAudio = new buzz.sound('../sounds/mixkit-completion-of-a-level-2063', config);
    export default class Game{

    constructor(size , mineCount, myClass){
        //Create a game
        this.board = {
            size : size,
        };

        //Create minefield with received parameters
        this.minefield = new Minefield(size, mineCount);
        this.minefield.revealedSqs = 0;
        //set game over to false
        this.gameOver = false;
        //0 flags at the beginning
        this.flags = 0;
        //size of td based on received class
        this.difClass = myClass;

        //function calls
        this.generateBoard();
        this.updateHandlers();
    }

    //handles clicks in the different buttons of the game
    updateHandlers(){

        //when player clicks quit
        $(".quit").on(`click`, event => {
            clickAudio.play();
            $(".splash-screen").show();
            $(".instructions-screen").hide();
            $(".lost-screen").hide();
            location.reload(); //Consulted page: https://www.w3schools.com/jsref/met_loc_reload.asp
        });

        //when player clicks any square
        $(".square").on('click', event => {
            clickAudio.play();
            const $selectedEl = $(event.currentTarget);
            //obtain row and col of square
            const row = $selectedEl.data("row");
            const col = $selectedEl.data("col");

            const sq = this.minefield.squareAt(row,col)

            this.reveal(sq, row, col);
        });

        //when player right clicks
        $(".square").on('contextmenu', event => {
            clickAudio.play();
            event.preventDefault();

            const $selectedEl = $(event.target);
            this.flag($selectedEl); //Flag element
        })
    }

    //Consulted page for pausing https://stackoverflow.com/questions/3969475/javascript-pause-settimeout
    //start of game and clock
    run(){
        backgroundAudio.play();
        //management of time
        let secondCount = 0;
        window.setInterval(() => {
            if(!$(".clock").hasClass("pauseClock")){
                //make output look better
                if(secondCount < 10){
                    secondCount = "0" + secondCount;
                }
                else{
                    secondCount = "" + secondCount;
                }
                //only seconds are displayed
                $(".clock").html("Seconds: " + secondCount); 
                secondCount++;
            }
        }, 1000); //update every second

        //If player chooses to pause the game the
        // clock pauses, the paused-screen is shown and the
        // run-game screen is hidden
        $(".on-pause").on(`click`, event => {
            clickAudio.play();
            $(".paused").show();
            $(".run-game").hide();
            $(".clock").addClass("pauseClock");
        });

        //If player chooses "resume" in the paused screen the
        // clock runs again, the paused-screen is hidden and the
        // run-game screen is shown
        $(".resume").on(`click`, event => {
            clickAudio.play();
            $(".run-game").show();
            $(".paused").hide();
            $(".clock").removeClass("pauseClock");
        });

        //If player chooses "Instructions in the run-game screen the
        // clock pauses, the instructions-screen is shown and the
        // run-game screen is hidden
        $(".inst").on(`click`, event => {
            clickAudio.play();
            $(".instructions-screen").show();
            $(".paused").hide();
            $(".run-game").hide();
            $(".clock").addClass("pauseClock");
        });

        //If player chooses "Go Back" in the instructions-screen the
        // clock runs again, the instructions-screen is hidden and the
        // run-game screen is shown
        $(".back").on(`click`, event => {
            clickAudio.play();
            $(".run-game").show();
            $(".instructions-screen").hide();
            $(".clock").removeClass("pauseClock");
        });

        //player clicks "play again"
        $(".play-again").on(`click`, event => {
            clickAudio.play();
            //manually restart all variables
            this.board.size = this.minefield.size;
            const numMines = this.minefield.mineCount;
            //this will generate a new minefield with bombs randomly set 
            this.minefield = new Minefield(this.board.size, numMines); 
            this.gameOver = false;
            this.flags  = 0;
            this.generateBoard();
            this.updateHandlers();
            //restart timer
            secondCount = 0;
            //screens management
            $(".run-game").show();
            $(".win-screen").hide();
            $(".lost-screen").hide();
            $(".clock").removeClass("pauseClock");
        });
    }

    //generate the html table for the board
    generateBoard(){
        /*
        <table>
            <tr><td></td>...</tr>
        </table>
        */ 
       let markup = "<table>";
       for(let row = 0; row < this.board.size; row++){
           //the number of rows and columns depends of the difficulty chosen
           markup += `<tr class = "${this.difClass}">`;
           for(let col = 0; col < this.board.size; col++){
               //set id with current row and col
               const id = `square-${row}-${col}`;
               //obtain the current square from the minefield
               const mySquare = this.minefield.squareAt(row, col);
               
               //function call to styleSquare
               let myStyle = this.styleSquare(mySquare);
               //set attributes
               const dataAttributes = `data-row = "${row}" data-col = "${col}"`;
               //add square to markup with the obtained id/classes/attributes
               // and print number of adjacent mines (inner)
               markup += `<td id = "${id}" class = "${myStyle.classes} " ${dataAttributes}>${myStyle.inner}</td>`;
           }
           markup += "</tr>";
       }
       markup += "</table>";
       //print in the html, game-grid section
       $("#game-grid").html(markup);
    }

    //Flag a chosen square
    flag($element){
        //obtain row and col of square
        const row = $element.data("row");
        const col = $element.data("col");
        this.flags++;

        //have the square as variable
        const sq = this.minefield.squareAt(row, col);
        sq.isFlagged = true; //set its attribute "isFlagged" to true
        let styles = this.styleSquare($element); //style the square (add background image)
        $element.html(styles.inner).addClass(styles.classes); //put result into html document
    }

    //A square is clicked
    reveal(sq, row, col){
        //the square is revealed
        sq.isRevealed = true;
        //increase num of revealed squares
        this.minefield.revealedSqs++;
        //player wins if the only squares that are left unrevealed(or flagged) have mines
        if((this.minefield.revealedSqs + this.flags)  >= (this.minefield.SIZE * this.minefield.SIZE)  - this.minefield.MINECOUNT){
            this.gameOver = true; //game ends
            $(".run-game").hide();
            $(".win-screen").show();
            $(".clock").addClass("pauseClock");
            backgroundAudio.pause();
        }
        //style revealed square
        let styles = this.styleSquare(sq);
        //get element and add classes to html
        const $element = $(`#square-${row}-${col}`);
        $element.html(styles.inner).addClass(styles.classes);

        if(sq.adjacentMines != 0){
            return;
        }

        // top
        if(row-1 >= 0){
            this.revealZeros(row-1, col);
        }

        // bottom
        if(row+1 < this.board.size){
            this.revealZeros(row+1, col);
        }

        // left
        if(col-1 >= 0){
            this.revealZeros(row, col-1);
        }

        // right
        if(col+1 < this.board.size){
            this.revealZeros(row, col+1);
        }

    }

    revealZeros(row, col){
        const sq = this.minefield.squareAt(row, col);
        if(!sq.hasMine &&!sq.isRevealed){
            this.reveal(sq, row, col);
        }
    }

    //Logic seen in class
    //returns number of adjacent mines of current square 
    //returns classes to be added to the square
    styleSquare( aSquare){
        let classes = " square";
        let inner = "";

        //if square is flagged
        if(aSquare.isFlagged){
            //add class "flag"
            classes += " flag";
        }
        // if the square is revealed
        else if (aSquare.isRevealed) {
            //know if square has mine or not and set classes based on that
            classes += ( aSquare.hasMine ? " mine" : ` revealed color-${aSquare.adjacentMines}`);
            inner = `${aSquare.adjacentMines}`;
            
            //Consulted page: https://www.sitepoint.com/delay-sleep-pause-wait/ (delay lost-screen)
            //if square has a mine -> game over
            if(aSquare.hasMine){
                this.gameOver = true;
                setTimeout(() => {  
                    //manage screens
                    $(".run-game").hide();
                    $(".lost-screen").show();
                    $(".clock").addClass("pauseClock");
                    //quit game music and play lose music
                    backgroundAudio.pause();
                    loseAudio.play();
                    //0.7 seconds until lose-screen appears
                }, 700);
            }
        }
        return {
            classes,
            inner
        }
    }
}

