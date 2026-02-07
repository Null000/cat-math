import { Assets, Sprite } from 'pixi.js';
import { standardWidth, standardHeight } from './constants.ts';

export async function makeBackground(wave: number): Promise<Sprite> {
  const asset = waveBackground[wave] ?? 'assets/dungeon.png';
  const texture = await Assets.load(asset);
  const background = new Sprite(texture);
  background.width = standardWidth;
  background.height = standardHeight;
  return background;
}

const waveBackground: Record<number, string> = {
  1: 'assets/village.png',
  2: 'assets/village.png',
  3: 'assets/forest.png',
  4: 'assets/forest.png',
  5: 'assets/forest.png',
  6: 'assets/darkForest.png',
  7: 'assets/darkForest.png',
  8: 'assets/darkForest.png',
  9: 'assets/dungeon.png',
  10: 'assets/dungeon.png',
};
