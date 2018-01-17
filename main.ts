let score:number = 0;
let interval:number = 1000;
let cordY:number;
let cordX:number;
let balls:number = 4;
let getPokemonMode:number = 0; //track whether the pakage has beeb open


class Pokemon{
    name:string;
    type:string;
    fullHP:number;
    hp:number;
    level:number;
    fullExp:number;
    exp:number;
    
    constructor(name:string, type:string, fullHP:number, hp:number, level:number, fullExp:number, exp:number){
        this.name = name;
        this.type = type;
        this.fullHP = fullHP;
        this.hp = hp;
        this.level = level;
        this.fullExp = fullExp;
        this.exp = exp;
    }

    updateHP(){
        $('#hpBar').text('HP : '+this.hp+'/'+this.fullHP);
        $('#hp').css('width',(this.hp/this.fullHP*100).toString()+"px");
    }

    updateExp(){
        $('#expBar').text('EXP : '+this.exp+'/'+this.fullExp);
        $('#exp').css('width',(this.exp/this.fullExp*100).toString()+"px");
    }

    updateLevel(){
        $('#level').text('LEVEL : '+this.level);
    }

    levelUp(){
        this.level += 1;
        this.fullExp = 2*this.level;
        this.exp = 0;
        this.fullHP = this.level*2;
        this.hp = this.fullHP;
        this.updateHP();
        this.updateExp();
        this.updateLevel();
    }

    evolve(){
        this.fullExp += 20;
        this.hp = this.fullExp;
    }
}



let currPokemon:Pokemon = new Pokemon("pika","lightning",2,2,1,2,0);
let pokemonPackages:Pokemon[] = [currPokemon];
let monsters:string[] = ['firemonster','watermonster','leafmonster','toxicmonster','windmonster','bugmonster'];

let fire1:Pokemon = new Pokemon("fire","fire",2,2,1,2,0);
let water1:Pokemon = new Pokemon("water","water",2,2,1,2,0);
let leaf1:Pokemon = new Pokemon("leaf","leaf",2,2,1,2,0);
let addableMonsters:Pokemon[] = [];

interface relations{
    [key:string]:any;
    fire:string[][];
    water:string[][];
    leaf:string[][];
    normal:string[][];
    lightning:string[][];
    wind:string[][];
    bug:string[][];
    toxic:string[][];
}

let compare:relations = {
    fire:[['leaf','bug'],['fire','water']],
    water:[['fire'],['water','leaf']],
    leaf:[['water'],['leaf','fire','wind','bug','toxic']],
    lightning:[['water','wind','toxic'],['lightning','leaf']],
    normal:[[' '],[' ']],
    wind:[['leaf','bug'],[' ']],
    bug:[['leaf'],['bug','fire','wind','toxic']],
    toxic:[['leaf','bug'],['toxic']]
}

interface dictionary{
    fire:string[];
    water:string[];
    leaf:string[];
    lightning:string[];
    normal:string[];
    wind:string[];
    bug:string[];
    toxic:string[];
}

let dic:dictionary = {
    fire:['fire1','fire2','fire3','firemonster1','firemonster2'],
    water:['water1','water2','water3','watermonster1','watermonster2','firemonster3'],
    leaf:['leaf1','leaf2','leaf3','leafmonster1','leafmonster2','leafmonster3'],
    lightning:['pika'],
    normal:['normalmonster1','normalmonster2'],
    wind:['windmonster1','windmonster2','windmonster3'],
    bug:['bugmonster1','bugmonster2','bugmonster3'],
    toxic:['toxicmonster1','toxicmonster2','toxicmonster3']
}

$(function(){

    //init addableMonsters list
    for(let i = 0; i<monsters.length; i++){
        let poke = new Pokemon(monsters[i],monsters[i].replace('monster',''),2,2,1,2,0);
        addableMonsters.push(poke);
    }

    addableMonsters.push(fire1);
    addableMonsters.push(water1);
    addableMonsters.push(leaf1);


    $(window).keypress(function(){
        // addAttack(cordY);
        addMonster();
    })

    currPokemon.updateHP();
    currPokemon.updateExp();

    $('#gameArea').mousemove(function(e){
        if(e.clientY!=undefined && e.clientY>100 && e.clientX!=undefined){
            cordY = e.clientY;
            cordX = e.clientX;
            $('#curmon').css('top',(e.clientY-125).toString()+"px")
            $('#curmon').css('left',(e.clientX-35).toString()+"px")
        }
    })

    //open the pokeballs
    $('#pokeBall').on('click',function(){
        if(getPokemonMode==0){
            $('#pokemonList').css('width','100px');
            $('#pokemonList').css('padding','10px');
            getPokemonMode = 1;
        } else {
            $('#pokemonList').css('width','0px');
            $('#pokemonList').css('padding','0px');
            getPokemonMode = 0;
        }
        
    })

    $('.pokeHolder').on('click',function(){
        let imglink:string = $(this).css('background-image');
        let name = imglink.split('/')[imglink.split('/').length-1].split('.')[0];
        if(name!='poke1'){
            let index:number = +this.classList[1][3];
            let temp = pokemonPackages[index];
            pokemonPackages[index] = currPokemon;
            currPokemon = temp;
            pokemonPackages[0] = currPokemon;
            console.log(currPokemon)
            showPakages();
        }
    })

    $('.abandon').on('click',function(){
        let index = +this.classList[1][1];
        console.log($('.loc'+index.toString()).css('background-image'))
        if($('.loc'+index.toString()).css('background-image').match(/poke1/g)==null){
            let r = confirm('You sure to abandon it?');
            if(r == true){
                pokemonPackages.splice(index,1);
                balls+=1;
                $('#ballsInfo').text('X '+balls.toString());
    
                if(index!=pokemonPackages.length){
                    let temp = pokemonPackages[index];
                    pokemonPackages[index] = currPokemon;
                    pokemonPackages[0] = temp;
                    currPokemon = temp;
                    console.log(pokemonPackages)
                }
                showPakages();
    
            }
        }
        
    })

    $('#gameArea').on('click',function(){
        if(getPokemonMode==1){
            $('#pokemonList').css('width','0px');
            $('#pokemonList').css('padding','0px');
            getPokemonMode = 0;
        }
    })

})

function addMonster(){
    let height:number = +$('#gameArea').css("height").replace('px','');
    let y:number = Math.random()*height;
    let poke = addableMonsters[Math.floor(Math.random()*addableMonsters.length)];
    let monsterName:string = poke.name;
    let monsterType:string = poke.type;
    let img:string = "'./img/"+monsterName+".png'";
    let style:string = 'style="top:'+y+'px; background-image:url('+img+')"';
    $('#gameArea').append('<div onmouseover="javascript:monsterHover(this)" class="monster '+monsterName+'" '+style+'></div>');
}

function calculateHpExp(poke1type:string,poke2type:string){
    if(compare[poke1type][0].indexOf(poke2type)>=0){
        currPokemon.exp += 2;
    } else if(compare[poke1type][1].indexOf(poke2type)>=0) {
        currPokemon.hp -= 2;
        currPokemon.exp += 1;
    } else {
        currPokemon.hp-=1;
        currPokemon.exp+=1;
    }
}

function monsterHover(x:any){
    let monsterName = x.classList[1];
    let monsterType = monsterName.replace('monster','');
    console.log(x.classList)
    console.log(monsterType)
    if(currPokemon.hp>=0){
        calculateHpExp(currPokemon.type,monsterType);
        if(getPokemonMode==1 && balls>0){
            pokemonPackages.push(new Pokemon(monsterName+"1",monsterType,2,2,1,2,0));
            showPakages();
            balls -= 1;
            $('#ballsInfo').text('X '+balls.toString());
        }
        $(x).remove();
        score += 1;
        $('#score').text("SCORE : "+score);
        currPokemon.updateHP();
        currPokemon.updateExp();
        if(currPokemon.exp>=currPokemon.fullExp){
            currPokemon.levelUp();
        }       
    }

}

function showPakages(){
    $('.pokeHolder').css('background-image','url("./img/poke1.png")');
    $('.pokeInfo').text('');
    for(let i = 0; i<pokemonPackages.length; i++){
        let imglink = "'./img/"+pokemonPackages[i].name+".png'";
        let giflink = "'./img/"+pokemonPackages[i].name+".gif'";
        if(i==0){
            $('#curmon').css('background-image',"url("+imglink+")");
            $('#curPokemon').css('background-image',"url("+giflink+")");
            pokemonPackages[0].updateHP();
            pokemonPackages[0].updateExp();
            pokemonPackages[0].updateLevel();
        } else {
            $('.loc'+i.toString()).css('background-image',"url("+giflink+")");
            $('.p'+i.toString()).text('Level.'+pokemonPackages[i].level.toString())
        }

    }
}