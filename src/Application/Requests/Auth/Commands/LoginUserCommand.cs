using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Requests.Auth.Models;
using CleanArchitecture.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CleanArchitecture.Application.Requests.Auth.Commands;

public record LoginUserCommand(LoginUserRequest LoginUserRequest) : IRequest<AuthenticateResponse> { }

public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, AuthenticateResponse>
{
    private readonly IAuthenticateService _authenticateService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public LoginUserCommandHandler(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IAuthenticateService authenticateService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _authenticateService = authenticateService;
    }

    public async Task<AuthenticateResponse> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.LoginUserRequest.Email);
        if (user is null) return new AuthenticateResponse() { Error = "User don't exist." };
        var signInResult =
            await _signInManager.PasswordSignInAsync(user, request.LoginUserRequest.Password, false, false);
        if (!signInResult.Succeeded) return new AuthenticateResponse() { Error = "User email or password are wrong." };
        return await _authenticateService.Authenticate(user, cancellationToken);
    }
}