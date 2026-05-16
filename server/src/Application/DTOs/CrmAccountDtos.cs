namespace Application.DTOs;

// A DTO is a "data transfer object".
// It is the shape of data that our API sends to, and receives from, the frontend.
public sealed class CrmAccountDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string EntityType { get; set; }
    public required string Segment { get; set; }
    public required string Owner { get; set; }
    public required string Status { get; set; }
    public decimal Premium { get; set; }
    public decimal Revenue { get; set; }
    public DateOnly RenewalDate { get; set; }
    public int ComplianceScore { get; set; }
    public required string Risk { get; set; }
    public required string AiSummary { get; set; }
    public List<string> MissingInfo { get; set; } = [];
    public List<CrmContactDto> Contacts { get; set; } = [];
    public List<CrmPolicyDto> Policies { get; set; } = [];
    public List<CrmClaimDto> Claims { get; set; } = [];
    public List<CrmTaskDto> Tasks { get; set; } = [];
    public List<CrmDocumentDto> Documents { get; set; } = [];
    public List<CrmActivityDto> Activities { get; set; } = [];
}

public sealed class CreateCrmAccountDto
{
    public required string Name { get; set; }
    public required string EntityType { get; set; }
    public required string Segment { get; set; }
    public required string Owner { get; set; }
    public required string Status { get; set; }
    public decimal Premium { get; set; }
    public decimal Revenue { get; set; }
    public DateOnly RenewalDate { get; set; }
    public int ComplianceScore { get; set; }
    public required string Risk { get; set; }
    public required string AiSummary { get; set; }
    public List<string> MissingInfo { get; set; } = [];
    public List<CrmContactDto> Contacts { get; set; } = [];
    public List<CrmPolicyDto> Policies { get; set; } = [];
    public List<CrmClaimDto> Claims { get; set; } = [];
    public List<CrmTaskDto> Tasks { get; set; } = [];
    public List<CrmDocumentDto> Documents { get; set; } = [];
    public List<CrmActivityDto> Activities { get; set; } = [];
}

public sealed class UpdateCrmAccountDto
{
    public required string Name { get; set; }
    public required string EntityType { get; set; }
    public required string Segment { get; set; }
    public required string Owner { get; set; }
    public required string Status { get; set; }
    public decimal Premium { get; set; }
    public decimal Revenue { get; set; }
    public DateOnly RenewalDate { get; set; }
    public int ComplianceScore { get; set; }
    public required string Risk { get; set; }
    public required string AiSummary { get; set; }
    public List<string> MissingInfo { get; set; } = [];
    public List<CrmContactDto> Contacts { get; set; } = [];
    public List<CrmPolicyDto> Policies { get; set; } = [];
    public List<CrmClaimDto> Claims { get; set; } = [];
    public List<CrmTaskDto> Tasks { get; set; } = [];
    public List<CrmDocumentDto> Documents { get; set; } = [];
    public List<CrmActivityDto> Activities { get; set; } = [];
}

public sealed class CrmContactDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Role { get; set; }
    public required string Email { get; set; }
    public required string Phone { get; set; }
    public required string Influence { get; set; }
}

public sealed class CrmPolicyDto
{
    public required string Id { get; set; }
    public required string Product { get; set; }
    public required string Insurer { get; set; }
    public required string Number { get; set; }
    public decimal Premium { get; set; }
    public DateOnly Expiry { get; set; }
    public required string Status { get; set; }
}

public sealed class CrmClaimDto
{
    public required string Id { get; set; }
    public required string Type { get; set; }
    public required string Status { get; set; }
    public required string NextAction { get; set; }
    public decimal Reserve { get; set; }
}

public sealed class CrmTaskDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public required string Owner { get; set; }
    public DateOnly Due { get; set; }
    public required string Priority { get; set; }
    public required string Status { get; set; }
    public required string RelatedTo { get; set; }
}

public sealed class CrmDocumentDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Type { get; set; }
    public required string Status { get; set; }
    public required string Summary { get; set; }
}

public sealed class CrmActivityDto
{
    public required string Id { get; set; }
    public required string Date { get; set; }
    public required string Title { get; set; }
    public required string Detail { get; set; }
    public required string Kind { get; set; }
}
