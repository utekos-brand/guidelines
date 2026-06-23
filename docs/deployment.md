# Deployment

## Vercel

- Team: `Utekos Marketing Group`
- Project: `utekos-brand-guidelines`
- Project ID: `prj_afRV55aXkqz7746PdUNY7KDnqy6C`
- Framework preset: `Next.js`
- Production deployment: `dpl_FV5hS98v1HH3YY2Erno1d2AXvp5S`
- Production URL: `https://utekos-brand-guidelines-oqp0f2xgs-utekos-marketing-group.vercel.app`
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

If a public resolver still returns `A 77.111.240.146`, it is serving stale
one.com cache. Wait for propagation and re-check.

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

## GitHub

The local `main` branch contains the app commit:

```text
cbd4c13 Build Utekos brand guidelines app
```

Push is currently blocked because the local GitHub account does not have write
access to `utekos-brand/guidelines`:

```text
remote: Permission to utekos-brand/guidelines.git denied to UtekosKristoffer.
fatal: unable to access 'https://github.com/utekos-brand/guidelines.git/':
The requested URL returned error: 403
```

Once `UtekosKristoffer` has write access, publish with:

```bash
git push origin main
```

Vercel GitHub integration also needs access to `utekos-brand/guidelines` before
push-to-deploy works. Until then, production deploys can be created from this
local directory with:

```bash
pnpm dlx vercel@latest deploy --prod --yes --logs
```
