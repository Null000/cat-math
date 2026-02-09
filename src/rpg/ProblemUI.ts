import { Text, Container, TextStyle } from 'pixi.js';
import { standardWidth, standardHeight } from './constants.ts';

export class ProblemUI {
    private problemText: Text;
    private container: HTMLDivElement;
    private input: HTMLInputElement;

    private styleTag: HTMLStyleElement;
    private submitCallback: (solution: string) => void;

    constructor(parentContainer: Container, onSubmit: (solution: string) => void) {
        this.submitCallback = onSubmit;
        // Create Pixi Text for the problem
        const style = new TextStyle({
            fontFamily: 'Inter, "Segoe UI", "Roboto", sans-serif',
            fontSize: 72,
            fontWeight: '900',
            fill: '#ffffff',
            stroke: { color: '#4a5568', width: 6 },
            dropShadow: {
                alpha: 0.5,
                angle: Math.PI / 2,
                blur: 10,
                color: '#000000',
                distance: 6,
            },
            letterSpacing: 2,
            padding: 10, // Prevent cutting off effects
        });

        this.problemText = new Text({ text: '', style });
        this.problemText.anchor.set(0.5);
        this.problemText.x = standardWidth / 2;
        this.problemText.y = standardHeight * 0.35; // Moved up slightly for better spacing

        // Add a subtle scale pulse to the text (manual "animation" via styles isn't possible for Pixi text without update loop, 
        // but we can set initial scale)
        // We will rely on the static coolness for now, or adding filters if requested.

        parentContainer.addChild(this.problemText);

        // Inject Custom CSS for the Input
        this.styleTag = document.createElement('style');
        this.styleTag.innerHTML = `
            #solution-container {
                perspective: 1000px;
                z-index: 1000;
            }
            
            #solution-input {
                background: rgba(20, 20, 35, 0.6);
                border: 2px solid rgba(255, 255, 255, 0.15);
                border-radius: 20px;
                color: #ffffff;
                font-family: 'Inter', sans-serif;
                font-size: 2.5rem;
                font-weight: 800;
                padding: 1rem 2rem;
                width: 200px;
                text-align: center;
                outline: none;
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                box-shadow: 
                    0 10px 30px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 0 20px rgba(255, 255, 255, 0.05);
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                letter-spacing: 2px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }

            #solution-input::placeholder {
                color: rgba(255, 255, 255, 0.2);
                font-weight: 400;
            }

            #solution-input:focus {
                background: rgba(30, 30, 50, 0.8);
                border-color: #667eea;
                box-shadow: 
                    0 15px 40px rgba(0, 0, 0, 0.6),
                    0 0 0 2px rgba(102, 126, 234, 0.5),
                    0 0 30px rgba(102, 126, 234, 0.3),
                    inset 0 0 20px rgba(102, 126, 234, 0.1);
                transform: translateY(-2px) scale(1.02);
                width: 260px; /* Expand on focus */
            }

            /* Keyframe animation for correct answer pulse */
            @keyframes correctPulse {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7); }
                70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(46, 204, 113, 0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
            }
            
            .input-correct {
                animation: correctPulse 0.5s ease-out;
                border-color: #2ecc71 !important;
                color: #2ecc71 !important;
            }
            
            .input-wrong {
                animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                border-color: #e74c3c !important;
                color: #e74c3c !important;
            }

            @keyframes shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                40%, 60% { transform: translate3d(4px, 0, 0); }
            }
        `;
        document.head.appendChild(this.styleTag);

        // Create HTML Overlay for Input
        this.container = document.createElement('div');
        this.container.id = 'solution-container';
        this.container.style.position = 'absolute';

        this.input = document.createElement('input');
        this.input.id = 'solution-input';
        this.input.type = 'text'; // 'number' hides the placeholder in some browsers or adds spinners
        this.input.inputMode = 'numeric'; // Key for mobile
        this.input.pattern = '[0-9]*';
        this.input.placeholder = '?';
        this.input.autocomplete = 'off';

        this.container.appendChild(this.input);
        document.body.appendChild(this.container);

        this.input.addEventListener("keyup", (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                this.onSubmit();
            }
        });

        this.input.focus();
    }

    onSubmit() {
        this.submitCallback(this.getSolution());
    }

    updateTransform(scale: number, offsetX: number, offsetY: number) {
        // Position the container relative to the game stage
        // The problemText is at (standardWidth / 2, standardHeight * 0.35)
        // We want the input below it.
        const gameX = 400;
        const gameY = 330; // Below the text

        const screenX = gameX * scale + offsetX;
        const screenY = gameY * scale + offsetY;

        this.container.style.left = `${screenX}px`;
        this.container.style.top = `${screenY}px`;
        // Use translate to center the element on its coordinate
        this.container.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    setProblem(text: string) {
        this.problemText.text = text;
        this.problemText.style.fill = '#ffffff'; // Reset color if changed
    }

    getSolution(): string {
        return this.input.value;
    }

    clearInput() {
        this.input.value = '';
        this.input.className = ''; // Reset classes
    }

    // New methods to trigger visual feedback
    showSuccess(): Promise<void> {
        return new Promise((resolve) => {
            this.input.classList.add('input-correct');
            this.problemText.style.fill = '#2ecc71'; // Green
            setTimeout(() => {
                this.input.classList.remove('input-correct');
                this.problemText.style.fill = '#ffffff'; // Reset
                resolve();
            }, 500);
        });
    }

    showError(): Promise<void> {
        return new Promise((resolve) => {
            this.input.classList.add('input-wrong');
            this.problemText.style.fill = '#e74c3c'; // Red
            setTimeout(() => {
                this.input.classList.remove('input-wrong');
                this.problemText.style.fill = '#ffffff'; // Reset
                resolve();
            }, 500);
        });
    }
}

