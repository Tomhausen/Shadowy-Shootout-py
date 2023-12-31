// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level":
            case "level1":return tiles.createTilemap(hex`1900190001010101010101010101010101010101010101010101010101010400000000000000000000000000000000000000000004010100050000000000000000000000040000000400000000000101000002020200000000000000000002020000000000000001010000000000000406000000000000000000000000000004010100000400000202070202020203020000020302020202020101000000000002040600040200000000000002040000000201010000000000020000000002000000000000030000000403010102020200000204000004020000000000000204000000020101000000000002020002030200000000000002020200000201010000000000020000000000000004000000000000000002010100000400000200040000000002020202000000020202020101000002000002000000000000020202020000000000040201010000020000020000000000000004000000000000000002010100000200000202030200000203020000020202000202020101000002000002040000000000040200000204000000040201010000040000020000000000000002000003000000000003010100000200000200000000000000020000020000000000020101000002000002040000060000040200000200000400000201010000020000020202020702020203000003000000000003010100000000000400000006000000040000020400000004020101000200020000000000000000000000000202020002020201010000000000000000000000000400000000000000000000010104000000000000000000000000000000000000000000040101010101010101010101010101010101010101010101010101`, img`
2222222222222222222222222
2.......................2
2.......................2
2..222.........22.......2
2.......................2
2.....222222222..22222222
2.....2....2......2....22
2.....2....2......2....22
2222..2....2......2....22
2.....22.222......222..22
2.....2................22
2.....2......2222...22222
2..2..2......2222......22
2..2..2................22
2..2..2222..222..222.2222
2..2..2.......2..2.....22
2.....2.......2..2.....22
2..2..2.......2..2.....22
2..2..2.......2..2.....22
2..2..222222222..2.....22
2................2.....22
2.2.2............222.2222
2.......................2
2.......................2
2222222222222222222222222
`, [myTiles.transparency16,sprites.dungeon.greenOuterNorth0,sprites.dungeon.purpleOuterNorth0,sprites.dungeon.purpleOuterNorth2,myTiles.tile1,myTiles.tile2,myTiles.tile3,myTiles.tile4], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "enemy spawn":
            case "tile1":return tile1;
            case "player spawn":
            case "tile2":return tile2;
            case "door entry":
            case "tile3":return tile3;
            case "door":
            case "tile4":return tile4;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
