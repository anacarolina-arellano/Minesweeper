// Copyright (c) 2021 Ana Carolina Arellano
'use strict';

import Square from "./Square.js";


export default class Minefield{

    constructor(size = 12, MINE_COUNT = 10){

        this.size = size;
        this.field = []; // turn this into a 2D array of squares
        
        //initialize the minefield with empty squares
        this._init();
        //init minefield with n mines
        this._RandomizeMines(MINE_COUNT);
        //tell all the squares to compute adjacent mines
        this._countAdjacents();
    }

    get SIZE(){ return this.size };
    _init(){
        // create 2D array of squares 
        for(let i = 0; i < this.size; i++){

            this.field[i] =[];
            for(let j = 0 ; j < this.size; j++){
                
                this.field[i][j] = new Square();
            }
        }
    }

    _RandomizeMines(){
        //for each mine, rmdomize row, col

        //place mine at row, col, unless mine already there
    }

    _countAdjacents(){
        // walk through field, for each square count adjacent
    }
}