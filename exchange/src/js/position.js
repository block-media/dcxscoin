let timer;
let symbol = 'ETHUSDT';
const tableData = {
    height: 800,
    selectable: "multiple",
    sortable: true,
    reorderable: true,
    groupable: true,
    resizable: true,
    filterable: true,
    columnMenu: true,
    pageable: false,
    toolbar: ["search"],
    search: {
        fields: [
            { name: "AccName", operator: "eq" },
        ]
    },
    columns: [{
        selectable: true,
        locked: true,
        lockable: false,
        width: "40px"
    },
    {
        field: "AccName",
        title: "Acc. Name",
        locked: true,
        width: 200
    }, {
        field: "OwnerName",
        title: "Owner Name",
        locked: true,
        width: 150
    }, {
        field: "Exchange",
        title: "Exchange",
        locked: true,
        width: 150
    }, {
        field: "Symbol",
        title: "Symbol",
        width: 100
    }, {
        field: "Side",
        title: "Side",
        width: 80
    }, {
        field: "Margen",
        title: "Margen",
        width: 100
    }, {
        field: "Qty",
        title: "Qty",
        width: 100
    }, {
        field: "Leverage",
        title: "Leverage",
        width: 100
    }, {
        field: "EntryPrice",
        title: "Entry Price",
        width: 150
    }, {
        field: "LiqPrice",
        title: "Liq. Price",
        width: 150
    }, {
        field: "UnrealizedPNL",
        title: "Unrealized PNL",
        width: 150
    }, {
        field: "RealizedPNL",
        title: "Realized PNL",
        width: 150
    }, {
        field: "WalletBalance",
        title: "Wallet Balance",
        width: 150
    }, {
        field: "TakeProfit",
        title: "Take Profit",
        width: 150
    }, {
        field: "StopLoss",
        title: "Stop Loss",
        width: 150
    }, {
        command: ["TP/SL", "Close Market"],
        // title: "&nbsp;",
        width: "250px"
    }
    ],
    dataSource: {
        data: []
    }
}

function getPosition() {
    fetch(`/position?symbol=${symbol}`)
        .then(res => res.json())
        .then(res => {
            const data = [];
            document.getElementById('price').innerHTML = '$' + res.price.mark_price;
            document.getElementById('low_price').innerHTML = '$' + res.price.low_price_24h;
            document.getElementById('prev_price_1h').innerHTML = '$' + res.price.prev_price_1h;
            document.getElementById('prev_price_24h').innerHTML = '$' + res.price.prev_price_24h;
            document.getElementById('high_price_24h').innerHTML = '$' + res.price.high_price_24h;
            let total_margin = 0;
            let total_position_value = 0;
            let total_unrealised_pnl = 0;
            let total_realised_pnl = 0;
            for (let account of res.positions) {
                for (let result of account.result) {
                    const Margen = result.position_value / result.leverage;
                    total_position_value += result.position_value;
                    total_margin += Margen;
                    total_unrealised_pnl += result.unrealised_pnl;
                    total_realised_pnl += result.realised_pnl;
                    const row = {
                        AccName: account.account,
                        OwnerName: account.owner,
                        Exchange: account.exchange,
                        Symbol: result.symbol,
                        Side: result.side,
                        Margen,
                        Qty: result.size,
                        Leverage: result.leverage,
                        EntryPrice: result.entry_price,
                        LiqPrice: result.liq_price,
                        UnrealizedPNL: result.unrealised_pnl,
                        RealizedPNL: result.realised_pnl,
                        TakeProfit: result.take_profit,
                        StopLoss: result.stop_loss,
                        WalletBalance: result.position_margin
                    }
                    data.push(row);
                }
                document.getElementById('total_margin').innerHTML = "$" + total_margin.toFixed(3);
                document.getElementById('total_position_value').innerHTML = "$" + total_position_value.toFixed(3);
                document.getElementById('total_realised_pnl').innerHTML = "$" + total_realised_pnl.toFixed(3);
                document.getElementById('total_unrealised_pnl').innerHTML = "$" + total_unrealised_pnl.toFixed(3);
            }
            getPosition();
            const table = document.getElementById('grid2');
            table.innerHTML = '';
            tableData.dataSource.data = data;
            const grid = $("#grid2").kendoGrid(tableData);
            const tbody2 = grid[0].childNodes[4].childNodes[0].childNodes[1].childNodes;
            for (let tr of tbody2) {
                const sellCol = tr.childNodes[1];
                const sellText = sellCol.innerText;
                sellCol.innerHTML = `<span class="badge text-light bg-${sellText === 'Sell' ? 'danger' : 'success'}">${sellText}</span>`
                const unRealizedCol = tr.childNodes[7];
                const uRText = unRealizedCol.innerText;
                unRealizedCol.innerHTML = `<span class="badge text-light bg-${uRText < 0 ? 'danger' : 'success'}">${uRText}</span>`

                tr.style.background = uRText <= 0 ? '#ffd8d5' : '#c8e6c9';
            }
        })
        .catch(err => console.log(err));
}

getPosition();
function onSymbolChange(event) {
    symbol = event.target.value;
}