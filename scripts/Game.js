// Copyright (c) 2021 Ana Carolina Arellano
'use strict';

//import Minefield from "./Minefield"

const DEFAULT_SIZE = 12;
const MINE_COUNT = 10;
export default class Game{

    constructor(size = DEFAULT_SIZE){
        //Create a game
        this.board = {
            size : size,
        };
       // this.minefield = new Minefield(size, MINE_COUNT);
        this.gameOver = false;
        
        this.generateBoard();

        this.message = "Welcome to Minesweeper";
        document.querySelector("#test-button").
            addEventListener('click', event => this.eventHandler(event));


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