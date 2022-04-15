const routList = [
  {
    title: 'All countries',
    route: 'all'
  },
  {
    title: 'Africa',
    route: 'africa',
  },
  {
    title: 'Americas',
    route: 'americas',
  },
  {
    title: 'Asia',
    route: 'asia',
  },
  {
    title: 'Europe',
    route: 'europe',
  },
  {
    title: 'Oceania',
    route: 'oceania',
  },
]

const endPointList = {
  all: 'all',
  region: 'region',
  capital: 'capital',
  name: 'name',
}

const $navList = document.querySelector('.nav_list')
const $main = document.querySelector('.cards')
const $loader = document.querySelector('.loader')
const $select = document.querySelector('.select')
const $search = document.querySelector('.search')
const $nav_img = document.querySelector('.nav_img')
const $callRegions = document.querySelector('.call_regions')

window.addEventListener('load', () => {
  $loader.innerHTML = `<div class="lds-facebook"><div></div><div></div><div></div></div>`

  const list = routList.map(({route, title}) => routeTemplate(title, route)).join('')
  $navList.innerHTML = list

  getBase(endPointList.all, res => template(res))
})

$callRegions.addEventListener('click', e => {
  e.preventDefault()

  $navList.classList.toggle('active')
})

function getBase(endPoint, cb) {
  fetch(`https://restcountries.com/v3.1/${endPoint}`)
    .then(res => res.json())
    .then(res => cb(res))
}

function routeTemplate(title, route){
  return `
    <li class="nav_item">
      <a class="nav_link" onclick="getRoute('${route}')">${title}</a>
    </li>
  `
}

function getRoute(route){
  if (route === 'all') {
    getBase(`${endPointList.all}`, res => {
      template(res)
    })
  }else{
    getBase(`${endPointList.region}/${route}`, res => {
      template(res)
    })
  }
}

// card template

function template(base){
  const template = base.map(item => {
    return card(item)
  }).join('')

  $main.innerHTML = template
}

function card(el){
  return `
    <div class="card">
      <div class="card_header">
        <h1>${el.name.common} ${el.flag ? el.flag : '...'}</h1>
      </div>
      <div class="card_body">
        <img class="card_img" src="${el.flags.svg}">
      </div>
      <div class="card_footer">
        <button class="card_btn" onclick="getMore('${el.name.common}')">More...</button>
      </div>
    </div>
  `
}

// more card Template

function getMore(more){
  getBase(`${endPointList.name}/${more}`, res => {
    templateMore(res)
  })
}

function templateMore(base) {
  const template = base.map(item => {
    return cardMore(item)
  }).join('')

  $main.innerHTML = template
}

function cardMore(el){
  return `
    <div class="cardMore">
      <div class="cardMore_header">
        <h1>${el.name.common}</h1>
        <img src="${el.flags.svg}">
      </div>
      <div class="cardMore_body">
        <ul class="cardMore_list">
          <li><span>Capital:</span> <span>${el.capital}</span></li>
          <li><span>Region:</span> <span>${el.subregion}</span></li>
          <li><span>Continents:</span> <span>${el.continents}</span></li>
          <li><span>Population:</span> <span>${el.population} people</span> </li>
        </ul>
      </div>
    </div>
  `
}

//  поисковик

$select.addEventListener('change', e => {
  let value = e.target.value

  if(value === 'capital'){
    $search.setAttribute('placeholder', 'Search by Capital...')
  }else if(value === 'name'){
    $search.setAttribute('placeholder', 'Search by Name...')
  }
})

$search.addEventListener('input', e => {
  let val = e.target.value
  let selected = $select.value
  if(selected === 'capital'){
    getBase(`${endPointList.capital}/${val}`, res => {
      template(res)
    })
  }else if(selected === 'name'){
    getBase(`${endPointList.name}/${val}`, res => {
      template(res)
    })
  }
})

// change backImage

const background = [
  'https://wallpaperaccess.com/full/19616.jpg',
  'https://images.hdqwalls.com/wallpapers/fiery-sunset-4k-bu.jpg',
  'https://images.wallpapersden.com/image/download/sunset-4k-ultra-hd-2021_bG5nbG2UmZqaraWkpJRobWllrWdma2U.jpg',
  'https://img2.akspic.ru/previews/7/1/9/7/6/167917/167917-nagi_no_asukara-art-voda-atmosfera-sinij-x750.jpg',
  'https://wallpapershome.com/images/pages/pic_h/23277.jpg',
]

function setBackground(){
  let random = Math.floor(Math.random() * background.length)
  document.body.style.background = `url('${background[random]}') center / cover no-repeat fixed`
}