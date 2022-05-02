namespace CleanArchitecture.Application.Common.Models;

public class AuthenticateResponse
{
    public bool IsSuccess { get; set; }
    public string Error { get; set; }
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
}