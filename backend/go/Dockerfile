# Backend Dockerfile - Produção
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copiar go.mod e go.sum
COPY go.mod go.sum ./

# Download dependências
RUN go mod download

# Copiar código
COPY main.go .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cro -o main .

# Stage final
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
