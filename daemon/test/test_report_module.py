import sys, os
import psutil
import unittest
from unittest.mock import  MagicMock, mock_open, patch
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

    @classmethod
    def getPSUTIL_NET_IF_ADDRS__MO(cls):
        # Constant-dictionary assigned to function due to unittest patching not
        # keeping mocks indpenedent when elements are popped. This causes subsequent tests
        # mocking the same dict to alos have those elements popped
        return {
        'wlan0' : [
            snicaddr(family=psutil.AF_LINK, address='FE-ED-FE-ED-11-11', netmask=None, broadcast=None, ptp=None), 
            snicaddr(family=AddressFamily.AF_INET, address='9.99.0.999', netmask='255.255.0.0', broadcast=None, ptp=None), 
            snicaddr(family=AddressFamily.AF_INET6, address='feed::fade:1111:face:1111', netmask=None, broadcast=None, ptp=None)
            ],
        'Wi-Fi' : [
            snicaddr(family=psutil.AF_LINK, address='FE-ED-FE-ED-00-00', netmask=None, broadcast=None, ptp=None), 
            snicaddr(family=AddressFamily.AF_INET, address='9.99.999.0', netmask='255.255.0.0', broadcast=None, ptp=None), 
            snicaddr(family=AddressFamily.AF_INET6, address='feed::fade:1111:1111:1111', netmask=None, broadcast=None, ptp=None)
            ]
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

    def testAddingStaticDiskInfo(self):
        expected_result = ('capacity', 'physical_disk')

        self.test_report.add_startup_disk_info()
        section=self.test_report.get_section("disk_")
        actual_result = tuple(section)

        self.assertTupleEqual(actual_result, expected_result)

    def testAddingDiskUsageInfo(self):
        expected_result = ( 'physical_disk_io', 'partitions' )

        self.test_report.add_disk_usage_info()
        section = self.test_report.get_section("disk")
        actual_result = tuple(section)

        self.assertTupleEqual(actual_result, expected_result)

    @patch('daemon.src.system_report.SysReport.fetch_net_wan_adapter_info', return_value = { 'SSID': 'mock_network_5GHz', 'connectionType': '802.11dd'})
    @patch('daemon.src.system_report.SysReport.fetch_net_adapter_addrs', return_value = { 'adapterName': 'target_adapter',  'ipv6': '1111::1111:1111:1111:1111', 'ipv4': '9.99.0.999', 'mac': 'FE-ED-FE-ED-11-11'})
    def testAddingStaticNetworkInfo(self, m1, m2):
        expected_result = ('adapterName', 'SSID', 'connectionType', 'ipv4Address', 'ipv6Address', 'macAdress')

        self.test_report.add_startup_network_info()
        section=self.test_report.get_section('wifi_')
        actual_result = tuple(section)

        self.assertTupleEqual(actual_result, expected_result)

if __name__ == '__main__':
    unittest.main()