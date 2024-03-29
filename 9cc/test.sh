#!/bin/bash

assert() {
    expected="$1"
    input="$2"

    rm tmp.s
    go run 9cc.go "$input" > tmp.s
    cc -o tmp tmp.s
    ./tmp
    actual="$?"

    if [ "$actual" = "$expected" ]; then
        echo "$input => $actual"
    else
        echo "$input => $expected expected but got $actual"
        exit 1
    fi
}

assert 0 0
assert 42 42
assert 255 255
assert 3 '1+2'
assert 6 '1 + 2 + 3'
assert 0 '1 + 2 - 3'


echo OK