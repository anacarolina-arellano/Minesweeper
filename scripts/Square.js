// Copyright (c) 2021, Ana Carolina Arellano
'use strict';

export default class Square{
    constructor(){
        this.hasMine = flase;
        //this.location
        this.adjacentMines = 0;
        this.mine = null; // new Mine()
    }

    hasMine(){
        return this.hasMine;
    }
}