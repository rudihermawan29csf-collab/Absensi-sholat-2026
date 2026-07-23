fetch('https://script.google.com/macros/s/AKfycbylEY2Oyv9nUXuL3GqLtgPQkYvZvV46Qup7TLNq4m7Ife9Vqp0GFppA0Vx4a8-lpNLfHA/exec', {
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
