from datetime import datetime
import sys, os
import psutil
import unittest
from unittest.mock import MagicMock
from psutil._common import scpufreq

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

    def testFetchingIpv4Address(self):
        actual_result=SysReport.fetch_device_ip_addr().get('ipv4')
        ipv4_pattern = '(?:\d{1,3}\.){3}\d{1,3}'

        self.assertRegex(actual_result, ipv4_pattern)

    def testFetchingIpv6Address(self):
        actual_result=SysReport.fetch_device_ip_addr().get('ipv6')
        ipv6_pattern = '(?:(?:\d|[a-f]){0,4}:){5}(?:\d|[a-f]){0,4}'

        self.assertRegex(actual_result.lower(), ipv6_pattern)

    def testFetchingMacAddress(self):
        actual_result=SysReport.fetch_device_ip_addr().get('mac')
        mac_pattern = '[0-9a-f]{2}([-:]?)[0-9a-f]{2}(\\1[0-9a-f]{2}){4}$'

        self.assertRegex(actual_result.lower(), mac_pattern)

if __name__ == '__main__':
    unittest.main()