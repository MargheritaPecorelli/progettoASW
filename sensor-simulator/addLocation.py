import requests
url = "http://localhost:3000/api/location"


def add_location_all_parameters(id_location, name, room, block, level, campus, city):
    data = {}
    data["idLocation"] = id_location
    data["name"] = name
    data["room"] = room
    data["block"] = block
    data["level"] = level
    data["campus"] = campus
    data["city"] = city
    requests.post(url, data=data)


add_location_all_parameters("L2", "laboratorio informatico 3.1", "3004", "A", "3", "cesena", "cesena")
