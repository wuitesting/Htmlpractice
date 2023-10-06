let config = {
    type: Phaser.AUTO,
    scale: {
        width: innerWidth-15,
        height: innerHeight -15,
    },
    backgroundColor: '#f7f7f7',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 500,
            },
        }
    },
    scene: { preload, create, update, }
};


var captus1Class = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function captus1Class (scene){
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'captus1');          
    }
});

var captus2Class = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function captus2Class (scene){
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'captus5');          
    }
});



let game = new Phaser.Game(config);

function preload() {
    this.load.image("captus1", "assets/captus1.png");
    this.load.image("captus5", "assets/captus5.png");
    this.load.spritesheet('dino', "assets/playerRunSprite.png",{
        frameWidth: 86, frameHight: 86
    });
    this.load.image('platform', "assets/platform.png")
}

function create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.captus1 = this.physics.add.group({
        classType: captus1Class,
        runChildUpdate: true,
        allowGravity: false
    })
    this.captus5 = this.physics.add.group({
        classType: captus2Class,
        runChildUpdate: true,
        allowGravity: false
    })   
    this.captus6 = this.physics.add.group({
        classType: captus2Class,
        runChildUpdate: true,
        allowGravity: false
    }) 
    this.dino = this.physics.add.sprite(100,game.config.height/2,'dino',0).setScale(0.8,0.8);
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('dino',{
            start: 0, end: 3
        }),
        frameRate: 15, 
        repeat : -1
    })
    this.platform = this.add.tileSprite(640, 380, 1200, 30, "platform");
    this.physics.add.existing(this.platform, true); 
    this.platform.body.collideWorldBounds = true;
    this.platform.body.immovable = true;
    this.platform.body.allowGravity = false;


    this.physics.add.collider(this.dino, this.captus1,dinoDie);
    this.physics.add.collider(this.dino, this.captus5,dinoDie);
    this.physics.add.collider(this.dino, this.captus6,dinoDie);
    this.physics.add.collider(this.dino, this.platform)
}
var posX = 1300;
function update(time) {
    if(time%9 == 0){
        if(time%6 == 0){
            this.captus5.get().setActive(true).setVisible(true).setPosition(posX,game.config.height-210).setScale(1,1); 
        }else{
            this.captus1.get().setActive(true).setVisible(true).setPosition(posX,game.config.height-210).setScale(1,1);
        }
        posX += 500
    }else if(time%4 == 0){
        this.captus6.get().setActive(true).setVisible(true).setPosition(posX,game.config.height-210).setScale(1,1);
        posX += 400
    }
    this.captus1.setVelocityX(-300)
    this.captus5.setVelocityX(-300)
    this.captus6.setVelocityX(-300)
    

    console.log(this.dino.y+" "+this.platform.y)

    if (this.cursors.up.isDown && this.dino.y > this.platform.y-100) {
        this.dino.setVelocityY(-300)
        this.dino.anims.play('run', false);
    }
    this.dino.anims.play('run', true);
    this.platform.tilePositionX += 5;
}

function dinoDie(d,p){
    d.active = false 
    d.disableBody(true, true)
}
