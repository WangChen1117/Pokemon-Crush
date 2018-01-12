"use strict";
var score = 0;
var interval = 1000;
var cordY;
var cordX;
var balls = 4;
var getPokemonMode = 0; //track whether the pakage has beeb open
var Pokemon = /** @class */ (function () {
    function Pokemon(name, type, fullHP, hp, level, fullExp, exp) {
        this.name = name;
        this.type = type;
        this.fullHP = fullHP;
        this.hp = hp;
        this.level = level;
        this.fullExp = fullExp;
        this.exp = exp;
    }
    Pokemon.prototype.updateHP = function () {
        $('#hpBar').text('HP : ' + this.hp + '/' + this.fullHP);
        $('#hp').css('width', (this.hp / this.fullHP * 100).toString() + "px");
    };
    Pokemon.prototype.updateExp = function () {
        $('#expBar').text('EXP : ' + this.exp + '/' + this.fullExp);
        $('#exp').css('width', (this.exp / this.fullExp * 100).toString() + "px");
    };
    Pokemon.prototype.updateLevel = function () {
        $('#level').text('LEVEL : ' + this.level);
    };
    Pokemon.prototype.levelUp = function () {
        this.level += 1;
        this.fullExp = 2 * this.level;
        this.exp = 0;
        this.fullHP = this.level * 2;
        this.hp = this.fullHP;
        this.updateHP();
        this.updateExp();
        this.updateLevel();
    };
    Pokemon.prototype.evolve = function () {
        this.fullExp += 20;
        this.hp = this.fullExp;
    };
    return Pokemon;
}());
var currPokemon = new Pokemon("pika", "lightning", 2, 2, 1, 2, 0);
var pokemonPackages = [currPokemon];
var monsters = ['firemonster', 'watermonster', 'leafmonster', 'toxicmonster', 'windmonster', 'bugmonster'];
var fire1 = new Pokemon("fire1", "fire", 2, 2, 1, 2, 0);
var addableMonsters = [];
var compare = {
    fire: [['leaf', 'bug'], ['fire', 'water']],
    water: [['fire'], ['water', 'leaf']],
    leaf: [['water'], ['leaf', 'fire', 'wind', 'bug', 'toxic']],
    lightning: [['water', 'wind', 'toxic'], ['lightning', 'leaf']],
    normal: [[' '], [' ']],
    wind: [['leaf', 'bug'], [' ']],
    bug: [['leaf'], ['bug', 'fire', 'wind', 'toxic']],
    toxic: [['leaf', 'bug'], ['toxic']]
};
var dic = {
    fire: ['fire1', 'fire2', 'fire3', 'firemonster1', 'firemonster2'],
    water: ['water1', 'water2', 'water3', 'watermonster1', 'watermonster2', 'firemonster3'],
    leaf: ['leaf1', 'leaf2', 'leaf3', 'leafmonster1', 'leafmonster2', 'leafmonster3'],
    lightning: ['pika'],
    normal: ['normalmonster1', 'normalmonster2'],
    wind: ['windmonster1', 'windmonster2', 'windmonster3'],
    bug: ['bugmonster1', 'bugmonster2', 'bugmonster3'],
    toxic: ['toxicmonster1', 'toxicmonster2', 'toxicmonster3']
};
$(function () {
    //init addableMonsters list
    for (var i = 0; i < monsters.length; i++) {
        var poke = new Pokemon(monsters[i], monsters[i].replace('monster', ''), 2, 2, 1, 2, 0);
        addableMonsters.push(poke);
    }
    $(window).keypress(function () {
        // addAttack(cordY);
        addMonster();
    });
    currPokemon.updateHP();
    currPokemon.updateExp();
    $('#gameArea').mousemove(function (e) {
        if (e.clientY != undefined && e.clientY > 100 && e.clientX != undefined) {
            cordY = e.clientY;
            cordX = e.clientX;
            $('#curmon').css('top', (e.clientY - 125).toString() + "px");
            $('#curmon').css('left', (e.clientX - 35).toString() + "px");
        }
    });
    //open the pokeballs
    $('#pokeBall').on('click', function () {
        if (getPokemonMode == 0) {
            $('#pokemonList').css('width', '100px');
            $('#pokemonList').css('padding', '10px');
            getPokemonMode = 1;
        }
        else {
            $('#pokemonList').css('width', '0px');
            $('#pokemonList').css('padding', '0px');
            getPokemonMode = 0;
        }
    });
    $('.pokeHolder').on('click', function () {
        var imglink = $(this).css('background-image');
        var name = imglink.split('/')[imglink.split('/').length - 1].split('.')[0];
        if (name != 'poke1') {
            var index = +this.classList[1][3];
            var temp = pokemonPackages[index];
            pokemonPackages[index] = currPokemon;
            currPokemon = temp;
            pokemonPackages[0] = currPokemon;
            showPakages();
        }
    });
    $('.abandon').on('click', function () {
        var index = +this.classList[1][1];
        console.log($('.loc' + index.toString()).css('background-image'));
        if ($('.loc' + index.toString()).css('background-image').match(/poke1/g) == null) {
            var r = confirm('You sure to abandon it?');
            if (r == true) {
                pokemonPackages.splice(index, 1);
                balls += 1;
                $('#ballsInfo').text('X ' + balls.toString());
                if (index != pokemonPackages.length) {
                    var temp = pokemonPackages[index];
                    pokemonPackages[index] = currPokemon;
                    pokemonPackages[0] = temp;
                    currPokemon = temp;
                    console.log(pokemonPackages);
                }
                showPakages();
            }
        }
    });
    $('#gameArea').on('click', function () {
        if (getPokemonMode == 1) {
            $('#pokemonList').css('width', '0px');
            $('#pokemonList').css('padding', '0px');
            getPokemonMode = 0;
        }
    });
});
function addMonster() {
    var height = +$('#gameArea').css("height").replace('px', '');
    var y = Math.random() * height;
    var poke = addableMonsters[Math.floor(Math.random() * addableMonsters.length)];
    var monsterName = poke.name;
    var monsterType = poke.type;
    var img = "'./img/" + monsterName + ".png'";
    var style = 'style="top:' + y + 'px; background-image:url(' + img + ')"';
    $('#gameArea').append('<div onmouseover="javascript:monsterHover(this)" class="monster ' + monsterName + ' ' + monsterType + ' "' + style + '></div>');
}
function calculateHpExp(poke1type, poke2type) {
    if (compare[poke1type][0].indexOf(poke2type) >= 0) {
        currPokemon.exp += 2;
    }
    else if (compare[poke1type][1].indexOf(poke2type) >= 0) {
        currPokemon.hp -= 2;
        currPokemon.exp += 1;
    }
    else {
        currPokemon.hp -= 1;
        currPokemon.exp += 1;
    }
}
function monsterHover(x) {
    var monsterName = x.classList[1];
    var monsterType = x.classList[2];
    if (currPokemon.hp >= 0) {
        calculateHpExp(currPokemon.type, monsterType);
        if (getPokemonMode == 1 && balls > 0) {
            pokemonPackages.push(new Pokemon(monsterName + "1", monsterType, 2, 2, 1, 2, 0));
            showPakages();
            balls -= 1;
            $('#ballsInfo').text('X ' + balls.toString());
        }
        $(x).remove();
        score += 1;
        $('#score').text("SCORE : " + score);
        currPokemon.updateHP();
        currPokemon.updateExp();
        if (currPokemon.exp >= currPokemon.fullExp) {
            currPokemon.levelUp();
        }
    }
}
function showPakages() {
    $('.pokeHolder').css('background-image', 'url("./img/poke1.png")');
    $('.pokeInfo').text('');
    for (var i = 0; i < pokemonPackages.length; i++) {
        var imglink = "'./img/" + pokemonPackages[i].name + ".png'";
        var giflink = "'./img/" + pokemonPackages[i].name + ".gif'";
        if (i == 0) {
            $('#curmon').css('background-image', "url(" + imglink + ")");
            $('#curPokemon').css('background-image', "url(" + giflink + ")");
            pokemonPackages[0].updateHP();
            pokemonPackages[0].updateExp();
            pokemonPackages[0].updateLevel();
        }
        else {
            $('.loc' + i.toString()).css('background-image', "url(" + giflink + ")");
            $('.p' + i.toString()).text('Level.' + pokemonPackages[i].level.toString());
        }
    }
}
