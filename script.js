// wave -------------------------------------------------------------------------------

paper.setup(document.getElementById('myCanvas1'));

var rectWidth, rectHeight, rectX, rectY, radius;

function updateRectangleDimensions() {
    if (window.innerWidth < 768) {
        rectWidth = paper.view.bounds.width;
        rectHeight = paper.view.bounds.height * 0.1;
        rectX = 0;
        rectY = 0;
        radius = rectWidth / 2;
    } else {
        rectWidth = 400;
        rectHeight = 400;
        rectX = 0;
        rectY = paper.view.center.y - rectHeight / 2;
        radius = rectHeight / 2;
    }
}

updateRectangleDimensions();

var pointsOnTop = 20;

var topSidePoints = [];
for (var i = 0; i <= pointsOnTop; i++) {
    var x = rectX + (i / pointsOnTop) * rectWidth;
    var y = rectY;
    topSidePoints.push(new paper.Point(x, y));
}

var bottomLeft = new paper.Point(rectX, rectY + rectHeight);

var bottomRight = new paper.Point(rectX + rectWidth, rectY + rectHeight);
var topRight = new paper.Point(rectX + rectWidth, rectY);

var path = new paper.Path();

for (var i = 0; i < topSidePoints.length; i++) {
    path.add(topSidePoints[i]);
}

if (window.innerWidth < 768) {
    path.lineTo(bottomRight);
    path.arcTo(bottomLeft);
} else {
    path.arcTo(bottomRight);
    path.lineTo(bottomLeft);
}

path.closed = true;
path.strokeColor = 'black';
path.fillColor = '#193247';

var image = new paper.Raster('wavy.png');
image.onLoad = function () {
    image.bounds = path.bounds;    
};

var waveAmplitude = 10;
var waveFrequency = 10;
var speed = 0.05;
var time = 0;
var revealDone = false;

paper.view.onFrame = function left(event) {
    time += speed;
    if (revealDone) {
        if (waveAmplitude > 0) {
            waveAmplitude -= 0.2;
            if (waveAmplitude < 0) waveAmplitude = 0;
        }
    }

    for (var i = 0; i <= pointsOnTop; i++) {
        var point = path.segments[i].point;
        var x = point.x;
        var y = rectY + Math.sin((x / rectWidth) * waveFrequency + time) * waveAmplitude;
        point.y = y;
    }
    paper.view.draw();
};

if (paper.view.size.width < 768) {
    waveAmplitude = 0;
}

// Particles -------------------------------------------------------------------------------

function initializeParticles() {
    if (!window.particlesInitialized) {
        paper.setup(document.getElementById('myCanvas2'));

        const numParticles = 500;
        const particles = [];

        const width = paper.view.bounds.width;
        const height = paper.view.bounds.height + 100;
        const isMobile = window.innerWidth < 768;

        for (let i = 0; i < numParticles; i++) {
            const particle = new paper.Path.Circle({
                center: isMobile
                    ? new paper.Point(Math.random() * width, -Math.random() * 100)
                    : new paper.Point(width + Math.random() * 100, Math.random() * height),
                radius: 2,
                fillColor: '#e2ca76',
            });
            particles.push({
                item: particle,
                vector: isMobile
                    ? new paper.Point(Math.random() * 2 - 1, Math.random() * 7 + 1)
                    : new paper.Point(-Math.random() * 7 - 1, Math.random() * 2 - 1),
            });
        }

        paper.view.onFrame = function () {
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.item.position = p.item.position.add(p.vector);
            }
        };

        window.particlesInitialized = true;
    }
}

// Glitch -------------------------------------------------------------------------------

function randomGlitch() {
    const rect = document.querySelector('.rect2');
    
    setInterval(() => {
        if (Math.random() < 0.1) {
            rect.classList.add('glitching');
            setTimeout(() => {
                rect.classList.remove('glitching');
            }, 300); 
        }
    }, 100);
}

document.addEventListener('DOMContentLoaded', randomGlitch);

// ScrollReveal -------------------------------------------------------------------------------

function initializeScrollReveal() {
    const isMobile = window.innerWidth < 768;
    const origin1 = isMobile ? 'top' : 'right';
    const origin2 = isMobile ? 'top' : 'left';

    ScrollReveal().reveal('[data-sr="right"]', {
        delay: 0,
        duration: 1000,
        distance: '100%',
        origin: origin1,
        reset: true,
        scale: 1,
        // mobile: false,
        beforeReveal: function () {
            initializeParticles();
        }
    });

    ScrollReveal().reveal('[data-sr="left"]', {
        delay: 0,
        duration: 1000,
        distance: '100%',
        origin: origin2,
        reset: true,
        scale: 1,
        // mobile: false,
        afterReveal: function () {
            revealDone = true;
        }
    });

    ScrollReveal().reveal('[data-sr="top"]', {
        delay: 0,
        duration: 1000,
        distance: '100%',
        origin: 'top',
        reset: true,
        scale: 1,
        // mobile: false,
    });
}

initializeScrollReveal();