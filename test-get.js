fetch('https://script.google.com/macros/s/AKfycbxncH3dZ6Sc_bRieNlumJ6WLQyOkT2Jagmxq_S0FExaHT7dM4wlesgoYSoTx3P9CQdDyg/exec?action=readAll')
.then(res => res.json())
.then(data => console.log(JSON.stringify(data.attendance.slice(0, 2), null, 2)))
.catch(console.error);
