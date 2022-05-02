using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Requests.Auth.Models;
using CleanArchitecture.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Requests.Auth.Commands;

public record RefreshCommand(RefreshRequest RefreshRequest) : IRequest<AuthenticateResponse> { }

public class RefreshCommandHandler : IRequestHandler<RefreshCommand, AuthenticateResponse>
{
    private readonly IAuthenticateService _authenticateService;
    private readonly IRefreshTokenValidator _refreshTokenValidator;
    private readonly IApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public RefreshCommandHandler(IRefreshTokenValidator refreshTokenValidator, IApplicationDbContext context,
        UserManager<ApplicationUser> userManager, IAuthenticateService authenticateService)
    {
        _refreshTokenValidator = refreshTokenValidator;
        _context = context;
        _userManager = userManager;
        _authenticateService = authenticateService;
    }

    public async Task<AuthenticateResponse> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        var refreshRequest = request.RefreshRequest;
        var isValidRefreshToken = _refreshTokenValidator.Validate(refreshRequest.RefreshToken);
        if (!isValidRefreshToken)
            return new AuthenticateResponse() {Error = "Invalid Refresh Token."};
        var refreshToken =
            await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == refreshRequest.RefreshToken,
                cancellationToken);
        if (refreshToken is null)
            return new AuthenticateResponse() {Error = "Invalid Refresh Token."};

        _context.RefreshTokens.Remove(refreshToken);
        await _context.SaveChangesAsync(cancellationToken);

        var user = await _userManager.FindByIdAsync(refreshToken.UserId);
        if (user is null) return new AuthenticateResponse() {Error = "User don't exist."};

        return await _authenticateService.Authenticate(user, cancellationToken);
    }
}