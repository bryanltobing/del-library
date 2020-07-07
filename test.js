const moment = require('moment-timezone');

var date = new Date();
var later7 = new Date().setDate(new Date().getDate() + 7);


console.log(moment(date).fromNow(false));
console.log(moment(later7).fromNow(false));

console.log(date<later7);

