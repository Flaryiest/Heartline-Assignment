package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	db, err := Database()
	if err != nil {
		fmt.Println(err)
		return
	}
	defer db.Close()

	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	router.POST("/register", registerHandler(db))
	router.POST("/login", loginHandler(db))

	authorized := router.Group("/")
	authorized.Use(authMiddleware())
	{
		authorized.GET("/profile", getProfileHandler(db))
		authorized.PATCH("/profile", updateProfileHandler(db))
	}
	fmt.Println("Successfully running")
	router.Run(":8080")
}
