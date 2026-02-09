import { BackgroundType } from "./backgroundMaker.ts";
import { EnemyType } from "./enemies/enemyMaker.ts";

export interface Area {
  name: string;
  background: BackgroundType;
  waves: EnemyType[][];
}

export const areas: Area[] = [
  {
    name: "Village",
    background: BackgroundType.Village,
    waves: [
      [EnemyType.Dummy],
      [EnemyType.Dummy, EnemyType.Dummy],
    ],
  },
  {
    name: "Forest",
    background: BackgroundType.Forest,
    waves: [
      [EnemyType.Rat],
      [EnemyType.Rat, EnemyType.Rat],
      [EnemyType.DireRat],
      [EnemyType.DireRat, EnemyType.Rat],
      [EnemyType.DireRat, EnemyType.Rat, EnemyType.Rat],
      [EnemyType.DireRat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
      [EnemyType.DireRat, EnemyType.DireRat, EnemyType.DireRat],
      [EnemyType.DireRat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat, EnemyType.Rat],
    ],
  },
];
