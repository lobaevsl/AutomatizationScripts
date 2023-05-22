const regExp = new RegExp('([^, ]+)', 'g');

function split(){
    const input = document.getElementById('links').value;
    const links = [...input.matchAll(regExp)];
    let o = '';
    for(let i = 0; i < links.length; i++){
        let elem = document.createElement('a');
        elem.href = links[i][0];
        elem.target = '_blank';
        elem.textContent = 'Ссылка ' + (i + 1);
        elem.appendChild(document.createElement('br'));

        document.getElementById('out').appendChild(elem);
    }

}