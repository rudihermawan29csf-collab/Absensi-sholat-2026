fetch('https://script.google.com/macros/s/AKfycbxncH3dZ6Sc_bRieNlumJ6WLQyOkT2Jagmxq_S0FExaHT7dM4wlesgoYSoTx3P9CQdDyg/exec', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8'
  },
  body: JSON.stringify({ action: 'appendAttendance', data: {
    id: "local_999",
    studentId: "1132",
    studentName: "ADITYA FIRMANSYAH",
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
