// VARS
const shop = document.querySelector('.shop')
const popap = document.querySelector('.popap')
const popapContent = document.querySelector('.popap-content')
const popapGoods = document.querySelector('.popap-goods')
const popapClose = document.querySelector('.popap-close')
const popapOrder = document.querySelector('.popapOrder')
const popapOrderContent = document.querySelector('.popapOrder-content')
const popapOrderClose = document.querySelector('.popapOrder-close')
const popapBtn = document.querySelector('.popap-btn')
const popapOrderFormBtn = document.querySelector('.popapOrder-form--btn')
const popapThanks = document.querySelector('.popapThanks')
const popapThanksContent = document.querySelector('.popapThanks-content')
const popapThanksBtn = document.querySelector('.popapThanks-btn')
const token = "5914364148:AAEoU50-ORXLpVdx6_ioN7YnCERjRUM9qck";
const chat_id = "-940073457"
const API = `https://api.telegram.org/bot${token}/sendMessage`
var productsBtn = document.querySelectorAll('.goods-item--box')
var cartItems = document.querySelectorAll('.popap-goods--item')
var productsBtn0 = document.querySelectorAll('[data-number="0"]')
var productsBtn12 = document.querySelectorAll('[data-number="12"]')
var quantity = document.querySelector('.quantity')
var fullSum = document.querySelector('.total-sum')
var idItems = []
// var ob = {}
// var productOrder = []
 

// SLIDER
const swiper = new Swiper('.swiper', {
    // Optional parameters
    // loop: true,
    spaceBetween: 20,
    slidesPerView: 3,
    grabCursor: true,
   
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
})

// Плавна поява заднього фону
// відгуки
const answers = () => {
  let answersItems = document.querySelectorAll('.swiper-slide--item')

  answersItems.forEach((el) => {
      el.addEventListener('mouseover', (e) => {
          let slideID = el.getAttribute('data-slide')
          let currentTab = document.querySelector(slideID)
          currentTab.classList.add('active')
      })
      el.addEventListener('mouseout', (e) => {
          let slideID = el.getAttribute('data-slide')
          let currentTab = document.querySelector(slideID)
          currentTab.classList.remove('active')
      })
  })
} 

// ЯКОРЯ
// автоматична зміна стилів при скролі
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.link').forEach((link) => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href').replace('#','') === entry.target.id
                )
            })
        }
    })
}, {
    threshold: 0.7,
})

document.querySelectorAll('.section').forEach((section) => {
    observer.observe(section)
})

// автоскрол
const links = () => { 
    const anchors = document.querySelectorAll('a[href*="#"]')
    for (let anchor of anchors) {
        anchor.addEventListener("click", (el) => {
            el.preventDefault()
            const blockID = anchor.getAttribute('href') 
            document.querySelector('' + blockID ).scrollIntoView({
                behavior: "smooth",
                block: "center",
                // inline: "center"
            })
        })
    }
}  

// АКОРДІОН
const downList = () => {
    let contentItems = document.querySelectorAll('.content--title')
    let contentText = document.querySelectorAll('.content--text')
    let arrows = document.querySelectorAll('.arrow')

    arrows[0].style.transform = "rotate(90deg)" 

    contentItems.forEach((el) => {
        el.addEventListener('click', e => {
            arrows.forEach((el) => {
                el.style.transform = "rotate(0deg)"
            })
            let tabID = el.getAttribute('data-tab')
            let currentTab = document.querySelector(tabID)
            let numberArrows = tabID.toString().slice(-1)
            contentText.forEach((el) => {
                el.style.maxHeight = null
                el.classList.remove('active')
            })
            currentTab.classList.add('active')
            currentTab.style.maxHeight = currentTab.scrollHeight + "px"
            arrows[parseInt(numberArrows) - 1].style.transform = "rotate(90deg)" 
        })
    })
} 

// ВІДКРИТТЯ / ЗАКРИТТЯ ПОПАПА (КОРЗИНИ)
// ВІДКРИТТЯ / ЗАКРИТТЯ ПОПАПА (КОРЗИНИ)
const popapFuction = (quantity) => {
    quantity = document.querySelector('.quantity')
    shop.addEventListener('click', () => {
        if (parseInt(quantity.textContent) > 0) {
            popap.classList.add('active')
            popapContent.classList.add('active')
        } else {
            popap.classList.remove('active')
            popapContent.classList.remove('active')
        }
    })
    popapClose.addEventListener('click', () => {
        popap.classList.remove('active')
        popapContent.classList.remove('active')
    })
    popapOrderClose.addEventListener('click', () => {
        popapOrder.classList.remove('active')
        popapOrderContent.classList.remove('active')
    })
    popapOrderFormBtn.addEventListener('click', () => {
        popapOrder.classList.remove('active')
        popapOrderContent.classList.remove('active')
    })
    popapBtn.addEventListener('click', () => {
        popap.classList.remove('active')
        popapContent.classList.remove('active')
        popapOrder.classList.add('active')
        popapOrderContent.classList.add('active')
    })
    popapThanksBtn.addEventListener('click', () => {
        popapThanks.classList.remove('active')
        popapThanksContent.classList.remove('active')
    })
    window.addEventListener('click', (event) => {
        let target = event.target
        
        if (target === popap) {
            popap.classList.remove('active')
            popapContent.classList.remove('active')
        } 

        if (target === popapOrder) {
            popapOrder.classList.remove('active')
            popapOrderContent.classList.remove('active')
        }

        if (parseInt(quantity.textContent) == 0) {
            popap.classList.remove('active')
            popapContent.classList.remove('active')
        }

        if (target.dataset.action == 'plus') {
            let parent = target.closest('.popap-goods--item')
            let count = parent.querySelector('.popap-goods--count_num')
            plus(count)
            calcPrice()
            updateStorage()
        }

        if (target.dataset.action == 'minus') {
            let parent = target.closest('.popap-goods--item')
            let count = parent.querySelector('.popap-goods--count_num')
            minus(count)
            calcPrice()
            updateStorage()
        }
    })
} 

// ФУКНКЦІОНАЛ КНОПОК ТОВАРІВ НА ОСНОВНІЙ СТОРІНЦІ
// зміст HTML, що додається до корзини
const generateCartProduct = (id, img, title, price) => {
    return `
    <div data-id="${id}" class="popap-goods--item">
        <img class="popap-goods--close" src="assets/img/sprite/Close.svg" alt="Close">
        <div class="popap-goods--border">
            <img src="${img}" alt="goods" class="popap-goods--img">
            <span class="popap-goods--title">${title}</span>
            <div class="popap-goods--count">
                <span class="popap-goods--count_num">1</span>
                <svg class="up_down up">
                    <use data-action="plus" class="popap-goods--count_up" xlink:href="assets/img/sprite/symbol/sprite.svg#Up_down"></use>
                </svg>
                <svg class="up_down down">
                    <use data-action="minus" class="popap-goods--count_down" xlink:href="assets/img/sprite/symbol/sprite.svg#Up_down"></use>
                </svg>
            </div>
            <div class="popap-goods--price">
                <span class="popap-price">${price}</span> грн.
            </div>
        </div>
    </div>
    `
}

// виводить кількість елементів в корзині
const printQuantity = () => {
    quantity = document.querySelector('.quantity')
    let length = document.querySelector('.popap-goods').children.length
    quantity.textContent = length
    length > 0 ? quantity.classList.add('active') : quantity.classList.remove('active')
}

// перевірка вибраного товару та додавання його в корзину
const Check = () => {
    productsBtn = document.querySelectorAll('.goods-item--box')
    productsBtn0 = document.querySelectorAll('[data-number="0"]')
    productsBtn12 = document.querySelectorAll('[data-number="12"]')
    productsBtn.forEach(el => {
        el.addEventListener('click', e => {
            if (!e.target.classList.contains('check')) {
                el.classList.add('check')
                // перевірка на однакові товари
                if (el.getAttribute('data-number') === '0') {
                    productsBtn0.forEach(el => {
                        el.classList.add('check')
                    })
                }
                if (el.getAttribute('data-number') === '12') {
                    productsBtn12.forEach(el => {
                        el.classList.add('check')
                    })
                }
                //
            } 
            else {
                // якщо треба буде при натисканні прибирати галочку
                // el.classList.remove('check')
                // console.log(document.querySelectorAll('.popap-goods--item'))
                // // console.log(cartItems)
                // // перевірка на однакові товари
                // if (el.getAttribute('data-number') === '0') {
                //     productsBtn0.forEach(el => {
                //         el.classList.remove('check')
                //     })
                // }
                // if (el.getAttribute('data-number') === '12') {
                //     productsBtn12.forEach(el => {
                //         el.classList.remove('check')
                //     })
                // }
                //
            }
            let self = e.currentTarget
            let parent = self.closest('.goods-item')
            let productCard = {
                id: parent.dataset.id,
                img: parent.querySelector('.goods-item--img').getAttribute('src'),
                title: parent.querySelector('.goods-item--title').textContent,
                price: parseInt(parent.querySelector('.price').textContent)
            }

            // якщо кнопнка натиснута
            // disabled працює з інпутами (кнопками)
            // self.disabled = true
            let itemInCard = popapGoods.querySelector(`[data-id="${productCard.id}"]`)
            if (itemInCard) {} else {
                // додавання товару в корзину
                document.querySelector('.popap-goods').insertAdjacentHTML('afterbegin', generateCartProduct(productCard.id, productCard.img, productCard.title, productCard.price))
                printQuantity()
                calcPrice()
                updateStorage()
                idItems.push(parseInt(productCard.id))
                localStorage.setItem('id', JSON.stringify(idItems))
            }
        })
    })
} 

// КОРЗИНА
// корзина
// видалення товару 
const deleteProducts = (productParent) => {
    let id = productParent.dataset.id
    // document.querySelector(`.goods-item[data-id="${id}"]`).disabled = false
    // для товарів, що повторюються
    if (id === "12" || id === "0") {
        document.querySelectorAll(`.goods-item[data-id="${id}"]`).forEach(el => {
            el.querySelector('.goods-item--box').classList.remove('check')
        })
    } else {
        document.querySelector(`.goods-item[data-id="${id}"]`).querySelector('.goods-item--box').classList.remove('check')
    }
    //
    // якщо всі товари мають унікальні id
    // document.querySelector(`.goods-item[data-id="${id}"]`).querySelector('.goods-item--box').classList.remove('check')
    
    productParent.remove()
    // отримуємо дані id
    let getId = localStorage.getItem('id')
    // переводимо їх у масив
    let IdList = JSON.parse(getId)
    // видаляємо дані з localStorage
    localStorage.removeItem('id')
    // знаходимо індекс видаленого з корзини товару
    let indexIdList = IdList.indexOf(parseInt(id))
    // видаляємо його з масиву
    IdList.splice(indexIdList,1)
    // завантажуємо в localStorage новий масив
    localStorage.setItem('id', JSON.stringify(IdList))
    // console.log(IdList)
    calcPrice()
    printQuantity()
    updateStorage()
}

const basket = () => {
    // якщо натиснути на хрестик - видалити товар
    popapGoods.addEventListener('click', (e) => {
        if (e.target.classList.contains('popap-goods--close')) {
            deleteProducts(e.target.closest('.popap-goods--item'))
        } 
    }) 
}

// додавання к-сті товару
const plus = (count) => {
    count.textContent = ++count.textContent
}

// відінмання к-сті товару
const minus = (count) => {
    if (parseInt(count.textContent) > 1) {
        count.textContent = --count.textContent
    }
}

// розрахунок загальної вартості 
const calcPrice = () => {
    cartItems = document.querySelectorAll('.popap-goods--item')
    let totalPrice = 0
    cartItems.forEach((item) => {
        let count = item.querySelector('.popap-goods--count_num')
        let price = item.querySelector('.popap-price')
        let currentPrice = parseInt(count.textContent) * parseInt(price.textContent)
        totalPrice += currentPrice
    })

    fullSum = document.querySelector('.total-sum')
    fullSum.textContent = totalPrice
} 

// SERVER
// JSON ФАЙЛИ
async function getStars() {
    let response1 =  await fetch('assets/json/shampoo.json')
    let content1 = await response1.json()

    let response2 =  await fetch('assets/json/news.json')
    let content2 = await response2.json()

    let list = document.querySelector('.anvi-left--goods')

    list.innerHTML += `
        <div data-id="12" class="goods-item border">
            <img src=${content2[1].url} alt="soap" class="goods-item--img">
            <h4 class="goods-item--title top">${content2[1].title}</h4>
            <p class="goods-item--text top">${content2[1].description}</p>
            <p class="goods-item--price"><span class="price">${content2[1].price}</span> <span>грн.</span></p>
            <svg class="plus top">
                <use data-number="12" xlink:href="assets/img/sprite/symbol/sprite.svg#PlusCircle" class="goods-item--box"></use>
            </svg>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" id="CheckCircle" xmlns="http://www.w3.org/2000/svg" class="top">
                <path d="M40.3125 24.375L26.5547 37.5L19.6875 30.9375" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M30 52.5C42.4264 52.5 52.5 42.4264 52.5 30C52.5 17.5736 42.4264 7.5 30 7.5C17.5736 7.5 7.5 17.5736 7.5 30C7.5 42.4264 17.5736 52.5 30 52.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    ` 

    list.innerHTML += `
        <div data-id="0" class="goods-item">
            <img src=${content1[0].url} alt="soap" class="goods-item--img">
            <h4 class="goods-item--title top">${content1[0].title}</h4>
            <p class="goods-item--text top">${content1[0].description}</p>
            <p class="goods-item--price"><span class="price">${content1[0].price}</span> <span>грн.</span></p>
            <svg class="plus top">
                <use data-number="0" xlink:href="assets/img/sprite/symbol/sprite.svg#PlusCircle" class="goods-item--box"></use>
            </svg>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" id="CheckCircle" xmlns="http://www.w3.org/2000/svg" class="check top">
                <path d="M40.3125 24.375L26.5547 37.5L19.6875 30.9375" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M30 52.5C42.4264 52.5 52.5 42.4264 52.5 30C52.5 17.5736 42.4264 7.5 30 7.5C17.5736 7.5 7.5 17.5736 7.5 30C7.5 42.4264 17.5736 52.5 30 52.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    `
}

async function getShampoo() {
    let response =  await fetch('assets/json/shampoo.json')
    let content = await response.json()

    let list = document.querySelector('.shampoo_goods')

    for (let key in content) {
        list.innerHTML += `
        <div data-id="${content[key].id}" class="goods-item">
            <img src=${content[key].url} alt="soap" class="goods-item--img">
            <h4 class="goods-item--title">${content[key].title}</h4>
            <p class="goods-item--text">${content[key].description}</p>
            <p class="goods-item--price"><span class="price firstPrice">${content[key].price}</span> <span>грн.</span></p>
            <svg class="plus">
                <use data-number="${content[key].id}" xlink:href="assets/img/sprite/symbol/sprite.svg#PlusCircle" class="goods-item--box"></use>
            </svg>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" id="CheckCircle" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.3125 24.375L26.5547 37.5L19.6875 30.9375" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M30 52.5C42.4264 52.5 52.5 42.4264 52.5 30C52.5 17.5736 42.4264 7.5 30 7.5C17.5736 7.5 7.5 17.5736 7.5 30C7.5 42.4264 17.5736 52.5 30 52.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        `
    }
} 

async function getBalmForHair() {
    let response =  await fetch('assets/json/balm_for_hair.json')
    let content = await response.json()

    let list = document.querySelector('.balm-hair_goods')

    for (let key in content) {
        list.innerHTML += `
        <div data-id="${content[key].id}" class="goods-item">
            <img src=${content[key].url} alt="soap" class="goods-item--img">
            <h4 class="goods-item--title">${content[key].title}</h4>
            <p class="goods-item--text">${content[key].description}</p>
            <p class="goods-item--price"><span class="price firstPrice">${content[key].price}</span> <span>грн.</span></p>
            <svg class="plus">
                <use data-number="${content[key].id}" xlink:href="assets/img/sprite/symbol/sprite.svg#PlusCircle" class="goods-item--box"></use>
            </svg>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" id="CheckCircle" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.3125 24.375L26.5547 37.5L19.6875 30.9375" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M30 52.5C42.4264 52.5 52.5 42.4264 52.5 30C52.5 17.5736 42.4264 7.5 30 7.5C17.5736 7.5 7.5 17.5736 7.5 30C7.5 42.4264 17.5736 52.5 30 52.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        `
    }
} 

async function getDeodorant() {
    let response =  await fetch('assets/json/deodorant.json')
    let content = await response.json()

    let list = document.querySelector('.deodorant_goods')

    for (let key in content) {
        list.innerHTML += `
        <div data-id="${content[key].id}" class="goods-item">
            <img src=${content[key].url} alt="soap" class="goods-item--img">
            <h4 class="goods-item--title">${content[key].title}</h4>
            <p class="goods-item--text">${content[key].description}</p>
            <p class="goods-item--price"><span class="price firstPrice">${content[key].price}</span> <span>грн.</span></p>
            <svg class="plus">
                <use data-number="${content[key].id}" xlink:href="assets/img/sprite/symbol/sprite.svg#PlusCircle" class="goods-item--box"></use>
            </svg>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" id="CheckCircle" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.3125 24.375L26.5547 37.5L19.6875 30.9375" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M30 52.5C42.4264 52.5 52.5 42.4264 52.5 30C52.5 17.5736 42.4264 7.5 30 7.5C17.5736 7.5 7.5 17.5736 7.5 30C7.5 42.4264 17.5736 52.5 30 52.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        `
    }
} 

async function getBalmForLips() {
    let response =  await fetch('assets/json/balm_for_lips.json')
    let content = await response.json()

    let list = document.querySelector('.balm-lips_goods')

    for (let key in content) {
        list.innerHTML += `
        <div data-id="${content[key].id}" class="goods-item">
            <img src=${content[key].url} alt="soap" class="goods-item--img">
            <h4 class="goods-item--title">${content[key].title}</h4>
            <p class="goods-item--text">${content[key].description}</p>
            <p class="goods-item--price"><span class="price firstPrice">${content[key].price}</span> <span>грн.</span></p>
            <svg class="plus">
                <use data-number="${content[key].id}" xlink:href="assets/img/sprite/symbol/sprite.svg#PlusCircle" class="goods-item--box"></use>
            </svg>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" id="CheckCircle" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.3125 24.375L26.5547 37.5L19.6875 30.9375" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M30 52.5C42.4264 52.5 52.5 42.4264 52.5 30C52.5 17.5736 42.4264 7.5 30 7.5C17.5736 7.5 7.5 17.5736 7.5 30C7.5 42.4264 17.5736 52.5 30 52.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        `
    }
} 

async function getNews() {
    let response =  await fetch('assets/json/news.json')
    let content = await response.json()

    let list = document.querySelector('.news-goods')

    for (let key in content) {
        list.innerHTML += `
        <div data-id="${content[key].id}" class="goods-item">
            <img src=${content[key].url} alt="soap" class="goods-item--img">
            <h4 class="goods-item--title">${content[key].title}</h4>
            <p class="goods-item--text">${content[key].description}</p>
            <p class="goods-item--price"><span class="price firstPrice">${content[key].price}</span> <span>грн.</span></p>
            <svg class="plus">
                <use data-number="${content[key].id}" xlink:href="assets/img/sprite/symbol/sprite.svg#PlusCircle" class="goods-item--box"></use>
            </svg>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" id="CheckCircle" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.3125 24.375L26.5547 37.5L19.6875 30.9375" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M30 52.5C42.4264 52.5 52.5 42.4264 52.5 30C52.5 17.5736 42.4264 7.5 30 7.5C17.5736 7.5 7.5 17.5736 7.5 30C7.5 42.4264 17.5736 52.5 30 52.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        `
    }
} 
 

// UPGRATE
const initialState = () => {
    if (localStorage.getItem('products') !== null) {
        popapGoods.innerHTML = localStorage.getItem('products')
        printQuantity()
        calcPrice()
        productsBtn = document.querySelectorAll('.goods-item--box')
        let getId = localStorage.getItem('id')
        let IdList = JSON.parse(getId)
        // of - вибирає за значенням, не за індексом
        for (let id of IdList) {
            // для товарів, що повторюються
            if (id === 12 || id === 0) {
                document.querySelectorAll(`.goods-item[data-id="${id}"]`).forEach(el => {
                    el.querySelector('.goods-item--box').classList.add('check')
                })
            } else {
                document.querySelector(`.goods-item[data-id="${id}"]`).querySelector('.goods-item--box').classList.add('check')
            }
            //
            // якщо всі товари мають унікальні id
            // document.querySelector(`.goods-item[data-id="${key}"]`).querySelector('.goods-item--box').classList.remove('check')
        }
        if (localStorage.getItem('formData')) {
            let formData = JSON.parse(localStorage.getItem('formData'))
            document.getElementById("name").value = formData['name']
            document.getElementById("surname").value = formData['surname']
            document.getElementById("tel").value = formData['tel']
        }
    }
}

const updateStorage = () =>  {
    let parent = document.querySelector('.popap-goods')
    let html = parent.innerHTML
    html = html.trim()
    if (html.length) {
        localStorage.setItem('products', html)
    } else {
        localStorage.removeItem('products')
    }
}
 

// sendProducts
// перевірка (валідація) форми
const validation = (form) => {
    let result = true

    const removeError = (input) => {
        if (input.classList.contains('error')) {
            let parent = input.closest('.popapOrder-form--check')
            let errorLabel = parent.querySelector('.error-label')
            input.classList.remove('error')
            errorLabel.remove()
        }
    }

    const createError = (input, text) => {
        // отримати найближчого батьківського елемента
        let parent = input.closest('.popapOrder-form--check')
        let errorLabel = document.createElement('label')

        errorLabel.classList.add('error-label')
        errorLabel.textContent = text
        input.classList.add('error')
        parent.append(errorLabel)

    }

    form.querySelectorAll('input').forEach(input => {
        removeError(input)
        // якщо поля не заповнені
        if (input.value == "") {
            createError(input, "Поле не заповнено")
            result = false
        }

        // перевірка поля - номера телефону на числа
        if (input.type == "tel") {
            let number = input.value.trim()
            // перенвірка ввведення номеру телефону
            // допускається, що на початку ставиться +
            const phonePattern = /^\+?\d+$/
            if (phonePattern.test(number)) {} else {
                createError(input, "Невірно внесені дані, вводити числа від 0 до 9")
                result = false
            }
        }

        if (input.type == "text") {
            let text = input.value.trim()
            // перевірка на числа
            const numberPattern = /\d/
            if (numberPattern.test(text)) {
                createError(input, "Невірно внесені дані, ім'я та прізвище не може містити літери")
                result = false
            }
        }
    })

    return result
    // console.log(form)
}

// відправка даних з корзини та форми
async function sendProducts() {
    document.querySelector('.popapOrder-form').addEventListener('submit', (e) => {
        var text = ''
        // зупинити перехід на іншу сторінку
        e.preventDefault()
        // перевірка форми
        if (validation(e.target)) {
            // знаходимо елементи в корзині
            let productOrder = []
            cartItems = document.querySelectorAll('.popap-goods--item')
            cartItems.forEach(el => {
                // додаємо замовнику необхідні дані
                let ob = {}
                ob.id = el.dataset.id
                ob.title = el.querySelector('.popap-goods--title').textContent
                ob.numbers = el.querySelector('.popap-goods--count_num').textContent
                productOrder.push(ob)
            })
            fullSum = document.querySelector('.total-sum')
            // передаємо, все що зберігається в формі
            let self = e.currentTarget
            let formData = new FormData(self)
            // додаємо дані з корзини
            formData.append('price', fullSum.textContent)
            // перетворюємо formData в звичайний js Об'єкт
            // робимо реструктиризацію даних
            // витягуємо дані з словників як змінні
            const {name, surname, tel, price} = Object.fromEntries(formData.entries())
            // текст повідомлення
            text += `<b>Ім'я</b> ${name}\n<b>Прізвище</b> ${surname}\n<b>Телефон</b> ${tel}\n`
            // додаємо товари
            productOrder.forEach(product => {
                let id = product.id;
                let title = product.title;
                let numbers = product.numbers;
                text += `<b>Код </b> ${id} <b>Назва товару </b> ${title} <b>К-сть </b> ${numbers}\n`
            }) 
            text += `<b>Сума замовлення </b> ${fullSum.textContent} грн`
            try {
                // post - запит
                let response = fetch(API, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id,
                        text,
                        parse_mode: "HTML"
                    })
                })
                
                if (response.ok) {
                    console.log('Відправлено')
                    self.reset()
                } 
                else {
                    throw new Error(response.statusText)
                }
            } 
            catch (error) {
                // console.error(error)
            }
            // видаляємо поля
            document.getElementById("name").value = "";
            document.getElementById("surname").value = "";
            document.getElementById("tel").value = "";
            // закриваємо попап
            popapOrder.classList.remove('active')
            popapOrderContent.classList.remove('active')
            // відкриваємо попап подяки
            popapThanks.classList.add('active')
            popapThanksContent.classList.add('active')
            // очищуємо корзину
            cartItems.forEach(el => {
                el.remove()
            })
            printQuantity()

            let getId = localStorage.getItem('id')
            let IdList = JSON.parse(getId)
            // of - вибирає за значенням, не за індексом
            for (let id of IdList) {
                // для товарів, що повторюються
                if (id === 12 || id === 0) {
                    document.querySelectorAll(`.goods-item[data-id="${id}"]`).forEach(el => {
                        el.querySelector('.goods-item--box').classList.remove('check')
                    })
                } else {
                    document.querySelector(`.goods-item[data-id="${id}"]`).querySelector('.goods-item--box').classList.remove('check')
                }
                //
                // якщо всі товари мають унікальні id
                // document.querySelector(`.goods-item[data-id="${key}"]`).querySelector('.goods-item--box').classList.remove('check')
            }
            localStorage.removeItem('id')
            localStorage.removeItem('products')
            localStorage.removeItem('formData')
        }
    })
}
 

// saveProducts
const saveProducts = () => {
    // коли дані вводяться у форму
    document.querySelector('.popapOrder-form').addEventListener('input', () => {
        let saveData = {
            name: document.getElementById("name").value,
            surname: document.getElementById("surname").value,
            tel: document.getElementById("tel").value,
        }
    
        localStorage.setItem("formData", JSON.stringify(saveData))
    })
} 

// встановити порядок загрузки функцій 
// якщо є async function
async function order() {
    try {
        // Перед async function ставити await (функції для json)
        await getStars()
        await getShampoo()
        await getBalmForHair()
        await getDeodorant()
        await getBalmForLips()
        await getNews()
        Check()
        basket()
        links()
        answers()
        downList()
        saveProducts()
        await sendProducts()
        popapFuction(quantity)
        initialState()
        
    } catch (error) {
        // console.error('Ошибка загрузки JSON-файла:', error);
    }
} 

order()