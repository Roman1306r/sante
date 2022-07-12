// !Функция проверки на каком устройстве находится пользователь в данный момент
const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i)
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i)
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPAd|iPod/i)
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i)
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i)
    },
    any: function() {
        return (isMobile.Android() ||
        isMobile.BlackBerry() ||
         isMobile.iOS() ||
         isMobile.Opera() ||
         isMobile.Windows())
    },
};



//!Меню бургер

const iconMenu = document.querySelector('.menu__icon')
const menuBody = document.querySelector('.menu__body')
if (iconMenu) {
iconMenu.onclick = function (e) {
        document.body.classList.toggle('_lock')
        iconMenu.classList.toggle('_active')
        menuBody.classList.toggle('_active')
    }
}






// !Присвоение определенных классов body в зависимости от типа устройства и навешивание клика на стрелку при тачскрине

if (isMobile.any()) {
    document.body.classList.add('_touch');
    let menuArrows = document.querySelectorAll('.menu__arrow')
    if (menuArrows.length > 0) {
        for (let index = 0; index < menuArrows.length; index++) {
            const menuArrow = menuArrows[index];
            menuArrow.addEventListener('click', (e)=> {
                menuArrow.parentElement.classList.toggle('_active');
            }) 
        }
    }
} else {
    document.body.classList.add('_pc')
}




//!Плавная прокрутка к определенным элементам при клике
const menuLinks = document.querySelectorAll('.header__link[data-goto], .map__link[data-goto]')
if(menuLinks.length > 0) {
    menuLinks.forEach((menuLink)=> {
        menuLink.addEventListener('click', onMenuLinkClick)
    })


    function onMenuLinkClick(e) {
       const menuLink = e.target;
       if(menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)){
          const gotoBlock = document.querySelector(menuLink.dataset.goto);
          const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

         if(iconMenu.classList.contains('_active')){
            document.body.classList.remove('_lock')
            iconMenu.classList.remove('_active')
            menuBody.classList.remove('_active')
         }
          window.scrollTo({
            top: gotoBlockValue,
            behavior: "smooth"
          })
          e.preventDefault()
       }
    }
}




















//!Функция переезда на новое место
function dynamicAdapt(type) {
	this.type = type;
}

dynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

dynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
dynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
dynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
dynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
dynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();








//СЛайдер
$(document).ready(function() {
    $('.slider').slick({
        arrows: true,  //Стрелким включены
        dots: false,   // точки включены
        adaptiveHeight: false,  //подстраивание точек и стрелок под каждый слайдер
        slidesToShow: 1,  //сколько слайдеров показано за раз 
        slidesToScroll: 1,  //Количество слайдов которое пролистывается при скроле
        speed: 800, //Скорость пролистывания слайдов
        easing: 'easy',  //Тип анимации при смене слайдов
        infinite: true, //Будет ли слайдер бесконечный
        initialSlide: 0, //Стартовыый слайдер
        autoplay: true,  //Будет ли он автоматически листаться
        autoplaySpeed: 5000, //Скорость автоматического листания
        pauseOnFocus: true, //пауза автопроигрывания при нажатии 
        pauseOnHover: false, //пауза автопроигрывания при наведении 
        pauseOnDotsHover: true, //пауза автопроигрывания при наведении на точки 
        draggable: true, //Можно свайпать на компе
        swipe: true, //Можно свайпать на телефоне
        touchThreshold: 5, //Какое растояние нужно просвайпить для смены слайда
        touchMove: true, //Нельзя тягать с места на место при false
        waitForAnimate: false, //Включает быстрое перелистывание при быстром нажатии на стрелки и точки
        fade: true, //Слайды не листаются а заменяются, слайд-шоу
        responsive: [  //Изменение настроек слайдера при таких то брейкпоинтов
            {
                breakpoint: 900,  //брейкпоинт max-width
                settings: {    //Настройки
                    arrows: false,  //Стрелким включены
					dots: true,   // точки включены
					pauseOnHover: true, //пауза автопроигрывания при наведении 
                }  
            }
        ],
    });
})


// Кнопка вверх

let arrowTop = document.querySelector('.arrowTop')
window.addEventListener("scroll", () => {
  arrowTop.hidden = scrollY > 400 ? false : true;
});
arrowTop.onclick = () => {
  window.scrollTo(0, 0);
};






// СКРЫТИЕ И ПОКАЗ СПОЙЛЕРА ПО КЛИКУ

$(document).ready(function(event) {
	$('.block__title').click(function(event) {
  
  // БЛОК С ТЕКСТОМ ЗАКРЫВАЕТСЯ ПРИ ОТКРЫТИИ ДРУГОГО БЛОКА
  
	  if($('.block').hasClass('openone')) {
		$('.block__title').not($(this)).removeClass('active');
		$('.block__text').not($(this).next()).slideUp(300);
	  };
  
  // ПРИ НАЖАТИИ НА ЗАГОЛОВОК ОТКРЫВАЕТСЯ ТЕКСТ ПОД НИМ
  
	  $(this).toggleClass('active').next().slideToggle(300);
	})
  })






//!! Находим все классы специльно заданные элементам для анимации
const animItems = document.querySelectorAll('.anim__items');

if(animItems.length>0) {
    window.addEventListener('scroll', animOnScroll)
    function animOnScroll () {
        for(let i = 0; i < animItems.length; i++) {
            const animItem = animItems[i];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = offSet(animItem).top;
            const animStart = 4;

            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;  
            }

            if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)){
                animItem.classList.add('active') ;
            } else {
                //!! Если у элемента есть этот класс то при возврате к нему повторно анимироваться он не будет
                if (!animItem.classList.contains('anim-no-hide')) {
                    animItem.classList.remove('active') 
                }
            }
        }
    }
    //!! Функция которая точно отслеживает скролл
    function offSet(el) {
        const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {  top: rect.top + scrollTop, left: rect.left + scrollLeft}
    }
    //!! Запускаем функции анимации с задержкой чтобы все успело прогрузится
    setTimeout(()=> {
        animOnScroll ()
    }, 1000)
}

// **************************************************************


const popupLinks = document.querySelectorAll('.popup__link')
const body = document.querySelector('body')
const lockPadding = document.querySelectorAll('.lock-padding')

let unlock = true;
const timeout = 800;

// навешиваем клик на сслылку которая будет открывать попап
if(popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener('click', function(e) {
            const popupName = popupLink.getAttribute('href').replace('#', '') 
            const currentPopup = document.getElementById(popupName)
            popupOpen(currentPopup)
            e.preventDefault()
        })
    }
}

// навешиваем клик на все кнопки которые будут закрывать попап
const popusCloseIcon = document.querySelectorAll('.close-popup')
if (popusCloseIcon.length > 0 ) {
    for (let index = 0; index < popusCloseIcon.length; index++) {
        const el = popusCloseIcon[index]
        el.addEventListener('click', function(e) {
            popupClose(el.closest('.popup'));
            e.preventDefault()
        })
    }
}

// Функция открытия попапа
function popupOpen(currentPopup) {
    if (currentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open')
        if(popupActive) {
            popupClose(popupActive, false)
        } else {
            bodyLock()
        }
        currentPopup.classList.add('open')
        currentPopup.addEventListener('click', function(e) {
            if(!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'))
            }
        })
     }
}
// Функция закрытия попапа
function popupClose(popupActive, doUnlock = true) {
    if(unlock) {
        popupActive.classList.remove('open');
        if(doUnlock) {
            bodyUnLock()
        }
    }
}


// Функция блокировки скролла
function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
        for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index]
        el.style.paddingRigth = lockPaddingValue
        }
        body.style.paddingRight = lockPaddingValue;
        body.classList.add('lock');
        unlock = false;
        setTimeout(function () {
            unlock = true
        }, timeout)
}
// Функция разблокировки скролла
function bodyUnLock() {
    setTimeout(function () {
        if (lockPadding.length > 0) {
        for(let index; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = '0px';
            }
         }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout)
    unlock = false
     setTimeout(function () {
    unlock = true
}, timeout)
}



// Закрытие попапа при нажатии на ESC
document.addEventListener('keydown', function(e) {
   if (e.which === 27) {
       const popupActive = document.querySelector('.popup.open')
       popupClose(popupActive)
   }
})












// ****************************************************************************************
//Функция отправки формы

const send = document.querySelector('.send')
function upModal(send) {
    return send.style.cssText = `
	transform: translate(-50%, 0%);	`
}
function downModal(send) {
	return send.style.cssText = `
	transform: translate(-50%, -150%);	`
}

$(document).ready(function() {
	//E-mail Ajax Send
	$("form").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "senda.php", //Change
			data: th.serialize()
		}).done(function() {
			upModal(send);
			setTimeout(function() {downModal(send)}, 3000); 
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});
});







// **************************************************
const button = document.getElementById('search__btn');
const input = document.getElementById('search');

// (function() {

//     button.addEventListener('click', (e)=> {
//         var text = input.value; // Текст, который надо найти
//         console.log(text);
//         regexp = new RegExp(text, 'i');
       
//     if (regexp.exec(document.querySelector('.montage__content').innerHTML)) {
//       // Если нашло, то выполнить это
//       var reg = new RegExp(text, 'g');
//       document.querySelector('.montage__content').innerHTML = document.querySelector('.montage__content').innerHTML.replace(reg, '<i style="color: blue; font-style:normal;">' + text + '</i>');

//       window.scrollBy({
//         top: 200,
//         behavior: 'smooth'
//     });
//     } else {
//       // Если не нашло, то выполнить это
//       console.log('Текст не найдет');
//     };
//     })
//   }());

var copy_page;
 
function FindOnPage(inputId) {
    var obj = document.getElementById(inputId),
    objValue = obj.value.replace(/^[\s\A-z\\\-=_''""\.]+|[\s\A-z\\\-=_''""\.]+$/gi, '').replace(/^[\s\A-z\\\-=_''""\.]+|[\s\A-z\\\-=_''""\.]+$/gi, '');

    if (objValue == '') { alert('Вы ничего не ввели'); return }

    if (document.location.href.indexOf('#') < 0) copy_page = document.body.innerHTML;
    else document.body.innerHTML = copy_page;

    var ttf = new RegExp(objValue.split('').join('-?'), 'g'),
    db = document.body.innerHTML,
    rz = db.match(ttf);
    if (rz == null) {
        //alert('Ничего не найдено, проверьте правильность ввода!');
        return false;
    }

    obj.value = '';
    document.location.href = document.location.href.split('#')[0] + '#' + objValue;

    var rz1 = new Array(); rz1[0] = rz[0];
    var rz_obr = new Array(); rz_obr[rz1[0]] = 1;
    if (rz.length > 1)
        for (var k = j = 1, lj = rz.length; j < lj; j++)
            if (!rz_obr[rz[j]]) { rz1[k++] = rz[j]; rz_obr[rz[j]] = 1 }

    for (j = 0, lj = rz1.length; j < lj; j++) {
        var z = (!j) ? (' id="' + objValue + '"') : '';
        document.body.innerHTML = document.body.innerHTML.replace(new RegExp(rz1[j], 'g'), '<i style="color: indigo; font-style: normal;" ' + z + '>' + rz1[j] + '</i>');
    }
    document.location.href = document.location.href.split('#')[0] + '#' + objValue;
}

  
   
  