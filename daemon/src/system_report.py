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
        self.report.add_memory_usage_info()
        self.report.add_system_network_usage()

    #produces startup device report
    def gen_startup_report(self):
        self.init_report()
        self.report.add_startup_memory_info()
        self.report.add_startup_disk_info()

    def sleep(self):
        time.sleep(self.get_config()['report_delay'])

    def send_initial_device_report(self):
        start=datetime.now()
        print("Starting new device report startup routine at", start)
        print("\tWriting startup report...")
        self.gen_startup_report()
        print("\tSending startup report to server...")
        self.send_report('/device')
        elapsed=datetime.now()-start
        print("Ending startup report routine. \nTime elapsed:", elapsed.total_seconds(), "sec")

    def send_recurring_device_report(self):
        start=datetime.now()
        print("Starting new report routine at", start)
        print("\tWriting report...")
        self.gen_report()
        print("\tSending report to server...")
        self.send_report()
        elapsed=datetime.now()-start
        print("Ending report routine. \nTime elapsed:", elapsed.total_seconds(), "sec")
        print("Process will now sleep...")
        self.sleep()

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
            try:
                process_info_dictionary = proc.as_dict(attrs=['name', 'pid', 'status'])
                process_info_dictionary['cpu_percent']      = round(proc.cpu_percent() / psutil.cpu_count(), 7)
                process_info_dictionary['memory_percent']   = round(proc.memory_percent(), 7)
                process_info_dictionary['rss'] = proc.memory_info()[0]
                process_info_dictionary['vms'] = proc.memory_info()[1]

                process_list.append(process_info_dictionary)
            except psutil.NoSuchProcess:
                continue

        self.set_section("processes", process_list)

    def add_system_network_usage(self):
        network_info = psutil.net_io_counters()
        #in MB per second
        megabytes_sent = network_info[0]/(1024*1024)
        megabytes_recv = network_info[1]/(1024*1024)
        #send as tuple
        self.set_section("network", (megabytes_sent, megabytes_recv))

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

        self.set_section("deviceId", uuid.upper())

    def add_startup_memory_info(self):
        memory_dictionary = dict()
        memory_dictionary["maxSize"] = SysReport.fetch_total_memory()
        memory_dictionary["formFactor"] = SysReport.fetch_memory_form_factor()
        self.set_section("memory_", memory_dictionary)

    def add_memory_usage_info(self):
        tmp_dict = psutil.virtual_memory()._asdict()
        memory_dictionary = {key: tmp_dict[key] for key in tmp_dict.keys() & {'available', 'used', 'free', 'percent'}}

        self.set_section("memory", memory_dictionary)

    def add_startup_disk_info(self):
        disk_dictionary = dict()
        disk_dictionary["capacity"] = SysReport.fetch_total_disk_capacity()
        disk_dictionary["physical_disk"] = SysReport.fetch_physical_disks()
        self.set_section("disk_", disk_dictionary)

    @classmethod
    def fetch_total_memory(cls):
        return psutil.virtual_memory().total

    @classmethod
    def fetch_memory_form_factor(cls):
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

    @classmethod
    def fetch_physical_disks(cls):
        pd_list = list()
        flags = re.MULTILINE

        if psutil.WINDOWS:
            command="wmic diskdrive get model,size"
            pattern=".+\s{2}\d+\n?"

            extract=os.popen(command)
            buffer=re.findall(pattern, extract.read(), flags)
            extract.close()

            pattern="(^.+)\s{2}(\d+)"

            for m in buffer:
                temp_dict=dict()
                groups=re.match(pattern, m)
                temp_dict["model"]=groups.groups()[0]
                temp_dict["size"]=groups.groups()[1]

                command="Powershell.exe -Command \"Get-PhysicalDisk | Where-Object -Property FriendlyName -eq '%s'\"" % (temp_dict["model"])

                extract=os.popen(command)
                ps_buffer=re.findall(r'(unspecified|HDD|SSD|SCM)', extract.read(), flags)
                extract.close()

                temp_dict["media"]=ps_buffer[0]

                pd_list.append(temp_dict)

        elif psutil.LINUX:
            command="sudo fdisk -l"
            pattern="^(?:Disk )/(?:\S+/)+(\S+):(?:.*)\ (\d+)\ bytes.+\n^Disk model:\ (.*)(?:\s{2,})\n"

            extract=os.popen(command)
            buffer=re.findall(pattern, extract.read(), flags)
            extract.close()

            pattern=""
            rota_map = { "0":"SSD", "1":"HDD" }

            for m in buffer:
                temp_dict=dict()
                temp_dict["model"]=m[2]
                temp_dict["size"]=m[1]

                command="lsblk -d -o name,rota | grep %s" % (m[0])

                extract=os.popen(command)
                ps_buffer=re.findall(r'(0|1)$', extract.read(), flags)
                extract.close()

                temp_dict["media"]=rota_map[ps_buffer[0]]

                pd_list.append(temp_dict)

        return pd_list

    @classmethod
    def fetch_total_disk_capacity(cls):
        return psutil.disk_usage('/').total

def main(config, mode):
    runner=Runner(config)

    if mode == "0":
        runner.send_initial_device_report()
    elif mode == "1":
        runner.send_recurring_device_report()
    else:
        print("Invalid run mode \"", mode, "\".")

    del runner

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])