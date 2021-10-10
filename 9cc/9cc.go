package main

import (
	"fmt"
	"os"
	"strconv"
	"unicode"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Println("one argument is necessary")
		os.Exit(-1)
	}

	runes := []rune(os.Args[1])

	i := 0
	j := 0
	for ; j < len(runes); j += 1 {
		if !unicode.IsNumber(runes[j]) {
			break
		}
	}
	num, err := strconv.Atoi(string(runes[i:j]))
	if err != nil {
		fmt.Println("number in argument is necessary ", err)
		os.Exit(-1)
	}
	fmt.Println(".intel_syntax noprefix")
	fmt.Println(".global main")
	fmt.Println("")
	fmt.Println("main:")
	fmt.Println("   mov rax, ", num)

	i = j
	for ; i < len(runes); i += 1 {
		if runes[i] == '+' {
			for j = i + 1; j < len(runes); j += 1 {
				if !unicode.IsNumber(runes[j]) {
					break
				}
			}
			num, err = strconv.Atoi(string(runes[i:j]))
			if err != nil {
				fmt.Println("number is necessary", err)
				os.Exit(-1)
			}
			fmt.Println("   add rax, ", num)
		}
	}

	fmt.Println("   ret")
	return
}
