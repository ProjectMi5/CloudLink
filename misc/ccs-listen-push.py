#!/usr/bin/python
import sys, json, xmpp, random, string

SERVER = 'gcm.googleapis.com'
PORT = 5235
USERNAME = "519296367272"
PASSWORD = "AIzaSyAO-AZNaR83oHHguV5W4tJNhWK8GKSlsK8"
REGISTRATION_ID = "APA91bENNiqKsuH9iPaueLnMQZ0TqorGY9ctH9jt48oacyddgAyZHyaBZ1KrZ6-bO_Y2ObQnC_BUrhYO-47dk8mzBBLoRVYjTCvJm5F7LL5uIV42PfOWTQp4oOkGCkBeXfZFD1Ey0HQi"

unacked_messages_quota = 100
send_queue = []

def message_callback(session, message):
  global unacked_messages_quota
  gcm = message.getTags('gcm')
  if gcm:
    # print 'incoming - AndroidUpstreamTest' # Thomas debug
    gcm_json = gcm[0].getData()
    msg = json.loads(gcm_json)
    # print message
    print msg.from
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

client = xmpp.Client('gcm.googleapis.com', debug=['socket'])
client.connect(server=(SERVER,PORT), secure=1, use_srv=False)
auth = client.auth(USERNAME, PASSWORD)
if not auth:
  print 'Authentication failed!'
  sys.exit(1)

client.RegisterHandler('message', message_callback)

#send_queue.append({'to': REGISTRATION_ID,
#                   'message_id': 'reg_id',
#                   'data': {'message_destination': 'RegId',
#                            'mi5': 'Testnachricht'}})

while True:
  client.Process(1)
  flush_queued_messages()
