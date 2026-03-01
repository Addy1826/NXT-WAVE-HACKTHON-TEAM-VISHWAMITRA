
# PowerShell script to test registration
$body = @{
    name = "Test User"
    email = "testuser" + (Get-Date -Format "yyyyMMddHHmmss") + "@example.com"
    password = "password123"
    role = "user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
