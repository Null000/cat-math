import { Assets, Sprite } from "pixi.js";
import { standardWidth, standardHeight } from "./constants.ts";

export const BackgroundType = {
	Village: "village",
	Forest: "forest",
	DarkForest: "darkForest",
	Dungeon: "dungeon",
	Swamp: "swamp",
	Mountains: "mountains",
	Ruins: "ruins",
	Volcano: "volcano",
} as const;

export type BackgroundType =
	(typeof BackgroundType)[keyof typeof BackgroundType];

export async function makeBackground(type: BackgroundType): Promise<Sprite> {
	const asset = assetMap[type]!;
	const texture = await Assets.load(asset);
	const background = new Sprite(texture);
	background.width = standardWidth;
	background.height = standardHeight;
	return background;
}

const assetMap: Record<BackgroundType, string> = {
	[BackgroundType.Village]: "assets/village.png",
	[BackgroundType.Forest]: "assets/forest.png",
	[BackgroundType.DarkForest]: "assets/darkForest.png",
	[BackgroundType.Dungeon]: "assets/dungeon.png",
	[BackgroundType.Swamp]: "assets/swamp.jpeg",
	[BackgroundType.Mountains]: "assets/mountains.jpeg",
	[BackgroundType.Ruins]: "assets/ruins.jpeg",
	[BackgroundType.Volcano]: "assets/volcano.jpeg",
};
