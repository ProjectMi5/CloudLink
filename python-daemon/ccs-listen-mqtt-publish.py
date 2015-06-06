#!/usr/bin/python
import sys, json, xmpp, random, string
import paho.mqtt.client as mqtt

# GCM - MQTT Redirect
# This script is listening to ccs upstream messages
# it automatically redirects every upstream message to the local mqtt broker
# mqtt: /mi5/server/upstream
# 
# Author: Thomas Frei
# Date: 2015-06-06

SERVER = 'gcm.googleapis.com'
PORT = 5235
USERNAME = "519296367272"
PASSWORD = "AIzaSyAO-AZNaR83oHHguV5W4tJNhWK8GKSlsK8"
REGISTRATION_ID = "APA91bENNiqKsuH9iPaueLnMQZ0TqorGY9ctH9jt48oacyddgAyZHyaBZ1KrZ6-bO_Y2ObQnC_BUrhYO-47dk8mzBBLoRVYjTCvJm5F7LL5uIV42PfOWTQp4oOkGCkBeXfZFD1Ey0HQi"

unacked_messages_quota = 100
send_queue = []

# MQTT functions
# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("/mi5/server/upstream")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print("MQTT - published:"+msg.topic+" "+str(msg.payload))

# MQTT
clientMqtt = mqtt.Client()
clientMqtt.on_connect = on_connect
clientMqtt.on_message = on_message

clientMqtt.connect("localhost", 1883, 60)
clientMqtt.loop_start() # ccs while loop is sufficient


# CCS functions
def message_callback(session, message):
  global unacked_messages_quota
  global clientMqtt

  gcm = message.getTags('gcm')
  if gcm:
    # print 'incoming - AndroidUpstreamTest' # Thomas debug
    gcm_json = gcm[0].getData()
    msg = json.loads(gcm_json)
    # print message
    # print msg # working
    # print msg['data'] #worki   g

    # Print Message
    print gcm_json
    # Publish the Message directly to MQTT Server
    clientMqtt.publish("/mi5/server/upstream", gcm_json)

    if not msg.has_key('message_type'):
      # Acknowledge the incoming message immediately.
      send({'to': msg['from'],
            'message_type': 'ack',
            'message_id': msg['message_id']})
	
    elif msg['message_type'] == 'ack' or msg['message_type'] == 'nack':
      unacked_messages_quota += 1

def send(json_dict):
  template = ("<message><gcm xmlns='google:mobile:data'>{1}</gcm></message>")
  client.send(xmpp.protocol.Message(
      node=template.format(client.Bind.bound[0], json.dumps(json_dict))))

def flush_queued_messages():
  global unacked_messages_quota
  while len(send_queue) and unacked_messages_quota > 0:
    send(send_queue.pop(0))
    unacked_messages_quota -= 1

# CCS
client = xmpp.Client('gcm.googleapis.com', debug=['socket'])
client.connect(server=(SERVER,PORT), secure=1, use_srv=False)
auth = client.auth(USERNAME, PASSWORD)
if not auth:
  print 'Authentication failed!'
  sys.exit(1)

client.RegisterHandler('message', message_callback)

while True:
  client.Process(1)
  flush_queued_messages()
