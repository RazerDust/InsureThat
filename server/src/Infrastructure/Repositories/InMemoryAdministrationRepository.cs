using System.Collections.Concurrent;
using Application.DTOs;
using Application.Interfaces;

namespace Infrastructure.Repositories;

// This in-memory repository shows the tenant security rules clearly while the app is young.
// Later, these same rules should move into PostgreSQL row-level security policies too.
public sealed class InMemoryAdministrationRepository : IAdministrationRepository
{
    private readonly ConcurrentDictionary<string, BrokerageRecord> _brokerages = new();
    private readonly ConcurrentDictionary<string, UserRecord> _users = new();
    private readonly ConcurrentDictionary<string, RoleRecord> _roles = new();
    private readonly ConcurrentDictionary<string, TeamRecord> _teams = new();
    private readonly ConcurrentDictionary<string, OfficeRecord> _offices = new();
    private readonly ConcurrentQueue<AuditRecord> _auditLog = new();

    public InMemoryAdministrationRepository()
    {
        SeedBrokerages();
        SeedRoles();
        SeedTeamsAndOffices();
        SeedUsers();
        SeedAuditLog();
    }

    public Task<AdministrationSnapshotDto> GetSnapshotAsync(string actingUserId, CancellationToken cancellationToken)
    {
        var actor = GetActorOrFallback(actingUserId);
        var allowedBrokerageIds = GetAllowedBrokerageIds(actor);
        var visibleBrokerages = _brokerages.Values
            .Where(brokerage => allowedBrokerageIds.Contains(brokerage.Id))
            .OrderBy(brokerage => brokerage.Name)
            .ToList();

        var snapshot = new AdministrationSnapshotDto
        {
            CurrentUser = ToCurrentAdministrator(actor),
            Brokerages = visibleBrokerages.Select(ToBrokerageDto).ToList(),
            Users = _users.Values
                .Where(user => allowedBrokerageIds.Contains(user.BrokerageId))
                .OrderBy(user => user.Name)
                .Select(ToAdminUserDto)
                .ToList(),
            Roles = _roles.Values
                .Where(role => allowedBrokerageIds.Contains(role.BrokerageId))
                .OrderBy(role => role.Name)
                .Select(ToRoleDto)
                .ToList(),
            Teams = _teams.Values
                .Where(team => allowedBrokerageIds.Contains(team.BrokerageId))
                .OrderBy(team => team.Name)
                .Select(ToTeamDto)
                .ToList(),
            Offices = _offices.Values
                .Where(office => allowedBrokerageIds.Contains(office.BrokerageId))
                .OrderBy(office => office.Name)
                .Select(ToOfficeDto)
                .ToList(),
            AuditLog = _auditLog
                .Where(entry => allowedBrokerageIds.Contains(entry.BrokerageId))
                .OrderByDescending(entry => entry.Timestamp)
                .Select(ToAuditLogEntryDto)
                .ToList(),
            SecurityRules =
            [
                "Every user row has a BrokerageId.",
                "The acting user can only read rows for their own brokerage.",
                "Cross-tenant rows are visible only when the user has an explicit grant.",
                "System administrators can create brokerages and see every tenant boundary.",
                "Role and permission changes are written to the audit log immediately.",
            ],
        };

        return Task.FromResult(snapshot);
    }

    public Task<BrokerageDto?> CreateBrokerageAsync(
        string actingUserId,
        CreateBrokerageDto request,
        CancellationToken cancellationToken)
    {
        var actor = GetActorOrFallback(actingUserId);

        // Only system admins can create a tenant, because tenants are the top-level boundary.
        if (!actor.IsSystemAdministrator)
        {
            return Task.FromResult<BrokerageDto?>(null);
        }

        var brokerage = new BrokerageRecord(
            CreateSlug(request.Name),
            request.Name,
            "Active",
            request.Region,
            request.DefaultWorkflow,
            $"Reports restricted to {request.Name}");

        _brokerages[brokerage.Id] = brokerage;

        AddAudit(actor, brokerage.Id, "Brokerage created", brokerage.Name, $"Created tenant in {brokerage.Region}.");

        return Task.FromResult<BrokerageDto?>(ToBrokerageDto(brokerage));
    }

    public Task<AdminUserDto?> UpdateUserRoleAsync(
        string actingUserId,
        string userId,
        UpdateUserRoleDto request,
        CancellationToken cancellationToken)
    {
        var actor = GetActorOrFallback(actingUserId);

        if (!_users.TryGetValue(userId, out var user) || !_roles.TryGetValue(request.RoleId, out var role))
        {
            return Task.FromResult<AdminUserDto?>(null);
        }

        if (!CanManageBrokerage(actor, user.BrokerageId) || role.BrokerageId != user.BrokerageId)
        {
            return Task.FromResult<AdminUserDto?>(null);
        }

        var updatedUser = user with
        {
            RoleId = role.Id,
            DirectPermissions = [.. role.Permissions],
        };

        _users[user.Id] = updatedUser;

        AddAudit(actor, user.BrokerageId, "User role updated", user.Name, $"Role changed to {role.Name}.");

        return Task.FromResult<AdminUserDto?>(ToAdminUserDto(updatedUser));
    }

    public Task<AdminUserDto?> UpdateUserPermissionAsync(
        string actingUserId,
        string userId,
        UpdateUserPermissionDto request,
        CancellationToken cancellationToken)
    {
        var actor = GetActorOrFallback(actingUserId);

        if (!_users.TryGetValue(userId, out var user) || !CanManageBrokerage(actor, user.BrokerageId))
        {
            return Task.FromResult<AdminUserDto?>(null);
        }

        var permissions = user.DirectPermissions.ToHashSet(StringComparer.OrdinalIgnoreCase);

        if (request.IsGranted)
        {
            permissions.Add(request.Permission);
        }
        else
        {
            permissions.Remove(request.Permission);
        }

        var updatedUser = user with { DirectPermissions = permissions.Order().ToList() };
        _users[user.Id] = updatedUser;

        var auditDetail = request.IsGranted
            ? $"Permission granted: {request.Permission}."
            : $"Permission removed: {request.Permission}.";

        AddAudit(actor, user.BrokerageId, "User permission changed", user.Name, auditDetail);

        return Task.FromResult<AdminUserDto?>(ToAdminUserDto(updatedUser));
    }

    private UserRecord GetActorOrFallback(string actingUserId)
    {
        // The fallback keeps local development simple until real authentication is connected.
        return _users.TryGetValue(actingUserId, out var actor)
            ? actor
            : _users["usr-system-admin"];
    }

    private HashSet<string> GetAllowedBrokerageIds(UserRecord actor)
    {
        if (actor.IsSystemAdministrator)
        {
            return _brokerages.Keys.ToHashSet(StringComparer.OrdinalIgnoreCase);
        }

        return actor.CrossTenantBrokerageIds
            .Append(actor.BrokerageId)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    private bool CanManageBrokerage(UserRecord actor, string brokerageId)
    {
        return actor.IsSystemAdministrator ||
            actor.BrokerageId == brokerageId ||
            actor.CrossTenantBrokerageIds.Contains(brokerageId);
    }

    private BrokerageDto ToBrokerageDto(BrokerageRecord brokerage) => new()
    {
        Id = brokerage.Id,
        Name = brokerage.Name,
        Status = brokerage.Status,
        Region = brokerage.Region,
        DefaultWorkflow = brokerage.DefaultWorkflow,
        ReportingBoundary = brokerage.ReportingBoundary,
        UserCount = _users.Values.Count(user => user.BrokerageId == brokerage.Id),
        TemplateCount = brokerage.TemplateCount,
    };

    private AdminUserDto ToAdminUserDto(UserRecord user)
    {
        var brokerage = _brokerages[user.BrokerageId];
        var role = _roles[user.RoleId];
        var team = _teams[user.TeamId];
        var office = _offices[user.OfficeId];

        return new AdminUserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            BrokerageId = user.BrokerageId,
            BrokerageName = brokerage.Name,
            RoleId = role.Id,
            RoleName = role.Name,
            Status = user.Status,
            Team = team.Name,
            Office = office.Name,
            Permissions = [.. user.DirectPermissions],
            CrossTenantBrokerageIds = [.. user.CrossTenantBrokerageIds],
            LastActiveAt = user.LastActiveAt,
        };
    }

    private RoleDto ToRoleDto(RoleRecord role) => new()
    {
        Id = role.Id,
        BrokerageId = role.BrokerageId,
        Name = role.Name,
        Description = role.Description,
        Permissions = [.. role.Permissions],
        UserCount = _users.Values.Count(user => user.RoleId == role.Id),
    };

    private TeamDto ToTeamDto(TeamRecord team) => new()
    {
        Id = team.Id,
        BrokerageId = team.BrokerageId,
        Name = team.Name,
        Lead = team.Lead,
        UserCount = _users.Values.Count(user => user.TeamId == team.Id),
    };

    private OfficeDto ToOfficeDto(OfficeRecord office) => new()
    {
        Id = office.Id,
        BrokerageId = office.BrokerageId,
        Name = office.Name,
        Location = office.Location,
        UserCount = _users.Values.Count(user => user.OfficeId == office.Id),
    };

    private AuditLogEntryDto ToAuditLogEntryDto(AuditRecord entry)
    {
        var brokerage = _brokerages[entry.BrokerageId];

        return new AuditLogEntryDto
        {
            Id = entry.Id,
            Timestamp = entry.Timestamp,
            ActorUserId = entry.ActorUserId,
            ActorName = entry.ActorName,
            BrokerageId = entry.BrokerageId,
            BrokerageName = brokerage.Name,
            Action = entry.Action,
            Target = entry.Target,
            Details = entry.Details,
        };
    }

    private CurrentAdministratorDto ToCurrentAdministrator(UserRecord actor) => new()
    {
        Id = actor.Id,
        Name = actor.Name,
        BrokerageId = actor.BrokerageId,
        IsSystemAdministrator = actor.IsSystemAdministrator,
        CrossTenantBrokerageIds = [.. actor.CrossTenantBrokerageIds],
    };

    private void AddAudit(UserRecord actor, string brokerageId, string action, string target, string details)
    {
        _auditLog.Enqueue(new AuditRecord(
            $"audit-{Guid.NewGuid():N}",
            DateTimeOffset.UtcNow,
            actor.Id,
            actor.Name,
            brokerageId,
            action,
            target,
            details));
    }

    private static string CreateSlug(string value)
    {
        var safeCharacters = value
            .Trim()
            .ToLowerInvariant()
            .Select(character => char.IsLetterOrDigit(character) ? character : '-')
            .ToArray();

        var slug = string.Join('-', new string(safeCharacters).Split('-', StringSplitOptions.RemoveEmptyEntries));

        return string.IsNullOrWhiteSpace(slug) ? $"brokerage-{Guid.NewGuid():N}" : slug;
    }

    private void SeedBrokerages()
    {
        _brokerages["brk-harbour"] = new BrokerageRecord(
            "brk-harbour",
            "Harbour City Brokers",
            "Active",
            "New South Wales",
            "Commercial renewal review",
            "Reports limited to Harbour City Brokers",
            12);

        _brokerages["brk-southern"] = new BrokerageRecord(
            "brk-southern",
            "Southern Risk Partners",
            "Active",
            "Victoria",
            "Claims-heavy SME service",
            "Reports limited to Southern Risk Partners",
            8);
    }

    private void SeedRoles()
    {
        AddRole("role-harbour-admin", "brk-harbour", "Brokerage Admin", "Can manage users, roles, teams and office settings.", ["users.manage", "roles.manage", "teams.manage", "reports.view"]);
        AddRole("role-harbour-broker", "brk-harbour", "Broker", "Can manage client work inside the brokerage boundary.", ["crm.read", "crm.write", "reports.view"]);
        AddRole("role-harbour-member", "brk-harbour", "Member", "Can read assigned client and workflow information.", ["crm.read"]);
        AddRole("role-southern-admin", "brk-southern", "Brokerage Admin", "Can manage users, roles, teams and office settings.", ["users.manage", "roles.manage", "teams.manage", "reports.view"]);
        AddRole("role-southern-broker", "brk-southern", "Broker", "Can manage client work inside the brokerage boundary.", ["crm.read", "crm.write", "reports.view"]);
    }

    private void SeedTeamsAndOffices()
    {
        _teams["team-harbour-commercial"] = new TeamRecord("team-harbour-commercial", "brk-harbour", "Commercial Lines", "Mia Chen");
        _teams["team-harbour-service"] = new TeamRecord("team-harbour-service", "brk-harbour", "Client Service", "Avery Thompson");
        _teams["team-southern-sme"] = new TeamRecord("team-southern-sme", "brk-southern", "SME Portfolio", "Noah Patel");

        _offices["office-harbour-sydney"] = new OfficeRecord("office-harbour-sydney", "brk-harbour", "Sydney CBD", "Sydney");
        _offices["office-harbour-parramatta"] = new OfficeRecord("office-harbour-parramatta", "brk-harbour", "Parramatta", "Parramatta");
        _offices["office-southern-melbourne"] = new OfficeRecord("office-southern-melbourne", "brk-southern", "Melbourne", "Melbourne");
    }

    private void SeedUsers()
    {
        AddUser("usr-system-admin", "Chris White", "chris@insurethat.example", "brk-harbour", "role-harbour-admin", "team-harbour-service", "office-harbour-sydney", "Active", true, ["brk-southern"], "Today");
        AddUser("usr-avery", "Avery Thompson", "avery@harbourcity.example", "brk-harbour", "role-harbour-admin", "team-harbour-service", "office-harbour-sydney", "Active", false, [], "Today");
        AddUser("usr-mia", "Mia Chen", "mia@harbourcity.example", "brk-harbour", "role-harbour-broker", "team-harbour-commercial", "office-harbour-sydney", "Active", false, [], "Yesterday");
        AddUser("usr-sam", "Sam Rivera", "sam@harbourcity.example", "brk-harbour", "role-harbour-member", "team-harbour-service", "office-harbour-parramatta", "Invited", false, [], "May 12");
        AddUser("usr-noah", "Noah Patel", "noah@southernrisk.example", "brk-southern", "role-southern-admin", "team-southern-sme", "office-southern-melbourne", "Active", false, [], "Today");
        AddUser("usr-ivy", "Ivy Nguyen", "ivy@southernrisk.example", "brk-southern", "role-southern-broker", "team-southern-sme", "office-southern-melbourne", "Suspended", false, [], "May 9");
    }

    private void SeedAuditLog()
    {
        _auditLog.Enqueue(new AuditRecord("audit-001", DateTimeOffset.UtcNow.AddHours(-5), "usr-avery", "Avery Thompson", "brk-harbour", "User permission changed", "Mia Chen", "Permission granted: reports.view."));
        _auditLog.Enqueue(new AuditRecord("audit-002", DateTimeOffset.UtcNow.AddDays(-1), "usr-system-admin", "Chris White", "brk-southern", "Cross-tenant access granted", "Chris White", "Granted support visibility for Southern Risk Partners."));
        _auditLog.Enqueue(new AuditRecord("audit-003", DateTimeOffset.UtcNow.AddDays(-2), "usr-noah", "Noah Patel", "brk-southern", "User role updated", "Ivy Nguyen", "Role changed to Broker."));
    }

    private void AddRole(string id, string brokerageId, string name, string description, List<string> permissions)
    {
        _roles[id] = new RoleRecord(id, brokerageId, name, description, permissions);
    }

    private void AddUser(
        string id,
        string name,
        string email,
        string brokerageId,
        string roleId,
        string teamId,
        string officeId,
        string status,
        bool isSystemAdministrator,
        List<string> crossTenantBrokerageIds,
        string lastActiveAt)
    {
        _users[id] = new UserRecord(
            id,
            name,
            email,
            brokerageId,
            roleId,
            teamId,
            officeId,
            status,
            isSystemAdministrator,
            crossTenantBrokerageIds,
            [.. _roles[roleId].Permissions],
            lastActiveAt);
    }

    private sealed record BrokerageRecord(
        string Id,
        string Name,
        string Status,
        string Region,
        string DefaultWorkflow,
        string ReportingBoundary,
        int TemplateCount = 0);

    private sealed record UserRecord(
        string Id,
        string Name,
        string Email,
        string BrokerageId,
        string RoleId,
        string TeamId,
        string OfficeId,
        string Status,
        bool IsSystemAdministrator,
        List<string> CrossTenantBrokerageIds,
        List<string> DirectPermissions,
        string LastActiveAt);

    private sealed record RoleRecord(
        string Id,
        string BrokerageId,
        string Name,
        string Description,
        List<string> Permissions);

    private sealed record TeamRecord(string Id, string BrokerageId, string Name, string Lead);

    private sealed record OfficeRecord(string Id, string BrokerageId, string Name, string Location);

    private sealed record AuditRecord(
        string Id,
        DateTimeOffset Timestamp,
        string ActorUserId,
        string ActorName,
        string BrokerageId,
        string Action,
        string Target,
        string Details);
}
