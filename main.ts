namespace SpriteKind {
    export const UI = SpriteKind.create()
}

//  variables
let projectile_speed = 120
let knockback_force = 4
let wave_number = 0
let enemy_count = 0
//  sprites
let me = Render.getRenderSpriteVariable()
Render.moveWithController(4, 3)
let crosshair = sprites.create(assets.image`crosshair`, SpriteKind.UI)
crosshair.setFlag(SpriteFlag.RelativeToCamera, true)
let warning_sprite = sprites.create(assets.image`warning`, SpriteKind.UI)
warning_sprite.setFlag(SpriteFlag.RelativeToCamera, true)
animation.runImageAnimation(warning_sprite, assets.animation`warning animation`, 600, true)
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
    while (spriteutils.distanceBetween(me, ghost) < 300) {
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
