package services

import "errors"

var (
	ErrInvalidValues  = errors.New("valores devem ser maiores que zero")
	ErrInvalidGender  = errors.New("gênero deve ser 'male' ou 'female'")
	ErrNotImplemented = errors.New("análise por IA desabilitada")
)
