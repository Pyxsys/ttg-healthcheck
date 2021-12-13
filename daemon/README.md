# Network Devices Health Monitoring Daemon
#### By _Team the Group_
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://app.travis-ci.com/Pyxsys/ttg-healthcheck.svg?token=yqePnie6vvPik5z1MhQa&branch=main)](https://app.travis-ci.com/Pyxsys/ttg-healthcheck)
 
## Technologies Used
* [Python 3.0 (or newer)](https://www.python.org/downloads/)


## Project Dependencies
* [psutil 5.8.0 (or newer)](https://pypi.org/project/psutil/)
* [requests 2.26.0 (or newer)](https://pypi.org/project/requests/)

## Installation
Before starting the installation process, ensure that your target device has all the requirements listed above.

* Start off by cloning/Downloading this directory to the target device
* In the parent directory run `pip install -r daemon/requirements.txt`

## Running
### Server
Follow the steps of setting up a server outlined [here](https://github.com/Pyxsys/ttg-healthcheck/blob/main/README.md).

### Main Routine
Before calling the main routine, ensure you have a **config.json* file with a `"destination"` attribute pointing to your target server endpoint. 

(e.g.)

```json
    {
        "destination":"http://localhost:5000/",
        "report_delay": 5
        ...
    }
```

* To run the main routine once, run `python /src/system_report.py <path_to_config.json>` in the daemon folder.

### Deployed Daemon
In a terminal, from the daemon folder, do the following:
1. Navigate to the folder for your distro (eg: `cd /linux/debian`)
1. Verify the "destination" attribute in config.json points to your desired server endpoint.
1. To start the daemon run: `./celebi -s`
1. To stop the daemon run: `./celebi -k`

# Unit Testing
### Unittest
From you command line, go to the daemon folder of the project and run `coverage run --branch -m unittest -v`

#
*NOTE: you may have to substitute `python` with `python3` when executing commands depending on your system.