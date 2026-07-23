fetch('https://script.google.com/macros/s/AKfycbylEY2Oyv9nUXuL3GqLtgPQkYvZvV46Qup7TLNq4m7Ife9Vqp0GFppA0Vx4a8-lpNLfHA/exec', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8'
  },
  body: JSON.stringify({ action: 'appendAttendance', data: {
    id: "local_new_123",
    studentId: "111",
    studentName: "Test Append Again",
    className: "IX A",
    date: "2026-07-22",
    timestamp: Date.now(),
    operatorName: "Test",
    status: "PRESENT",
    type: "DHUHUR"
  } })
})
.then(res => res.text())
.then(console.log)
.catch(console.error);
