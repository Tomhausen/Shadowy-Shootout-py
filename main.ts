namespace SpriteKind {
    export const UI = SpriteKind.create()
    export const bomb = SpriteKind.create()
}

//  variables
let projectile_speed = 120
let knockback_force = 4
let wave_number = 0
let enemy_count = 0
let has_bomb = true
let throw_speed = 60
//  sprites
let me = Render.getRenderSpriteVariable()
Render.moveWithController(4, 3)
let crosshair = sprites.create(assets.image`crosshair`, SpriteKind.UI)
crosshair.setFlag(SpriteFlag.RelativeToCamera, true)
let warning_sprite = sprites.create(assets.image`warning`, SpriteKind.UI)
warning_sprite.setFlag(SpriteFlag.RelativeToCamera, true)
animation.runImageAnimation(warning_sprite, assets.animation`warning animation`, 600, true)
let bomb = sprites.create(assets.image`empty`, SpriteKind.bomb)
//  text sprite
let enemy_counter = textsprite.create("", 1, 3)
update_enemy_counter()
enemy_counter.setFlag(SpriteFlag.RelativeToCamera, true)
enemy_counter.setPosition(80, 115)
//  setup
tiles.setCurrentTilemap(assets.tilemap`level`)
tiles.placeOnRandomTile(me, assets.tile`player spawn`)
info.setLife(3)
spawn_wave()
controller.A.onEvent(ControllerButtonEvent.Pressed, function fire() {
    let dir_x = Render.getAttribute(Render.attribute.dirX)
    let dir_y = Render.getAttribute(Render.attribute.dirY)
    let projectile = sprites.createProjectileFromSprite(assets.image`projectile`, me, dir_x * projectile_speed, dir_y * projectile_speed)
    Render.setSpriteAttribute(projectile, RCSpriteAttribute.ZOffset, randint(-3, 0))
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function throw_bomb() {
    let dir_x: number;
    let dir_y: number;
    
    if (has_bomb) {
        has_bomb = false
        dir_x = Render.getAttribute(Render.attribute.dirX)
        dir_y = Render.getAttribute(Render.attribute.dirY)
        bomb.setPosition(me.x, me.y)
        bomb.setImage(assets.image`bomb`)
        bomb.setVelocity(dir_x * throw_speed, dir_y * throw_speed)
        Render.jumpWithHeightAndDuration(bomb, 5, 750)
        timer.after(750, function detonate_bomb() {
            let nearby_enemies: Sprite[];
            
            animation.runImageAnimation(bomb, assets.animation`explosion`, 100, false)
            nearby_enemies = spriteutils.getSpritesWithin(SpriteKind.Enemy, 60, bomb)
            for (let ghost of nearby_enemies) {
                ghost.destroy()
                enemy_count -= 1
                update_enemy_counter()
                info.changeScoreBy(100)
            }
            pause(400)
            bomb.setImage(assets.image`empty`)
            has_bomb = true
        })
    }
    
})
function update_enemy_counter() {
    enemy_counter.setText("Left in wave:" + enemy_count)
}

function spawn_wave() {
    
    wave_number += 1
    for (let i = 0; i < wave_number; i++) {
        spawn_enemy()
        enemy_count += 1
    }
    update_enemy_counter()
    music.beamUp.play()
}

function spawn_enemy() {
    let ghost = sprites.create(assets.image`ghost`, SpriteKind.Enemy)
    while (spriteutils.distanceBetween(me, ghost) < 250) {
        tiles.placeOnRandomTile(ghost, assets.tile`enemy spawn`)
    }
    tilesAdvanced.followUsingPathfinding(ghost, me, randint(10, 60))
}

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function enemy_hit(projectile: Sprite, enemy: Sprite) {
    
    tilesAdvanced.followUsingPathfinding(enemy, me, 0)
    enemy_count -= 1
    update_enemy_counter()
    info.changeScoreBy(100)
    projectile.destroy()
    enemy.destroy(effects.ashes)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function caught(me: Sprite, enemy: Sprite) {
    info.changeLifeBy(-1)
    music.knock.play()
    me.setVelocity(enemy.vx * knockback_force, enemy.vy * knockback_force)
    Render.jumpWithHeightAndDuration(me, 2, 300)
    timer.after(300, function land() {
        me.setVelocity(0, 0)
    })
    enemy.destroy()
    spawn_enemy()
})
function open_door(sprite: Sprite, door_entry: tiles.Location) {
    let adjacent_tiles = tilesAdvanced.getAdjacentTiles(door_entry, 2)
    for (let tile of adjacent_tiles) {
        if (tile.getImage() == assets.tile`door`) {
            tiles.setWallAt(tile, false)
            timer.after(500, close_doors)
        }
        
    }
}

scene.onOverlapTile(SpriteKind.Player, assets.tile`door entry`, open_door)
function close_doors() {
    if (tiles.tileAtLocationEquals(me.tilemapLocation(), assets.tile`door`)) {
        timer.after(500, close_doors)
    } else {
        tilesAdvanced.setWallOnTilesOfType(assets.tile`door`, true)
    }
    
}

scene.onOverlapTile(SpriteKind.Player, assets.tile`door entry`, open_door)
function check_danger() {
    let nearby_enemies = spriteutils.getSpritesWithin(SpriteKind.Enemy, 80, me)
    if (nearby_enemies.length > 0) {
        warning_sprite.setFlag(SpriteFlag.Invisible, false)
    } else {
        warning_sprite.setFlag(SpriteFlag.Invisible, true)
    }
    
}

game.onUpdate(function tick() {
    check_danger()
    if (enemy_count < 1) {
        spawn_wave()
    }
    
})
