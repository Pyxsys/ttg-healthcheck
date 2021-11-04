import requests, psutil
import sys, os, json, re
import time
from datetime import datetime

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
        self.report.addDeviceUUID()
        self.report.addTimestamp()
        self.report.addSystemProcessInfo()

    def sleep(self):
        time.sleep(self.getConfig()['report_delay'])

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
            
            process_info_dictionary['cpu_percent'] = proc.cpu_percent(interval=0.1) / psutil.cpu_count()

            process_list.append(process_info_dictionary)

        self.setSection("processes", process_list)

    def addTimestamp(self):
        self.setSection("timestamp",datetime.now().isoformat())

    def addDeviceUUID(self):
        os_type = sys.platform.lower()
        pattern = '[a-zA-Z0-9]{8}(?:-[a-zA-Z0-9]{4}){3}-[a-zA-Z0-9]{12}'
        flags=re.MULTILINE

        if "win" in os_type:
            command = "wmic csproduct get uuid"
        elif "linux" in os_type:
            command = "sudo dmidecode -s system-uuid"

        extract=os.popen(command)
        uuid=re.findall(pattern, extract.read(), flags)[0]
        extract.close()

        self.setSection("deviceId", uuid)

def main(config):
    start=datetime.now()
    print("Starting new report routine at", start)
    runner=Runner(config)
    print("\tWriting report...")
    runner.genReport()
    print("\tSending report to server...")
    runner.sendReport()
    elapsed=datetime.now()-start
    print("Ending report routine. \nTime elapsed:", elapsed.total_seconds(), "sec")
    print("Process will now sleep...")
    runner.sleep()
    del runner


if __name__ == "__main__":
    main(sys.argv[1])