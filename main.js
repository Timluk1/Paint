"use strict"

class Paint {
    constructor() {
        // canvas elements
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        // settings elements
        this.colors = document.querySelector(".settings__colors");
        this.lineWidthInput = document.querySelector(".line-width-input");
        this.clearButton = document.querySelector(
            ".button-clear-box__clear-button"
        );
        this.tools = document.querySelectorAll(".tool");

        // object with state draw
        this.state = {
            isDown: false,
            activeTool: this.tools[0],
            activeToolName: "pen",
        };

        // line characteristic
        this.line = {
            lineWidth: this.ctx.lineWidth,
            prevStrokeStyle: document.querySelector(
                ".settings__colors-item-black"
            ),
            strokeStyleItem: this.ctx.strokeStyle,
            lineCap: "round",
        };

        this.canvasData = this.ctx.getImageData(0, 0, 600, 600);
        console.log(this.canvasData.data.length) 
        // add listeners
        this.addListeners();

        // add characteristic of line
        this.addLineCharacteristics();
    }

    getActiveToolName() {
        return this.state.activeToolName;
    }

    setActiveToolName(someNew) {
        this.state.activeToolName = someNew;
    }

    getStateIsDown() {
        return this.state.isDown;
    }

    getActiveTool() {
        return this.state.activeTool;
    }

    setActiveTool(someNew) {
        this.state.activeTool = someNew;
    }

    setStateIsDown(someNew) {
        // someNew is true or false
        this.state.isDown = someNew;
    }

    draw(e) {
        if (this.getStateIsDown()) {
            const rect = this.canvas.getBoundingClientRect();
            console.log(rect)
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
        }
    }

    setColor(e) {
        const element = e.target;
        const color = element.dataset.color;
        if (color) {
            this.line.strokeStyleItem = color;
            element.classList.add("settings__colors-item-active");
            if (this.line.prevStrokeStyle) {
                this.line.prevStrokeStyle.classList.remove(
                    "settings__colors-item-active"
                );
            }
            this.line.prevStrokeStyle = element;
        }
        this.addLineCharacteristics();
    }

    setWidth() {
        const newLineWidth = parseInt(this.lineWidthInput.value);
        this.line.lineWidth = newLineWidth;

        this.addLineCharacteristics();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    clickTool(e) {
        let tool = e.target;
        const toolTag = tool.tagName;
        if (toolTag === "I") tool = tool.parentElement;
        const type = tool.dataset.type;

        this.getActiveTool().classList.remove("active");
        tool.classList.add("active");
        this.setActiveTool(tool);

        if (type === "pen") {
            this.setActiveToolName("pen")
        } else if (type === "eraser") {
            this.setActiveToolName("eraser")
            this.ctx.strokeStyle = "white";
        }
        this.addLineCharacteristics()
    }

    addListeners() {
        this.tools.forEach((tool) =>
            tool.addEventListener("click", this.clickTool.bind(this))
        );
        this.clearButton.addEventListener("click", this.clearCanvas.bind(this));
        this.lineWidthInput.addEventListener("input", this.setWidth.bind(this));
        // colors listeners
        this.colors.addEventListener("click", this.setColor.bind(this));

        // canvas listeners
        this.canvas.addEventListener("mousedown", () =>
            this.setStateIsDown(true)
        );
        this.canvas.addEventListener("mouseup", () =>
            this.setStateIsDown(false)
        );
        this.canvas.addEventListener("mousemove", this.draw.bind(this));
        this.canvas.addEventListener("mouseleave", () =>
            this.setStateIsDown(false)
        );
    }

    addLineCharacteristics() {
        if (this.getActiveToolName() === "pen") {
            this.ctx.strokeStyle = this.line.strokeStyleItem
        };
        this.ctx.lineWidth = this.line.lineWidth;
        this.ctx.lineCap = this.line.lineCap;
    }
}

const paint = new Paint();
