// Wave -------------------------------------------------------------------------------

paper.setup(document.getElementById('myCanvas1'));

if (window.innerWidth < 768) {
    // Create points along the bottom of the rectangle
    var numPoints = 20;
    var points = [];
    for (var i = 0; i <= numPoints; i++) {
        var x = (paper.view.size.width / numPoints) * i;
        var y = paper.view.size.height * 0.3;
        points.push(new paper.Point(x, y));
    }

    // Create a path for the blue background
    var background = new paper.Path({
        segments: points,
        fillColor: '#193247',
        closed: true
    });

    // Add the top-right, top-left, and bottom-left points of the rectangle
    background.add(new paper.Point(paper.view.size.width, 0));
    background.add(new paper.Point(0, 0));
    background.add(new paper.Point(0, paper.view.size.height * 0.3));

    // Create a separate path for the wave (clipping mask)
    var wave = new paper.Path({
        segments: points.slice(),
        closed: true
    });

    wave.add(new paper.Point(paper.view.size.width, 0));
    wave.add(new paper.Point(0, 0));
    wave.add(new paper.Point(0, paper.view.size.height * 0.3));

    // Load the image
    var raster = new paper.Raster('wavy.png');

    // Center the image
    raster.position = paper.view.center;

    // Scale the image to fit within the wave
    raster.fitBounds(wave.bounds, true);

    // Create a group with the wave and the image
    var imageGroup = new paper.Group([wave, raster]);
    imageGroup.clipped = true;

    // Animate the wave
    paper.view.onFrame = function (event) {
        for (var i = 0; i <= numPoints; i++) {
            var bgSegment = background.segments[i];
            var waveSegment = wave.segments[i];
            var sinus = Math.sin(event.time * 5 + i * 0.5);
            var newY = paper.view.size.height * 0.3 + sinus * 20;
            bgSegment.point.y = newY;
            waveSegment.point.y = newY;
        }
        // Keep the corner points fixed
        background.segments[numPoints + 1].point.y = 0;
        background.segments[numPoints + 2].point.y = 0;
        background.segments[numPoints + 3].point.y = paper.view.size.height * 0.3;
        wave.segments[numPoints + 1].point.y = 0;
        wave.segments[numPoints + 2].point.y = 0;
        wave.segments[numPoints + 3].point.y = paper.view.size.height * 0.3;
    };
}
else {

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

// scroll reveal -------------------------------------------------------------------------------

function initializeScrollReveal() {
    const isMobile = window.innerWidth < 768;
    const origin1 = isMobile ? 'top' : 'left';
    const origin2 = isMobile ? 'top' : 'right';
    ScrollReveal().reveal('[data-sr="left"]', {
        delay: 0,
        duration: 1000,
        distance: '100%',
        origin: origin1,
        reset: true,
        scale: 1,
    });

    ScrollReveal().reveal('[data-sr="right"]', {
        delay: 0,
        duration: 1000,
        distance: '100%',
        origin: origin2,
        reset: true,
        scale: 1,
        // mobile: false,
        beforeReveal: function () {
            initializeParticles();
        }
    });


}

initializeScrollReveal();

