using System.Collections.Concurrent;
using Application.DTOs;
using Application.Interfaces;

namespace Infrastructure.Repositories;

// This repository keeps CRM data in memory while we build out the product.
// It gives the frontend real CRUD endpoints now, without forcing database setup
// before the API contract is useful.
public sealed class InMemoryCrmAccountRepository : ICrmAccountRepository
{
    // ConcurrentDictionary is safe for simple reads and writes while the API is running.
    private readonly ConcurrentDictionary<string, CrmAccountDto> _accounts = new();

    public InMemoryCrmAccountRepository()
    {
        // Seed data gives the frontend something realistic to show on first run.
        foreach (var account in SeedAccounts())
        {
            _accounts[account.Id] = account;
        }
    }

    public Task<IReadOnlyList<CrmAccountDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        // Return clones so callers cannot mutate the in-memory storage by accident.
        var accounts = _accounts.Values
            .OrderBy(account => account.Name)
            .Select(CloneAccount)
            .ToList();

        return Task.FromResult<IReadOnlyList<CrmAccountDto>>(accounts);
    }

    public Task<CrmAccountDto?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        var account = _accounts.TryGetValue(id, out var storedAccount)
            ? CloneAccount(storedAccount)
            : null;

        return Task.FromResult(account);
    }

    public Task<CrmAccountDto> CreateAsync(CreateCrmAccountDto account, CancellationToken cancellationToken)
    {
        var newAccount = new CrmAccountDto
        {
            Id = CreateSlug(account.Name),
            Name = account.Name,
            EntityType = account.EntityType,
            Segment = account.Segment,
            Owner = account.Owner,
            Status = account.Status,
            Premium = account.Premium,
            Revenue = account.Revenue,
            RenewalDate = account.RenewalDate,
            ComplianceScore = account.ComplianceScore,
            Risk = account.Risk,
            AiSummary = account.AiSummary,
            MissingInfo = account.MissingInfo,
            Contacts = account.Contacts,
            Policies = account.Policies,
            Claims = account.Claims,
            Tasks = account.Tasks,
            Documents = account.Documents,
            Activities = account.Activities,
        };

        _accounts[newAccount.Id] = CloneAccount(newAccount);

        return Task.FromResult(CloneAccount(newAccount));
    }

    public Task<CrmAccountDto?> UpdateAsync(string id, UpdateCrmAccountDto account, CancellationToken cancellationToken)
    {
        if (!_accounts.ContainsKey(id))
        {
            return Task.FromResult<CrmAccountDto?>(null);
        }

        var updatedAccount = new CrmAccountDto
        {
            Id = id,
            Name = account.Name,
            EntityType = account.EntityType,
            Segment = account.Segment,
            Owner = account.Owner,
            Status = account.Status,
            Premium = account.Premium,
            Revenue = account.Revenue,
            RenewalDate = account.RenewalDate,
            ComplianceScore = account.ComplianceScore,
            Risk = account.Risk,
            AiSummary = account.AiSummary,
            MissingInfo = account.MissingInfo,
            Contacts = account.Contacts,
            Policies = account.Policies,
            Claims = account.Claims,
            Tasks = account.Tasks,
            Documents = account.Documents,
            Activities = account.Activities,
        };

        _accounts[id] = CloneAccount(updatedAccount);

        return Task.FromResult<CrmAccountDto?>(CloneAccount(updatedAccount));
    }

    public Task<bool> DeleteAsync(string id, CancellationToken cancellationToken)
    {
        return Task.FromResult(_accounts.TryRemove(id, out _));
    }

    private static string CreateSlug(string value)
    {
        // Slugs make new account ids readable while the Guid suffix keeps them unique.
        var safeCharacters = value
            .Trim()
            .ToLowerInvariant()
            .Select(character => char.IsLetterOrDigit(character) ? character : '-')
            .ToArray();

        var slug = string.Join('-', new string(safeCharacters).Split('-', StringSplitOptions.RemoveEmptyEntries));

        return string.IsNullOrWhiteSpace(slug)
            ? $"account-{Guid.NewGuid():N}"
            : $"{slug}-{Guid.NewGuid():N}"[..Math.Min(slug.Length + 9, 48)];
    }

    private static CrmAccountDto CloneAccount(CrmAccountDto account)
    {
        // Cloning stops callers from accidentally changing the stored copy.
        return new CrmAccountDto
        {
            Id = account.Id,
            Name = account.Name,
            EntityType = account.EntityType,
            Segment = account.Segment,
            Owner = account.Owner,
            Status = account.Status,
            Premium = account.Premium,
            Revenue = account.Revenue,
            RenewalDate = account.RenewalDate,
            ComplianceScore = account.ComplianceScore,
            Risk = account.Risk,
            AiSummary = account.AiSummary,
            MissingInfo = [.. account.MissingInfo],
            Contacts = account.Contacts.Select(CloneContact).ToList(),
            Policies = account.Policies.Select(ClonePolicy).ToList(),
            Claims = account.Claims.Select(CloneClaim).ToList(),
            Tasks = account.Tasks.Select(CloneTask).ToList(),
            Documents = account.Documents.Select(CloneDocument).ToList(),
            Activities = account.Activities.Select(CloneActivity).ToList(),
        };
    }

    private static CrmContactDto CloneContact(CrmContactDto contact) => new()
    {
        Id = contact.Id,
        Name = contact.Name,
        Role = contact.Role,
        Email = contact.Email,
        Phone = contact.Phone,
        Influence = contact.Influence,
    };

    private static CrmPolicyDto ClonePolicy(CrmPolicyDto policy) => new()
    {
        Id = policy.Id,
        Product = policy.Product,
        Insurer = policy.Insurer,
        Number = policy.Number,
        Premium = policy.Premium,
        Expiry = policy.Expiry,
        Status = policy.Status,
    };

    private static CrmClaimDto CloneClaim(CrmClaimDto claim) => new()
    {
        Id = claim.Id,
        Type = claim.Type,
        Status = claim.Status,
        NextAction = claim.NextAction,
        Reserve = claim.Reserve,
    };

    private static CrmTaskDto CloneTask(CrmTaskDto task) => new()
    {
        Id = task.Id,
        Title = task.Title,
        Owner = task.Owner,
        Due = task.Due,
        Priority = task.Priority,
        Status = task.Status,
        RelatedTo = task.RelatedTo,
    };

    private static CrmDocumentDto CloneDocument(CrmDocumentDto document) => new()
    {
        Id = document.Id,
        Name = document.Name,
        Type = document.Type,
        Status = document.Status,
        Summary = document.Summary,
    };

    private static CrmActivityDto CloneActivity(CrmActivityDto activity) => new()
    {
        Id = activity.Id,
        Date = activity.Date,
        Title = activity.Title,
        Detail = activity.Detail,
        Kind = activity.Kind,
    };

    private static IEnumerable<CrmAccountDto> SeedAccounts()
    {
        yield return new CrmAccountDto
        {
            Id = "harbour-fresh",
            Name = "Harbour Fresh Logistics",
            EntityType = "Company",
            Segment = "Transport and cold storage",
            Owner = "Mia Chen",
            Status = "Review",
            Premium = 184500,
            Revenue = 22140,
            RenewalDate = new DateOnly(2026, 6, 22),
            ComplianceScore = 82,
            Risk = "Renewal market review needs updated vehicle schedule.",
            AiSummary = "Long-running transport client with property, fleet and liability cover.",
            MissingInfo = ["Updated vehicle schedule", "Driver declaration", "Signed privacy notice"],
            Contacts =
            [
                new()
                {
                    Id = "nina",
                    Name = "Nina Patel",
                    Role = "Operations Director",
                    Email = "nina@harbourfresh.example",
                    Phone = "+61 2 5550 1832",
                    Influence = "Decision maker",
                },
            ],
            Policies =
            [
                new()
                {
                    Id = "fleet",
                    Product = "Commercial Motor Fleet",
                    Insurer = "Southern Cross Insurance",
                    Number = "CMF-88291",
                    Premium = 126400,
                    Expiry = new DateOnly(2026, 6, 22),
                    Status = "Renewal",
                },
            ],
            Tasks =
            [
                new()
                {
                    Id = "task-1",
                    Title = "Request updated vehicle schedule",
                    Owner = "Mia Chen",
                    Due = new DateOnly(2026, 5, 20),
                    Priority = "High",
                    Status = "Open",
                    RelatedTo = "Fleet renewal",
                },
            ],
            Documents =
            [
                new()
                {
                    Id = "doc-1",
                    Name = "2025 Fleet Schedule.pdf",
                    Type = "Schedule",
                    Status = "Needs review",
                    Summary = "AI detected 48 registered vehicles and 3 refrigeration trailers.",
                },
            ],
            Activities =
            [
                new()
                {
                    Id = "activity-1",
                    Date = "Today",
                    Title = "AI renewal brief generated",
                    Detail = "Missing schedule and claims narrative added to the broker action list.",
                    Kind = "AI",
                },
            ],
        };
    }
}
