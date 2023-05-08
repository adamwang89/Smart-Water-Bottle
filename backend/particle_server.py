import socket
import json 
from datetime import datetime

# start TCP server
port = 8080
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)        
print ("Socket successfully created") 

# TODO: update with your IP here
s.bind(('172.26.42.25', port))
print ("socket binded to %s" %(port))

s.listen(5)      
print ("socket is listening")

newSocket, address = s.accept()
print ("Connection from ", address)

# Heuristic 
# stepsWalkedLastHour
# totalWalked
# averageTemperatureExposure
# TotalWaterDrank
# waterDrankLastHour

def calculateTotalWithinLastHour(loaded, now):
    total = 0
    for i in loaded:
        i['x'] = datetime.strptime(i['x'], '%Y-%m-%d %H:%M:%S.%f')
        diff = now - i['x']
        if (diff.total_seconds() < 3600):
            total = total + i['y']
    return total

def determineDrink(now):
    w = open('../src/data/dailyWater.json')
    a = open('../src/data/activity.json')
    loadedWater = json.load(w)
    loadedAct = json.load(a)
    w.close()
    a.close()
    
    # last hour
    stepsWalkedLastHour = calculateTotalWithinLastHour(loadedAct, now)
    waterDrankLastHour = calculateTotalWithinLastHour(loadedWater, now)

    # total 
    total = open('../src/data/totalWater.json')
    loadedTotal = json.load(total)
    total.close()
    totalWaterDrank = loadedTotal[0]['total']
    totalWalked = 0
    for i in loadedAct:
        totalWalked = totalWalked + i['y']

    # average
    t = open('../src/data/temperature.json')
    loadedT = json.load(t)
    t.close()
    average = 0
    for i in loadedT:
        average = average + i['y']
    average = average / len(loadedT)

    score = 0
    # look at the values and compute a score
    score = score + (totalWalked / 10) * .1
    score = score + (stepsWalkedLastHour / 10) * 1
    if (average >= 80): # hot
        score = score + 3
    elif (average >= 70 and average < 80): #alright temp
        score = score + 3
    elif (average >= 50 and average < 70):
        score = score + 3
    else:
        score = score + 0

    if (waterDrankLastHour >= 0 and waterDrankLastHour < 1):
        score = score + 1
    elif (waterDrankLastHour >= 1 and waterDrankLastHour < 5):
        score = score + 0
    elif (waterDrankLastHour >= 5 and waterDrankLastHour < 10):
        score = score - 1
    elif (waterDrankLastHour >= 10 and waterDrankLastHour < 15):
        score = score - 2
    else:
        score = score - 3
    print(score)
    if (score >= 5):
        return True
    else:
        return False

while (True):
    receivedData = newSocket.recv(1024)
    data = receivedData.decode('utf-8')
    now = datetime.now()
    dt_string = now.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    dt_string_day = now.strftime("%Y-%m-%d")
    tempday = "2023-04-30"
    if (data != '\r\n'):
        print(data)
        if(data[0] == "a"):
            f = open('../src/data/activity.json')
            loaded = json.load(f)
            f.close()
            loaded.append({
                "x" : dt_string,
                "y" : int(data[1:])
            })
            f = open('../src/data/activity.json', 'w')
            json.dump(loaded, f, indent=4)
            f.close()
        elif(data[0] == "w"):
            # water bottle code
            t = open('../src/data/totalWater.json')
            d = open('../src/data/dailyWater.json')
            w = open('../src/data/weeklyWater.json')
            loadedT = json.load(t)
            loadedD = json.load(d)
            loadedW = json.load(w)
            t.close()
            d.close()
            w.close()

            # total water
            total = loadedT[0]["total"]
            newTotal = total + float(data[1:])
            loadedT[0]["total"] = newTotal
            t = open('../src/data/totalWater.json', 'w')
            json.dump(loadedT, t, indent=4)
            t.close()

            # daily water
            loadedD.append({
                "x" : dt_string,
                "y" : float(data[1:])
            })
            d = open('../src/data/dailyWater.json', 'w')
            json.dump(loadedD, d, indent=4)
            d.close()

            # weekly water
            switched = False
            for i in loadedW:
                if (i["x"] == dt_string_day):
                    i["y"] = newTotal
                    switched = True
            
            if (not switched):
                loadedW.append({
                "x" : dt_string_day,
                "y" : float(data[1:])
            })
            w = open('../src/data/weeklyWater.json', 'w')
            json.dump(loadedW, w, indent=4)
            w.close()

        elif(data[0] == "t"):
            f = open('../src/data/temperature.json')
            loaded = json.load(f)
            f.close()
            loaded.append({
                "x" : dt_string,
                "y" : float(data[1:])
            })
            f = open('../src/data/temperature.json', 'w')
            json.dump(loaded, f, indent=4)
            f.close()
        # algorithm to determine how much water to drink
        if (determineDrink(datetime.now())):
            # send data to the microcontroller
            print("sending data to the microcontroller")
            cmd = str(1)
            cmd_b = bytearray()
            cmd_b.extend(map(ord, cmd))
            print ("Requesting " + cmd + " sample")
            newSocket.send(cmd_b)

