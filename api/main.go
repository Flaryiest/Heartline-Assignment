package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func main() {
	db, err := Database()
	if err != nil {
		fmt.Println(err)
		return
	}
	defer db.Close()

	gin.SetMode(gin.DebugMode)
	router := gin.Default()
	router.GET("/api/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})
	router.POST("/register", func(c *gin.Context) {
		var request RegisterRequest
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(400, gin.H{
				"error": "Invalid request format",
			})
			return
		}

		fmt.Printf("Received registration: %+v\n", request)

		c.JSON(200, gin.H{
			"message": "register"})
	})
	router.Run(":8080")
}
