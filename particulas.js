"use strict";

var canvasEl = document.getElementById('fireworks');
var ctx = canvasEl.getContext('2d');
var numberOfParticules = 30;
var pointerX = 0;
var pointerY = 0;
var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
var colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

function setCanvasSize() {
    canvasEl.width = window.innerWidth * 2;
    canvasEl.height = window.innerHeight * 2;
    canvasEl.style.width = window.innerWidth + 'px';
    canvasEl.style.height = window.innerHeight + 'px';
    canvasEl.getContext('2d').scale(2, 2);
}

function updateCoords(e) {
    pointerX = e.clientX || e.touches[0].clientX / 2;
    pointerY = e.clientY || e.touches[0].clientY;
}
  
function setParticuleDirection(p) {
    let angle = anime.random(0, 360) * Math.PI / 180;
    let value = anime.random(50, 180);
    let radius = [-1, 1][anime.random(0, 1)] * value;

    return {
      x: p.x + radius * Math.cos(angle),
      y: p.y + radius * Math.sin(angle)
    }
}
  
function createParticule(x, y) {
    let p = {};
    p.x = x;
    p.y = y;
    p.color = colors[anime.random(0, colors.length - 1)];
    p.radius = anime.random(16, 32);
    p.endPos = setParticuleDirection(p);
    p.draw = function () {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = p.color;
        ctx.fill();
    }
    return p;
}
  
function createCircle(x, y) {
    let p = {};
    p.x = x;
    p.y = y;
    p.color = '#FFF';
    p.radius = 0.1;
    p.alpha = .5;
    p.lineWidth = 6;
    p.draw = function () {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = p.lineWidth;
        ctx.strokeStyle = p.color;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    return p;
}
  
function renderParticule(anim) {
    for (let i = 0; i < anim.animatables.length; i++) {
        anim.animatables[i].target.draw();
    }
}
  
function animateParticules(x, y) {
    let circle = createCircle(x, y);
    let particules = [];

    for (let i = 0; i < numberOfParticules; i++) {
        particules.push(createParticule(x, y));
    }

    anime.timeline().add({
        targets: particules,
        x: function (p) { return p.endPos.x; },
        y: function (p) { return p.endPos.y; },
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: renderParticule
    })

    anime.timeline().add({
        targets: circle,
        radius: anime.random(80, 160),
        lineWidth: 0,
        alpha: {
             value: 0,
             easing: 'linear',
             duration: anime.random(600, 800),
        },
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: renderParticule
    }, 0);
}
  
var render = anime({
    duration: Infinity,

    update: function () {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
});
  
document.addEventListener(tap, e => {
    render.play();
    updateCoords(e);
    animateParticules(pointerX, pointerY);
});
  
setCanvasSize();
window.addEventListener('resize', setCanvasSize);  
