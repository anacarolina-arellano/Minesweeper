// Copyright (c) 2021 Ana Carolina Arellano
'use strict';

import Minefield from "./Minefield.js"

const DEFAULT_SIZE = 12;
const DEFAULT_MINE = 20;
export default class Game{

    constructor(size , mineCount){
        //Create a game
        this.board = {
            size : size,
        };
        this.minefield = new Minefield(size, mineCount);
        this.gameOver = false;

        const config = {
            formats: ["mp3"],
            preload: true,
            autoplay: true,
            loop: true,
        };
        this.sampleSound = new buzz.sound("../sounds/background_music", config);

        this.generateBoard();
        this.updateHandlers();
    }

    get DEFAULT_SIZE() { return DEFAULT_SIZE};
    get MINE_COUNT() { return MINE_COUNT};

    updateHandlers(){

        $(".quit").on(`click`, event => {
            $(".splash-screen").show();
            $(".instructions-screen").hide();
            $(".lost-screen").hide();
            location.reload(); //Consulted page: https://www.w3schools.com/jsref/met_loc_reload.asp
        });

        $(".square").on('click', event => {
            const $selectedEl = $(event.target);
            this.reveal($selectedEl);
        });

        $(".square").on('contextmenu', event => {
            event.preventDefault();

            const $selectedEl = $(event.target);
            this.flag($selectedEl);
        })
    }
      
    //Consulted page for pausing https://stackoverflow.com/questions/3969475/javascript-pause-settimeout
    run(){

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
            $(".paused").show();
            $(".run-game").hide();
            $(".clock").addClass("pauseClock");
        });

        //If player chooses "resume" in the paused screen the
        // clock runs again, the paused-screen is hidden and the
        // run-game screen is shown
        $(".resume").on(`click`, event => {
            $(".run-game").show();
            $(".paused").hide();
            $(".clock").removeClass("pauseClock");
        });

        //If player chooses "Instructions in the run-game screen the
        // clock pauses, the instructions-screen is shown and the
        // run-game screen is hidden
        $(".inst").on(`click`, event => {
            $(".instructions-screen").show();
            $(".paused").hide();
            $(".run-game").hide();
            $(".clock").addClass("pauseClock");
        });

        //If player chooses "Go Back" in the instructions-screen the
        // clock runs again, the instructions-screen is hidden and the
        // run-game screen is shown
        $(".back").on(`click`, event => {
            $(".run-game").show();
            $(".instructions-screen").hide();
            $(".clock").removeClass("pauseClock");
        });
    }

    generateBoard(){
        /*
        <table>
            <tr><td></td>...</tr>
        </table>
        */ 
       let markup = "<table>";
       for(let row = 0; row < this.board.size; row++){
           markup += "<tr>";
           for(let col = 0; col < this.board.size; col++){
            
        const id = `square - ${row} - ${col}`;
        const mySquare = this.minefield.squareAt(row, col);
           
        let myStyle = this.styleSquare(mySquare);
        
        const dataAttributes = `data-row = "${row}" data-col = "${col}"`;
            markup += `<td id = "${id}" class = "${myStyle.classes} " ${dataAttributes}>${myStyle.inner}</td>`;
           }
           markup += "</tr>";
       }
       markup += "</table>";

       $("#game-grid").html(markup);
    }

    //Flag a chosen square
    flag($element){
        //obtain row and col of square
        const row = $element.data("row");
        const col = $element.data("col");

        //have the square as variable
        const sq = this.minefield.squareAt(row, col);
        sq.isFlagged = true; //set its attribute "isFlagged" to true
        let styles = this.styleSquare($element); //style the square (add background image)
        $element.html(styles.inner).addClass(styles.classes); //put result into html document
    }

    //A square is clicked
    reveal($element){
        const row = $element.data("row");
        const col = $element.data("col");

        const sq = this.minefield.squareAt(row, col);
        sq.isRevealed = true;
        this.minefield.revealedSqs++;
        if(this.minefield.revealedSqs === (this.size - this.mineCount)){
            this.gameOver = true;
            $(".run-game").hide();
            $(".win-screen").show();
        }
        let styles = this.styleSquare(sq);
        $element.html(styles.inner).addClass(styles.classes);
    }

    //Logic seen in class
    //adds 
    styleSquare( aSquare){
        let classes = " square";
        let inner = "";

        if(aSquare.isFlagged){
            classes += " flag";
        }
        // Is the square revealed
        else if (aSquare.isRevealed) {
            classes += ( aSquare.hasMine ? " mine" : ` revealed color-${aSquare.adjacentMines}`);
            inner = `${aSquare.adjacentMines}`;

            //Consulted page: https://www.sitepoint.com/delay-sleep-pause-wait/ (delay lost-screen)
            if(aSquare.hasMine){
                this.gameOver = true;
                setTimeout(() => {  
                    $(".run-game").hide();
                    $(".lost-screen").show();
                }, 700);
            }
        }
        return {
            classes,
            inner
        }
    }
}

