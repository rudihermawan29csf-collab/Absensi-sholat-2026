fetch('https://script.google.com/macros/s/AKfycbxncH3dZ6Sc_bRieNlumJ6WLQyOkT2Jagmxq_S0FExaHT7dM4wlesgoYSoTx3P9CQdDyg/exec?action=readAll')
.then(res => res.text())
.then(text => console.log(text.slice(0, 100)))
.catch(console.error);
