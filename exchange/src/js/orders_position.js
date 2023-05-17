let symbol = 'ETHUSDT';


const toaster = (message) => {
    const elm = document.createElement('elm');
    elm.className = 'toast position-fixed start-0 bg-success text-light p-3';
    elm.innerText = message;
    document.body.appendChild(elm);
    setTimeout(() => {
        elm.remove();
    }, 5000)
}

const onSymbolChange = event => symbol = event.target.value;
const getFormValues = form => {
    const formData = new FormData(form);
    const values = {};
    for (let key of formData.keys()) {
        const { value, type, files } = form[key];
        values[key] = type === 'file' ? files : ((value || value === "") ? value : formData.getAll(key));
    }
    return values;
}

function onPost(form, api, values, method = 'POST') {
    if (!values) values = getFormValues(form);
    form.classList.add('submitted');
    return fetch(api, {
        method: method,
        body: JSON.stringify(values),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(res => {
            form.classList.remove('submitted')
            return res;
        })
}

document.getElementById('set-trading-form').onsubmit = e => {
    e.preventDefault();
    const values = getFormValues(e.target);
    values.symbol = symbol;
    onPost(e.target, '/trading', values, method = 'PUT')
        .then((res) => {
            for(let data of res) {
                if (data.ret_msg === 'OK') return toaster('TP/SL set!');
                if (data.ret_msg !== 'can not set tp/sl/ts for zero position') return toaster(data.ret_msg);
            }
            console.log(res)
            toaster('Something went wrong!');
        })
}

document.getElementById('set-leverage-form').onsubmit = e => {
    e.preventDefault();
    const form = e.target;
    onPost(form, '/set-leverage')
        .then(() => toaster('Leverage is set!'))
}
document.getElementById('place-order').onsubmit = e => {
    e.preventDefault();
    const form = e.target;
    onPost(form, '/order')
}


let timer;
const tableData = {
    dataSource: {
        type: "odata",
        transport: {
            read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
        },
        schema: {
            model: {
                fields: {
                    AccName: { type: "string" },
                    Exchange: { type: "string" },
                    Position: { type: "string" },
                    Equity: { type: "string" },
                    ABalance: { type: "string" },
                    RPNL: { type: "string" },
                    UNPNL: { type: "string" },
                    Leverage: { type: "string" },
                    ACCStatus: { type: "string" },
                }
            }
        },
        pageSize: 50
    },
    height: 540,
    sortable: true,
    reorderable: true,
    selectable: "multiple",
    groupable: true,
    resizable: true,
    filterable: true,
    columnMenu: true,
    pageable: true,
    columns: [{
        field: "AccName",
        title: "Acc. Name",
        locked: true,
        lockable: false,
        width: 150
    }, {
        field: "Exchange",
        title: "Exchange",
        locked: true,
        width: 100
    }, {
        field: "Position",
        title: "Position",
        locked: true,
        width: 100
    }, {
        field: "equity",
        title: "Equity",
        width: 100
    }, {
        field: "available_balance",
        title: "Aval. Balance",
        width: 150
    }, {
        field: "realised_pnl",
        title: "Realized PNL",
        width: 300
    }, {
        field: "unrealised_pnl",
        title: "Unrealized PNL",
        width: 150
    }, {
        field: "Leverage",
        title: "Leverage",
        width: 150
    }, {
        field: "Status",
        title: "Acc. Status",
        width: 150
    },
    ],
    dataSource: {
        data: []
    }
}


let isWidetCreated = false;

async function getPosition() {
    const res = await (await fetch(`/position?symbol=${symbol}&&isAllPositions=true&&isBalance=true`)).json();
    document.getElementById('current-ticket-balance').innerHTML = '$' + res.price.mark_price;
    if(isWidetCreated) {
        $("#gauge").data("kendoRadialGauge").value(res.price.mark_price);
    }
    else {
        createGauge();
        isWidetCreated = true;
    }
    document.getElementById('low_price').innerHTML = '$' + res.price.low_price_24h;
    document.getElementById('prev_price_1h').innerHTML = '$' + res.price.prev_price_1h;
    document.getElementById('prev_price_24h').innerHTML = '$' + res.price.prev_price_24h;
    document.getElementById('high_price_24h').innerHTML = '$' + res.price.high_price_24h;
    let total_unrealised_pnl = 0;
    let total_realised_pnl = 0;
    let total_av_balance = 0;
    const data = [];
    for (let account of res.positions) {
        const row = {
            AccName: account.account,
            OwnerName: account.owner,
            Exchange: account.exchange,
            Status: account.status,
            Position: account.result.length === 0 ? 'Not Open' : '' + 'Open',
            ...account.balance
        }
        data.push(row);
        total_av_balance += account.balance.available_balance || 0
        total_unrealised_pnl += row.unrealised_pnl;
        total_realised_pnl += row.realised_pnl;

    };
    document.getElementById('total_realised_pnl').innerHTML = "$" + total_realised_pnl.toFixed(3);
    document.getElementById('total_unrealised_pnl').innerHTML = "$" + total_unrealised_pnl.toFixed(3);
    document.getElementById('total_av_balance').innerHTML = "$" + total_av_balance.toFixed(3);
    getPosition();
    const table = document.getElementById('grid');
    table.innerHTML = '';
    tableData.dataSource.data = data;
    $("#grid").kendoGrid(tableData);
    // createGauge(res.price.mark_price)

    // fetch(`/position?symbol=${symbol}`)
    //     .then(res => res.json())
    //     .then(res => {
    //         const data = [];
    //         // let total_margin = 0;
    //         // let total_position_value = 0;
    //         // let total_unrealised_pnl = 0;
    //         // let total_realised_pnl = 0;

    //         // const tbody2 = grid[0].childNodes[4].childNodes[0].childNodes[1].childNodes;
    //         // for (let tr of tbody2) {
    //         //     const sellCol = tr.childNodes[1];
    //         //     const sellText = sellCol.innerText;
    //         //     sellCol.innerHTML = `<span class="badge text-light bg-${sellText === 'Sell' ? 'danger' : 'success'}">${sellText}</span>`
    //         //     const unRealizedCol = tr.childNodes[7];
    //         //     const uRText = unRealizedCol.innerText;
    //         //     unRealizedCol.innerHTML = `<span class="badge text-light bg-${uRText < 0 ? 'danger' : 'success'}">${uRText}</span>`

    //         //     tr.style.background = uRText <= 0 ? '#ffd8d5' : '#c8e6c9';
    //         // }
    //     })
    //     .catch(err => console.log(err));
}

getPosition();
























function createGauge(labelPosition) {
    $("#gauge").kendoRadialGauge({

        pointer: {
            value:  2650//Entry Price Radial/ realtime ticker price
        },

        scale: {
            minorUnit: 5,
            startAngle: -30,
            endAngle: 210,
            max: 2750, // Take Profit Price = Entry Price + 35
            min: 2600, // Stop Loss Price Equal to entry Price - 25
            labels: {
                position: labelPosition || "inside"
            },
            ranges: [{
                from: 2810, // entryprice
                to: 2795, // entryprice - 15
                color: "#ffc700"
            }, {
                from: 2795, // entryprice -15
                to: 2780, // entryprice -30
                color: "#ff7a00"
            }, {
                from: 2780, // entryprice -30
                to: 2760, // entryprice - 50
                color: "#c20000"
            },
            {
                from: 2810, // entryprice
                to: 2830, // entryprice +20
                color: "#00ff00"
            }, {
                from: 2830, // entryprice +20
                to: 2855, // entryprice +45
                color: "#00cc00"
            }, {
                from: 2855, // entryprice +45
                to: 2870, // entryprice +60
                color: "#009900"
            }
            ]
        }
    });
}

// $(document).ready(function () {
//     createGauge();

//     $(".box-col").bind("change", refresh);

//     $(document).bind("kendo:skinChange", function (e) {
//         createGauge();
//     });

//     window.configuredRanges = $("#gauge").data("kendoRadialGauge").options.scale.ranges;
// });

function refresh() {
    var gauge = $("#gauge").data("kendoRadialGauge"),
        showLabels = $("#labels").prop("checked"),
        showRanges = $("#ranges").prop("checked"),
        positionInputs = $("input[name='labels-position']"),
        labelsPosition = positionInputs.filter(":checked").val(),
        options = gauge.options;

    options.transitions = false;
    options.scale.labels.visible = showLabels;
    options.scale.labels.position = labelsPosition;
    options.scale.ranges = showRanges ? window.configuredRanges : [];

    gauge.redraw();
}