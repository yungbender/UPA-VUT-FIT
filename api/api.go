package main

import (
	"fmt"
	"time"
)

func main() {
	for {
		fmt.Println("Hello from API")
		time.Sleep(time.Second * 10)
	}
}
