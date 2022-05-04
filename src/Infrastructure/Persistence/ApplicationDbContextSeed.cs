
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace CleanArchitecture.Infrastructure.Persistence;

public static class ApplicationDbContextSeed
{
    public static async Task SeedDefaultUserAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        var Role1 = new IdentityRole("Admin");
        var Role2 = new IdentityRole("User");

        if (roleManager.Roles.All(r => r.Name != Role2.Name))
        {
            await roleManager.CreateAsync(Role2);
        }

        var user = new ApplicationUser { UserName = "tarek@gmail.com", Email = "tarek@gmail.com" };

        if (userManager.Users.All(u => u.UserName != user.UserName))
        {
            await userManager.CreateAsync(user, "Administrator1!");
            await userManager.AddToRolesAsync(user, new[] { Role2.Name });
        }
    }

    public static async Task SeedSampleDataAsync(ApplicationDbContext context)
    {
       
    }
}
