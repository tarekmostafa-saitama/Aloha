using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.Common.Interfaces;

/// <summary>
/// Interface for authentication.
/// </summary>
public interface IAuthenticateService
{
    /// <summary>
    /// Authenticates user.
    /// Takes responsibilities to generate access and refresh token, save refresh token in database
    /// and return instance of <see cref="AuthenticateResponse"/> class. 
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="cancellationToken">Instance of <see cref="CancellationToken"/>.</param>
    Task<AuthenticateResponse> Authenticate(ApplicationUser user, CancellationToken cancellationToken);
}