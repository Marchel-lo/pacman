'use strict'

const GHOST = '👻'
var gGhosts = []
var gGhostsEaten = 0
var gIntervalGhosts

function createGhosts(board, num) {
    // DONE: 3 ghosts and an interval
    gGhosts = []
    for (var i = 0; i < num; i++) {
        createGhost(board)
    }
    
    if (gIntervalGhosts) clearInterval(gIntervalGhosts)
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function createGhost(board) {
    // DONE
    const ghost = {
        location: {
            i: 2,
            j: 6
        },
        currCellContent: FOOD,
        color: getRandomColor()
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
}

function moveGhosts() {
    // DONE: loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // DONE: figure out moveDiff, nextLocation, nextCell
    const moveDiff = getMoveDiff()
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    // DONE: return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return

    // if the pacman is in super mode:
    // change color of ghosts
    // delete ghost if it pacman touches or it touches the pacman
    if (gPacman.isSuper && nextCell === PACMAN) { 
        eatGhost(ghost)
        return
    }
    // DONE: hitting a pacman? call gameOver
    else if (nextCell === PACMAN) {
        gIsAlive = false
        gameOver()
        return
    }


    // DONE: moving from current location:
    // DONE: update the model 
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // DONE: update the DOM
    renderCell(ghost.location,  ghost.currCellContent)


    // DONE: Move the ghost to new location:
    // DONE: update the model 
    ghost.location = nextLocation
    ghost.currCellContent = nextCell
    gBoard[nextLocation.i][nextLocation.j] = GHOST
    // DONE: update the DOM
    renderCell(ghost.location, changeGhostColor(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function changeGhostColor(ghost) {
    if (gPacman.isSuper) {
        return `<span style="background: blue">${GHOST}</span>`
    } else {
        return `<span style="background: ${ghost.color}">${GHOST}</span>`
    }
}

function eatGhost(ghost) {
    console.log('EATING GHOSTS')
    const ghostIndex = gGhosts.indexOf(ghost)
    if (ghostIndex !== -1) {
        gGhosts.splice(ghostIndex, 1)
        gBoard[ghost.location.i][ghost.location.j] = EMPTY // Clear the cell on the game board
        renderCell(ghost.location, ghost.currCellContent) // Clear the view
        if(gGhostsEaten < 3) gGhostsEaten++
        console.log('gGhostsEaten:', gGhostsEaten)
    }
    return
}