(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * Author: Alex Gibson
 * https://github.com/alexgibson/shake.js
 * License: MIT license
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(global, global.document);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(global, global.document);
    } else {
        global.Shake = factory(global, global.document);
    }
} (typeof window !== 'undefined' ? window : this, function (window, document) {

    'use strict';

    function Shake(options) {
        //feature detect
        this.hasDeviceMotion = 'ondevicemotion' in window;

        this.options = {
            threshold: 15, //default velocity threshold for shake to register
            timeout: 1000 //default interval between events
        };

        if (typeof options === 'object') {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                }
            }
        }

        //use date to prevent multiple shakes firing
        this.lastTime = new Date();

        //accelerometer values
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;

        //create custom event
        if (typeof document.CustomEvent === 'function') {
            this.event = new document.CustomEvent('shake', {
                bubbles: true,
                cancelable: true
            });
        } else if (typeof document.createEvent === 'function') {
            this.event = document.createEvent('Event');
            this.event.initEvent('shake', true, true);
        } else {
            return false;
        }
    }

    //reset timer values
    Shake.prototype.reset = function () {
        this.lastTime = new Date();
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;
    };

    //start listening for devicemotion
    Shake.prototype.start = function () {
        this.reset();
        if (this.hasDeviceMotion) {
            window.addEventListener('devicemotion', this, false);
        }
    };

    //stop listening for devicemotion
    Shake.prototype.stop = function () {
        if (this.hasDeviceMotion) {
            window.removeEventListener('devicemotion', this, false);
        }
        this.reset();
    };

    //calculates if shake did occur
    Shake.prototype.devicemotion = function (e) {
        var current = e.accelerationIncludingGravity;
        var currentTime;
        var timeDifference;
        var deltaX = 0;
        var deltaY = 0;
        var deltaZ = 0;

        if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
            this.lastX = current.x;
            this.lastY = current.y;
            this.lastZ = current.z;
            return;
        }

        deltaX = Math.abs(this.lastX - current.x);
        deltaY = Math.abs(this.lastY - current.y);
        deltaZ = Math.abs(this.lastZ - current.z);

        if (((deltaX > this.options.threshold) && (deltaY > this.options.threshold)) || ((deltaX > this.options.threshold) && (deltaZ > this.options.threshold)) || ((deltaY > this.options.threshold) && (deltaZ > this.options.threshold))) {
            //calculate time in milliseconds since last shake registered
            currentTime = new Date();
            timeDifference = currentTime.getTime() - this.lastTime.getTime();

            if (timeDifference > this.options.timeout) {
                window.dispatchEvent(this.event);
                this.lastTime = new Date();
            }
        }

        this.lastX = current.x;
        this.lastY = current.y;
        this.lastZ = current.z;

    };

    //event handler
    Shake.prototype.handleEvent = function (e) {
        if (typeof (this[e.type]) === 'function') {
            return this[e.type](e);
        }
    };

    return Shake;
}));

},{}],2:[function(require,module,exports){
var Shake = require('shake.js');

const ingridients = [
    {
        image: "images/Banana-Single.png",
        name: "banana",
        color: 'yellow'
    },
    {
        image: "images/strawberriess.png",
        name: "strawberries",
        color: 'red'
    },
    {
        image: "images/pineapple.png",
        name: "pineapple",
        color: 'palegoldenrod'
    },
    {
        image: "images/blueberries.png",
        name: "blueberry",
        color: 'blue'
    }
]

const ingridientContainer = document.querySelector('.ingredientContainer')

ingridients.forEach((ingredient) => {
    const newElement = document.createElement('div')
    newElement.setAttribute('data-name', ingredient.name)
    newElement.setAttribute('data-color', ingredient.color)
    newElement.setAttribute('class', 'rawIngredient')
    const newImgElement = document.createElement('img')
    newImgElement.setAttribute('src', ingredient.image)
    newElement.appendChild(newImgElement)
    ingridientContainer.appendChild(newElement)
})

const ingredientElements = document.querySelectorAll('.rawIngredient')
ingredientElements.forEach((Element) => {
    Element.addEventListener('click', ((e) => {
        const pressed = e.currentTarget.dataset.name
        const color = e.currentTarget.dataset.color
        newDiv = document.createElement('div')
        newDiv.setAttribute('class', `ingredient ${color}`)
        // document.querySelector('.glass').appendChild(newDiv)
        document.querySelector('.glass').insertBefore(newDiv, document.querySelector('.glass').firstChild);



    }))
})

const mask = document.querySelector('.mask')
let grabpositionX = 0
let grabpositionY = 0
isGrabbingGlass = false
mask.addEventListener('touchstart', (e) => {
    isGrabbingGlass = true
    touchCoordinatesX = e.touches[0].clientX
    touchCoordinatesY = e.touches[0].clientY
    //console.log(grabpositionY)
    distanceToEdgeX = e.currentTarget.offsetLeft
    distanceToEdgeY = e.currentTarget.offsetTop

    grabpositionX = touchCoordinatesX - distanceToEdgeX
    grabpositionY = touchCoordinatesY - distanceToEdgeY
    // console.log(e.touches[0])

    console.log(grabpositionX, grabpositionY)
})

mask.addEventListener('touchend', () => {
    isGrabbingGlass = false
})

let glassPositionX
let glassPositionY

window.addEventListener('touchmove', (e) => {
    if (isGrabbingGlass) {
        glassPositionX = e.touches[0].clientX
        glassPositionY = e.touches[0].clientY
        mask.style.transform = `translate(${glassPositionX - distanceToEdgeX - grabpositionX}px, ${glassPositionY - distanceToEdgeY - grabpositionY}px)`
        // mask.style.position = `absolute`
        //transform: translate(300px, 300px);
    }
})

var myShakeEvent = new Shake({
    threshold: 15, // optional shake strength threshold
    timeout: 1000 // optional, determines the frequency of event generation
});

myShakeEvent.start()

window.addEventListener('shake', shakeEventDidOccur, false);
window.addEventListener('touchstart', shakeEventDidOccur, false);

//function to call when shake occurs
function shakeEventDidOccur() {

    //put your own code here etc.
    alert('shake!');
}

//another push
},{"shake.js":1}]},{},[2]);
