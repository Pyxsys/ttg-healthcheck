import sys, os
import psutil
import unittest
from unittest.mock import patch, MagicMock, mock_open
from psutil._common import scpufreq, snicaddr
from socket import AddressFamily

# Include src directory for imports
sys.path.append('../')
from daemon.src.system_report import SysReport


#Change return value for psutil.cpu_freq() incase of linux VM
#See https://github.com/giampaolo/psutil/pull/1493
cpufreqExistsAndHasNoContents =  len(os.listdir('/sys/devices/system/cpu/cpufreq/')) == 0 if os.path.isdir('/sys/devices/system/cpu/cpufreq/') else False
cpu0ExistsAndHasCpuFreq = os.path.exists('/sys/devices/system/cpu/cpu0/cpufreq') if os.path.isdir('/sys/devices/system/cpu0') else False

if psutil.LINUX & cpufreqExistsAndHasNoContents & (not cpu0ExistsAndHasCpuFreq):
    psutil.cpu_freq = MagicMock(return_value=scpufreq(current=1, min=1, max=1))
#endof Linux VM check

class TestSystemReportClass(unittest.TestCase):
    mock_dictionary={
        "names": {
            "John Doe" : {"age": 49},
            "Jane Doe" : {"age": 38},
            "Bill Dew" : {"age": 21}
        }
    }

    def setUp(self):
        self.test_report=SysReport()

    def tearDown(self):
        del self.test_report

    # Unit-Tests-----
    def testSysReportClassInitialization(self):
        self.assertIsInstance(self.test_report,SysReport, msg=None)

    def testSysReportInitialization(self):
        expected_result={}
        actual_result=self.test_report.get_report()
        self.assertEqual(expected_result, actual_result)

    def testAddingEmptySectionToReport(self):
        expected_result={"new_section": {}}
        self.test_report.set_section("new_section", {})
        actual_result=self.test_report.get_report()
        self.assertEqual(expected_result, actual_result)

    def testSettingSection(self):
        expected_result=self.mock_dictionary
        self.test_report.set_section("names", self.mock_dictionary["names"])
        actual_result=self.test_report.get_report()
        self.assertEqual(expected_result, actual_result)

    def testAddingProcessesToReport(self):
        expected_result='python.exe'
        self.test_report.add_system_process_info()

        process_list=self.test_report.get_section("processes")
        self.assertTrue(x.name == 'python.exe' for x in process_list)

    def testAddingTimestampToReport(self):
        self.test_report.add_timestamp()
        actual_result=self.test_report.get_section("timestamp")
        self.assertIsNotNone(actual_result)

    def testAddingDeviceIdToReport(self):
        self.test_report.add_device_uuid()
        actual_result=self.test_report.get_section("deviceId")
        self.assertRegex(actual_result,'^[a-zA-Z0-9]{8}(?:-[a-zA-Z0-9]{4}){3}-[a-zA-Z0-9]{12}$')

    def testAddingStaticMemoryInfoToReport(self):
        expected_result = ('maxSize', 'formFactor')

        self.test_report.add_startup_memory_info()
        section=self.test_report.get_section("memory_")
        actual_result = tuple(section)

        self.assertTupleEqual(actual_result, expected_result)

    def testAddingMemoryInfoToReport(self):
        expected_result = ('used', 'free', 'percent', 'available')

        self.test_report.add_memory_usage_info()
        section=self.test_report.get_section("memory")
        actual_result = tuple(section)

        self.assertCountEqual(actual_result, expected_result)

    def testFetchingTotalMemory(self):
        actual_result=SysReport.fetch_total_memory()
        self.assertGreater(actual_result, 0)

    def testFetchingMemoryFormFactorList(self):
        actual_result = SysReport.fetch_memory_form_factor()
        for x in actual_result:     #Ensure results are not empty
            self.assertTrue(x)

    def testAddingStaticDiskInfo(self):
        expected_result = ('capacity', 'physical_disk')

        self.test_report.add_startup_disk_info()
        section=self.test_report.get_section("disk_")
        actual_result = tuple(section)

        self.assertTupleEqual(actual_result, expected_result)

    def testFetchingPhysicalDiskList(self):
        disk_sub_categories = ('model', 'size', 'media')
        actual_list = SysReport.fetch_physical_disks()

        for x in actual_list:
            actual_result=tuple(x)
            self.assertTupleEqual(actual_result, disk_sub_categories)

    def testFetchingTotalDiskCapacity(self):
        actual_result=SysReport.fetch_total_disk_capacity()
        self.assertGreater(actual_result, 100)

    def testAddingDiskUsageInfo(self):
        expected_result = ( 'physical_disk_io', 'partitions' )

        self.test_report.add_disk_usage_info()
        section = self.test_report.get_section("disk")
        actual_result = tuple(section)

        self.assertTupleEqual(actual_result, expected_result)

    def testFetchingDiskIO(self):
        expected_attributes={'read_bytes', 'read_count', 'read_time', 'write_bytes', 'write_count', 'write_time'}
        missing_attributes=[]

        disk_io = SysReport.fetch_physical_disk_io()
        for item in disk_io:
            attribute_list = disk_io[item].keys()

            for attribute in expected_attributes:
                if attribute not in attribute_list:
                    missing_attributes.append(attribute)
            self.assertEqual(len(missing_attributes), 0, msg=missing_attributes)

    def testFetchingPartition(self):
        expected_attributes={'total', 'free', 'used', 'percent'}
        missing_attributes=[]

        partitions = SysReport.fetch_disk_partition_status()
        for item in partitions:
            attribute_list = partitions[item].keys()

            for attribute in expected_attributes:
                if attribute not in attribute_list:
                    missing_attributes.append(attribute)
            self.assertEqual(len(missing_attributes), 0, msg=missing_attributes)

    def testAddingStaticCPUInfo(self):
        expected_result = ( 'baseSpeed', 'sockets', 'processors', 'cores', 'cacheSizeL1', 'cacheSizeL2', 'cacheSizeL3' )

        self.test_report.add_startup_cpu_info()
        section = self.test_report.get_section("cpu_")
        actual_result = tuple(section)

        self.assertTupleEqual(actual_result, expected_result)

    def testFetchingL1Cache(self):
        actual_result = SysReport.fetch_cpu_l1_cache(cores=psutil.cpu_count(logical=False))
        self.assertGreaterEqual(int(actual_result), 0)

    def testFetchingL2Cache(self):
        actual_result = SysReport.fetch_cpu_l2_cache()
        self.assertGreaterEqual(int(actual_result), 0)

    def testFetchingL3Cache(self):
        actual_result = SysReport.fetch_cpu_l3_cache()
        self.assertGreaterEqual(int(actual_result), 0)

    def testFetchingCPUSockets(self):
        actual_result=SysReport.fetch_cpu_sockets()
        self.assertGreaterEqual(actual_result,1)

    def testFetchingAdapterName(self):
        mockdict = dict()
        expected_result = 'target_adapter'

        mockdict['wlan0'] = [
                snicaddr(family=psutil.AF_LINK, address='FE-ED-FE-ED-11-11', netmask=None, broadcast=None, ptp=None), 
                snicaddr(family=AddressFamily.AF_INET, address='9.99.0.999', netmask='255.255.0.0', broadcast=None, ptp=None), 
                snicaddr(family=AddressFamily.AF_INET6, address='feed::fade:1111:face:1111', netmask=None, broadcast=None, ptp=None)
                ]
        mockdict['Wi-Fi'] = [
                snicaddr(family=psutil.AF_LINK, address='FE-ED-FE-ED-11-11', netmask=None, broadcast=None, ptp=None), 
                snicaddr(family=AddressFamily.AF_INET, address='9.99.0.999', netmask='255.255.0.0', broadcast=None, ptp=None), 
                snicaddr(family=AddressFamily.AF_INET6, address='feed::fade:1111:face:1111', netmask=None, broadcast=None, ptp=None)
                ]
        mockdict[expected_result] = [
                snicaddr(family=psutil.AF_LINK, address='FE-ED-FE-ED-11-11', netmask=None, broadcast=None, ptp=None), 
                snicaddr(family=AddressFamily.AF_INET, address='9.99.0.999', netmask='255.255.0.0', broadcast=None, ptp=None), 
                snicaddr(family=AddressFamily.AF_INET6, address='feed::fade:1111:face:1111', netmask=None, broadcast=None, ptp=None)
                ]

        psutil.net_if_addrs = MagicMock(return_value = mockdict)
        actual_result = SysReport.fetch_net_adapter_addrs(expected_result).get('adapterName')

        self.assertEquals(actual_result, expected_result)

    def testFetchingIpv4Address(self):
        actual_result=SysReport.fetch_net_adapter_addrs(None).get('ipv4')
        ipv4_pattern = '(?:\d{1,3}\.){3}\d{1,3}'

        self.assertRegex(actual_result, ipv4_pattern)

    def testFetchingIpv6Address(self):
        actual_result=SysReport.fetch_net_adapter_addrs(None).get('ipv6')
        ipv6_pattern = '(?:(?:\d|[a-f]){0,4}:){5}(?:\d|[a-f]){0,4}'

        self.assertRegex(actual_result.lower(), ipv6_pattern)

    def testFetchingMacAddress(self):
        actual_result=SysReport.fetch_net_adapter_addrs(None).get('mac')
        mac_pattern = '[0-9a-f]{2}([-:]?)[0-9a-f]{2}(\\1[0-9a-f]{2}){4}$'

        self.assertRegex(actual_result.lower(), mac_pattern)

    def testFetchingAdapterNetworkInfoWIN(self):
        
        MOCK_ADAPTER_TERMINAL_OUTPUT='There is 1 interface on the system:\n\n    Name                   : Wi-Fly\n    Description            : foobar 999MHz\n    GUID                   : ace11ace-ace1-ace1-ace1-aceaceaceace\n    Physical address       : aa:aa:aa:aa:aa:aa\n    State                  : connected\n    SSID                   : TARGET_WIFI_SSID\n    BSSID                  : bb:bb:bb:b:bb:bb\n    Network type           : Infrastructure\n    Radio type             : 802.11ac\n    Authentication         : WPA2-Personal\n    Cipher                 : CCMP\n    Connection mode        : Auto Connect\n    Channel                : 000\n    Receive rate (Mbps)    : 999\n    Transmit rate (Mbps)   : 999\n    Signal                 : 81%\n    Profile                : TARGET_WIFI_SSID\n\n    Hosted network status  : Not available'

        psutil.WINDOWS = MagicMock(return_value = True)
        psutil.LINUX = MagicMock(return_value = False)

        with patch('os.popen', new=mock_open(read_data = MOCK_ADAPTER_TERMINAL_OUTPUT)):
            actual_result = SysReport.fetch_net_wan_adapter_info('Wi-Fly')

        expected_result = {
            "SSID": 'TARGET_WIFI_SSID', 
            "connectionType": '802.11ac'
            }
        
        self.assertDictEqual(actual_result, expected_result)

    def testFetchingAdapterNetworkInfoLUX(self):
        MOCK_ADAPTER_TERMINAL_OUTPUT='wlan0     IEEE 802.11ac  ESSID:"TARGET_WIFI_SSID"  \n          Mode:Managed  Frequency:2.437 GHz  Access Point: 20:AA:4B:A3:63:39   \n          Bit Rate=54 Mb/s   Tx-Power=14 dBm   \n          Retry short limit:7   RTS thr:off   Fragment thr:off\n          Power Management:on\n          Link Quality=67/70  Signal level=-43 dBm  \n          Rx invalid nwid:0  Rx invalid crypt:0  Rx invalid frag:0\n          Tx excessive retries:0  Invalid misc:218   Missed beacon:0'

        psutil.WINDOWS = MagicMock(return_value = False)
        psutil.LINUX = MagicMock(return_value = True)

        with patch('os.popen', new=mock_open(read_data = MOCK_ADAPTER_TERMINAL_OUTPUT)):
            actual_result = SysReport.fetch_net_wan_adapter_info()

        expected_result = {
            "SSID": 'TARGET_WIFI_SSID', 
            "connectionType": '802.11ac'
            }
        
        self.assertDictEqual(actual_result, expected_result)

    def testAddingStaticNetworkInfo(self):
        expected_result = ('adapterName', 'SSID', 'connectionType', 'ipv4Address', 'ipv6Address', 'macAdress')

        SysReport.fetch_net_wan_adapter_info = MagicMock(
            return_value = {
                'SSID': 'TARGET_WIFI_SSID',
                'connectionType': '802.11ac'
                })

        SysReport.fetch_net_adapter_addrs = MagicMock(
            return_value = {
                'adapterName': 'target_adapter', 
                'ipv6': 'feed::fade:1111:face:1111',
                'ipv4': '9.99.0.999',
                'mac': 'FE-ED-FE-ED-11-11'
                })

        self.test_report.add_startup_network_info()
        section=self.test_report.get_section('wifi_')
        actual_result = tuple(section)

        self.assertTupleEqual(actual_result, expected_result)

if __name__ == '__main__':
    unittest.main()