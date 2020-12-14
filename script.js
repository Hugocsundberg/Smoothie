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