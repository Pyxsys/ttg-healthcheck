import unittest
import sys
import json

# Include src directory for imports
sys.path.append('../')
from daemon.src.system_report import DaemonChecker

class TestDaemonCheckerClass(unittest.TestCase):
    
    test_config_path = '/test/config.json'

    @classmethod
    def setUpClass(cls):
        cls.test_checker=DaemonChecker(sys.path[0] + cls.test_config_path)
        print("\n[config values]:")
        print(json.dumps(cls.test_checker.get_config(), indent=4, sort_keys=True))

    @classmethod
    def tearDownClass(cls):
        del cls.test_checker

    #--- unit tests -------------------------------

    def testDaemonCheckerInitialization(self):
        self.assertIsInstance(self.test_checker)

if __name__ == '__main__':
    unittest.main()