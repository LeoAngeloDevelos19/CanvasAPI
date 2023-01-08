const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");
// Defines the variable with the default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";
const setCanvasBackground = () => {
    // Set the whole BG to white, So the downloaded bg image will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // Sets the fill back to the selectedColor then it'll be the brush color
}
window.addEventListener("load", () => {
    // Sets the Canvas of Width and Height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});
const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        // Creates a circle along with the mouse cursor
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}
const drawCircle = (e) => {
    ctx.beginPath(); // Create a new path for Circle
    // Gets the radius of the circle along with the mouse cursor
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // Creates a circle along with the mouse cursor
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}
const drawTriangle = (e) => {
    ctx.beginPath(); // Create a new path to draw the triangle
    ctx.moveTo(prevMouseX, prevMouseY); // Moving triangle along with the mouse cursor
    ctx.lineTo(e.offsetX, e.offsetY); // Creates first line along with the mouse cursor
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // Creates the line of the triangle
    ctx.closePath(); // Close path of the triangle so the other line of the triangle is already drawn
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
}
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // Current mouseX position as prevMouseX Axis
    prevMouseY = e.offsetY; // Current mouseY position as prevMouseY Axis
    ctx.beginPath(); // Creates new path to draw
    ctx.lineWidth = brushWidth; // use brushSize as line width
    ctx.strokeStyle = selectedColor; // use selectedColor as stroke style
    ctx.fillStyle = selectedColor; // use selectedColor as fill style
    // Copying canvas data & use as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
const drawing = (e) => {
    if(!isDrawing) return; // If isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // Adds the copy canvas from the canvas
    if(selectedTool === "brush" || selectedTool === "eraser") {
        // If the selected tool is eraser then set strokeStyle to White
        // Brushes the white color of the canvas else to set the stroke color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // Creates the line along with the mouse cursor
        ctx.stroke(); // Fills the color of the shape
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // Adds click event to all tool option
        // Removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // Slider as brushsize
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // Adds event for all color buttons
        // Removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // Selected the backgroundcolor as the color value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});
colorPicker.addEventListener("change", () => {
    // picks the color from the last color you picked
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Will clear the whole drawing
    setCanvasBackground();
});
saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creates the <a> element
    link.download = `${Date.now()}.jpg`; // Passing current date as link download value
    link.href = canvas.toDataURL(); // Through the canvasData to href
    link.click(); // Clicks the link to download the image
});
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);