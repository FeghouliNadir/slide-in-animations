// Wave -------------------------------------------------------------------------------

paper.setup(document.getElementById('myCanvas1'));

if (window.innerWidth < 768) {
    var numPoints = 20;
    var points = [];
    for (var i = 0; i <= numPoints; i++) {
        var x = (paper.view.size.width / numPoints) * i;
        var y = window.innerHeight * 0.3;
        points.push(new paper.Point(x, y));
    }

    var background = new paper.Path({
        segments: points,
        fillColor: '#193247',
        closed: true
    });

    background.add(new paper.Point(paper.view.size.width, 0));
    background.add(new paper.Point(0, 0));
    background.add(new paper.Point(0, window.innerHeight * 0.3));

    var wave = new paper.Path({
        segments: points.slice(),
        closed: true
    });

    wave.add(new paper.Point(paper.view.size.width, 0));
    wave.add(new paper.Point(0, 0));
    wave.add(new paper.Point(0, window.innerHeight * 0.3));

    var raster = new paper.Raster('wavy.png');

    raster.position = paper.view.center;

    raster.fitBounds(wave.bounds, true);

    var imageGroup = new paper.Group([wave, raster]);
    imageGroup.clipped = true;

    var speed = 5;
    var revealDone = false;

    paper.view.onFrame = function (event) {
        for (var i = 0; i <= numPoints; i++) {
            var sinus = Math.sin(event.time * speed + i * 0.5);
            var newY = window.innerHeight * 0.3 + sinus * 20;
            background.segments[i].point.y = newY;
            wave.segments[i].point.y = newY;
        }
        if (revealDone && speed > 0) {
            speed -= 0.1;
        }
        background.segments[numPoints + 1].point.y = 0;
        background.segments[numPoints + 2].point.y = 0;
        background.segments[numPoints + 3].point.y = window.innerHeight * 0.3;
        wave.segments[numPoints + 1].point.y = 0;
        wave.segments[numPoints + 2].point.y = 0;
        wave.segments[numPoints + 3].point.y = window.innerHeight * 0.3;
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
    var speed = 0.1;
    var time = 1;
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
    const origin2 = isMobile ? 'bottom' : 'right';
    const origin3 = isMobile ? 'bottom' : 'left';
    ScrollReveal().reveal('[data-sr="one"]', {
        delay: 0,
        duration: 1000,
        distance: '100%',
        origin: origin1,
        reset: true,
        scale: 1,
        afterReveal: function () {
            setTimeout(() => {
                revealDone = true;
                console.log('revealDone');
            }, 500);
        }
    });

    ScrollReveal().reveal('[data-sr="two"]', {
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

    ScrollReveal().reveal('[data-sr="three"]', {
        delay: 0,
        duration: 1000,
        distance: '100%',
        origin: origin3,
        reset: true,
        scale: 1,
    });


}

initializeScrollReveal();