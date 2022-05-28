const volumeSlider = document.querySelector('#volume-control')
const padDisplay = document.querySelector('#display-text')
const drumPad = document.querySelectorAll('.drum-pad')
const audioClips = document.querySelectorAll('.clip')
const switchBtn = document.querySelector('#switch')
let audioVolume = 0.5
let audioPlayed
let audioStatus
let padKey


const updateVolume = (e) => {
    let volume = e.target.value
    audioVolume = volume / 10
    audioPlayed.volume = volume / 10
}

const padInHTML = (str) => padDisplay.innerHTML = str

const trackAudio = (e) => {
    let eventCall = e.type

    if (eventCall === 'playing') {
        audioStatus = true
    } else if (eventCall === 'ended') {
        audioStatus = false
        padInHTML("Don't waste a minute!")
    }
}

const displayAudioName = (audioPlayed) => {
    let audioName = audioPlayed.getAttribute('value')
    padInHTML(`\"${audioName}\"`)
}

const playAudio = (padKey) => {

    for (let j = 0; j < audioClips.length; j++) {
        audioPlayed = audioClips[j]
        if (audioPlayed.getAttribute('id') === padKey) {
            ['playing', 'ended'].forEach(e => audioPlayed.addEventListener(e, trackAudio))
            displayAudioName(audioPlayed)
            audioPlayed.volume = audioVolume
            return audioPlayed.play()
        }
    }
}

const eventTypes = {
    keydown: (e) => {
        padKey = e.key.toUpperCase()
    },
    click: (e) => {
        padKey = e.target.getAttribute('id')
    }
}

const pauseReset = () => {
    if (audioStatus) {
        audioPlayed.pause()
        audioPlayed.currentTime = 0
    }
}

const handlePadEvent = (e) => {
    pauseReset()
    if (eventTypes[e.type]) {
        eventTypes[e.type](e)
        playAudio(padKey)
    }
}

const filterKey = (e) => {
    drumPad.forEach(pad => {
        if (e.key.toUpperCase() === pad.getAttribute('id')) {
            handlePadEvent(e)
        }
    })
}

const turnPadOn = (state) => {

    drumPad.forEach(pad => {
        if (state === 'switchOn') {
            pad.disabled = false
            pad.style = `
            box-shadow: inset 0 0 5px #61fcfe;
            color: #61fcfe;
            `
        } else if (state === 'switchOff') {
            pad.disabled = true
            pad.style = `
            box-shadow: none;
            color: #fff;
            `
        };
    })
}

const switchOnOff = (e) => {
    let switchID = e.target.getAttribute('id')

    for (let i = 0; i < drumPad.length; i++) {
        if (switchID === 'switchOn') {
            turnPadOn(switchID)
            drumPad[i].addEventListener('click', handlePadEvent)
            volumeSlider.addEventListener('input', updateVolume)
            document.addEventListener('keydown', filterKey)
        } else if (switchID === 'switchOff') {
            turnPadOn(switchID)
            drumPad[i].removeEventListener('click', handlePadEvent)
            volumeSlider.removeEventListener('input', updateVolume)
            document.removeEventListener('keydown', filterKey)
            padInHTML('Looking for a tailor?')
            pauseReset()
        };
    }
}

switchBtn.addEventListener('click', switchOnOff)

