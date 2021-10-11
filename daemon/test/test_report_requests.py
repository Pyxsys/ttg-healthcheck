import sys
import unittest

# Include src directory for imports
sys.path.append('../')
from daemon.src.system_report import Runner

class TestRunner(unittest.TestCase):

    def setUp(self):
        self.test_runner=Runner()

    def tearDown(self):
        del self.test

    # Unit-Tests-----
    def testSysReportClassInitialization(self):
        self.assertIsInstance(self.test_runnerrequest,Runner, msg=None)

        
if __name__ == '__main__':
    unittest.main()