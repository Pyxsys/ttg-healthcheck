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

    def send_report(self, path=''):
        url = self.get_config()['destination'] + Runner.api_endpoint + path
        return requests.post(url, json=self.get_report())

    def init_report(self):
        self.report=SysReport()
        self.report.add_device_uuid()
        self.report.add_timestamp()
    
    #produces recurring report 
    def gen_report(self):
        self.init_report()
        self.report.add_system_process_info()
    
    #produces startup device report
    def gen_startup_report(self):
        self.init_report()
        self.report.add_startup_memory_info()

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
        process_buffer = list()

        #Initialize start time for process diagnostic scan
        for proc in psutil.process_iter():
            proc.cpu_percent()
            process_buffer.append(proc)

        time.sleep(0.1)

        for proc in process_buffer:
            process_info_dictionary = proc.as_dict(attrs=['name', 'pid', 'status'])
            process_info_dictionary['cpu_percent'] = proc.cpu_percent() / psutil.cpu_count()
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

    def add_startup_memory_info(self):
        memory_dictionary = dict()
        memory_dictionary["total"] = SysReport.fetch_memory_form_factor()
        memory_dictionary["form_factors"] = SysReport.fetch_memory_form_factor()
        self.set_section("memory_", memory_dictionary)

    def fetch_total_memory():
        return psutil.virtual_memory().total

    def fetch_memory_form_factor():
        os_type = sys.platform.lower()
        flags = re.MULTILINE
        ff_list = list()

        if "win" in os_type:
            command = "wmic memorychip get formfactor"
            pattern = '([0-9]{1,2})'
            decoder = {
                "0": "Unknown",
                "1": "Other",
                "2": "SIP",
                "3": "DIP",
                "4": "ZIP",
                "5": "SOJ",
                "6": "Proprietary",
                "7": "SIMM",
                "8": "DIMM",
                "9": "TSOP",
                "10": "PGA",
                "11": "RIMM",
                "12": "SODIMM",
                "13": "SRIMM",
                "14": "SMD",
                "15": "SSMP",
                "16": "QFP",
                "17": "TQFP",
                "18": "SOIC",
                "19": "LCC",
                "20": "PLCC",
                "21": "BGA",
                "22": "FPBGA",
                "23": "LGA",
                "24": "FB-DIMM"
            }
        elif "linux" in os_type:
            command = "sudo dmidecode -t memory | grep -i speed "
            pattern = 'Form Factor: (.+)'

        extract=os.popen(command)
        form_factors=re.findall(pattern, extract.read(), flags)
        extract.close()

        if not form_factors:
            ff_list.append("Unknown")
            return ff_list

        for x in form_factors:
            if "win" in os_type: 
                ff_list.append(decoder[x])
            elif "linux" in os_type: 
                ff_list.append(x[13::]) if not x.strip() else ff_list.append("Unkown")

        return ff_list

def send_initial_device_report(config):
    start=datetime.now()
    print("Starting new device report startup routine at", start)
    runner=Runner(config)
    print("\tWriting startup report...")
    runner.gen_startup_report()
    print("\tSending startup report to server...")
    runner.send_report('/device')
    elapsed=datetime.now()-start
    print("Ending startup report routine. \nTime elapsed:", elapsed.total_seconds(), "sec")
    del runner

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