let layout = {
    autosize: true,
    xaxis: {
        rangemode: 'tozero',
        fixedrange: true,
    },
    yaxis: {
        rangemode: 'tozero',
        fixedrange: true,
    },
    margin: {
        l: 20,
        r: 20,
        b: 20,
        t: 20,
        pad: 0
    }
};
let config = {
    responsive: true,
    displayModeBar: false
}

let cnt = 0;
let intervalVar
function startGraph() {

    intervalVar = setInterval(function () {
        let update = {
            x: [ballpit.history[0].slice(-1)],
            y: [ballpit.history[1].slice(-1)]
        }
        //console.log(ballpit.history)
        console.log(ballpit.history[0].slice(-1), ballpit.history[1].slice(-1))

        Plotly.extendTraces('chart', update, [0]);
        cnt++;
        if (cnt > 200) {
            Plotly.relayout('chart', {});
        }
    }, 100);
}

function stopGraph(){
    clearInterval(intervalVar);
}

function makeGraph() {

    let data = [
        {
            x: ballpit.history[0],
            y: ballpit.history[1],
            mode: 'lines'
        }
    ];
    Plotly.plot('chart', data, layout, config);
}
makeGraph()

function remakeGraph() {
    Plotly.purge('chart')
    makeGraph()
}