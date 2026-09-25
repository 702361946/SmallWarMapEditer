# idMapping

## idToName

* 0 -> Water (浅水)
* 1 -> Water (深水)
* 2 -> Mine (草原矿坑)
* 3 -> Mine (雪地矿坑)
* 4 -> Mine (沙地矿坑)
* 10 -> Grass (草原)
* 11 -> Grass (灌木草原)
* 12 -> Tree (树林)
* 13 -> Tree (高大树林)
* 14 -> Hilly (草原丘陵)
* 15 -> Hilly (长草的草原丘陵)
* 16 -> Mountains (山脉)
* 20 -> Snow (雪地)
* 21 -> Snow (灌木雪地)
* 22 -> Tree (雪地树林)
* 23 -> Hilly (雪地丘陵)
* 24 -> Hilly (长草的雪地丘陵)
* 25 -> Ice (浮冰)
* 30 -> Sand (沙地)
* 31 -> Sand (流沙地)
* 32 -> Hilly (沙地丘陵)
* 33 -> Mountains (高山)
* 34 -> Oasis (绿洲)
* 35 -> Sand (长草沙地)

## idToSprite

* 0 -> [Sprite](id/0.png)
* 1 -> [Sprite](id/1.png)
* 2 -> [Sprite](id/2.png)
* 3 -> [Sprite](id/3.png)
* 4 -> [Sprite](id/4.png)
* 10 -> [Sprite](id/10.png)
* 11 -> [Sprite](id/11.png)
* 12 -> [Sprite](id/12.png)
* 13 -> [Sprite](id/13.png)
* 14 -> [Sprite](id/14.png)
* 15 -> [Sprite](id/15.png)
* 16 -> [Sprite](id/16.png)
* 20 -> [Sprite](id/20.png)
* 21 -> [Sprite](id/21.png)
* 22 -> [Sprite](id/22.png)
* 23 -> [Sprite](id/23.png)
* 24 -> [Sprite](id/24.png)
* 25 -> [Sprite](id/25.png)
* 30 -> [Sprite](id/30.png)
* 31 -> [Sprite](id/31.png)
* 32 -> [Sprite](id/32.png)
* 33 -> [Sprite](id/33.png)
* 34 -> [Sprite](id/34.png)
* 35 -> [Sprite](id/35.png)

## idToMiniSprite

* 0 -> [Sprite](MiniSprite/Water.png)
* 1 -> [Sprite](MiniSprite/Water.png)
* 2 -> [Sprite](MiniSprite/Mine.png)
* 3 -> [Sprite](MiniSprite/Mine.png)
* 4 -> [Sprite](MiniSprite/Mine.png)
* 10 -> [Sprite](MiniSprite/Grass.png)
* 11 -> [Sprite](MiniSprite/Grass.png)
* 12 -> [Sprite](MiniSprite/Tree.png)
* 13 -> [Sprite](MiniSprite/Tree.png)
* 14 -> [Sprite](MiniSprite/Hilly.png)
* 15 -> [Sprite](MiniSprite/Hilly.png)
* 16 -> [Sprite](MiniSprite/Mountains.png)
* 20 -> [Sprite](MiniSprite/Snow.png)
* 21 -> [Sprite](MiniSprite/Snow.png)
* 22 -> [Sprite](MiniSprite/Tree.png)
* 23 -> [Sprite](MiniSprite/Hilly.png)
* 24 -> [Sprite](MiniSprite/Hilly.png)
* 25 -> [Sprite](MiniSprite/Ice.png)
* 30 -> [Sprite](MiniSprite/Sand.png)
* 31 -> [Sprite](MiniSprite/Sand.png)
* 32 -> [Sprite](MiniSprite/Hilly.png)
* 33 -> [Sprite](MiniSprite/Mountains.png)
* 34 -> [Sprite](MiniSprite/Oasis.png)
* 35 -> [Sprite](MiniSprite/Sand2.png)

# NameToJson

## Water

```
id -> 0,1
name -> Water
groundType -> 1
money -> false
moveCost -> 1.0
notBuilding -> false
```

## Mine

```
id -> 2,3,4
name -> Mine
groundType -> 0
money -> true
moveCost -> 1.0
notBuilding -> false
```

## Grass

```
id -> 10,11
name -> Grass
groundType -> 0
money -> false
moveCost -> 1.0
notBuilding -> false
```

## Tree

```
id -> 12,13,22
name -> Tree
groundType -> 0
money -> false
moveCost -> 1.5
notBuilding -> false
```

## Hilly

```
id -> 14,15,23,24,32
name -> Hilly
groundType -> 0
money -> false
moveCost -> 2.0
notBuilding -> true
```

## Mountains

```
id -> 16,33
name -> Mountains
groundType -> 2
money -> false
moveCost -> 10.0
notBuilding -> true
```

## Snow

```
id -> 20,21
name -> Snow
groundType -> 0
money -> false
moveCost -> 1.0
notBuilding -> false
```

## Ice

```
id -> 25
name -> Ice
groundType -> 0
money -> false
moveCost -> 10.0
notBuilding -> true
```

## Sand

```
id -> 30,31,35
name -> Sand
groundType -> 0
money -> false
moveCost -> 1.0
notBuilding -> false
```

## Oasis

```
id -> 34
name -> Oasis
groundType -> 0
money -> false
moveCost -> 1.0
notBuilding -> false
```