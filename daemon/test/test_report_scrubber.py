import sys, os
import psutil
import unittest
from unittest.mock import  MagicMock, mock_open, patch
from psutil._common import scpufreq, snicaddr
from socket import AddressFamily

# Include src directory for imports
sys.path.append('../')
from daemon.src.system_report import SysReport


class TestSystemScrubberCPU(unittest.TestCase):
    
    def setUp(self):
        self.test_report=SysReport()

    def tearDown(self):
        del self.test_report

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

class TestSystemScrubberMemory(unittest.TestCase):

    def setUp(self):
        self.test_report=SysReport()

    def tearDown(self):
        del self.test_report
        
    def testFetchingTotalMemory(self):
        actual_result=SysReport.fetch_total_memory()
        self.assertGreater(actual_result, 0)

    def testFetchingMemoryFormFactorList(self):
        actual_result = SysReport.fetch_memory_form_factor()
        for x in actual_result:     #Ensure results are not empty
            self.assertTrue(x)

class TestSystemScrubberDisk(unittest.TestCase):
    
    def setUp(self):
        self.test_report=SysReport()

    def tearDown(self):
        del self.test_report

    def testFetchingTotalDiskCapacity(self):
        actual_result=SysReport.fetch_total_disk_capacity()
        self.assertGreater(actual_result, 100)

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

    def testFetchingPhysicalDiskList(self):
        disk_sub_categories = ('model', 'size', 'media')
        actual_list = SysReport.fetch_physical_disks()

        for x in actual_list:
            actual_result=tuple(x)
            self.assertTupleEqual(actual_result, disk_sub_categories)

    def testAddingStaticCPUInfo(self):
        expected_result = ( 'baseSpeed', 'sockets', 'processors', 'cores', 'cacheSizeL1', 'cacheSizeL2', 'cacheSizeL3' )

        self.test_report.add_startup_cpu_info()
        section = self.test_report.get_section("cpu_")
        actual_result = tuple(section)

        self.assertTupleEqual(actual_result, expected_result)

class TestSystemScrubberProcess(unittest.TestCase):

    def setUp(self):
        self.test_report=SysReport()

    def tearDown(self):
        del self.test_report

    def testAddingProcessesToReport(self):
        expected_result='python.exe'
        self.test_report.add_system_process_info()

        process_list=self.test_report.get_section("processes")
        self.assertTrue(x.name == 'python.exe' for x in process_list)

class TestSystemScrubberWifi(unittest.TestCase):

    @classmethod
    def getPSUTIL_NET_IF_ADDRS__MO(cls):
        # Constant-dictionary assigned to function due to unittest patching not
        # keeping mocks indpendent when elements are popped. This causes subsequent tests
        # mocking the same dict to also have those elements popped
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
        
    def testFetchingAdapterName(self):
        expected_result = 'wlan0'
        with patch('psutil.net_if_addrs', return_value = self.getPSUTIL_NET_IF_ADDRS__MO()):
            actual_result = SysReport.fetch_net_adapter_addrs(expected_result).get('adapterName')

        self.assertEqual(actual_result, expected_result)

    def testFetchingIpv4Address(self):
        ipv4_pattern = '(?:\d{1,3}\.){3}\d{1,3}'
        with patch('psutil.net_if_addrs', return_value = self.getPSUTIL_NET_IF_ADDRS__MO()):
            actual_result=SysReport.fetch_net_adapter_addrs(None).get('ipv4')

        self.assertRegex(actual_result, ipv4_pattern)

    def testFetchingIpv6Address(self):
        ipv6_pattern = '(?:(?:\d|[a-f]){0,4}:){5}(?:\d|[a-f]){0,4}' 
        with patch('psutil.net_if_addrs', return_value = self.getPSUTIL_NET_IF_ADDRS__MO()):
            actual_result=SysReport.fetch_net_adapter_addrs(None).get('ipv6')

        self.assertRegex(actual_result.lower(), ipv6_pattern)

    def testFetchingMacAddress(self):
        mac_pattern = '[0-9a-f]{2}([-:]?)[0-9a-f]{2}(\\1[0-9a-f]{2}){4}$'
        with patch('psutil.net_if_addrs', return_value = self.getPSUTIL_NET_IF_ADDRS__MO()):
            actual_result=SysReport.fetch_net_adapter_addrs(None).get('mac')

        self.assertRegex(actual_result.lower(), mac_pattern)

    @patch('daemon.src.system_report.SysReport.is_windows', return_value=True)
    @patch('daemon.src.system_report.SysReport.is_linux', return_value=False)
    def testFetchingAdapterNetworkInfoWIN(self, m1, m2):
        
        MOCK_ADAPTER_TERMINAL_OUTPUT='There is 1 interface on the system:\n\n    Name                   : Wi-Fly\n    Description            : foobar 999MHz\n    GUID                   : ace11ace-ace1-ace1-ace1-aceaceaceace\n    Physical address       : aa:aa:aa:aa:aa:aa\n    State                  : connected\n    SSID                   : TARGET_WIFI_SSID\n    BSSID                  : bb:bb:bb:b:bb:bb\n    Network type           : Infrastructure\n    Radio type             : 802.11ac\n    Authentication         : WPA2-Personal\n    Cipher                 : CCMP\n    Connection mode        : Auto Connect\n    Channel                : 000\n    Receive rate (Mbps)    : 999\n    Transmit rate (Mbps)   : 999\n    Signal                 : 81%\n    Profile                : TARGET_WIFI_SSID\n\n    Hosted network status  : Not available'
        with patch('os.popen', new=mock_open(read_data = MOCK_ADAPTER_TERMINAL_OUTPUT)):
            actual_result = SysReport.fetch_net_wan_adapter_info('Wi-Fly')

        expected_result = {
            "SSID": 'TARGET_WIFI_SSID', 
            "connectionType": '802.11ac'
            }
        
        self.assertDictEqual(actual_result, expected_result)

    
    @patch('daemon.src.system_report.SysReport.is_windows', return_value=False)
    @patch('daemon.src.system_report.SysReport.is_linux', return_value=True)
    def testFetchingAdapterNetworkInfoLUX(self, m1, m2):
        MOCK_ADAPTER_TERMINAL_OUTPUT='wlan0     IEEE 802.11ac  ESSID:"TARGET_WIFI_SSID"  \n          Mode:Managed  Frequency:2.437 GHz  Access Point: 20:AA:4B:A3:63:39   \n          Bit Rate=54 Mb/s   Tx-Power=14 dBm   \n          Retry short limit:7   RTS thr:off   Fragment thr:off\n          Power Management:on\n          Link Quality=67/70  Signal level=-43 dBm  \n          Rx invalid nwid:0  Rx invalid crypt:0  Rx invalid frag:0\n          Tx excessive retries:0  Invalid misc:218   Missed beacon:0'
        with patch('os.popen', new=mock_open(read_data = MOCK_ADAPTER_TERMINAL_OUTPUT)):
            actual_result = SysReport.fetch_net_wan_adapter_info()

        expected_result = {
            "SSID": 'TARGET_WIFI_SSID', 
            "connectionType": '802.11ac'
            }
        
        self.assertDictEqual(actual_result, expected_result)


    
    @patch('daemon.src.system_report.SysReport.is_windows', return_value=True)
    @patch('daemon.src.system_report.SysReport.is_linux', return_value=False)
    def testFetchingNetworkStrengthInfoWIN(self, m1, m2):
        MOCK_ADAPTER_TERMINAL_OUTPUT='There is 1 interface on the system:\n    Name                   : Wi-Fi\n    Description            : Intel(R) Dual Band Wireless-AC\n    GUID                   : 5a889epd-460c-436f-a04c-a218b5hhe14dc\n    Physical address       : 98:8e:46:5a:18:e7\n    State                  : connected\n    SSID                   : BELL123\n    BSSID                  : 7u:r4:eb:6y:9i:m5\n    Network type           : Infrastructure\n    Radio type             : 802.11n\n    Authentication         : WPA2-Personal\n    Cipher                 : CCMP\n    Connection mode        : Profile\n    Channel                : 10\n    Receive rate (Mbps)    : 72.2\n    Transmit rate (Mbps)   : 72.2\n    Signal                 : 99%\n    Profile                : BELL443\n\n    Hosted network status  : Not available'
        with patch('os.popen', new=mock_open(read_data = MOCK_ADAPTER_TERMINAL_OUTPUT)):
            actual_result = SysReport.fetch_network_strength()
        
        expected_result = 'Strong'

        self.assertEqual(actual_result, expected_result)

    @patch('daemon.src.system_report.SysReport.is_windows', return_value=False)
    @patch('daemon.src.system_report.SysReport.is_linux', return_value=True)
    def testFetchingNetworkStrengthInfoLUX(self, m1, m2):
        MOCK_ADAPTER_TERMINAL_OUTPUT='Connected to 00:19:e6:8d:55:64 (on wlan0)\n        SSID: wsiit\n        freq: 2437\n        RX: 18444610 bytes (94857 packets)\n        TX: 2554688 bytes (17365 packets)\n        signal: -60 dbm \n        tx bitrate: 54.0 MBit/s\n\n        bss flags:	short-preamble short-slot-time\n        dtim period:	0\nbeacon int:	100'
        with patch('os.popen', new=mock_open(read_data = MOCK_ADAPTER_TERMINAL_OUTPUT)):
            actual_result = SysReport.fetch_network_strength()

        expected_result = 'Weak'

        self.assertEqual(actual_result, expected_result)




if __name__ == '__main__':
    unittest.main()