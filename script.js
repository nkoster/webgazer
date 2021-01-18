window.saveDataAcressSessions = true

const LOOK_DELAY = 1000
const LEFT_CUTOFF = window.innerWidth / 4
const RIGHT_CUTOFF = window.innerWidth - window.innerWidth / 4

const getNewImage = (next = false) => {
    const img = document.createElement('img')
    img.src ='https://picsum.photos/1000?' + Math.random()
    if (next) img.classList.add('next')
    document.body.append(img)
    return img
}

let startLookTime = Number.POSITIVE_INFINITY
let lookDirection = null
let imageElement = getNewImage()
let nextImageElelment = getNewImage(true)

webgazer
    .showVideoPreview(true)
    .showPredictionPoints(true)
    .setGazeListener((data, timestamp) => {
        if (data === null || lookDirection === 'STOP') return
        if (data.x < LEFT_CUTOFF && lookDirection !== 'LEFT' && lookDirection !== 'RESET') {
            lookDirection = 'LEFT'
            startLookTime = timestamp
        } else if (data.x > RIGHT_CUTOFF && lookDirection !== 'RIGHT' && lookDirection !== 'RESET') {
            lookDirection = 'RIGHT'
            startLookTime = timestamp
        } else if (data.x >= LEFT_CUTOFF && data.x <= RIGHT_CUTOFF) {
            lookDirection = null
            startLookTime = Number.POSITIVE_INFINITY
        }
        if (startLookTime + LOOK_DELAY < timestamp) {
            if (lookDirection === 'LEFT') {
                imageElement.classList.add('left')
            } else {
                imageElement.classList.add('right')
            }
            startLookTime = Number.POSITIVE_INFINITY
            lookDirection = 'STOP'
            setTimeout(_ => {
                imageElement.remove()
                nextImageElelment.classList.remove('next')
                imageElement = nextImageElelment
                nextImageElelment = getNewImage(true)
                lookDirection = 'RESET'
            }, 200)
        }
    })
    .begin()
