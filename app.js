class LinearProgressGenerator {
    constructor() {
        this.container = document.getElementById('gauge-container');
        
        // General Controls
        this.thicknessInput = document.getElementById('gauge-thickness');
        this.widthInput = document.getElementById('gauge-width');
        this.widthDisplay = document.getElementById('width-display');
        
        // Initial Controls
        this.initialInput = document.getElementById('gauge-initial');
        this.initialDisplay = document.getElementById('initial-display');
        this.initialColorInput = document.getElementById('gauge-initial-color');
        this.initialFormatInput = document.getElementById('gauge-initial-format');
        this.initialShowInput = document.getElementById('gauge-initial-show');
        
        // Current Controls
        this.valueInput = document.getElementById('gauge-value');
        this.valueDisplay = document.getElementById('value-display');
        this.colorInput = document.getElementById('gauge-color');
        this.formatInput = document.getElementById('gauge-format');
        this.showInput = document.getElementById('gauge-show');
        
        // Target Controls
        this.futureInput = document.getElementById('gauge-future');
        this.futureDisplay = document.getElementById('future-display');
        this.futureColorInput = document.getElementById('gauge-future-color');
        this.futureFormatInput = document.getElementById('gauge-future-format');
        this.futureShowInput = document.getElementById('gauge-future-show');

        this.init();
    }

    init() {
        this.renderBase();
        this.bindEvents();
        this.update(); // Set initial render state
    }

    bindEvents() {
        // Live Config changes
        const inputs = [
            this.initialInput, this.valueInput, this.futureInput,
            this.thicknessInput, this.colorInput, this.formatInput, this.showInput,
            this.initialColorInput, this.initialFormatInput, this.initialShowInput,
            this.futureColorInput, this.futureFormatInput, this.futureShowInput,
            this.widthInput
        ];
        inputs.forEach(input => {
            if (input) {
                if (input.type === 'checkbox') {
                    input.addEventListener('change', () => this.update());
                } else {
                    input.addEventListener('input', () => this.update());
                }
            }
        });
    }

    renderBase() {
        this.container.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'progress-wrapper';

        this.track = document.createElement('div');
        this.track.className = 'linear-progress-container';
        
        this.fill = document.createElement('div');
        this.fill.className = 'linear-progress-fill';
        this.fill.style.width = '0%';
        
        // Dynamic Label (Current)
        this.dynamicLabelContainer = document.createElement('div');
        this.dynamicLabelContainer.className = 'dynamic-label-container';
        
        this.dynamicLabel = document.createElement('div');
        this.dynamicLabel.className = 'dynamic-text-label';
        
        const pointer = document.createElement('div');
        pointer.className = 'current-pointer';

        this.dynamicLabelContainer.appendChild(this.dynamicLabel);
        this.dynamicLabelContainer.appendChild(pointer);
        
        this.fill.appendChild(this.dynamicLabelContainer);

        // Milestone Initial
        this.milestoneInitial = document.createElement('div');
        this.milestoneInitial.className = 'initial-container';
        this.milestoneInitial.style.left = '25%';
        
        this.initialLine = document.createElement('div');
        this.initialLine.className = 'initial-line';
        this.milestoneInitial.appendChild(this.initialLine);

        this.milestoneInitialLabel = document.createElement('div');
        this.milestoneInitialLabel.className = 'initial-label';
        this.milestoneInitial.appendChild(this.milestoneInitialLabel);

        // Target Mark
        this.targetMark = document.createElement('div');
        this.targetMark.className = 'target-container';
        this.targetMark.style.left = '100%';

        this.targetLine = document.createElement('div');
        this.targetLine.className = 'target-line';
        
        // SVG Flag Icon
        this.targetLine.innerHTML = `<svg class="target-flag" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>`;

        this.targetLabel = document.createElement('div');
        this.targetLabel.className = 'target-label';
        
        this.targetMark.appendChild(this.targetLine);
        this.targetMark.appendChild(this.targetLabel);

        this.track.appendChild(this.fill);
        this.track.appendChild(this.milestoneInitial);
        this.track.appendChild(this.targetMark);
        
        wrapper.appendChild(this.track);
        this.container.appendChild(wrapper);
    }

    getFormatStr(val, format) {
        return format ? format.replace(/\{percentage\}/g, val.toString()) : `${val}%`;
    }

    update() {
        if (!this.track) return;
        
        // Fetch values
        const initialValue = this.initialInput ? parseFloat(this.initialInput.value) : 25;
        const value = this.valueInput ? parseFloat(this.valueInput.value) : 50;
        const futureValue = this.futureInput ? parseFloat(this.futureInput.value) : 100;
        
        // Update span badges
        if (this.initialDisplay) this.initialDisplay.textContent = `${initialValue}%`;
        if (this.valueDisplay) this.valueDisplay.textContent = `${value}%`;
        if (this.futureDisplay) this.futureDisplay.textContent = `${futureValue}%`;
        
        let widthPercent = 100;
        if (this.widthInput && this.widthDisplay) {
            widthPercent = this.widthInput.value;
            this.widthDisplay.textContent = `${widthPercent}%`;
            this.track.style.width = `${widthPercent}%`;
        }

        // Thickness
        const thickness = this.thicknessInput ? this.thicknessInput.value + 'px' : '12px';
        this.track.style.height = thickness;

        // Initial Milestone Styles
        this.milestoneInitial.style.left = `${initialValue}%`;
        const showInitial = this.initialShowInput ? this.initialShowInput.checked : true;
        this.milestoneInitial.style.display = showInitial ? 'block' : 'none';
        const initialColor = this.initialColorInput ? this.initialColorInput.value : '#94a3b8';
        this.milestoneInitialLabel.style.color = initialColor;
        this.initialLine.style.backgroundColor = initialColor;
        const initialFormat = this.initialFormatInput ? this.initialFormatInput.value : '{percentage}%';
        this.milestoneInitialLabel.textContent = this.getFormatStr(initialValue, initialFormat);

        // Target Milestone Styles
        this.targetMark.style.left = `${futureValue}%`;
        const showFuture = this.futureShowInput ? this.futureShowInput.checked : true;
        this.targetMark.style.display = showFuture ? 'block' : 'none';
        const futureColor = this.futureColorInput ? this.futureColorInput.value : '#4ade80';
        this.targetLabel.style.color = futureColor;
        this.targetLine.style.backgroundColor = futureColor;
        this.targetLine.style.color = futureColor; // For SVG currentColor flag
        const futureFormat = this.futureFormatInput ? this.futureFormatInput.value : '{percentage}%';
        this.targetLabel.textContent = this.getFormatStr(futureValue, futureFormat);

        // Current Fill and Dynamic Label Styles
        const showCurrent = this.showInput ? this.showInput.checked : true;
        this.dynamicLabelContainer.style.display = showCurrent ? 'flex' : 'none';

        
        const currentColor = this.colorInput ? this.colorInput.value : '#facc15';
        this.fill.style.backgroundColor = currentColor;
        
        const currentFormat = this.formatInput ? this.formatInput.value : '{percentage}%';
        this.dynamicLabel.textContent = this.getFormatStr(value, currentFormat);
        
        this.fill.style.width = `${value}%`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LinearProgressGenerator();
});
