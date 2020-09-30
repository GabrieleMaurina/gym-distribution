const PLATFORMS = 'platforms'
const ATHLETES = 'athletes'
const RESULTS = 'results'

const PLATFORMS_INPUT = document.getElementById(PLATFORMS)
const ATHLETES_INPUT = document.getElementById(ATHLETES)
const RESULTS_DIV = document.getElementById(RESULTS)

const EXPIRY = {expiry : 60 * 60 * 24 * 365}





const computeDistribution = (platforms, athletes) => {
	
	return [[14, 15],[60,70]]
}

const updateResults = () => {
	platforms = parse_int(PLATFORMS_INPUT.value)
	athletes = ATHLETES_INPUT.value.split(' ').filter((v) => v).map((v) => parseInt(v))
	distribution = computeDistribution(platforms, athletes)
	while(RESULTS_DIV.firstChild){
		RESULTS_DIV.removeChild(RESULTS_DIV.lastChild)
	}
	distribution.forEach((g) => {
		div = document.createElement('div')
		div.setAttribute('class', 'results')
		h1 = document.createElement('h1')
		h1.innerText = g.join(' ')
		div.appendChild(h1)
		RESULTS_DIV.appendChild(div)
	})
}





const parse_int = (value) => {
	if(value){
		value = parseInt(value) || 1
		return value >= 1 ? value : null
	}
	return null
}

value = parse_int(Cookies.get(PLATFORMS))

if(value){
	PLATFORMS_INPUT.value = value
}

PLATFORMS_INPUT.onchange = () => {
	value = parse_int(PLATFORMS_INPUT.value)
	if(value){
		Cookies.set(PLATFORMS, value, EXPIRY)
	}
	updateResults()
}





const parse_athletes = (value) => {
	if(value){
		value = value.replace(/[^0-9 ]/g, '')
		value = value.replace(/ {2,}/g, ' ')
		return value
	}
	return null
}

value = parse_athletes(Cookies.get(ATHLETES))

if(value){
	ATHLETES_INPUT.value = value
}

ATHLETES_INPUT.oninput = () => {
	value = parse_athletes(ATHLETES_INPUT.value)
	if(value){
		if(value != ATHLETES_INPUT.value){
			cursor = ATHLETES_INPUT.selectionStart - 1
			ATHLETES_INPUT.value = value
			ATHLETES_INPUT.setSelectionRange(cursor, cursor);
		}
		Cookies.set(ATHLETES, value, EXPIRY)
	}
	updateResults()
}





updateResults()
