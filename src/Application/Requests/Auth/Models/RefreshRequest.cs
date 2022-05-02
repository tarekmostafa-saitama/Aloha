namespace CleanArchitecture.Application.Requests.Auth.Models;

public class RefreshRequest
{
    /// <summary>
    /// The refresh token.
    /// </summary>
    public string RefreshToken { get; set; }
}