import { Wizard, initWizard } from "../Wizard.ts";

export async function makeWizard(): Promise<Wizard> {
    await initWizard();
    return new Wizard();
}
