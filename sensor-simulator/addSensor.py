import requests
import random
import string
baseURL = "http://localhost:3000"
sensorPostURL = "/sensor"
measurements = [{"measurementType": "temperature", "uom": "C"},
                {"measurementType": "pressure", "uom": "Pa"},
                {"measurementType": "pm", "uom": "ug/m3"}]
ranges = {"temperature": {"min": 0, "max":40},
          "pressure": {"min": 89, "max":107},
          "pm": {"min": 0, "max":40}
          }
positions = [{"longitude": 44.1398048401, "latitude": 12.2429962158, "altitude": 21, "idLocation": 'S1'}]


def create_sensor():
    to_send = {}
    to_send["idSensor"] = create_sensor_id()
    to_send["name"] = create_sensor_name()
    to_send["measurements"] = pick_measurements()
    to_send["position"] = pick_position()
    return to_send


def create_sensor_id():
    string_to_return = ''
    string_to_return = string_to_return + ''.join(random.choice(string.ascii_uppercase) for _ in range(4))
    string_to_return = string_to_return + ''.join(random.choice(string.digits) for _ in range(4))
    return string_to_return


def create_sensor_name():
    return ''.join(random.choice(string.ascii_uppercase) for _ in range(10))


def pick_measurements():
    selected_measurements = []
    num_measurements = random.randint(1, measurements.__len__() - 1)
    for measurement_index in range(0, num_measurements):
        selected_measurements.append(measurements[measurement_index])
    return selected_measurements


def pick_position():
    position_index = random.randint(0, positions.__len__() - 1)
    return positions[position_index]


data_sensor = create_sensor()
r = requests.post("http://localhost:3000/api/sensor", json=data_sensor)
