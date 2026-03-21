import { readdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const rewardImagesDir = join(process.cwd(), 'src', 'rewardImages');
const mainConstantsFile = join(process.cwd(), 'src', 'constants.ts');

try {
    const files = readdirSync(rewardImagesDir);
    const count = files.length;

    console.log(`Found ${count} reward images.`);

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
