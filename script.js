const button = document.querySelector("button")
const input = document.querySelector("input")
const audio = document.querySelector("audio")
const screen = document.querySelector("#screen")
const info = document.querySelector(".info")
const text = document.querySelector(".text")
let songs = []
let currentIndex = 0
let fileName = null
const letters = document.createElement("span")
let effectsInterval = null
let lettersInterval = null

button.addEventListener("click", () => {
    input.click()
})

input.addEventListener("change", () => {
    songs = []
    currentIndex = 0
    const files = document.querySelector("#music").files
    for(let i = 0; i < files.length; i++) {
        const fileName = files[i].name
        const stringLength = fileName.length
        const extension = fileName.substring(stringLength - 3)
        let mime = null
        if(extension === "mp3" || extension === "ogg") {
            mime = extension
        }
        if(mime !== null) {
            const song = {
                title: fileName.substring(0, stringLength - 4),
                source: "./songs/" + fileName,
                type: "audio/" + mime
            }
            songs.push(song)            
        }
    }    
    playSong(currentIndex)

})

function playSong(index) {
    try {
        audio.src = songs[index].source
        audio.type = songs[index].type 
        audio.load()
        clearInterval(lettersInterval)
        info.classList.remove("error")
        text.innerHTML = "" 
        letters.innerHTML = ""
        letters.innerHTML = songs[index].title
        text.appendChild(letters)
    }
    catch(error) {        
        info.classList.add("error")
        text.innerHTML = "Only .mp3 or .ogg files can be selected (reloading page...)"
        audio.pause()
        audio.currentTime = 0
        clearInterval(effectsInterval)
        screen.classList.remove("effects")
        songs = []
        currentIndex = 0
        setTimeout(() => {
            window.location.href = "/"
        }, 3000)
    }
}

audio.addEventListener("play", () => {
    try {        
        const red = Math.floor(Math.random() * 256)
        const green = Math.floor(Math.random() * 256)
        const blue = Math.floor(Math.random() * 256)
        screen.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue +')'
        let originalName = songs[currentIndex].title
        screen.classList.add("effects")
        effectsInterval = setInterval(() => {
            const r = Math.floor(Math.random() * 256)
            const g = Math.floor(Math.random() * 256)
            const b = Math.floor(Math.random() * 256)
            screen.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b +')'
        }, 5000)
        lettersInterval = setInterval(() => {
            for(let i = 0; i < originalName.length; i++) {
                originalName = originalName.substring(originalName.length, 1)
                letters.innerHTML = originalName
                break
            }
            if(originalName.length === 0) {
                originalName = songs[currentIndex].title
                letters.innerHTML = originalName
            }
        }, 350)
    }
    catch(error) {
        console.log(error)
    }
})

audio.addEventListener("pause", () => {
    clearInterval(lettersInterval)
    letters.innerHTML = "(paused)"
})

audio.addEventListener("ended", () => {
    currentIndex++
    clearInterval(lettersInterval)
    screen.classList.remove("effects")
    if(currentIndex < songs.length) {
        playSong(currentIndex)
    }
    else {
        letters.innerHTML = songs[currentIndex - 1].title
        currentIndex = 0
    }
})

audio.addEventListener("error", (event) => {
    info.classList.add("error")
    text.innerHTML = "An error occurred trying to load the song"
    screen.classList.remove("effects")
})