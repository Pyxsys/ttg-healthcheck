import requests
import psutil
import json

class Runner:

    api_endpoint='api/daemon_endpoint'

    # Initializes instance attributes.
    def __init__(self, path):
        with open(path, "r") as config_file:
            self.configs = json.load(config_file)


    def getConfig(self):
        return self.configs

    def getReport(self):
        return self.report.report_message

    def sendReport(self):
        url = self.getConfig()['destination'] + self.api_endpoint
        return requests.post(url, json=self.getReport())

    def genReport(self):
        self.report=SysReport()
        self.report.addSystemProcessInfo()

class SysReport:
    # Initializes instance attributes.
    def __init__(self):
        self.report_message = {}

    def getReport(self):
        return self.report_message

    def setSection(self, section, msg):
        self.report_message[section] = msg

    def getSection(self, section):
        return self.report_message[section]

    def printReport(self):
        print(json.dumps(self.report_message, indent=4, sort_keys=True))
       
    def addSystemProcessInfo(self):
        process_list = list()

        for proc in psutil.process_iter():
            process_info_dictionary = proc.as_dict(attrs=['name', 'pid'])
            process_list.append(process_info_dictionary)

        self.setSection("processes", process_list)
        