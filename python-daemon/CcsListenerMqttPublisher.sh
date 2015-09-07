#!/bin/bash

#echo 'Start forever app.js'
#cd /home/thomas/js/CloudLink
#echo 'Start updastream-python-mqtt daemon'


  case "$1" in
    start)
        echo -n "Starting Cloud Publisher"
	su - thomas -c '/usr/bin/python2.7 /home/thomas/js/CloudLink/python-daemon/ccs-listen-mqtt-publish.py'
        ;;
    stop)
        echo -n "Stopping Cloud Publisher"
	pkill -f '/usr/bin/[p]ython2.7 /home/thomas/js/CloudLink/python-daemon/ccs-listen-mqtt-publish.py'	
        ;;
    *)
        ## If no parameters are given, print which are avaiable.
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac

exit 0

