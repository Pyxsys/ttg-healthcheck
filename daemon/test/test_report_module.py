from datetime import datetime
import sys
import unittest

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
        actual_result=self.test_report.getReport()
        self.assertEqual(expected_result, actual_result)

    def testAddingEmptySectionToReport(self):
        expected_result={"new_section": {}}
        self.test_report.setSection("new_section", {})
        actual_result=self.test_report.getReport()
        self.assertEqual(expected_result, actual_result)

    def testSettingSection(self):
        expected_result=self.mock_dictionary
        self.test_report.setSection("names", self.mock_dictionary["names"])
        actual_result=self.test_report.getReport()
        self.assertEqual(expected_result, actual_result)

    def testAddingProcessesToReport(self):
        expected_result='python.exe'
        self.test_report.addSystemProcessInfo()
        
        process_list=self.test_report.getSection("processes")
        self.assertTrue(x.name == 'python.exe' for x in process_list)

    def testAddingTimestampToReport(self):
        self.test_report.addTimestamp()
        actual_result=self.test_report.getSection("timestamp")
        self.assertIsNotNone(actual_result)

    def testAddingDeviceIdToReport(self):
        self.test_report.addDeviceUUID()
        actual_result=self.test_report.getSection("deviceId")
        self.assertRegex(actual_result,'^[a-zA-Z0-9]{8}(?:-[a-zA-Z0-9]{4}){3}-[a-zA-Z0-9]{12}$')

        
if __name__ == '__main__':
    unittest.main()