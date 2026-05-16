using Application.DTOs;

namespace Application.Interfaces;

// This interface is the contract for tenant and user administration.
// Every method receives the acting user id so the repository can apply row-level checks.
public interface IAdministrationRepository
{
    Task<AdministrationSnapshotDto> GetSnapshotAsync(string actingUserId, CancellationToken cancellationToken);

    Task<BrokerageDto?> CreateBrokerageAsync(
        string actingUserId,
        CreateBrokerageDto request,
        CancellationToken cancellationToken);

    Task<AdminUserDto?> UpdateUserRoleAsync(
        string actingUserId,
        string userId,
        UpdateUserRoleDto request,
        CancellationToken cancellationToken);

    Task<AdminUserDto?> UpdateUserPermissionAsync(
        string actingUserId,
        string userId,
        UpdateUserPermissionDto request,
        CancellationToken cancellationToken);
}
