using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/crm/accounts")]
public sealed class CrmAccountsController : ControllerBase
{
    // The controller talks to an interface, so the storage can change later without changing routes.
    private readonly ICrmAccountRepository _accounts;

    public CrmAccountsController(ICrmAccountRepository accounts)
    {
        _accounts = accounts;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CrmAccountDto>>> GetAll(CancellationToken cancellationToken)
    {
        // This returns the list used by the CRM overview page.
        var accounts = await _accounts.GetAllAsync(cancellationToken);

        return Ok(accounts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CrmAccountDto>> GetById(string id, CancellationToken cancellationToken)
    {
        // This returns one full account workspace, including contacts and policies.
        var account = await _accounts.GetByIdAsync(id, cancellationToken);

        return account is null ? NotFound() : Ok(account);
    }

    [HttpPost]
    public async Task<ActionResult<CrmAccountDto>> Create(
        CreateCrmAccountDto request,
        CancellationToken cancellationToken)
    {
        // POST means "create a new record".
        var account = await _accounts.CreateAsync(request, cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = account.Id }, account);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CrmAccountDto>> Update(
        string id,
        UpdateCrmAccountDto request,
        CancellationToken cancellationToken)
    {
        // PUT means "replace the existing record with this new version".
        var account = await _accounts.UpdateAsync(id, request, cancellationToken);

        return account is null ? NotFound() : Ok(account);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        // DELETE removes the account from the current data store.
        var wasDeleted = await _accounts.DeleteAsync(id, cancellationToken);

        return wasDeleted ? NoContent() : NotFound();
    }
}
