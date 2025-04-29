package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func registerHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process request"})
			return
		}

		err = Register(db, req.Name, req.Email, string(hashedPassword))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already registered"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
	}
}
