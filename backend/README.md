```bash
// build
docker build . -t verizon 

// run
docker run -p 9999:80 -t verizon
```

Example login: (for dev purposes username and password are hard coded)
```bash
curl -X 'POST' \
  'http://0.0.0.0:9999/login' \
  -H 'Content-Type: application/json' \
  -d '{"username": "test_user", "password": "secret_password_123"}'
```
