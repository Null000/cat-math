import { Wizard } from "../Wizard.ts";

export async function makeWizard(): Promise<Wizard> {
    return new Wizard();
}

export async function initWizard() {
    await initWizard();
}