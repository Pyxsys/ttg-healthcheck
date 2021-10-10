import unittest
import psutil

class TestPsutilIterator(unittest.TestCase):

    def testGettingProcessName(self):
        process_list = list()

        for proc in psutil.process_iter():
            process_info_dictionary = proc.as_dict(attrs=['name'])
            process_list.append(process_info_dictionary)

        self.assertTrue(x.name == 'python.exe' for x in process_list)

        
if __name__ == '__main__':
    unittest.main()