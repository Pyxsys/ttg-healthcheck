import psutil
import json

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
        