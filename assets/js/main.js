let AllData = await getData()
let ItemToDisplay = 20
let currentPage = 1
let currentSortOrder = 'asc'

let inp = document.querySelector('input')
inp.addEventListener('input', function() {
    search(this.value)
})

document.querySelector('.ItemPerPage').addEventListener('change', function() {
    selectChanged(this.value)
})

function search(value) {
    if (value === "") {
        loadData(AllData)
    } else {
        const filteredData = AllData.filter(ele => ele.name.toLowerCase().includes(value.toLowerCase()))
        loadData(filteredData)
    }
}

function sortTable(id) {
    AllData.sort((a, b) => {
        let A, B
        switch (id) {
            case "name":
                A = a.name.toLowerCase()
                B = b.name.toLowerCase()
                break
            case "full-name":
                A = a.biography.fullName.toLowerCase()
                B = b.biography.fullName.toLowerCase()
                if (A == "") return 1
                if (B == "") return -1 
                break
            case "race":
                A = a.appearance.race 
                B = b.appearance.race 
                if (A == null) return 1
                if (B == null) return -1 
                break
            case "gender":
                A = a.appearance.gender
                B = b.appearance.gender
                if (A == "-") return 1
                if (B == "-") return -1 
                break
            case "height":
                A = parseFloat(a.appearance.height[0].replace("'", ".")) || 0
                B = parseFloat(b.appearance.height[0].replace("'", ".")) || 0
                console.log(A, B);
                if (A == 0) return 1
                if (B == 0) return -1 
                break
            case "weight":
                A = parseFloat(a.appearance.weight[0].split(' ')[0]) || 0
                B = parseFloat(b.appearance.weight[0].split(' ')[0]) || 0
                if (A == 0) return 1
                if (B == 0) return -1 
                break
            case "alignment":
                A = a.biography.alignment || ""
                B = b.biography.alignment || ""
                if (A == "-") return 1
                if (B == "-") return -1 
                break
            case "place-of-birth":
                A = a.biography.placeOfBirth || ""
                B = b.biography.placeOfBirth || ""
                if (A == "-") return 1
                if (B == "-") return -1 
                break
            case "power-state":
                A = "".concat(a.powerstats.map())
                B = "".concat(b.powerstats.map())
                break
            case "image":
                A = a.images.xs
                B = b.images.xs
                break
        }
        if (A < B) return currentSortOrder === 'asc' ? -1 : 1;
        if (A > B ) return  currentSortOrder === 'asc' ? 1 : -1;
    })
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'
    loadData(AllData)
}

const loadData = (heroes) => {
    let notfound = document.getElementById("demo")
    if(heroes.length == 0) {
        notfound.style.display = 'block' 
        notfound.innerHTML = "Cant find any date"
    }else {
        notfound.innerHTML = ''
        notfound.style.display = 'none' 
    }
    const tbody = document.querySelector('#SuperHeroes tbody')
    tbody.innerHTML = ""

    const start = (currentPage - 1) * ItemToDisplay
    const end = start + ItemToDisplay
    const paginatedHeroes = heroes.slice(start, end)

    paginatedHeroes.forEach(element => {
        let PowerStats = ""
        for (const key in element.powerstats) {
            PowerStats += `${key}: ${element.powerstats[key]}<br>`
        }
        const trElem = document.createElement('tr')
        trElem.className = 'new'
        trElem.innerHTML = `
            <td><img src='${element.images["xs"]}' alt='${element.name}'></td>
            <td>${element.name}</td>
            <td>${element.biography["fullName"]}</td>
            <td class='PowerStats'>${PowerStats}</td>
            <td>${element.appearance["race"]}</td>
            <td>${element.appearance["gender"]}</td>
            <td>${element.appearance["height"][0]}</td>
            <td>${element.appearance["weight"][0]}</td>
            <td>${element.biography["placeOfBirth"]}</td>
            <td>${element.biography["alignment"]}</td>
        `
        tbody.appendChild(trElem)
    })
    console.log(heroes.length);
    updatePagination(heroes.length)
}

let ids = [
    'name',
    'full-name',
    'race',
    'gender',
    'height',
    'weight',
    'place-of-birth',
    'power-state',
    'image',
    'alignment']

for (const el of Array.from(ids)) {
    let elx = document.getElementById(el)
    elx.addEventListener("click", function(){
        sortTable(el)
    });
}
function updatePagination(totalItems) {
    const paginationContainer = document.querySelector('.Pagination')
    paginationContainer.innerHTML = "" 

    const totalPages = Math.ceil(totalItems / ItemToDisplay)
    
    for (let i = 1; i <= totalPages; i++) {
        const pageDiv = document.createElement('div')
        pageDiv.className = 'Page'
        pageDiv.textContent = i
        paginationContainer.appendChild(pageDiv)
        pageDiv.addEventListener('click', () => {
            currentPage = i
            loadData(AllData)
        })
    }
}


function selectChanged(value) {
    ItemToDisplay = (value === 'All') ? AllData.length : parseInt(value)
    currentPage = 1
    loadData(AllData)
}

async function getData() {
    const url = "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json"
    const response = await fetch(url)
    return await response.json()
}

loadData(AllData)
