package utils

import (
	"errors"
	"net/http"
	"strings"
)

// Authorization: ApiKey {key}
func GetAPIKey(headers http.Header) (string, error) {
	val := headers.Get("Authorization")
	if val == "" {
		return "", errors.New("no authentication info found")
	}

	vals := strings.Split(val, " ")
	if len(vals) != 2 {
		return "", errors.New("malfomed auth header")
	}

	if vals[0] != "Bearer" {
		return "", errors.New("malfomed auth header")
	}

	return vals[1], nil
}
