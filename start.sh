#!/bin/bash

  case "$1" in
    start)
        echo -n "Starting CloudLink"
	su - cloudlink -c '/usr/bin/forever start -l /opt/cloudlink/CloudLink/log/forever.log -a -e /opt/cloudlink/CloudLink/log/err.log -o /opt/cloudlink/CloudLink/log/out.log -p /tmp /opt/cloudlink/CloudLink/app.js' &>/var/log/CloudLinkStartup.log 
        ;;
    stop)
        echo -n "Stopping CloudLink"
        pkill -f '/usr/bin/nodej[s] /opt/cloudlink/CloudLink/app.js'
	pkill -f '/usr/bin/nodej[s] /usr/lib/node_modules/forever/bin/monitor /opt/cloudlink/CloudLink/app.js'
	;;
    *)
        ## If no parameters are given, print which are avaiable.
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac

exit 0
