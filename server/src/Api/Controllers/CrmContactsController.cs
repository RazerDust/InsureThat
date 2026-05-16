using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/crm/contacts")]
public sealed class CrmContactsController : ControllerBase
{
    // Contacts are stored inside accounts today, so this controller asks the account repository to find them.
    private readonly ICrmAccountRepository _accounts;

    public CrmContactsController(ICrmAccountRepository accounts)
    {
        _accounts = accounts;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CrmContactRecordDto>>> GetAll(CancellationToken cancellationToken)
    {
        // This flattened list powers the standalone Contacts menu item in the frontend.
        var contacts = await _accounts.GetContactsAsync(cancellationToken);

        return Ok(contacts);
    }

    [HttpPut("{accountId}/{contactId}")]
    public async Task<ActionResult<CrmContactRecordDto>> Update(
        string accountId,
        string contactId,
        CrmContactDto request,
        CancellationToken cancellationToken)
    {
        // PUT means "save the edited version of this contact".
        var contact = await _accounts.UpdateContactAsync(accountId, contactId, request, cancellationToken);

        return contact is null ? NotFound() : Ok(contact);
    }

    [HttpDelete("{accountId}/{contactId}")]
    public async Task<IActionResult> Delete(
        string accountId,
        string contactId,
        CancellationToken cancellationToken)
    {
        // DELETE removes the contact from its parent account.
        var wasDeleted = await _accounts.DeleteContactAsync(accountId, contactId, cancellationToken);

        return wasDeleted ? NoContent() : NotFound();
    }
}
