package encryption

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"os"
)

// KeyManager handles encryption key operations
type KeyManager struct {
	encryptionKey string
}

func NewKeyManager() *KeyManager {
	// Get encryption key from environment variable
	key := os.Getenv("ENCRYPTION_KEY")
	if key == "" {
		// Generate a random key for development (not recommended for production)
		key = generateRandomKey()
		fmt.Println("Warning: Using randomly generated encryption key. Set ENCRYPTION_KEY environment variable for production.")
	}

	return &KeyManager{
		encryptionKey: key,
	}
}

// GetKey returns the encryption key
func (km *KeyManager) GetKey() string {
	return km.encryptionKey
}

// generateRandomKey generates a random 32-byte key
func generateRandomKey() string {
	key := make([]byte, 32)
	if _, err := rand.Read(key); err != nil {
		// Fallback to a hardcoded key if random generation fails
		return "default-encryption-key-32-bytes-long!!"
	}
	return base64.URLEncoding.EncodeToString(key)
}

// ValidateKey checks if a key is valid for AES-256
func ValidateKey(key string) error {
	if key == "" {
		return fmt.Errorf("key cannot be empty")
	}
	if len(key) < 32 {
		return fmt.Errorf("key must be at least 32 characters for AES-256")
	}
	return nil
}
