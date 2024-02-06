'use strict'

const WALL = '#'
const FOOD = '·'
const EMPTY = ' '
const SUPER_FOOD = '✪'
const CHERRY = '🍒'
// Model
const gGame = {
    score: 0,
    isOn: false
}
var gBoard
var gIsAlive = true
var gFoodCount = 0
var gCherryInterval

function onInit() {
    gBoard = buildBoard()
    updateScore(0)
    createGhosts(gBoard, 3)
    createPacman(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
    hideModal()
    gCherryInterval = setInterval(spawnCherry, 15000)
    // moveGhosts()
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            gFoodCount++

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
                gFoodCount--
            }

            if (i === 1 && j === 1 ||
                i === 1 && j === size - 2 ||
                i === size - 2 && j === 1 ||
                i === size - 2 && j === size - 2) {
                board[i][j] = SUPER_FOOD
                gFoodCount--
            }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function renderCell(location, value, rotation = '') {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.style.transform = rotation
    elCell.innerHTML = value
}

function updateScore(diff) {
    // DONE: update model and dom
    if (!diff) {
        gGame.score = 0
    } else {
        gGame.score += diff
    }
    document.querySelector('span.score').innerText = gGame.score
    gFoodCount--
    console.log("food left:", gFoodCount)
    if (gGame.score > 100 || gFoodCount <= 0) gameOver()
}

function gameOver() {

    if (gIsAlive) {
        //victory
        showModal()
        clearInterval(gIntervalGhosts)
        clearInterval(gCherryInterval)
        clearTimeout(gSuperModeTimeout)
        gGhostsEaten = 0
        // renderCell(gPacman.location, '🪦')
        gFoodCount = 0
        gGame.isOn = false
        //gIsAlive = true
    } else {
        //game over
        showModal()
        clearInterval(gIntervalGhosts)
        clearInterval(gCherryInterval)
        clearTimeout(gSuperModeTimeout)
        gGhostsEaten = 0
        gFoodCount = -1
        renderCell(gPacman.location, '🪦')
        gGame.isOn = false
        gIsAlive = true
    }
}

function spawnCherry() {
    const emptyPos = getEmptyPos()
    if (!emptyPos) return
    gBoard[emptyPos.i][emptyPos.j] = CHERRY
    renderCell(emptyPos, CHERRY)

}

function showModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('hide')
    const elModalText = document.querySelector('.modal h2')
    elModalText.innerText = gIsAlive ? 'Victory!' : 'You lose!'
}

function hideModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
}

function getEmptyPos() {
    const emptyPoss = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell === EMPTY) {
                emptyPoss.push({ i, j })
            }
        }
    }

    const randIdx = getRandomIntInclusive(0, emptyPoss.length - 1)
    return emptyPoss[randIdx]
}

