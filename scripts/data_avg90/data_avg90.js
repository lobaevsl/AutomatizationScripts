((D, B, log = arg => console.log(arg)) => {

    const input = D.querySelector('input');
    const buttonFront = D.getElementById('front');
    const buttonMiddle = D.getElementById('middle');
    const buttonDownload = D.getElementById('download');
    const textOut = D.getElementById('textOut');
    const fileName = D.getElementById('fileName');
    let file;
    let matrix;
    let fileText;
    let outString;

    const reader = new FileReader();

    buttonFront.addEventListener('click', () => {
       set(1);
    });

    buttonMiddle.addEventListener('click', () => {
        set(1000);
    });

    buttonDownload.addEventListener('click', () => {
        download();
    });

    input.addEventListener('change', () => {
        file = input.files[0];
        fileName.innerText = file.name;
        reader.readAsText(file, 'utf-8');
        reader.onload = () => {
            fileText = reader.result;
        };

        buttonFront.disabled = false;
        buttonMiddle.disabled = false;
    });

    function set(multiply){
        fillMatrix();
        calculate(multiply)
        print();
        buttonDownload.disabled = false;
    }

    function fillMatrix(){
        matrix = {};
        matrix = fileText.split('\n');
        matrix.shift();
        let _matrix = [];
        matrix.forEach((m) => {
            let cell = m.split(',');
            let num;
            for (let i in cell) {
                cell[i] = cell[i].replaceAll('"', '');
                cell[i] = cell[i].replaceAll('\r', '');
                num = parseFloat(cell[i]);
                cell[i] = isNaN(num) ? cell[i] : num;
            }
            _matrix.push(cell);
        });
        _matrix = rotate(_matrix);
        matrix = toDict(_matrix);
    }

    function rotate(_matrix){
        let m = [];
        for (let y in _matrix[0]){
            if (_matrix[y].length === _matrix[0].length)
                m.push([]);
        }
        for (let y in _matrix){
            if (_matrix[y].length !== _matrix[0].length)
                _matrix.pop(_matrix[y]);
        }
        for (let y in _matrix){
            for (let x in _matrix[0]){
                if (_matrix[y][x] !== ''){
                    m[x].push(_matrix[y][x]);
                }
            }
        }
        return m;
    }

    function toDict(_matrix){
        let dict = {};
        for (let i in _matrix){
            let name = _matrix[i][0].replace(':  ', '');
            if (name !== 'Time') {
                dict[name] = _matrix[i].slice(1);
            }
        }
        return dict;
    }

    function calculate(multiply){
        let m = [];
        for (let [key, value] of Object.entries(matrix)){
            let _value = [];

            for (let i in value){
                if (!isNaN(value[i])){
                    _value.push(value[i])
                }
            }

            value = _value;

            let _average = 0;
            let _percentile = 0;

            let sum = 0;
            for (let i in value){
                value[i] *= multiply;
                sum += value[i];
            }
            _average = sum / value.length;
            _percentile = get_percentile(90, value);

            if (!isNaN(_average) && !isNaN(_percentile)) {
                m.push([key, _average, _percentile])
            }
        }
        matrix = m;
    }

    function print(){
        outString = '';
        for (let y in matrix){
            let str = '';
            for (let x in matrix[y]){
                let cell = matrix[y][x];
                if (typeof cell === 'number'){
                    cell = cell.toFixed(3);
                    cell = cell.toString().replace('.',',');
                }
                str += cell;
                if (x < matrix[y].length - 1) str += '\t';
            }
            outString += str + '\n';
        }
        textOut.innerHTML = outString;
    }

    function download(){
        let blob = new Blob([outString], {type: 'text/csv'});
        let link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', 'calculated.csv');
        link.click();
        link.remove();
    }

    function get_percentile(percentile, array) {
        array.sort(function (a, b) { return a - b; });

        let index = (percentile / 100) * array.length;
        let result;
        if (Math.floor(index) === index) {
            result = (array[index - 1] + array[index]) / 2;
        } else {
            result = array[Math.floor(index)];
        }
        return result;
    }



})(document, document.body)