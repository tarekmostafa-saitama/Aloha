using CleanArchitecture.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Common.Interfaces;

public interface IApplicationDbContext
{

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
