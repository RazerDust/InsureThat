using Application.DTOs;

namespace Application.Interfaces;

// This interface describes what the CRM data store must be able to do.
// The API depends on this interface instead of a concrete database, which makes
// it much easier to swap the in-memory store for PostgreSQL later.
public interface ICrmAccountRepository
{
    // Read every account for the CRM overview table.
    Task<IReadOnlyList<CrmAccountDto>> GetAllAsync(CancellationToken cancellationToken);

    // Read one account for the detail page.
    Task<CrmAccountDto?> GetByIdAsync(string id, CancellationToken cancellationToken);

    // Read every contact with enough account detail for the contacts page.
    Task<IReadOnlyList<CrmContactRecordDto>> GetContactsAsync(CancellationToken cancellationToken);

    // Create one account and return the saved version with its new id.
    Task<CrmAccountDto> CreateAsync(CreateCrmAccountDto account, CancellationToken cancellationToken);

    // Update one account, or return null when the id does not exist.
    Task<CrmAccountDto?> UpdateAsync(string id, UpdateCrmAccountDto account, CancellationToken cancellationToken);

    // Update one contact inside one account, or return null when either id does not exist.
    Task<CrmContactRecordDto?> UpdateContactAsync(
        string accountId,
        string contactId,
        CrmContactDto contact,
        CancellationToken cancellationToken);

    // Delete one account and report whether anything was removed.
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken);

    // Delete one contact inside one account and report whether anything was removed.
    Task<bool> DeleteContactAsync(string accountId, string contactId, CancellationToken cancellationToken);
}
