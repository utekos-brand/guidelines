# Deployment

## Vercel

- Team: `Utekos Marketing Group`
- Project: `utekos-brand-guidelines`
- Project ID: `prj_afRV55aXkqz7746PdUNY7KDnqy6C`
- Framework preset: `Next.js`
- Production deployment: `dpl_CMbUn9GEkUfDECp14QbRVa49rHr7`
- Production URL: `https://utekos-brand-guidelines-opw2zdwg0-utekos-marketing-group.vercel.app`
- Custom domain alias: `https://brand.utekos.no`

The Vercel project is linked locally through `.vercel/project.json`, but that
folder is intentionally gitignored.

## DNS

`brand.utekos.no` is added to the Vercel project and DNS is hosted at one.com.
The one.com authoritative nameservers return the Vercel CNAME:

```bash
dig brand.utekos.no CNAME @ns01.one.com +noall +answer
# brand.utekos.no. 3600 IN CNAME 47a2068b75729cc6.vercel-dns-016.com.
```

External resolvers verified after the one.com change:

```bash
dig brand.utekos.no A @1.1.1.1 +noall +answer
dig brand.utekos.no A @8.8.8.8 +noall +answer
dig brand.utekos.no A @9.9.9.9 +noall +answer
```

Expected answer shape:

```text
brand.utekos.no. 3600 IN CNAME 47a2068b75729cc6.vercel-dns-016.com.
47a2068b75729cc6.vercel-dns-016.com. 300 IN A 216.150.1.1
47a2068b75729cc6.vercel-dns-016.com. 300 IN A 216.150.16.1
```

Some local resolvers may briefly return stale `A 77.111.240.146`, which points
to one.com's Apache server. That is cache, not the authoritative one.com state.

Configured one.com DNS record:

```text
Hostname: brand
Is an alias of: 47a2068b75729cc6.vercel-dns-016.com.
TTL: empty/default
```

Vercel also accepts the generic target `cname.vercel-dns.com.`, but its current
project-specific recommendation for this domain is
`47a2068b75729cc6.vercel-dns-016.com.`.

After the DNS change:

```bash
dig +short brand.utekos.no CNAME
curl -I -L https://brand.utekos.no
```

Expected final result: DNS returns the Vercel CNAME and `curl` returns a Vercel
`200` or redirect response instead of one.com's Apache `404`.

Bypassing stale resolver cache can be verified with:

```bash
curl -I --resolve brand.utekos.no:443:216.150.1.1 https://brand.utekos.no
curl -I --resolve brand.utekos.no:443:216.150.16.1 https://brand.utekos.no
```

Both returned `HTTP/2 200` from Vercel for the current deployment.

## GitHub

The local `main` branch and GitHub `main` are synced at:

```text
06a368b Refine brand palette workspace
```

Push uses a repository deploy key stored locally at:

```text
~/.ssh/utekos_brand_guidelines_deploy_key
```

Publish with:

```bash
GIT_SSH_COMMAND='ssh -F /dev/null -i ~/.ssh/utekos_brand_guidelines_deploy_key -o IdentitiesOnly=yes -o IdentityAgent=none -o StrictHostKeyChecking=accept-new' \
  git push git@github.com:utekos-brand/guidelines.git main:main
```

Vercel GitHub integration is not required for manual production deploys from
this local directory:

```bash
pnpm dlx vercel@latest deploy --prod --yes --logs
```
