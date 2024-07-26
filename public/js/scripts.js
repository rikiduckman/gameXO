let gameId; // เก็บไอดีของเกมที่สร้างขึ้นใหม่
let size; // ขนาดของตาราง
let grid; // ตารางที่ใช้เล่นเกม
let currentPlayer = 'X'; // ผู้เล่นปัจจุบัน เริ่มต้นที่ 'X'
let gameEnded = false; // ตัวแปรสถานะว่าเกมจบแล้วหรือยัง

// ฟังก์ชันเริ่มเกมใหม่
async function startGame() {
  size = document.getElementById('size').value; // ดึงค่าขนาดตารางจาก input
  const response = await fetch('/game/newGame', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ size }) // ส่งข้อมูลขนาดตารางไปที่เซิร์ฟเวอร์
  });
  const data = await response.json(); // รับข้อมูลที่เซิร์ฟเวอร์ส่งกลับ
  gameId = data.gameId; // เก็บไอดีของเกมใหม่
  createGrid(size); // สร้างตารางสำหรับเกม
  gameEnded = false; // ตั้งค่าให้เกมยังไม่จบ
}

// ฟังก์ชันสร้างตารางสำหรับเกม
function createGrid(size) {
  const gridElement = document.getElementById('grid');
  gridElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // ตั้งค่ารูปแบบของตาราง
  gridElement.innerHTML = ''; 
  grid = [];
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.addEventListener('click', () => makeMove(i, j)); // ตั้งค่าให้ cell แต่ละ cell สามารถคลิกได้
      grid[i][j] = cell;
      gridElement.appendChild(cell);
    }
  }
}

// ฟังก์ชันรีเซ็ตเกม
function resetGame() {
  document.getElementById('grid').innerHTML = ''; // ล้างตาราง
  gameEnded = false; // ตั้งค่าให้เกมยังไม่จบ
  currentPlayer = 'X'; // ตั้งค่าผู้เล่นเริ่มต้นเป็น 'X'
}

// ฟังก์ชันที่ทำงานเมื่อผู้เล่นทำการเดิน
async function makeMove(x, y) {
  if (gameEnded) return; // ถ้าเกมจบแล้วไม่ต้องทำอะไร

  const cell = grid[x][y];
  if (cell.innerText === '') {
    cell.innerText = currentPlayer; // ตั้งค่าเครื่องหมายผู้เล่นใน cell
    const response = await fetch('/game/move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gameId, move: { x, y, player: currentPlayer } }) // ส่งข้อมูลการเดินไปที่เซิร์ฟเวอร์
    });
    const data = await response.json();
    if (data.success) {
      if (checkWin(currentPlayer)) {
        alert(`${currentPlayer} wins!`);
        await saveGameResult(currentPlayer); // บันทึกผลลัพธ์เกม
        gameEnded = true; // ตั้งค่าให้เกมจบแล้ว
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // สลับผู้เล่น
      }
    }
  }
}

// ฟังก์ชันตรวจสอบว่าผู้เล่นชนะหรือไม่
function checkWin(player) {
  for (let i = 0; i < size; i++) {
    if (grid[i].every(cell => cell.innerText === player)) {
      return true; // ตรวจสอบแนวนอน
    }
  }
  for (let j = 0; j < size; j++) {
    if (grid.every(row => row[j].innerText === player)) {
      return true; // ตรวจสอบแนวตั้ง
    }
  }
  if (grid.every((row, index) => row[index].innerText === player)) {
    return true; // ตรวจสอบแนวทแยงซ้าย
  }
  if (grid.every((row, index) => row[size - index - 1].innerText === player)) {
    return true; // ตรวจสอบแนวทแยงขวา
  }
  return false; // ถ้าไม่มีการชนะในกรณีข้างต้น
}

// ฟังก์ชันบันทึกผลลัพธ์เกม
async function saveGameResult(winner) {
  await fetch('/game/saveResult', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ gameId, winner }) // ส่งข้อมูลผู้ชนะไปที่เซิร์ฟเวอร์
  });
}

// ฟังก์ชันดึงรายการเกมที่ผ่านมา
async function replayGameList() {
  const response = await fetch('/game/gameList');
  const data = await response.json();
  const gameListElement = document.getElementById('gameList');
  gameListElement.innerHTML = ''; 

  data.games.forEach(game => {
    const gameItem = document.createElement('div');
    gameItem.classList.add('game-list-item');
    gameItem.innerText = `Game ${game._id} - ${game.winner} won`;
    gameItem.addEventListener('click', () => replayGame(game._id)); // ตั้งค่าให้แต่ละรายการสามารถคลิกเพื่อรีเพลย์ได้
    gameListElement.appendChild(gameItem);
  });
}

// ฟังก์ชันรีเพลย์เกมที่เลือก
async function replayGame(selectedGameId) {
  const response = await fetch(`/game/replay/${selectedGameId}`);
  const data = await response.json();
  size = data.size;
  createGrid(size); // สร้างตารางใหม่ตามขนาด
  data.moves.forEach(move => {
    const cell = grid[move.x][move.y];
    cell.innerText = move.player; // แสดงการเดินของผู้เล่นในตาราง
  });
}
