import unittest
import sys
import json
import psutil
from unittest.mock import MagicMock, patch

# Include src directory for imports
sys.path.append('../')
from daemon.src.system_report import DaemonChecker

class TestDaemonCheckerClass(unittest.TestCase):
    
    test_config_path = '/test/config.json'

    @classmethod
    def setUpClass(cls):
        cls.test_proc=psutil.Process()
        cls.test_checker=DaemonChecker(sys.path[0] + cls.test_config_path)
        print("\n[config values]:")
        print(json.dumps(cls.test_checker.get_config(), indent=4, sort_keys=True))

    @classmethod
    def tearDownClass(cls):
        del cls.test_checker

    #--- unit tests -------------------------------

    def testDaemonCheckerInitialization(self):
        self.assertIsInstance(self.test_checker, DaemonChecker, msg=None)

    def testMemoryCheck(self):
        with patch('psutil.Process().memory_info()', return_value=[11000000,0]):
            self.assertTrue(self.test_checker.too_much_memory(self.test_proc))

if __name__ == '__main__':
    unittest.main()