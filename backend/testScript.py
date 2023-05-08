from datetime import datetime
import json 

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

    print("steps walked last hour", stepsWalkedLastHour)
    print("water drank last hour", waterDrankLastHour)
    print("total water drank", totalWaterDrank)
    print("Total steps walked", totalWalked)
    print("Average temperature", average)
    score = 0
    # look at the values and compute a score
    score = score + (totalWalked / 10) * .1
    score = score + (stepsWalkedLastHour / 10) * 1
    if (average >= 80): # hot
        score = score + 3
    elif (average >= 70 and average < 80): #alright temp
        score = score + 2
    elif (average >= 50 and average < 70):
        score = score + 3
    else:
        score = score + 0
    print(score)
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
    
print(determineDrink(datetime.now()))