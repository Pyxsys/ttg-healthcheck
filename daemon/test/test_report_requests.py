import sys
import json
import requests
import unittest

# Include src directory for imports
sys.path.append('../')
from daemon.src.system_report import Runner, SysReport

class TestRunner(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.test_runner=Runner(sys.path[0] + '\\test\\config.json')
        print("\n[config values]:")
        print(json.dumps(cls.test_runner.getConfig(), indent=4, sort_keys=True))
        
    @classmethod
    def tearDownClass(cls):
        del cls.test_runner
        
    # Unit-Tests-----
    def testRunnerClassInitialization(self):
        self.assertIsInstance(self.test_runner, Runner, msg=None)
   
    def testRunnerGeneratingReport(self):
        expected_result='processes'
        self.test_runner.genReport()
        self.assertTrue(expected_result in self.test_runner.getReport())

    @unittest.skipIf("localhost" in json.load(open(sys.path[0] + '\\test\\config.json'))['destination'],
     'Cannot run test automatically with "localhost" destination.')
    def testConnectionToServer(self):
        expected_result = 200
        url = self.test_runner.getConfig()['destination'] + Runner.api_endpoint

        response=requests.post(url)
        
        actual_result = response.status_code
        self.assertEqual(expected_result, actual_result)

    @unittest.skipIf("localhost" in json.load(open(sys.path[0] + '\\test\\config.json'))['destination'],
     'Cannot run test automatically with "localhost" destination.')
    def testSendingReportToServer(self):
        expected_result = 200

        self.test_runner.genReport()
        response=self.test_runner.sendReport()
        
        actual_result = response.status_code
        self.assertEqual(expected_result, actual_result)

if __name__ == '__main__':
    unittest.main()