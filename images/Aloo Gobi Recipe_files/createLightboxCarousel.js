(function(Mntl) {
    let prevImage;
    let nextImage;
    let captionText;
    const _lightbox = (function makeLightBox() { // Add a lightbox blank to the page and return references to its components
        const div = Mntl.domUtilities.createEl({
            type: 'DIV',
            props: { // eslint-disable-line quote-props
                className: 'mntl-lightbox is-closed',
                id: 'mntl-lightbox',
                'data-tracking-container': true
            },
            children: [{
                type: 'BUTTON',
                props: {
                    className: 'mntl-lightbox__prev-arrow is-hidden',
                    id: 'mntl-lightbox__prev-arrow'
                },
                children: []
            }, {
                type: 'DIV',
                props: { class: 'mntl-lightbox__container' },
                children: [{
                    type: 'DIV',
                    props: { class: 'mntl-lightbox__img-container' },
                    children: [{
                        type: 'IMG',
                        props: { className: 'mntl-lightbox__img' },
                        children: []
                    }]
                }, {
                    type: 'DIV',
                    props: { className: 'mntl-lightbox__caption' },
                    children: []
                }]
            }, {
                type: 'BUTTON',
                props: {
                    className: 'mntl-lightbox__next-arrow is-hidden',
                    id: 'mntl-lightbox__next-arrow'
                },
                children: []
            }, {
                type: 'BUTTON',
                props: {
                    className: 'mntl-lightbox__close',
                    id: 'mntl-lightbox__close'
                },
                children: []
            }, {
                type: 'DIV',
                props: { className: 'mntl-lightbox__loader' },
                children: [
                    {
                        type: 'SPAN',
                        props: {},
                        children: []
                    },
                    {
                        type: 'SPAN',
                        props: {},
                        children: []
                    },
                    {
                        type: 'SPAN',
                        props: {},
                        children: []
                    }
                ]
            }]
        });

        const arrowSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const SVGUseTag = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        const img = div.getElementsByClassName('mntl-lightbox__img')[0];
        const loader = div.getElementsByClassName('mntl-lightbox__loader')[0];
        const close = div.getElementsByClassName('mntl-lightbox__close')[0];
        const nextArrow = div.getElementsByClassName('mntl-lightbox__next-arrow')[0];
        const prevArrow = div.getElementsByClassName('mntl-lightbox__prev-arrow')[0];
        const imgContainer = div.getElementsByClassName('mntl-lightbox__img-container')[0];

        SVGUseTag.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#light-box-arrow');
        arrowSVG.setAttribute('class', 'icon light-box-arrow');
        arrowSVG.appendChild(SVGUseTag);

        function closeLightBox() {
            div.classList.add('is-closed');
        }

        function changeCarouselImage(carouselImg) {
            if (carouselImg) {
                changeLightboxImage(carouselImg.querySelector('[data-img-lightbox]')); // eslint-disable-line no-use-before-define
            }
        }

        close.addEventListener('click', closeLightBox);
        imgContainer.addEventListener('click', closeLightBox);
        nextArrow.addEventListener('click', () => changeCarouselImage(nextImage));
        prevArrow.addEventListener('click', () => changeCarouselImage(prevImage));

        img.onload = function() {
            loader.classList.add('is-hidden');
            _lightbox.caption.innerHTML = captionText;
        };

        document.addEventListener('keyup', Mntl.throttle((event) => {
            switch (event.keyCode) {
                case 27:
                    closeLightBox();
                    break;
                case 37:
                    changeCarouselImage(prevImage);
                    break;
                case 39:
                    changeCarouselImage(nextImage);
                    break;
                default:
                    break;
            }
        }, 50));

        document.body.appendChild(div);

        // Appends SVG
        prevArrow.appendChild(arrowSVG.cloneNode(true));
        nextArrow.appendChild(arrowSVG.cloneNode(true));

        return {
            loader,
            div,
            img,
            nextArrow,
            prevArrow,
            caption: div.getElementsByClassName('mntl-lightbox__caption')[0]
        };
    }());

    function toggleCarouselArrows(image, arrow) {
        if (image) {
            arrow.classList.remove('is-hidden');
        } else {
            arrow.classList.add('is-hidden');
        }
    }

    function changeLightboxImage(image) {
        const imageClass = 'mntl-sc-block-image';
        const imageContainer = image.closest(`.${imageClass}`);
        const lightboxSrc = image.dataset.hiResSrc || image.srcset || image.src; // get the hi-res image || largest image from srcset || get the src

        prevImage = imageContainer.previousElementSibling && imageContainer.previousElementSibling.classList.contains(imageClass) ? imageContainer.previousElementSibling : null;
        nextImage = imageContainer.nextElementSibling && imageContainer.nextElementSibling.classList.contains(imageClass) ? imageContainer.nextElementSibling : null;
        captionText = (imageContainer.querySelector('.figure-article-caption') || {innerHTML: ''}).innerHTML.trim();
        toggleCarouselArrows(prevImage, _lightbox.prevArrow);
        toggleCarouselArrows(nextImage, _lightbox.nextArrow);
        _lightbox.caption.innerHTML = '';
        _lightbox.img.src = '';
        _lightbox.loader.classList.remove('is-hidden');
        _lightbox.img.src = lightboxSrc.match(/,?\s*([^\s]+)(?:\s\d+w)?$/)[1];
    }

    function _handleLightboxClick(event) {
        if (event.target.dataset.imgLightbox === 'true') {
            changeLightboxImage(event.target);
            _lightbox.div.classList.remove('is-closed');
        }
    }

    // Listen for clicks on <img data-img-lightbox />
    document.body.addEventListener('click', _handleLightboxClick);
}(window.Mntl || {}));
