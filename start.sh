#!/bin/bash

#echo 'Start forever app.js'
#cd /home/thomas/js/CloudLink
#echo 'Start updastream-python-mqtt daemon'


  case "$1" in
    start)
        echo -n "Starting CloudLink"
	su - thomas -c '/usr/bin/forever start -l /home/thomas/js/CloudLink/log/forever.log -a -e /home/thomas/js/CloudLink/log/err.log -o /home/thomas/js/CloudLink/log/out.log /home/thomas/js/CloudLink/app.js' &>/var/log/CloudLinkStartup.log 
        ;;
    stop)
        echo -n "Stopping CloudLink"
        pkill -f '/usr/bin/nodej[s] /home/thomas/js/CloudLink/app.js'
	pkill -f '/usr/bin/nodej[s] /usr/lib/node_modules/forever/bin/monitor /home/thomas/js/CloudLink/app.js'
	;;
    *)
        ## If no parameters are given, print which are avaiable.
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac

exit 0
