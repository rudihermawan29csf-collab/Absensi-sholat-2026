fetch('https://script.google.com/macros/s/AKfycbxncH3dZ6Sc_bRieNlumJ6WLQyOkT2Jagmxq_S0FExaHT7dM4wlesgoYSoTx3P9CQdDyg/exec', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8'
  },
  body: JSON.stringify({ action: 'saveAttendance', data: [{
    id: "local_123",
    studentId: "1129",
    studentName: "ABEL AULIA PASA RAMADANI",
    className: "IX A",
    date: "2026-07-22",
    timestamp: Date.now(),
    operatorName: "Test",
    status: "PRESENT",
    type: "DHUHUR"
  }] })
})
.then(res => res.text())
.then(console.log)
.catch(console.error);
