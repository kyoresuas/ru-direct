# rudirect

Keep Russian services on your regular connection while the rest of your traffic uses the VPN. Download a ready-made list or choose your own services from the catalogue.

[![Stars](https://img.shields.io/github/stars/kyoresuas/ru-direct?style=flat&color=0f766e)](https://github.com/kyoresuas/ru-direct/stargazers)
[![Lists](https://github.com/kyoresuas/ru-direct/actions/workflows/update.yml/badge.svg)](https://github.com/kyoresuas/ru-direct/actions/workflows/update.yml)
[![CI](https://github.com/kyoresuas/ru-direct/actions/workflows/ci.yml/badge.svg)](https://github.com/kyoresuas/ru-direct/actions/workflows/ci.yml)
[![jsDelivr](https://data.jsdelivr.com/v1/package/gh/kyoresuas/ru-direct/badge?style=rounded)](https://www.jsdelivr.com/package/gh/kyoresuas/ru-direct)
[![License](https://img.shields.io/badge/License-MIT-2ea44f.svg)](LICENSE)

**[Download a list](https://kyoresuas.github.io/ru-direct/#setup)** · **[Build your own](https://kyoresuas.github.io/ru-direct/#services)**

<p align="center">
  <a href="https://kyoresuas.github.io/ru-direct/#services"><img src="site/assets/preview.png?v=f1cd9c4" width="800" alt="rudirect list builder with four selected services and an AmneziaVPN download button"></a>
</p>

90 services, three preset tiers and 27 file formats. The builder exports AmneziaVPN JSON and IPv4/IPv6 text lists. Save your selection as a link to reopen it with fresh data, or share it with someone else. Downloaded custom files still need to be imported manually.

**English** · [Русский](README.md) · [Compatibility checks](#compatibility-checks) · [Contributing](CONTRIBUTING.md)

## Download

**[Download page](https://kyoresuas.github.io/ru-direct/#setup)**: pick a client and a tier. For a custom list, open **Your list**, select services and an export format. The site UI is in Russian. The address checker compares IPv4 and IPv6 addresses against the generated IP lists; it does not test your VPN connection.

For AmneziaVPN right away:

| Tier | Contents | File |
| --- | --- | --- |
| **ru-lite** | Banks, Mir and SBP payments, Gosuslugi, tax service, ministries, VK, OK, Mail.ru, MAX, Dzen, Rutube. Up to 500 prefixes, works in any client. **Recommended** | [ru-lite.amnezia.json](https://github.com/kyoresuas/ru-direct/releases/latest/download/ru-lite.amnezia.json) |
| **ru-standard** | Lite plus Ozon, Wildberries, Yandex, Avito, 2GIS, carriers, streaming, delivery, retail, travel. Up to 2000 prefixes | [ru-standard.amnezia.json](https://github.com/kyoresuas/ru-direct/releases/latest/download/ru-standard.amnezia.json) |
| **ru-full** | Standard plus the whole Russian address space from RIPE. Thousands of prefixes, routers and desktops only | [ru-full.amnezia.json](https://github.com/kyoresuas/ru-direct/releases/latest/download/ru-full.amnezia.json) |

Every format is attached to the [latest release](https://github.com/kyoresuas/ru-direct/releases/latest). File names are identical across all sources:

```text
https://github.com/kyoresuas/ru-direct/releases/latest/download/<file>
https://cdn.jsdelivr.net/gh/kyoresuas/ru-direct@release/<file>
https://raw.githubusercontent.com/kyoresuas/ru-direct/release/<file>
```

The first URL is never cached, the second is a CDN for client subscriptions, the third lags by up to five minutes. Checksums live in `SHA256SUMS`, every file is described in `manifest.json`.

### Formats

| Client | Files |
| --- | --- |
| AmneziaVPN | `<tier>.amnezia.json`, `<tier>.amnezia-domains.json` |
| AmneziaWG, WireGuard | `<tier>.wireguard.txt`, `<tier>.wireguard-inverted.txt` |
| sing-box, Hiddify, NekoBox, Karing, Throne, Podkop | `<tier>.singbox.srs`, `<tier>.singbox.json` |
| Xray, v2rayN, v2rayNG, Happ, Streisand | `geoip.dat`, `geosite.dat`, `<tier>.v2rayn.json`, `<tier>.happ.json` |
| Clash, Mihomo, Clash Verge, FlClash | `<tier>.mihomo.mrs`, `<tier>.mihomo.yaml`, `<tier>.clash.yaml` |
| Shadowrocket, Surge, Loon | `<tier>.surge.list` |
| Quantumult X | `<tier>.quantumultx.list` |
| MikroTik | `<tier>.mikrotik.rsc`, `<tier>.mikrotik-ipv6.rsc` |
| Keenetic | `<tier>.keenetic.bat`, `<tier>.keenetic-cli.txt` |
| OpenWrt | `<tier>.openwrt.nft`, `<tier>.dnsmasq.conf` |
| Windows, Linux, macOS | `<tier>.windows.bat`, `<tier>.linux.sh`, `<tier>.macos.sh` |
| Plain lists | `<tier>.ipv4.txt`, `<tier>.ipv6.txt`, `<tier>.domains.txt` |

Tier is `ru-lite`, `ru-standard` or `ru-full`. `geoip.dat` and `geosite.dat` carry all three tiers as tags such as `geoip:ru-lite` and `geosite:ru-standard`.

## Compatibility checks

Checked on 2026-11-02: the site's 26 client choices across all three tiers, generated download targets, IPv4/IPv6 checks and custom export. These checks run in a browser and against generated files. VPN client versions, operating systems, native import and routing on real devices still need verification.

| Client | Files | Site and files | Native import |
| --- | --- | --- | --- |
| AmneziaVPN | `.amnezia.json`, `.amnezia-domains.json` | Checked | Needs verification |
| WireGuard, AmneziaWG | `.wireguard-inverted.txt` | Checked | Needs verification |
| sing-box, Hiddify, Karing, NekoBox, Throne | `.singbox.srs`, `.singbox.json` | Checked | Needs verification |
| Xray, v2rayN, v2rayNG, Streisand | `geoip.dat`, `geosite.dat`, `.v2rayn.json` | Checked | Needs verification |
| Happ | `.happ.json` | Checked | Needs verification |
| Clash / Mihomo, Clash Verge Rev, FlClash | `.mihomo.mrs`, `.mihomo.yaml`, `.clash.yaml` | Checked | Needs verification |
| Shadowrocket, Surge, Loon | `.surge.list` | Checked | Needs verification |
| Quantumult X | `.quantumultx.list` | Checked | Needs verification |
| MikroTik | `.mikrotik.rsc`, `.mikrotik-ipv6.rsc` | Checked | Needs verification |
| Keenetic | `.keenetic.bat`, `.keenetic-cli.txt` | Checked | Needs verification |
| OpenWrt | `.openwrt.nft`, `.dnsmasq.conf` | Checked | Needs verification |
| Windows, Linux, macOS | `.windows.bat`, `.linux.sh`, `.macos.sh` | Checked | Needs verification |
| Plain lists | `.ipv4.txt`, `.ipv6.txt`, `.domains.txt` | Checked | Needs verification |

File extensions in this table follow `ru-lite`, `ru-standard` or `ru-full`. Open checks: [AmneziaVPN](https://github.com/kyoresuas/ru-direct/issues/33), [Karing/Hiddify](https://github.com/kyoresuas/ru-direct/issues/34), [Keenetic](https://github.com/kyoresuas/ru-direct/issues/35). Share a native import result through the [client check form](https://github.com/kyoresuas/ru-direct/issues/new?template=client_check.yml), including the exact client version, OS and date.

## Importing into AmneziaVPN

1. Download the file to the device.
2. Open the connection, then **Connection settings** and **Split Tunneling**.
3. Choose **Site-based split tunneling** and the mode **Addresses from the list should not be accessed via VPN**.
4. Tap ⋮, then **Import** and **Replace site list**, pick the file.
5. Enable split tunneling and reconnect.

The `amnezia-domains.json` variant also carries domains with their addresses. The desktop client 5.x re-resolves them on every connection, so the list heals itself when a CDN changes addresses. On phones there is no difference, use the plain file.

## What the list fixes and what it cannot

The list makes a site or an API see your home address and keeps Russian traffic out of the tunnel. That removes the server-side IP check and saves VPN bandwidth.

It cannot remove on-device checks. Android apps of Ozon, Wildberries, Sber, 2GIS and others look for a tun interface and installed VPN clients and report the result to their servers. That is why the "turn off your VPN" banner can appear even with a perfect list. What helps: VPN on the router, an Android work profile with marketplaces outside the VPN, or app-based split tunneling in AmneziaVPN on Android. iOS has no app-based mode, so the list and disabled IPv6 are all you get.

## How it differs from blocklists

[itdoginfo/allow-domains](https://github.com/itdoginfo/allow-domains) and [runetfreedom/russia-v2ray-rules-dat](https://github.com/runetfreedom/russia-v2ray-rules-dat) mostly maintain lists of blocked resources: those go through the VPN, everything else goes direct. RU Direct solves the opposite problem: the VPN carries all traffic, and Russian services go direct.

| | RU Direct | Blocklists |
| --- | --- | --- |
| What the list holds | Russian services and the country zone | Resources blocked in Russia |
| What goes through the VPN | Everything not in the list | Only what is in the list |
| A new block appears | Nothing to do, the site is already in the VPN | Wait for the list to be updated |
| A resource is missing from the list | A Russian service opens through the VPN, a bank may refuse a foreign address | A blocked site does not open |

If you need targeted circumvention without a VPN for all traffic, use blocklists. If you keep the VPN always on and want Russian services without turning it off, use RU Direct.

## FAQ

### Which tier should I pick?

Lite for banks, payments, government services and social networks. Standard if you use marketplaces, Yandex, delivery and streaming. Full only on routers and desktops that can hold thousands of routes.

### AmneziaVPN on Windows connects for minutes with a big list

A known client issue: routes are installed one by one. See [amnezia-client #2248](https://github.com/amnezia-vpn/amnezia-client/issues/2248). Use Lite or Standard.

### I have IPv6

AmneziaVPN is IPv4 only, so IPv6 traffic to Russian sites goes through the tunnel. Either disable IPv6 on the device or use a client with IPv6 lists: WireGuard, sing-box, Clash, MikroTik and OpenWrt get them in the same files.

### A site still goes through the VPN

Enter the domain on the [Check an address](https://kyoresuas.github.io/ru-direct/#check) page to see which tiers its addresses belong to, or run `npm run check -- example.ru` from a clone. If it is missing, open an [issue](https://github.com/kyoresuas/ru-direct/issues/new/choose) or send a pull request to `config/services`.

### Why are Cloudflare, AWS or hosting providers not included?

Because those are not Russian services. A guard subtracts Cloudflare, AWS, Fastly, Google and other anycast networks from every tier, and hosting or anti-DDoS ASNs are rejected by config validation. Otherwise foreign sites would leak past the VPN.

### How often are the lists updated?

Every day around 06:00 Moscow time. File names never change, so the jsDelivr URL can go straight into a sing-box or Clash rule-set. Daily changes are listed in the [latest release](https://github.com/kyoresuas/ru-direct/releases/latest) notes.

### Can I use the lists in my own project?

Yes, the license is MIT. File names and URLs stay stable.

## How it is built

- **Full zone**: prefixes registered to Russia according to [RIPE Stat](https://stat.ripe.net/), with ipdeny as a fallback.
- **Services**: each service's own autonomous systems verified through RIPE, plus domains extracted from [RuStore](https://www.rustore.ru/) apps and websites. App packages and versions are recorded in the config.
- **Precision**: prefixes from service-owned ASNs are filtered by country. Domain addresses outside these networks are added as exact IPs or a node prefix from a Russian CDN.
- **Guard**: Cloudflare, AWS, Fastly, Google and static anycast prefixes are subtracted from IP lists in every tier. Domain rules and client-side DNS can produce different results.
- **Tiers**: Lite is capped at 500 IPv4 prefixes, Standard at 2000; the build fails otherwise.
- **Formats**: one TypeScript generator produces every file from the same data; `.srs` and `.mrs` are compiled by the official sing-box and mihomo binaries.

[Service configs](config/services) record domains and audited app package names, versions and dates. For the nine services audited on 2026-11-01, `notes` also contains the SHA-256 of the APK examined. [CI](https://github.com/kyoresuas/ru-direct/actions/workflows/ci.yml) publishes automated check results. [manifest.json](https://raw.githubusercontent.com/kyoresuas/ru-direct/release/manifest.json) records file sizes, SHA-256 and build time; [SHA256SUMS](https://raw.githubusercontent.com/kyoresuas/ru-direct/release/SHA256SUMS) lists routing file checksums.

The jsDelivr badge counts CDN requests, including automatic updates, rather than unique users.

Architecture notes for contributors and agents are in [AGENTS.md](AGENTS.md).

## Development

```bash
npm ci
npm run tools      # sing-box and mihomo for binary formats
npm run update     # full build into dist/
npm run generate   # rebuild from cache, no network
npm run verify     # validate config and ASN holders
npm run check -- <ip|domain>
npm run lint
npm test
```

Node.js 22 or newer. CI runs lint, tests and config validation on Node.js 22 and 24. A daily workflow publishes the rolling `latest` release, the `release` branch and the site.

## Support the project

The easiest way is to star the repository and tell friends who set up a VPN. If the project helped, you can also support its development:

- **TON:** `kyoresuas.ton`
- **TON wallet address:** `UQATzyMcVoZudjaA5Rc9w5TV_lIqxh9DPk0gSnjkLVvwEVqz`
- **USDT on TRON (TRC-20):** `TJSLjDo4yRgHr9JqqEcrkbC51bP9DCiBC7`

Please verify the network before transferring cryptocurrency.

## Contact

- [GitHub Issues](https://github.com/kyoresuas/ru-direct/issues)
- Telegram: [@stercuss](https://t.me/stercuss)
- Email: [hey@kyoresuas.com](mailto:hey@kyoresuas.com)

## Disclaimer

An independent project. Not affiliated with Amnezia or any other client mentioned, not sponsored, no VPN advertising.

## License

[MIT](LICENSE)
