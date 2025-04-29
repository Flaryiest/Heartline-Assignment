package main

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func Database() (*sql.DB, error) {
	godotenv.Load(".env")
	psqlInfo := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("error connecting to the database: %w", err)
	}

	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("could not ping database: %w", err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL
		)
	`)
	if err != nil {
		return nil, fmt.Errorf("could not create users table: %w", err)
	}

	fmt.Println("Successfully connected to database")
	return db, nil
}

func Register(db *sql.DB, name, email, password string) error {
	query := `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`
	_, err := db.Exec(query, name, email, password)
	if err != nil {
		return fmt.Errorf("error inserting user: %w", err)
	}
	return nil
}

func GetUserByEmail(db *sql.DB, email string) (User, error) {
	query := `SELECT id, name, email, password FROM users WHERE email = $1`
	var user User
	err := db.QueryRow(query, email).Scan(&user.ID, &user.Name, &user.Email, &user.Password)
	if err != nil {
		return User{}, fmt.Errorf("user not found: %w", err)
	}
	return user, nil
}

func GetUserByID(db *sql.DB, id int) (User, error) {
	query := `SELECT id, name, email, password FROM users WHERE id = $1`
	var user User
	err := db.QueryRow(query, id).Scan(&user.ID, &user.Name, &user.Email, &user.Password)
	if err != nil {
		return User{}, fmt.Errorf("user not found: %w", err)
	}
	return user, nil
}

func UpdateUser(db *sql.DB, id int, name string) error {
	query := `UPDATE users SET name = $1 WHERE id = $2`
	_, err := db.Exec(query, name, id)
	if err != nil {
		return fmt.Errorf("error updating user: %w", err)
	}
	return nil
}

func UpdateUserPassword(db *sql.DB, id int, hashedPassword string) error {
	query := `UPDATE users SET password = $1 WHERE id = $2`
	_, err := db.Exec(query, hashedPassword, id)
	if err != nil {
		return fmt.Errorf("error updating user password: %w", err)
	}
	return nil
}

func UpdateUserFields(db *sql.DB, id int, updates map[string]interface{}) error {
	if name, ok := updates["name"].(string); ok && name != "" {
		if err := UpdateUser(db, id, name); err != nil {
			return err
		}
	}

	if password, ok := updates["password"].(string); ok && password != "" {
		if err := UpdateUserPassword(db, id, password); err != nil {
			return err
		}
	}

	return nil
}
