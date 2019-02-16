
// fib.js
function fib(n) {
    if (n == 0) { return 0; }
    if (n == 1) { return 1; }
    return fib(n-1) + fib(n-2);
}

function test(j) {
    var res = [];
    for (i = 0; i < j; i++) {
        res.push(fib(i));
    }
    console.log(res.join(' '));
    console.log('HELLO');

}

test(5)
alert('YOOHO')