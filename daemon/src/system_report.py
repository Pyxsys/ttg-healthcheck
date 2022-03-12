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
        self.report.add_disk_usage_info()

    #produces startup device report
    def gen_startup_report(self):
        self.init_report()
        self.report.add_startup_memory_info()
        self.report.add_startup_disk_info()
        self.report.add_startup_cpu_info()
        self.report.add_startup_network_info()

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
        for proc in SysScrubber.fetch_all_processes():
            proc.cpu_percent()
            process_buffer.append(proc)

        time.sleep(0.1)

        for proc in process_buffer:
            process_info_dictionary = proc.as_dict(attrs=['name', 'pid', 'status'])
            process_info_dictionary['cpu_percent']      = round(proc.cpu_percent() / SysScrubber.fetch_cpu_count(), 7)
            process_info_dictionary['memory_percent']   = round(proc.memory_percent(), 7)
            process_info_dictionary['rss'] = proc.memory_info()[0]
            process_info_dictionary['vms'] = proc.memory_info()[1]
            process_list.append(process_info_dictionary)

        self.set_section("processes", process_list)

    def add_system_network_usage(self):
        network_info = SysScrubber.fetch_net_io_counters()
        #in MB per second
        megabytes_sent = network_info[0]/(1024*1024)
        megabytes_recv = network_info[1]/(1024*1024)
        #signal strength
        signal_strength = SysScrubber.fetch_network_strength()
        #send as tuple
        self.set_section("network", (megabytes_sent, megabytes_recv, signal_strength))

    def add_timestamp(self):
        self.set_section("timestamp",datetime.now().isoformat())

    def add_device_uuid(self):
        uuid=SysScrubber.fetch_device_uuid()
        self.set_section("deviceId", uuid)

    def add_startup_memory_info(self):
        memory_dictionary = dict()
        memory_dictionary["maxSize"] = SysScrubber.fetch_total_memory()
        memory_dictionary["formFactor"] = SysScrubber.fetch_memory_form_factor()
        self.set_section("memory_", memory_dictionary)

    def add_memory_usage_info(self):
        tmp_dict = SysScrubber.fetch_virtual_memory()
        memory_dictionary = {key: tmp_dict[key] for key in tmp_dict.keys() & {'available', 'used', 'free', 'percent'}}

        self.set_section("memory", memory_dictionary)

    def add_startup_disk_info(self):
        disk_dictionary = dict()
        disk_dictionary["capacity"] = SysScrubber.fetch_total_disk_capacity()
        disk_dictionary["physical_disk"] = SysScrubber.fetch_physical_disks()
        self.set_section("disk_", disk_dictionary)

    def add_disk_usage_info(self):
        disk_usage=dict()
        disk_usage['physical_disk_io'] = SysScrubber.fetch_physical_disk_io()
        disk_usage['partitions'] = SysScrubber.fetch_disk_partition_status()
        self.set_section("disk", disk_usage)

    def add_startup_cpu_info(self):
        cpu_info = dict()
        cpu_info['baseSpeed'] = SysScrubber.fetch_cpu_freq()
        cpu_info['sockets'] = SysScrubber.fetch_cpu_sockets()
        cpu_info['processors'] = SysScrubber.fetch_cpu_count(logical=True)
        cpu_info['cores'] = SysScrubber.fetch_cpu_count(logical=False)
        cpu_info['cacheSizeL1'] = SysScrubber.fetch_cpu_l1_cache(cores=psutil.cpu_count(logical=False))
        cpu_info['cacheSizeL2'] = SysScrubber.fetch_cpu_l2_cache()
        cpu_info['cacheSizeL3'] = SysScrubber.fetch_cpu_l3_cache()

        self.set_section("cpu_", cpu_info)

    def add_startup_network_info(self, adapter_name = None):
        net_info = dict()

        ip = SysScrubber.fetch_net_adapter_addrs(adapter_name)
        ip_connection = SysScrubber.fetch_net_wan_adapter_info(adapter_name)

        net_info['adapterName'] = ip.get('adapterName')
        net_info['SSID'] = ip_connection.get('SSID')
        net_info['connectionType'] = ip_connection.get('connectionType')
        net_info['ipv4Address'] = ip.get('ipv4')
        net_info['ipv6Address'] = ip.get('ipv6')
        net_info['macAdress'] = ip.get('mac')

        self.set_section('wifi_', net_info)

class SysScrubber:
    # ----------------------
    # Constants
    # ----------------------
    _R_DIGIT_PATTERN = '(\d+)'

    # ----------------------
    # OS Determining Methods
    # ----------------------
    @classmethod
    def is_windows(cls):
        return psutil.WINDOWS

    @classmethod
    def is_linux(cls):
        return psutil.LINUX

    # ----------------------
    # General Methods
    # ----------------------
    @classmethod
    def fetch_device_uuid(cls):
        pattern = '[a-zA-Z0-9]{8}(?:-[a-zA-Z0-9]{4}){3}-[a-zA-Z0-9]{12}'
        flags=re.MULTILINE

        if SysScrubber.is_windows():
            command = "wmic csproduct get uuid"
        elif SysScrubber.is_linux():
            command = "lsblk -o UUID"

        extract=os.popen(command)
        uuid=re.findall(pattern, extract.read(), flags)[0]
        extract.close()

        return uuid.upper()

    # ---------------------
    # Process Fetch Methods
    # ---------------------
    @classmethod
    def fetch_all_processes(cls):
        return psutil.process_iter()

    # -----------------
    # CPU Fetch Methods
    # -----------------
    @classmethod
    def fetch_cpu_freq(cls):
        return psutil.cpu_freq().max

    @classmethod
    def fetch_cpu_count(cls, logical=True):
        return psutil.cpu_count(logical=logical)

    @classmethod
    def fetch_cpu_l1_cache(cls, cores = None):
        l1_size = 0

        if SysScrubber.is_windows():
            command='wmic os get osarchitecture | findstr /r "[0-9][0-9]"'
            pattern=cls._R_DIGIT_PATTERN

            if cores == None:
                cores = 1   #minimum 1 core must be given for windows OS

        elif SysScrubber.is_linux():
            command='getconf -a | grep LEVEL1_ICACHE_SIZE'
            pattern='(?:LEVEL1_ICACHE_SIZE\s+(\d+))'

        else:
            return 0

        extract=os.popen(command)
        buffer=re.findall(pattern, extract.read(),  re.MULTILINE)
        extract.close()

        if SysScrubber.is_windows():
            l1_size = cores * int(buffer[0])
        else:
            l1_size = int(buffer[0])

        return l1_size

    @classmethod
    def fetch_cpu_l2_cache(cls):
        if SysScrubber.is_windows():
            command='wmic cpu get L2CacheSize | findstr /r "[0-9][0-9]"'
            pattern=cls._R_DIGIT_PATTERN

        elif SysScrubber.is_linux():
            command='getconf -a | grep CACHE_SIZE'
            pattern='(?:LEVEL2_\S?CACHE_SIZE\s+(\d+))'

        else:
            return 0

        extract=os.popen(command)
        buffer=re.findall(pattern, extract.read(),  re.MULTILINE)
        extract.close()

        return int(buffer[0])

    @classmethod
    def fetch_cpu_l3_cache(cls):
        if SysScrubber.is_windows():
            command='wmic cpu get L3CacheSize | findstr /r "[0-9][0-9]"'
            pattern=cls._R_DIGIT_PATTERN

        elif SysScrubber.is_linux():
            command='getconf -a | grep CACHE_SIZE'
            pattern='(?:LEVEL3_\S?CACHE_SIZE\s+(\d+))'

        else:
            return 0

        extract=os.popen(command)
        buffer=re.findall(pattern, extract.read(), re.MULTILINE)
        extract.close()

        return int(buffer[0])

    @classmethod
    def fetch_cpu_sockets(cls):
        if SysScrubber.is_windows():
            command='powershell.exe -Command "@(Get-CimInstance -ClassName Win32_Processor).Count"'
            pattern=cls._R_DIGIT_PATTERN

        elif SysScrubber.is_linux():
            command='lscpu | egrep Socket'
            pattern='(?:Socket\(s\):\s+(\d+))'

        else:
            return 0

        extract=os.popen(command)
        buffer=re.findall(pattern, extract.read(), re.MULTILINE)
        extract.close()

        return int(buffer[0])

    # --------------------
    # Memory Fetch Methods
    # --------------------
    @classmethod
    def fetch_virtual_memory(cls):
        return psutil.virtual_memory()._asdict()

    @classmethod
    def fetch_total_memory(cls):
        return psutil.virtual_memory().total

    @classmethod
    def fetch_memory_form_factor(cls):
        flags = re.MULTILINE
        ff_list = list()

        if SysScrubber.is_windows():
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
        elif SysScrubber.is_linux():
            command = "sudo dmidecode memory | grep 'Form Factor'"
            pattern = 'Form Factor: (.+)'

        extract=os.popen(command)
        form_factors=re.findall(pattern, extract.read(), flags)
        extract.close()

        if not form_factors:
            ff_list.append("Unknown")
            return ff_list

        for x in form_factors:
            if SysScrubber.is_windows():
                ff_list.append(decoder[x])
            elif SysScrubber.is_linux():
                ff_list.append(x)

        return ff_list

    # ------------------
    # Disk Fetch Methods
    # ------------------
    @classmethod
    def fetch_physical_disks(cls):
        pd_list = list()
        flags = re.MULTILINE

        if SysScrubber.is_windows():
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

        elif SysScrubber.is_linux():
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
                ps_buffer=re.findall(r'([01])$', extract.read(), flags)
                extract.close()

                temp_dict["media"]=rota_map[ps_buffer[0]]

                pd_list.append(temp_dict)

        return pd_list

    @classmethod
    def fetch_total_disk_capacity(cls):
        return psutil.disk_usage('/').total

    @classmethod
    def fetch_physical_disk_io(cls):
        disk_dict = dict()

        disk_io_buffer = psutil.disk_io_counters(perdisk=True)

        for disk_io in disk_io_buffer:
            disk_subdict = dict()

            disk_subdict['read_count'] = disk_io_buffer[disk_io][0]
            disk_subdict['read_bytes'] = disk_io_buffer[disk_io][1]
            disk_subdict['read_time'] = disk_io_buffer[disk_io][2]
            disk_subdict['write_count'] = disk_io_buffer[disk_io][3]
            disk_subdict['write_bytes'] = disk_io_buffer[disk_io][4]
            disk_subdict['write_time'] = disk_io_buffer[disk_io][5]

            disk_dict[disk_io] = disk_subdict

        return disk_dict

    @classmethod
    def fetch_disk_partition_status(cls):
        disk_dict = dict()

        for partition_path in psutil.disk_partitions():
            disk_subdict = dict()
            disk_buffer = psutil.disk_usage(partition_path.device)

            disk_subdict['total'] = disk_buffer.total
            disk_subdict['used'] = disk_buffer.used
            disk_subdict['free'] = disk_buffer.free
            disk_subdict['percent'] = disk_buffer.percent

            disk_dict[partition_path.device] = disk_subdict

        return disk_dict

    # ---------------------
    # Network Fetch Methods
    # ---------------------
    @classmethod
    def fetch_net_io_counters(cls):
        return psutil.net_io_counters()

    @classmethod
    def fetch_network_strength(cls):
        net_strength = 'Unknown'

        if SysScrubber.is_windows():
            command = "netsh wlan show interfaces"
            pattern = "^\s+Signal\s+:\s+[0-9]+"
        elif SysScrubber.is_linux():
            command = "sudo iw dev wlan0 scan"
            pattern = "^\s+signal:\s+-*[0-9]+"

        extract=os.popen(command)
        str_buffer=re.findall(pattern, extract.read(), re.MULTILINE)
        extract.close()
        str_as_num = re.findall(r"[-+]?(?:\d*\.\d+|\d+)", str_buffer[0])

        if SysScrubber.is_windows():
            str_as_float = float(str_as_num[0])
            if str_as_float > 80:
                net_strength = 'Strong'
            elif str_as_float > 50:
                net_strength = 'Medium'
            else:
                net_strength = 'Weak'
        elif SysScrubber.is_linux():
            str_as_float = float(str_as_num[0])
            if str_as_float > -20:
                net_strength = 'Strong'
            elif str_as_float > -50:
                net_strength = 'Medium'
            else:
                net_strength = 'Weak'

        return net_strength

    @classmethod
    def fetch_net_wan_adapter_info(cls, adapter_name = None):
        output = dict()
        #assign default values if there is no wifi found
        output['SSID'] = 'NOT AVAILABLE'
        output['connectionType'] = 'NOT AVAILABLE'

        if SysScrubber.is_windows():
            adapter = adapter_name if adapter_name is not None else 'Wi-Fi'
            command = 'netsh wlan show interfaces'
            pattern = "(?:Name\s+:\s" + re.escape(adapter) + "(?:\\n.+){5}SSID\s+:\s(.+)(?:\\n.+){3}Radio\stype.+:\s(.+)(?:\\n.+){7}Signal\s+: (\d{,2}))"

            extract = os.popen(command)
            buffer = re.findall(pattern, extract.read(), re.MULTILINE)
            extract.close()

            if len(buffer) > 0:
                output['SSID'] = buffer[0][0]
                output['connectionType'] = buffer[0][1]

        if SysScrubber.is_linux():
            adapter = adapter_name if adapter_name is not None else 'wlan0'
            command = 'iwconfig ' + adapter
            pattern = "(?:\S+ +IEEE (\S+)  ESSID:\"(\S+)\".+\n)"

            extract = os.popen(command)
            buffer = re.findall(pattern, extract.read(), re.MULTILINE)
            extract.close()

            if len(buffer) > 0:
                output['SSID'] = buffer[0][1]
                output['connectionType'] = buffer[0][0]

        return output

    @classmethod
    def fetch_net_adapter_addrs(cls, adapter_name = None):
        addresses = psutil.net_if_addrs()
        ips=dict()

        #default OS name for adapters
        if SysScrubber.is_windows():
            os_net_pattern={'wifi': 'Wi-Fi', 'ethernet': 'Ethernet'}
        elif SysScrubber.is_linux():
            os_net_pattern={'wifi': 'wlan0', 'ethernet': 'eth0'}


        if adapter_name in addresses:
            found_adapter = adapter_name
            buffer = addresses.get(adapter_name)

        elif os_net_pattern['wifi'] in addresses:           #prioritize Wi-fi over Ethernet
            found_adapter = os_net_pattern['wifi']
            buffer = addresses.get(os_net_pattern['wifi'])

        elif os_net_pattern['ethernet'] in addresses:
            found_adapter = os_net_pattern['ethernet']
            buffer = addresses.get(os_net_pattern['ethernet'])

        ips['adapterName'] = found_adapter
        ips['ipv6'] = buffer.pop().address
        ips['ipv4'] = buffer.pop().address
        ips['mac'] = buffer.pop().address

        return ips

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