import sys
import json
import requests
import unittest
import timeit
from unittest.mock import MagicMock, patch

# Include src directory for imports
sys.path.append('../')
from daemon.src.system_report import Runner, SysReport

class TestRunner(unittest.TestCase):

    test_config_path = '/test/config.json'
    test_mode = 0

    @classmethod
    def setUpClass(cls):
        cls.test_runner=Runner(sys.path[0] + cls.test_config_path, cls.test_mode)
        print("\n[config values]:")
        print(json.dumps(cls.test_runner.get_config(), indent=4, sort_keys=True))

    @classmethod
    def tearDownClass(cls):
        del cls.test_runner

    # Unit-Tests-----
    def testRunnerClassInitialization(self):
        self.assertIsInstance(self.test_runner, Runner, msg=None)

    @patch('daemon.src.system_report.SysScrubber.fetch_network_strength', return_value='Medium')
    @patch('daemon.src.system_report.SysScrubber.fetch_connected_usb_devices', return_value=[{'hid':'/dev/bus/usb/001/005', 'connection':'USB', 'name':'DUMMY UDisk flash drive'}])
    def testRunnerGeneratingReport(self, m1, m2):
        expected_sections={'deviceId', 'processes', 'memory', 'network', 'disk', 'peripherals', 'timestamp'}
        missing_sections=[]

        self.test_runner.gen_report()
        section_list=list(self.test_runner.get_report().keys())
        for section in expected_sections:
            if section not in section_list:
                missing_sections.append(section)
        self.assertEqual(len(missing_sections), 0, msg=missing_sections)

    
    @patch('daemon.src.system_report.SysScrubber.fetch_net_wan_adapter_info', return_value = { 'SSID': 'mock_network_5GHz', 'connectionType': '802.11dd'})
    @patch('daemon.src.system_report.SysScrubber.fetch_net_adapter_addrs', return_value = { 'adapterName': 'target_adapter',  'ipv6': '1111::1111:1111:1111:1111', 'ipv4': '9.99.0.999', 'mac': 'FE-ED-FE-ED-11-11'})
    def testRunnerGeneratingStartupReport(self, m1, m2):
        expected_sections={'deviceId', 'memory_', 'disk_', 'cpu_', 'wifi_', 'timestamp'}
        missing_sections=[]

        self.test_runner.gen_startup_report()
        section_list=list(self.test_runner.get_report().keys())
        for section in expected_sections:
            if section not in section_list:
                missing_sections.append(section)
        self.assertEqual(len(missing_sections), 0, msg=missing_sections)

    @unittest.skipIf("localhost" in json.load(open(sys.path[0] + test_config_path))['destination'],
     'Cannot run test automatically with "localhost" destination.')
    def testConnectionToServer(self):
        expected_result = 501
        url = self.test_runner.get_config()['destination'] + Runner.api_endpoint

        response=requests.post(url)

        actual_result = response.status_code
        self.assertEqual(expected_result, actual_result)

    @unittest.skipIf("localhost" in json.load(open(sys.path[0] + test_config_path))['destination'],
     'Cannot run test automatically with "localhost" destination.')
    def testSendingReportToServer(self):
        expected_result = 200

        self.test_runner.gen_report()
        response=self.test_runner.send_report()

        actual_result = response.status_code
        self.assertEqual(expected_result, actual_result)

    def testFetchingDelayInterval(self):
        config_file = open(sys.path[0] + self.test_config_path)
        expected_result = json.load(config_file)['report_delay']
        config_file.close()

        actual_result = self.test_runner.get_config()['report_delay']

        self.assertEqual(expected_result, actual_result)

    def testRunnerDelay(self):
        tolerance = 1.10 #A decimal multiplier that defines the upper bound
        config_file = open(sys.path[0] + self.test_config_path)
        permitted_time = json.load(config_file)['report_delay'] * tolerance
        config_file.close()

        actual_time = timeit.timeit(lambda: self.test_runner.sleep(), number=1)

        self.assertGreater(permitted_time, actual_time)

if __name__ == '__main__':
    unittest.main()