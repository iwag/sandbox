package main

import (
	"fmt"
	"os"
	"strconv"
	"unicode"
)

type TokenKind int

const (
	TK_RESERVED TokenKind = iota
	TK_NUM
	TK_EOF
)

type Token struct {
	kind TokenKind
	val  int
	str  string
}

func tokenize(str []rune) []Token {
	var tokens = []Token{}

	for i := 0; i < len(str); i += 1 {
		if unicode.IsSpace(str[i]) {
			continue
		}
		if str[i] == '+' || str[i] == '-' {
			tok := Token{TK_RESERVED, 0, string(str[i : i+1])}
			tokens = append(tokens, tok)
			continue
		}

		if unicode.IsDigit(str[i]) {
			j := i + 1
			for ; j < len(str); j += 1 {
				if !unicode.IsDigit(str[j]) {
					break
				}
			}
			num, err := strconv.Atoi(string(str[i:j]))
			if err != nil {
				fmt.Println("number in argument is necessary ", err)
				os.Exit(-1)
			}
			tok := Token{TK_NUM, num, string(str[i:j])}
			tokens = append(tokens, tok)
			i = (j - 1)
		}
	}
	return tokens
}

func expectNum(tok Token) int {
	if tok.kind != TK_NUM {
		fmt.Println("number is necessary but ", tok)
		os.Exit(-1)
	}
	return tok.val
}

func main() {
	if len(os.Args) != 2 {
		fmt.Println("one argument is necessary")
		os.Exit(-1)
	}

	runes := []rune(os.Args[1])
	tokens := tokenize(runes)
	if len(tokens) < 1 {
		fmt.Println("tokenization error")
		os.Exit(-1)
	}

	fmt.Println(".intel_syntax noprefix")
	fmt.Println(".global main")
	fmt.Println("")
	fmt.Println("main:")

	i := 0
	for {
		if i >= len(tokens) {
			break
		}
		tok := tokens[i]
		if i == 0 {
			fmt.Println("   mov rax, ", expectNum(tok))
		} else if tok.kind == TK_RESERVED && tok.str == "+" {
			i += 1
			tok = tokens[i]
			fmt.Println("   add rax, ", expectNum(tok))
		} else if tok.kind == TK_RESERVED && tok.str == "-" {
			i += 1
			tok = tokens[i]
			fmt.Println("   sub rax, ", expectNum(tok))
		} else {
			fmt.Println("token error", tok)
			os.Exit(-1)
		}
		i += 1
	}

	fmt.Println("   ret")
	return
}
