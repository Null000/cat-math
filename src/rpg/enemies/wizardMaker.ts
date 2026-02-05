import { Wizard, initWizard } from "../Wizard.ts";

export async function makeWizard(xp: number): Promise<Wizard> {
    await initWizard();
    return new Wizard(xp);
}
