package sesion

import (
	"crypto/rand"
	"encoding/base64"
	"log"
)

const secretKey = "wT7uiUxahuih78@$Dskjhg"

func GenerateToken() string {
	buf := make([]byte, 32)
	if _, err := rand.Read(buf); err != nil {
		log.Printf("failed to generate token: %v", err)
		return "token-generation-failed"
	}
	return base64.URLEncoding.EncodeToString(buf) + "." + secretKey
}
