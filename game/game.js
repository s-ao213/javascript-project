const maze = [
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]
];

const mazeContainer = document.getElementById('maze-container');
const logContainer = document.getElementById('log-container');

let player = { x: 1, y: 1 }; // プレイヤーの初期位置を左上に設定

const customers = [
    { x: 19, y: 0, name: '社長', img: 'syatyou.gif' },
    { x: 0, y: 10, name: '職人', img: 'syokunin.gif' },
    { x: 19, y: 10, name: '料理人', img: 'ryourinin.gif' }
];

let packages = [
    { x: 5, y: 5, name: '社長', img: 'syatyou1.png' },
    { x: 10, y: 5, name: '職人', img: 'syokunin1.png' },
    { x: 15, y: 5, name: '料理人', img: 'ryourinin1.png' }
];

let currentPackage = null;
let startTime = null;
let deliveredPackages = 0;
let playerDirection = 'left'; // 初期方向を設定
const startPosition = { x: 0, y: 0 };

function createMaze() {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (maze[y][x] === 1) {
                cell.classList.add('wall');
            } else {
                cell.classList.add('path');
            }
            mazeContainer.appendChild(cell);
        }
    }
}

function placePlayer() {
    const playerCell = getCell(player.x, player.y);
    playerCell.classList.add('player');
}

function placeCustomers() {
    customers.forEach(customer => {
        const customerCell = getCell(customer.x, customer.y);
        customerCell.classList.add('customer');
        customerCell.style.backgroundImage = `url(${customer.img})`;
    });
}

function placePackages() {
    packages.forEach(pkg => {
        if (pkg) { // nullでない場合にのみ表示
            const packageCell = getCell(pkg.x, pkg.y);
            packageCell.classList.add('package');
            packageCell.style.backgroundImage = `url(${pkg.img})`;
        }
    });
}

function getCell(x, y) {
    return mazeContainer.children[y * 20 + x];
}

function logMessage(message) {
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function handleKeyPress(event) {
    if (!startTime) {
        startTime = new Date();
    }

    const { key } = event;
    let newX = player.x;
    let newY = player.y;
    let direction = playerDirection;

    if (key === 'ArrowUp') {
        newY--;
    }
    if (key === 'ArrowDown') {
        newY++;
    }
    if (key === 'ArrowLeft') {
        newX--;
        direction = 'left';
    }
    if (key === 'ArrowRight') {
        newX++;
        direction = 'right';
    }

    if (newX >= 0 && newX < 20 && newY >= 0 && newY < 11 && maze[newY][newX] === 0) {
        movePlayer(newX, newY, direction);
        checkForPackage();
        checkForCustomer();
        checkForCompletion();
    }
}

function movePlayer(newX, newY, direction) {
    getCell(player.x, player.y).classList.remove('player', `player-${playerDirection}`);
    player.x = newX;
    player.y = newY;
    playerDirection = direction;
    placePlayer();
    updatePlayerIcon();
}

function checkForPackage() {
    if (currentPackage) return;

    const packageIndex = packages.findIndex(pkg => pkg && pkg.x === player.x && pkg.y === player.y);
    if (packageIndex > -1) {
        currentPackage = packages[packageIndex];
        packages[packageIndex] = null; // 拾った荷物をリストから削除
        const packageCell = getCell(currentPackage.x, currentPackage.y);
        packageCell.classList.remove('package');
        packageCell.style.backgroundImage = ''; // アイコンを消す
        logMessage(`${currentPackage.name}の荷物を拾った！`);
    }
}

function checkForCustomer() {
    if (!currentPackage) return;

    const customer = customers.find(cust => 
        Math.abs(cust.x - player.x) <= 1 && Math.abs(cust.y - player.y) <= 1
    );

    if (customer) {
        if (customer.name === currentPackage.name) {
            logMessage(`${customer.name}に${currentPackage.name}の荷物を渡した！`);
            currentPackage = null;
            deliveredPackages++;
            
            if (deliveredPackages === customers.length) {
                logMessage('全ての荷物を配達完了！スタート地点に戻ってください。');
            }
        } else {
            logMessage(`${customer.name}には${currentPackage.name}の荷物は渡せない！`);
        }
    }
}


function checkForCompletion() {
    if (player.x === startPosition.x && player.y === startPosition.y) {
        if (deliveredPackages === customers.length) {
            const endTime = new Date();
            const timeTaken = (endTime - startTime) / 1000;
            logMessage(`ゲームクリア！かかった時間: ${timeTaken}秒`);
        } else {
            logMessage('まだ荷物を運びきれていないよ！！');
        }
    }
}

function updatePlayerIcon() {
    const playerCell = getCell(player.x, player.y);
    playerCell.classList.remove('player-up', 'player-down', 'player-left', 'player-right');
    playerCell.classList.add(`player-${playerDirection}`);
}



document.addEventListener('keydown', handleKeyPress);

createMaze();
placePlayer();
placeCustomers();
placePackages();