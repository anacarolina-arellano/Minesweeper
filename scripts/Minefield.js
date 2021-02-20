// Copyright (c) 2021 Ana Carolina Arellano
'use strict';

import Square from "./Square.js";


export default class Minefield{

    constructor(size = 12, mineCount= 20){

        this.size = size;
        this.field = []; // turn this into a 2D array of squares
        
        //initialize the minefield with empty squares
        this.init();
        //init minefield with n mines
        this.randomizeMines(mineCount);
        //tell all the squares to compute adjacent mines
        this.adjacentMines();
    }

    get SIZE(){ return this.size };


    init(){
        // create 2D array of squares 
        for(let i = 0; i < this.size; i++){

            this.field[i] =[];
            for(let j = 0 ; j < this.size; j++){
                
                this.field[i][j] = new Square();
            }
        }
    }

    squareAt(row, col){
        //find square at row, col and return it
        return this.field[row][col];
    }

    randomizeMines(mineCount = 1){
        //for each mine, randomize row, col
        for(let i = 0; i < mineCount; i++){
            let theresMine = false;
            do{
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