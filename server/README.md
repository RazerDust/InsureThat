# InsureThat Server

The server is a .NET API that feeds the InsureThat frontend.

## Project Structure

- `src/Api/` contains HTTP setup and controllers.
- `src/Application/DTOs/` contains the data shapes sent between the API and frontend.
- `src/Application/Interfaces/` contains contracts that describe what storage must do.
- `src/Infrastructure/Repositories/` contains in-memory repositories used during local development.
- `tests/` contains the test projects for future API, application, domain, and integration tests.

## Run Locally

```bash
dotnet restore
dotnet run --project src/Api/Api.csproj --urls http://127.0.0.1:5105
```

The Vite frontend proxy is configured for `http://127.0.0.1:5105`, so using the command above keeps the frontend and backend connected locally.

## Main API Routes

- `GET /api/crm/accounts` lists CRM accounts.
- `GET /api/crm/accounts/{id}` returns one CRM account.
- `POST /api/crm/accounts` creates a CRM account.
- `PUT /api/crm/accounts/{id}` updates a CRM account.
- `DELETE /api/crm/accounts/{id}` deletes a CRM account.
- `GET /api/crm/contacts` lists contacts across every CRM account.
- `PUT /api/crm/contacts/{accountId}/{contactId}` updates one contact inside an account.
- `DELETE /api/crm/contacts/{accountId}/{contactId}` deletes one contact inside an account.
- `GET /api/admin` returns the tenant administration snapshot.
- `POST /api/admin/brokerages` creates a brokerage when the acting user is a system administrator.
- `PUT /api/admin/users/{userId}/role` changes a user's role.
- `PUT /api/admin/users/{userId}/permission` grants or removes one permission.

## Acting User Header

The administration endpoints read `X-Acting-User-Id` while real authentication is still being built.

Example values:

- `usr-system-admin`
- `usr-avery`
- `usr-noah`

Changing this header lets you see how tenant filtering changes the returned rows.

## Notes For Beginners

The repositories currently store data in memory. This is useful for learning and quick local testing, but it is not permanent storage. A future database can replace the repositories because the API depends on interfaces rather than concrete storage classes.
