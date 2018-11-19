from time import gmtime, strftime
import time
import requests
import random
import string

baseURL = "http://localhost:3000"
sensorPostURL = "/sensors"
sensorMeasureURL = "/sensor/data"
getAllSensors = "/api/sensors"
rooms = []
measurements = [{"measurementType": "temperature", "uom": "C"},
                {"measurementType": "pressure", "uom": "Pa"},
                {"measurementType": "pm", "uom": "ug/m3"}]
ranges = {"temperature": {"min": -10, "max":40},
          "pressure": {"min": 89, "max":107},
          "pm": {"min": 0, "max":80}
          }

def get_sensors():
    resp = requests.get("http://localhost:3000/api/sensors")
    sensors = resp.json()
    return sensors

def pick_sensor(sensors):
    sensor_index = random.randint(0, sensors.__len__() - 1)
    return sensors[sensor_index]


def sensor_measurement(sensor_parameter, measurement):
    data = {}
    data["idSensor"] = sensor_parameter["idSensor"]
    value = round(random.uniform(ranges[measurement]["min"], ranges[measurement]["max"]), 2)
    data["value"] = value
    data["measurementType"] = measurement
    data["timestamp"] = get_time_now()
    return data


def get_time_now():
    return strftime("%Y-%m-%d %H:%M:%S", gmtime())


for _ in range(1, 6):
    sensors = get_sensors()
for sensor in sensors:
    print(sensor)
while True:
    sensor = pick_sensor(sensors)
    for measurement in sensor["measurements"]:
        dataToSend = sensor_measurement(sensor, measurement["measurementType"])
        print(dataToSend)
        requests.post("http://localhost:3000/api/sensor/data",
                      data=dataToSend)
    time.sleep(100)
