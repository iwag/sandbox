package main

import (
	"fmt"
	"os"
	"strconv"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Println("one argument is necessary")
		os.Exit(-1)
	}
	num, err := strconv.Atoi(os.Args[1])
	if err != nil {
		fmt.Println("number in argument is necessary")
		os.Exit(-1)
	}

	fmt.Println(".intel_syntax noprefix")
	fmt.Println(".global main")
	fmt.Println("")
	fmt.Println("main:")
	fmt.Println("   mov rax, ", num)
	fmt.Println("   ret")
	return
}
