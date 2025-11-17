import json
import requests
import argparse
from os.path import exists

# Parsing command line arguments
parser = argparse.ArgumentParser(description='Input Parameters.')
parser.add_argument('--envt', "-e" , help='Enviroment' , default = "qa")
parser.add_argument('--build_url', "-u" , help='Jenkins base url' , default = "http://localhost:8080/job/test-job/")
parser.add_argument('--slack_channel', "-s" , help='Slack channel to which messages are to be posted' , default = "#test123")
parser.add_argument('--slack_token', "-t" , help='Slack token for authenticating slack requests' , default = "token")
parser.add_argument('--report_title', "-r" , help='Slack report heading' , default = "UI Automation Test Result")
parser.add_argument('--report_location', "-l" , help='Cucumber result file location' , default = "./reports/cucumber-report.json")
parser.add_argument('--note', "-n" , help='Custom message to be posted to slack' , default = "")
args = parser.parse_args()
# Setting global variables
ENVT = args.envt
BASE_URL = args.build_url
SLACK_CHANNEL = args.slack_channel
SLACK_TOKEN = args.slack_token
REPORT_TITLE = args.report_title
CUCUMBER_REPORT = args.report_location
NOTE = args.note
PASSED_STATUS = "Passed  :meow_party:"
FAILED_STATUS = "Failed  :alert:"
BUILD_STATUS = PASSED_STATUS


def parseCucumberResult(fileName) :
	"""
	Parsing cucumber result file and extracting test results
	:param fileName: Cucumber file location + name
	:return: test result summary
	"""
	summary = "Feature".ljust(40)+"Total".ljust(8)+"Passed".ljust(8)+"Failed".ljust(8)+"Skipped" 
	summary = summary + "\n--------".ljust(41)+"-----".ljust(8)+"------".ljust(8)+"------".ljust(8)+"-------"
	f = open(fileName)
	data = json.load(f)
	for i in data:
		passed = 0
		failed = 0
		skipped = 0
		total = 0
		for element in i['elements'] : 
			total=total+1
			stepCount = 0
			passedSteps = 0
			failedSteps = 0
			skippedSteps= 0
			#print(element['name'])
			for step in element['steps']:
				stepCount = stepCount + 1
				if (step['result']['status']=='passed') : 
					passedSteps=passedSteps+1
				elif (step['result']['status']=='failed') : 
					failedSteps=failedSteps+1
				else : 
					skippedSteps=skippedSteps+1
			if(failedSteps > 0):
				failed = failed + 1
				global BUILD_STATUS
				BUILD_STATUS = FAILED_STATUS
			elif (skipped > 0) :
				skipped = skipped + 1
			else :
				passed = passed + 1
		feature = i['name']
		print("Feature : {0}".format(feature))
		print("Total Scenarios: {0}".format(total))
		print("Passed : {0}".format(passed))
		print("Failed : {0}".format(failed))
		print("Skipped : {0}".format(skipped))
		summary = '{0}\n{1}{2}{3}{4}{5}'.format(summary,feature.ljust(40),str(total).ljust(8),str(passed).ljust(8),str(failed).ljust(8),skipped)
	f.close()
	#print(summary)
	return summary

def post_to_slack(payload):
	"""
	Post results to slack
	:param payload: Message to be posted to slack
	"""
	print("Posting to slack... ")
	url = "https://slack.com/api/chat.postMessage"
	#print(payload)
	headers = {
		'Content-Type': 'application/json; charset=utf-8',
		'Authorization': "Bearer " + SLACK_TOKEN
	}
	if(payload):
		# print(json.dumps(payload))
		# print("---------------------------------")
		response = requests.request("POST", url, headers=headers, data=json.dumps(payload))
		# print(response.text)

def build_payload(message):
	"""
	Build payload to be posted to slack
	:param message: test summary message
	:return: payload
	"""
	payload = ""
	color = "#00FF00"
	if(BUILD_STATUS== FAILED_STATUS):
		color = "#FF0000"
	payload = {
		"channel": SLACK_CHANNEL,
		"blocks": [
			{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": REPORT_TITLE
			}
		},
			
			{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Envt     : {0} *\n *Status   : {1}*".format(ENVT,BUILD_STATUS)
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Reports*\n" 
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Cucumber Report",
						"emoji": True
					},
					"url": "{0}cucumber-html-reports/overview-features.html".format(BASE_URL),
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Html Report",
						"emoji": True
					},
					"url": "{0}HtmlReport/".format(BASE_URL),
				}
			]
		},
			{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Test Summary*"
			}
		}
		]
		,
	"attachments": [ {	
				"text" :  "```%s```" % message,
				"color": color,
				"attachment_type": "default"
			}]
	
	}
	if(NOTE != ""):
		payload["attachments"].append({"color": "#3AA3E3","text": "*Note* : " + NOTE })
	return payload

def report_not_found_payload():
	"""
	Build payload to be posted to slack when report is not generated
	:return: payload
	"""
	return  {
		"channel" : SLACK_CHANNEL,
		"text" : "*" + REPORT_TITLE +
				"*\n- <{0}|Test result not found> \n".format(BASE_URL)
	}
if(exists(CUCUMBER_REPORT)) : 
	summary = parseCucumberResult(CUCUMBER_REPORT)
	post_to_slack(build_payload(summary))
else:
	print("Cucumber result not found")
	post_to_slack(report_not_found_payload())
