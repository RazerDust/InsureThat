using Application.DTOs;

namespace Application.Interfaces;

// This interface describes what the CRM data store must be able to do.
// The API depends on this interface instead of a concrete database, which makes
// it much easier to swap the in-memory store for PostgreSQL later.
public interface ICrmAccountRepository
{
    Task<IReadOnlyList<CrmAccountDto>> GetAllAsync(CancellationToken cancellationToken);

    Task<CrmAccountDto?> GetByIdAsync(string id, CancellationToken cancellationToken);

    Task<CrmAccountDto> CreateAsync(CreateCrmAccountDto account, CancellationToken cancellationToken);

    Task<CrmAccountDto?> UpdateAsync(string id, UpdateCrmAccountDto account, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken);
}
