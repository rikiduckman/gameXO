const Game = require('../models/gameData');

// ฟังก์ชันสร้างเกมใหม่
exports.createNewGame = async (req, res) => {
  const { size } = req.body; // ดึงค่าขนาดตารางจาก request body
  const game = new Game({ size, moves: [], winner: null }); // สร้าง instance ของเกมใหม่
  await game.save(); // บันทึกเกมในฐานข้อมูล
  res.json({ gameId: game._id }); // ส่ง response กลับพร้อมกับ gameId
};

// ฟังก์ชันทำการเดินของผู้เล่น
exports.makeMove = async (req, res) => {
  const { gameId, move } = req.body; // ดึงข้อมูล gameId และการเดินจาก request body
  const game = await Game.findById(gameId); // ค้นหาเกมโดยใช้ gameId
  if (game && !game.winner) { // ตรวจสอบว่าเกมยังไม่จบ
    game.moves.push(move); // เพิ่มการเดินในเกม
    await game.save(); // บันทึกการเดินในฐานข้อมูล
    res.json({ success: true }); // ส่ง response ว่าทำการเดินสำเร็จ
  } else {
    res.json({ success: false }); // ส่ง response ว่าทำการเดินไม่สำเร็จ
  }
};

// ฟังก์ชันบันทึกผลลัพธ์เกม
exports.saveGameResult = async (req, res) => {
  const { gameId, winner } = req.body; // ดึงข้อมูล gameId และผู้ชนะจาก request body
  const game = await Game.findById(gameId); // ค้นหาเกมโดยใช้ gameId
  if (game) {
    game.winner = winner; // ตั้งค่าผู้ชนะในเกม
    await game.save(); // บันทึกผลลัพธ์ในฐานข้อมูล
    res.json({ success: true }); // ส่ง response ว่าบันทึกผลลัพธ์สำเร็จ
  } else {
    res.json({ success: false }); // ส่ง response ว่าบันทึกผลลัพธ์ไม่สำเร็จ
  }
};

// ฟังก์ชันรีเพลย์เกม
exports.replayGame = async (req, res) => {
  const { gameId } = req.params; // ดึงข้อมูล gameId จาก request params
  const game = await Game.findById(gameId); // ค้นหาเกมโดยใช้ gameId
  if (game) {
    res.json({ moves: game.moves, size: game.size }); // ส่ง response พร้อมข้อมูลการเดินและขนาดตาราง
  } else {
    res.json({ moves: [] }); // ส่ง response ว่าไม่พบข้อมูลการเดิน
  }
};

// ฟังก์ชันดึงรายการเกมทั้งหมด
exports.getGameList = async (req, res) => {
  const games = await Game.find().sort({ date: -1 }); // ค้นหาเกมทั้งหมดและเรียงลำดับตามวันที่
  res.json({ games }); // ส่ง response พร้อมข้อมูลรายการเกม
};
