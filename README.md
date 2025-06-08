# ST-Enum

> Chrome Extension – Subdomain Enumerator for SecurityTrails (No API Required)

---

## 🔍 What is ST-Enum?

**ST-Enum** is a lightweight Chrome extension that allows you to extract **subdomains for any domain** directly from [SecurityTrails](https://securitytrails.com) — **without using an API key**.

It supports large-scale enumeration, including sensitive TLDs like:

- `gov.*` (government domains)  
- `edu.*` (educational domains)

---

## ✅ Features

- ❌ No API key required (free API is limited to only 1,000 results)
- 📦 Extract up to **10,000+ subdomains**
- 🚀 Works via frontend parsing – no backend required
- 🧠 Useful for OSINT, Bug Bounty, and cybersecurity research
- 🐢 Built-in delay to avoid getting rate-limited or blocked

---

## 🛠️ How to Use

1. Log in manually to [https://securitytrails.com]
2. Install the extension in Chrome (see below)
3. Open the extension and enter any domain (e.g. `example.com`)
4. Click **Fetch Domain**, and subdomains will start loading automatically

> ⚠️ A small delay is added between requests to prevent bans or rate limiting.

---

## 💻 Manual Installation (Chrome)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/yourusername/ST-Enum.git
