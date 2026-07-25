#!/usr/bin/env python3
"""Build self-steal route/firewall artifacts from UFW-style deny lists."""

import argparse
import ipaddress
import json
from pathlib import Path


def load_networks(paths):
    networks = []
    for path in paths:
        for line in path.read_text(errors="ignore").splitlines():
            parts = line.strip().split()
            if not parts or parts[0].startswith("#"):
                continue
            value = parts[-1] if parts[:3] == ["ufw", "deny", "from"] else parts[0]
            try:
                networks.append(ipaddress.ip_network(value, strict=False))
            except ValueError:
                continue
    return list(ipaddress.collapse_addresses(sorted(set(networks), key=lambda n: (int(n.network_address), n.prefixlen))))


def write_v2ray_rules(out_dir, targets):
    rules = [
        {
            "enabled": True,
            "ip": [str(item) for item in targets],
            "locked": False,
            "outboundTag": "direct",
            "remarks": "self-steal direct ip rules",
        }
    ]
    path = out_dir / "selfsteal-v2ray-rules.json"
    path.write_text(json.dumps(rules, ensure_ascii=False, indent=2) + "\n")
    return path


def write_targets(out_dir, targets):
    path = out_dir / "selfsteal-targets-collapsed.txt"
    path.write_text("\n".join(str(item) for item in targets) + "\n")
    return path


def write_nft(out_dir, targets, ports):
    elements = ",\n    ".join(str(item) for item in targets)
    tcp_ports = ", ".join(str(port) for port in ports)
    path = out_dir / "selfsteal-ports.nft"
    path.write_text(
        f"""#!/usr/sbin/nft -f

table inet codex_selfsteal {{
  set whitelist_v4 {{
    type ipv4_addr
    flags interval
    elements = {{
    {elements}
    }}
  }}

  chain input {{
    type filter hook input priority -5; policy accept;
    iifname "lo" accept
    iifname "wt0" accept
    ip saddr @whitelist_v4 tcp dport {{ {tcp_ports} }} drop
    ip saddr @whitelist_v4 udp dport {{ {tcp_ports} }} drop
  }}
}}
"""
    )
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inputs", nargs="+", type=Path, help="Whitelist files or UFW deny command files")
    parser.add_argument("--out-dir", type=Path, default=Path("."), help="Directory for generated artifacts")
    parser.add_argument("--ports", default="8443", help="Comma-separated server ports for nft candidate")
    args = parser.parse_args()

    ports = [int(item.strip()) for item in args.ports.split(",") if item.strip()]
    args.out_dir.mkdir(parents=True, exist_ok=True)
    targets = load_networks(args.inputs)

    target_file = write_targets(args.out_dir, targets)
    json_file = write_v2ray_rules(args.out_dir, targets)
    nft_file = write_nft(args.out_dir, targets, ports)

    print(f"targets={len(targets)}")
    print(f"targets_file={target_file}")
    print(f"v2ray_rules={json_file}")
    print(f"nft_candidate={nft_file}")


if __name__ == "__main__":
    main()
