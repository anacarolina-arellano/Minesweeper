// Copyright (c) 2021 Ana Carolina Arellano
'use strict';

import Minefield from "./Minefield.js"

const DEFAULT_SIZE = 12;
const MINE_COUNT = 10;
export default class Game{

    constructor(size = DEFAULT_SIZE){
        //Create a game
        this.board = {
            size : size,
        };
        this.minefield = new Minefield(size, MINE_COUNT);
        this.gameOver = false;

        const config = {
            formats: ["mp3"],
            preload: true,
            autoplay: false,
            loop: true,
        };
        this.sampleSound = new buzz.sound("../sounds/background_music", config);
        
        this.message = "Welcome to Minesweeper";
        document.querySelector("#test-button").
            addEventListener('click', event => this.eventHandler(event));
        
        this.generateBoard();
        this.updateHandlers();
    }

    get DEFAULT_SIZE() { return DEFAULT_SIZE};
    get MINE_COUNT() { return MINE_COUNTS};

    updateHandlers(){

        document.querySelectorAll(".square")
            .forEach( element => {
                element.addEventListener('click', event => {

                    const id = event.target.id;

                    const classList = event.target.classList.add("hide")
                })
            })
    }
    eventHandler( event ){
        document.querySelector("#demo").innerHTML = this.message;
    }

    run(){
        while(!this.gameOver){
            this.update();
            this.render();
        }
    }

    update() {
        //get user input and update the game simulation
        this.gameOver = true;
    }

    render() {
        //change the DOM and the screen to show the player what's going on
        
        //generate the playfield
        this.generateBoard();
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
           // const id = 'square-${row}-${col}';   
            markup += "<td><div></div></td>";
           }
           markup += "</tr>";
       }
       markup += "</table>";

       let screen = document.getElementById('game-screen');
       screen.querySelector(".game-grid").innerHTML = markup;
    }
}