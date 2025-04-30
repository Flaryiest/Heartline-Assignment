package main

import (
	"database/sql"
	"log"
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
			log.Printf("Registration attempt failed: email %s already exists in the database", req.Email)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already registered"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
	}
}

func loginHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		log.Printf("Login attempt for email: %s", req.Email)

		user, err := GetUserByEmail(db, req.Email)
		if err != nil {
			log.Printf("Get User failed: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User does not exist"})
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
		if err != nil {
			log.Printf("Password comparison failed: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
			return
		}

		log.Printf("Generating token for user ID: %d", user.ID)
		token, err := GenerateToken(user.ID)
		if err != nil {
			log.Printf("Failed to generate token: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		log.Printf("Token generated successfully for user ID: %d", user.ID)
		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}

func getProfileHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, _ := c.Get("userID")

		user, err := GetUserByID(db, userID.(int))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user profile"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
		})
	}
}

func updateProfileHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, _ := c.Get("userID")

		var req UpdateProfileRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		response := gin.H{}

		if req.Name != "" {
			if err := UpdateUser(db, userID.(int), req.Name); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update name"})
				return
			}
			response["name_updated"] = true
		}

		if req.Password != "" {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
				return
			}

			if err := UpdateUserPassword(db, userID.(int), string(hashedPassword)); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
				return
			}
			response["password_updated"] = true
		}

		if len(response) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No valid fields provided for update"})
			return
		}

		response["message"] = "Profile updated successfully"
		c.JSON(http.StatusOK, response)
	}
}
