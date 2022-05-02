using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Application.Requests.Auth.Models;

public class ChangePasswordRequest
{
    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }
    [DataType(DataType.Password)]
    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; }
}