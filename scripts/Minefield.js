// Copyright (c) 2021 Ana Carolina Arellano
'use strict';

import Square from "./Square.js";


export default class Minefield{

    constructor(size, mineCount){

        this.size = size;
        this.field = []; // turn this into a 2D array of squares
        this.revealedSqs = 0; //count the number of revealed squares
        
        //initialize the minefield with empty squares
        this.init();
        //init minefield with n mines
        this.randomizeMines(mineCount);
        //tell all the squares to compute adjacent mines
        this.adjacentMines();
    }

    get SIZE(){ return this.size };

    //Method seen in class
    init(){
        // create 2D array of squares 
        for(let i = 0; i < this.size; i++){

            this.field[i] =[];
            for(let j = 0 ; j < this.size; j++){
                
                this.field[i][j] = new Square();
            }
        }
    }

    //Method seen in class
    squareAt(row, col){
        //find square at row, col and return it
        return this.field[row][col];
    }

    //Method seen in class
    randomizeMines(mineCount = 1){
        //for each mine, randomize row, col
        for(let i = 0; i < mineCount; i++){
            let theresMine = false;
            do{
                //obtain random number for row and column
                const row = Math.floor(Math.random() * this.size);
                const col = Math.floor(Math.random() * this.size);

                //place mine at row, col, unless mine already there
                const mySquare = this.field[row][col];
                theresMine = mySquare.hasMine;
                if(!theresMine){
                    //no mine so place one
                    mySquare.place();
                    //add one to the adjacent count
                    this.adjacentMines(row, col);
                }
            }while(theresMine);
        }
    }

    //Method seen in class
    adjacentMines(row, col){
        // walk through field, for each square count adjacent
        for(let i = row - 1; i <= row + 1; i++){
            for(let j = col - 1; j <= col + 1; j++){
                if((i >= 0) && (j >= 0) && (i < this.size) && (j < this.size)){
                    this.field[i][j].addAdjacent();
                }
            }
        }
    }
}