using Application.DTOs;

namespace Application.Interfaces;

// This interface is the contract for tenant and user administration.
// Every method receives the acting user id so the repository can apply row-level checks.
public interface IAdministrationRepository
{
    // Returns everything the administration page needs in one request.
    Task<AdministrationSnapshotDto> GetSnapshotAsync(string actingUserId, CancellationToken cancellationToken);

    // Returns null when the acting user is not allowed to create brokerages.
    Task<BrokerageDto?> CreateBrokerageAsync(
        string actingUserId,
        CreateBrokerageDto request,
        CancellationToken cancellationToken);

    // Returns null if the user, role, or tenant permission check fails.
    Task<AdminUserDto?> UpdateUserRoleAsync(
        string actingUserId,
        string userId,
        UpdateUserRoleDto request,
        CancellationToken cancellationToken);

    // Returns null if the acting user cannot manage the target user's brokerage.
    Task<AdminUserDto?> UpdateUserPermissionAsync(
        string actingUserId,
        string userId,
        UpdateUserPermissionDto request,
        CancellationToken cancellationToken);
}
