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
        //minefield has 0 revealed squares at the beginning
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
            //play click sound
            clickAudio.play();
            //screen management
            $(".splash-screen").show();
            $(".instructions-screen").hide();
            $(".lost-screen").hide();
            location.reload(); //Consulted page: https://www.w3schools.com/jsref/met_loc_reload.asp
        });

        //when player clicks any square
        $(".square").on('click', event => {
            //bloclkclicking if game is over
            if(this.gameOver) return;
            
            //play music
            clickAudio.play();
            //get clicked element with jquery
            const $selectedEl = $(event.currentTarget);
            //obtain row and col of square
            const row = $selectedEl.data("row");
            const col = $selectedEl.data("col");

            //get square by calling squareAt
            const sq = this.minefield.squareAt(row,col)

            //You can't click more times a square that has
            // already  been revealed
            if(sq.isRevealed) return;

            //reveal the clicked square and send its row and col
            this.reveal(sq, row, col);
        });

        //when player right clicks
        $(".square").on('contextmenu', event => {
            //play audio
            clickAudio.play();
            event.preventDefault();

            //get jquery element
            const $selectedEl = $(event.target);
            //flag element
            this.flag($selectedEl); 
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
            //block clicking pause if game is over
            if(this.gameOver) return;

            //play audio
            clickAudio.play();
            //manage screens
            $(".paused").show();
            $(".run-game").hide();
            //pause clock
            $(".clock").addClass("pauseClock");
        });

        //If player chooses "resume" in the paused screen the
        // clock runs again, the paused-screen is hidden and the
        // run-game screen is shown
        $(".resume").on(`click`, event => {
            //play audio
            clickAudio.play();
            //manage screens
            $(".run-game").show();
            $(".paused").hide();
            //resume clock
            $(".clock").removeClass("pauseClock");
        });

        //If player chooses "Instructions in the run-game screen the
        // clock pauses, the instructions-screen is shown and the
        // run-game screen is hidden
        $(".inst").on(`click`, event => {
            //block clicking on instructions if game is over
            if(this.gameOver) return;

            //play audio
            clickAudio.play();
            //manage screens
            $(".instructions-screen").show();
            $(".paused").hide();
            $(".run-game").hide();
            //pause clock
            $(".clock").addClass("pauseClock");
        });

        //If player chooses "Go Back" in the instructions-screen the
        // clock runs again, the instructions-screen is hidden and the
        // run-game screen is shown
        $(".back").on(`click`, event => {
            //play audio
            clickAudio.play();
            //manage screens
            $(".run-game").show();
            $(".instructions-screen").hide();
            //resume clock
            $(".clock").removeClass("pauseClock");
        });

        //player clicks "play again"
        $(".play-again").on(`click`, event => {
            //play audio
            clickAudio.play();
            //manually restart all variables
            this.board.size = this.minefield.size;
            const numMines = this.minefield.mineCount;
            //this will generate a new minefield with bombs randomly set 
            this.minefield = new Minefield(this.board.size, numMines); 
            this.gameOver = false;
            this.flags  = 0;
            //function calls
            this.generateBoard();
            this.updateHandlers();

            //restart timer
            secondCount = 0;
            //screens management
            $(".run-game").show();
            $(".win-screen").hide();
            $(".lost-screen").hide();
            //clock runs again
            $(".clock").removeClass("pauseClock");
            this.run();
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

        //have the square as variable
        const sq = this.minefield.squareAt(row, col);
        if(!sq.isFlagged){
            //set its attribute "isFlagged" to true
            sq.isFlagged = true; 
            this.flags++;
            //style the square (add background image)
            this.reveal(sq, row, col);  
            //put result into html document
            let styles = this.styleSquare(sq);
            $element.html(styles.inner).addClass(styles.classes); 
        }
        else{
            //set its attribute "isFlagged" to false
            sq.isFlagged = false; 
            //subtract 1 to number of flags
            this.flags--; 
            //show the square in grey again
            $element.removeClass("flag");
        }
        
    }

    //A square is clicked
    reveal(sq, row, col){
        //the square is maked as revealed if it is not flagged
        if(!sq.isFlagged){
            sq.isRevealed = true;
        }
        //increase num of revealed squares
        this.minefield.revealedSqs++;
        //player wins if the only squares that are left unrevealed have mines
        if(this.minefield.revealedSqs  >= (this.minefield.SIZE * this.minefield.SIZE)  - this.minefield.MINECOUNT){
            //game ends
            this.gameOver = true; 
            //manage screens
            $(".run-game").hide();
            $(".win-screen").show();
            $(".lost-screen").hide();
            //clock stops running
            $(".clock").addClass("pauseClock");
            //music pauses
            backgroundAudio.pause();
        }
        //style revealed square
        let styles = this.styleSquare(sq);
        //get element and add classes to html
        const $element = $(`#square-${row}-${col}`);
        $element.html(styles.inner).addClass(styles.classes);

        //if current square has one or more adjacent mines, 
        //stop calling revealZeros function or if square is
        //flag don't reveal adjacent squares
        if(sq.adjacentMines > 0 || sq.isFlagged){
            return;
        }

        //if it has adjacent mines
        // check adjacent square on top
        if(row-1 >= 0){
            //function call if row is no exceeding bounds of board
            this.revealZeros(row-1, col);
        }

        // check adjacent square at the bottom
        if(row+1 < this.board.size){
            //function call if row is no exceeding bounds of board
            this.revealZeros(row+1, col);
        }

        //check adjacent square at the left
        if(col-1 >= 0){
            //function call if row is no exceeding bounds of board
            this.revealZeros(row, col-1);
        }

        // check adjacent square at the right
        if(col+1 < this.board.size){
            //function call if row is no exceeding bounds of board
            this.revealZeros(row, col+1);
        }

    }

    //Method that reveals the squares that do not have mines
    // and haven't been revealed yet
    revealZeros(row, col){
        //get square element from  minefield with received row and col
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
                    //pause clock
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

