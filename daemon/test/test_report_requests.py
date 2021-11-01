import sys
import json
import requests
import unittest
import timeit

# Include src directory for imports
sys.path.append('../')
from daemon.src.system_report import Runner, SysReport

class TestRunner(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.test_runner=Runner(sys.path[0] + '/test/config.json')
        print("\n[config values]:")
        print(json.dumps(cls.test_runner.getConfig(), indent=4, sort_keys=True))
        
    @classmethod
    def tearDownClass(cls):
        del cls.test_runner
        
    # Unit-Tests-----
    def testRunnerClassInitialization(self):
        self.assertIsInstance(self.test_runner, Runner, msg=None)
   
    def testRunnerGeneratingReport(self):
        expected_sections={'deviceId', 'processes', 'timestamp'}
        missing_sections=[]

        self.test_runner.genReport()
        section_list=list(self.test_runner.getReport().keys())
        for section in expected_sections:
            if section not in section_list:
                missing_sections.append(section)
        self.assertEqual(len(missing_sections), 0, msg=missing_sections)
                
    @unittest.skipIf("localhost" in json.load(open(sys.path[0] + '/test/config.json'))['destination'],
     'Cannot run test automatically with "localhost" destination.')
    def testConnectionToServer(self):
        expected_result = 200
        url = self.test_runner.getConfig()['destination'] + Runner.api_endpoint

        response=requests.post(url)
        
        actual_result = response.status_code
        self.assertEqual(expected_result, actual_result)

    @unittest.skipIf("localhost" in json.load(open(sys.path[0] + '/test/config.json'))['destination'],
     'Cannot run test automatically with "localhost" destination.')
    def testSendingReportToServer(self):
        expected_result = 200

        self.test_runner.genReport()
        response=self.test_runner.sendReport()
        
        actual_result = response.status_code
        self.assertEqual(expected_result, actual_result)

    def testFetchingDelayInterval(self):
        config_file = open(sys.path[0] + '/test/config.json')
        expected_result = json.load(config_file)['report_delay']
        config_file.close()

        actual_result = self.test_runner.getConfig()['report_delay']
        
        self.assertEqual(expected_result, actual_result)

    def testRunnerDelay(self): 
        tolerance = 1.10 #A decimal multiplier that defines the upper bound
        config_file = open(sys.path[0] + '/test/config.json')
        permitted_time = json.load(config_file)['report_delay'] * tolerance
        config_file.close()

        actual_time = timeit.timeit(lambda: self.test_runner.sleep(), number=1)
        
        self.assertGreater(permitted_time, actual_time)

if __name__ == '__main__':
    unittest.main()