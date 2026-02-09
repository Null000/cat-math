import { BackgroundType } from './backgroundMaker.ts';
import { EnemyType } from './enemies/enemyMaker.ts';

export interface Area {
    background: BackgroundType;
    waves: EnemyType[][];
}

export const areas: Area[] = [
    {
        background: BackgroundType.Village,
        waves: [
            [EnemyType.Dummy],
            [EnemyType.Dummy, EnemyType.Dummy],
        ]
    },
    {
        background: BackgroundType.Forest,
        waves: [
            [EnemyType.Rat],
            [EnemyType.Rat, EnemyType.Rat],
            [EnemyType.DireRat],
            [EnemyType.DireRat, EnemyType.Rat],
            [EnemyType.DireRat, EnemyType.Rat, EnemyType.Rat],
            [EnemyType.DireRat, EnemyType.DireRat, EnemyType.Rat, EnemyType.Rat],
        ]
    },
    {
        background: BackgroundType.DarkForest,
        waves: [
            [EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
            [EnemyType.Slime, EnemyType.Slime],
        ]
    },
];
