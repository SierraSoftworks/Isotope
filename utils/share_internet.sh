#!/usr/bin/env sh

if [ $# -ne 2 ]; then
	echo "$0 INTERNET_DEV OVER_DEV"
	exit 1
fi

if (( $EUID )); then
   echo "You must be root to run this script. Try running sudo $0 or sudo !!" 1>&2
   exit 1
fi

# Assuming internet is available on $1
# Assuming you wish to share it over $2

echo "Configuring IPv4 Forwarding"
sysctl net.ipv4.ip_forward=1

echo "Configuring iptables for NAT routing"
iptables -t nat -A POSTROUTING -o $1 -j MASQUERADE
iptables -A FORWARD -i $2 -o $1 -j ACCEPT
iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

echo "Internet Sharing Configured"
echo ""

IP_ADDR=$(ifconfig $2 | grep -E --only-matching "inet addr:[0-9.]+" | grep --only-matching -E "[0-9.]+")

echo "Now, on your target device please run the following commands"
echo "sudo ip link set up dev eth0"
echo "sudo ip route add default via $IP_ADDR dev eth0"