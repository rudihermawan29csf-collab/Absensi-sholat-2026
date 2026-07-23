fetch('https://script.google.com/macros/s/AKfycbylEY2Oyv9nUXuL3GqLtgPQkYvZvV46Qup7TLNq4m7Ife9Vqp0GFppA0Vx4a8-lpNLfHA/exec?action=readAll', {
  method: 'GET',
  redirect: 'follow',
  credentials: 'omit'
})
.then(res => res.text())
.then(console.log)
.catch(console.error);
