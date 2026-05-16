using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/admin")]
public sealed class AdministrationController : ControllerBase
{
    // This header is a temporary stand-in for the signed-in user id.
    private const string ActingUserHeader = "X-Acting-User-Id";
    private readonly IAdministrationRepository _administration;

    public AdministrationController(IAdministrationRepository administration)
    {
        _administration = administration;
    }

    [HttpGet]
    public async Task<ActionResult<AdministrationSnapshotDto>> GetSnapshot(CancellationToken cancellationToken)
    {
        // In production this id will come from the signed-in user's token.
        // During local development, the header lets us test tenant filtering clearly.
        var snapshot = await _administration.GetSnapshotAsync(GetActingUserId(), cancellationToken);

        return Ok(snapshot);
    }

    [HttpPost("brokerages")]
    public async Task<ActionResult<BrokerageDto>> CreateBrokerage(
        CreateBrokerageDto request,
        CancellationToken cancellationToken)
    {
        // The repository returns null when the acting user is not allowed to create tenants.
        var brokerage = await _administration.CreateBrokerageAsync(GetActingUserId(), request, cancellationToken);

        return brokerage is null
            ? Forbid()
            : CreatedAtAction(nameof(GetSnapshot), brokerage);
    }

    [HttpPut("users/{userId}/role")]
    public async Task<ActionResult<AdminUserDto>> UpdateUserRole(
        string userId,
        UpdateUserRoleDto request,
        CancellationToken cancellationToken)
    {
        // NotFound covers both missing records and records hidden by tenant rules.
        var user = await _administration.UpdateUserRoleAsync(GetActingUserId(), userId, request, cancellationToken);

        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut("users/{userId}/permission")]
    public async Task<ActionResult<AdminUserDto>> UpdateUserPermission(
        string userId,
        UpdateUserPermissionDto request,
        CancellationToken cancellationToken)
    {
        // Permission changes are checked and audited inside the repository.
        var user = await _administration.UpdateUserPermissionAsync(GetActingUserId(), userId, request, cancellationToken);

        return user is null ? NotFound() : Ok(user);
    }

    private string GetActingUserId()
    {
        // Default to the system admin so the page works immediately in local development.
        return Request.Headers.TryGetValue(ActingUserHeader, out var headerValue)
            ? headerValue.ToString()
            : "usr-system-admin";
    }
}
