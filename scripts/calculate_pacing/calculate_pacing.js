

class Transaction {
    constructor(id) {
        this.id = id
        this.row = document.getElementById(`transaction-row-${id}`)
        this.button_delete = document.getElementById(`button-delete-${id}`)
        this.radio_main = document.getElementById(`radio-main-${id}`);
        this.transaction_count = document.getElementById(`transaction-count-${id}`)
        this.transaction_rps = document.getElementById(`transaction-rps-${id}`)
        this.transaction_rpm = document.getElementById(`transaction-rpm-${id}`)
        this.transaction_rph = document.getElementById(`transaction-rph-${id}`)
        this.threads_count = document.getElementById(`threads-count-${id}`)
        this.pacing = document.getElementById(`pacing-${id}`)
        this.if_chance = document.getElementById(`if-chance-${id}`)
        this.while_count = document.getElementById(`while-count-${id}`)
        this.round_check = document.getElementById(`round-check-${id}`)

        this.transaction_rps.addEventListener('input', () => {
            this.onRpsChanged()
        })
        this.transaction_rpm.addEventListener('input', () => {
            this.onRpmChanged()
        })
        this.transaction_rph.addEventListener('input', () => {
            this.onRphChanged()
        })
        this.threads_count.addEventListener('input', () => {
            this.onThreadsChanged()
        })

        this.round_check.addEventListener('change', () => {
            recalculateAll()
        })

        this.radio_main.addEventListener('change', () => {
            if (this.radio_main.checked) setMainTransaction(this)
            recalculateAll()
        })

        this.button_delete.addEventListener('click', () => {
            if (transactions.length < 2) return
            this.row.remove()
            onDeleteRow(this)
            delete this
        })

        this.transaction_count.addEventListener('input', () =>{
            this.onTransactionsCountChanged()
        })
    }

    setAllIds(id){
        this.id = id
        this.row.id = `transaction-row-${id}`
        this.button_delete.id = `button-delete-${id}`
        this.radio_main.id = `radio-main-${id}`
        this.transaction_count.id = `transaction-count-${id}`
        this.transaction_rps.id = `transaction-rps-${id}`
        this.transaction_rpm.id = `transaction-rpm-${id}`
        this.transaction_rph.id = `transaction-rph-${id}`
        this.threads_count.id = `threads-count-${id}`
        this.pacing.id = `pacing-${id}`
        this.if_chance.id = `if-chance-${id}`
        this.while_count.id = `while-count-${id}`
        this.round_check.id = `round-check-${id}`

        this.button_delete.innerHTML = `Удалить ${id}`
    }

    onRpsChanged(){
        let currentRps = this.transaction_rps.value

        if (currentRps < 0) {
            currentRps *= -1
            this.transaction_rps.value = currentRps
        }

        let currentStr = currentRps.toString()

        if (currentStr === '-0') {
            this.transaction_rps.value = 0
        }

        if (currentStr.length > 1 && (currentStr[0] === '0' && currentStr[1] !== '.')) {
            currentStr = currentStr.substring(1)
            currentRps = parseFloat(currentStr)
            this.transaction_rps.value = currentRps
        }
        if (currentStr.length === 0) this.transaction_rps.value = 0

        this.transaction_rpm.value = currentRps * 60
        this.transaction_rph.value = currentRps * 3600

        recalculateAll()
    }

    onRpmChanged(){
        let currentRpm = this.transaction_rpm.value

        if (currentRpm < 0) {
            currentRpm *= -1
            this.transaction_rps.value = currentRpm
        }

        let currentStr = currentRpm.toString()

        if (currentStr === '-0') {
            this.transaction_rpm.value = 0
        }

        if (currentStr.length > 1 && (currentStr[0] === '0' && currentStr[1] !== '.')) {
            currentStr = currentStr.substring(1)
            currentRpm = parseFloat(currentStr)
            this.transaction_rpm.value = currentRpm
        }
        else if (currentStr.length === 0) this.transaction_rpm.value = 0

        this.transaction_rps.value = currentRpm / 60
        this.transaction_rph.value = currentRpm * 60

        recalculateAll()
    }

    onRphChanged(){
        let currentRph = this.transaction_rph.value

        if (currentRph < 0) {
            currentRph *= -1
            this.transaction_rps.value = currentRph
        }

        let currentStr = currentRph.toString()

        if (currentStr === '-0') {
            this.transaction_rph.value = 0
        }

        if (currentStr.length > 1 && (currentStr[0] === '0' && currentStr[1] !== '.')) {
            currentStr = currentStr.substring(1)
            currentRph = parseFloat(currentStr)
            this.transaction_rph.value = currentRph
        }
        else if (currentStr.length === 0) this.transaction_rph.value = 0

        this.transaction_rps.value = currentRph / 3600
        this.transaction_rpm.value = currentRph / 60

        recalculateAll()
    }

    onThreadsChanged(){
        let currentThreads = this.threads_count.value

        if (currentThreads < 0) {
            currentThreads *= -1
            this.threads_count.value = currentThreads
        }

        let currentStr = currentThreads.toString()

        if (currentStr === '-0') {
            this.threads_count.value = 0
        }

        if (currentStr.length > 1 && (currentStr[0] === '0' && currentStr[1] !== '.')) {
            currentStr = currentStr.substring(1)
            currentThreads = parseFloat(currentStr)
            this.threads_count.value = currentThreads
        }
        else if (currentStr.length === 0) this.threads_count.value = 0

        recalculateAll()
    }

    onTransactionsCountChanged(){
        let currentCount = this.transaction_count.value

        if (currentCount < 0) {
            currentCount *= -1
            this.transaction_count.value = currentCount
        }

        let currentStr = currentCount.toString()

        if (currentStr === '-0') {
            this.transaction_count.value = 0
        }

        if (currentStr.length > 1 && (currentStr[0] === '0' && currentStr[1] !== '.')) {
            currentStr = currentStr.substring(1)
            currentCount = parseFloat(currentStr)
            this.transaction_count.value = currentCount
        }
        else if (currentStr.length === 0) this.transaction_count.value = 0

        recalculateAll()
    }

    calculate(){
        let pacing = this.threads_count.value / this.transaction_rps.value
        this.pacing.value = isFinite(pacing) ? pacing : '0'



        let if_chance = this.transaction_rps.value > 0 && main_transaction.transaction_rps.value > 0
            ? (this.transaction_rps.value / main_transaction.transaction_rps.value / (this.transaction_count.value / main_transaction.transaction_count.value)) * 100
            : 0

        let while_count = if_chance > 100 ? Math.round(if_chance / 100) + (if_chance % 100 < (this.round_check.checked ? 25 : 1) ? 0 : 1) : 1
        if_chance /= while_count
        if_chance = if_chance > 100 ? 100 : if_chance
        this.if_chance.value = `${if_chance.toFixed(2)}%`
        this.while_count.value = while_count
    }
}

createTransaction = function (id){
    let transaction_row = document.getElementById('transactions-table').insertRow()
    let index = 0
    transaction_row.id = `transaction-row-${id}`
    let button_delete = transaction_row.insertCell(index++)
    button_delete.innerHTML = `<button id="button-delete-${id}">Удалить ${id}</button>`
    transaction_row.insertCell(index++).innerHTML = `<input type="radio" id="radio-main-${id}" name="radio-main" value="${id}" ${main_transaction == null ? 'checked="checked"' : ''}>`
    transaction_row.insertCell(index++).innerHTML = `<input type="text" name="transaction-name" class="transaction-name-column">`
    transaction_row.insertCell(index++).innerHTML = `<input type="number" id="transaction-count-${id}" value="1">`
    transaction_row.insertCell(index++).innerHTML = `<input type="number" id="transaction-rps-${id}" value="0">`
    transaction_row.insertCell(index++).innerHTML = `<input type="number" id="transaction-rpm-${id}" value="0">`
    transaction_row.insertCell(index++).innerHTML = `<input type="number" id="transaction-rph-${id}" value="0">`
    transaction_row.insertCell(index++).innerHTML = `<input type="number" id="threads-count-${id}" value="0">`
    transaction_row.insertCell(index++).innerHTML = `<input type="text" id="pacing-${id}" value="0" readonly>`
    transaction_row.insertCell(index++).innerHTML = `<input type="text" id="if-chance-${id}" value="0.00%" readonly>`
    transaction_row.insertCell(index++).innerHTML = `<input type="text" id="while-count-${id}" value="1" readonly>`
    transaction_row.insertCell(index++).innerHTML = `<input type="checkbox" id="round-check-${id}">`

    let transaction = new Transaction(id)
    transactions.push(transaction)
    onCreateRow()
    return transaction
}

setMainTransaction = function (new_transaction){
    main_transaction = new_transaction
}

recalculateAll = function (){
    transactions.forEach((transaction) => {
        transaction.calculate()
    })
}

onDeleteRow = function (deleted_transaction){
    if (main_transaction.id === deleted_transaction.id){
        main_transaction = deleted_transaction.id === 1 ? transactions[1] : transactions[0]
        main_transaction.radio_main.checked = true
    }
    let index = 1
    let deletedIndex = 0
    transactions.forEach((transaction) => {
        if (transaction.id === deleted_transaction.id) deletedIndex = deleted_transaction.id - 1
        else transaction.setAllIds(index++)
    })
    transactions.splice(deletedIndex, 1)
    recalculateAll()
    if (transactions.length < 2) transactions[0].button_delete.disabled = true
}

onCreateRow = function(){
    transactions.forEach((transaction) => {
        transaction.button_delete.disabled = transactions.length < 2
    })
}

let transactions = []
let main_transaction

setMainTransaction(createTransaction(1))
