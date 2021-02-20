// Copyright (c) 2021, Ana Carolina Arellano
'use strict';

export default class Square{
    constructor(){
        this.hasMine = false;
        this.adjacentMines = 0;
        this.isFlagged = false;
        this.isRevealed = false;
    }

    addAdjacent(){
        this.adjacentMines++;
    }

    place() {
        this.hasMine = true;
    }

    flag(){
        this.isFlagged = !this.isFlagged;
    }
}