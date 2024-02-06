'use strict'

const PACMAN = '😀'
const SUPER_PACMAN = '😡'
var gPacman
var gSuperModeTimeout

function createPacman(board) {
    // DONE: initialize gPacman...
    gPacman = {
        location: {
            i: 2,
            j: 2
        },
        isSuper: false,
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
    gFoodCount--
}

function onMovePacman(ev) {
    if (!gGame.isOn) return
    // DONE: use getNextLocation(), nextCell
    const nextLocation = getNextLocation(ev.key)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    // DONE: return if cannot move
    if (nextCell === WALL) return


    // DONE: hitting a ghost? call gameOver
    if (nextCell === GHOST) {

        if (gPacman.isSuper) {
            eatGhost(findGhost(nextLocation))
        } else {
            gIsAlive = false
            gameOver()
            return
        }
    }


    if (nextCell === FOOD) updateScore(1)

    if (nextCell === SUPER_FOOD && gPacman.isSuper === true) {
        //SKIP SUPER FOOD HERE
        console.log('cant eat anymore super food')
        return
    }
    
    else if (nextCell === SUPER_FOOD && gPacman.isSuper === false) {
        console.log('SUPER MODE!')
        gPacman.isSuper = true
        gSuperModeTimeout = setTimeout(() => {
            gPacman.isSuper = false
            renderCell(gPacman.location, PACMAN)
            if (gGhostsEaten > 0) {
                for (var i = 0; i < gGhostsEaten; i++) {
                    createGhost(gBoard)
                }
            }
            console.log('not so super now...')
        }, 5000)
    }

    if (nextCell === CHERRY) updateScore(10)


    // DONE: moving from current location:
    // DONE: update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // DONE: update the DOM
    renderCell(gPacman.location, EMPTY)

    // DONE: Move the pacman to new location:
    // DONE: update the model
    gPacman.location = nextLocation
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    // DONE: update the DOM
    renderCell(nextLocation, gPacman.isSuper ? SUPER_PACMAN : PACMAN, nextLocation.rotation)
}

function getNextLocation(eventKeyboard) {
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard) {
        case 'ArrowUp':
            nextLocation.rotation = 'rotate(180deg)'
            nextLocation.i--
            break;
        case 'ArrowRight':
            nextLocation.rotation = 'rotate(-90deg)'
            nextLocation.j++
            break;
        case 'ArrowDown':
            nextLocation.rotation = 'rotate(0deg)'
            nextLocation.i++
            break;
        case 'ArrowLeft':
            nextLocation.rotation = 'rotate(90deg)'
            nextLocation.j--
            break;
        default:
            nextLocation.rotation = ''
    }
    return nextLocation
}

function findGhost(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        if (ghost.location.i === location.i && ghost.location.j === location.j) {
            return ghost
        }
    }
    return null
}