from datetime import datetime
import sys
import unittest
from unittest.case import expectedFailure

# Include src directory for imports
sys.path.append('../')
from daemon.src.system_report import SysReport

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

        
if __name__ == '__main__':
    unittest.main()