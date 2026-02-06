import { Text, Container, TextStyle } from 'pixi.js';
import { standardWidth, standardHeight } from './constants.ts';

export class ProblemUI {
    private problemText: Text;
    private container: HTMLDivElement;
    private input: HTMLInputElement;

    constructor(parentContainer: Container) {
        // Create Pixi Text for the problem
        const style = new TextStyle({
            fontFamily: 'Inter, Arial',
            fontSize: 48,
            fontWeight: 'bold',
            fill: '#ffffff',
            dropShadow: {
                alpha: 0.8,
                angle: Math.PI / 6,
                blur: 4,
                color: '#000000',
                distance: 6,
            },
        });

        this.problemText = new Text({ text: '', style });
        this.problemText.anchor.set(0.5);
        this.problemText.x = standardWidth / 2;
        this.problemText.y = standardHeight * 0.4;
        parentContainer.addChild(this.problemText);

        // Create HTML Overlay for Input
        this.container = document.createElement('div');
        this.container.id = 'solution-container';
        this.container.style.position = 'absolute';

        this.input = document.createElement('input');
        this.input.id = 'solution-input';
        this.input.type = 'text';
        this.input.placeholder = '?';
        this.input.autocomplete = 'off';

        this.container.appendChild(this.input);
        document.body.appendChild(this.container);

        this.input.focus();
    }

    updateTransform(scale: number, offsetX: number, offsetY: number) {
        // Position the container relative to the game stage
        // The problemText is at (standardWidth / 2, standardHeight * 0.4)
        // We want the input slightly below it.
        const gameX = standardWidth / 2;
        const gameY = standardHeight * 0.5; // Slightly below text

        const screenX = gameX * scale + offsetX;
        const screenY = gameY * scale + offsetY;

        this.container.style.left = `${screenX}px`;
        this.container.style.top = `${screenY}px`;
        this.container.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    setProblem(text: string) {
        this.problemText.text = text;
    }

    getSolution(): string {
        return this.input.value;
    }

    clearInput() {
        this.input.value = '';
    }
}
