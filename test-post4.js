fetch('https://script.google.com/macros/s/AKfycbxncH3dZ6Sc_bRieNlumJ6WLQyOkT2Jagmxq_S0FExaHT7dM4wlesgoYSoTx3P9CQdDyg/exec', {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8'
  },
  body: JSON.stringify({ action: 'saveAttendance', data: [] })
})
.then(res => { console.log(res.type); return res.text(); })
.then(console.log)
.catch(console.error);
