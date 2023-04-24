const table = document.querySelector("#board")
const timer = document.querySelector("#timer")
const game = document.querySelector("#game")

let board = [[]]
let time = 0
let player = ""
let diff = ""

document.querySelector("#easy").addEventListener("click", () => {
    setup(easy)
    diff = "easy"
})

document.querySelector("#med").addEventListener("click", () => {
    setup(med)
    diff = "med"
})

document.querySelector("#extreme").addEventListener("click", () => {
    setup(extreme)
    diff = "extreme"
})

const setup = (difficulty) => {
    table.innerHTML = ""
    board = [[]]
    time = 0
    player = document.querySelector("#name").value.trim().length > 0 ? document.querySelector("#name").value : "István"

    game.style.display = "flex"
    document.querySelector("#selector").style.display = "none"
    document.querySelector("#player").innerText = player

    for (let y = 0; y < difficulty.table.length; y++) {
        const row = document.createElement("tr")

        for (let x = 0; x < difficulty.table[y].length; x++) {
            const field = document.createElement("td")

            if (difficulty.table[y][x] == 1) {
                field.classList.add("black")

                let num = difficulty.blacks.findIndex(n =>
                    n.x == x && n.y == y
                )

                num != -1 ? field.innerText = difficulty.blacks[num].n : null

                field.innerText == "0" ? field.classList.add("correct") : null

            } else {
                field.dataset.lighted = 0
            }

            row.appendChild(field)
        }
        table.appendChild(row)
    }

    board = difficulty.table
}



setInterval(() => {
    timer.innerText = `${Math.floor(time++ / 60).toString().padStart(2, 0)} : ${(time % 60).toString().padStart(2, 0)}`
}, 1000)

table.addEventListener("click", (event) => {
    let x = event.target.cellIndex
    let y = event.target.parentElement.rowIndex
    light(x, y)
    checkBlack(x, y)
    if (checkEnd()) {
        alert(`Gratulálunk, teljesítette a szintet!\n Idő: ${Math.floor(time / 60).toString().padStart(2, 0)} : ${(time % 60).toString().padStart(2, 0)}`)
        document.querySelector("#selector").style.display = "flex"
        document.querySelector("#game").style.display = "none"

        localStorage.setItem("random string", JSON.stringify({ player: player, difficulty: diff, time: `${Math.floor(time / 60).toString().padStart(2, 0)} : ${(time % 60).toString().padStart(2, 0)}` }))
        results()
    }
})

const light = (x, y) => {
    table.rows[y].cells[x].classList.toggle("clicked") ? add(x, y) : rem(x, y)

}

const add = (x, y) => {
    table.rows[y].cells[x].innerText = "💡"

    let [up, down, left, right] = [y, y, x, x]

    //up lights
    while (--up >= 0 && !(table.rows[up].cells[x].classList.contains("black"))) {
        table.rows[up].cells[x].dataset.lighted = parseInt(table.rows[up].cells[x].dataset.lighted) + 1
        table.rows[up].cells[x].classList.add("lighted")
        animation(table.rows[up].cells[x], Math.abs(y - up))
    }

    // down lights
    while (++down < board.length && !(table.rows[down].cells[x].classList.contains("black"))) {
        table.rows[down].cells[x].dataset.lighted = parseInt(table.rows[down].cells[x].dataset.lighted) + 1
        table.rows[down].cells[x].classList.add("lighted")
        animation(table.rows[down].cells[x], down)
    }

    // right lights
    while (++right < board[x].length && !(table.rows[y].cells[right].classList.contains("black"))) {
        table.rows[y].cells[right].dataset.lighted = parseInt(table.rows[y].cells[right].dataset.lighted) + 1
        table.rows[y].cells[right].classList.add("lighted")
        animation(table.rows[y].cells[right], right)
    }

    // left lights
    while (--left >= 0 && !(table.rows[y].cells[left].classList.contains("black"))) {
        table.rows[y].cells[left].dataset.lighted = parseInt(table.rows[y].cells[left].dataset.lighted) + 1
        table.rows[y].cells[left].classList.add("lighted")
        animation(table.rows[y].cells[left], Math.abs(y - left))
    }
}

const rem = (x, y) => {
    table.rows[y].cells[x].innerText = ""

    let [up, down, left, right] = [y, y, x, x]

    //up lights
    while (--up >= 0 && !(table.rows[up].cells[x].classList.contains("black"))) {
        table.rows[up].cells[x].dataset.lighted = parseInt(table.rows[up].cells[x].dataset.lighted) - 1
        if (parseInt(table.rows[up].cells[x].dataset.lighted) == 0)
            table.rows[up].cells[x].classList.remove("lighted")
    }

    // down lights
    while (++down < board.length && !(table.rows[down].cells[x].classList.contains("black"))) {
        table.rows[down].cells[x].dataset.lighted = parseInt(table.rows[down].cells[x].dataset.lighted) - 1
        if (parseInt(table.rows[down].cells[x].dataset.lighted) == 0)
            table.rows[down].cells[x].classList.remove("lighted")

    }

    // right lights
    while (++right < board[x].length && !(table.rows[y].cells[right].classList.contains("black"))) {
        table.rows[y].cells[right].dataset.lighted = parseInt(table.rows[y].cells[right].dataset.lighted) - 1
        if (parseInt(table.rows[y].cells[right].dataset.lighted) == 0)
            table.rows[y].cells[right].classList.remove("lighted")
    }

    // left lights
    while (--left >= 0 && !(table.rows[y].cells[left].classList.contains("black"))) {
        table.rows[y].cells[left].dataset.lighted = parseInt(table.rows[y].cells[left].dataset.lighted) - 1
        if (parseInt(table.rows[y].cells[left].dataset.lighted) == 0)
            table.rows[y].cells[left].classList.remove("lighted")
    }
}

const checkBlack = (x, y) => {
    const blacks = document.querySelectorAll(".black")
    let res = [...blacks].filter(elem => elem.innerText != "")
        .filter(element =>
            (element.cellIndex + 1 == x && element.parentElement.rowIndex == y) ||
            (element.cellIndex - 1 == x && element.parentElement.rowIndex == y) ||
            (element.cellIndex == x && element.parentElement.rowIndex + 1 == y) ||
            (element.cellIndex == x && element.parentElement.rowIndex - 1 == y)
        )

    res.forEach(elem => {
        if (table.rows[y].cells[x].classList.contains("clicked")) {
            elem.innerText = parseInt(elem.innerText) - 1
        } else {
            elem.innerText = parseInt(elem.innerText) + 1
        }

        if (parseInt(elem.innerText) === 0) {
            table.rows[elem.parentElement.rowIndex].cells[elem.cellIndex].classList.add("correct")
        } else {
            table.rows[elem.parentElement.rowIndex].cells[elem.cellIndex].classList.remove("correct")

        }
    })
}

const animation = (elem, index) => {
    setTimeout(() => {
        elem.classList.add("lighted")
    }, 50 * index)
}

const checkEnd = () => {
    const blacks = document.querySelectorAll(".black")
    const fields = document.querySelectorAll("#board td")
    const wrongs = document.querySelectorAll("td.clicked.lighted")

    return (
        (([...blacks].filter(elem => elem.innerText != "").filter(element => !(element.classList.contains("correct")))).length == 0) &&
        wrongs.length == 0 &&
        ([...fields].filter(elem => elem.classList.length == 0).length == 0)
    )
}

const results = () => {
    const lasts = document.querySelector("#last-games table tbody")

    for (let key in localStorage) {
        const newTR = document.createElement("tr")

        const player = document.createElement("td")
        const dif = document.createElement("td")
        const time = document.createElement("td")

        player.innerText = JSON.parse(localStorage.getItem(key)).player
        dif.innerText = JSON.parse(localStorage.getItem(key)).difficulty
        time.innerText = JSON.parse(localStorage.getItem(key)).time


        newTR.appendChild(player)
        newTR.appendChild(dif)
        newTR.appendChild(time)

        lasts.appendChild(newTR)
    }

}

window.addEventListener("load", results)