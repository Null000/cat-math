
import { readdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const rewardImagesDir = join(process.cwd(), 'src', 'rewardImages');
const rpgConstantsFile = join(process.cwd(), 'src', 'rpg', 'constants.ts');
const mainConstantsFile = join(process.cwd(), 'src', 'constants.ts');

try {
    const files = readdirSync(rewardImagesDir);
    const count = files.length;

    console.log(`Found ${count} reward images.`);

    // Update RPG constants
    let rpgContent = readFileSync(rpgConstantsFile, 'utf-8');
    const rpgRegex = /export const rewardImageCount = \d+;/;
    const rpgNewText = `export const rewardImageCount = ${count};`;

    if (rpgRegex.test(rpgContent)) {
        rpgContent = rpgContent.replace(rpgRegex, rpgNewText);
    } else {
        rpgContent += `\n${rpgNewText}\n`;
    }

    writeFileSync(rpgConstantsFile, rpgContent);
    console.log(`Updated ${rpgConstantsFile} with rewardImageCount = ${count}`);

    // Update main constants
    let mainContent = readFileSync(mainConstantsFile, 'utf-8');
    const mainRegex = /export const numberOfRewardImages = \d+;/;
    const mainNewText = `export const numberOfRewardImages = ${count};`;

    if (mainRegex.test(mainContent)) {
        mainContent = mainContent.replace(mainRegex, mainNewText);
    } else {
        mainContent += `\n${mainNewText}\n`;
    }

    writeFileSync(mainConstantsFile, mainContent);
    console.log(`Updated ${mainConstantsFile} with numberOfRewardImages = ${count}`);
} catch (error) {
    console.error('Error updating reward image count:', error);
    process.exit(1);
}
