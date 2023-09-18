(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    const dcaffeinated = document.querySelector(".dcaffeinated");
    if (dcaffeinated) {
        const banerStart = document.querySelector(".dcaffeinated-content");
        const images = document.querySelectorAll(".dcaffeinated-box");
        const banerMove = document.querySelectorAll(".dcaffeinated-box");
        const clonedItem = banerStart.cloneNode(true);
        clonedItem.classList.add("second");
        dcaffeinated.appendChild(clonedItem);
        let banerWidth = 0;
        for (let i = 0; i < images.length; i++) {
            banerWidth += +banerMove[i].getBoundingClientRect().width;
            const styles = window.getComputedStyle(banerMove[i]);
            const marginRight = parseInt(styles.marginRight, 10);
            banerWidth += marginRight;
        }
        function animationBanerText() {
            document.querySelectorAll(".dcaffeinated-box").forEach((item => {
                item.animate([ {
                    transform: "translate(0, 0)"
                }, {
                    transform: "translate(-" + `${banerWidth + 15}` + "px, 0)"
                } ], {
                    duration: 3e4,
                    iterations: 1 / 0
                });
            }));
        }
        animationBanerText();
    }
    const espreso = document.querySelector(".espreso");
    if (espreso) {
        const banerStart = document.querySelector(".espreso-content");
        const images = document.querySelectorAll(".espreso-box");
        const banerMove = document.querySelectorAll(".espreso-box");
        const clonedItem = banerStart.cloneNode(true);
        clonedItem.classList.add("second");
        espreso.appendChild(clonedItem);
        let banerWidth = 0;
        for (let i = 0; i < images.length; i++) {
            banerWidth += +banerMove[i].getBoundingClientRect().width;
            const styles = window.getComputedStyle(banerMove[i]);
            const marginRight = parseInt(styles.marginRight, 10);
            banerWidth += marginRight;
        }
        function animationBanerText() {
            document.querySelectorAll(".espreso-box").forEach((item => {
                item.animate([ {
                    transform: "translate(0, 0)"
                }, {
                    transform: "translate(-" + `${banerWidth + 40}` + "px, 0)"
                } ], {
                    duration: 3e4,
                    iterations: 1 / 0
                });
            }));
        }
        animationBanerText();
    }
    const baner = document.querySelector(".omni");
    if (baner) {
        const banerStart = document.querySelector(".omni-content");
        const images = document.querySelectorAll(".omni-box");
        const banerMove = document.querySelectorAll(".omni-box");
        const clonedItem = banerStart.cloneNode(true);
        clonedItem.classList.add("second");
        baner.appendChild(clonedItem);
        let banerWidth = 0;
        for (let i = 0; i < images.length; i++) {
            banerWidth += +banerMove[i].getBoundingClientRect().width;
            const styles = window.getComputedStyle(banerMove[i]);
            const marginRight = parseInt(styles.marginRight, 10);
            banerWidth += marginRight;
        }
        function animationBanerText() {
            document.querySelectorAll(".omni-box").forEach((item => {
                item.animate([ {
                    transform: "translate(0, 0)"
                }, {
                    transform: "translate(-" + `${banerWidth + 15}` + "px, 0)"
                } ], {
                    duration: 3e4,
                    iterations: 1 / 0
                });
            }));
        }
        animationBanerText();
    }
    const exclusive = document.querySelector(".exclusive");
    if (exclusive) {
        const banerStart = document.querySelector(".exclusive-content");
        const images = document.querySelectorAll(".exclusive-box");
        const banerMove = document.querySelectorAll(".exclusive-box");
        const clonedItem = banerStart.cloneNode(true);
        clonedItem.classList.add("second");
        exclusive.appendChild(clonedItem);
        let banerWidth = 0;
        for (let i = 0; i < images.length; i++) {
            banerWidth += +banerMove[i].getBoundingClientRect().width;
            const styles = window.getComputedStyle(banerMove[i]);
            const marginRight = parseInt(styles.marginRight, 10);
            banerWidth += marginRight;
        }
        function animationBanerText() {
            document.querySelectorAll(".exclusive-box").forEach((item => {
                item.animate([ {
                    transform: "translate(0%, 0)"
                }, {
                    transform: "translate(+" + `${banerWidth + 25}` + "px, 0)"
                } ], {
                    duration: 55e3,
                    iterations: 1 / 0
                });
            }));
        }
        animationBanerText();
    }
    window["FLS"] = true;
    isWebp();
    menuInit();
})();