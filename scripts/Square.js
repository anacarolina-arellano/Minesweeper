// Copyright (c) 2021, Ana Carolina Arellano
'use strict';

export default class Square{
    constructor(){
        //initially the squares aren't revealed, flagged, 
        // do not have mines and adjacent mines haven't been count
        this.hasMine = false;
        this.adjacentMines = 0;
        this.isFlagged = false;
        this.isRevealed = false;
    }

    //method seen in class
    addAdjacent(){
        //sum 1 to adjacent mines
        this.adjacentMines++;
    }

    //method seen in class
    place() {
        //if mine was placed, turn hasMine to true
        this.hasMine = true;
    }

    //method seen in class
    flag(){
        //change state of attribute isFlagged
        this.isFlagged = !this.isFlagged;
    }
}