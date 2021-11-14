import requests, psutil
import sys, os, json, re
import time
from datetime import datetime

class Runner:

    api_endpoint='api/daemon'

    # Initializes instance attributes.
    def __init__(self, path):
        with open(path, "r") as config_file:
            self.configs = json.load(config_file)

    def get_config(self):
        return self.configs

    def get_report(self):
        return self.report.report_message

    def send_report(self):
        url = self.get_config()['destination'] + self.api_endpoint
        return requests.post(url, json=self.get_report())

    def gen_report(self):
        self.report=SysReport()
        self.report.add_device_uuid()
        self.report.add_timestamp()
        self.report.add_system_process_info()

    def sleep(self):
        time.sleep(self.get_config()['report_delay'])

class SysReport:
    # Initializes instance attributes.
    def __init__(self):
        self.report_message = {}

    def get_report(self):
        return self.report_message

    def set_section(self, section, msg):
        self.report_message[section] = msg

    def get_section(self, section):
        return self.report_message[section]

    def print_report(self):
        print(json.dumps(self.report_message, indent=4, sort_keys=True))

    def add_system_process_info(self):
        process_list = list()

        for proc in psutil.process_iter():

            process_info_dictionary = proc.as_dict(attrs=['name', 'pid', 'status'])
            
            process_info_dictionary['cpu_percent'] = proc.cpu_percent(interval=0.1) / psutil.cpu_count()

            process_list.append(process_info_dictionary)

        self.set_section("processes", process_list)

    def add_timestamp(self):
        self.set_section("timestamp",datetime.now().isoformat())

    def add_device_uuid(self):
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

        self.set_section("deviceId", uuid)

def main(config):
    start=datetime.now()
    print("Starting new report routine at", start)
    runner=Runner(config)
    print("\tWriting report...")
    runner.gen_report()
    print("\tSending report to server...")
    runner.send_report()
    elapsed=datetime.now()-start
    print("Ending report routine. \nTime elapsed:", elapsed.total_seconds(), "sec")
    print("Process will now sleep...")
    runner.sleep()
    del runner


if __name__ == "__main__":
    main(sys.argv[1])