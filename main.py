@namespace
class SpriteKind:
    UI = SpriteKind.create()
    bomb = SpriteKind.create()

# variables
projectile_speed = 120
knockback_force = 4
wave_number = 0
enemy_count = 0
has_bomb = True
throw_speed = 60

# sprites
me = Render.get_render_sprite_variable()
Render.move_with_controller(4, 3)
crosshair = sprites.create(assets.image("crosshair"), SpriteKind.UI)
crosshair.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
warning_sprite = sprites.create(assets.image("warning"), SpriteKind.UI)
warning_sprite.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
animation.run_image_animation(warning_sprite, assets.animation("warning animation"), 600, True)
bomb = sprites.create(assets.image("empty"), SpriteKind.bomb)

# text sprite
enemy_counter = textsprite.create("", 1, 3)
update_enemy_counter()
enemy_counter.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
enemy_counter.set_position(80, 115)

# setup
tiles.set_current_tilemap(assets.tilemap("level"))
tiles.place_on_random_tile(me, assets.tile("player spawn"))
info.set_life(3)
spawn_wave()

def fire():
    dir_x = Render.get_attribute(Render.attribute.DIR_X)
    dir_y = Render.get_attribute(Render.attribute.DIR_Y)
    projectile = sprites.create_projectile_from_sprite(
        assets.image("projectile"),
        me,
        dir_x * projectile_speed,
        dir_y * projectile_speed
    )
    Render.set_sprite_attribute(projectile, RCSpriteAttribute.ZOFFSET, randint(-3, 0))
controller.A.on_event(ControllerButtonEvent.PRESSED, fire)

def throw_bomb():
    global has_bomb
    if has_bomb:
        has_bomb = False
        dir_x = Render.get_attribute(Render.attribute.DIR_X)
        dir_y = Render.get_attribute(Render.attribute.DIR_Y)
        bomb.set_position(me.x, me.y)
        bomb.set_image(assets.image("bomb"))
        bomb.set_velocity(dir_x * throw_speed, dir_y * throw_speed)
        Render.jump_with_height_and_duration(bomb, 5, 750)
        timer.after(750, detonate_bomb)
controller.B.on_event(ControllerButtonEvent.PRESSED, throw_bomb)

def detonate_bomb():
    global has_bomb, enemy_count
    animation.run_image_animation(bomb, assets.animation("explosion"), 100, False)
    nearby_enemies = spriteutils.get_sprites_within(SpriteKind.enemy, 60, bomb)
    for ghost in nearby_enemies:
        ghost.destroy()
        enemy_count -= 1
        update_enemy_counter()
        info.change_score_by(100)
    pause(400)
    bomb.set_image(assets.image("empty"))
    has_bomb = True

def update_enemy_counter():
    enemy_counter.set_text("Left in wave:" + enemy_count)

def spawn_wave():
    global wave_number, enemy_count
    wave_number += 1
    for i in range(wave_number):
        spawn_enemy()
        enemy_count += 1
    update_enemy_counter()
    music.beam_up.play()

def spawn_enemy():
    ghost = sprites.create(assets.image("ghost"), SpriteKind.enemy)
    while(spriteutils.distance_between(me, ghost) < 250):
        tiles.place_on_random_tile(ghost, assets.tile("enemy spawn"))
    tilesAdvanced.follow_using_pathfinding(ghost, me, randint(10, 60))
    
def enemy_hit(projectile, enemy):
    global enemy_count
    tilesAdvanced.follow_using_pathfinding(enemy, me, 0)
    enemy_count -= 1
    update_enemy_counter()
    info.change_score_by(100)
    projectile.destroy()
    enemy.destroy(effects.ashes)
sprites.on_overlap(SpriteKind.projectile, SpriteKind.enemy, enemy_hit)

def caught(me, enemy):
    info.change_life_by(-1)
    music.knock.play()
    me.set_velocity(enemy.vx * knockback_force, enemy.vy * knockback_force)
    Render.jump_with_height_and_duration(me, 2, 300)
    timer.after(300, land)
    enemy.destroy()
    spawn_enemy()
sprites.on_overlap(SpriteKind.Player, SpriteKind.enemy, caught)

def land():
    me.set_velocity(0, 0)

def open_door(sprite, door_entry):
    adjacent_tiles = tilesAdvanced.get_adjacent_tiles(door_entry, 2)
    for tile in adjacent_tiles:
        if tile.get_image() == assets.tile("door"):
            tiles.set_wall_at(tile, False)
            timer.after(500, close_doors)
scene.on_overlap_tile(SpriteKind.player, assets.tile("door entry"), open_door)

def close_doors():
    if tiles.tile_at_location_equals(me.tilemap_location(), assets.tile("door")):
        timer.after(500, close_doors)
    else:
        tilesAdvanced.set_wall_on_tiles_of_type(assets.tile("door"), True)
scene.on_overlap_tile(SpriteKind.player, assets.tile("door entry"), open_door)

def check_danger():
    nearby_enemies = spriteutils.get_sprites_within(SpriteKind.enemy, 80, me)
    if len(nearby_enemies) > 0:
        warning_sprite.set_flag(SpriteFlag.INVISIBLE, False)
    else:
        warning_sprite.set_flag(SpriteFlag.INVISIBLE, True)

def tick():
    check_danger()
    if enemy_count < 1:
        spawn_wave()
game.on_update(tick)
