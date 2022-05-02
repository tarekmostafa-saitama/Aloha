using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Application.Requests.Auth.Models;

public class RegisterUserRequest
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

    public Role Role { get; set; }
}