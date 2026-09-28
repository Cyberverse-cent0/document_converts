package auth

import (
	"errors"
	"net/http"

	"Document-Converter-Server/internal/models"
)

type AuthService struct {
	jwtService *Service
	userRepo   *UserRepository
}

func NewAuthService(secret string) *AuthService {
	return &AuthService{
		jwtService: NewService(secret),
		userRepo:   NewUserRepository(),
	}
}

func (s *AuthService) RegisterUser(email, password string) (*models.User, string, error) {
	if email == "" || password == "" {
		return nil, "", errors.New("email and password are required")
	}
	user, err := s.userRepo.Create(email, password)
	if err != nil {
		return nil, "", err
	}
	token, err := s.jwtService.GenerateToken(user)
	if err != nil {
		return nil, "", err
	}
	return user, token, nil
}

func (s *AuthService) LoginUser(email, password string) (*models.User, string, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}
	if !CheckPasswordHash(password, user.PasswordHash) {
		return nil, "", errors.New("invalid credentials")
	}
	token, err := s.jwtService.GenerateToken(user)
	if err != nil {
		return nil, "", err
	}
	return user, token, nil
}

func (s *AuthService) RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return s.jwtService.RequireAuth(next)
}

func (s *AuthService) ValidateToken(tokenString string) (*Claims, error) {
	return s.jwtService.ValidateToken(tokenString)
}

func (s *AuthService) FindUserByID(id int) (*models.User, error) {
	return s.userRepo.FindByID(id)
}
