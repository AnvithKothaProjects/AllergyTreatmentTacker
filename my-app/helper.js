import foodPlan from './Objects/foodPlan'

const API_KEY = 'AIzaSyDHli_4C3g1gibuZYZHctc5gqNrmkXdONg'
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`

const text = "Follow Up with Pulmonologist 12/5/19 Seed Allergy: Risk Fish Allergy: Low Risk Shellfish: Medium Risk No longer need to eat Recommended Foods, but still continue with wheat exposure Recommended Foods: (3-5 times per week): 1 apple, 1 pear, 1 stone fruit (peaches, apricots, cherries, nectarines, plums), 1 chickpeas (32-33 chickpeas or 2 tbsp hummus), 1 oz lentils, ½ tsp wheat germ Food Dosing Strategy: Pine nut /Brazil nut (challenge) then SLIT (3 yrs) then Macadamia (challenge) then dosing Denatured Camel Milk (micro + capped 45 ml) then Almond/Soy then Denatured Mare Milk (micro + capped 75 ml) then Hazelnut then Pistachio (micro + capped 4 g and inc Denatured Mare Milk to 160 ml staged) then Uncooked Camel Milk (micro + capped 60 ml) then Cashew (micro to clear) then Goat Yogurt (capped 60 ml) then Pecan (micro + capped 6 g) then Cow Yogurt then Uncooked Cow Milk then Walnut (clears Pecan) then Peanut then Seeds (if needed) and then Tolerance Visit 2 and then Remission Visit 1 and then Annual Remission Visits 12/8/20 FDS Update: 2g peanut protein challenge. The next cycle will build up from the last dose of peanut by 1/2 peanut perweek, until the patient reaches 11 peanuts. The next visit thereafter will be the 32-peanut challenge. 02/22/22 DAIRY FDS: Start at 3 oz and build up. Goal to challenge 10 g then stage down weekly. He would then stay on daily milk for another 2 months then return for that. - As tolerated: Brazil nut, Pine nut Maintenance Foods (in AM, minimum unless CAPPED): - ONCE DAILY: Greek yogurt (3 oz-capped). - WEEKLY: Macadamia (1), Almond (8), Soy (6 oz OR 1/2 tsp protein isolate), Hazelnut (4), Pistachio (6), Coconut (4 oz OR 1/4 tsp Nutiva), Cashew (5), Pecan halves (4), Walnut halves (5), Chestnut (1 tsp), Crab (1 oz cooked), Shrimp (1 oz cooked), Hen Egg (1 whole egg), Cooked Clam (1 oz cooked), Peanut (60) **CAPPED = set dose daily, no more or less.** nel bre MTNG MAN Treatment Foods: (dose in PM, at least 4 hours APART from maintenance, followed by 1 hour rest period - no exercise, showers, or sleeping) You must complete at least 7 days of your final week of dosing before coming back for challenge. Treatment food 1: Fairlife Milk (Fairlife Milk - 13g protein/80z) Week 1: Fairlife Milk 30 MI daily Week 2: Fairlife Milk 35 Ml daily Week 3: Fairlife Milk 45 MI daily Week 4: Fairlife Milk 60 Ml daily Week 5: Fairlife Milk 75 Ml daily Week 6: Fairlife Milk 90 MI daily Week 7: Fairlife Milk 110 MI daily Week 8: Fairlife Milk 130 Ml daily Week 9: Fairlife Milk 130 MI daily and continue this dose until next visit"
const priorityList = ["Macadamia", "Macadamia Nut", "Almond", "Almond Nut", "Brazil Nut", "Brazil", "Cashew", "Cashew Nut",
"Hazelnut", "Hazel Nut", "Hazel", "Pecan", "Pecan Nut", "Pine Nut", "Pine", "Pistachio", "Pistachio Nut", "Walnut", "Peanut", "Chestnut", "Chest nut", "Pili nut", "Pili", "Kola Nut",
"Kola", "Kola Nut", "Coconut Milk", "Coconut", "Sunflower Seed", "Nut", "Camel Milk", "Mare Milk", "Goat Milk", "Sheep Milk", "Cow Milk", "Yogurt", "Milk", "Crab", "Shrimp",
"Clam", "Apple", "Pear", "Chickpea", "Lentil", "Wheat Germ", "Wheat", "Egg", "Egg white"]

function generateBody(image) {
  const body = {
    requests: [
        {
            image: {
                content: image,
            },
            features: [
                {
                    type: 'TEXT_DETECTION',
                    maxResults: 1,
                }
            ],
        }
    ],
  }

  return body
}

async function callGoogleVision(imageArr) {
    var totalText = ""

    for (let i=0; i<imageArr.length; i++) {
        const body = generateBody(imageArr[i][1])
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const result = await response.json()
        const detectedText = result.responses[0].fullTextAnnotation;
        totalText += detectedText.text
    }
    
    return processText(totalText)
}

function instancesOfString(bigText, smallText) {
    var list = [];

    for (let i=0; i<bigText.length-smallText.length+1; i++) {
        if (bigText.substring(i,i+smallText.length) == smallText) list.push(i)
    }
    return list
}

function returnClosestInstance(list1, list2) {
    //[list1Index, list2Index]
    //list2Index comes after list1Index
    var ans = [-1,-1];
    var maxDist = 100000000
    if (list1.length == 0 || list2.length == 0) return ans
    var list2Ind = 0;

    for (let list1Ind = 0; list1Ind<list1.length; list1Ind++) {
        while (list2Ind < list2.length && list2[list2Ind] < list1[list1Ind]) list2Ind++

        if (list2Ind < list2.length && list2[list2Ind] > list1[list1Ind]) {
            if (list2[list2Ind] - list1[list1Ind] < maxDist) {
                maxDist = list2[list2Ind] - list1[list1Ind]
                ans = [list1[list1Ind], list2[list2Ind]]
            }
        }
    }
    return ans
}

function processText(text) {
    var newText = removeInParen(text)

    var colons = instancesOfString(newText, ":")
    var recommendedInstances = instancesOfString(newText, "Recommended Food")
    var treatmentInstances = instancesOfString(newText, "Treatment Food")
    var maintenanceInstances = instancesOfString(newText, "Maintenance Foods")
    var medicineInstances = instancesOfString(newText, "Medicine")
    var foodInstances = instancesOfString(newText, "Food Dosing Strategy")

    var startOfRecommeded = returnClosestInstance(recommendedInstances, colons)
    var startOfTreatment = returnClosestInstance(treatmentInstances, colons)
    var startOfMaintenance = returnClosestInstance(maintenanceInstances, colons)
    var startOfMedicine = returnClosestInstance(medicineInstances, colons)
    var startOfFood = returnClosestInstance(foodInstances, colons)

    var startList = [startOfTreatment, startOfMaintenance, startOfRecommeded, startOfMedicine, startOfFood]
    var foodList = [[], [], [], []]

    for (let i=0; i<4; i++) {
        if (startList[i][0] != -1) foodList[i] = generateList(startList[i][1], startList, newText)
    }

    var info = [[],[],[],[]]
    for (let i=0; i<foodList.length; i++) {
        for (let j=0; j<foodList[i].length; j++) {
            info[i].push(new foodPlan())
            info[i][info[i].length-1].food = foodList[i][j]
        }
    }
    
    return info
}

function generateList(start, startList, text) {
    var end = text.length
    var foodlist = []

    for (let i=0; i<startList.length; i++) {
        if (startList[i][1] > start && startList[i][1] < end) end = startList[i][1]
    }
    // console.log(text.substring(start, end+1))
    // console.log()

    for (let i=start; i<end; i++) {
        for (let j=0; j<priorityList.length; j++) {
            if (i + priorityList[j].length <= text.length && text.substring(i, i+priorityList[j].length).toLowerCase() == priorityList[j].toLowerCase()) {
                if (isFirstTime(foodlist, priorityList[j])) foodlist.push(priorityList[j])
                continue
            }
        }
    }

    return foodlist
}

function isFirstTime(list, str) {
    for (let i=0; i<list.length; i++) {
        if (list[i].includes(str)) return false
    }
    return true
}

// function removeInstances(arr, text) {
//     for (let i=0; i<text.length; i++) {
//        for (let j=0; j<arr.length; j++) {
//             if (i + arr[j].length <= text.length && text.substring(i, i+arr[j].length) == arr[j]) {

//             }
//        }
//     }
// }

function removeInParen(text) {
    var ind = -1
    var newText = text
    var arr = []
    for (let i=0; i<newText.length; i++) {
        if (newText.charAt(i) == "(") ind = i
        if (newText.charAt(i) == ")") {
            if (ind != -1) {
                arr.push(newText.substring(ind, i+1))
                ind = -1
            }
        }
    }

    for (let i=0; i<arr.length; i++) {
        // console.log(arr[i])
        newText = newText.replace(arr[i], "")
    }

    return newText
}

export default callGoogleVision