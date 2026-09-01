# Homelab Deployment (Self-Hosted GitHub Actions Runner)

This repo auto-deploys to a homelab VM whenever `main` passes CI. It uses:

- **Docker Compose** (`docker-compose.yml` at repo root) to build and run the
  backend (Django + gunicorn) and frontend (Vite build served by nginx,
  which also reverse-proxies `/api/` and `/admin/` to the backend container).
- **A self-hosted GitHub Actions runner** installed directly on the homelab
  VM, so `.github/workflows/deploy.yml` can run `docker compose` commands
  against the VM's own Docker daemon.
- **`.github/workflows/deploy.yml`**, which triggers automatically once
  `.github/workflows/CI.yml` ("Django CI Pipeline") succeeds on `main`
  (or manually via "Run workflow" in the Actions tab).

## 1. Prerequisites on the VM

On the Proxmox VM (Ubuntu/Debian assumed):

```bash
# Docker + Compose plugin
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Confirm
docker --version
docker compose version
```

Re-login (or `newgrp docker`) so your user can run `docker` without `sudo` —
the runner service will run as this user.

## 2. Register the self-hosted runner

1. In GitHub: **Settings → Actions → Runners → New self-hosted runner**
   (repo-level, or org-level if you plan to reuse it for other repos).
2. Choose Linux/x64 and follow the generated commands, e.g.:

   ```bash
   mkdir -p ~/actions-runner && cd ~/actions-runner
   curl -o actions-runner.tar.gz -L https://github.com/actions/runner/releases/download/vX.Y.Z/actions-runner-linux-x64-X.Y.Z.tar.gz
   tar xzf actions-runner.tar.gz
   ./config.sh --url https://github.com/<org>/monarch-pathways --token <TOKEN_FROM_GITHUB_UI>
   ```

3. **Important:** when prompted for labels, add `homelab` (in addition to the
   defaults) — the deploy workflow targets `runs-on: [self-hosted, homelab]`
   specifically so it never accidentally schedules on some other self-hosted
   runner you might add later.
4. Install it as a persistent systemd service instead of running it in a
   terminal:

   ```bash
   sudo ./svc.sh install
   sudo ./svc.sh start
   sudo ./svc.sh status
   ```

The runner token from step 2 is single-use and expires quickly — generate a
fresh one from the GitHub UI if `config.sh` complains it's invalid/expired.

## 3. Add the required repo secret

`deploy.yml` writes `backend/.env` from a GitHub Actions secret at deploy
time (so no real secret ever lives in the repo or git history):

- **Settings → Secrets and variables → Actions → New repository secret**
- Name: `DJANGO_SECRET_KEY`
- Value: any long random string (e.g. `openssl rand -hex 32`)

## 4. How the deploy works

1. Push (or merge a PR) to `main`.
2. `CI.yml` runs lint/tests on GitHub-hosted runners as before.
3. On success, `deploy.yml` fires automatically on the **homelab** runner:
   - Checks out `main`.
   - Writes `backend/.env` from the `DJANGO_SECRET_KEY` secret.
   - `docker compose build` — rebuilds backend/frontend images.
   - `docker compose up -d --remove-orphans` — recreates any changed
     containers; the Django container runs migrations + `collectstatic`
     automatically on startup (see `backend/Dockerfile`).
   - Prunes dangling images so the VM disk doesn't fill up over time.

The SQLite database and Django log files persist across deploys in the
named Docker volumes `backend-data` and `backend-logs` (defined in
`docker-compose.yml`), so redeploys don't wipe student data.

### Default admin login

On first boot (empty database), the backend container automatically creates
a superuser: **username `admin` / password `admin`** — same default as local
dev (`run.sh`). This only happens once, the very first time the `backend-data`
volume is empty; it will **not** recreate or reset the account on later
redeploys, so if you change the password afterward it sticks.

To use a different default from the start, set `DJANGO_SUPERUSER_USERNAME` /
`DJANGO_SUPERUSER_EMAIL` / `DJANGO_SUPERUSER_PASSWORD` in `backend/.env`
(see `backend/.env.example`) before the first deploy — either by adding them
to the `deploy.yml` env-writing step, or manually in `backend/.env` on the VM
if you're not using that step's generated file.

**If you're locked out on an already-running deployment** (e.g. it was
deployed before this superuser-creation step existed, or you changed/lost the
password), create one directly against the running container instead of
wiping the volume:

```bash
docker compose exec backend python manage.py createsuperuser
```


## 5. Accessing the app

- `docker-compose.yml` publishes the frontend on **`http://<vm-ip>:8080`**.
- Your existing reverse proxy in front of the VM can point at that same
  port/path if you also want a friendly domain name — nothing else needs to
  change on the app side since the frontend nginx container already handles
  the `/api/` proxying internally.

## 6. Manual operations on the VM

```bash
cd /path/to/monarch-pathways   # wherever the runner checks the repo out

docker compose ps              # see running containers
docker compose logs -f backend # tail backend logs
docker compose down            # stop everything (keeps volumes/data)
docker compose up -d --build   # manual rebuild + redeploy
```

## 7. Local dev is unaffected

`run.sh` (venv + `npm run dev`) still works exactly as before for local
development — Docker/Compose is only used for the homelab deployment path.
