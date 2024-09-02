const truthTasks = [
    "What is your most embarrassing moment?",
    "Have you ever lied to your boss?",
    "Who is your secret crush?",
    "What is your biggest fear?",
    "What was your worst habit as a child?"
];

const dareTasks = [
    "Do 10 push-ups.",
    "Sing a song loudly.",
    "Dance without music for 1 minute.",
    "Speak in a funny accent for the next 2 minutes.",
    "Do a silly walk across the room."
];

let availableTruthTasks = [...truthTasks];
let availableDareTasks = [...dareTasks];

const canvas = document.getElementById('scratchCardCanvas');
const ctx = canvas.getContext('2d');
const taskText = document.getElementById('taskText');
const gameContainer = document.getElementById('gameContainer');
const scratchCardContainer = document.getElementById('scratchCardContainer');
const backBtn = document.getElementById('backBtn');
const startBtn = document.getElementById('startBtn');
const funHeading = document.getElementById('funHeading');
let isDrawing = false;
let lastPoint = null;

startBtn.addEventListener('click', () => {
    document.getElementById('logoContainer').style.display = 'none';
    gameContainer.style.display = 'block';
    funHeading.style.display = 'block';
});

document.getElementById('truthBtn').addEventListener('click', () => {
    const task = getRandomTask('truth');
    setupScratchCard(task);
});

document.getElementById('dareBtn').addEventListener('click', () => {
    const task = getRandomTask('dare');
    setupScratchCard(task);
});

backBtn.addEventListener('click', () => {
    resetCanvas();
    gameContainer.style.display = 'block';
    scratchCardContainer.style.display = 'none';
    funHeading.style.display = 'block';  // Ensure heading is visible
});

function getRandomTask(type) {
    let task;
    if (type === 'truth') {
        if (availableTruthTasks.length === 0) {
            availableTruthTasks = [...truthTasks]; // Reset pool if empty
        }
        const index = Math.floor(Math.random() * availableTruthTasks.length);
        task = availableTruthTasks.splice(index, 1)[0];
    } else {
        if (availableDareTasks.length === 0) {
            availableDareTasks = [...dareTasks]; // Reset pool if empty
        }
        const index = Math.floor(Math.random() * availableDareTasks.length);
        task = availableDareTasks.splice(index, 1)[0];
    }
    return task;
}

function setupScratchCard(task) {
    gameContainer.style.display = 'none';
    scratchCardContainer.style.display = 'block';
    funHeading.style.display = 'none';  // Hide heading when scratch card is shown
    taskText.textContent = task;
    taskText.style.visibility = 'hidden';

    resetCanvas();

    // Enable drawing on the canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: true });
    canvas.addEventListener('touchmove', draw, { passive: true });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
}

function startDrawing(event) {
    isDrawing = true;
    lastPoint = getMousePos(event);
}

function draw(event) {
    if (!isDrawing) return;
    const currentPoint = getMousePos(event);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    lastPoint = currentPoint;

    // Check if enough area has been cleared
    if (getClearedPercentage() > 80) {
        taskText.style.visibility = 'visible';
    }
}

function stopDrawing() {
    isDrawing = false;
}

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function getClearedPercentage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clearedPixels = 0;
    for (let i = 3; i < imageData.length; i += 4) {
        if (imageData[i] === 0) clearedPixels++;
    }
    return (clearedPixels / (canvas.width * canvas.height)) * 100;
}

function resetCanvas() {
    ctx.globalCompositeOperation = 'source-over';  // Reset the drawing mode to default
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#999999';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    isDrawing = false;
    lastPoint = null;
}

