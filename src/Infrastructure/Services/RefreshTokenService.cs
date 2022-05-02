using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Infrastructure.Identity.Models;

namespace CleanArchitecture.Infrastructure.Services;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly ITokenGenerator _tokenGenerator;
    private readonly JwtSettings _jwtSettings;

    public RefreshTokenService(ITokenGenerator tokenGenerator, JwtSettings jwtSettings) =>
        (_tokenGenerator, _jwtSettings) = (tokenGenerator, jwtSettings);

    public string Generate(ApplicationUser user) => _tokenGenerator.Generate(_jwtSettings.RefreshTokenSecret,
        _jwtSettings.Issuer, _jwtSettings.Audience,
        _jwtSettings.RefreshTokenExpirationMinutes);
}