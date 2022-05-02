namespace CleanArchitecture.Application.Requests.Auth.Models;

public class LoginUserRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}