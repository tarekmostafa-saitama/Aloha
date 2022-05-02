using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Requests.Auth.Models;
using CleanArchitecture.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CleanArchitecture.Application.Requests.Auth.Commands;

public class RegisterUserCommand : IRequest<AuthenticateResponse>
{
    public  RegisterUserRequest RegisterModel { get; set; }

    public RegisterUserCommand(RegisterUserRequest model)
    {
        RegisterModel = model;
    }
}

public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, AuthenticateResponse>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;


    public RegisterUserCommandHandler(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }
    public async Task<AuthenticateResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var authObj = new AuthenticateResponse(); 
        var user = await _userManager.FindByEmailAsync(request.RegisterModel.Email);
        if (user is not null)
        {
            authObj.Error = "User already exist"; 
            return authObj;
        }

        var newUser = new ApplicationUser()
        {
            FullName = request.RegisterModel.FullName, 
            Email = request.RegisterModel.Email, 
            UserName = request.RegisterModel.Email,
        };
        var result = await _userManager.CreateAsync(newUser, request.RegisterModel.Password);

        if (!result.Succeeded)
        {
            authObj.Error = result.Errors.FirstOrDefault()?.Description; 
            return authObj;
        }
        await _userManager.AddToRoleAsync(newUser, request.RegisterModel.Role.ToString());
        authObj.IsSuccess = true;
        return authObj;

    }
}
