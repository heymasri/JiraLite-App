
using System.IdentityModel.Tokens.Jwt;                 // builds the token
using System.Security.Claims;                          // user claims inside the token
using System.Text;                                     // Encoding for secret
using BCrypt.Net;                                      // password hashing/verify
using JiraLite.Api.Data;
using JiraLite.Api.Models;
using Microsoft.EntityFrameworkCore;                   // EF queries
using Microsoft.IdentityModel.Tokens;                  // signing credentials

namespace JiraLite.Api.Services
{
    public class AuthService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _cfg;

        public AuthService(AppDbContext db, IConfiguration cfg)
        {
            _db = db;           // to query/save users
            _cfg = cfg;         // to read Jwt settings from appsettings.json
        }

        public async Task<User> RegisterAsync(string email, string fullName, string password)
        {
            // 1) Check if email is already used
            var exists = await _db.Users.AnyAsync(u => u.Email == email);
            if (exists) throw new InvalidOperationException("Email already in use");

            // 2) Hash the password (never store plain text)
            var hash = BCrypt.Net.BCrypt.HashPassword(password);

            // 3) Create & save the user
            var user = new User { Email = email, FullName = fullName, PasswordHash = hash };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // 4) Return the user (without password)
            return user;
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            // 1) Find the user by email
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user is null) throw new UnauthorizedAccessException("Invalid credentials");

            // 2) Check the password against the stored hash
            var ok = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!ok) throw new UnauthorizedAccessException("Invalid credentials");

            // 3) Build a JWT token
            var jwtSection = _cfg.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim> {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("name", user.FullName)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSection["ExpiresMinutes"] ?? "60")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token); // 4) return as string
        }
    }
}
