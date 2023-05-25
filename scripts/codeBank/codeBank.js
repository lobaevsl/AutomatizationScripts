const regExp = new RegExp('(\\d+) - (.+)$', 'gm');

function check() {
    const input = document.getElementById('digits');
    const outLeft = document.getElementById('outLeft');
    const outRight = document.getElementById('outRight');

    const lines = [...input.value.matchAll(regExp)];
    if (lines.length === 0) {
        outLeft.innerText = '';
        outRight.innerText = '';
    } else {
        outLeft.rows = lines.length;
        outRight.rows = lines.length;
        let outLeftText = '';
        let outRightText = '';
        for (let i = 0; i < lines.length; i++) {
            outLeftText += lines[i][1] + '\n';
            outRightText += lines[i][2] + '\n';
        }


        outLeft.innerHTML = outLeftText.slice(0, -1);
        outRight.innerHTML = outRightText.slice(0, -1);
    }
    input.value = '';
}

function copyToClipboard(which) {
    const output = document.getElementById(which);
    navigator.clipboard.writeText(output.innerHTML).then(() => {
    });
}