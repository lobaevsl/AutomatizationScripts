const regExp = new RegExp('\\**((\\d){1,4})(\n|$)', 'g');

function check() {
    const input = document.getElementById('digits');
    const output = document.getElementById('out');

    const nums = [...input.value.matchAll(regExp)];
    if (nums.length === 0) {
        output.innerText = '';
    } else {
        output.rows = nums.length;
        let outputNums = '';
        for (let i = 0; i < nums.length; i++){
            let num = nums[i][1];
            let outputNum = '';
            if (num.length < 4){
                for (let x = 0; x < 4 - num.length; x++){
                    outputNum += 0;
                }
            }
            outputNums += '*' + outputNum + num + '\n';
        }
        outputNums = outputNums.slice(0, -1);
        output.innerHTML = outputNums;
    }
    input.value = '';
}

function copyToClipboard(){
    const output = document.getElementById('out');
    navigator.clipboard.writeText(output.innerHTML).then(() => {});
}