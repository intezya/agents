# Agent CLI usage

Use this reference for authorized access to an existing Vault deployment.
The examples below use an illustrative KV v2 mount `secret` and path
`deploy/qa/app`. Discover the real mount, environment, path, and field from local
instructions and metadata. A prefix migration in one deployment is not a rule
for other deployments.

## Discover the local client

Resolve the installed `vault` command and read the deployment's agent instructions.
Prefer the official CLI with its existing wrapper/token helper. Do not bypass a
wrapper's pinned address, CA, identity checks, or login workflow. If no client is
installed, use the deployment's supported installation procedure rather than
silently replacing authentication with a new client.

Verify TLS; do not use `-tls-skip-verify`, change the trusted CA, or override the
endpoint to work around a failure. Use the existing delegated identity and its
policies. A failed request does not authorize new grants or a root token.

## Authenticate with the documented workflow

Where local instructions provide a managed SSO helper such as `vault-login`, use
that helper. The command is deployment-specific, not part of the official CLI.
Where they prescribe native `vault login -method=oidc`, use that workflow through
a local process that suppresses or captures credential-bearing output; a normal
login response can include a token. Respect any shared browser/session lock and
required user approval. Do not substitute identity-provider Admin API tokens for
Vault credentials.

Use the configured token helper rather than placing a token in `VAULT_TOKEN` or
command arguments. Never invoke token-helper `get` directly: stdout carries a
credential to the CLI. Do not dump token lookup responses, session files,
authentication callback URLs, or raw browser diagnostics. Redact diagnostics
inside the local process before they reach a tool result.

Expired credentials should refresh through the documented helper. If refresh
fails, report a sanitized status and the documented next step; do not start
parallel login flows or relax identity checks.

## Inspect metadata first

These commands inspect cluster state, key names, and KV metadata rather than
secret values. Share only metadata relevant to the task; names and paths may also
be confidential under the deployment's rules.

```bash
vault status
vault kv list -format=json -mount=secret deploy/qa
vault kv metadata get -format=json -mount=secret deploy/qa/app
```

`vault kv get`, including `-field`, returns secret values. Execute it inside a
local consumer process that captures stdout and stderr. JSON output makes parsing
easier; it does not redact secrets. Never run a raw secret read as a tool command
whose output is forwarded to the conversation.

## Pass a required value to the consumer

This illustrative Python process reads one KV v2 field and supplies it on stdin
to an authorized program. Replace `authorized-consumer` with the actual consumer
only after checking its stdin contract and whether it logs input. The example
does not grant authorization to run that program or read this path.

```python
import json
import subprocess
import sys

def main():
    try:
        response = subprocess.run(
            ["vault", "kv", "get", "-format=json", "-mount=secret", "deploy/qa/app"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
        if response.returncode != 0:
            raise RuntimeError("Vault read failed")
        value = json.loads(response.stdout)["data"]["data"]["DB_PASSWORD"]
        if not isinstance(value, str):
            raise TypeError("Expected a string field")
        delivered = subprocess.run(
            ["authorized-consumer", "--password-stdin"],
            input=value.encode("utf-8"),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )
        if delivered.returncode != 0:
            raise RuntimeError("Consumer failed")
    except Exception:
        # Never print response bodies, exception details, or child output.
        print("Secret handoff failed", file=sys.stderr)
        return 1
    print("Secret handoff completed")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

If the consumer requires a file, create it in a private directory with mode 700,
create the file with mode 600 from the start, and remove it after the consumer
finishes. Do not use a predictable shared temporary filename or place the value
in shell substitution, environment variables, Git, or trace output. Avoid verbose
CLI/HTTP logging while handling secrets.

## Verify and report

Verify the requested metadata lookup and, when needed, the actual authorized
consumer handoff. Report success/failure and relevant non-secret metadata.
Do not claim a read is verified merely because `vault status` succeeds; it does
not prove authentication or path permissions. Installation, secret reads, and
authentication do not authorize policy changes, rotations, or deployments.

Official behavior: [Vault CLI usage](https://developer.hashicorp.com/vault/docs/commands)
and [custom token helpers](https://developer.hashicorp.com/vault/docs/commands/token-helper).
