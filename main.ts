const holdingTime = 500
const frequence = 20
const minValue = 2
const maxValue = 99

let currentMinValue = 0
let currentMaxValue = 0
let middleValue = 0

let maxNumber = 0
let aAlreadyPressedTime = 0
let bAlreadyPressedTime = 0
let numberOfGuesses = 0

let isPlaying = false

function changeNumOfSides(newNumOfSides: number) {
    maxNumber = Math.constrain(newNumOfSides, minValue, maxValue)
    whaleysans.showNumber(maxNumber)
    serial.writeValue("maxNumber", maxNumber)
}

changeNumOfSides(maxValue)

basic.forever(function () {
    if (isPlaying) {
        whaleysans.showNumber(middleValue)
        return
    }

    const isAPressed = input.buttonIsPressed(Button.A)
    const isBPressed = input.buttonIsPressed(Button.B)

    if (!isAPressed) {
        aAlreadyPressedTime = 0
    }
    if (!isBPressed) {
        bAlreadyPressedTime = 0
    }

    if (isAPressed && !aAlreadyPressedTime) {
        changeNumOfSides(maxNumber - 1)
        aAlreadyPressedTime = control.millis()
    }
    if (isBPressed && !bAlreadyPressedTime) {
        changeNumOfSides(maxNumber + 1)
        bAlreadyPressedTime = control.millis()
    }

    if (isAPressed && control.millis() - aAlreadyPressedTime >= holdingTime) {
        changeNumOfSides(maxNumber - 1)
    }
    if (isBPressed && control.millis() - bAlreadyPressedTime >= holdingTime) {
        changeNumOfSides(maxNumber + 1)
    }

    basic.pause(1 / frequence)
})

input.onButtonPressed(Button.A, function() {
    if (isPlaying) {
        currentMaxValue = middleValue
        middleValue = Math.floor((currentMaxValue - currentMinValue) / 2) + currentMinValue
        numberOfGuesses += 1
    }
})

input.onButtonPressed(Button.B, function () {
    if (isPlaying) {
        currentMinValue = middleValue
        middleValue = Math.floor((currentMaxValue - currentMinValue) / 2) + currentMinValue
        numberOfGuesses += 1
    }
})

input.onLogoEvent(TouchButtonEvent.Released, function() {
    if (isPlaying) {
        basic.showIcon(IconNames.Yes)
        isPlaying = false
        whaleysans.showNumber(numberOfGuesses)
        return
    }
    isPlaying = true
    numberOfGuesses = 1
    currentMinValue = minValue
    currentMaxValue = maxNumber
    middleValue = Math.floor((currentMaxValue - currentMinValue) / 2) + currentMinValue
})