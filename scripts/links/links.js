const regExp = new RegExp('([^, ]+)', 'g');

function split() {
    const input = document.getElementById('links');
    const output = document.getElementById('out');

    output.innerHTML = '';
    const links = [...input.value.matchAll(regExp)];
    if (links.length === 1) {
        output.innerText = 'Ответ';
    } else {
        for (let i = 0; i < links.length; i++) {
            let elem = document.createElement('a');
            elem.href = links[i][0];
            elem.target = '_blank';
            elem.textContent = 'Ссылка ' + (i + 1);
            elem.appendChild(document.createElement('br'));

            output.appendChild(elem);
        }
    }
    input.value = '';

}