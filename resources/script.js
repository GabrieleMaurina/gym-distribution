const MAX = Number.MAX_SAFE_INTEGER

const PLATFORMS = 'platforms'
const ATHLETES = 'athletes'
const RESULTS = 'results'

const PLATFORMS_INPUT = document.getElementById(PLATFORMS)
const ATHLETES_INPUT = document.getElementById(ATHLETES)
const RESULTS_DIV = document.getElementById(RESULTS)

const EXPIRY = {expiry : 60 * 60 * 24 * 365}





//   ALGORITHM

const computeDistribution = (platforms, athletes) => {
	athletes.sort((a, b) => a-b)

	const N = athletes.length
	const K = platforms
	const min = Math.floor(N/K)
	const max = min + 1
	const mod = N % K

	if(N <= K){
		groups = []
		for(k = 0; k < K; k++){
			if(k < N) groups.push([athletes[k]])
			else groups.push([])
		}
		return groups
	}
	else if(mod === 0){
		groups = []
		for(k = 0; k < K; k++){
			groups.push([])
			for(n = 0; n < min; n++){
				groups[k].push(athletes[k * min + n])
			}
		}
		return groups
	}
	else{
		memo = []
		for(var n=0; n<N; n++){
			memo[n] = []
			for(var k=0; k<K; k++){
				memo[n][k] = [false, false, MAX]
			}
		}

		f = (n, k) => {
			if(n == N){
				if(k == K) return 0
				else return MAX
			}
			else if(k >= K){
				return MAX
			}
			else if(memo[n][k][0]){
				return memo[n][k][2]
			}
			else{
				var best = MAX
				if(n + min <= N){
					const delta = Math.max(f(n + min, k + 1), athletes[n + min - 1] - athletes[n])
					if(delta < best){
						best = delta
						memo[n][k][1] = false
					}
				}
				if(mod && n + max <= N){
					const delta = Math.max(f(n + max, k + 1), athletes[n + max - 1] - athletes[n])
					if(delta < best){
						best = delta
						memo[n][k][1] = true
					}
				}
				memo[n][k][0] = true
				memo[n][k][2] = best
				return best
			}
		}	
		
		const best = f(0,0)

		groups = []
		var n = 0
		for(var k=0; n < N; k++){
			const next = memo[n][k][1] ? n + max : n + min
			groups[k] = []
			for(i = n; i < next; i++){
				groups[k].push(athletes[i])
			}
			n = next
		}

		return groups
	}
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
		h1.innerText = g.length ? g.join(' ') : 'Vuoto'
		div.appendChild(h1)
		RESULTS_DIV.appendChild(div)
	})
}





//   PLATFORMS

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

PLATFORMS_INPUT.oninput = () => {
	value = parse_int(PLATFORMS_INPUT.value)
	if(value){
		Cookies.set(PLATFORMS, value, EXPIRY)
	}
	updateResults()
}




//   ATHLETES LIST

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





//   INITIAL UPDATE

updateResults()
