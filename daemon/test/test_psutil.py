import unittest
import psutil

class TestPsUtilMethods(unittest.TestCase):

    def test_getting_process_name(self):
        process_list = list()

        for proc in psutil.process_iter():
            process_info_dictionary = proc.as_dict(attrs=['name'])
            process_list.append(process_info_dictionary)

        # for elem in process_list:
        #     print(elem)

        self.assertTrue(x.name == 'python.exe' for x in process_list)

        
if __name__ == '__main__':
    unittest.main()