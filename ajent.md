# DCodeX audit notes

## What this project is
- Small Node.js/Express auth API.
- MongoDB stores users.
- Redis stores blacklisted JWTs after logout.
- JWT is issued on register/login and stored in a cookie.

## Routes
- `POST /user/register`
- `POST /user/login`
- `POST /user/logout`
- `POST /user/admin/register`

## Current code flow
- `index.js` boots Express, JSON parsing, cookie parsing, MongoDB, Redis, and mounts `Routes/userAuth.route.js`.
- `controller/user.controller.js` handles register, login, logout, and admin registration.
- `middleware/userMiddleware.js` and `middleware/adminMiddleware.js` verify JWT cookies and check Redis blacklist state.
- `model/user.model.js` defines the user schema with `role`, `emailId`, and hashed `password`.

## Audit findings
1. `login()` has a password-bypass bug because `bcrypt.compare(...)` is not awaited. Any existing email can log in with any password.
2. Auth cookies are set without `httpOnly`, `secure`, or `sameSite`, which makes token theft and CSRF easier.
3. Multiple handlers return raw `error.message` to clients, which leaks internal validation and auth details.
4. No rate limiting or lockout exists on login, and responses reveal whether an account exists.
5. `emailId` uses `require:true` instead of `required:true` in the schema, so schema-level enforcement is weaker than intended.

## Environment/config notes
- `.env` exists locally and is ignored by git.
- Redis password is read from env, but Redis host/port are hardcoded in `config/redis.js`.
- `npm audit --omit=dev --json` currently reports 0 known dependency vulnerabilities.

## Worktree notes
- There is an existing uncommitted change in `controller/user.controller.js`.
- That change makes `adminRegister` accept `role` from `req.body` instead of forcing `"admin"`.

## Suggested next fixes
1. Fix the missing `await` in `login()` first.
2. Harden cookie settings and add CSRF protection or move auth to an Authorization header flow.
3. Replace raw error leaks with generic auth/validation responses.
4. Add login rate limiting and normalize credential failure messages.
5. Correct the schema typo and add basic tests for register/login/logout.
