echo 'Start forever app.js'
forever start -l /home/thomas/js/CloudLink/log/forever.log -a -e /home/thomas/js/CloudLink/log/err.log -o /home/thomas/js/CloudLink/log/out.log app.js
echo 'Start updastream-python-mqtt daemon'

