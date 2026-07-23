const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
fetch('https://script.google.com/macros/s/AKfycbxncH3dZ6Sc_bRieNlumJ6WLQyOkT2Jagmxq_S0FExaHT7dM4wlesgoYSoTx3P9CQdDyg/exec', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8'
  },
  body: JSON.stringify({ action: 'saveAttendance', data: [] })
})
.then(res => res.text())
.then(console.log)
.catch(console.error);
