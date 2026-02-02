
import { readdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const rewardImagesDir = join(process.cwd(), 'src', 'rewardImages');
const constantsFile = join(process.cwd(), 'src', 'rpg', 'constants.ts');

try {
    const files = readdirSync(rewardImagesDir);
    const count = files.length;

    console.log(`Found ${count} reward images.`);

    let content = readFileSync(constantsFile, 'utf-8');
    const regex = /export const rewardImageCount = \d+;/;
    const newText = `export const rewardImageCount = ${count};`;

    if (regex.test(content)) {
        content = content.replace(regex, newText);
    } else {
        content += `\n${newText}\n`;
    }

    writeFileSync(constantsFile, content);
    console.log(`Updated ${constantsFile} with rewardImageCount = ${count}`);
} catch (error) {
    console.error('Error updating reward image count:', error);
    process.exit(1);
}
