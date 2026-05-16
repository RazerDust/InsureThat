namespace Application.DTOs;

// These DTOs describe the administration data that moves between the API and frontend.
// Keeping this shape explicit makes the tenant security boundary easier to understand.
public sealed class AdministrationSnapshotDto
{
    public required CurrentAdministratorDto CurrentUser { get; set; }
    public List<BrokerageDto> Brokerages { get; set; } = [];
    public List<AdminUserDto> Users { get; set; } = [];
    public List<RoleDto> Roles { get; set; } = [];
    public List<TeamDto> Teams { get; set; } = [];
    public List<OfficeDto> Offices { get; set; } = [];
    public List<AuditLogEntryDto> AuditLog { get; set; } = [];
    public List<string> SecurityRules { get; set; } = [];
}

public sealed class CurrentAdministratorDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string BrokerageId { get; set; }
    public bool IsSystemAdministrator { get; set; }
    public List<string> CrossTenantBrokerageIds { get; set; } = [];
}

public sealed class BrokerageDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Status { get; set; }
    public required string Region { get; set; }
    public required string DefaultWorkflow { get; set; }
    public required string ReportingBoundary { get; set; }
    public int UserCount { get; set; }
    public int TemplateCount { get; set; }
}

public sealed class AdminUserDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string BrokerageId { get; set; }
    public required string BrokerageName { get; set; }
    public required string RoleId { get; set; }
    public required string RoleName { get; set; }
    public required string Status { get; set; }
    public required string Team { get; set; }
    public required string Office { get; set; }
    public List<string> Permissions { get; set; } = [];
    public List<string> CrossTenantBrokerageIds { get; set; } = [];
    public required string LastActiveAt { get; set; }
}

public sealed class RoleDto
{
    public required string Id { get; set; }
    public required string BrokerageId { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public List<string> Permissions { get; set; } = [];
    public int UserCount { get; set; }
}

public sealed class TeamDto
{
    public required string Id { get; set; }
    public required string BrokerageId { get; set; }
    public required string Name { get; set; }
    public required string Lead { get; set; }
    public int UserCount { get; set; }
}

public sealed class OfficeDto
{
    public required string Id { get; set; }
    public required string BrokerageId { get; set; }
    public required string Name { get; set; }
    public required string Location { get; set; }
    public int UserCount { get; set; }
}

public sealed class AuditLogEntryDto
{
    public required string Id { get; set; }
    public DateTimeOffset Timestamp { get; set; }
    public required string ActorUserId { get; set; }
    public required string ActorName { get; set; }
    public required string BrokerageId { get; set; }
    public required string BrokerageName { get; set; }
    public required string Action { get; set; }
    public required string Target { get; set; }
    public required string Details { get; set; }
}

public sealed class CreateBrokerageDto
{
    public required string Name { get; set; }
    public required string Region { get; set; }
    public required string DefaultWorkflow { get; set; }
}

public sealed class UpdateUserRoleDto
{
    public required string RoleId { get; set; }
}

public sealed class UpdateUserPermissionDto
{
    public required string Permission { get; set; }
    public bool IsGranted { get; set; }
}
