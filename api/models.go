package main

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UpdateProfileRequest struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type User struct {
	ID       int
	Name     string
	Email    string
	Password string
}
