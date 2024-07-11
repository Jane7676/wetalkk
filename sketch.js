let words = [];
let wordList = ["ךמצע", "תא", "אונשלו", "רקובב", "ררועתהל", "םדרהל", "םלעהל", "חוכשלו", "חורבל"];
let sentence = "ההההההההההההההההא ךמצע תא אונשלו רקובב ררועתהל םדרהל םלעהל,חוכשלו חורבל";
let numRepeats = 80;
let startRadius = 80;
let customFont;
let song;
let fft;

function preload() {
    customFont = loadFont('myfont.otf');
    song = loadSound('wakeup.mp3',
                     ()=>console.log("song loaded successfully"),
                     (err)=>console.error()
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    textSize(6);
    angleMode(DEGREES);
    textFont(customFont);

    // Create the FFT analyzer
    fft = new p5.FFT();
    fft.setInput(song);

    // Generate initial positions for words
    for (let j = 0; j < numRepeats; j++) {
        wordList.forEach(word => {
            let angle = random(360);
            let distance = random(startRadius);
            words.push({ char: word, angle: angle, distance: distance, initialDistance: distance, speedX: random(-2, 2), speedY: random(-2, 2) });
        });
    }

    // Start playing the song automatically
    song.play();
}

function draw() {
    background(255);
    translate(width / 2, height / 2);

    let spectrum = fft.analyze(); // Get the frequency spectrum
    let bassEnergy = fft.getEnergy("bass"); // Get the energy of the bass frequencies

    words.forEach(word => {
        let x = cos(word.angle) * (word.initialDistance + bassEnergy * 0.1) + word.speedX * bassEnergy * 0.01;
        let y = sin(word.angle) * (word.initialDistance + bassEnergy * 0.1) + word.speedY * bassEnergy * 0.01;

        if (abs(x) > width / 2 || abs(y) > height / 2) return;

        fill(0);
        text(word.char, x, y);
    });

    // Adjust the sentence display based on the bass energy
    let textSizeMultiplier = map(bassEnergy, 0, 255, 20, 40); // Increase textSize as bass energy grows
    let alphaValue = map(bassEnergy, 0, 255, 0, 255); // Fade in sentence as bass energy grows

    textSize(textSizeMultiplier);
    fill(0, alphaValue);
    text(sentence, 0, 0);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    if (!song.isPlaying()) {
        song.play();
    }
}
