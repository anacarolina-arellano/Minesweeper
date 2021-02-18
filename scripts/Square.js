// Copyright (c) 2021, Ana Carolina Arellano
'use strict';

export default class Square{
    constructor(){
        this._hasMine = false;
        this.adjacentMines = 0;
        this.mine = null; // new Mine()
    }

    get hasMine(){
        return this._hasMine;
    }
}