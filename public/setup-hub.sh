#!/bin/sh
# ==============================================================================
# TierHive NAT VPS Multi-Website & Multi-Gateway Outbound Proxy Hub Installer
# OS: Alpine Linux (apk + OpenRC)
# Guarantees a stable IPv4 outbound connection (ipv6=off) for:
#   - Zarinpal (/zarinpal)
#   - Zibal    (/zibal)
#   - NextPay  (/nextpay)
#   - SEP      (/sep)
# ==============================================================================

set -eu

LISTEN_PORT="${1:-80}"

echo "============================================================"
echo " Setting up Stable Outbound IPv4 Payment Hub (Alpine Linux)"
echo "============================================================"

# 1. Install Nginx, Curl, OpenSSL on Alpine Linux
apk update
apk add --no-cache nginx curl openssl ca-certificates

# 2. Detect the VPS Stable Outbound IPv4
VPS_IPV4=$(curl -4 -s --max-time 8 https://api.ipify.org || curl -4 -s --max-time 8 https://ipv4.icanhazip.com | tr -d '[:space:]')
if [ -z "$VPS_IPV4" ]; then
  echo "[!] Could not auto-detect public IPv4. Falling back to default."
  VPS_IPV4="51.195.191.88"
fi
echo "[+] Stable Outbound IPv4 for Zarinpal: $VPS_IPV4"

# 3. Generate (or preserve) per-website secret tokens
VARA_SECRET="${VARA_SECRET:-$(openssl rand -hex 16)}"
SITE2_SECRET="${SITE2_SECRET:-$(openssl rand -hex 16)}"

# 4. Configure Alpine /etc/nginx/nginx.conf map_hash_bucket_size before any map block
sed -i '/map_hash_bucket_size/d' /etc/nginx/nginx.conf
sed -i '/http[[:space:]]*{/a \    map_hash_bucket_size 128;' /etc/nginx/nginx.conf

# 5. Clean default Alpine Nginx config & write /etc/nginx/http.d/payment-hub.conf
mkdir -p /etc/nginx/http.d
rm -f /etc/nginx/http.d/default.conf /etc/nginx/http.d/payment-hub.conf

cat >/etc/nginx/http.d/payment-hub.conf <<NGX_CONF
map \$http_x_proxy_secret \$authorized_site {
    default                     "";
    "${VARA_SECRET}"            "varabeauty.ir";
    "${SITE2_SECRET}"           "second-website.ir";
}

log_format payment_hub '\$remote_addr - [\$time_local] site="\$authorized_site" "\$request" status=\$status bytes=\$body_bytes_sent upstream="\$upstream_addr" rt=\$request_time';

server {
    listen ${LISTEN_PORT} default_server;
    listen [::]:${LISTEN_PORT} default_server;
    server_name pay.varabeauty.ir _;

    # Force IPv4-only DNS resolution so outbound traffic ALWAYS uses your stable NAT IPv4
    resolver 1.1.1.1 8.8.8.8 ipv6=off valid=300s;
    resolver_timeout 5s;

    access_log /var/log/nginx/payment-hub.log payment_hub;
    error_log  /var/log/nginx/payment-hub-error.log warn;
    server_tokens off;

    # Health check for TierHive HAProxy
    location = / {
        default_type application/json;
        return 200 '{"status":"ok"}';
    }
    location = /health {
        default_type application/json;
        return 200 '{"status":"ok"}';
    }

    # Verify Stable Outbound IPv4 & Secret Key Endpoint: GET /my-ip
    location = /my-ip {
        if (\$authorized_site = "") {
            return 403 '{"error":"Forbidden: Invalid or missing x-proxy-secret header"}';
        }
        default_type application/json;
        return 200 '{"ipv4":"${VPS_IPV4}","site":"\$authorized_site","status":"ok"}';
    }

    # Zarinpal Route (Supports both /zarinpal/pg/v4/... and /pg/v4/...)
    location ~ ^/(?:zarinpal/)?pg/v4/payment/(request|verify)\.json$ {
        if (\$authorized_site = "") {
            return 403 '{"errors":{"code":-403,"message":"Forbidden: Invalid x-proxy-secret"}}';
        }
        proxy_ssl_server_name on;
        proxy_ssl_protocols TLSv1.2 TLSv1.3;
        proxy_set_header Host payment.zarinpal.com;
        proxy_set_header Content-Type "application/json";
        proxy_set_header Accept "application/json";
        proxy_set_header User-Agent "ZarinPal Rest Api v4";
        proxy_set_header x-proxy-secret "";
        proxy_set_header X-Forwarded-For "";
        proxy_set_header X-Real-IP "";
        proxy_set_header Forwarded "";
        proxy_set_header Via "";
        proxy_pass https://payment.zarinpal.com/pg/v4/payment/\$1.json;
    }

    # Zibal Route (/zibal/v1/request, /zibal/v1/verify, etc.)
    location ~ ^/zibal/(v1/.*)$ {
        if (\$authorized_site = "") {
            return 403 '{"result":-403,"message":"Forbidden: Invalid x-proxy-secret"}';
        }
        proxy_ssl_server_name on;
        proxy_ssl_protocols TLSv1.2 TLSv1.3;
        proxy_set_header Host gateway.zibal.ir;
        proxy_set_header Content-Type "application/json";
        proxy_set_header Accept "application/json";
        proxy_set_header x-proxy-secret "";
        proxy_pass https://gateway.zibal.ir/\$1;
    }

    # NextPay Route (/nextpay/nx/gateway/token, /nextpay/nx/gateway/verify)
    location ~ ^/nextpay/(nx/gateway/.*)$ {
        if (\$authorized_site = "") {
            return 403 '{"code":-403,"message":"Forbidden: Invalid x-proxy-secret"}';
        }
        proxy_ssl_server_name on;
        proxy_ssl_protocols TLSv1.2 TLSv1.3;
        proxy_set_header Host nextpay.org;
        proxy_set_header x-proxy-secret "";
        proxy_pass https://nextpay.org/\$1;
    }

    # SEP / Saman Bank Route
    location ~ ^/sep/(.*)$ {
        if (\$authorized_site = "") {
            return 403 '{"status":-403,"message":"Forbidden: Invalid x-proxy-secret"}';
        }
        proxy_ssl_server_name on;
        proxy_ssl_protocols TLSv1.2 TLSv1.3;
        proxy_set_header Host sep.shaparak.ir;
        proxy_set_header x-proxy-secret "";
        proxy_pass https://sep.shaparak.ir/\$1;
    }

    location / {
        default_type application/json;
        return 404 '{"error":"Not Found"}';
    }
}
NGX_CONF

# 6. Test and Start Nginx via Alpine OpenRC
mkdir -p /run/nginx /var/log/nginx
nginx -t
rc-update add nginx default >/dev/null 2>&1 || true
rc-service nginx restart || rc-service nginx start

echo ""
echo "============================================================"
echo " TIERHIVE STABLE OUTBOUND IPv4 HUB IS READY (ALPINE LINUX)!"
echo "============================================================"
echo "1) Zarinpal Terminal IP to Register:  ${VPS_IPV4}"
echo "2) Vercel ZARINPAL_PROXY_URL:         https://pay.varabeauty.ir/zarinpal"
echo "3) Vercel ZARINPAL_PROXY_SECRET:      ${VARA_SECRET}"
echo "4) 2nd Website Proxy Secret:          ${SITE2_SECRET}"
echo "============================================================"
