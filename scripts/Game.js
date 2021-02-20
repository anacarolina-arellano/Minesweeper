// Copyright (c) 2021 Ana Carolina Arellano
'use strict';

import Minefield from "./Minefield.js"

const DEFAULT_SIZE = 12;
const DEFAULT_MINE = 20;
export default class Game{

    constructor(size = DEFAULT_SIZE, mineCount = DEFAULT_MINE){
        //Create a game
        this.board = {
            size : size,
        };
        this.minefield = new Minefield(size, mineCount);
        this.gameOver = false;

        const config = {
            formats: ["mp3"],
            preload: true,
            autoplay: false,
            loop: true,
        };
        this.sampleSound = new buzz.sound("../sounds/background_music", config);

        this.generateBoard();
        this.updateHandlers();
    }

    get DEFAULT_SIZE() { return DEFAULT_SIZE};
    get MINE_COUNT() { return MINE_COUNT};

    updateHandlers(){

        $(".play").on(`click`, event => {
            
            $(".splash-screen").hide();
            $(".run-game").show();
        });

        $(".easy").on(`click`, event => {
            
            $(".splash-screen").hide();
            $(".run-game").show();
        });

        $(".on-pause").on(`click`, event => {
            $(".paused").show();
            $(".run-game").hide();
        });

        $(".resume").on(`click`, event => {
            $(".run-game").show();
            $(".paused").hide();
        });

        $(".inst").on(`click`, event => {
            $(".instructions-screen").show();
            $(".paused").hide();
            $(".run-game").hide();
        });

        $(".back").on(`click`, event => {
            $(".run-game").show();
            $(".instructions-screen").hide();
        });

        $(".quit").on(`click`, event => {
            $(".splash-screen").show();
            $(".instructions-screen").hide();
            $(".lost-screen").hide();
            location.reload(); //Consulted page: https://www.w3schools.com/jsref/met_loc_reload.asp
        });

        $(".medium").on(`click`, event =>{          
                $(".splash-screen").hide();
                $(".run-game").show();
        });

        $(".hard").on(`click`, event =>{          
            $(".splash-screen").hide();
            $(".run-game").show();
        });

        //Took as reference: https://stackoverflow.com/questions/12260235/jquery-on-hover-not-functioning
        $(".dif").on(`mouseenter`, event => {
            $(".my-options").show();
        }).on(`mouseleave`, event =>{
            $(".my-options").hide();
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

    // Consulted StackOverflow to make this function
    // Reference at the end of index.html
    startTimer(){
        var myDay = new Date();
        var minutes = myDay.getMinutes();
        var seconds = myDay.getSeconds();
        
        if(seconds < 10){
            seconds = "0" + seconds;
        }else{
            seconds += seconds;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }else{
            minutes+= minutes;
        }

        $(".clock").html(minutes+ " : " + seconds);
     //   setTimeout(this.startTimer(), 500);            
    }

    //Consulted page: https://jsfiddle.net/Mottie/sML8b/
    run(){
        setInterval(this.startTimer(), 1000);
        //let secondCount = 0;
        //const $timerEl = $(".clock");
        //let timer = window.setInterval( () => {
          //  $timerEl.html(secondCount);
            //secondCount++;
            //if (this.gameOver){
              //  window.clearInterval(timer);
           // }
        //}, 1000);
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

    flag($element){
        const row = $element.data("row");
        const col = $element.data("col");

        const sq = this.minefield.squareAt(row, col);
        sq.isFlagged = true;
        let styles = this.styleSquare($element);
        $element.html(styles.inner).addClass(styles.classes);
    }
    reveal($element){
        const row = $element.data("row");
        const col = $element.data("col");

        const sq = this.minefield.squareAt(row, col);
        sq.isRevealed = true;
        let styles = this.styleSquare(sq);
        $element.html(styles.inner).addClass(styles.classes);
    }
    styleSquare( aSquare){
        let classes = " square";
        let inner = "";

        if(aSquare.isFlagged){
            classes += " flag";
        }
        // Is the square revealed?
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

